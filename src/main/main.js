const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const http = require('http');
const os = require('os');

let mainWindow;
let serverAddress = '';
let sseClients = []; // Track connected SSE clients for messaging
let currentFolderPath = ''; // Track the path of the last dropped folder
let lastFolderState = null; // Track the last folder broadcast state (name and file list)
let folderWatcher = null; // Track the active fs.watcher instance

async function isBinaryFile(filePath) {
  try {
    const handle = await fs.open(filePath, 'r');
    const { buffer } = await handle.read(Buffer.alloc(512), 0, 512, 0);
    await handle.close();
    for (let i = 0; i < buffer.length; i++) {
      if (buffer[i] === 0) return true; // Null byte indicates binary
    }
    return false;
  } catch (err) {
    return false;
  }
}

async function getFilteredSortedFiles(folderPath) {
  const filenames = await fs.readdir(folderPath);
  
  const filesWithStats = await Promise.all(
    filenames.map(async (name) => {
      // 1. Skip hidden files (starting with .)
      if (name.startsWith('.')) return null;
      
      // 2. Skip .exe files
      if (name.toLowerCase().endsWith('.exe')) return null;

      const filePath = path.join(folderPath, name);
      try {
        const stats = await fs.stat(filePath);
        if (!stats.isFile()) return null;

        // Binary check removed - allowing all files (including images)
        
        return { name, mtime: stats.mtimeMs };
      } catch (e) {
        return null;
      }
    })
  );

  return filesWithStats
    .filter(f => f !== null)
    .sort((a, b) => b.mtime - a.mtime)
    .map(f => f.name);
}

async function refreshCurrentFolder() {
  if (!currentFolderPath) return;

  try {
    const sortedFiles = await getFilteredSortedFiles(currentFolderPath);
    const folderName = path.basename(currentFolderPath);
    
    const payload = {
      message: `Folder refreshed: ${folderName}`,
      folderName: folderName,
      files: sortedFiles
    };

    // Update state
    lastFolderState = {
      folderName: folderName,
      files: sortedFiles
    };

    // Broadcast to SSE clients
    console.log(`Broadcasting refresh to clients for: ${folderName}`);
    sseClients.forEach(client => {
      client.write(`data: ${JSON.stringify(payload)}\n\n`);
    });

    // Notify local renderer
    if (mainWindow) {
      mainWindow.webContents.send('update-folder-ui', payload);
    }
  } catch (error) {
    console.error('Error refreshing folder:', error);
  }
}

function startWatching(folderPath) {
  if (folderWatcher) {
    folderWatcher.close();
  }

  try {
    const fsSync = require('fs');
    folderWatcher = fsSync.watch(folderPath, { recursive: false }, (eventType, filename) => {
      console.log(`File change detected: ${eventType} on ${filename}`);
      refreshCurrentFolder();
    });
    console.log(`Started watching: ${folderPath}`);
  } catch (error) {
    console.error('Error starting watcher:', error);
  }
}

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

async function startLocalServer() {
  const server = http.createServer(async (req, res) => {
    // Handle Server-Sent Events for messaging
    if (req.url === '/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
      res.write('\n');
      sseClients.push(res);
      req.on('close', () => {
        sseClients = sseClients.filter(client => client !== res);
      });
      return;
    }

    // Endpoint for clients to request file content
    if (req.url.startsWith('/read-file')) {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const filename = url.searchParams.get('filename');
      
      if (!filename || !currentFolderPath) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Missing filename or no folder active' }));
        return;
      }

      const filePath = path.join(currentFolderPath, filename);
      
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, filename, content }));
      } catch (err) {
        console.error('Error reading file:', err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Could not read file' }));
      }
      return;
    }

    // New endpoint to get the current folder state
    if (req.url === '/current-folder') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(lastFolderState || { folderName: null, files: [] }));
      return;
    }

    try {
      // Serve files from the 'client' directory for LAN users
      const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
      let urlPath = parsedUrl.pathname === '/' ? 'index.html' : parsedUrl.pathname;
      
      // Strip leading slash if present for path.join compatibility
      if (urlPath.startsWith('/')) {
        urlPath = urlPath.substring(1);
      }
      
      const filePath = path.join(__dirname, '../client', urlPath);
      console.log(`Serving client file: ${filePath}`);
      
      const content = await fs.readFile(filePath);
      
      const ext = path.extname(filePath);
      const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css'
      }[ext] || 'text/plain';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    } catch (err) {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  server.listen(0, '0.0.0.0', () => {
    const port = server.address().port;
    const ip = getLocalIp();
    serverAddress = `http://${ip}:${port}`;
    console.log(`Local server running at: ${serverAddress}`);
    if (mainWindow) {
      mainWindow.webContents.send('server-info', serverAddress);
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.webContents.on('did-finish-load', () => {
    if (serverAddress) {
      mainWindow.webContents.send('server-info', serverAddress);
    }
  });

  const menuTemplate = [
    {
      label: 'App',
      submenu: [
        {
          label: 'Home',
          click: () => {
            mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
          }
        },
        {
          label: 'Messaging',
          click: () => {
            mainWindow.loadFile(path.join(__dirname, '../renderer/messaging.html'));
          }
        },
        { type: 'separator' },
        {
          label: 'Connected',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Status',
              message: 'The application is currently connected.',
            });
          },
        },
        {
          label: 'Rescan',
          click: () => {
            mainWindow.webContents.send('rescan-triggered');
          },
        },
        { type: 'separator' },
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About My Special App',
              message: 'My Special App v1.0.0\nCreated with Gemini CLI.',
            });
          },
        },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // IPC listeners
  ipcMain.on('ping', () => {
    mainWindow.webContents.send('pong', 'Hello from the main process!');
  });

  ipcMain.handle('read-directory', async (event, folderPath) => {
    try {
      const sortedFiles = await getFilteredSortedFiles(folderPath);
      return { success: true, files: sortedFiles };
    } catch (error) {
      console.error('Error reading directory:', error);
      return { success: false, error: error.message };
    }
  });

  // Handle messaging to clients
  ipcMain.on('send-to-clients', (event, data) => {
    console.log(`Broadcasting to clients:`, data);
    const payload = typeof data === 'string' ? { message: data } : data;
    
    // Store folder state for new clients
    if (payload.folderName && payload.files) {
      lastFolderState = {
        folderName: payload.folderName,
        files: payload.files
      };
    }

    sseClients.forEach(client => {
      client.write(`data: ${JSON.stringify(payload)}\n\n`);
    });
  });

  // Track the current folder path when updated from renderer
  ipcMain.on('set-current-folder', (event, path) => {
    console.log(`Current folder set to: ${path}`);
    currentFolderPath = path;
    startWatching(path);
  });
}

app.whenReady().then(() => {
  startLocalServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

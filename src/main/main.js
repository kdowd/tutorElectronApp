const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const http = require('http');
const os = require('os');

let mainWindow;
let serverAddress = '';
let sseClients = []; // Track connected SSE clients for messaging

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

    try {
      // Serve files from the 'client' directory for LAN users
      let urlPath = req.url === '/' ? 'index.html' : req.url;
      let filePath = path.join(__dirname, '../client', urlPath);
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
      const files = await fs.readdir(folderPath);
      return { success: true, files };
    } catch (error) {
      console.error('Error reading directory:', error);
      return { success: false, error: error.message };
    }
  });

  // Handle messaging to clients
  ipcMain.on('send-to-clients', (event, message) => {
    console.log(`Broadcasting to clients: ${message}`);
    sseClients.forEach(client => {
      client.write(`data: ${JSON.stringify({ message })}\n\n`);
    });
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

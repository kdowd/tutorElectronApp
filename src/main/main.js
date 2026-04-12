const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const http = require('http');
const os = require('os');

let mainWindow;
let serverAddress = '';

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

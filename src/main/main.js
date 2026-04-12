const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  // Define the custom menu
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
            console.log('Rescan triggered from menu');
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

  // Example IPC listener
  ipcMain.on('ping', () => {
    console.log('Received ping from renderer');
    mainWindow.webContents.send('pong', 'Hello from the main process!');
  });

  // Listener to read directory contents
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
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

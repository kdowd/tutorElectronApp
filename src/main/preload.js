const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => ipcRenderer.send('ping'),
  onPong: (callback) => ipcRenderer.on('pong', (_event, value) => callback(value)),
  onRescan: (callback) => ipcRenderer.on('rescan-triggered', () => callback()),
  readDirectory: (path) => ipcRenderer.invoke('read-directory', path),
  getPathForFile: (file) => webUtils.getPathForFile(file),
  onServerInfo: (callback) => ipcRenderer.on('server-info', (_event, value) => callback(value)),
  sendToClients: (message) => ipcRenderer.send('send-to-clients', message),
  setCurrentFolder: (path) => ipcRenderer.send('set-current-folder', path),
  onUpdateFolderUI: (callback) => ipcRenderer.on('update-folder-ui', (_event, value) => callback(value)),
});


// gemini --resume 02b5ef48-d8a5-45c6-91bc-dc1b181197c6  
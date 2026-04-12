# Project Overview: myspecialapp

`myspecialapp` is an Electron-based application developed with a clear separation between the main process, preload scripts, and the renderer process. It uses `electron-builder` for packaging and distribution.

## Technologies
- **Framework:** [Electron](https://www.electronjs.org/) (v34.2.0)
- **Runtime:** Node.js
- **Frontend:** Vanilla HTML, CSS, and JavaScript
- **Build Tool:** `electron-builder`

## Architecture
- **Main Process (`src/main/main.js`):** Manages the application lifecycle, creates browser windows, and handles native system interactions (menus, dialogs, and directory reading).
- **Preload Script (`src/main/preload.js`):** Securely exposes Electron APIs, including `ipcRenderer` and `webUtils.getPathForFile`, to the renderer process.
- **Renderer Process (`src/renderer/`):** Contains the user interface (HTML/CSS) and frontend logic (`renderer.js`), including drag-and-drop event handling.

## Features
- **Drag-and-Drop Folder Support:** Users can drop a folder onto the application to view a list of its immediate files.

## Building and Running

### Development
To start the application in development mode:
```bash
npm start
```

### Production Build
To package the application for production (using `electron-builder`):
```bash
npm run dist
```

### Testing
- **TODO:** No automated test suite is currently configured in `package.json`.

## Development Conventions

### IPC Communication
- Communication between the renderer and main process must go through the `preload.js` script using `contextBridge`.
- **Directory Reading:** Use the `read-directory` IPC handle to retrieve file lists from the main process.
- **File Paths:** Use `window.electronAPI.getPathForFile(file)` in the renderer to securely retrieve paths from dropped files/folders, as the `.path` property is restricted in modern Electron versions.
- Avoid enabling `nodeIntegration` in the renderer for security reasons.
- Main process listeners should be defined in `src/main/main.js` using `ipcMain`.

### Directory Structure
- `src/main/`: Core application logic and Electron main process.
- `src/renderer/`: All frontend assets, including HTML, CSS, and client-side JavaScript.
- `dist/`: Output directory for production builds (ignored by version control).

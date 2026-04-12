# Project Overview: myspecialapp

`myspecialapp` is an Electron-based application developed with a clear separation between the main process, preload scripts, the renderer process, and a separate client interface for LAN users. It uses `electron-builder` for packaging and distribution.

## Technologies
- **Framework:** [Electron](https://www.electronjs.org/) (v34.2.0)
- **Runtime:** Node.js
- **Frontend:** Vanilla HTML, CSS, and JavaScript
- **Build Tool:** `electron-builder`
- **Modules:** `http` (local server), `os` (IP detection), `fs` (file operations)

## Architecture
- **Main Process (`src/main/main.js`):** Manages the application lifecycle, creates browser windows, handles native system interactions (menus, dialogs), and hosts a local HTTP server for LAN clients.
- **Preload Script (`src/main/preload.js`):** Securely exposes Electron APIs, including `ipcRenderer`, `webUtils.getPathForFile`, and server status listeners, to the renderer process.
- **Renderer Process (`src/renderer/`):** Contains the primary application UI and frontend logic, including drag-and-drop handling and server status display.
- **Client Interface (`src/client/`):** A simplified web interface served to other devices on the local network (LAN) via the internal HTTP server.

## Features
- **Local Network Server:** Automatically starts an HTTP server on the local machine's IPv4 address, allowing other devices on the same network to connect.
- **Drag-and-Drop Folder Support:** Users can drop a folder onto the main application window to view its contents (immediate files).
- **Client/Renderer Separation:** Provides a full-featured interface for the local user and a separate, orange-background "Hello World" page for remote LAN clients.

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
- **Server Information:** Use the `onServerInfo` listener to receive the local shareable URL from the main process.
- **File Paths:** Use `window.electronAPI.getPathForFile(file)` in the renderer to securely retrieve paths from dropped files/folders.
- Avoid enabling `nodeIntegration` in the renderer for security reasons.

### Directory Structure
- `src/main/`: Core application logic, Electron main process, and HTTP server.
- `src/renderer/`: Local frontend assets (HTML, CSS, JS) for the Electron window.
- `src/client/`: Public-facing assets (HTML) for LAN clients connecting via a web browser.
- `dist/`: Output directory for production builds (ignored by version control).

# Project Overview: myspecialapp

`myspecialapp` is an Electron-based application developed with a clear separation between the main process, preload scripts, the renderer process, and a separate client interface for LAN users. It uses `electron-builder` for packaging and distribution.

## Technologies
- **Framework:** [Electron](https://www.electronjs.org/) (v34.2.0)
- **Runtime:** Node.js
- **Frontend:** Vanilla HTML, CSS, and JavaScript
- **Build Tool:** `electron-builder`
- **Modules:** `http` (local server & SSE), `os` (IP detection), `fs` (file operations)

## Architecture
- **Main Process (`src/main/main.js`):** Manages the application lifecycle, handles native menus, and hosts a local HTTP server. It implements a **Server-Sent Events (SSE)** endpoint (`/events`) to broadcast real-time messages to LAN clients.
- **Preload Script (`src/main/preload.js`):** Securely exposes Electron APIs, including `ipcRenderer`, `webUtils.getPathForFile`, and the `sendToClients` messaging bridge.
- **Renderer Process (`src/renderer/`):** Contains the primary application UI, including the Home view (drag-and-drop) and the Messaging view (global broadcasts).
- **Client Interface (`src/client/`):** A simplified web interface served to LAN devices. It uses `EventSource` to listen for real-time messages from the Electron host.

## Features
- **Local Network Server:** Automatically starts an HTTP server on the local machine's IPv4 address.
- **Real-Time Messaging:** Broadcasts custom text messages from the Electron app's messaging view to all connected LAN clients using SSE.
- **Drag-and-Drop Folder Support:** View contents of local folders dropped onto the application and automatically broadcast the folder's name to all connected LAN clients.
- **Client/Renderer Separation:** Distinct interfaces for the local administrator (Electron) and remote LAN viewers (Web Browser).

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
- **Messaging:** Use the `send-to-clients` IPC channel to trigger a broadcast from the main process to all SSE-connected clients.
- **Directory Reading:** Use the `read-directory` IPC handle to retrieve file lists from the main process.
- **Server Information:** Use the `onServerInfo` listener to receive the local shareable URL.
- **File Paths:** Use `window.electronAPI.getPathForFile(file)` for secure path retrieval from dropped files.

### Directory Structure
- `src/main/`: Core logic, Electron main process, and SSE server.
- `src/renderer/`: Frontend assets for the local Electron application.
    - `index.html`/`renderer.js`: Home view (drag-and-drop).
    - `messaging.html`/`messaging.js`: Messaging view.
- `src/client/`: Public-facing assets for LAN clients.
- `dist/`: Output directory for production builds.

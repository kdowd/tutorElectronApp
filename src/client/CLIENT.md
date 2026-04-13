# Client Interface: myspecialapp

This directory contains the public-facing web interface served to LAN users via the Electron application's internal HTTP server.

## Current State
- **Appearance:** A two-column layout. The left column shows the active folder and its file list; the right column displays broadcast messages and file contents.
- **Messaging:** Uses `EventSource` to listen for real-time broadcasts from the server at the `/events` endpoint.
- **Interaction:** Read-only for broadcasts, but interactive for files. Clicking a filename in the left column fetches its content from the host via `/read-file` and displays it in the right column.

## Technical Details
- **Served from:** `src/client/`
- `/events`: Real-time Server-Sent Events endpoint.
- `/read-file`: API for retrieving file content.
- **Dependencies:** None (Vanilla HTML/JS/CSS).

## To-Do / Future Goals
- [x] Improve UI/UX of the client page (Two-column layout).
- [x] Display folder contents sent from the host.
- [x] Add client-to-server communication (File content requests).
- [ ] Add support for non-text file types (images, PDFs).

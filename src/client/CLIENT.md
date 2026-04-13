# Client Interface: myspecialapp

This directory contains the public-facing web interface served to LAN users via the Electron application's internal HTTP server.

## Current State
- **Appearance:** A two-column layout with a purple left sidebar and a dark right panel for messages.
- **Messaging:** Uses `EventSource` to listen for real-time broadcasts from the server at the `/events` endpoint.
- **Interaction:** Currently read-only; the right column flashes gold when a new message is received, and the left column displays folder contents when a folder is dropped on the host app.

## Technical Details
- **Served from:** `src/client/`
- **Real-time Endpoint:** `/events` (Server-Sent Events)
- **Dependencies:** None (Vanilla HTML/JS/CSS).

## To-Do / Future Goals
- [ ] Improve UI/UX of the client page.
- [ ] Add client-to-server communication (if needed).
- [x] Display folder contents sent from the host.

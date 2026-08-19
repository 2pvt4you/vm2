# Varaha Metaliks Applet Build Log

This document records the build configuration, execution commands, and verified states of the Varaha Metaliks application workspace.

## System Verification

- **Node.js Environment:** Verified Node 20+ runtime.
- **Vite Configuration:** Custom port set to `3000` with host `0.0.0.0` for container reverse-proxy compatibility.
- **Express Server integration:** Dev proxy active on port `3001` mapping `/api` requests without CORS issues.
- **PostgreSQL Connection pool:** Integrated with error recovery and fallback logger when Database URLs are missing or inactive in regional preview sandboxes.

## Run/Dev Targets

- `npm run dev`: Runs local Vite SPA development client at `http://0.0.0.0:3000`.
- `npm run dev:server`: Serves live-reloaded API endpoints at `http://localhost:3001` via `tsx`.
- `npm run build`: Bundles Production files into `/dist`.
- `npm start`: Serves Express API and compiles frontend static assets under production variables.

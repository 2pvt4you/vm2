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

## Final Design Pass — One Continuous Cinematic Film (2026-09-13)

- Master palette rebuilt: Deep Navy #071A2F / Secondary Navy #0B233D / Steel Navy #163A58 / Warm Ivory #F4F1EA / Mineral #E7E4DC / Metallic Grey #8B959D / Champagne Gold #C7A66A.
- Hero film (335-frame scrub, 420vh) re-directed: all major statements travel LEFT → RIGHT across the upper half (enter → hold → exit); beats: Families → 7,200 MT → Moulding Facilities → "Fire, Poured Into Form" over the pour; left/right info blocks with fine rules; molten flash outro.
- About rebuilt as navy Foundry chapter: molten-seam clip reveal from the hero flash, documentary image beats, stats, BIS card, archive gallery, vision/mission.
- Products: navy → ivory portal threshold ("light falls on the object"), 3-column architectural showroom (information / 3D object / catalogue index), weighted product switching (soft exit → scale/camera settle), champagne-rimmed lighting + navy grounding shadow.
- Clients: two opposing seamless ticker lanes over navy with sector metadata and product→network bridge.
- Approvals: mineral trust chapter — certification band, testing chips, geographic state index with arrow rules, "11" numeric object.
- Contact resolves navy → steel → mineral; footer integrated as deep-navy editorial close.
- Home story order: Hero → About(Foundry) → Products → Clients → Approvals → Contact.

# Varaha Metaliks

Marketing site for **Varaha Metaliks Pvt. Ltd** — ferrous metal castings, ductile iron fittings, and manhole covers.

## Stack

- **Frontend:** React + Vite + Tailwind
- **Backend:** Express (`POST /api/contact`, `GET /api/brochure/download`)
- **Database:** PostgreSQL (inquiries and brochure_downloads tables)
- **Deploy:** Railway (`varahametaliks.com`)

## Local development

```bash
npm install
cp .env.example .env
# Set DATABASE_URL to your local or Railway Postgres
```

Run API + frontend in two terminals:

```bash
npm run dev:server   # API on :3001
npm run dev          # Vite on :3000 (proxies /api → :3001)
```

## Environment variables

| Variable | Required | Notes |
|----------|----------|--------|
| `DATABASE_URL` | Yes (for contact) | Railway Postgres plugin sets this |
| `DATABASE_SSL` | No | Set `false` for local Postgres without SSL |
| `PORT` | No | Railway sets this automatically |
| `NODE_ENV` | No | `production` on Railway via start script |
| `VITE_GA_MEASUREMENT_ID` | No | Google Analytics (`G-…`). **Must be set at build time** on Railway (Vite inlines it). Redeploy after adding/changing. |

## Contact API

`POST /api/contact`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+91-…",
  "message": "Need DI fittings quote"
}
```

Saves a row in `inquiries`. Email notifications can be added later.

## Brochure Download API

`GET /api/brochure/download`

Downloads the latest corporate brochure and logs the download event.

- **File Path**: Serves `/assets/varahametaliks-download-brochure.pdf`.
- **Database Tracking**: Stores record in `brochure_downloads` table (logs IP address, User-Agent, and timestamp).
- **Non-blocking DB**: In environments where PostgreSQL is not setup (e.g., local development), the server logs a warning but proceeds to download the file successfully.

## Railway deploy

1. Push this repo to GitHub.
2. New Railway project → **Deploy from GitHub**.
3. Add **PostgreSQL** plugin → Railway injects `DATABASE_URL`.
4. Build: `npm run build` · Start: `npm start` (see `railway.toml`).
5. Custom domain:
   - Railway → service → **Settings → Domains**
   - Add `varahametaliks.com` and optionally `www.varahametaliks.com`
   - At your DNS host, add the CNAME / records Railway shows
   - Wait for SSL provision

## Domain checklist (`varahametaliks.com`)

1. Railway custom domain added and verified  
2. DNS CNAME/ALIAS points to Railway hostname  
3. HTTPS works  
4. Form submit hits `/api/contact` and row appears in Postgres  

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Frontend only |
| `npm run dev:server` | API only |
| `npm run build` | Production frontend build |
| `npm start` | Serve API + static `dist` |

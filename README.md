# Simple CRM — Cloudflare Pages + D1

Single-Page Frontend + Serverless Backend über **Cloudflare Pages Functions** und **D1 (SQLite)**.
Kostenlos im Hobby-Setup.

## Features
- Kontakte, Firmen, Deals, Aktivitäten
- CRUD API (`/api/...`)
- Frontend ohne Build-Tools
- Cloudflare Pages + D1 = kein eigener Server nötig

## Deploy
1. Repo erstellen, Dateien hochladen.
2. Cloudflare Pages → Repo verbinden.
   - Preset: **None**
   - Build command: leer
   - Output directory: `/`
3. D1 DB `simple_crm` anlegen und in Pages als Binding **DB** verknüpfen.
4. Schema importieren:
   ```bash
   wrangler d1 execute simple_crm --file=./schema.sql
   ```

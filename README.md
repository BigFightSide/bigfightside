# Big Fight Side – Website & CMS

MMA-Plattform mit **Next.js (App Router)**, **Payload CMS 3.0** und **Supabase (PostgreSQL, Frankfurt)**. Headless-Setup: CMS als Admin-Interface für Partner.

## Voraussetzungen

- Node.js ≥ 20
- Supabase-Projekt (Region Frankfurt optional)
- PostgreSQL-Verbindungsstring aus Supabase

## Setup

1. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

2. **Umgebungsvariablen**
   - `.env.example` nach `.env` kopieren
   - `DATABASE_URL`: Supabase PostgreSQL Connection String (Pooler-URL für Serverless empfohlen)
   - `PAYLOAD_SECRET`: Mind. 32 Zeichen (z. B. `openssl rand -base64 32`)

3. **Datenbank-Migrationen** (beim ersten Start oder nach Schema-Änderungen)
   ```bash
   npm run payload migrate:create
   npm run payload migrate
   ```

4. **Entwicklungsserver**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Admin: http://localhost:3000/admin

5. **Ersten Admin-User anlegen**  
   Beim ersten Aufruf von `/admin` einen User mit Rolle **Admin** anlegen.

## Struktur

| Bereich | Beschreibung |
|--------|----------------|
| `src/collections/` | Payload Collections (Fighters, Gyms, Events, Media, News, Users) |
| `src/hooks/` | Hooks (z. B. Slug-Generierung) |
| `src/access/` | Rollen & Berechtigungen |
| `src/app/(frontend)/` | Öffentliche Seiten |
| `src/app/(payload)/` | Payload Admin & API |

## Rollen

- **Admin**: Vollzugriff
- **Editor (Partner)**: Fighters, Gyms, News
- **Multimedia (Videograf)**: Media-Uploads, Fokus auf Medien

## Collections

- **Fighters**: Name, Nickname, Record (W-L-D), Gewichtsklasse, Gym, Profilbild, Instagram, Bio, Geburtsdatum, Slug, SEO
- **Gyms**: Name, Stadt, Adresse, Website, Logo, Beschreibung, Slug, SEO
- **Events**: Name, Datum, Location, Ticket-Link, Fight-Card (Fighters), Status (Upcoming/Past), Slug, SEO
- **Media**: Zentraler Upload (Bilder/Video), Typ (Bild / Video-Upload / Video-Embed), Alt-Text, Caption
- **News**: Titel, Slug, Rich-Text, publishedAt, SEO

## Skripte

- `npm run dev` – Entwicklung mit Turbopack
- `npm run build` – Production Build
- `npm run start` – Production Server
- `npm run payload` – Payload CLI
- `npm run generate:types` – Payload-Typen neu generieren

## Dynamische Routen (Frontend)

Slugs sind vorbereitet für Routen wie:

- `/fighter/[slug]` (z. B. `/fighter/max-mustermann`)
- `/gym/[slug]`
- `/event/[slug]`

Diese Seiten sind noch nicht angelegt; die Startseite listet die letzten 3 Kämpfer und verlinkt auf `/fighter/[slug]`.
# bigfightside

# TVOYA POSLEDNYAYA PESNYA

Premium dark-mode MVP for choosing the one song you would keep for the very end.

## Stack

- Next.js App Router
- Tailwind CSS
- Framer Motion
- Spotify Search API via client credentials
- Supabase for leaderboard and quotes

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

3. Apply [supabase/schema.sql](/Users/m.chemko/Documents/New%20project/supabase/schema.sql) in your Supabase SQL editor.

4. Run the app:

```bash
npm run dev
```

If Spotify or Supabase are not configured, the app falls back to a built-in demo mode so the interface still works locally.

## Open on localhost without npm

If you just want to launch the site locally right now, use the zero-dependency local server:

```bash
node local-server.mjs
```

Then open:

```bash
http://127.0.0.1:3000
```

This serves a polished demo MVP from [static-site/index.html](/Users/m.chemko/Documents/New%20project/static-site/index.html) and does not require `npm install`.

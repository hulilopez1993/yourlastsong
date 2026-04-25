# Architecture

## Product shape

`TVOYA POSLEDNYAYA PESNYA` is built as a single-experience landing app with a dedicated `/board` view.

Core flow:

1. User searches for a track.
2. App resolves results through Spotify or a demo fallback.
3. User selects a track, optionally writes a short reason, and confirms.
4. Backend increments leaderboard state and stores the quote.
5. UI returns updated leaderboard data and share assets.

## App structure

- [app/page.tsx](/Users/m.chemko/Documents/New%20project/app/page.tsx): landing experience, hero, search flow, embedded leaderboard.
- [app/board/page.tsx](/Users/m.chemko/Documents/New%20project/app/board/page.tsx): dedicated full leaderboard page.
- [components/search-experience.tsx](/Users/m.chemko/Documents/New%20project/components/search-experience.tsx): main client-side interaction loop.
- [components/leaderboard.tsx](/Users/m.chemko/Documents/New%20project/components/leaderboard.tsx): reusable leaderboard table.
- [app/api/search/route.ts](/Users/m.chemko/Documents/New%20project/app/api/search/route.ts): Spotify-backed search endpoint.
- [app/api/choose/route.ts](/Users/m.chemko/Documents/New%20project/app/api/choose/route.ts): choice persistence, quote save, share payload response.
- [app/api/og/route.tsx](/Users/m.chemko/Documents/New%20project/app/api/og/route.tsx): dynamic Open Graph image generation.
- [lib/data.ts](/Users/m.chemko/Documents/New%20project/lib/data.ts): unified persistence layer with Supabase/demo fallback.
- [supabase/schema.sql](/Users/m.chemko/Documents/New%20project/supabase/schema.sql): database schema.

## Data model

`last_songs`

- `id`
- `song_title`
- `artist`
- `spotify_id`
- `album_cover_url`
- `preview_url`
- `chooses_count`
- `created_at`
- `updated_at`

`song_quotes`

- `id`
- `spotify_id`
- `song_title`
- `artist`
- `quote`
- `city`
- `created_at`

## Runtime modes

The app has two modes:

1. Production mode:
   Uses Spotify Client Credentials and Supabase.
2. Demo mode:
   Uses local in-memory data when environment variables are missing.

This keeps the project usable immediately after clone while preserving a clean upgrade path to real infrastructure.

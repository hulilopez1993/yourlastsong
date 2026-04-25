import { demoFeed, demoLeaderboard, demoQuotes, demoTracks } from "@/lib/demo-data";
import type { FeedEntry, SearchTrack, SongQuote, SongRecord } from "@/lib/types";

const songs = [...demoLeaderboard];
const quotes = [...demoQuotes];
const feed = [...demoFeed];

const cityPool = ["Tokyo", "Berlin", "Warsaw", "Minsk", "Tbilisi", "Prague", "Lisbon", "Tashkent"];

export function searchDemoTracks(query: string): SearchTrack[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return demoTracks
    .filter((track) => `${track.title} ${track.artist}`.toLowerCase().includes(normalized))
    .slice(0, 8);
}

export function getDemoLeaderboard(): SongRecord[] {
  return [...songs].sort((a, b) => b.chooses_count - a.chooses_count).slice(0, 50);
}

export function getDemoQuotes(): SongQuote[] {
  return [...quotes].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 18);
}

export function getDemoFeed(): FeedEntry[] {
  return [...feed].slice(-18).reverse();
}

export function saveDemoChoice(track: SearchTrack, quote?: string | null, city?: string | null): SongRecord {
  const existing = songs.find((song) => song.spotify_id === track.spotifyId);
  const timestamp = new Date().toISOString();

  if (existing) {
    existing.chooses_count += 1;
    existing.updated_at = timestamp;
  } else {
    songs.push({
      id: crypto.randomUUID(),
      spotify_id: track.spotifyId,
      song_title: track.title,
      artist: track.artist,
      album_cover_url: track.albumCoverUrl,
      preview_url: track.previewUrl,
      chooses_count: 1,
      created_at: timestamp,
      updated_at: timestamp
    });
  }

  if (quote?.trim()) {
    quotes.unshift({
      id: crypto.randomUUID(),
      spotify_id: track.spotifyId,
      song_title: track.title,
      artist: track.artist,
      quote: quote.trim().slice(0, 150),
      city: city ?? null,
      created_at: timestamp
    });
  }

  feed.unshift({
    id: crypto.randomUUID(),
    city: city ?? cityPool[Math.floor(Math.random() * cityPool.length)],
    track: track.title,
    artist: track.artist
  });

  return songs.find((song) => song.spotify_id === track.spotifyId)!;
}

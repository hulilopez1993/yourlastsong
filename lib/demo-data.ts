import { FeedEntry, SearchTrack, SongQuote, SongRecord } from "@/lib/types";

const now = new Date().toISOString();

export const demoTracks: SearchTrack[] = [
  {
    spotifyId: "3BQHpFgAp4l80e1XslIjNI",
    title: "Let It Be",
    artist: "The Beatles",
    albumCoverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80",
    previewUrl: null,
    externalUrl: "https://open.spotify.com/track/3BQHpFgAp4l80e1XslIjNI"
  },
  {
    spotifyId: "7ouMYWpwJ422jRcDASZB7P",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    albumCoverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
    previewUrl: null,
    externalUrl: "https://open.spotify.com/track/7ouMYWpwJ422jRcDASZB7P"
  },
  {
    spotifyId: "2TpxZ7JUBn3uw46aR7qd6V",
    title: "Yellow",
    artist: "Coldplay",
    albumCoverUrl: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=600&q=80",
    previewUrl: null,
    externalUrl: "https://open.spotify.com/track/2TpxZ7JUBn3uw46aR7qd6V"
  },
  {
    spotifyId: "5ChkMS8OtdzJeqyybCc9R5",
    title: "Do I Wanna Know?",
    artist: "Arctic Monkeys",
    albumCoverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=600&q=80",
    previewUrl: null,
    externalUrl: "https://open.spotify.com/track/5ChkMS8OtdzJeqyybCc9R5"
  },
  {
    spotifyId: "0ofbQMrRDsUaVKq2mGLEAb",
    title: "The Night We Met",
    artist: "Lord Huron",
    albumCoverUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80",
    previewUrl: null,
    externalUrl: "https://open.spotify.com/track/0ofbQMrRDsUaVKq2mGLEAb"
  }
];

export const demoLeaderboard: SongRecord[] = [
  {
    id: "1",
    spotify_id: demoTracks[0].spotifyId,
    song_title: demoTracks[0].title,
    artist: demoTracks[0].artist,
    album_cover_url: demoTracks[0].albumCoverUrl,
    preview_url: demoTracks[0].previewUrl,
    chooses_count: 129,
    created_at: now,
    updated_at: now
  },
  {
    id: "2",
    spotify_id: demoTracks[1].spotifyId,
    song_title: demoTracks[1].title,
    artist: demoTracks[1].artist,
    album_cover_url: demoTracks[1].albumCoverUrl,
    preview_url: demoTracks[1].previewUrl,
    chooses_count: 94,
    created_at: now,
    updated_at: now
  },
  {
    id: "3",
    spotify_id: demoTracks[4].spotifyId,
    song_title: demoTracks[4].title,
    artist: demoTracks[4].artist,
    album_cover_url: demoTracks[4].albumCoverUrl,
    preview_url: demoTracks[4].previewUrl,
    chooses_count: 72,
    created_at: now,
    updated_at: now
  }
];

export const demoQuotes: SongQuote[] = [
  {
    id: "q1",
    spotify_id: demoTracks[0].spotifyId,
    song_title: demoTracks[0].title,
    artist: demoTracks[0].artist,
    quote: "Because it sounds like acceptance without surrender.",
    city: "Tokyo",
    created_at: now
  },
  {
    id: "q2",
    spotify_id: demoTracks[1].spotifyId,
    song_title: demoTracks[1].title,
    artist: demoTracks[1].artist,
    quote: "I need one last song that still feels infinite.",
    city: "Berlin",
    created_at: now
  },
  {
    id: "q3",
    spotify_id: demoTracks[4].spotifyId,
    song_title: demoTracks[4].title,
    artist: demoTracks[4].artist,
    quote: "It hurts in exactly the right way.",
    city: "Warsaw",
    created_at: now
  }
];

export const demoFeed: FeedEntry[] = [
  { id: "f1", city: "Tokyo", track: "Let It Be", artist: "The Beatles" },
  { id: "f2", city: "Seoul", track: "Bohemian Rhapsody", artist: "Queen" },
  { id: "f3", city: "Warsaw", track: "Yellow", artist: "Coldplay" },
  { id: "f4", city: "Minsk", track: "The Night We Met", artist: "Lord Huron" }
];

export type SongRecord = {
  id: string;
  spotify_id: string;
  song_title: string;
  artist: string;
  album_cover_url: string;
  preview_url: string | null;
  chooses_count: number;
  created_at: string;
  updated_at: string;
};

export type SongQuote = {
  id: string;
  spotify_id: string;
  song_title: string;
  artist: string;
  quote: string;
  city: string | null;
  created_at: string;
};

export type SearchTrack = {
  spotifyId: string;
  title: string;
  artist: string;
  albumCoverUrl: string;
  previewUrl: string | null;
  externalUrl?: string | null;
};

export type FeedEntry = {
  id: string;
  city: string;
  track: string;
  artist: string;
};

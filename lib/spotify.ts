import { searchDemoTracks } from "@/lib/demo-store";
import type { SearchTrack } from "@/lib/types";

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;

export const hasSpotify = Boolean(spotifyClientId && spotifyClientSecret);

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getSpotifyAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const credentials = Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials",
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with Spotify");
  }

  const payload = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    value: payload.access_token,
    expiresAt: Date.now() + (payload.expires_in - 60) * 1000
  };

  return payload.access_token;
}

export async function searchTracks(query: string): Promise<SearchTrack[]> {
  if (!hasSpotify) {
    return searchDemoTracks(query);
  }

  const token = await getSpotifyAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/search?type=track&limit=8&q=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      },
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error("Spotify search failed");
  }

  const payload = (await response.json()) as {
    tracks?: {
      items?: Array<{
        id: string;
        name: string;
        preview_url: string | null;
        external_urls?: { spotify?: string };
        artists: Array<{ name: string }>;
        album: {
          images: Array<{ url: string }>;
        };
      }>;
    };
  };

  return (payload.tracks?.items ?? []).map((item) => ({
    spotifyId: item.id,
    title: item.name,
    artist: item.artists.map((artist) => artist.name).join(", "),
    albumCoverUrl: item.album.images[0]?.url ?? "",
    previewUrl: item.preview_url,
    externalUrl: item.external_urls?.spotify ?? null
  }));
}

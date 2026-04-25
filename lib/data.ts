import { getDemoFeed, getDemoLeaderboard, getDemoQuotes, saveDemoChoice } from "@/lib/demo-store";
import { getSupabaseAdmin, hasSupabase } from "@/lib/supabase";
import type { FeedEntry, SearchTrack, SongQuote, SongRecord } from "@/lib/types";

export async function listLeaderboard(): Promise<SongRecord[]> {
  if (!hasSupabase) {
    return getDemoLeaderboard();
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return getDemoLeaderboard();

  const { data, error } = await supabase
    .from("last_songs")
    .select("*")
    .order("chooses_count", { ascending: false })
    .limit(50);

  if (error || !data) {
    return getDemoLeaderboard();
  }

  return data as SongRecord[];
}

export async function listQuotes(): Promise<SongQuote[]> {
  if (!hasSupabase) {
    return getDemoQuotes();
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return getDemoQuotes();

  const { data, error } = await supabase
    .from("song_quotes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(18);

  if (error || !data) {
    return getDemoQuotes();
  }

  return data as SongQuote[];
}

export async function listFeed(): Promise<FeedEntry[]> {
  if (!hasSupabase) {
    return getDemoFeed();
  }

  const quotes = await listQuotes();

  return quotes.slice(0, 12).map((quote) => ({
    id: quote.id,
    city: quote.city ?? "Somewhere",
    track: quote.song_title,
    artist: quote.artist
  }));
}

export async function registerChoice(input: {
  track: SearchTrack;
  quote?: string | null;
  city?: string | null;
}) {
  if (!hasSupabase) {
    return saveDemoChoice(input.track, input.quote, input.city);
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return saveDemoChoice(input.track, input.quote, input.city);
  }

  const { data: existing } = await supabase
    .from("last_songs")
    .select("*")
    .eq("spotify_id", input.track.spotifyId)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from("last_songs")
      .update({
        chooses_count: existing.chooses_count + 1,
        preview_url: input.track.previewUrl,
        album_cover_url: input.track.albumCoverUrl,
        updated_at: new Date().toISOString()
      })
      .eq("spotify_id", input.track.spotifyId)
      .select()
      .single();

    if (!error && input.quote?.trim()) {
      await supabase.from("song_quotes").insert({
        spotify_id: input.track.spotifyId,
        song_title: input.track.title,
        artist: input.track.artist,
        quote: input.quote.trim().slice(0, 150),
        city: input.city ?? null
      });
    }

    return (data as SongRecord | null) ?? existing;
  }

  const { data, error } = await supabase
    .from("last_songs")
    .insert({
      spotify_id: input.track.spotifyId,
      song_title: input.track.title,
      artist: input.track.artist,
      album_cover_url: input.track.albumCoverUrl,
      preview_url: input.track.previewUrl,
      chooses_count: 1
    })
    .select()
    .single();

  if (!error && input.quote?.trim()) {
    await supabase.from("song_quotes").insert({
      spotify_id: input.track.spotifyId,
      song_title: input.track.title,
      artist: input.track.artist,
      quote: input.quote.trim().slice(0, 150),
      city: input.city ?? null
    });
  }

  return (data as SongRecord | null) ?? saveDemoChoice(input.track, input.quote, input.city);
}

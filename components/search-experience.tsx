"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  AudioLines,
  Check,
  Copy,
  LoaderCircle,
  Play,
  Send,
  Share2,
  SkipForward,
  Trophy
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Leaderboard } from "@/components/leaderboard";
import type { SearchTrack, SongQuote, SongRecord } from "@/lib/types";

type SearchExperienceProps = {
  initialSongs: SongRecord[];
  initialQuotes: SongQuote[];
};

type ResultState = {
  shareText: string;
  shareUrl: string;
  ogUrl: string;
};

const initialResult: ResultState | null = null;

export function SearchExperience({ initialSongs, initialQuotes }: SearchExperienceProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchTrack[]>([]);
  const [selected, setSelected] = useState<SearchTrack | null>(null);
  const [quote, setQuote] = useState("");
  const [songs, setSongs] = useState(initialSongs);
  const [quotes, setQuotes] = useState(initialQuotes);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resultState, setResultState] = useState<ResultState | null>(initialResult);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const payload = (await response.json()) as { results?: SearchTrack[] };
        setResults(payload.results ?? []);
      } finally {
        setLoading(false);
      }
    }, 260);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    if (!selected?.previewUrl) return;

    audioRef.current?.pause();
    audioRef.current = new Audio(selected.previewUrl);
    audioRef.current.play().catch(() => undefined);

    return () => {
      audioRef.current?.pause();
    };
  }, [selected]);

  const boardPreview = useMemo(() => songs.slice(0, 6), [songs]);

  async function handleConfirm() {
    if (!selected) return;

    setSaving(true);

    try {
      const response = await fetch("/api/choose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          track: selected,
          quote,
          city:
            Intl.DateTimeFormat().resolvedOptions().timeZone?.split("/").at(-1)?.replaceAll("_", " ") ?? "Somewhere"
        })
      });

      const payload = (await response.json()) as {
        item?: SongRecord;
        leaderboard?: SongRecord[];
        quotes?: SongQuote[];
        shareText?: string;
        shareUrl?: string;
        ogUrl?: string;
      };

      setSongs(payload.leaderboard ?? songs);
      setQuotes(payload.quotes ?? quotes);
      setResultState(
        payload.shareText && payload.shareUrl && payload.ogUrl
          ? {
              shareText: payload.shareText,
              shareUrl: payload.shareUrl,
              ogUrl: payload.ogUrl
            }
          : null
      );
    } finally {
      setSaving(false);
    }
  }

  function playFromBoard(song: SongRecord) {
    setSelected({
      spotifyId: song.spotify_id,
      title: song.song_title,
      artist: song.artist,
      albumCoverUrl: song.album_cover_url,
      previewUrl: song.preview_url
    });
    setResultState(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function copyShareLink() {
    if (!resultState) return;
    await navigator.clipboard.writeText(`${resultState.shareText} ${resultState.shareUrl}`);
  }

  return (
    <>
      <main>
        <section className="relative overflow-hidden">
          <div className="section-shell relative flex min-h-[calc(100vh-82px)] flex-col justify-center py-16 sm:py-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl"
            >
              <p className="mb-6 text-[11px] uppercase tracking-[0.44em] text-white/42">One question. One track. One ending.</p>
              <h1 className="max-w-5xl font-display text-[4rem] leading-[0.88] text-white sm:text-[6.6rem] lg:text-[8.2rem]">
                Если бы тебе осталась всего одна песня...
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62 sm:text-xl">
                Какую ты включишь перед тем, как все закончится?
              </p>
            </motion.div>

            <motion.div
              id="experience"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr),420px]"
            >
              <div className="glass relative rounded-[32px] p-5 sm:p-7">
                <div className="absolute inset-0 rounded-[32px] border border-white/5" />
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-white/35">Search</p>
                    <p className="mt-2 text-white/70">Track title, artist, feeling, confession.</p>
                  </div>
                  <Link
                    href="/board"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
                  >
                    <Trophy className="h-4 w-4" />
                    Full board
                  </Link>
                </div>

                <div className="relative">
                  <input
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setResultState(null);
                    }}
                    placeholder="Search for a song you would leave the world with"
                    className="w-full rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-5 text-lg text-white outline-none transition placeholder:text-white/26 focus:border-white/30"
                  />

                  <AnimatePresence>
                    {(loading || results.length > 0) && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="glass absolute left-0 right-0 top-[calc(100%+12px)] z-20 overflow-hidden rounded-[28px]"
                      >
                        {loading ? (
                          <div className="flex items-center gap-3 px-5 py-4 text-sm text-white/58">
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            Searching through endings...
                          </div>
                        ) : (
                          results.map((track) => (
                            <button
                              key={track.spotifyId}
                              onClick={() => {
                                setSelected(track);
                                setQuery(`${track.title} - ${track.artist}`);
                                setResults([]);
                              }}
                              className="flex w-full items-center gap-4 border-b border-white/6 px-5 py-4 text-left transition hover:bg-white/[0.03] last:border-b-0"
                            >
                              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                                <Image src={track.albumCoverUrl} alt={track.title} fill sizes="56px" className="object-cover" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-white">{track.title}</p>
                                <p className="truncate text-sm text-white/48">{track.artist}</p>
                              </div>
                              <ArrowUpRight className="h-4 w-4 text-white/28" />
                            </button>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                  {selected ? (
                    <motion.div
                      key={selected.spotifyId}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.35 }}
                      className="mt-8 rounded-[28px] border border-white/8 bg-black/30 p-5 sm:p-6"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                        <div className="relative h-[112px] w-[112px] overflow-hidden rounded-[26px] border border-white/10 bg-white/5">
                          <Image src={selected.albumCoverUrl} alt={selected.title} fill sizes="112px" className="object-cover" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] uppercase tracking-[0.3em] text-white/36">Selected track</p>
                          <h2 className="mt-3 text-2xl text-white">{selected.title}</h2>
                          <p className="mt-2 text-white/55">{selected.artist}</p>

                          <div className="mt-5 flex flex-wrap gap-3">
                            <button
                              onClick={() => selected.previewUrl && audioRef.current?.play().catch(() => undefined)}
                              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/72 transition hover:border-white/30 hover:text-white"
                            >
                              <Play className="h-4 w-4" />
                              {selected.previewUrl ? "Play 30s preview" : "Preview unavailable"}
                            </button>
                            {selected.externalUrl ? (
                              <a
                                href={selected.externalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/60 transition hover:border-[#8F2027] hover:text-white"
                              >
                                <SkipForward className="h-4 w-4" />
                                Open in Spotify
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="mb-3 block text-[11px] uppercase tracking-[0.28em] text-white/34">
                          Why this song? (optional)
                        </label>
                        <textarea
                          value={quote}
                          onChange={(event) => setQuote(event.target.value.slice(0, 150))}
                          placeholder="A final confession, memory, apology, or simple reason."
                          rows={3}
                          className="w-full resize-none rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4 text-white outline-none transition placeholder:text-white/24 focus:border-white/28"
                        />
                        <div className="mt-2 text-right text-xs text-white/34">{quote.length}/150</div>
                      </div>

                      <button
                        onClick={handleConfirm}
                        disabled={saving}
                        className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm text-black transition hover:bg-[#f2e9e9] disabled:cursor-wait disabled:opacity-70"
                      >
                        {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        Да, это моя последняя песня
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="glass rounded-[32px] p-5 sm:p-7">
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/36">Top choices</p>
                <h2 className="mt-3 font-display text-4xl text-white">What people refuse to leave without</h2>
                <p className="mt-3 max-w-sm text-white/56">
                  The board updates when someone confirms their final song. Click any entry to send it straight into the player.
                </p>

                <div className="mt-6">
                  <Leaderboard songs={boardPreview} onSelect={playFromBoard} compact />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section-shell mt-16 pb-16 sm:pb-24">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr),380px]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-white/34">Leaderboard</p>
              <h2 className="mt-3 font-display text-5xl text-white sm:text-6xl">The songs people keep for the end.</h2>
              <p className="mt-4 max-w-xl text-white/58">
                This is the emotional center of the project: part ranking, part confession, part collective self-portrait.
              </p>
            </div>

            <div className="glass rounded-[32px] p-6">
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/38">Recent reasons</p>
              <div className="mt-5 space-y-4">
                {quotes.slice(0, 3).map((item) => (
                  <div key={item.id} className="rounded-[24px] border border-white/8 bg-white/[0.02] p-4">
                    <p className="text-sm leading-7 text-white/82">"{item.quote}"</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/34">
                      {item.song_title} / {item.city ?? "Somewhere"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Leaderboard songs={songs} onSelect={playFromBoard} />
          </div>
        </section>
      </main>

      <AnimatePresence>
        {resultState && selected ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-md sm:items-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="glass w-full max-w-3xl rounded-[34px] p-6 sm:p-8"
            >
              <div className="grid gap-6 sm:grid-cols-[180px,minmax(0,1fr)]">
                <div className="relative mx-auto h-[180px] w-[180px] overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
                  <Image src={selected.albumCoverUrl} alt={selected.title} fill sizes="180px" className="object-cover" />
                </div>

                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-white/38">Share your answer</p>
                  <h3 className="mt-3 font-display text-4xl text-white">Your last song is chosen.</h3>
                  <p className="mt-4 max-w-xl text-white/62">{resultState.shareText}</p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(resultState.shareText)}&url=${encodeURIComponent(resultState.shareUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/72 transition hover:border-white/30 hover:text-white"
                    >
                      <Share2 className="h-4 w-4" />
                      X
                    </a>
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(resultState.shareUrl)}&text=${encodeURIComponent(resultState.shareText)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/72 transition hover:border-white/30 hover:text-white"
                    >
                      <Send className="h-4 w-4" />
                      Telegram
                    </a>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`${resultState.shareText} ${resultState.shareUrl}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/72 transition hover:border-white/30 hover:text-white"
                    >
                      <AudioLines className="h-4 w-4" />
                      WhatsApp
                    </a>
                    <a
                      href={`https://vk.com/share.php?url=${encodeURIComponent(resultState.shareUrl)}&title=${encodeURIComponent(resultState.shareText)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/72 transition hover:border-white/30 hover:text-white"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      VK
                    </a>
                    <button
                      onClick={copyShareLink}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/72 transition hover:border-[#8F2027] hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                      Copy link
                    </button>
                  </div>

                  <div className="mt-6">
                    <a
                      href={resultState.ogUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-white/56 transition hover:text-white"
                    >
                      Open dynamic OG image
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setResultState(null)}
                className="mt-8 rounded-full border border-white/10 px-5 py-3 text-sm text-white/66 transition hover:border-white/30 hover:text-white"
              >
                Continue exploring
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

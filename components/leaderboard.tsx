"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { SongRecord } from "@/lib/types";

type LeaderboardProps = {
  songs: SongRecord[];
  onSelect?: (song: SongRecord) => void;
  compact?: boolean;
};

export function Leaderboard({ songs, onSelect, compact = false }: LeaderboardProps) {
  return (
    <div className="glass overflow-hidden rounded-[28px]">
      <div className="grid grid-cols-[72px,minmax(0,1fr),140px] gap-3 border-b border-white/8 px-4 py-4 text-[10px] uppercase tracking-[0.28em] text-white/40 sm:grid-cols-[72px,minmax(0,1.2fr),minmax(0,1fr),140px]">
        <div>Rank</div>
        <div>Track</div>
        <div className="hidden sm:block">Artist</div>
        <div className="text-right">Chosen</div>
      </div>

      <div>
        {songs.map((song, index) => (
          <motion.button
            key={song.spotify_id}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelect?.(song)}
            className="grid w-full grid-cols-[72px,minmax(0,1fr),140px] gap-3 border-b border-white/6 px-4 py-4 text-left last:border-b-0 sm:grid-cols-[72px,minmax(0,1.2fr),minmax(0,1fr),140px]"
          >
            <div className="flex items-center text-xl text-white/50">{String(index + 1).padStart(2, "0")}</div>

            <div className="flex min-w-0 items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <Image
                  src={song.album_cover_url}
                  alt={song.song_title}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base text-white">{song.song_title}</p>
                <p className="truncate text-sm text-white/45 sm:hidden">{song.artist}</p>
              </div>
            </div>

            <div className="hidden items-center text-white/60 sm:flex">{song.artist}</div>

            <div className="flex items-center justify-end text-sm text-white/70">
              {compact ? song.chooses_count : `${song.chooses_count} people`}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

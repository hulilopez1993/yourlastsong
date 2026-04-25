"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { FeedEntry } from "@/lib/types";

export function LiveFeed({ initialFeed }: { initialFeed: FeedEntry[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (initialFeed.length < 2) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % initialFeed.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [initialFeed.length]);

  const item = initialFeed[index];

  if (!item) return null;

  return (
    <div className="glass fixed bottom-5 right-4 z-30 max-w-sm rounded-2xl px-4 py-3 shadow-aura sm:right-6">
      <p className="mb-1 text-[10px] uppercase tracking-[0.32em] text-white/40">Live feed</p>
      <div className="min-h-[3rem]">
        <AnimatePresence mode="wait">
          <motion.p
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="text-sm leading-6 text-white/88"
          >
            Someone from <span className="text-white">{item.city}</span> just picked{" "}
            <span className="text-white">{item.track}</span> by {item.artist}.
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

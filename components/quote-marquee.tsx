"use client";

import { motion } from "framer-motion";
import type { SongQuote } from "@/lib/types";

export function QuoteMarquee({ quotes }: { quotes: SongQuote[] }) {
  if (!quotes.length) return null;

  const content = [...quotes, ...quotes];

  return (
    <section className="border-y border-white/8 py-4">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
        className="flex w-max gap-6 whitespace-nowrap pr-6"
      >
        {content.map((quote, index) => (
          <div key={`${quote.id}-${index}`} className="text-sm text-white/60">
            "{quote.quote}" <span className="text-white/32">/</span> {quote.song_title} <span className="text-white/32">/</span>{" "}
            {quote.city ?? "Somewhere"}
          </div>
        ))}
      </motion.div>
    </section>
  );
}

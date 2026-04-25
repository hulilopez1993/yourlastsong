import Link from "next/link";
import { Headphones, Trophy } from "lucide-react";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div className="noise" />
      <header className="sticky top-0 z-40 border-b border-white/5 bg-black/30 backdrop-blur-xl">
        <div className="section-shell flex items-center justify-between py-5">
          <Link href="/" className="flex items-center gap-3 text-sm uppercase tracking-[0.35em] text-white/78">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Headphones className="h-4 w-4" />
            </span>
            <span>TVOYA POSLEDNYAYA PESNYA</span>
          </Link>

          <nav className="flex items-center gap-2 text-sm text-white/70">
            <Link
              href="/#experience"
              className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/30 hover:text-white"
            >
              Search
            </Link>
            <Link
              href="/board"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 transition hover:border-[#8F2027] hover:text-white"
            >
              <Trophy className="h-4 w-4" />
              Board
            </Link>
          </nav>
        </div>
      </header>

      {children}
    </div>
  );
}

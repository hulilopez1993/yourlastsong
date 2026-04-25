import { Leaderboard } from "@/components/leaderboard";
import { QuoteMarquee } from "@/components/quote-marquee";
import { SiteShell } from "@/components/site-shell";
import { listLeaderboard, listQuotes } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const [songs, quotes] = await Promise.all([listLeaderboard(), listQuotes()]);

  return (
    <SiteShell>
      <QuoteMarquee quotes={quotes} />
      <main className="section-shell py-16 sm:py-24">
        <div className="max-w-4xl">
          <p className="text-[11px] uppercase tracking-[0.34em] text-white/34">Board</p>
          <h1 className="mt-4 font-display text-5xl text-white sm:text-7xl">50 songs people want to hear last.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/58">
            A ranking of endings. Updated from confirmed choices, designed to feel closer to a memorial wall than a chart.
          </p>
        </div>

        <div className="mt-12">
          <Leaderboard songs={songs} />
        </div>
      </main>
    </SiteShell>
  );
}

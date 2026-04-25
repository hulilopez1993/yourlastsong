import { LiveFeed } from "@/components/live-feed";
import { QuoteMarquee } from "@/components/quote-marquee";
import { SearchExperience } from "@/components/search-experience";
import { SiteShell } from "@/components/site-shell";
import { listFeed, listLeaderboard, listQuotes } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [songs, quotes, feed] = await Promise.all([listLeaderboard(), listQuotes(), listFeed()]);

  return (
    <SiteShell>
      <QuoteMarquee quotes={quotes} />
      <SearchExperience initialSongs={songs} initialQuotes={quotes} />
      <LiveFeed initialFeed={feed} />
    </SiteShell>
  );
}

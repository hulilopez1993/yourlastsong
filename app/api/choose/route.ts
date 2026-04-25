import { NextRequest, NextResponse } from "next/server";
import { listLeaderboard, listQuotes, registerChoice } from "@/lib/data";
import type { SearchTrack } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    track?: SearchTrack;
    quote?: string;
    city?: string;
  };

  if (!body.track) {
    return NextResponse.json({ error: "Track is required" }, { status: 400 });
  }

  const item = await registerChoice({
    track: body.track,
    quote: body.quote,
    city: request.headers.get("x-vercel-ip-city") ?? body.city ?? null
  });

  const [leaderboard, quotes] = await Promise.all([listLeaderboard(), listQuotes()]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  const shareText = `Я выбрал своей последней песней перед смертью ${body.track.title} — ${body.track.artist}. А какая будет у тебя? Выбери на`;
  const shareUrl = siteUrl;
  const ogUrl = `${siteUrl}/api/og?title=${encodeURIComponent(body.track.title)}&artist=${encodeURIComponent(body.track.artist)}&cover=${encodeURIComponent(body.track.albumCoverUrl)}`;

  return NextResponse.json({
    item,
    leaderboard,
    quotes,
    shareText,
    shareUrl,
    ogUrl
  });
}

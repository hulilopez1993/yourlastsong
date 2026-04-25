import { NextResponse } from "next/server";
import { listLeaderboard, listQuotes } from "@/lib/data";

export const runtime = "nodejs";

export async function GET() {
  const [leaderboard, quotes] = await Promise.all([listLeaderboard(), listQuotes()]);
  return NextResponse.json({ leaderboard, quotes });
}

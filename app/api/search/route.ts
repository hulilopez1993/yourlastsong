import { NextRequest, NextResponse } from "next/server";
import { searchTracks } from "@/lib/spotify";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchTracks(query);
    return NextResponse.json({ results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
  }
}

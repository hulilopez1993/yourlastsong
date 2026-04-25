import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get("title") ?? "Your Last Song";
  const artist = request.nextUrl.searchParams.get("artist") ?? "Unknown Artist";
  const cover = request.nextUrl.searchParams.get("cover");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(circle at top, rgba(143,32,39,0.42), transparent 32%), linear-gradient(180deg, #090909 0%, #0A0A0A 100%)",
          color: "#F8F4EE",
          fontFamily: "sans-serif"
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            padding: "72px",
            gap: "52px",
            alignItems: "center"
          }}
        >
          <div
            style={{
              width: 300,
              height: 300,
              borderRadius: 36,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              display: "flex"
            }}
          >
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt={title} width="300" height="300" style={{ objectFit: "cover" }} />
            ) : null}
          </div>

          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div
              style={{
                fontSize: 18,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.5)"
              }}
            >
              TVOYA POSLEDNYAYA PESNYA
            </div>
            <div
              style={{
                fontSize: 84,
                lineHeight: 1.02,
                marginTop: 28,
                maxWidth: 760
              }}
            >
              {title}
            </div>
            <div
              style={{
                marginTop: 22,
                fontSize: 34,
                color: "rgba(255,255,255,0.72)"
              }}
            >
              {artist}
            </div>
            <div
              style={{
                marginTop: 44,
                fontSize: 24,
                color: "rgba(255,255,255,0.52)"
              }}
            >
              If you had one song left, what would it be?
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}

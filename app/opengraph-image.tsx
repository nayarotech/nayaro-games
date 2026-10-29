import { ImageResponse } from "next/og";
export const alt = "Nayaro Games — Browser games by Nayaro Technology";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: 80,
        background: "#f7f8fa",
        color: "#111726",
      }}
    >
      <div style={{ fontSize: 26, letterSpacing: 5, marginBottom: 50 }}>
        NAYARO GAMES
      </div>
      <div style={{ fontSize: 100, fontWeight: 700, lineHeight: 1.1 }}>
        Browser games
      </div>
      <div
        style={{
          fontSize: 100,
          fontWeight: 700,
          lineHeight: 1.1,
          color: "#1f5eff",
        }}
      >
        by Nayaro.
      </div>
      <div style={{ fontSize: 25, marginTop: 50, color: "#4f5a68" }}>
        games.nayaro.tech
      </div>
    </div>,
    size,
  );
}

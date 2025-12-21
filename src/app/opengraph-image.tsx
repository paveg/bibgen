import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "BIBGEN - バイク用ゼッケンジェネレーター";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #0c0b09 0%, #171512 50%, #252320 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
      }}
    >
      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(255, 90, 31, 0.15) 0%, transparent 50%)",
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        <span style={{ fontSize: "80px" }}>🏁</span>
        <span
          style={{
            fontSize: "120px",
            fontWeight: "bold",
            color: "#f5f2ec",
            letterSpacing: "0.1em",
            textShadow: "0 0 60px rgba(255, 90, 31, 0.5)",
          }}
        >
          BIBGEN
        </span>
      </div>

      {/* Tagline */}
      <p
        style={{
          fontSize: "36px",
          color: "#8a8278",
          letterSpacing: "0.15em",
          marginBottom: "48px",
        }}
      >
        バイク用ゼッケンジェネレーター
      </p>

      {/* Sample bib */}
      <div
        style={{
          display: "flex",
          gap: "24px",
        }}
      >
        {["42", "7", "123"].map((num) => (
          <div
            key={num}
            style={{
              width: "140px",
              height: "110px",
              background: "#FFFFFF",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "64px",
              fontWeight: "bold",
              color: "#000000",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            }}
          >
            {num}
          </div>
        ))}
      </div>

      {/* Footer */}
      <p
        style={{
          position: "absolute",
          bottom: "40px",
          fontSize: "24px",
          color: "#4a4540",
        }}
      >
        bibgen.vercel.app
      </p>
    </div>,
    {
      ...size,
    }
  );
}

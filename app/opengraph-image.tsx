import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ResumeAI Pro — Build a Resume That Gets You Hired";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(ellipse at 20% 20%, #2563EB66 0%, transparent 50%), radial-gradient(ellipse at 80% 0%, #F59E0B33 0%, transparent 50%), #0A0F2C",
          padding: "80px",
          color: "white",
          fontFamily: "Inter, system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 50 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #2563EB, #F59E0B)",
            }}
          />
          <div style={{ fontSize: 36, fontWeight: 700 }}>
            ResumeAI <span style={{ color: "#F59E0B" }}>Pro</span>
          </div>
        </div>
        <div style={{ fontSize: 78, fontWeight: 800, lineHeight: 1.1, maxWidth: 900 }}>
          Build a Resume That{" "}
          <span style={{ background: "linear-gradient(90deg, #60A5FA, #FBBF24)", backgroundClip: "text", color: "transparent" }}>
            Gets You Hired
          </span>
        </div>
        <div style={{ fontSize: 32, color: "#cbd5e1", marginTop: 24, maxWidth: 900 }}>
          AI-powered · ATS-optimized · Built for every career stage
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: "auto", fontSize: 24, color: "#94a3b8" }}>
          <span style={{ padding: "10px 18px", borderRadius: 999, border: "1px solid #ffffff20" }}>✦ AI Bullet Rewriter</span>
          <span style={{ padding: "10px 18px", borderRadius: 999, border: "1px solid #ffffff20" }}>✓ ATS Scorer</span>
          <span style={{ padding: "10px 18px", borderRadius: 999, border: "1px solid #ffffff20" }}>↓ PDF + DOCX</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

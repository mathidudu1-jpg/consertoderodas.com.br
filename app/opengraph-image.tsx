import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const alt = "Rodas de Liga Leve — Conserto de Rodas de liga leve em Curitiba";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG() {
  const wheel = fs.readFileSync(path.join(process.cwd(), "public/brand/hero-wheel.jpg"));
  const wheelSrc = `data:image/jpeg;base64,${wheel.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0e17",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(600px 400px at 78% 50%, rgba(15,87,251,0.35), rgba(10,14,23,0))",
            display: "flex",
          }}
        />
        {/* Texto */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "72px",
            width: "62%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#bfd1ff",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            <div style={{ width: 40, height: 3, background: "#0f57fb", display: "flex" }} />
            Curitiba · desde 1993
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 20,
              fontSize: 76,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.02,
            }}
          >
            <span>Rodas de</span>
            <span style={{ color: "#5b8bff" }}>Liga Leve</span>
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 30, color: "#cbd5e1", lineHeight: 1.3, maxWidth: 560 }}>
            Conserto e revitalização de rodas — desempeno, diamantação e pintura com 1 ano de garantia.
          </div>
          <div style={{ display: "flex", marginTop: 34, gap: 12, alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#0f57fb",
                color: "#fff",
                fontSize: 24,
                fontWeight: 700,
                padding: "12px 24px",
                borderRadius: 999,
              }}
            >
              consertoderodas.com.br
            </div>
            <div style={{ display: "flex", color: "#94a3b8", fontSize: 22 }}>+55 41 3346-9595</div>
          </div>
        </div>
        {/* Roda */}
        <div style={{ display: "flex", width: "38%", alignItems: "center", justifyContent: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wheelSrc} width={440} height={440} style={{ objectFit: "cover", borderRadius: 24 }} alt="" />
        </div>
      </div>
    ),
    { ...size }
  );
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rodas de Liga Leve — Conserto de Rodas",
    short_name: "Rodas de Liga Leve",
    description:
      "Conserto e revitalização de rodas de liga leve em Curitiba. 32 anos de história.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e17",
    theme_color: "#0f57fb",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}

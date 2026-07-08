import type { MetadataRoute } from "next";

const base = "https://consertoderodas.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/historia`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    // /admin fica de fora de propósito (noindex)
  ];
}

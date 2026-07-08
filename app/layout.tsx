import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const title = "Rodas de Liga Leve — Conserto de Rodas em Curitiba | 32 anos";
const description =
  "Há mais de 32 anos a maior referência em conserto de rodas de liga leve de Curitiba. Desempeno sem usinagem, revitalização completa, diamantação e pintura com 1 ano de garantia.";

export const metadata: Metadata = {
  metadataBase: new URL("https://consertoderodas.com.br"),
  title: { default: title, template: "%s | Rodas de Liga Leve" },
  description,
  keywords: [
    "conserto de rodas",
    "rodas de liga leve",
    "desempeno de rodas",
    "diamantação",
    "pintura de rodas",
    "Curitiba",
    "roda empenada",
  ],
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  alternates: { canonical: "/" },
  category: "automotive",
  openGraph: {
    title,
    description,
    url: "https://consertoderodas.com.br",
    siteName: site.legalName,
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e17",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  "@id": "https://consertoderodas.com.br/#business",
  name: site.legalName,
  alternateName: "Rodas de Liga Leve",
  image: "https://consertoderodas.com.br/opengraph-image",
  logo: "https://consertoderodas.com.br/icon.png",
  telephone: "+55 41 3346-9595",
  foundingDate: "1993",
  slogan: "Há mais de 32 anos fazendo parte da sua história",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Omar Raymundo Picheth, 269 – Xaxim",
    addressLocality: "Curitiba",
    addressRegion: "PR",
    postalCode: "81810-150",
    addressCountry: "BR",
  },
  geo: { "@type": "GeoCoordinates", latitude: -25.508, longitude: -49.283 },
  areaServed: { "@type": "City", name: "Curitiba" },
  url: "https://consertoderodas.com.br",
  priceRange: "$$",
  currenciesAccepted: "BRL",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:30",
    },
  ],
  makesOffer: [
    "Revitalização completa de rodas",
    "Conserto e desempeno de rodas",
    "Diamantação",
    "Pintura de rodas",
    "Venda de rodas novas",
  ].map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s } })),
  sameAs: [site.social.instagram, site.social.facebook, site.social.youtube],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

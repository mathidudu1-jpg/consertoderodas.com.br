import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
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
  openGraph: {
    title,
    description,
    url: "https://consertoderodas.com.br",
    siteName: site.legalName,
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/brand/logo-mark.png", width: 1024, height: 1024 }],
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
  icons: { icon: "/brand/logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#0a0e17",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: site.legalName,
  image: "https://consertoderodas.com.br/brand/logo-mark.png",
  telephone: "+55 41 3346-9595",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rua Omar Raymundo Picheth, 269 – Xaxim",
    addressLocality: "Curitiba",
    addressRegion: "PR",
    postalCode: "81810-150",
    addressCountry: "BR",
  },
  url: "https://consertoderodas.com.br",
  priceRange: "$$",
  openingHours: "Mo-Fr 08:00-17:30",
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
      </body>
    </html>
  );
}

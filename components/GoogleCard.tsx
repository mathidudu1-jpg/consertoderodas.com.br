import Image from "next/image";
import { site } from "@/lib/site";

/**
 * Card de avaliação do Google — fundo branco (o selo 5 estrelas tem fundo
 * branco, então o card acompanha). Usado na home e na página de história.
 */
export default function GoogleCard({ className = "" }: { className?: string }) {
  const reviewsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    site.mapsQuery
  )}`;

  return (
    <div
      className={`flex items-center gap-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_36px_-16px_rgba(16,42,100,0.25)] ${className}`}
    >
      <Image
        src="/brand/5-estrelas.png"
        alt="Selo 5 estrelas Rodas de Liga Leve no Google"
        width={96}
        height={96}
        className="h-20 w-20 shrink-0 object-contain md:h-24 md:w-24"
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-display text-4xl font-extrabold text-ink">5,0</span>
          <span className="text-lg tracking-tight text-amber-400" aria-label="5 estrelas">
            ★★★★★
          </span>
        </div>
        <p className="mt-0.5 text-sm font-medium text-slate-700">
          Avaliações reais no Google
        </p>
        <p className="text-xs text-slate-500">100% satisfação garantida</p>
        <a
          href={reviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm font-semibold text-brand hover:underline"
        >
          Ver no Google →
        </a>
      </div>
    </div>
  );
}

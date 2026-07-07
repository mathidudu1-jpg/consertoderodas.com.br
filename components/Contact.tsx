"use client";

import { site, waLinks } from "@/lib/site";
import Reveal from "./Reveal";

export default function Contact() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    site.mapsQuery
  )}&output=embed`;

  return (
    <section id="contato" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="glass overflow-hidden rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Info */}
            <div className="p-8 md:p-12">
              <Reveal>
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-10 bg-brand" />
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">
                    Fale com a gente
                  </span>
                </div>
                <h2 className="font-display text-3xl font-extrabold leading-tight md:text-5xl">
                  Traga sua roda para <span className="text-gradient">Curitiba</span>
                </h2>
                <p className="mt-4 max-w-md text-slate-300">
                  Orçamento sem compromisso pelo WhatsApp ou agende um horário. A
                  gente cuida do resto.
                </p>
              </Reveal>

              <Reveal className="mt-8 space-y-5" childrenStagger delay={0.1}>
                <a
                  href={`tel:+${site.phoneRaw}`}
                  className="flex items-center gap-4 text-slate-200 transition hover:text-white"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/15 text-brand">
                    ☎
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-slate-400">
                      Telefone
                    </span>
                    <span className="font-medium">{site.phoneDisplay}</span>
                  </span>
                </a>

                <div className="flex items-center gap-4 text-slate-200">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/15 text-brand">
                    📍
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-slate-400">
                      Endereço
                    </span>
                    <span className="font-medium">{site.address}</span>
                  </span>
                </div>

                <div className="flex items-center gap-4 text-slate-200">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/15 text-brand">
                    🕗
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-wide text-slate-400">
                      Horário
                    </span>
                    {site.hours.map((h) => (
                      <span key={h.d} className="block font-medium">
                        {h.d}: {h.h}
                      </span>
                    ))}
                  </span>
                </div>
              </Reveal>

              <Reveal className="mt-9 flex flex-wrap gap-3" delay={0.15}>
                <a
                  href={waLinks.orcamento}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  WhatsApp
                </a>
                <a
                  href={site.scheduleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  Agendar horário
                </a>
              </Reveal>

              <div className="mt-8 flex gap-3">
                {[
                  { l: "Instagram", h: site.social.instagram },
                  { l: "Facebook", h: site.social.facebook },
                  { l: "YouTube", h: site.social.youtube },
                ].map((s) => (
                  <a
                    key={s.l}
                    href={s.h}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-300 transition hover:border-brand hover:text-white"
                  >
                    {s.l}
                  </a>
                ))}
              </div>
            </div>

            {/* Mapa */}
            <div className="relative min-h-[340px] lg:min-h-full">
              <iframe
                title="Localização Rodas de Liga Leve"
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale-[0.3]"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { testimonials } from "@/lib/site";
import Reveal from "./Reveal";

function Stars() {
  return (
    <div className="flex gap-0.5 text-brand" aria-label="5 estrelas">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-ink-800/40 py-24 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">
              Quem confia
            </span>
          </div>
          <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-tight text-balance md:text-6xl">
            Nota <span className="text-gradient">5,0</span> no Google — de gente de verdade
          </h2>
        </Reveal>

        <Reveal
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
          childrenStagger
        >
          {testimonials.map((t, i) => (
            <figure
              key={`${t.name}-${i}`}
              className="glass flex h-full flex-col rounded-2xl p-6"
            >
              <Stars />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-slate-200">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/20 text-sm font-bold text-mist">
                  {t.name.charAt(0)}
                </span>
                <span className="text-sm font-medium text-white">{t.name}</span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

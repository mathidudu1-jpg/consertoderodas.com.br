"use client";

import { services, waLinks } from "@/lib/site";
import Reveal from "./Reveal";

function Row({ s, i }: { s: (typeof services)[number]; i: number }) {
  return (
    <a
      href={waLinks.orcamento}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-3 border-b border-slate-200 py-9 transition-colors duration-300 first:border-t hover:bg-white md:grid-cols-[80px_1.1fr_1.6fr_auto] md:items-center md:gap-x-10 md:px-6"
    >
      {/* Número */}
      <span className="font-display text-sm font-bold text-slate-400 transition-colors group-hover:text-brand md:text-base">
        {String(i + 1).padStart(2, "0")}
      </span>

      {/* Título */}
      <h3 className="font-display text-2xl font-bold text-ink transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">
        {s.title}
        {s.featured && (
          <span className="ml-3 inline-block -translate-y-1 rounded-full bg-brand px-2.5 py-0.5 align-middle text-[11px] font-semibold tracking-wide text-white">
            mais procurado
          </span>
        )}
      </h3>

      {/* Descrição + chips */}
      <div className="col-span-2 md:col-span-1">
        <p className="text-sm leading-relaxed text-slate-600">{s.desc}</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {s.items.map((it) => (
            <li key={it} className="text-xs font-medium text-slate-500">
              ✓ {it}
            </li>
          ))}
        </ul>
      </div>

      {/* Seta */}
      <span
        aria-hidden
        className="hidden h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-lg text-slate-400 transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white md:flex"
      >
        →
      </span>
    </a>
  );
}

export default function Services() {
  return (
    <section id="servicos" className="section-light relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-700">
              O que fazemos
            </span>
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-2xl font-display text-4xl font-extrabold leading-tight text-balance text-ink md:text-6xl">
              Tudo para a sua roda em <span className="text-gradient">um só lugar</span>
            </h2>
            <p className="max-w-sm pb-2 text-sm leading-relaxed text-slate-500">
              Clique em qualquer serviço para pedir um orçamento direto no
              WhatsApp — resposta no mesmo dia útil.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-14" childrenStagger stagger={0.1}>
          {services.map((s, i) => (
            <Row key={s.title} s={s} i={i} />
          ))}
        </Reveal>

        <Reveal className="mt-12 flex flex-wrap items-center gap-4" delay={0.1}>
          <a
            href={waLinks.orcamento}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Pedir orçamento
          </a>
          <a
            href={waLinks.rodasNovas}
            target="_blank"
            rel="noopener noreferrer"
            className="btn border border-slate-300 bg-white text-ink hover:border-brand"
          >
            Comprar rodas novas
          </a>
        </Reveal>
      </div>
    </section>
  );
}

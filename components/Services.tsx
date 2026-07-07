"use client";

import { useRef } from "react";
import { services, waLinks } from "@/lib/site";
import Reveal from "./Reveal";

function Card({ s }: { s: (typeof services)[number] }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-4px)`;
    el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`glass group relative overflow-hidden rounded-3xl p-7 transition-transform duration-200 will-change-transform ${
        s.featured ? "md:col-span-2 md:row-span-1" : ""
      }`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Brilho que segue o mouse */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(300px circle at var(--mx,50%) var(--my,50%), rgba(15,87,251,0.18), transparent 60%)",
        }}
      />
      {s.featured && (
        <span className="mb-4 inline-block rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-mist">
          Mais procurado
        </span>
      )}
      <h3 className="font-display text-2xl font-bold text-white">{s.title}</h3>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
        {s.desc}
      </p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {s.items.map((it) => (
          <li
            key={it}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300"
          >
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Services() {
  return (
    <section id="servicos" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">
              O que fazemos
            </span>
          </div>
          <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-tight text-balance md:text-6xl">
            Tudo para a sua roda em <span className="text-gradient">um só lugar</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {services.map((s) => (
            <Card key={s.title} s={s} />
          ))}
        </div>

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
            className="btn btn-ghost"
          >
            Comprar rodas novas
          </a>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import BeforeAfter from "./BeforeAfter";

// Galeria sortida: tamanhos variados, sem títulos
const photos = [
  { src: "/gallery/g1.jpg", cls: "col-span-2 row-span-2 aspect-square md:aspect-[4/5]" },
  { src: "/gallery/g3.jpg", cls: "aspect-square" },
  { src: "/gallery/g4.jpg", cls: "aspect-square" },
  { src: "/gallery/g5.jpg", cls: "col-span-2 aspect-[2/1]" },
  { src: "/gallery/g2.jpg", cls: "col-span-2 row-span-2 aspect-square md:aspect-[4/5]" },
];

export default function Gallery() {
  return (
    <section id="galeria" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">
              Antes & depois
            </span>
          </div>
          <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-tight text-balance md:text-6xl">
            A diferença que <span className="text-gradient">se vê</span>
          </h2>
        </Reveal>

        {/* Comparador em destaque: quadrado completo, alta resolução */}
        <Reveal className="mx-auto mt-12 max-w-3xl" delay={0.05}>
          <BeforeAfter />
          <p className="mt-3 text-center text-sm text-slate-400">
            Arraste para comparar ↔ — a mesma roda, fotos reais da oficina
          </p>
        </Reveal>

        {/* Mosaico sortido, sem títulos */}
        <Reveal
          className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4"
          childrenStagger
          delay={0.05}
        >
          {photos.map((p) => (
            <div
              key={p.src}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 ${p.cls}`}
            >
              <Image
                src={p.src}
                alt="Trabalho da Rodas de Liga Leve"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

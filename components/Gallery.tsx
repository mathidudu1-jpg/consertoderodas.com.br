"use client";

import Image from "next/image";
import { gallery } from "@/lib/site";
import Reveal from "./Reveal";
import BeforeAfter from "./BeforeAfter";

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

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal>
            <BeforeAfter />
            <p className="mt-3 text-center text-sm text-slate-400">
              Arraste para comparar ↔
            </p>
          </Reveal>

          {/* Mosaico da oficina */}
          <Reveal className="grid grid-cols-2 gap-4" childrenStagger delay={0.1}>
            {gallery.slice(1, 5).map((g) => (
              <div
                key={g.src}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10"
              >
                <Image
                  src={g.src}
                  alt={g.label}
                  fill
                  sizes="(max-width: 1024px) 45vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-70" />
                <span className="absolute bottom-3 left-3 text-xs font-medium text-white/90">
                  {g.label}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

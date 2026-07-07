"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { site, waLinks } from "@/lib/site";

const WheelCanvas = dynamic(() => import("./WheelCanvas"), { ssr: false });

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  // Herói mostra a roda no acabamento final (progresso ~1)
  const progressRef = useRef(1);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.from(".hero-line", {
        yPercent: 120,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.12,
      })
        .from(
          ".hero-sub",
          { y: 24, opacity: 0, duration: 0.9, ease: "expo.out" },
          "-=0.6"
        )
        .from(
          ".hero-cta",
          { y: 20, opacity: 0, duration: 0.8, ease: "expo.out", stagger: 0.1 },
          "-=0.5"
        )
        .from(
          ".hero-wheel",
          { opacity: 0, scale: 0.85, duration: 1.4, ease: "expo.out" },
          "-=1.1"
        );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="top"
      ref={rootRef}
      className="relative min-h-[100svh] w-full overflow-hidden tech-grid"
    >
      {/* Glow e vinheta */}
      <div className="pointer-events-none absolute inset-0 glow-brand" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />

      {/* Roda 3D — metade direita no desktop, fundo no mobile */}
      <div className="hero-wheel absolute inset-0 md:left-[38%]">
        <WheelCanvas
          progressRef={progressRef}
          spin={0.28}
          interactive
          tilt={[-0.16, -0.4]}
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 pt-24 md:px-10">
        <div className="max-w-2xl">
          <div className="hero-sub mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-mist backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-brand" />
            {site.city} · desde {site.since} · {site.years} anos
          </div>

          <h1 className="font-display text-[13vw] font-extrabold leading-[0.92] sm:text-6xl md:text-7xl">
            <span className="hero-line block overflow-hidden">
              <span className="block">Sua roda</span>
            </span>
            <span className="hero-line block overflow-hidden">
              <span className="block text-gradient">como saiu</span>
            </span>
            <span className="hero-line block overflow-hidden">
              <span className="block">de fábrica.</span>
            </span>
          </h1>

          <p className="hero-sub mt-6 max-w-lg text-base leading-relaxed text-slate-300 md:text-lg">
            A maior referência em conserto de rodas de liga leve de Curitiba.
            Desempeno sem usinagem, revitalização completa e diamantação — com{" "}
            <strong className="text-white">1 ano de garantia na pintura</strong>.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={waLinks.orcamento}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta btn btn-primary text-base"
            >
              Fazer orçamento agora
              <span aria-hidden>→</span>
            </a>
            <a href="#processo" className="hero-cta btn btn-ghost text-base">
              Ver o processo
            </a>
          </div>
        </div>
      </div>

    </section>
  );
}

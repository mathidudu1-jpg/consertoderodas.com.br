"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { site, waLinks } from "@/lib/site";

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const wheelImgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Entrada
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
          wheelRef.current,
          { opacity: 0, scale: 0.88, x: 60, duration: 1.5, ease: "expo.out" },
          "-=1.1"
        );

      // Flutuação suave contínua
      gsap.to(wheelImgRef.current, {
        y: 16,
        duration: 3.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // Parallax 3D com o mouse
      const onMove = (e: MouseEvent) => {
        const px = e.clientX / window.innerWidth - 0.5;
        const py = e.clientY / window.innerHeight - 0.5;
        gsap.to(wheelRef.current, {
          rotateY: px * 14,
          rotateX: -py * 10,
          x: px * 26,
          duration: 0.9,
          ease: "power2.out",
        });
      };
      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
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
      <div className="pointer-events-none absolute inset-0 glow-brand opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/40 via-transparent to-ink" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-6 px-5 pt-24 md:px-10 lg:grid-cols-2">
        <div className="max-w-2xl">
          <div className="hero-sub mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-mist backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-brand" />
            {site.city} · desde {site.since} · mais de {site.years} anos
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

          <div className="mt-9 flex flex-wrap items-center gap-3 pb-10">
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

        {/* Roda realista com parallax 3D */}
        <div
          className="relative hidden items-center justify-center lg:flex"
          style={{ perspective: "1100px" }}
        >
          {/* Backdrop de mesma cor do fundo da imagem (#0a0e17): funde o quadrado
              escuro da foto no hero, sem borda/corte visível */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[860px] w-[860px] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #0a0e17 0%, #0a0e17 42%, rgba(10,14,23,0) 72%)",
            }}
          />
          <div ref={wheelRef} className="relative" style={{ transformStyle: "preserve-3d" }}>
            <div
              ref={wheelImgRef}
              className="relative h-[580px] w-[580px] xl:h-[680px] xl:w-[680px]"
              style={{
                maskImage:
                  "radial-gradient(circle at 50% 50%, black 64%, transparent 84%)",
                WebkitMaskImage:
                  "radial-gradient(circle at 50% 50%, black 64%, transparent 84%)",
              }}
            >
              <Image
                src="/brand/hero-wheel.jpg"
                alt="Roda esportiva de liga leve com a logo RLL na calota"
                fill
                sizes="680px"
                priority
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

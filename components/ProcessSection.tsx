"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { steps } from "@/lib/site";

// Sequência gerada com Nano Banana Pro: a mesma roda, no mesmo ângulo 3/4 e
// iluminação azul da hero, atravessando as 10 etapas do conserto.
const stepSrc = (n: number) => `/process/etapa-${String(n).padStart(2, "0")}.jpg`;

export default function ProcessSection() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const busyRef = useRef(false);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const go = useCallback((next: number) => {
    const target = (next + steps.length) % steps.length;
    if (target === activeRef.current || busyRef.current) return;
    busyRef.current = true;
    // Failsafe: nunca deixa o lock preso se o rAF atrasar (aba oculta etc.)
    window.setTimeout(() => {
      busyRef.current = false;
    }, 1000);

    const wrap = imgWrapRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!wrap || reduce) {
      activeRef.current = target;
      setActive(target);
      busyRef.current = false;
      return;
    }

    // Camada que sai (screenshot da imagem atual) — crossfade fluido
    const current = wrap.querySelector<HTMLElement>("[data-layer=current]");
    if (current) {
      const ghost = current.cloneNode(true) as HTMLElement;
      ghost.dataset.layer = "ghost";
      ghost.style.position = "absolute";
      ghost.style.inset = "0";
      ghost.style.zIndex = "2";
      wrap.appendChild(ghost);

      activeRef.current = target;
      setActive(target);

      gsap.set(current, { opacity: 0, scale: 1.07 });
      gsap.to(ghost, {
        opacity: 0,
        scale: 0.985,
        duration: 0.55,
        ease: "power2.inOut",
        onComplete: () => ghost.remove(),
      });
      gsap.to(current, {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "expo.out",
        delay: 0.05,
        onComplete: () => {
          busyRef.current = false;
        },
      });
    } else {
      activeRef.current = target;
      setActive(target);
      busyRef.current = false;
    }

    // Texto entra de novo
    if (textRef.current) {
      gsap.fromTo(
        textRef.current.children,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.06 }
      );
    }
  }, []);

  // Teclado ← → quando a seção está visível
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const sec = sectionRef.current;
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const visible = r.top < window.innerHeight * 0.7 && r.bottom > window.innerHeight * 0.3;
      if (!visible) return;
      if (e.key === "ArrowRight") go(activeRef.current + 1);
      if (e.key === "ArrowLeft") go(activeRef.current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const step = steps[active];

  return (
    <section
      ref={sectionRef}
      id="processo"
      className="relative overflow-hidden bg-ink py-24 tech-grid md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 glow-brand opacity-60" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-10 bg-brand" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">
            O processo · 10 etapas
          </span>
        </div>
        <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-tight text-balance md:text-6xl">
          Acompanhe uma roda <span className="text-gradient">renascendo</span>
        </h2>
        <p className="mt-4 max-w-2xl text-slate-300">
          Navegue pelas etapas e veja, por dentro da oficina, a transformação
          completa — de como a roda chega até a entrega impecável.
        </p>

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Imagem da etapa */}
          <div className="relative">
            <div
              ref={imgWrapRef}
              className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/10 bg-ink-800"
            >
              <div data-layer="current" className="absolute inset-0 will-change-transform">
                <Image
                  src={stepSrc(step.n)}
                  alt={`Etapa ${step.n}: ${step.title}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={step.n <= 2}
                />
              </div>

              {/* Setas sobre a imagem */}
              <div className="absolute inset-x-4 top-1/2 z-10 flex -translate-y-1/2 justify-between">
                <button
                  aria-label="Etapa anterior"
                  onClick={() => go(activeRef.current - 1)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-ink/60 text-xl text-white backdrop-blur transition hover:scale-110 hover:border-brand hover:bg-brand"
                >
                  ←
                </button>
                <button
                  aria-label="Próxima etapa"
                  onClick={() => go(activeRef.current + 1)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-ink/60 text-xl text-white backdrop-blur transition hover:scale-110 hover:border-brand hover:bg-brand"
                >
                  →
                </button>
              </div>
            </div>

            {/* Pré-carrega vizinhas */}
            <div className="hidden">
              <Image src={stepSrc(((active + 1) % steps.length) + 1)} alt="" width={16} height={16} />
              <Image src={stepSrc(((active - 1 + steps.length) % steps.length) + 1)} alt="" width={16} height={16} />
            </div>
          </div>

          {/* Texto da etapa */}
          <div>
            <div ref={textRef}>
              <div className="flex items-baseline gap-4">
                <span className="font-display text-6xl font-extrabold text-brand md:text-8xl">
                  {String(step.n).padStart(2, "0")}
                </span>
                <h3 className="font-display text-3xl font-bold md:text-5xl">{step.title}</h3>
              </div>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-mist">
                {step.short}
              </p>
              <p className="mt-5 max-w-md text-base leading-relaxed text-slate-300 md:text-lg">
                {step.desc}
              </p>
            </div>

            {/* Controles */}
            <div className="mt-9 flex items-center gap-4">
              <button
                aria-label="Etapa anterior"
                onClick={() => go(activeRef.current - 1)}
                className="btn btn-ghost px-5"
              >
                ← Anterior
              </button>
              <button
                aria-label="Próxima etapa"
                onClick={() => go(activeRef.current + 1)}
                className="btn btn-primary px-5"
              >
                Próxima →
              </button>
              <span className="ml-1 text-sm tabular-nums text-slate-400">
                {step.n} / {steps.length}
              </span>
            </div>

            {/* Ticks clicáveis */}
            <div className="mt-7 grid max-w-md grid-cols-10 gap-1.5">
              {steps.map((s, i) => (
                <button
                  key={s.n}
                  onClick={() => go(i)}
                  aria-label={`Ir para etapa ${s.n}: ${s.title}`}
                  title={s.title}
                  className={`flex h-9 items-center justify-center rounded-md border text-[11px] font-semibold transition-all duration-300 ${
                    i === active
                      ? "border-brand bg-brand text-white"
                      : i < active
                        ? "border-brand/50 bg-brand/15 text-mist hover:bg-brand/25"
                        : "border-white/10 bg-white/[0.03] text-slate-500 hover:border-white/30 hover:text-slate-300"
                  }`}
                >
                  {s.n}
                </button>
              ))}
            </div>

            {/* Barra de progresso */}
            <div className="mt-4 h-[3px] w-full max-w-md overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-700 via-brand to-mist transition-all duration-500"
                style={{ width: `${((active + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

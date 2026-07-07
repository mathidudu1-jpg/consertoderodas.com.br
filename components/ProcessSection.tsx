"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { steps } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

const WheelCanvas = dynamic(() => import("./WheelCanvas"), { ssr: false });

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    // Sem pin no reduced-motion: só revela o estado final
    if (reduce) {
      progressRef.current = 1;
      setActive(steps.length - 1);
      return;
    }

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${steps.length * 60}%`,
        pin: pin,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;
          if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
          const idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
          setActive((prev) => (prev === idx ? prev : idx));
        },
      });
      return () => st.kill();
    }, section);

    return () => ctx.revert();
  }, []);

  const step = steps[active];

  return (
    <section ref={sectionRef} id="processo" className="relative bg-ink">
      <div
        ref={pinRef}
        className="relative h-[100svh] w-full overflow-hidden tech-grid"
      >
        {/* Glow de fundo */}
        <div className="pointer-events-none absolute inset-0 glow-brand opacity-70" />

        <div className="mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-6 px-5 md:grid-cols-2 md:px-10">
          {/* Texto da etapa */}
          <div className="order-2 md:order-1">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-brand" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">
                O Processo · 10 etapas
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <span
                key={step.n}
                className="font-display text-6xl font-extrabold text-brand md:text-8xl"
                style={{ animation: "fadeUp .5s var(--ease-out-expo)" }}
              >
                {String(step.n).padStart(2, "0")}
              </span>
              <h3
                key={`t-${step.n}`}
                className="font-display text-3xl font-bold md:text-5xl"
                style={{ animation: "fadeUp .5s var(--ease-out-expo)" }}
              >
                {step.title}
              </h3>
            </div>

            <p
              key={`d-${step.n}`}
              className="mt-5 max-w-md text-base leading-relaxed text-slate-300 md:text-lg"
              style={{ animation: "fadeUp .6s var(--ease-out-expo)" }}
            >
              {step.desc}
            </p>

            {/* Barra de progresso */}
            <div className="mt-8 h-[3px] w-full max-w-md overflow-hidden rounded-full bg-white/10">
              <div
                ref={barRef}
                className="h-full origin-left rounded-full bg-gradient-to-r from-brand-700 via-brand to-mist"
                style={{ transform: "scaleX(0)" }}
              />
            </div>

            {/* Ticks das etapas */}
            <div className="mt-6 hidden max-w-md grid-cols-10 gap-1.5 md:grid">
              {steps.map((s, i) => (
                <div
                  key={s.n}
                  className={`h-8 rounded-md border text-[10px] font-semibold transition-all duration-300 ${
                    i <= active
                      ? "border-brand/60 bg-brand/15 text-mist"
                      : "border-white/10 bg-white/[0.02] text-slate-500"
                  } flex items-center justify-center`}
                  title={s.title}
                >
                  {s.n}
                </div>
              ))}
            </div>
          </div>

          {/* Roda 3D */}
          <div className="order-1 h-[42svh] w-full md:order-2 md:h-[80svh]">
            <WheelCanvas progressRef={progressRef} spin={0.15} />
          </div>
        </div>

        {/* Dica de scroll */}
        <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.25em] text-slate-500">
          role para acompanhar ↓
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

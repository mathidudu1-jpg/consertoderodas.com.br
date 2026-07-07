"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { to: 32, suffix: "", label: "anos de estrada" },
  { to: 50, suffix: "mil+", label: "rodas recuperadas" },
  { to: 1, suffix: " ano", label: "de garantia na pintura" },
  { to: 18, suffix: "x", label: "para comprar rodas novas" },
];

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray<HTMLElement>(".stat-num");
      nums.forEach((n) => {
        const target = Number(n.dataset.to);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
          onUpdate: () => {
            n.textContent = Math.round(obj.v).toString();
          },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className="border-y border-white/10 bg-ink-800/50">
      <div
        ref={ref}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-14 md:grid-cols-4 md:px-10"
      >
        {stats.map((s) => (
          <div key={s.label} className="text-center md:text-left">
            <div className="font-display text-4xl font-extrabold text-white md:text-6xl">
              <span className="stat-num" data-to={s.to}>
                0
              </span>
              <span className="text-brand">{s.suffix}</span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

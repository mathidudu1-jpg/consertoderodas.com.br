"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";
import { site } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

export default function History() {
  const imgWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = imgWrap.current;
    if (!el) return;
    const img = el.querySelector("img");
    if (!img) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img,
        { yPercent: -12, scale: 1.15 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="historia" className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 md:grid-cols-2 md:px-10">
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-brand" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">
              Nossa história
            </span>
          </div>
          <h2 className="font-display text-4xl font-extrabold leading-tight md:text-5xl">
            Três gerações fazendo <span className="text-gradient">roda ficar nova</span>
          </h2>
          <div className="mt-6 space-y-4 text-slate-300">
            <p>
              Começamos em <strong className="text-white">{site.since}</strong>, num tempo
              em que consertar roda de liga leve ainda era arte de poucos. De lá pra cá,
              atravessamos {site.years} anos aprendendo, inventando ferramentas e
              atendendo Curitiba peça por peça.
            </p>
            <p>
              O <strong className="text-white">Gabarito RLL</strong> — nosso método
              exclusivo de desempeno sem usinagem e sem calor — nasceu dessa bancada.
              É por isso que somos a maior referência de consertos da cidade.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <Image
              src="/brand/5-estrelas.png"
              alt="Avaliação 5 estrelas no Google"
              width={90}
              height={90}
              className="h-16 w-16 object-contain"
            />
            <div>
              <div className="font-display text-2xl font-bold text-white">5,0 ★</div>
              <p className="text-sm text-slate-400">Avaliação dos clientes no Google</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div
            ref={imgWrap}
            className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 md:h-[560px]"
          >
            <Image
              src="/gallery/g6.jpg"
              alt="Equipe da Rodas de Liga Leve nos primeiros anos"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 rounded-xl bg-ink/70 px-4 py-2 text-sm text-mist backdrop-blur">
              Onde tudo começou — a família na porta da oficina
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

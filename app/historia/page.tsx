import type { Metadata } from "next";
import Image from "next/image";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsappFab from "@/components/WhatsappFab";
import Reveal from "@/components/Reveal";
import { site, timeline, waLinks } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nossa História",
  description:
    "De 1993 até hoje: como Luiz e Olga Witkovski transformaram uma oficina no Xaxim na maior referência em conserto de rodas de liga leve de Curitiba.",
};

export default function HistoriaPage() {
  return (
    <SmoothScroll>
      <Header />
      <main>
        {/* Hero da página */}
        <section className="relative overflow-hidden tech-grid pb-20 pt-40 md:pb-28">
          <div className="pointer-events-none absolute inset-0 glow-brand opacity-50" />
          <div className="relative mx-auto max-w-7xl px-5 md:px-10">
            <Reveal>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-10 bg-brand" />
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">
                  Nossa história
                </span>
              </div>
              <h1 className="max-w-4xl font-display text-5xl font-extrabold leading-[1.02] text-balance md:text-7xl">
                Uma tradição familiar construída com{" "}
                <span className="text-gradient">amor e dedicação</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
                Em {site.since}, {site.founders} transformaram um sonho em
                realidade no coração do bairro Xaxim. Hoje, a Rodas de Liga Leve
                é a maior referência em conserto e revitalização de rodas de
                Curitiba — com mais de 50.000 rodas restauradas.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Foto histórica */}
        <section className="relative pb-24">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <Reveal>
              <div className="relative h-[380px] overflow-hidden rounded-3xl border border-white/10 md:h-[560px]">
                <Image
                  src="/gallery/g6.jpg"
                  alt="A família Witkovski na porta da oficina, nos primeiros anos"
                  fill
                  sizes="(max-width: 1280px) 100vw, 1200px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 rounded-xl bg-ink/70 px-4 py-2 text-sm text-mist backdrop-blur">
                  Onde tudo começou — a família na porta da oficina, anos 90
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Linha do tempo */}
        <section className="section-light py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <Reveal>
              <h2 className="max-w-2xl font-display text-4xl font-extrabold leading-tight text-ink md:text-5xl">
                Três décadas, <span className="text-gradient">um mesmo cuidado</span>
              </h2>
            </Reveal>

            <div className="relative mt-14">
              {/* Linha vertical */}
              <span className="absolute bottom-0 left-[19px] top-0 w-px bg-slate-300 md:left-1/2" />

              <Reveal className="space-y-12" childrenStagger stagger={0.12}>
                {timeline.map((t, i) => (
                  <div
                    key={t.year}
                    className={`relative grid grid-cols-[40px_1fr] items-start gap-6 md:grid-cols-2 md:gap-16 ${
                      i % 2 ? "md:text-left" : "md:text-right"
                    }`}
                  >
                    {/* Ponto */}
                    <span className="z-10 mt-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#f6f8fc] bg-brand text-[10px] font-bold text-white md:absolute md:left-1/2 md:-translate-x-1/2">
                      {t.year.slice(2)}
                    </span>

                    <div
                      className={`md:col-span-1 ${
                        i % 2 ? "md:col-start-2 md:pl-16" : "md:col-start-1 md:pr-16"
                      }`}
                    >
                      <span className="font-display text-3xl font-extrabold text-brand">
                        {t.year}
                      </span>
                      <h3 className="mt-1 font-display text-xl font-bold text-ink">
                        {t.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {t.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* Números + valores */}
        <section className="py-24 md:py-28">
          <div className="mx-auto max-w-7xl px-5 md:px-10">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              <Reveal>
                <div className="font-display text-5xl font-extrabold text-white">
                  50<span className="text-brand">mil+</span>
                </div>
                <p className="mt-2 text-slate-400">
                  rodas restauradas desde {site.since} — cada uma medida,
                  desempenada e pintada como se fosse a primeira.
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <div className="font-display text-5xl font-extrabold text-white">
                  100<span className="text-brand">%</span>
                </div>
                <p className="mt-2 text-slate-400">
                  satisfação garantida, com 1 ano de garantia na pintura e nota
                  5,0 dos clientes no Google.
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <div className="flex items-center gap-4">
                  <Image
                    src="/brand/5-estrelas.png"
                    alt="Avaliação 5 estrelas no Google"
                    width={72}
                    height={72}
                    className="h-16 w-16 object-contain"
                  />
                  <div className="font-display text-5xl font-extrabold text-white">
                    5,0<span className="text-brand">★</span>
                  </div>
                </div>
                <p className="mt-2 text-slate-400">
                  a confiança de Curitiba, construída peça por peça, de pai para
                  filho.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden pb-28">
          <div className="pointer-events-none absolute inset-0 glow-brand opacity-60" />
          <Reveal className="relative mx-auto max-w-3xl px-5 text-center">
            <h2 className="font-display text-4xl font-extrabold leading-tight text-balance md:text-5xl">
              Faça parte dessa <span className="text-gradient">história</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">
              Traga sua roda para quem cuida disso há mais de {site.years} anos.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={waLinks.orcamento}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-base"
              >
                Fazer orçamento →
              </a>
              <a href="/#processo" className="btn btn-ghost text-base">
                Ver o processo
              </a>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
      <WhatsappFab />
    </SmoothScroll>
  );
}

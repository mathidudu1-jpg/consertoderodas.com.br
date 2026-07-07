import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import ProcessSection from "@/components/ProcessSection";
import Services from "@/components/Services";
import History from "@/components/History";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsappFab from "@/components/WhatsappFab";
import Reveal from "@/components/Reveal";
import { waLinks } from "@/lib/site";

export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <main>
        <Hero />
        <Stats />
        <ProcessSection />
        <Services />
        <History />
        <Gallery />
        <Testimonials />

        {/* CTA final */}
        <section className="relative overflow-hidden py-24 md:py-28">
          <div className="pointer-events-none absolute inset-0 glow-brand opacity-80" />
          <Reveal className="mx-auto max-w-4xl px-5 text-center md:px-10">
            <h2 className="font-display text-4xl font-extrabold leading-tight text-balance md:text-6xl">
              Sua roda merece <span className="text-gradient">sair como nova</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-slate-300">
              Mande uma foto no WhatsApp e receba seu orçamento hoje mesmo. Sem
              compromisso, com 32 anos de garantia de experiência.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href={waLinks.orcamento}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-base"
              >
                Fazer orçamento agora →
              </a>
              <a href="#processo" className="btn btn-ghost text-base">
                Rever o processo
              </a>
            </div>
          </Reveal>
        </section>

        <Contact />
      </main>
      <Footer />
      <WhatsappFab />
    </SmoothScroll>
  );
}

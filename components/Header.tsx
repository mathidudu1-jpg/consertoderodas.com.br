"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { site, waLinks } from "@/lib/site";

const nav = [
  { label: "Processo", href: "#processo" },
  { label: "Serviços", href: "#servicos" },
  { label: "História", href: "#historia" },
  { label: "Galeria", href: "#galeria" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "border-b border-white/10 bg-ink/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-10">
        <a href="#top" className="flex items-center gap-3">
          <Image
            src="/brand/logo-white.png"
            alt="Rodas de Liga Leve"
            width={120}
            height={40}
            className="h-8 w-auto"
            priority
          />
          <span className="hidden text-sm font-semibold tracking-wide text-white/90 sm:block">
            Rodas de Liga Leve
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="group relative text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLinks.orcamento}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary hidden sm:inline-flex"
          >
            Orçamento no Zap
          </a>
          <button
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 lg:hidden"
          >
            <span className="text-lg">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="border-t border-white/10 bg-ink/95 px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base text-slate-200 hover:bg-white/5"
              >
                {n.label}
              </a>
            ))}
            <a
              href={waLinks.orcamento}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-2 justify-center"
            >
              Orçamento no WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

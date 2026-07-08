import Image from "next/image";
import { site } from "@/lib/site";
import DevCredit from "./DevCredit";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-10">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <Image
              src="/brand/logo-white.png"
              alt="Rodas de Liga Leve"
              width={140}
              height={46}
              className="h-9 w-auto"
            />
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {site.tagline}. A maior referência em conserto de rodas de liga leve
              de {site.city}, desde {site.since}.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <h4 className="mb-3 font-semibold text-white">Navegar</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#processo" className="hover:text-white">Processo</a></li>
                <li><a href="#servicos" className="hover:text-white">Serviços</a></li>
                <li><a href="#galeria" className="hover:text-white">Galeria</a></li>
                <li><a href="#contato" className="hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-white">Contato</h4>
              <ul className="space-y-2 text-slate-400">
                <li>{site.phoneDisplay}</li>
                <li>Xaxim, Curitiba – PR</li>
                <li>
                  <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
                </li>
                <li>
                  <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white">YouTube</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex-row">
          <p>© {site.since}–2026 {site.legalName}. Todos os direitos reservados.</p>
          <DevCredit />
        </div>
      </div>
    </footer>
  );
}

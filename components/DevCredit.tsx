"use client";

import { useEffect, useState } from "react";

const DEV = {
  name: "Matheus Vuicik",
  email: "matheuseduardovuicik@gmail.com",
  whatsappRaw: "5541996521727",
  whatsappDisplay: "(41) 99652-1727",
};

export default function DevCredit() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-slate-500 transition hover:text-mist"
      >
        Produzido pelo <span className="font-semibold text-slate-400 group-hover:text-white">Dev. Matheus Vuicik</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-5"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div
            className="glass relative z-10 w-full max-w-sm rounded-3xl border border-white/10 p-8 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar"
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand font-display text-lg font-bold text-white">
                MV
              </span>
              <div>
                <p className="font-display text-lg font-bold text-white">{DEV.name}</p>
                <p className="text-xs text-mist">Desenvolvedor de Software</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <a
                href={`mailto:${DEV.email}`}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-brand hover:bg-white/10"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/15 text-brand">✉</span>
                <span className="min-w-0 flex-1 truncate">{DEV.email}</span>
              </a>
              <a
                href={`https://api.whatsapp.com/send?phone=${DEV.whatsappRaw}&text=${encodeURIComponent("Olá Matheus! Vi seu trabalho e gostaria de conversar.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-[#25D366] hover:bg-white/10"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366]/20 text-[#25D366]">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
                    <path d="M12.04 2c-5.46 0-9.9 4.43-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.9-4.43 9.9-9.9S17.5 2 12.04 2zm4.52 11.99c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.98-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42l-.48-.01c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.25 3.74.59.26 1.06.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
                  </svg>
                </span>
                <span>{DEV.whatsappDisplay}</span>
              </a>
            </div>

            <p className="mt-5 text-center text-[11px] text-slate-500">
              Sites, sistemas e experiências digitais sob medida.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

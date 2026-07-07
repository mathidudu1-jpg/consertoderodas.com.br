"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";

/**
 * Slider antes/depois. "Antes" usa filtro para simular a roda castigada;
 * "Depois" mostra a peça restaurada. Arraste ou toque para comparar.
 */
export default function BeforeAfter() {
  const [pos, setPos] = useState(52);
  const wrap = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(2, Math.min(98, p)));
  }, []);

  return (
    <div
      ref={wrap}
      className="relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden rounded-3xl border border-white/10"
      onMouseDown={(e) => {
        dragging.current = true;
        setFromClientX(e.clientX);
      }}
      onMouseMove={(e) => dragging.current && setFromClientX(e.clientX)}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={(e) => setFromClientX(e.touches[0].clientX)}
      onTouchMove={(e) => setFromClientX(e.touches[0].clientX)}
    >
      {/* Depois (base) */}
      <Image
        src="/brand/roda.png"
        alt="Roda restaurada"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
      />
      <span className="absolute right-4 top-4 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
        DEPOIS
      </span>

      {/* Antes (recorte com filtro) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src="/brand/roda.png"
          alt="Roda antes do conserto"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          style={{
            filter: "grayscale(1) brightness(0.55) contrast(1.25) sepia(0.25)",
          }}
        />
        <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
          ANTES
        </span>
      </div>

      {/* Divisor */}
      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-white"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-brand text-white shadow-lg">
          <span className="text-sm">↔</span>
        </div>
      </div>
    </div>
  );
}

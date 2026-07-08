import type { Metadata } from "next";
import Image from "next/image";
import { supabaseAdmin, mapOrder } from "@/lib/supabaseAdmin";
import { site, waLinks } from "@/lib/site";
import { catalog, processStages, statusLabels } from "@/lib/shop";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Acompanhamento do pedido", robots: { index: false, follow: false } };

const svc = (id: string) => catalog.find((c) => c.id === id)?.name ?? id;
const fmt = (iso?: string) => (iso ? new Date(iso).toLocaleDateString("pt-BR") : "—");

export default async function TrackPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const { data } = await supabaseAdmin().from("orders").select("*").eq("code", decodeURIComponent(code)).maybeSingle();
  const o = data ? mapOrder(data) : null;

  return (
    <main className="min-h-screen bg-ink tech-grid text-slate-100">
      <div className="glow-brand pointer-events-none fixed inset-0 opacity-40" />
      <div className="relative mx-auto max-w-2xl px-5 py-12">
        <a href="/" className="mb-8 flex items-center gap-3">
          <Image src="/brand/logo-white.png" alt="Rodas de Liga Leve" width={120} height={40} className="h-8 w-auto" />
        </a>

        {!o ? (
          <div className="glass rounded-3xl border border-white/10 p-8 text-center">
            <p className="font-display text-2xl font-bold">Pedido não encontrado</p>
            <p className="mt-2 text-slate-400">Confira o código do seu pedido ou fale com a gente.</p>
            <a href={waLinks.orcamento} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-6">Falar no WhatsApp</a>
          </div>
        ) : (
          <div className="glass overflow-hidden rounded-3xl border border-white/10">
            <div className="border-b border-white/10 p-6 md:p-8">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-mist">{o.code}</span>
                <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "rgba(15,87,251,.15)", color: "#bfd1ff" }}>{statusLabels[o.status as keyof typeof statusLabels] ?? o.status}</span>
              </div>
              <h1 className="mt-3 font-display text-3xl font-extrabold md:text-4xl">Olá, {o.customerName.split(" ")[0]}! 👋</h1>
              <p className="mt-2 text-slate-300">Acompanhe a revitalização da sua roda em tempo real.</p>
              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Serviço</p><p className="font-medium">{svc(o.serviceId)}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Veículo</p><p className="font-medium">{o.vehicle || "—"}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Rodas</p><p className="font-medium">{o.wheels}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Previsão de entrega</p><p className="font-medium">{fmt(o.dueAt)}</p></div>
              </div>
            </div>

            {/* progresso */}
            <div className="p-6 md:p-8">
              {o.status === "cancelado" ? (
                <p className="text-slate-400">Este pedido foi cancelado. Fale com a gente para mais informações.</p>
              ) : (
                <>
                  <div className="mb-5 flex items-center justify-between text-sm">
                    <span className="text-slate-300">{o.status === "entregue" ? "Pedido entregue ✅" : o.status === "pronto" ? "Pronto para retirada 🎉" : `Etapa ${o.stage} de 10`}</span>
                    <span className="font-bold text-brand">{Math.round((o.stage / 10) * 100)}%</span>
                  </div>
                  <div className="mb-8 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-brand-700 via-brand to-mist" style={{ width: `${(o.stage / 10) * 100}%` }} /></div>
                  <ol className="space-y-2.5">
                    {processStages.map((s, i) => {
                      const done = i + 1 < o.stage, current = i + 1 === o.stage;
                      return (
                        <li key={s} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${current ? "border-brand bg-brand/10" : done ? "border-white/5 bg-white/[0.02]" : "border-white/5 opacity-50"}`}>
                          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${done || current ? "bg-brand text-white" : "bg-white/10 text-slate-400"}`}>{done ? "✓" : i + 1}</span>
                          <span className={`text-sm ${current ? "font-semibold text-white" : "text-slate-300"}`}>{s}</span>
                          {current && <span className="ml-auto text-xs text-mist">em andamento</span>}
                        </li>
                      );
                    })}
                  </ol>
                </>
              )}
            </div>

            <div className="border-t border-white/10 p-6 text-center md:p-8">
              <p className="text-sm text-slate-400">Dúvidas sobre seu pedido?</p>
              <a href={`https://api.whatsapp.com/send?phone=${site.phoneRaw}&text=${encodeURIComponent(`Olá! Sobre meu pedido ${o.code}…`)}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-3">Falar no WhatsApp</a>
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-slate-500">{site.legalName} · {site.phoneDisplay}</p>
      </div>
    </main>
  );
}

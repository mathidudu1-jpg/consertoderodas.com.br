"use client";

import { useEffect, useMemo, useState } from "react";
import {
  loadShop, saveShop, resetShop, brl,
  catalog, serviceName, processStages, statusLabels, apptStatusLabels,
  type ShopData, type Order, type OrderStatus, type Appointment, type AppointmentStatus,
} from "@/lib/shop";

/* ---------------- helpers de data ---------------- */
const todayISO = () => new Date().toISOString().slice(0, 10);
const daysAgo = (iso: string) =>
  Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
const fmtDate = (ymd: string) => ymd.split("-").reverse().join("/");
const monthNames = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/* ---------------- gráficos SVG (sem libs) ---------------- */
function VBars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex h-40 items-end gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-md bg-gradient-to-t from-brand-700 to-brand transition-all"
              style={{ height: `${(d.value / max) * 100}%`, minHeight: 4 }}
              title={brl(d.value)}
            />
          </div>
          <span className="text-[10px] text-slate-500">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function HBars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3 text-sm">
          <span className="w-36 shrink-0 truncate text-slate-300">{d.label}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full bg-brand" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <span className="w-8 text-right text-xs text-slate-400">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

function Donut({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let acc = 0;
  const R = 52, C = 2 * Math.PI * R;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90">
        {data.map((d) => {
          const frac = d.value / total;
          const dash = frac * C;
          const el = (
            <circle key={d.label} cx="70" cy="70" r={R} fill="none" stroke={d.color}
              strokeWidth="16" strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-acc} />
          );
          acc += dash;
          return el;
        })}
        <circle cx="70" cy="70" r="36" fill="#0a0e17" />
      </svg>
      <ul className="space-y-1.5 text-sm">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            {d.label} <span className="text-slate-500">({d.value})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- login ---------------- */
function Login({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 tech-grid">
      <div className="glow-brand pointer-events-none absolute inset-0 opacity-40" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (pw === "rll2026") { sessionStorage.setItem("rll_admin_ok", "1"); onOk(); }
          else setErr(true);
        }}
        className="glass relative z-10 w-full max-w-sm rounded-3xl border border-white/10 p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand font-display font-bold text-white">RLL</span>
          <div>
            <p className="font-display text-lg font-bold leading-none">Painel da Oficina</p>
            <p className="text-xs text-slate-400">Rodas de Liga Leve</p>
          </div>
        </div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Senha de acesso</label>
        <input
          type="password" autoFocus value={pw}
          onChange={(e) => { setPw(e.target.value); setErr(false); }}
          className="w-full rounded-xl border border-white/10 bg-ink-800 px-3 py-2.5 text-white outline-none focus:border-brand"
          placeholder="••••••••"
        />
        {err && <p className="mt-2 text-xs text-red-400">Senha incorreta.</p>}
        <button className="btn btn-primary mt-5 w-full justify-center">Entrar</button>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-500">
          Demonstração · senha <code className="text-slate-400">rll2026</code>. Dados salvos
          localmente no navegador.
        </p>
      </form>
    </div>
  );
}

/* ---------------- KPI card ---------------- */
function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-brand/40 bg-brand/10" : "border-white/10 bg-white/[0.03]"}`}>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1.5 font-display text-3xl font-extrabold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "agendamentos", label: "Agendamentos", icon: "🗓" },
  { id: "ordens", label: "Ordens de Serviço", icon: "🔧" },
  { id: "clientes", label: "Clientes", icon: "👥" },
  { id: "servicos", label: "Serviços & Preços", icon: "🏷" },
] as const;
type View = (typeof NAV)[number]["id"];

const statusColors: Record<OrderStatus, string> = {
  aguardando: "#eab308",
  em_andamento: "#0f57fb",
  pronto: "#22c55e",
  entregue: "#64748b",
  cancelado: "#ef4444",
};

export default function AdminApp() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<ShopData | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem("rll_admin_ok") === "1");
    setData(loadShop());
    setReady(true);
    const onUpd = () => setData(loadShop());
    window.addEventListener("rll-shop-updated", onUpd);
    return () => window.removeEventListener("rll-shop-updated", onUpd);
  }, []);

  function mutate(fn: (d: ShopData) => void) {
    setData((prev) => {
      if (!prev) return prev;
      const next: ShopData = JSON.parse(JSON.stringify(prev));
      fn(next);
      saveShop(next);
      return next;
    });
  }

  if (!ready) return <div className="min-h-screen bg-ink" />;
  if (!authed) return <Login onOk={() => setAuthed(true)} />;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-ink-800/80 backdrop-blur-xl transition-transform lg:translate-x-0 ${sidebar ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand font-display text-sm font-bold text-white">RLL</span>
          <div>
            <p className="font-display text-sm font-bold leading-none">Painel</p>
            <p className="text-[11px] text-slate-400">Rodas de Liga Leve</p>
          </div>
        </div>
        <nav className="space-y-1 p-3">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => { setView(n.id); setSidebar(false); }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                view === n.id ? "bg-brand text-white" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <span className="text-base">{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div className="absolute inset-x-0 bottom-0 space-y-2 border-t border-white/10 p-3">
          <button onClick={() => { if (confirm("Restaurar dados de demonstração?")) { resetShop(); setData(loadShop()); } }}
            className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-400 hover:bg-white/5">↺ Restaurar demo</button>
          <button onClick={() => { sessionStorage.removeItem("rll_admin_ok"); setAuthed(false); }}
            className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-400 hover:bg-white/5">⎋ Sair</button>
        </div>
      </aside>
      {sidebar && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebar(false)} />}

      {/* Conteúdo */}
      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-ink/80 px-5 py-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebar(true)}>☰</button>
            <h1 className="font-display text-lg font-bold capitalize">{NAV.find((n) => n.id === view)?.label}</h1>
          </div>
          <a href="/" className="text-xs text-slate-400 hover:text-white">← Ver o site</a>
        </header>

        <div className="p-5 md:p-8">
          {view === "dashboard" && <Dashboard data={data} />}
          {view === "agendamentos" && <Appointments data={data} mutate={mutate} />}
          {view === "ordens" && <Orders data={data} mutate={mutate} />}
          {view === "clientes" && <Customers data={data} />}
          {view === "servicos" && <Services />}
        </div>
      </main>
    </div>
  );
}

/* ==================== DASHBOARD ==================== */
function Dashboard({ data }: { data: ShopData }) {
  const m = useMemo(() => {
    const entregues = data.orders.filter((o) => o.status === "entregue");
    const rev30 = entregues.filter((o) => daysAgo(o.createdAt) <= 30).reduce((s, o) => s + o.value, 0);
    const ticket = entregues.length ? entregues.reduce((s, o) => s + o.value, 0) / entregues.length : 0;
    const rodas30 = entregues.filter((o) => daysAgo(o.createdAt) <= 30).reduce((s, o) => s + o.wheels, 0);
    const hoje = data.appointments.filter((a) => a.date === todayISO() && a.status !== "cancelado");
    const andamento = data.orders.filter((o) => o.status === "em_andamento");
    const prontos = data.orders.filter((o) => o.status === "pronto");

    // receita 6 meses (histórico de exemplo + mês atual dos dados)
    const now = new Date();
    const base = [18200, 21400, 19800, 24600, 22100];
    const receita6 = base.map((v, i) => ({
      label: monthNames[(now.getMonth() - (5 - i) + 12) % 12],
      value: v,
    }));
    receita6.push({ label: monthNames[now.getMonth()], value: Math.max(rev30, 12000) });

    const porServico = catalog.map((c) => ({
      label: c.name, value: data.orders.filter((o) => o.serviceId === c.id).length,
    })).filter((x) => x.value > 0).sort((a, b) => b.value - a.value);

    const porStatus = (["aguardando", "em_andamento", "pronto", "entregue"] as OrderStatus[]).map((s) => ({
      label: statusLabels[s], value: data.orders.filter((o) => o.status === s).length, color: statusColors[s],
    }));

    return { rev30, ticket, rodas30, hoje, andamento, prontos, receita6, porServico, porStatus };
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Faturamento (30d)" value={brl(m.rev30)} sub={`${m.rodas30} rodas entregues`} accent />
        <Kpi label="Agendamentos hoje" value={String(m.hoje.length)} sub="próximos clientes" />
        <Kpi label="Em andamento" value={String(m.andamento.length)} sub={`${m.prontos.length} prontos p/ retirada`} />
        <Kpi label="Ticket médio" value={brl(m.ticket)} sub="por ordem entregue" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-2">
          <h3 className="mb-4 font-semibold">Faturamento · últimos 6 meses</h3>
          <VBars data={m.receita6} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-4 font-semibold">Ordens por status</h3>
          <Donut data={m.porStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-4 font-semibold">Serviços mais vendidos</h3>
          <HBars data={m.porServico} />
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h3 className="mb-4 font-semibold">Agenda de hoje</h3>
          {m.hoje.length === 0 ? (
            <p className="text-sm text-slate-400">Nenhum agendamento para hoje.</p>
          ) : (
            <ul className="space-y-2">
              {m.hoje.sort((a, b) => a.time.localeCompare(b.time)).map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5">
                  <span className="font-display text-sm font-bold text-brand">{a.time}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.customerName}</p>
                    <p className="truncate text-xs text-slate-400">{serviceName(a.serviceId)} · {a.vehicle}</p>
                  </div>
                  <StatusPill kind="appt" value={a.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==================== AGENDAMENTOS ==================== */
function StatusPill({ kind, value }: { kind: "appt" | "order"; value: string }) {
  const label = kind === "appt" ? apptStatusLabels[value as AppointmentStatus] : statusLabels[value as OrderStatus];
  const color = kind === "order"
    ? statusColors[value as OrderStatus]
    : ({ pendente: "#eab308", confirmado: "#0f57fb", concluido: "#22c55e", cancelado: "#ef4444" } as Record<string, string>)[value];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
      style={{ background: `${color}22`, color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} /> {label}
    </span>
  );
}

function Appointments({ data, mutate }: { data: ShopData; mutate: (fn: (d: ShopData) => void) => void }) {
  const [filter, setFilter] = useState<"todos" | AppointmentStatus>("todos");
  const list = data.appointments
    .filter((a) => filter === "todos" || a.status === filter)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const setStatus = (id: string, status: AppointmentStatus) =>
    mutate((d) => { const a = d.appointments.find((x) => x.id === id); if (a) a.status = status; });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["todos", "pendente", "confirmado", "concluido", "cancelado"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              filter === f ? "bg-brand text-white" : "border border-white/10 text-slate-300 hover:bg-white/5"
            }`}>
            {f === "todos" ? "Todos" : apptStatusLabels[f]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Data / hora</th><th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Serviço</th><th className="px-4 py-3">Origem</th>
              <th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {list.map((a) => (
              <tr key={a.id} className="hover:bg-white/[0.02]">
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="font-medium">{fmtDate(a.date)}</span> <span className="text-slate-400">{a.time}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{a.customerName}</p>
                  <p className="text-xs text-slate-400">{a.phone} · {a.vehicle || "—"}</p>
                </td>
                <td className="px-4 py-3">{serviceName(a.serviceId)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-md px-2 py-0.5 text-[11px] ${a.source === "site" ? "bg-brand/15 text-mist" : "bg-white/5 text-slate-400"}`}>
                    {a.source === "site" ? "Site" : "Manual"}
                  </span>
                </td>
                <td className="px-4 py-3"><StatusPill kind="appt" value={a.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    {a.status === "pendente" && (
                      <button onClick={() => setStatus(a.id, "confirmado")} className="rounded-lg bg-brand/15 px-2.5 py-1 text-xs text-mist hover:bg-brand/25">Confirmar</button>
                    )}
                    {(a.status === "pendente" || a.status === "confirmado") && (
                      <button onClick={() => setStatus(a.id, "concluido")} className="rounded-lg bg-green-500/15 px-2.5 py-1 text-xs text-green-300 hover:bg-green-500/25">Concluir</button>
                    )}
                    {a.status !== "cancelado" && a.status !== "concluido" && (
                      <button onClick={() => setStatus(a.id, "cancelado")} className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-400 hover:bg-red-500/15 hover:text-red-300">Cancelar</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">Nenhum agendamento.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ==================== ORDENS (Kanban) ==================== */
function Orders({ data, mutate }: { data: ShopData; mutate: (fn: (d: ShopData) => void) => void }) {
  const cols: OrderStatus[] = ["aguardando", "em_andamento", "pronto", "entregue"];
  const advance = (id: string) => mutate((d) => {
    const o = d.orders.find((x) => x.id === id); if (!o) return;
    if (o.status === "aguardando") o.status = "em_andamento";
    if (o.stage < 10) o.stage += 1;
    if (o.stage >= 10) o.status = o.status === "entregue" ? "entregue" : "pronto";
  });
  const setStatus = (id: string, s: OrderStatus) => mutate((d) => {
    const o = d.orders.find((x) => x.id === id); if (o) { o.status = s; if (s === "entregue") o.stage = 10; }
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cols.map((col) => {
        const items = data.orders.filter((o) => o.status === col);
        return (
          <div key={col} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span className="h-2 w-2 rounded-full" style={{ background: statusColors[col] }} />
                {statusLabels[col]}
              </span>
              <span className="text-xs text-slate-500">{items.length}</span>
            </div>
            <div className="space-y-3">
              {items.map((o) => (
                <div key={o.id} className="rounded-xl border border-white/10 bg-ink-800 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold text-brand">{o.code}</span>
                    <span className="text-[11px] text-slate-500">{o.wheels} roda{o.wheels > 1 ? "s" : ""}</span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold">{o.customerName}</p>
                  <p className="text-xs text-slate-400">{o.vehicle} · {o.plate}</p>
                  <p className="mt-1 text-xs text-mist">{serviceName(o.serviceId)}</p>

                  {/* progresso das 10 etapas */}
                  {o.status !== "entregue" && o.status !== "cancelado" && (
                    <div className="mt-3">
                      <div className="mb-1 flex items-center justify-between text-[10px] text-slate-400">
                        <span>Etapa {o.stage}/10 · {processStages[o.stage - 1]}</span>
                        <span>{Math.round((o.stage / 10) * 100)}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-brand" style={{ width: `${(o.stage / 10) * 100}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-bold">{brl(o.value)}</span>
                    <span className="text-[11px] text-slate-500">
                      {o.dueAt && daysAgo(o.dueAt) <= 0 ? `entrega ${fmtDate(o.dueAt.slice(0, 10))}` : "atrasada"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">Resp.: {o.tech}</p>

                  <div className="mt-3 flex gap-1.5">
                    {o.status !== "entregue" && o.status !== "cancelado" && (
                      <button onClick={() => advance(o.id)} className="flex-1 rounded-lg bg-brand/15 px-2 py-1.5 text-xs text-mist hover:bg-brand/25">
                        {o.stage >= 10 ? "Marcar pronto" : "Avançar etapa →"}
                      </button>
                    )}
                    {o.status === "pronto" && (
                      <button onClick={() => setStatus(o.id, "entregue")} className="flex-1 rounded-lg bg-green-500/15 px-2 py-1.5 text-xs text-green-300 hover:bg-green-500/25">Entregar</button>
                    )}
                  </div>
                </div>
              ))}
              {items.length === 0 && <p className="px-1 py-6 text-center text-xs text-slate-600">vazio</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ==================== CLIENTES ==================== */
function Customers({ data }: { data: ShopData }) {
  const rows = data.customers.map((c) => {
    const os = data.orders.filter((o) => o.customerId === c.id);
    const total = os.reduce((s, o) => s + o.value, 0);
    return { ...c, count: os.length, total };
  }).sort((a, b) => b.total - a.total);

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10">
      <table className="w-full min-w-[680px] text-sm">
        <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Contato</th>
            <th className="px-4 py-3">Veículo</th><th className="px-4 py-3 text-center">Ordens</th>
            <th className="px-4 py-3 text-right">Total gasto</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((c) => (
            <tr key={c.id} className="hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-sm font-bold text-mist">{c.name.charAt(0)}</span>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-[11px] text-slate-500">cliente há {Math.floor(daysAgo(c.since) / 30)} meses</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-300">{c.phone}</td>
              <td className="px-4 py-3"><p>{c.vehicle}</p><p className="text-[11px] text-slate-500">{c.plate}</p></td>
              <td className="px-4 py-3 text-center">{c.count}</td>
              <td className="px-4 py-3 text-right font-semibold">{brl(c.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ==================== SERVIÇOS ==================== */
function Services() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {catalog.map((c) => (
        <div key={c.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-bold">{c.name}</h3>
            <span className="whitespace-nowrap rounded-lg bg-brand/15 px-2.5 py-1 text-xs font-semibold text-mist">
              {c.price > 0 ? `${brl(c.price)}/${c.unit}` : "sob consulta"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.desc}</p>
          <p className="mt-3 text-xs text-slate-500">
            Prazo: {c.durationDays === 0 ? "no mesmo dia" : `${c.durationDays} dia${c.durationDays > 1 ? "s" : ""}`}
          </p>
        </div>
      ))}
    </div>
  );
}

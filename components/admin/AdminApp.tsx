"use client";

import { useEffect, useMemo, useState } from "react";
import {
  loadShop, saveShop, resetShop, brl, catalog, serviceName, processStages,
  statusLabels, apptStatusLabels, techs, nextOrderCode, newId,
  type ShopData, type OrderStatus, type Appointment, type AppointmentStatus,
} from "@/lib/shop";

/* ---------------- helpers ---------------- */
const todayISO = () => new Date().toISOString().slice(0, 10);
const daysAgo = (iso: string) => Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
const fmtDate = (ymd: string) => ymd.split("-").reverse().join("/");
const monthNames = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const times = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];

const statusColors: Record<OrderStatus, string> = {
  aguardando: "#d97706", em_andamento: "#0f57fb", pronto: "#16a34a", entregue: "#64748b", cancelado: "#dc2626",
};
const apptColors: Record<string, string> = { pendente: "#d97706", confirmado: "#0f57fb", concluido: "#16a34a", cancelado: "#dc2626" };

/* ---------------- gráficos SVG ---------------- */
function VBars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex h-40 items-end gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div className="w-full rounded-t-md bg-gradient-to-t from-brand-700 to-brand" style={{ height: `${(d.value / max) * 100}%`, minHeight: 4 }} title={brl(d.value)} />
          </div>
          <span className="text-[10px] text-slate-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
function HBars({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  if (!data.length) return <Empty small>Sem ordens ainda.</Empty>;
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3 text-sm">
          <span className="w-36 shrink-0 truncate text-slate-600">{d.label}</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-brand" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <span className="w-8 text-right text-xs text-slate-400">{d.value}</span>
        </div>
      ))}
    </div>
  );
}
function Donut({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return <Empty small>Sem ordens ainda.</Empty>;
  let acc = 0; const R = 52, C = 2 * Math.PI * R;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90">
        {data.map((d) => {
          const dash = (d.value / total) * C;
          const el = <circle key={d.label} cx="70" cy="70" r={R} fill="none" stroke={d.color} strokeWidth="16" strokeDasharray={`${dash} ${C - dash}`} strokeDashoffset={-acc} />;
          acc += dash; return el;
        })}
        <circle cx="70" cy="70" r="36" fill="#ffffff" />
      </svg>
      <ul className="space-y-1.5 text-sm">
        {data.filter((d) => d.value > 0).map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            {d.label} <span className="text-slate-400">({d.value})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- UI comuns ---------------- */
function Empty({ children, small }: { children: React.ReactNode; small?: boolean }) {
  return <div className={`flex items-center justify-center rounded-xl border border-dashed border-slate-200 text-slate-400 ${small ? "py-8 text-sm" : "py-16"}`}>{children}</div>;
}
function StatusPill({ kind, value }: { kind: "appt" | "order"; value: string }) {
  const label = kind === "appt" ? apptStatusLabels[value as AppointmentStatus] : statusLabels[value as OrderStatus];
  const color = kind === "order" ? statusColors[value as OrderStatus] : apptColors[value];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ background: `${color}18`, color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} /> {label}
    </span>
  );
}
function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-brand bg-brand text-white" : "border-slate-200 bg-white shadow-sm"}`}>
      <p className={`text-xs uppercase tracking-wide ${accent ? "text-white/80" : "text-slate-500"}`}>{label}</p>
      <p className={`mt-1.5 font-display text-3xl font-extrabold ${accent ? "text-white" : "text-slate-900"}`}>{value}</p>
      {sub && <p className={`mt-1 text-xs ${accent ? "text-white/80" : "text-slate-400"}`}>{sub}</p>}
    </div>
  );
}
const inputCls = "w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-brand";
const cardCls = "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "agendamentos", label: "Agendamentos", icon: "🗓" },
  { id: "ordens", label: "Ordens de Serviço", icon: "🔧" },
  { id: "clientes", label: "Clientes", icon: "👥" },
  { id: "servicos", label: "Serviços & Preços", icon: "🏷" },
] as const;
type View = (typeof NAV)[number]["id"];

/* ---------------- login ---------------- */
function Login({ onOk }: { onOk: () => void }) {
  const [pw, setPw] = useState(""); const [err, setErr] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-5">
      <form
        onSubmit={(e) => { e.preventDefault(); if (pw === "rll2026") { sessionStorage.setItem("rll_admin_ok", "1"); onOk(); } else setErr(true); }}
        className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-xl"
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand font-display font-bold text-white">RLL</span>
          <div><p className="font-display text-lg font-bold leading-none text-slate-900">Painel da Oficina</p><p className="text-xs text-slate-500">Rodas de Liga Leve</p></div>
        </div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">Senha de acesso</label>
        <input type="password" autoFocus value={pw} onChange={(e) => { setPw(e.target.value); setErr(false); }} className={inputCls} placeholder="••••••••" />
        {err && <p className="mt-2 text-xs text-red-500">Senha incorreta.</p>}
        <button className="btn btn-primary mt-5 w-full justify-center">Entrar</button>
        <p className="mt-4 text-center text-[11px] leading-relaxed text-slate-400">Demonstração · senha <code className="text-slate-500">rll2026</code>. Dados salvos localmente no navegador.</p>
      </form>
    </div>
  );
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<ShopData | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem("rll_admin_ok") === "1");
    setData(loadShop()); setReady(true);
    const onUpd = () => setData(loadShop());
    window.addEventListener("rll-shop-updated", onUpd);
    return () => window.removeEventListener("rll-shop-updated", onUpd);
  }, []);

  function mutate(fn: (d: ShopData) => void) {
    setData((prev) => { if (!prev) return prev; const next: ShopData = JSON.parse(JSON.stringify(prev)); fn(next); saveShop(next); return next; });
  }

  if (!ready) return <div className="min-h-screen bg-slate-100" />;
  if (!authed) return <Login onOk={() => setAuthed(true)} />;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${sidebar ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand font-display text-sm font-bold text-white">RLL</span>
          <div><p className="font-display text-sm font-bold leading-none text-slate-900">Painel</p><p className="text-[11px] text-slate-500">Rodas de Liga Leve</p></div>
        </div>
        <nav className="space-y-1 p-3">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => { setView(n.id); setSidebar(false); }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${view === n.id ? "bg-brand text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              <span className="text-base">{n.icon}</span> {n.label}
            </button>
          ))}
        </nav>
        <div className="absolute inset-x-0 bottom-0 space-y-1 border-t border-slate-200 p-3">
          <button onClick={() => { if (confirm("Zerar todos os dados do painel?")) { resetShop(); setData(loadShop()); } }} className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-500 hover:bg-slate-100">↺ Zerar dados</button>
          <button onClick={() => { sessionStorage.removeItem("rll_admin_ok"); setAuthed(false); }} className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-500 hover:bg-slate-100">⎋ Sair</button>
        </div>
      </aside>
      {sidebar && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebar(false)} />}

      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebar(true)}>☰</button>
            <h1 className="font-display text-lg font-bold text-slate-900">{NAV.find((n) => n.id === view)?.label}</h1>
          </div>
          <a href="/" className="text-xs text-slate-500 hover:text-brand">← Ver o site</a>
        </header>

        <div className="p-5 md:p-8">
          {view === "dashboard" && <Dashboard data={data} />}
          {view === "agendamentos" && <Appointments data={data} mutate={mutate} />}
          {view === "ordens" && <Orders data={data} mutate={mutate} />}
          {view === "clientes" && <Customers data={data} setView={setView} />}
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
    const now = new Date();
    const receita6 = Array.from({ length: 6 }).map((_, i) => {
      const monthIdx = (now.getMonth() - (5 - i) + 12) % 12;
      const val = entregues.filter((o) => new Date(o.createdAt).getMonth() === monthIdx).reduce((s, o) => s + o.value, 0);
      return { label: monthNames[monthIdx], value: val };
    });
    const porServico = catalog.map((c) => ({ label: c.name, value: data.orders.filter((o) => o.serviceId === c.id).length })).filter((x) => x.value > 0).sort((a, b) => b.value - a.value);
    const porStatus = (["aguardando", "em_andamento", "pronto", "entregue"] as OrderStatus[]).map((s) => ({ label: statusLabels[s], value: data.orders.filter((o) => o.status === s).length, color: statusColors[s] }));
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
        <div className={`${cardCls} lg:col-span-2`}>
          <h3 className="mb-4 font-semibold text-slate-900">Faturamento · últimos 6 meses</h3>
          <VBars data={m.receita6} />
        </div>
        <div className={cardCls}>
          <h3 className="mb-4 font-semibold text-slate-900">Ordens por status</h3>
          <Donut data={m.porStatus} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className={cardCls}>
          <h3 className="mb-4 font-semibold text-slate-900">Serviços mais vendidos</h3>
          <HBars data={m.porServico} />
        </div>
        <div className={cardCls}>
          <h3 className="mb-4 font-semibold text-slate-900">Agenda de hoje</h3>
          {m.hoje.length === 0 ? <Empty small>Nenhum agendamento para hoje.</Empty> : (
            <ul className="space-y-2">
              {m.hoje.sort((a, b) => a.time.localeCompare(b.time)).map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <span className="font-display text-sm font-bold text-brand">{a.time}</span>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-800">{a.customerName}</p><p className="truncate text-xs text-slate-500">{serviceName(a.serviceId)} · {a.vehicle}</p></div>
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
function Appointments({ data, mutate }: { data: ShopData; mutate: (fn: (d: ShopData) => void) => void }) {
  const [filter, setFilter] = useState<"todos" | AppointmentStatus>("todos");
  const [adding, setAdding] = useState(false);
  const list = data.appointments.filter((a) => filter === "todos" || a.status === filter).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const setStatus = (id: string, status: AppointmentStatus) => mutate((d) => { const a = d.appointments.find((x) => x.id === id); if (a) a.status = status; });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(["todos", "pendente", "confirmado", "concluido", "cancelado"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${filter === f ? "bg-brand text-white" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
              {f === "todos" ? "Todos" : apptStatusLabels[f]}
            </button>
          ))}
        </div>
        <button onClick={() => setAdding((v) => !v)} className="btn btn-primary px-4 py-2 text-sm">{adding ? "Fechar" : "＋ Novo agendamento"}</button>
      </div>

      {adding && <AddAppointment onAdd={(a) => { mutate((d) => { d.appointments.unshift(a); }); setAdding(false); }} />}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr><th className="px-4 py-3">Data / hora</th><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Serviço</th><th className="px-4 py-3">Origem</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Ações</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3"><span className="font-medium text-slate-800">{fmtDate(a.date)}</span> <span className="text-slate-400">{a.time}</span></td>
                <td className="px-4 py-3"><p className="font-medium text-slate-800">{a.customerName}</p><p className="text-xs text-slate-500">{a.phone} · {a.vehicle || "—"}</p></td>
                <td className="px-4 py-3 text-slate-700">{serviceName(a.serviceId)}</td>
                <td className="px-4 py-3"><span className={`rounded-md px-2 py-0.5 text-[11px] ${a.source === "site" ? "bg-brand/10 text-brand-700" : "bg-slate-100 text-slate-500"}`}>{a.source === "site" ? "Site" : "Manual"}</span></td>
                <td className="px-4 py-3"><StatusPill kind="appt" value={a.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    {a.status === "pendente" && <button onClick={() => setStatus(a.id, "confirmado")} className="rounded-lg bg-brand/10 px-2.5 py-1 text-xs text-brand-700 hover:bg-brand/20">Confirmar</button>}
                    {(a.status === "pendente" || a.status === "confirmado") && <button onClick={() => setStatus(a.id, "concluido")} className="rounded-lg bg-green-100 px-2.5 py-1 text-xs text-green-700 hover:bg-green-200">Concluir</button>}
                    {a.status !== "cancelado" && a.status !== "concluido" && <button onClick={() => setStatus(a.id, "cancelado")} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-500 hover:bg-red-100 hover:text-red-600">Cancelar</button>}
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">Nenhum agendamento{filter !== "todos" ? " neste filtro" : " ainda"}. Os pedidos feitos no site aparecem aqui automaticamente.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddAppointment({ onAdd }: { onAdd: (a: Appointment) => void }) {
  const [f, setF] = useState({ customerName: "", phone: "", vehicle: "", serviceId: catalog[0].id, date: todayISO(), time: "09:00" });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!f.customerName || !f.phone) return; onAdd({ ...f, id: newId("a"), status: "confirmado", source: "manual", createdAt: new Date().toISOString() }); }}
      className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3">
      <input required placeholder="Nome do cliente" value={f.customerName} onChange={(e) => set("customerName", e.target.value)} className={inputCls} />
      <input required placeholder="Telefone / WhatsApp" value={f.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
      <input placeholder="Veículo" value={f.vehicle} onChange={(e) => set("vehicle", e.target.value)} className={inputCls} />
      <select value={f.serviceId} onChange={(e) => set("serviceId", e.target.value)} className={inputCls}>{catalog.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <input required type="date" value={f.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
      <div className="flex gap-2">
        <select value={f.time} onChange={(e) => set("time", e.target.value)} className={inputCls}>{times.map((t) => <option key={t} value={t}>{t}</option>)}</select>
        <button className="btn btn-primary shrink-0 px-4 py-2 text-sm">Salvar</button>
      </div>
    </form>
  );
}

/* ==================== ORDENS (Kanban) ==================== */
function Orders({ data, mutate }: { data: ShopData; mutate: (fn: (d: ShopData) => void) => void }) {
  const [adding, setAdding] = useState(false);
  const cols: OrderStatus[] = ["aguardando", "em_andamento", "pronto", "entregue"];
  const advance = (id: string) => mutate((d) => { const o = d.orders.find((x) => x.id === id); if (!o) return; if (o.status === "aguardando") o.status = "em_andamento"; if (o.stage < 10) o.stage += 1; if (o.stage >= 10) o.status = "pronto"; });
  const setStatus = (id: string, s: OrderStatus) => mutate((d) => { const o = d.orders.find((x) => x.id === id); if (o) { o.status = s; if (s === "entregue") o.stage = 10; } });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setAdding((v) => !v)} className="btn btn-primary px-4 py-2 text-sm">{adding ? "Fechar" : "＋ Nova ordem de serviço"}</button>
      </div>
      {adding && <AddOrder data={data} onAdd={(fn) => { mutate(fn); setAdding(false); }} />}

      {data.orders.length === 0 && !adding ? (
        <Empty>Nenhuma ordem de serviço. Clique em “Nova ordem de serviço” para começar.</Empty>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cols.map((col) => {
            const items = data.orders.filter((o) => o.status === col);
            return (
              <div key={col} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700"><span className="h-2 w-2 rounded-full" style={{ background: statusColors[col] }} />{statusLabels[col]}</span>
                  <span className="text-xs text-slate-400">{items.length}</span>
                </div>
                <div className="space-y-3">
                  {items.map((o) => (
                    <div key={o.id} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
                      <div className="flex items-center justify-between"><span className="font-display text-xs font-bold text-brand">{o.code}</span><span className="text-[11px] text-slate-400">{o.wheels} roda{o.wheels > 1 ? "s" : ""}</span></div>
                      <p className="mt-1.5 text-sm font-semibold text-slate-800">{o.customerName}</p>
                      <p className="text-xs text-slate-500">{o.vehicle} · {o.plate}</p>
                      <p className="mt-1 text-xs text-brand-700">{serviceName(o.serviceId)}</p>
                      {o.status !== "entregue" && o.status !== "cancelado" && (
                        <div className="mt-3">
                          <div className="mb-1 flex items-center justify-between text-[10px] text-slate-500"><span>Etapa {o.stage}/10 · {processStages[o.stage - 1]}</span><span>{Math.round((o.stage / 10) * 100)}%</span></div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand" style={{ width: `${(o.stage / 10) * 100}%` }} /></div>
                        </div>
                      )}
                      <div className="mt-3 flex items-center justify-between"><span className="text-sm font-bold text-slate-900">{brl(o.value)}</span><span className="text-[11px] text-slate-400">resp. {o.tech}</span></div>
                      <div className="mt-3 flex gap-1.5">
                        {o.status !== "entregue" && o.status !== "cancelado" && <button onClick={() => advance(o.id)} className="flex-1 rounded-lg bg-brand/10 px-2 py-1.5 text-xs text-brand-700 hover:bg-brand/20">{o.stage >= 10 ? "Marcar pronto" : "Avançar etapa →"}</button>}
                        {o.status === "pronto" && <button onClick={() => setStatus(o.id, "entregue")} className="flex-1 rounded-lg bg-green-100 px-2 py-1.5 text-xs text-green-700 hover:bg-green-200">Entregar</button>}
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && <p className="px-1 py-6 text-center text-xs text-slate-300">vazio</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function AddOrder({ data, onAdd }: { data: ShopData; onAdd: (fn: (d: ShopData) => void) => void }) {
  const [f, setF] = useState({ customerName: "", phone: "", vehicle: "", plate: "", wheels: "4", serviceId: catalog[0].id, value: "", tech: techs[0], dueDays: "3" });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));
  return (
    <form onSubmit={(e) => {
      e.preventDefault(); if (!f.customerName) return;
      onAdd((d) => {
        let cust = d.customers.find((c) => c.name.toLowerCase() === f.customerName.toLowerCase());
        if (!cust) { cust = { id: newId("c"), name: f.customerName, phone: f.phone, vehicle: f.vehicle, plate: f.plate, since: new Date().toISOString() }; d.customers.push(cust); }
        const due = new Date(); due.setDate(due.getDate() + (Number(f.dueDays) || 0));
        d.orders.unshift({
          id: newId("o"), code: nextOrderCode(d.orders), customerId: cust.id, customerName: f.customerName,
          vehicle: f.vehicle, plate: f.plate, wheels: Number(f.wheels) || 1, serviceId: f.serviceId, stage: 1,
          status: "aguardando", value: Number(f.value) || 0, tech: f.tech, createdAt: new Date().toISOString(), dueAt: due.toISOString(),
        });
      });
    }} className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      <input required placeholder="Nome do cliente" value={f.customerName} onChange={(e) => set("customerName", e.target.value)} className={inputCls} />
      <input placeholder="Telefone" value={f.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
      <input placeholder="Veículo" value={f.vehicle} onChange={(e) => set("vehicle", e.target.value)} className={inputCls} />
      <input placeholder="Placa" value={f.plate} onChange={(e) => set("plate", e.target.value)} className={inputCls} />
      <select value={f.serviceId} onChange={(e) => set("serviceId", e.target.value)} className={inputCls}>{catalog.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <input type="number" min="1" placeholder="Nº de rodas" value={f.wheels} onChange={(e) => set("wheels", e.target.value)} className={inputCls} />
      <input type="number" min="0" placeholder="Valor (R$)" value={f.value} onChange={(e) => set("value", e.target.value)} className={inputCls} />
      <select value={f.tech} onChange={(e) => set("tech", e.target.value)} className={inputCls}>{techs.map((t) => <option key={t} value={t}>{t}</option>)}</select>
      <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
        <input type="number" min="0" placeholder="Prazo (dias)" value={f.dueDays} onChange={(e) => set("dueDays", e.target.value)} className={`${inputCls} max-w-[160px]`} />
        <button className="btn btn-primary px-5 py-2 text-sm">Criar ordem</button>
      </div>
    </form>
  );
}

/* ==================== CLIENTES ==================== */
function Customers({ data, setView }: { data: ShopData; setView: (v: View) => void }) {
  const rows = data.customers.map((c) => { const os = data.orders.filter((o) => o.customerId === c.id); return { ...c, count: os.length, total: os.reduce((s, o) => s + o.value, 0) }; }).sort((a, b) => b.total - a.total);
  if (!rows.length) return <Empty>Nenhum cliente ainda. Eles são criados ao cadastrar uma <button onClick={() => setView("ordens")} className="mx-1 font-semibold text-brand hover:underline">ordem de serviço</button>.</Empty>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[680px] text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Contato</th><th className="px-4 py-3">Veículo</th><th className="px-4 py-3 text-center">Ordens</th><th className="px-4 py-3 text-right">Total gasto</th></tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50">
              <td className="px-4 py-3"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">{c.name.charAt(0)}</span><p className="font-medium text-slate-800">{c.name}</p></div></td>
              <td className="px-4 py-3 text-slate-600">{c.phone || "—"}</td>
              <td className="px-4 py-3"><p className="text-slate-700">{c.vehicle || "—"}</p><p className="text-[11px] text-slate-400">{c.plate}</p></td>
              <td className="px-4 py-3 text-center text-slate-700">{c.count}</td>
              <td className="px-4 py-3 text-right font-semibold text-slate-900">{brl(c.total)}</td>
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
        <div key={c.id} className={cardCls}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-bold text-slate-900">{c.name}</h3>
            <span className="whitespace-nowrap rounded-lg bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand-700">{c.price > 0 ? `${brl(c.price)}/${c.unit}` : "sob consulta"}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{c.desc}</p>
          <p className="mt-3 text-xs text-slate-400">Prazo: {c.durationDays === 0 ? "no mesmo dia" : `${c.durationDays} dia${c.durationDays > 1 ? "s" : ""}`}</p>
        </div>
      ))}
    </div>
  );
}

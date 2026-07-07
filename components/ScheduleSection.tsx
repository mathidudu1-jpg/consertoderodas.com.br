"use client";

import { useState } from "react";
import { catalog, addAppointment, whatsappFromSchedule } from "@/lib/shop";
import { site } from "@/lib/site";
import Reveal from "./Reveal";

const times = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:30", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00",
];

// Serviços oferecidos no agendamento (com descrição)
const bookable = catalog.filter((c) =>
  ["revitalizacao", "conserto", "diamantacao", "pintura", "montagem", "avaliacao"].includes(c.id)
);

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function ScheduleSection() {
  const [serviceId, setServiceId] = useState("revitalizacao");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);

  const selected = bookable.find((b) => b.id === serviceId)!;
  const valid = name.trim() && phone.trim() && date && time;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    addAppointment({ customerName: name, phone, vehicle, serviceId, date, time, notes });
    const url = whatsappFromSchedule({
      name, phone, vehicle, serviceName: selected.name, date, time, notes,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    setDone(true);
  }

  return (
    <section id="agendar" className="relative overflow-hidden bg-ink py-24 tech-grid md:py-32">
      <div className="pointer-events-none absolute inset-0 glow-brand opacity-60" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <div className="glass overflow-hidden rounded-[2rem] border border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Lado esquerdo — pitch */}
            <div className="relative flex flex-col justify-between gap-8 border-b border-white/10 p-8 md:p-12 lg:border-b-0 lg:border-r">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-10 bg-brand" />
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-mist">
                    Agende seu horário
                  </span>
                </div>
                <h2 className="font-display text-3xl font-extrabold leading-tight md:text-5xl">
                  Reserve um horário e deixe o resto <span className="text-gradient">com a gente</span>
                </h2>
                <p className="mt-4 max-w-md text-slate-300">
                  Escolha o serviço, o melhor dia e horário. Confirmamos pelo
                  WhatsApp em minutos. Sem filas, sem espera.
                </p>
              </div>

              <ul className="space-y-3 text-sm text-slate-300">
                {[
                  "Diagnóstico gratuito e sem compromisso",
                  "1 ano de garantia na pintura",
                  `Atendimento ${site.hours[0].h} · seg a sex`,
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/20 text-xs text-brand">✓</span>
                    {t}
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-400">Prefere agenda oficial?</p>
                <a
                  href={site.scheduleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm font-semibold text-mist hover:text-white"
                >
                  Abrir Google Agenda →
                </a>
              </div>
            </div>

            {/* Lado direito — form ou confirmação */}
            <div className="p-8 md:p-12">
              {done ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand/20 text-3xl text-brand">✓</div>
                  <h3 className="font-display text-2xl font-bold">Pedido enviado!</h3>
                  <p className="mt-3 max-w-sm text-slate-300">
                    Abrimos o WhatsApp com seu agendamento de{" "}
                    <strong className="text-white">{selected.name}</strong> para{" "}
                    <strong className="text-white">{date.split("-").reverse().join("/")} às {time}</strong>.
                    É só enviar a mensagem que a gente confirma. 🚗
                  </p>
                  <button
                    onClick={() => { setDone(false); setName(""); setPhone(""); setVehicle(""); setNotes(""); setDate(""); setTime(""); }}
                    className="btn btn-ghost mt-8"
                  >
                    Fazer outro agendamento
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  {/* Serviço */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Qual serviço você precisa?
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {bookable.map((b) => (
                        <button
                          type="button"
                          key={b.id}
                          onClick={() => setServiceId(b.id)}
                          className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                            serviceId === b.id
                              ? "border-brand bg-brand/15 text-white"
                              : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25"
                          }`}
                        >
                          {b.name}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-400">{selected.desc}</p>
                  </div>

                  {/* Data e hora */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Data</label>
                      <input
                        type="date"
                        required
                        min={todayStr()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-ink-800 px-3 py-2.5 text-sm text-white outline-none focus:border-brand [color-scheme:dark]"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">Horário</label>
                      <select
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-ink-800 px-3 py-2.5 text-sm text-white outline-none focus:border-brand [color-scheme:dark]"
                      >
                        <option value="">Selecione</option>
                        {times.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dados */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      required
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-ink-800 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-brand"
                    />
                    <input
                      required
                      placeholder="WhatsApp / telefone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-ink-800 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-brand"
                    />
                  </div>
                  <input
                    placeholder="Veículo (ex.: Honda Civic 2019)"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-ink-800 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-brand"
                  />
                  <textarea
                    placeholder="Detalhes (opcional): quantas rodas, cor desejada, tipo de dano…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-xl border border-white/10 bg-ink-800 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-brand"
                  />

                  <button
                    type="submit"
                    disabled={!valid}
                    className="btn btn-primary w-full justify-center text-base disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Confirmar agendamento no WhatsApp →
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    Valores a partir de {selected.price > 0 ? `R$ ${selected.price}/${selected.unit}` : "sob consulta"} · confirmação humana pelo WhatsApp
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

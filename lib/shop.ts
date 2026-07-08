// Store da oficina — client-side (localStorage) com seed realista de exemplo.
// Compartilhado entre o card público de agendamento e o painel /admin/admin.
// Para persistência real multi-dispositivo, trocar as funções get/set por
// chamadas a um backend (ex.: Supabase) mantendo a mesma interface.

export type ServiceCat = {
  id: string;
  name: string;
  desc: string;
  price: number; // "a partir de" — 0 = sob consulta
  unit: "roda" | "jogo" | "serviço";
  durationDays: number;
};

export const catalog: ServiceCat[] = [
  {
    id: "revitalizacao",
    name: "Revitalização Completa",
    desc: "Desmontagem, desempeno, remoção de pintura, correção de defeitos, primer, pintura na cor escolhida, verniz, válvula nova e balanceamento. 1 ano de garantia na pintura.",
    price: 350,
    unit: "roda",
    durationDays: 3,
  },
  {
    id: "conserto",
    name: "Conserto / Desempeno",
    desc: "Desempeno com o Gabarito RLL, sem usinagem e sem aquecer o metal — preservando a resistência da roda.",
    price: 120,
    unit: "roda",
    durationDays: 1,
  },
  {
    id: "diamantacao",
    name: "Diamantação",
    desc: "Corte diamantado da face em torno CNC para o acabamento espelhado de fábrica.",
    price: 280,
    unit: "roda",
    durationDays: 2,
  },
  {
    id: "pintura",
    name: "Pintura Personalizada",
    desc: "Pintura na cor original ou personalizada — prata, grafite, preto, colorido ou o tom que imaginar.",
    price: 200,
    unit: "roda",
    durationDays: 2,
  },
  {
    id: "montagem",
    name: "Montagem + Balanceamento",
    desc: "Montagem de pneus, balanceamento e instalação de válvula nova.",
    price: 40,
    unit: "roda",
    durationDays: 0,
  },
  {
    id: "rodas-novas",
    name: "Venda de Rodas Novas",
    desc: "Rodas novas de liga leve em até 18x, com todos os acessórios.",
    price: 0,
    unit: "jogo",
    durationDays: 0,
  },
  {
    id: "avaliacao",
    name: "Avaliação Pré-compra",
    desc: "Laudo de empeno, trincas e reparos anteriores antes de comprar uma roda usada.",
    price: 0,
    unit: "serviço",
    durationDays: 0,
  },
];

export const serviceName = (id: string) =>
  catalog.find((c) => c.id === id)?.name ?? id;

// As 10 etapas do processo (espelham lib/site.ts) para rastrear a ordem
export const processStages = [
  "Preparação",
  "Gabaritos",
  "Torno",
  "Limpeza",
  "Fundo",
  "Pintura",
  "Diamantação",
  "Verniz",
  "Secagem",
  "Entrega",
] as const;

export type OrderStatus =
  | "aguardando"
  | "em_andamento"
  | "pronto"
  | "entregue"
  | "cancelado";

export const statusLabels: Record<OrderStatus, string> = {
  aguardando: "Aguardando",
  em_andamento: "Em andamento",
  pronto: "Pronto p/ retirada",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export type AppointmentStatus =
  | "pendente"
  | "confirmado"
  | "concluido"
  | "cancelado";

export const apptStatusLabels: Record<AppointmentStatus, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  plate: string;
  since: string; // ISO
};

export type Order = {
  id: string;
  code: string; // OS-2026-001
  customerId: string;
  customerName: string;
  vehicle: string;
  plate: string;
  wheels: number;
  serviceId: string;
  stage: number; // 1..10
  status: OrderStatus;
  value: number;
  tech: string;
  createdAt: string; // ISO
  dueAt: string; // ISO
  notes?: string;
};

export type Appointment = {
  id: string;
  customerName: string;
  phone: string;
  vehicle: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
  createdAt: string; // ISO
  source: "site" | "manual";
};

export type ShopData = {
  customers: Customer[];
  orders: Order[];
  appointments: Appointment[];
  version: number;
};

const KEY = "rll_shop_v2";
const VERSION = 2;
export const techs = ["Robson", "Matheus", "Luiz Jr.", "André"];

// Painel começa zerado — os agendamentos entram pelo site e as ordens/clientes
// são cadastrados manualmente no próprio painel.
function seed(): ShopData {
  return { customers: [], orders: [], appointments: [], version: VERSION };
}

export function nextOrderCode(orders: Order[]) {
  const year = new Date().getFullYear();
  return `OS-${year}-${String(orders.length + 1).padStart(3, "0")}`;
}
export const newId = (p: string) => p + Math.random().toString(36).slice(2, 9);

export function loadShop(): ShopData {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ShopData;
      if (parsed && parsed.version === VERSION) return parsed;
    }
  } catch {
    /* ignore */
  }
  const s = seed();
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
  return s;
}

export function saveShop(data: ShopData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("rll-shop-updated"));
  } catch {
    /* ignore */
  }
}

export function resetShop() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  saveShop(seed());
}

// Adiciona um agendamento vindo do site público
export function addAppointment(
  a: Omit<Appointment, "id" | "createdAt" | "status" | "source"> & {
    status?: AppointmentStatus;
    source?: Appointment["source"];
  }
) {
  const data = loadShop();
  const appt: Appointment = {
    ...a,
    id: "a" + Math.random().toString(36).slice(2, 9),
    status: a.status ?? "pendente",
    source: a.source ?? "site",
    createdAt: new Date().toISOString(),
  };
  data.appointments = [appt, ...data.appointments];
  saveShop(data);
  return appt;
}

export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// URL de WhatsApp a partir de um telefone livre + texto
export function waUrl(phone: string, text: string) {
  const digits = (phone || "").replace(/\D/g, "");
  const full = digits.startsWith("55") ? digits : "55" + digits;
  return `https://api.whatsapp.com/send?phone=${full}&text=${encodeURIComponent(text)}`;
}

// Monta a URL do WhatsApp com o resumo do agendamento
export function whatsappFromSchedule(a: {
  name: string;
  phone: string;
  vehicle: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  time: string;
  notes?: string;
}) {
  const dataBR = a.date.split("-").reverse().join("/");
  const msg =
    `Olá! Gostaria de agendar um horário na Rodas de Liga Leve.\n\n` +
    `*Serviço:* ${a.serviceName}\n` +
    `*Data:* ${dataBR} às ${a.time}\n` +
    `*Nome:* ${a.name}\n` +
    `*Telefone:* ${a.phone}\n` +
    (a.vehicle ? `*Veículo:* ${a.vehicle}\n` : "") +
    (a.notes ? `*Detalhes:* ${a.notes}\n` : "");
  return `https://api.whatsapp.com/send?phone=554133469595&text=${encodeURIComponent(msg)}`;
}

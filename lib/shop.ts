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

const KEY = "rll_shop_v1";
const techs = ["Robson", "Matheus", "Luiz Jr.", "André"];

function iso(daysFromNow: number, h = 9, m = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}
function ymd(daysFromNow: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

function seed(): ShopData {
  const customers: Customer[] = [
    { id: "c1", name: "Carlos Menezes", phone: "(41) 99812-4471", vehicle: "Honda Civic 2019", plate: "BEA1D23", since: iso(-420) },
    { id: "c2", name: "Fernanda Lima", phone: "(41) 99640-1180", vehicle: "Jeep Compass 2021", plate: "RTC4E88", since: iso(-260) },
    { id: "c3", name: "Rodrigo Alves", phone: "(41) 98123-9902", vehicle: "VW Golf GTI 2018", plate: "AQK2F19", since: iso(-190) },
    { id: "c4", name: "Patrícia Souza", phone: "(41) 99551-7723", vehicle: "Toyota Corolla 2020", plate: "PWM7G40", since: iso(-95) },
    { id: "c5", name: "Bruno Tavares", phone: "(41) 99277-3351", vehicle: "BMW 320i 2022", plate: "LKD9H07", since: iso(-60) },
    { id: "c6", name: "Aline Ferreira", phone: "(41) 98410-2265", vehicle: "Hyundai HB20 2019", plate: "FGT3J55", since: iso(-30) },
    { id: "c7", name: "Marcelo Nunes", phone: "(41) 99188-6640", vehicle: "Audi A3 2021", plate: "NBR6K12", since: iso(-12) },
    { id: "c8", name: "Juliana Castro", phone: "(41) 99903-4418", vehicle: "Fiat Pulse 2023", plate: "ZXC8L34", since: iso(-4) },
  ];

  const orders: Order[] = [
    { id: "o1", code: "OS-2026-041", customerId: "c1", customerName: "Carlos Menezes", vehicle: "Honda Civic 2019", plate: "BEA1D23", wheels: 4, serviceId: "revitalizacao", stage: 6, status: "em_andamento", value: 1400, tech: "Robson", createdAt: iso(-2), dueAt: iso(2), notes: "Cor grafite fosco" },
    { id: "o2", code: "OS-2026-042", customerId: "c3", customerName: "Rodrigo Alves", vehicle: "VW Golf GTI 2018", plate: "AQK2F19", wheels: 2, serviceId: "diamantacao", stage: 8, status: "em_andamento", value: 560, tech: "Matheus", createdAt: iso(-3), dueAt: iso(1) },
    { id: "o3", code: "OS-2026-043", customerId: "c2", customerName: "Fernanda Lima", vehicle: "Jeep Compass 2021", plate: "RTC4E88", wheels: 1, serviceId: "conserto", stage: 3, status: "em_andamento", value: 160, tech: "Luiz Jr.", createdAt: iso(-1), dueAt: iso(1), notes: "Empeno no aro dianteiro direito" },
    { id: "o4", code: "OS-2026-039", customerId: "c5", customerName: "Bruno Tavares", vehicle: "BMW 320i 2022", plate: "LKD9H07", wheels: 4, serviceId: "revitalizacao", stage: 10, status: "pronto", value: 1600, tech: "Robson", createdAt: iso(-5), dueAt: iso(0) },
    { id: "o5", code: "OS-2026-044", customerId: "c7", customerName: "Marcelo Nunes", vehicle: "Audi A3 2021", plate: "NBR6K12", wheels: 4, serviceId: "pintura", stage: 1, status: "aguardando", value: 800, tech: "André", createdAt: iso(0), dueAt: iso(3), notes: "Aguardando aprovação da cor" },
    { id: "o6", code: "OS-2026-045", customerId: "c8", customerName: "Juliana Castro", vehicle: "Fiat Pulse 2023", plate: "ZXC8L34", wheels: 2, serviceId: "conserto", stage: 1, status: "aguardando", value: 240, tech: "Matheus", createdAt: iso(0), dueAt: iso(2) },
    { id: "o7", code: "OS-2026-036", customerId: "c4", customerName: "Patrícia Souza", vehicle: "Toyota Corolla 2020", plate: "PWM7G40", wheels: 4, serviceId: "revitalizacao", stage: 10, status: "entregue", value: 1400, tech: "Robson", createdAt: iso(-10), dueAt: iso(-6) },
    { id: "o8", code: "OS-2026-034", customerId: "c6", customerName: "Aline Ferreira", vehicle: "Hyundai HB20 2019", plate: "FGT3J55", wheels: 1, serviceId: "diamantacao", stage: 10, status: "entregue", value: 280, tech: "Matheus", createdAt: iso(-14), dueAt: iso(-11) },
    { id: "o9", code: "OS-2026-030", customerId: "c1", customerName: "Carlos Menezes", vehicle: "Honda Civic 2019", plate: "BEA1D23", wheels: 4, serviceId: "montagem", stage: 10, status: "entregue", value: 160, tech: "André", createdAt: iso(-22), dueAt: iso(-22) },
    { id: "o10", code: "OS-2026-028", customerId: "c3", customerName: "Rodrigo Alves", vehicle: "VW Golf GTI 2018", plate: "AQK2F19", wheels: 4, serviceId: "pintura", stage: 10, status: "entregue", value: 800, tech: "Robson", createdAt: iso(-26), dueAt: iso(-22) },
  ];

  const appointments: Appointment[] = [
    { id: "a1", customerName: "Gustavo Reis", phone: "(41) 99123-0091", vehicle: "Chevrolet Onix 2022", serviceId: "conserto", date: ymd(0), time: "09:00", status: "confirmado", createdAt: iso(-1), source: "site" },
    { id: "a2", customerName: "Larissa Pinto", phone: "(41) 99880-1145", vehicle: "Renault Kwid 2021", serviceId: "revitalizacao", date: ymd(0), time: "11:00", status: "confirmado", createdAt: iso(-1), source: "site" },
    { id: "a3", customerName: "Diego Martins", phone: "(41) 98771-2093", vehicle: "Ford Ranger 2020", serviceId: "diamantacao", date: ymd(0), time: "14:30", status: "pendente", createdAt: iso(0), source: "site", notes: "Prefere sábado se possível" },
    { id: "a4", customerName: "Sônia Braga", phone: "(41) 99640-8812", vehicle: "Nissan Kicks 2023", serviceId: "pintura", date: ymd(1), time: "10:00", status: "confirmado", createdAt: iso(-1), source: "manual" },
    { id: "a5", customerName: "Henrique Dias", phone: "(41) 99512-7788", vehicle: "Peugeot 208 2019", serviceId: "conserto", date: ymd(1), time: "15:00", status: "pendente", createdAt: iso(0), source: "site" },
    { id: "a6", customerName: "Camila Rocha", phone: "(41) 98220-4419", vehicle: "Jeep Renegade 2022", serviceId: "revitalizacao", date: ymd(2), time: "09:30", status: "pendente", createdAt: iso(0), source: "site" },
    { id: "a7", customerName: "Paulo Cardoso", phone: "(41) 99331-5567", vehicle: "Toyota Hilux 2021", serviceId: "montagem", date: ymd(3), time: "16:00", status: "confirmado", createdAt: iso(-2), source: "manual" },
  ];

  return { customers, orders, appointments, version: 1 };
}

export function loadShop(): ShopData {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ShopData;
      if (parsed && parsed.version === 1) return parsed;
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

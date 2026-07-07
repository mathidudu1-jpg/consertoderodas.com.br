// Dados reais capturados de consertoderodas.com.br (Rodas de Liga Leve — Curitiba)

export const site = {
  name: "Rodas de Liga Leve",
  shortName: "RLL",
  legalName: "Conserto Rodas de Liga Leve",
  tagline: "Há mais de 32 anos fazendo parte da sua história",
  since: 1993,
  years: 32,
  founders: "Luiz e Olga Witkovski",
  city: "Curitiba",
  state: "PR",
  address: "Rua Omar Raymundo Picheth, 269 – Xaxim, Curitiba – PR, 81810-150",
  phoneDisplay: "(41) 3346-9595",
  phoneRaw: "554133469595",
  hours: [
    { d: "Segunda a Sexta", h: "08:00 – 17:30" },
    { d: "Sábado e Domingo", h: "Fechado" },
  ],
  social: {
    instagram: "https://www.instagram.com/consertosrodasdeliga/",
    facebook: "https://www.facebook.com/consertosrodasdeligaleve/",
    youtube: "https://www.youtube.com/rodasdeligaleve",
  },
  scheduleUrl:
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ38cSB8qHb-yU9iM9pQKcJq3ZQaU5szkIV9za8GWNflnoOv_9IjAPi_6p-9MUrPjX7_Xy3fQtpx?gv=true",
  mapsQuery: "Rodas de Liga Leve, Xaxim, Curitiba",
} as const;

export function whatsapp(text: string) {
  return `https://api.whatsapp.com/send?phone=${site.phoneRaw}&text=${encodeURIComponent(text)}`;
}

export const waLinks = {
  orcamento: whatsapp(
    "Olá, estou no site Conserto de Rodas e gostaria de realizar um orçamento! "
  ),
  rodasNovas: whatsapp(
    "Olá, estou em seu site e gostaria de comprar rodas novas. "
  ),
};

// As 10 etapas reais do processo de recuperação
export type Step = {
  n: number;
  key: string;
  title: string;
  short: string;
  desc: string;
};

export const steps: Step[] = [
  {
    n: 1,
    key: "preparacao",
    title: "Preparação",
    short: "Desmontagem e diagnóstico",
    desc: "Removemos o pneu e inspecionamos a roda milímetro por milímetro para mapear empenos, trincas e desgaste.",
  },
  {
    n: 2,
    key: "gabaritos",
    title: "Gabaritos",
    short: "Medição com o Gabarito RLL",
    desc: "Nosso gabarito exclusivo, desenvolvido em 32 anos de casa, mede a geometria original da roda com precisão.",
  },
  {
    n: 3,
    key: "torno",
    title: "Torno",
    short: "Desempeno sem usinagem",
    desc: "A roda é desempenada a frio, sem usinar nem aquecer — preservando a resistência e a estrutura do metal.",
  },
  {
    n: 4,
    key: "limpeza",
    title: "Limpeza",
    short: "Remoção total da pintura",
    desc: "Toda a tinta velha e a oxidação são removidas, deixando o alumínio nu e pronto para renascer.",
  },
  {
    n: 5,
    key: "fundo",
    title: "Fundo",
    short: "Primer de aderência",
    desc: "Aplicamos primer para corrigir imperfeições e garantir a aderência perfeita da nova pintura.",
  },
  {
    n: 6,
    key: "pintura",
    title: "Pintura",
    short: "Cor personalizada",
    desc: "Pintamos na cor original ou na que você escolher — prata, grafite, preto, colorido ou o tom que imaginar.",
  },
  {
    n: 7,
    key: "diamantacao",
    title: "Diamantação",
    short: "Corte diamantado",
    desc: "A face da roda é usinada em torno CNC para o brilho espelhado do acabamento diamantado.",
  },
  {
    n: 8,
    key: "verniz",
    title: "Verniz",
    short: "Proteção espelhada",
    desc: "Verniz de alta resistência sela a pintura, protege contra riscos e dá o brilho profundo de fábrica.",
  },
  {
    n: 9,
    key: "secagem",
    title: "Secagem",
    short: "Cura controlada",
    desc: "A roda passa por cura em temperatura controlada para fixar cada camada com durabilidade máxima.",
  },
  {
    n: 10,
    key: "entrega",
    title: "Entrega",
    short: "Balanceada e garantida",
    desc: "Montamos o pneu, balanceamos, instalamos válvula nova e entregamos com 1 ano de garantia na pintura.",
  },
];

export type Service = {
  title: string;
  desc: string;
  items: string[];
  featured?: boolean;
};

export const services: Service[] = [
  {
    title: "Revitalização Completa",
    desc: "A roda sai como nova. Desmontagem, desempeno, remoção de pintura, correção de defeitos, primer, pintura na cor que quiser, verniz protetor, válvula nova e balanceamento.",
    items: [
      "1 ano de garantia na pintura",
      "Cor original ou personalizada",
      "Válvula nova + balanceamento",
    ],
    featured: true,
  },
  {
    title: "Conserto de Rodas",
    desc: "Desempeno com a tecnologia exclusiva Gabarito RLL, sem usinagem e sem aquecer o metal — preservando toda a resistência da roda.",
    items: ["Sem usinagem", "Sem aquecimento", "Precisão do Gabarito RLL"],
  },
  {
    title: "Rodas & Pneus",
    desc: "Venda de rodas novas em até 18x, pneus novos, montagem, balanceamento e todos os acessórios de liga leve.",
    items: ["Rodas novas em até 18x", "Pneus e montagem", "Acessórios de liga leve"],
  },
  {
    title: "Avaliação Pré-compra",
    desc: "Vai comprar uma roda usada? Avaliamos a peça antes para você não levar gato por lebre.",
    items: ["Laudo de empeno e trincas", "Análise de reparos anteriores", "Segurança na compra"],
  },
];

export type Testimonial = { name: string; text: string };

export const testimonials: Testimonial[] = [
  {
    name: "Cliente Google",
    text: "Serviço impecável. Levei minhas rodas empenadas e voltaram perfeitas, como novas. Atendimento nota 10.",
  },
  {
    name: "Robson (atendimento)",
    text: "Fui muito bem atendido pelo Robson, explicou todo o processo. Rodas ficaram lindas, recomendo demais.",
  },
  {
    name: "Cliente Google",
    text: "Melhor lugar de Curitiba para conserto de rodas. Profissionais de verdade, 32 anos de experiência fazem diferença.",
  },
  {
    name: "Matheus (atendimento)",
    text: "Atendimento do Matheus foi excelente, tirou todas as dúvidas. Pintura ficou espetacular, com garantia.",
  },
];

// Marcos reais do site oficial (Sobre Nós)
export const timeline = [
  {
    year: "1993",
    title: "O começo de tudo",
    desc: "Luiz e Olga Witkovski transformam um sonho em realidade no coração do bairro Xaxim, fundando a Rodas de Liga Leve.",
  },
  {
    year: "1995",
    title: "Reconhecimento",
    desc: "A oficina ganha o mercado de Curitiba com especialistas qualificados e tecnologia à frente do seu tempo.",
  },
  {
    year: "2004",
    title: "Diamantação",
    desc: "Chega a tecnologia de corte diamantado, com acabamento impecável que virou referência na cidade.",
  },
  {
    year: "2015",
    title: "Expansão",
    desc: "A estrutura cresce para atender melhor — sem abrir mão do padrão de qualidade de sempre.",
  },
  {
    year: "2024",
    title: "32 anos de excelência",
    desc: "Mais de 50.000 rodas restauradas e uma tradição familiar que segue de pai para filho.",
  },
] as const;

export const gallery = [
  { src: "/gallery/g6.jpg", label: "Nossa história — anos 90", tall: false },
  { src: "/gallery/g1.jpg", label: "Oficina & processo", tall: true },
  { src: "/gallery/g2.jpg", label: "Ferramentas de precisão", tall: true },
  { src: "/gallery/g3.jpg", label: "Cabine de pintura", tall: false },
  { src: "/gallery/g4.jpg", label: "Acabamento", tall: false },
  { src: "/gallery/g5.jpg", label: "Rodas restauradas", tall: true },
];

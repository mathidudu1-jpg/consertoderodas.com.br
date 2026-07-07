# Rodas de Liga Leve — consertoderodas.com.br

Site cinematográfico da **Rodas de Liga Leve** (Conserto de Rodas · Curitiba), reconstruído do zero a partir do antigo site WordPress. Foco em performance, storytelling e uma experiência 3D que mostra a roda "renascendo" a cada etapa do conserto.

> Há mais de 32 anos fazendo parte da sua história.

## ✨ Destaques

- **Roda 3D interativa** (Three.js / React Three Fiber) — geometria procedural de uma roda de liga leve com material que evolui pelas **10 etapas reais** do processo.
- **Scrollytelling com GSAP + ScrollTrigger** — seção pinada onde a roda sai de "empenada e suja" até "diamantada e envernizada" conforme você rola.
- **Scroll suave (Lenis)** sincronizado com o ScrollTrigger.
- **Antes & Depois** interativo (arraste para comparar).
- **Parallax, cards 3D com tilt, contadores animados e marquee** de provas sociais.
- **SEO**: metadata Open Graph, JSON-LD `AutoRepair`, sitemap-ready.
- Conteúdo, contatos, WhatsApp, redes e fotos reais capturados do site original.

## 🧱 Stack

| Camada        | Tecnologia                              |
| ------------- | --------------------------------------- |
| Framework     | Next.js 15 (App Router) + React 19 + TS |
| 3D            | three · @react-three/fiber · drei       |
| Animação      | GSAP (ScrollTrigger) · Lenis            |
| Estilo        | Tailwind CSS v4                         |
| Deploy        | Vercel                                  |

## 🚀 Rodar localmente

```bash
npm install
npm run dev
# http://localhost:3000
```

Build de produção:

```bash
npm run build && npm start
```

## ☁️ Deploy na Vercel

1. Importe este repositório em [vercel.com/new](https://vercel.com/new).
2. Framework detectado automaticamente: **Next.js** (sem configuração extra).
3. Deploy. Depois aponte o domínio `consertoderodas.com.br` em *Settings → Domains*.

## 📁 Estrutura

```
app/            layout, página única e estilos globais
components/     Hero, ProcessSection, Wheel3D, Gallery, ...
lib/site.ts     dados reais (contato, etapas, serviços, depoimentos)
public/         logos, ícones e fotos da marca
```

---

Feito com Next.js · Three.js · GSAP.

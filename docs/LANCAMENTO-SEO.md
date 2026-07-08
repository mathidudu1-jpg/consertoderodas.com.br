# Planejamento de Lançamento & SEO — Rodas de Liga Leve

Guia vivo para deixar o site bem estruturado e ranqueando. Marque o que for concluindo.

---

## ✅ Já feito no site (técnico)

- [x] **Renderização estática** (Next.js) — carregamento rápido, ótimo para SEO
- [x] **Metadata** completa: título, descrição, keywords, `canonical` por página
- [x] **robots.txt** (`/robots.txt`) — libera tudo, bloqueia `/admin`
- [x] **sitemap.xml** (`/sitemap.xml`) — home e `/historia`
- [x] **Dados estruturados** JSON-LD `AutoRepair` (endereço, geo, horários, telefone, fundação, ofertas)
- [x] **Open Graph + Twitter image** 1200×630 — card bonito ao compartilhar
- [x] **Favicon** com o monograma RLL + `apple-icon` + **manifest** (PWA)
- [x] **Vercel Analytics + Speed Insights** — métricas reais de visita e performance
- [x] **HTTPS** automático (Vercel) + domínio próprio

---

## 🔧 O que só VOCÊ pode fazer (contas externas) — prioridade máxima

### 1. Google Business Profile (Perfil da Empresa no Google) — **o mais importante para oficina local**
- [ ] Criar/assumir o perfil em [business.google.com](https://business.google.com)
- [ ] Categoria principal: **"Oficina de reparo de rodas"** (+ "Loja de pneus", "Oficina mecânica")
- [ ] Endereço exato, telefone `(41) 3346-9595`, horário Seg–Sex 8h–17h30
- [ ] Site: `https://consertoderodas.com.br`
- [ ] Adicionar **20+ fotos reais** (antes/depois, oficina, equipe, fachada)
- [ ] Ativar mensagens e botão "Agendar" apontando para o site
- [ ] **Pedir avaliações** aos clientes (link direto de review) — responder todas
> É isso que faz aparecer no **Maps** e no bloco lateral quando pesquisam "conserto de rodas Curitiba".

### 2. Google Search Console
- [ ] Adicionar a propriedade `consertoderodas.com.br` em [search.google.com/search-console](https://search.google.com/search-console)
- [ ] Verificar via DNS (registro TXT na Vercel) ou via tag HTML (me peça que eu adiciono a tag)
- [ ] Enviar o sitemap: `https://consertoderodas.com.br/sitemap.xml`
- [ ] Acompanhar indexação e as buscas que trazem visita

### 3. Bing Webmaster Tools (bônus, rápido)
- [ ] Importar do Search Console em [bing.com/webmasters](https://www.bing.com/webmasters)

### 4. Redes sociais (já linkadas no site)
- [ ] Padronizar bio/link do Instagram `@consertosrodasdeliga` apontando pro site
- [ ] Postar os antes/depois com link — tráfego + sinal social

---

## ✍️ Conteúdo & SEO on-page (posso fazer quando quiser)

### Páginas novas que ajudam a ranquear (uma por intenção de busca)
- [ ] `/servicos/revitalizacao-de-rodas` — página dedicada com FAQ
- [ ] `/servicos/desempeno-de-rodas` (roda empenada)
- [ ] `/servicos/diamantacao`
- [ ] `/servicos/pintura-de-rodas`
- [ ] `/rodas-novas` (venda)
> Cada uma otimizada para termos como *"conserto de roda empenada Curitiba"*, *"diamantação de rodas Curitiba"*, etc.

### Blog / dúvidas (autoridade + cauda longa)
- [ ] "Vale a pena consertar roda empenada ou trocar?"
- [ ] "Quanto tempo dura a pintura de roda?"
- [ ] "Roda diamantada: o que é e como cuidar"
- [ ] FAQ estruturado (schema `FAQPage`) na home

### Otimizações pontuais
- [ ] `alt` descritivo em todas as imagens (parcial — reforçar)
- [ ] Depoimentos reais do Google (com nome) → habilita `aggregateRating` no schema
- [ ] Página de contato com `LocalBusiness` + mapa (já tem mapa)

---

## 📊 Métrica de sucesso (acompanhar mensal)
- Posição no Maps para "conserto de rodas Curitiba" e variações
- Cliques/impressões no Search Console
- Nº de agendamentos pelo site (painel `/admin/admin`)
- Nota e volume de avaliações no Google
- Core Web Vitals (Speed Insights) no verde

---

## 🚀 Próximos incrementos técnicos (peça quando quiser)
- [ ] **Supabase**: persistência real do painel (multi-dispositivo) + auth de verdade
- [ ] Tag de verificação do Search Console
- [ ] `FAQPage` schema na home
- [ ] Páginas de serviço dedicadas (acima)
- [ ] Integração de avaliações do Google (widget)
- [ ] Notificação de novo agendamento (e-mail/WhatsApp para a oficina)

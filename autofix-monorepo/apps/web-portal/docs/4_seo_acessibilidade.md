# Regras de SEO e Acessibilidade

Como o projeto utiliza **Next.js**, aproveitamos o **SSG (Static Site Generation)** para áreas públicas e **CSR (Client Side Rendering)** para o Dashboard.

## 🔎 SEO (Search Engine Optimization)
Focado nas páginas públicas (Landing Page, Blog, Agendamento Público).

1.  **Sitemap & Robots:** Geração automática de `sitemap.xml` e `robots.txt` no build time.
2.  **Meta Tags Dinâmicas:** Uso da API `Metadata` do Next.js (App Router) para injetar Title, Description e OpenGraph (OG) tags baseadas no conteúdo da página.
3.  **Semantic HTML:** Uso estrito de tags semânticas (`<header>`, `<main>`, `<article>`, `<footer>`, `<section>`).
4.  **Performance (Core Web Vitals):**
    * Imagens: Uso obrigatório de `next/image` com WebP.
    * Fontes: Uso de `next/font` para zero CLS (Cumulative Layout Shift).

## ♿ Acessibilidade (A11y)
Obrigatório para conformidade WCAG 2.1 AA.

1.  **Navegação por Teclado:** Todo o fluxo de criação de O.S. deve ser operável apenas com teclado (Tab, Enter, Space, Esc).
2.  **ARIA Labels:**
    * Botões que são apenas ícones devem ter `aria-label`.
    * Inputs devem ter `aria-describedby` para mensagens de erro.
3.  **Contraste e Cores:** O Design System deve garantir tokens de cores com contraste mínimo de 4.5:1.
4.  **Gerenciamento de Foco:** Ao abrir um Modal, o foco deve ser aprisionado nele. Ao fechar, o foco volta ao elemento disparador.
5.  **Feedback de Tela:** Uso de `Live Regions` para leitores de tela anunciarem atualizações dinâmicas (ex: "Item adicionado com sucesso").

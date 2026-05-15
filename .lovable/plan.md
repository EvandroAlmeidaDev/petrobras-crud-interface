## Objetivo
Tornar o sidebar colapsável (com botão de expandir/retrair) em todas as telas (`/` CRUD, `/dashboard`, `/dashboard/detail`) e aplicar um pacote de melhorias visuais e UI/UX consistente em todo o template Petrobras.

## 1. Sidebar colapsável (compartilhado)

Hoje cada rota tem seu próprio `<aside>` duplicado. Vou:

- Extrair em um componente único `src/components/petrobras/AppSidebar.tsx` + `AppShell.tsx` (sidebar + topbar + área de conteúdo) reutilizado por `/`, `/dashboard` e `/dashboard/detail`.
- Estado controlado via `useState` persistido em `localStorage` (`petrobras.sidebar.collapsed`).
- Larguras: `w-60` (expandido) ↔ `w-[68px]` (colapsado, só ícones), com transição suave.
- Botão de toggle no header da sidebar (ícone `PanelLeftClose` / `PanelLeftOpen`) e atalho de teclado `[` para alternar.
- Quando colapsado: tooltips nos itens (shadcn `Tooltip`) e o card "Suporte 24/7" vira só um ícone com tooltip.
- Marcação de rota ativa real via `useRouterState` (hoje "Ativos" está hardcoded como ativo).
- Mobile: vira `Sheet` (off‑canvas) acionado por um botão `Menu` no topbar.

## 2. Melhorias visuais & UI/UX propostas

### Identidade e hierarquia
- Topbar com **breadcrumbs reais** (clicáveis) usando `Breadcrumb` do shadcn, no lugar do "Operações / Ativos" estático.
- Faixa fina superior verde‑Petrobras (2px) para reforçar a marca sem poluir.
- Logo do sidebar com micro‑gradiente verde→verde escuro (token `--gradient-primary`).

### Sistema de design (em `src/styles.css`)
- Adicionar tokens semânticos faltantes: `--success`, `--warning`, `--danger`, `--info` + foregrounds, e usar nos badges de status (`Ativo / Manutenção / Crítico / Inativo`) — hoje as cores são hex inline em `statusStyles`.
- Tokens `--gradient-primary`, `--shadow-elegant`, `--shadow-card` para reuso.
- Suporte a **dark mode** (toggle no topbar) — as variáveis já existem, falta um botão e ajustar a paleta `.dark` para os verdes Petrobras.

### CRUD (`/`)
- KPIs com **mini‑sparkline** (Recharts) ao lado do número, em vez de só seta + %.
- Linha da tabela com hover + linha ativa destacada; densidade ajustável (compact / comfortable) via toggle.
- **Barra de ações em massa** que aparece quando há linhas selecionadas (Excluir, Exportar, Mudar status).
- Filtros avançados num `Sheet` lateral (tipo, unidade, responsável, faixa de produção).
- Paginação com seletor de itens por página + contador "X–Y de Z".
- Skeletons de carregamento na tabela e KPIs.
- Estado vazio ilustrado quando nenhum filtro retorna resultado.
- Confirmação de exclusão via `AlertDialog` + toasts (`sonner`) em criar/editar/excluir.
- Atalhos: `/` foca busca, `n` abre novo ativo, `Esc` fecha dialog.

### Dashboard (`/dashboard`)
- Seletor de período global (Hoje / 7d / 30d / 12m / custom) no topbar do dashboard.
- Botão "Atualizar" com timestamp da última atualização.
- Cards de gráfico com **menu de ações** (exportar PNG/CSV, expandir em modal, fixar).
- Legenda dos gráficos clicável para ocultar/mostrar séries.
- Estado de loading com `Skeleton` em cada `ChartCard`.

### Acessibilidade & polimento
- `aria-label` em todos os botões só‑ícone, foco visível consistente (`focus-visible:ring`).
- Animações suaves (`animate-fade-in`, `animate-scale-in`) em diálogos e cards.
- Tipografia: aumentar `tracking-tight` em h1/h2 já existe; padronizar tamanhos (h1 18px, h2 16px, label 11px uppercase).

## 3. Arquivos afetados (resumo técnico)

```text
src/styles.css                          # tokens success/warning/danger, gradients, shadows, dark Petrobras
src/components/petrobras/AppShell.tsx   # NOVO — layout (sidebar + topbar + outlet/children)
src/components/petrobras/AppSidebar.tsx # NOVO — sidebar colapsável + tooltips + mobile sheet
src/components/petrobras/TopBar.tsx     # NOVO — breadcrumbs, toggle dark, perfil
src/routes/__root.tsx                   # envolve Outlet no AppShell
src/routes/index.tsx                    # remove sidebar local, usa shell; aplica melhorias do CRUD
src/routes/dashboard.tsx                # remove sidebar local, usa shell; melhorias dos cards
src/routes/dashboard.detail.tsx         # remove sidebar local, usa shell
```

## Perguntas antes de implementar

1. Quer que eu aplique **tudo** acima de uma vez, ou prefere faseado (Fase 1: sidebar colapsável + shell compartilhado; Fase 2: melhorias do CRUD; Fase 3: melhorias do dashboard; Fase 4: dark mode)?
2. Inclui **dark mode** com toggle agora, ou deixa para depois?
3. Mantém a sidebar **sempre visível** no desktop (apenas colapsa para ícones) ou permite esconder totalmente também?

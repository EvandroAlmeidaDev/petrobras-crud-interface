import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Calendar,
  Download,
  Droplet,
  Factory,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Settings,
  Users,
  Activity,
  Gauge,
  TrendingUp,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

const COLORS = {
  green: "oklch(0.42 0.13 165)",
  greenLight: "oklch(0.62 0.13 165)",
  greenSoft: "oklch(0.85 0.08 165)",
  yellow: "oklch(0.78 0.16 90)",
  blue: "oklch(0.5 0.13 230)",
  blueDark: "oklch(0.32 0.1 230)",
  red: "oklch(0.6 0.18 25)",
  gray: "oklch(0.7 0.02 240)",
  grid: "oklch(0.92 0.005 240)",
};

const PALETTE = [
  COLORS.green,
  COLORS.blue,
  COLORS.yellow,
  COLORS.greenLight,
  COLORS.red,
  COLORS.blueDark,
];

// ───────────────────────── Mock data ─────────────────────────
const productionData = [
  { mes: "Jan", oleo: 2.6, gas: 1.4, meta: 2.5 },
  { mes: "Fev", oleo: 2.7, gas: 1.45, meta: 2.55 },
  { mes: "Mar", oleo: 2.65, gas: 1.5, meta: 2.6 },
  { mes: "Abr", oleo: 2.8, gas: 1.55, meta: 2.65 },
  { mes: "Mai", oleo: 2.75, gas: 1.6, meta: 2.7 },
  { mes: "Jun", oleo: 2.9, gas: 1.65, meta: 2.75 },
  { mes: "Jul", oleo: 3.0, gas: 1.7, meta: 2.8 },
  { mes: "Ago", oleo: 2.95, gas: 1.72, meta: 2.85 },
  { mes: "Set", oleo: 3.1, gas: 1.78, meta: 2.9 },
  { mes: "Out", oleo: 3.15, gas: 1.82, meta: 2.95 },
  { mes: "Nov", oleo: 3.05, gas: 1.85, meta: 3.0 },
  { mes: "Dez", oleo: 3.2, gas: 1.9, meta: 3.05 },
];

const refineryData = [
  { name: "REPLAN", value: 415 },
  { name: "REDUC", value: 242 },
  { name: "REVAP", value: 252 },
  { name: "RNEST", value: 115 },
  { name: "RLAM", value: 333 },
  { name: "RPBC", value: 170 },
];

const sourceMix = [
  { name: "Pré-sal", value: 78, color: COLORS.green },
  { name: "Pós-sal", value: 14, color: COLORS.blue },
  { name: "Terra", value: 5, color: COLORS.yellow },
  { name: "Águas rasas", value: 3, color: COLORS.gray },
];

const radarData = [
  { area: "Segurança", atual: 92, meta: 95 },
  { area: "Eficiência", atual: 88, meta: 90 },
  { area: "Ambiental", atual: 85, meta: 88 },
  { area: "Custo", atual: 78, meta: 82 },
  { area: "Qualidade", atual: 94, meta: 92 },
  { area: "Inovação", atual: 80, meta: 85 },
];

const kpiRadial = [
  { name: "Disponibilidade", value: 96.4, fill: COLORS.green },
  { name: "Eficiência", value: 89.2, fill: COLORS.blue },
  { name: "Performance", value: 84.5, fill: COLORS.yellow },
  { name: "Qualidade", value: 92.8, fill: COLORS.greenLight },
];

const scatterData = Array.from({ length: 36 }, (_, i) => ({
  pressao: 60 + Math.random() * 80,
  vazao: 200 + Math.random() * 600,
  size: 50 + Math.random() * 250,
  poco: `Poço-${i + 1}`,
}));

const treemapData = [
  {
    name: "Exploração & Produção",
    children: [
      { name: "Bacia de Santos", size: 4200 },
      { name: "Bacia de Campos", size: 2800 },
      { name: "Espírito Santo", size: 980 },
      { name: "Sergipe-Alagoas", size: 540 },
    ],
  },
  {
    name: "Refino",
    children: [
      { name: "REPLAN", size: 2100 },
      { name: "REDUC", size: 1500 },
      { name: "RLAM", size: 1300 },
      { name: "RNEST", size: 760 },
    ],
  },
  {
    name: "Gás & Energia",
    children: [
      { name: "Térmicas", size: 920 },
      { name: "GNL", size: 640 },
      { name: "Distribuição", size: 410 },
    ],
  },
];

const heatHours = ["00", "04", "08", "12", "16", "20"];
const heatDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const heatData = heatDays.map((d) =>
  heatHours.map(() => Math.round(Math.random() * 100)),
);

// ─────────────── Tooltip ───────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-xs shadow-md">
      {label && <p className="mb-1 font-medium text-foreground">{label}</p>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: p.color || p.fill }}
          />
          <span>{p.name}:</span>
          <span className="font-medium text-foreground tabular-nums">
            {typeof p.value === "number" ? p.value.toLocaleString("pt-BR") : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─────────────── Card ───────────────
function ChartCard({
  title,
  subtitle,
  badge,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-border bg-card p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {badge && (
          <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function Dashboard() {
  const [period, setPeriod] = useState("12m");

  const stats = useMemo(
    () => [
      { label: "Produção total", value: "3,2M bpd", trend: "+4,2%", up: true, icon: Droplet },
      { label: "Disponibilidade", value: "96,4%", trend: "+0,8%", up: true, icon: Activity },
      { label: "Receita acumulada", value: "R$ 412B", trend: "+12,1%", up: true, icon: TrendingUp },
      { label: "Incidentes (TRIR)", value: "0,42", trend: "-18%", up: true, icon: Gauge },
    ],
    [],
  );

  const heatMax = 100;

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--petrobras-green)]">
            <Droplet className="h-5 w-5 text-[var(--petrobras-yellow)]" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">Petrobras</p>
            <p className="text-[11px] text-muted-foreground">Gestão de Ativos</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3 text-sm">
          {[
            { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard", active: true },
            { icon: Factory, label: "Ativos", to: "/" },
            { icon: Droplet, label: "Produção" },
            { icon: Users, label: "Equipes" },
            { icon: FileText, label: "Relatórios" },
            { icon: Settings, label: "Configurações" },
          ].map((item) => {
            const cls = `flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
              item.active
                ? "bg-[var(--petrobras-green)] text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`;
            return item.to ? (
              <Link key={item.label} to={item.to} className={cls}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ) : (
              <button key={item.label} className={cls}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div>
            <p className="text-xs text-muted-foreground">Operações / Visão geral</p>
            <h1 className="text-base font-semibold tracking-tight">
              Dashboard executivo de operações
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="ml-2 flex items-center gap-3 border-l border-border pl-4">
              <div className="text-right leading-tight">
                <p className="text-sm font-medium">Eduardo Silva</p>
                <p className="text-[11px] text-muted-foreground">Engenheiro Sênior</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--petrobras-green)] text-sm font-semibold text-primary-foreground">
                ES
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-6 p-6">
          {/* Filters */}
          <section className="flex flex-wrap items-center justify-between gap-3">
            <Tabs value={period} onValueChange={setPeriod}>
              <TabsList>
                <TabsTrigger value="24h">24h</TabsTrigger>
                <TabsTrigger value="7d">7 dias</TabsTrigger>
                <TabsTrigger value="30d">30 dias</TabsTrigger>
                <TabsTrigger value="12m">12 meses</TabsTrigger>
                <TabsTrigger value="ytd">Ano</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <Select defaultValue="todas">
                <SelectTrigger className="h-9 w-[180px]">
                  <Filter className="mr-1 h-3.5 w-3.5" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as unidades</SelectItem>
                  <SelectItem value="santos">Bacia de Santos</SelectItem>
                  <SelectItem value="campos">Bacia de Campos</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-9">
                <Calendar className="mr-1.5 h-4 w-4" />
                01 Jan – 31 Dez
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Download className="mr-1.5 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </section>

          {/* KPIs */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border bg-card p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <s.icon className="h-4 w-4 text-[var(--petrobras-green)]" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">
                  {s.value}
                </p>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  {s.up ? (
                    <ArrowUpRight className="h-3 w-3 text-[oklch(0.5_0.15_165)]" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-[oklch(0.55_0.18_25)]" />
                  )}
                  <span
                    className={
                      s.up
                        ? "text-[oklch(0.45_0.15_165)]"
                        : "text-[oklch(0.5_0.18_25)]"
                    }
                  >
                    {s.trend}
                  </span>
                  <span className="text-muted-foreground">vs. período anterior</span>
                </div>
                {/* Sparkline */}
                <div className="mt-3 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={productionData}>
                      <defs>
                        <linearGradient id={`spark-${s.label}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.4} />
                          <stop offset="100%" stopColor={COLORS.green} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="oleo"
                        stroke={COLORS.green}
                        strokeWidth={1.5}
                        fill={`url(#spark-${s.label})`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </section>

          {/* Row 1: Big area + donut */}
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <ChartCard
              title="Produção mensal por origem"
              subtitle="Milhões de barris equivalentes (boe/d)"
              badge="Área"
              className="xl:col-span-2"
            >
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={productionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="g-oleo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.45} />
                        <stop offset="100%" stopColor={COLORS.green} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="g-gas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS.blue} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="mes" stroke={COLORS.gray} fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke={COLORS.gray} fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                    <Area type="monotone" name="Óleo" dataKey="oleo" stroke={COLORS.green} strokeWidth={2} fill="url(#g-oleo)" />
                    <Area type="monotone" name="Gás" dataKey="gas" stroke={COLORS.blue} strokeWidth={2} fill="url(#g-gas)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Mix de origem" subtitle="Participação por fonte" badge="Donut">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<ChartTooltip />} />
                    <Pie
                      data={sourceMix}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {sourceMix.map((s, i) => (
                        <Cell key={i} fill={s.color} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>

          {/* Row 2: Bar + Line + Composed */}
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <ChartCard title="Capacidade por refinaria" subtitle="Mil barris/dia" badge="Barras">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={refineryData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="name" stroke={COLORS.gray} fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke={COLORS.gray} fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "oklch(0.96 0.005 240)" }} />
                    <Bar dataKey="value" name="Capacidade" radius={[4, 4, 0, 0]} fill={COLORS.green} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Tendência vs. meta" subtitle="Produção real x planejada" badge="Linha">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={productionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="mes" stroke={COLORS.gray} fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke={COLORS.gray} fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                    <Line type="monotone" dataKey="oleo" name="Real" stroke={COLORS.green} strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="meta" name="Meta" stroke={COLORS.yellow} strokeWidth={2} strokeDasharray="5 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Composto: barras + linha" subtitle="Produção e meta combinadas" badge="Composto">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={productionData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid stroke={COLORS.grid} vertical={false} />
                    <XAxis dataKey="mes" stroke={COLORS.gray} fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke={COLORS.gray} fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                    <Bar dataKey="gas" name="Gás" fill={COLORS.blue} radius={[3, 3, 0, 0]} barSize={14} />
                    <Line type="monotone" dataKey="oleo" name="Óleo" stroke={COLORS.green} strokeWidth={2.5} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>

          {/* Row 3: Radar + RadialBar + Scatter */}
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <ChartCard title="Performance operacional" subtitle="Atual vs. meta por dimensão" badge="Radar">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke={COLORS.grid} />
                    <PolarAngleAxis dataKey="area" tick={{ fontSize: 11, fill: COLORS.gray }} />
                    <PolarRadiusAxis angle={30} tick={{ fontSize: 10, fill: COLORS.gray }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Radar name="Atual" dataKey="atual" stroke={COLORS.green} fill={COLORS.green} fillOpacity={0.35} />
                    <Radar name="Meta" dataKey="meta" stroke={COLORS.yellow} fill={COLORS.yellow} fillOpacity={0.15} />
                    <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="OEE por dimensão" subtitle="Indicadores em %" badge="Radial">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="25%" outerRadius="100%" data={kpiRadial} startAngle={90} endAngle={-270}>
                    <RadialBar background dataKey="value" cornerRadius={6} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend
                      iconSize={8}
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{ fontSize: 11 }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Pressão x Vazão por poço" subtitle="Bolha = produção diária" badge="Bubble">
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid stroke={COLORS.grid} />
                    <XAxis type="number" dataKey="pressao" name="Pressão" unit=" bar" stroke={COLORS.gray} fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis type="number" dataKey="vazao" name="Vazão" unit=" m³/h" stroke={COLORS.gray} fontSize={11} tickLine={false} axisLine={false} />
                    <ZAxis type="number" dataKey="size" range={[40, 320]} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltip />} />
                    <Scatter data={scatterData} fill={COLORS.green} fillOpacity={0.65} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>

          {/* Row 4: Treemap + Heatmap (custom) */}
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <ChartCard
              title="Distribuição de receita"
              subtitle="Por segmento e unidade (R$ mi)"
              badge="Treemap"
              className="xl:col-span-2"
            >
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <Treemap
                    data={treemapData}
                    dataKey="size"
                    stroke="#fff"
                    fill={COLORS.green}
                    content={<TreemapContent />}
                  />
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Mapa de calor — incidentes" subtitle="Frequência por dia/horário" badge="Heatmap">
              <div className="space-y-2">
                <div className="grid grid-cols-[40px_repeat(6,1fr)] gap-1.5 text-[10px] text-muted-foreground">
                  <div></div>
                  {heatHours.map((h) => (
                    <div key={h} className="text-center">{h}h</div>
                  ))}
                  {heatData.map((row, di) => (
                    <div key={`row-${di}`} className="contents">
                      <div className="flex items-center text-[10px] text-muted-foreground">
                        {heatDays[di]}
                      </div>
                      {row.map((v, hi) => {
                        const intensity = v / heatMax;
                        return (
                          <div
                            key={`c-${di}-${hi}`}
                            className="aspect-square rounded-sm"
                            style={{
                              background: `oklch(${0.95 - intensity * 0.55} ${0.04 + intensity * 0.12} 165)`,
                            }}
                            title={`${heatDays[di]} ${heatHours[hi]}h: ${v}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>Menor</span>
                  <div className="flex h-2 flex-1 mx-3 rounded-full overflow-hidden">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1"
                        style={{
                          background: `oklch(${0.95 - (i / 10) * 0.55} ${0.04 + (i / 10) * 0.12} 165)`,
                        }}
                      />
                    ))}
                  </div>
                  <span>Maior</span>
                </div>
              </div>
            </ChartCard>
          </section>

          <p className="pt-2 text-center text-[11px] text-muted-foreground">
            Petrobras · Painel de operações · Dados ilustrativos para fins de demonstração
          </p>
        </main>
      </div>
    </div>
  );
}

// Treemap custom cell
function TreemapContent(props: any) {
  const { x, y, width, height, name, depth, index } = props;
  const fill =
    depth === 1
      ? PALETTE[index % PALETTE.length]
      : `oklch(${0.55 + (index % 5) * 0.06} 0.1 165)`;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill,
          stroke: "#fff",
          strokeWidth: 2,
          fillOpacity: depth === 1 ? 0.95 : 0.85,
        }}
      />
      {width > 70 && height > 28 && (
        <text
          x={x + 8}
          y={y + 18}
          fill="#fff"
          fontSize={11}
          fontWeight={500}
          style={{ pointerEvents: "none" }}
        >
          {name}
        </text>
      )}
    </g>
  );
}

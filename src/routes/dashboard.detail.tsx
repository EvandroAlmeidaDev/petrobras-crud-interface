import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Download,
  Droplet,
  Factory,
  Gauge,
  MapPin,
  TrendingUp,
  User,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type DrillType = "unit" | "refinery" | "period" | "well" | "segment";

interface DrillSearch {
  type: DrillType;
  id: string;
  period?: string;
}

export const Route = createFileRoute("/dashboard/detail")({
  validateSearch: (search: Record<string, unknown>): DrillSearch => ({
    type: (search.type as DrillType) ?? "unit",
    id: (search.id as string) ?? "",
    period: search.period as string | undefined,
  }),
  component: DetailPage,
});

const COLORS = {
  green: "oklch(0.42 0.13 165)",
  blue: "oklch(0.5 0.13 230)",
  yellow: "oklch(0.78 0.16 90)",
  gray: "oklch(0.7 0.02 240)",
  grid: "oklch(0.92 0.005 240)",
};

const META: Record<DrillType, { label: string; icon: typeof Factory }> = {
  unit: { label: "Unidade", icon: MapPin },
  refinery: { label: "Refinaria", icon: Factory },
  period: { label: "Período", icon: Calendar },
  well: { label: "Poço", icon: Droplet },
  segment: { label: "Segmento", icon: TrendingUp },
};

function generateSeries(seed: string, base: number, points = 24) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return Array.from({ length: points }, (_, i) => {
    h = (h * 1664525 + 1013904223) >>> 0;
    const noise = ((h % 1000) / 1000 - 0.5) * base * 0.18;
    return {
      x: `${String(i + 1).padStart(2, "0")}`,
      producao: +(base + noise + i * (base * 0.005)).toFixed(2),
      meta: +(base * 1.02).toFixed(2),
      eficiencia: +(82 + ((h % 200) / 20)).toFixed(1),
    };
  });
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2 text-xs shadow-md">
      {label && <p className="mb-1 font-medium text-foreground">{label}</p>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span>{p.name}:</span>
          <span className="font-medium text-foreground tabular-nums">
            {typeof p.value === "number" ? p.value.toLocaleString("pt-BR") : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function DetailPage() {
  const { type, id, period } = Route.useSearch() as DrillSearch;
  const navigate = useNavigate();
  const meta = META[type];
  const Icon = meta.icon;

  const baseValue =
    type === "refinery" ? 280 : type === "period" ? 3.0 : type === "well" ? 14 : 180;
  const unit =
    type === "refinery" ? "mil bpd" : type === "period" ? "Mboe/d" : type === "well" ? "k m³/h" : "k bpd";

  const series = generateSeries(`${type}-${id}-${period ?? ""}`, baseValue);
  const total = series.reduce((s, d) => s + d.producao, 0);
  const avgEff = (series.reduce((s, d) => s + d.eficiencia, 0) / series.length).toFixed(1);

  const kpis = [
    { label: `Produção total`, value: `${total.toFixed(0)} ${unit}`, trend: "+3,4%", icon: Droplet },
    { label: "Eficiência média", value: `${avgEff}%`, trend: "+1,2%", icon: Activity },
    { label: "Disponibilidade", value: "96,8%", trend: "+0,6%", icon: Gauge },
    { label: "Receita estimada", value: "R$ 1,42B", trend: "+8,9%", icon: TrendingUp },
  ];

  const incidents = [
    { hora: "08:42", desc: "Alerta de pressão acima do limite", sev: "Alta" },
    { hora: "11:15", desc: "Manutenção preventiva concluída", sev: "Info" },
    { hora: "14:03", desc: "Vazão ajustada para nova meta", sev: "Média" },
    { hora: "18:27", desc: "Inspeção de turno encerrada", sev: "Info" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/dashboard" })}
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
            <div className="h-6 w-px bg-border" />
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
              <span>/</span>
              <span>{meta.label}</span>
              <span>/</span>
              <span className="font-medium text-foreground">{id}</span>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9">
              <Calendar className="mr-1.5 h-4 w-4" />
              {period ?? "Período completo"}
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="mr-1.5 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-6 p-6">
        {/* Hero */}
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[var(--petrobras-green)]">
                <Icon className="h-7 w-7 text-[var(--petrobras-yellow)]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {meta.label} {period ? `· ${period}` : ""}
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">{id}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="border-[oklch(0.85_0.08_165)] bg-[oklch(0.95_0.06_165)] text-[oklch(0.32_0.11_168)] font-normal">
                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
                    Operacional
                  </Badge>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> Carlos Mendes
                  </span>
                  <span>· Atualizado há 12min</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Produção atual</p>
              <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">
                {baseValue.toLocaleString("pt-BR")}
              </p>
              <p className="text-xs text-muted-foreground">{unit}</p>
            </div>
          </div>
        </section>

        {/* KPIs */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {k.label}
                </p>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                  <k.icon className="h-4 w-4 text-[var(--petrobras-green)]" />
                </div>
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{k.value}</p>
              <div className="mt-1 flex items-center gap-1 text-xs">
                <ArrowUpRight className="h-3 w-3 text-[oklch(0.5_0.15_165)]" />
                <span className="text-[oklch(0.45_0.15_165)]">{k.trend}</span>
                <span className="text-muted-foreground">vs. período anterior</span>
              </div>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-5 xl:col-span-2">
            <div className="mb-4">
              <h3 className="text-sm font-semibold tracking-tight">
                Produção horária — {id}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Detalhamento operacional do {meta.label.toLowerCase()} selecionado
              </p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="d-prod" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={COLORS.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={COLORS.grid} vertical={false} />
                  <XAxis dataKey="x" stroke={COLORS.gray} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={COLORS.gray} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" name="Produção" dataKey="producao" stroke={COLORS.green} strokeWidth={2} fill="url(#d-prod)" />
                  <Line type="monotone" name="Meta" dataKey="meta" stroke={COLORS.yellow} strokeWidth={2} strokeDasharray="5 4" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold tracking-tight">Eficiência</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">% por intervalo</p>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series.slice(0, 12)} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid stroke={COLORS.grid} vertical={false} />
                  <XAxis dataKey="x" stroke={COLORS.gray} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={COLORS.gray} fontSize={11} tickLine={false} axisLine={false} domain={[70, 100]} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "oklch(0.96 0.005 240)" }} />
                  <Bar dataKey="eficiencia" name="Eficiência" radius={[4, 4, 0, 0]} fill={COLORS.blue} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Events */}
        <section className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-5">
            <h3 className="text-sm font-semibold tracking-tight">Eventos do período</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Registros operacionais e alertas correlacionados
            </p>
          </div>
          <ul className="divide-y divide-border">
            {incidents.map((i) => (
              <li key={i.hora} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-muted-foreground">{i.hora}</span>
                  <span>{i.desc}</span>
                </div>
                <Badge
                  variant="outline"
                  className={
                    i.sev === "Alta"
                      ? "bg-[oklch(0.95_0.06_25)] text-[oklch(0.45_0.18_25)] border-[oklch(0.85_0.1_25)] font-normal"
                      : i.sev === "Média"
                      ? "bg-[oklch(0.96_0.1_95)] text-[oklch(0.42_0.13_70)] border-[oklch(0.85_0.12_95)] font-normal"
                      : "font-normal"
                  }
                >
                  {i.sev}
                </Badge>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

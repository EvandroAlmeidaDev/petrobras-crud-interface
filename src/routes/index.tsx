import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Factory,
  Droplet,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  Inbox,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppShell } from "@/components/petrobras/AppShell";
import { TopBar } from "@/components/petrobras/TopBar";

export const Route = createFileRoute("/")({
  component: Index,
});

type Status = "Ativo" | "Manutenção" | "Inativo" | "Crítico";

interface Asset {
  id: string;
  codigo: string;
  nome: string;
  tipo: string;
  unidade: string;
  responsavel: string;
  status: Status;
  producao: string;
  atualizado: string;
}

const initialData: Asset[] = [
  { id: "1", codigo: "P-77", nome: "Plataforma Petrobras 77", tipo: "Plataforma FPSO", unidade: "Bacia de Campos", responsavel: "Carlos Mendes", status: "Ativo", producao: "180.000 bpd", atualizado: "há 2h" },
  { id: "2", codigo: "REPLAN", nome: "Refinaria de Paulínia", tipo: "Refinaria", unidade: "Paulínia - SP", responsavel: "Ana Beatriz Lima", status: "Ativo", producao: "415.000 bpd", atualizado: "há 5h" },
  { id: "3", codigo: "P-66", nome: "Plataforma Petrobras 66", tipo: "Plataforma FPSO", unidade: "Bacia de Santos", responsavel: "Roberto Almeida", status: "Manutenção", producao: "0 bpd", atualizado: "há 1d" },
  { id: "4", codigo: "RNEST", nome: "Refinaria Abreu e Lima", tipo: "Refinaria", unidade: "Ipojuca - PE", responsavel: "Juliana Castro", status: "Ativo", producao: "115.000 bpd", atualizado: "há 30min" },
  { id: "5", codigo: "P-75", nome: "Plataforma Petrobras 75", tipo: "Plataforma FPSO", unidade: "Búzios - SP", responsavel: "Felipe Rocha", status: "Ativo", producao: "150.000 bpd", atualizado: "há 1h" },
  { id: "6", codigo: "REDUC", nome: "Refinaria Duque de Caxias", tipo: "Refinaria", unidade: "Duque de Caxias - RJ", responsavel: "Marina Souza", status: "Crítico", producao: "242.000 bpd", atualizado: "há 12min" },
  { id: "7", codigo: "P-70", nome: "Plataforma Petrobras 70", tipo: "Plataforma FPSO", unidade: "Atapu - SP", responsavel: "Lucas Pereira", status: "Inativo", producao: "0 bpd", atualizado: "há 3d" },
  { id: "8", codigo: "RLAM", nome: "Refinaria Landulpho Alves", tipo: "Refinaria", unidade: "São Francisco - BA", responsavel: "Patrícia Nogueira", status: "Manutenção", producao: "85.000 bpd", atualizado: "há 6h" },
];

const statusStyles: Record<Status, string> = {
  Ativo:
    "bg-[var(--success-soft)] text-[var(--success)] border-[var(--success-border)]",
  Manutenção:
    "bg-[var(--warning-soft)] text-[var(--warning)] border-[var(--warning-border)]",
  Inativo: "bg-muted text-muted-foreground border-border",
  Crítico:
    "bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger-border)]",
};

function Index() {
  const [data, setData] = useState<Asset[]>(initialData);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);

  const filtered = useMemo(() => {
    return data.filter((d) => {
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        d.nome.toLowerCase().includes(q) ||
        d.codigo.toLowerCase().includes(q) ||
        d.responsavel.toLowerCase().includes(q);
      const matchS = statusFilter === "all" || d.status === statusFilter;
      return matchQ && matchS;
    });
  }, [data, query, statusFilter]);

  const allChecked = filtered.length > 0 && filtered.every((d) => selected.has(d.id));

  const toggleAll = () => {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(filtered.map((d) => d.id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleSave = (asset: Asset) => {
    if (editing) {
      setData((prev) => prev.map((d) => (d.id === asset.id ? asset : d)));
    } else {
      setData((prev) => [{ ...asset, id: String(Date.now()) }, ...prev]);
    }
    setOpen(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((d) => d.id !== id));
  };

  const stats = [
    { label: "Ativos totais", value: "248", trend: "+4,2%", up: true, icon: Factory },
    { label: "Em operação", value: "186", trend: "+1,8%", up: true, icon: Droplet },
    { label: "Em manutenção", value: "42", trend: "-2,1%", up: false, icon: Settings },
    { label: "Produção (bpd)", value: "2,8M", trend: "+0,9%", up: true, icon: ArrowUpRight },
  ];

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
            { icon: LayoutDashboard, label: "Dashboard" },
            { icon: Factory, label: "Ativos", active: true },
            { icon: Droplet, label: "Produção" },
            { icon: Users, label: "Equipes" },
            { icon: FileText, label: "Relatórios" },
            { icon: Settings, label: "Configurações" },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors ${
                item.active
                  ? "bg-[var(--petrobras-green)] text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs font-medium">Suporte 24/7</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Central de operações sempre disponível.
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div>
            <p className="text-xs text-muted-foreground">Operações / Ativos</p>
            <h1 className="text-base font-semibold tracking-tight">Gestão de Ativos Operacionais</h1>
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
          {/* Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                    <s.icon className="h-4 w-4 text-[var(--petrobras-green)]" />
                  </div>
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight">{s.value}</p>
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
                  <span className="text-muted-foreground">vs. mês anterior</span>
                </div>
              </div>
            ))}
          </section>

          {/* CRUD card */}
          <section className="rounded-lg border border-border bg-card">
            <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-semibold tracking-tight">Ativos cadastrados</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Gerencie plataformas, refinarias e instalações operacionais.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por código, nome ou responsável..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-9 w-[280px] pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-[150px]">
                    <Filter className="mr-1 h-3.5 w-3.5" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos status</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Manutenção">Manutenção</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Crítico">Crítico</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-9">
                  <Download className="mr-1.5 h-4 w-4" />
                  Exportar
                </Button>
                <Button
                  size="sm"
                  className="h-9 bg-[var(--petrobras-green)] text-primary-foreground hover:bg-[var(--petrobras-green-dark)]"
                  onClick={() => {
                    setEditing(null);
                    setOpen(true);
                  }}
                >
                  <Plus className="mr-1.5 h-4 w-4" />
                  Novo ativo
                </Button>
              </div>
            </div>

            {selected.size > 0 && (
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-2.5 text-sm">
                <span className="text-muted-foreground">
                  <span className="font-medium text-foreground">{selected.size}</span>{" "}
                  selecionado(s)
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8">
                    Arquivar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Excluir
                  </Button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-10">
                      <Checkbox checked={allChecked} onCheckedChange={toggleAll} />
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Código
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Ativo
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Tipo
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Responsável
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Produção
                    </TableHead>
                    <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Atualizado
                    </TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((asset) => (
                    <TableRow key={asset.id} className="border-border">
                      <TableCell>
                        <Checkbox
                          checked={selected.has(asset.id)}
                          onCheckedChange={() => toggleOne(asset.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs font-medium">
                        {asset.codigo}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{asset.nome}</div>
                        <div className="text-xs text-muted-foreground">{asset.unidade}</div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {asset.tipo}
                      </TableCell>
                      <TableCell className="text-sm">{asset.responsavel}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-normal ${statusStyles[asset.status]}`}
                        >
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm tabular-nums">
                        {asset.producao}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {asset.atualizado}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditing(asset);
                                setOpen(true);
                              }}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(asset.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="py-12 text-center text-sm text-muted-foreground">
                        Nenhum ativo encontrado para os filtros selecionados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm">
              <p className="text-xs text-muted-foreground">
                Exibindo <span className="font-medium text-foreground">1–{filtered.length}</span>{" "}
                de <span className="font-medium text-foreground">{data.length}</span> ativos
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 bg-[var(--petrobras-green)] text-primary-foreground hover:bg-[var(--petrobras-green-dark)] hover:text-primary-foreground"
                >
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  2
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8">
                  3
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>

      <AssetDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setEditing(null);
        }}
        asset={editing}
        onSave={handleSave}
      />
    </div>
  );
}

function AssetDialog({
  open,
  onOpenChange,
  asset,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  asset: Asset | null;
  onSave: (a: Asset) => void;
}) {
  const isEdit = !!asset;
  const [form, setForm] = useState<Asset>(
    asset ?? {
      id: "",
      codigo: "",
      nome: "",
      tipo: "Plataforma FPSO",
      unidade: "",
      responsavel: "",
      status: "Ativo",
      producao: "0 bpd",
      atualizado: "agora",
    },
  );

  // sync when opening
  useMemo(() => {
    if (open) {
      setForm(
        asset ?? {
          id: "",
          codigo: "",
          nome: "",
          tipo: "Plataforma FPSO",
          unidade: "",
          responsavel: "",
          status: "Ativo",
          producao: "0 bpd",
          atualizado: "agora",
        },
      );
    }
  }, [open, asset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar ativo" : "Cadastrar novo ativo"}</DialogTitle>
          <DialogDescription>
            Preencha as informações operacionais do ativo. Todos os campos são obrigatórios.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="codigo" className="text-xs">Código</Label>
            <Input
              id="codigo"
              value={form.codigo}
              onChange={(e) => setForm({ ...form, codigo: e.target.value })}
              placeholder="P-77"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tipo" className="text-xs">Tipo</Label>
            <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
              <SelectTrigger id="tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Plataforma FPSO">Plataforma FPSO</SelectItem>
                <SelectItem value="Refinaria">Refinaria</SelectItem>
                <SelectItem value="Terminal">Terminal</SelectItem>
                <SelectItem value="Duto">Duto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label htmlFor="nome" className="text-xs">Nome do ativo</Label>
            <Input
              id="nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Plataforma Petrobras 77"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="unidade" className="text-xs">Unidade / Localização</Label>
            <Input
              id="unidade"
              value={form.unidade}
              onChange={(e) => setForm({ ...form, unidade: e.target.value })}
              placeholder="Bacia de Campos"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="resp" className="text-xs">Responsável</Label>
            <Input
              id="resp"
              value={form.responsavel}
              onChange={(e) => setForm({ ...form, responsavel: e.target.value })}
              placeholder="Carlos Mendes"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status" className="text-xs">Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => setForm({ ...form, status: v as Status })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Manutenção">Manutenção</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
                <SelectItem value="Crítico">Crítico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prod" className="text-xs">Produção (bpd)</Label>
            <Input
              id="prod"
              value={form.producao}
              onChange={(e) => setForm({ ...form, producao: e.target.value })}
              placeholder="180.000 bpd"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-[var(--petrobras-green)] text-primary-foreground hover:bg-[var(--petrobras-green-dark)]"
            onClick={() => onSave(form)}
          >
            {isEdit ? "Salvar alterações" : "Cadastrar ativo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

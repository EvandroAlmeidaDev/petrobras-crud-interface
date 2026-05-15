import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Factory,
  Droplet,
  Users,
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  HeadphonesIcon,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const STORAGE_KEY = "petrobras.sidebar.collapsed";
const MOBILE_EVENT = "petrobras:sidebar:open";

type NavItem = {
  icon: typeof LayoutDashboard;
  label: string;
  to?: string;
};

const NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: Factory, label: "Ativos", to: "/" },
  { icon: Droplet, label: "Produção" },
  { icon: Users, label: "Equipes" },
  { icon: FileText, label: "Relatórios" },
  { icon: Settings, label: "Configurações" },
];

export function MobileSidebarTrigger({ className }: { className?: string }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("lg:hidden text-muted-foreground", className)}
      aria-label="Abrir menu"
      onClick={() => window.dispatchEvent(new CustomEvent(MOBILE_EVENT))}
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (v === "1") setCollapsed(true);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  // Keyboard: "[" toggles
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      if (e.key === "[") {
        e.preventDefault();
        setCollapsed((c) => !c);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Mobile open event
  useEffect(() => {
    const open = () => setMobileOpen(true);
    window.addEventListener(MOBILE_EVENT, open);
    return () => window.removeEventListener(MOBILE_EVENT, open);
  }, []);

  const isActive = (to?: string) => {
    if (!to) return false;
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  };

  const Brand = () => (
    <div className="flex h-16 items-center gap-3 border-b border-border px-4">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md shadow-sm"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Droplet
          className="h-5 w-5 text-[var(--petrobras-yellow)]"
          strokeWidth={2.5}
        />
      </div>
      {!collapsed && (
        <div className="leading-tight overflow-hidden">
          <p className="text-sm font-semibold tracking-tight truncate">
            Petrobras
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            Gestão de Ativos
          </p>
        </div>
      )}
    </div>
  );

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <TooltipProvider delayDuration={150}>
      <nav className="flex-1 space-y-1 p-2 text-sm">
        {NAV.map((item) => {
          const active = isActive(item.to);
          const baseCls = cn(
            "group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors",
            collapsed && "justify-center px-2",
            active
              ? "bg-[var(--petrobras-green)] text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          );
          const inner = (
            <>
              {active && !collapsed && (
                <span className="absolute inset-y-1 left-0 w-0.5 rounded-r bg-[var(--petrobras-yellow)]" />
              )}
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </>
          );
          const node = item.to ? (
            <Link to={item.to} className={baseCls} onClick={onNavigate}>
              {inner}
            </Link>
          ) : (
            <button type="button" className={baseCls} onClick={onNavigate}>
              {inner}
            </button>
          );
          return collapsed ? (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>{node}</TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          ) : (
            <div key={item.label}>{node}</div>
          );
        })}
      </nav>
    </TooltipProvider>
  );

  const Footer = () => (
    <div className="border-t border-border p-3">
      {collapsed ? (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex h-10 w-full items-center justify-center rounded-md bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Suporte 24/7"
              >
                <HeadphonesIcon className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Suporte 24/7</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <div className="rounded-lg bg-muted p-3">
          <div className="flex items-center gap-2">
            <HeadphonesIcon className="h-3.5 w-3.5 text-[var(--petrobras-green)]" />
            <p className="text-xs font-medium">Suporte 24/7</p>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Central de operações sempre disponível.
          </p>
        </div>
      )}
    </div>
  );

  const ToggleBtn = () => (
    <button
      type="button"
      onClick={() => setCollapsed((c) => !c)}
      aria-label={collapsed ? "Expandir menu" : "Retrair menu"}
      title={collapsed ? "Expandir ([)" : "Retrair ([)"}
      className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground hover:bg-muted transition-colors"
    >
      {collapsed ? (
        <PanelLeftOpen className="h-3.5 w-3.5" />
      ) : (
        <PanelLeftClose className="h-3.5 w-3.5" />
      )}
    </button>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className="relative hidden lg:flex shrink-0 flex-col border-r border-border bg-card transition-all duration-200 ease-out"
        style={{
          width: collapsed
            ? "var(--sidebar-width-icon)"
            : "var(--sidebar-width)",
        }}
      >
        <Brand />
        <NavList />
        <Footer />
        {/* Floating toggle */}
        <div className="absolute -right-3 top-20 z-50">
          <ToggleBtn />
        </div>
      </aside>

      {/* Mobile sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[16rem] p-0 bg-card">
          <div className="flex h-full flex-col">
            <Brand />
            <NavList onNavigate={() => setMobileOpen(false)} />
            <Footer />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

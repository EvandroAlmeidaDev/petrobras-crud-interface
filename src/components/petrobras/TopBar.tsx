import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, HelpCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileSidebarTrigger } from "./AppSidebar";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  to?: string;
}

interface TopBarProps {
  title: string;
  crumbs?: Crumb[];
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function TopBar({ title, crumbs, badge, actions, className }: TopBarProps) {
  return (
    <header
      className={cn(
        "flex h-16 items-center justify-between gap-3 border-b border-border bg-card px-4 sm:px-6",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <MobileSidebarTrigger />
        <div className="min-w-0">
          {crumbs && crumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1 text-xs text-muted-foreground"
            >
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-1">
                  {c.to ? (
                    <Link
                      to={c.to}
                      className="hover:text-foreground transition-colors"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span>{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && (
                    <ChevronRight className="h-3 w-3 opacity-60" />
                  )}
                </span>
              ))}
            </nav>
          )}
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold tracking-tight truncate">
              {title}
            </h1>
            {badge}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {actions}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hidden sm:inline-flex"
          aria-label="Ajuda"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground relative"
          aria-label="Notificações"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--danger)]" />
        </Button>
        <div className="ml-1 hidden sm:flex items-center gap-3 border-l border-border pl-3">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium">Eduardo Silva</p>
            <p className="text-[11px] text-muted-foreground">Engenheiro Sênior</p>
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-primary-foreground shadow-sm"
            style={{ background: "var(--gradient-primary)" }}
          >
            ES
          </div>
        </div>
      </div>
    </header>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-w-0 flex-1 flex-col">{children}</div>;
}

// Helper: derive default crumbs from the current pathname
export function useDefaultCrumbs(): Crumb[] {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/dashboard/detail"))
    return [
      { label: "Operações", to: "/" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Detalhe" },
    ];
  if (pathname.startsWith("/dashboard"))
    return [{ label: "Operações", to: "/" }, { label: "Dashboard" }];
  return [{ label: "Operações" }, { label: "Ativos" }];
}

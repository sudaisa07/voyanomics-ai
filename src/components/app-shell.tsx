import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Sparkles,
  BarChart3,
  Bookmark,
  User,
  GitCompareArrows,
  Menu,
  X,
  Globe2,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/planner", label: "AI Planner", icon: Sparkles },
  { to: "/results", label: "AI Results", icon: BarChart3 },
  { to: "/compare", label: "Compare", icon: GitCompareArrows },
  { to: "/trips", label: "Saved Trips", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Sidebar - desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r bg-sidebar lg:block">
        <SidebarInner pathname={pathname} />
      </aside>

      {/* Sidebar - mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-sidebar shadow-elevated">
            <div className="flex justify-end p-3">
              <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarInner pathname={pathname} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <button
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 hover:bg-muted lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg font-bold sm:text-xl">{title}</h1>
              {subtitle && (
                <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarInner({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <Link
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2 px-5 py-5"
      >
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-hero shadow-glow">
          <Globe2 className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="truncate font-display text-sm font-bold">VoyaNomics AI</div>
          <div className="truncate text-[11px] text-muted-foreground">Travel Economist</div>
        </div>
      </Link>
      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="m-3 rounded-2xl bg-gradient-hero p-4 text-white shadow-glow">
        <div className="text-xs font-semibold uppercase tracking-wide opacity-90">Pro tip</div>
        <p className="mt-1 text-sm leading-snug">
          Compare 2 destinations before booking to save up to 32% on average.
        </p>
      </div>
    </div>
  );
}

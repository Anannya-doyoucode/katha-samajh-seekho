import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, LayoutDashboard, Languages, Mic, ClipboardCheck, BarChart3, Wifi, WifiOff, LogOut } from "lucide-react";
import { useKatha } from "@/lib/katha-store";
import { langName } from "@/lib/katha-data";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/lessons", label: "Lessons", icon: BookOpen },
  { to: "/language", label: "Language", icon: Languages },
  { to: "/classroom", label: "Live Class", icon: Mic },
  { to: "/check", label: "Understanding", icon: ClipboardCheck },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary font-serif text-sm font-bold text-primary-foreground">
        क
      </span>
      <span className="leading-tight">
        <span className="block font-serif text-lg font-bold tracking-tight">KATHA</span>
        {!compact && (
          <span className="block text-[11px] text-muted-foreground">
            Learn in the language that feels like home.
          </span>
        )}
      </span>
    </span>
  );
}

export function SyncBadge() {
  const { online, sync } = useKatha();
  const map = {
    cached: { text: "Cached offline", cls: "bg-status-warn-soft text-status-warn" },
    syncing: { text: "Syncing…", cls: "bg-secondary text-secondary-foreground" },
    synced: { text: "Synced", cls: "bg-status-good-soft text-status-good" },
  } as const;
  const s = map[sync];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", s.cls)}>
      {online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
      {s.text}
    </span>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const { teacher, logout, source, target, online, setOnline } = useKatha();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 md:px-6">
          <Link to="/dashboard">
            <BrandMark />
          </Link>
          <div className="order-3 w-full overflow-x-auto md:order-2 md:w-auto">
            <nav className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-secondary font-semibold text-secondary-foreground"
                        : "text-muted-foreground hover:bg-secondary/60",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="order-2 ml-auto flex items-center gap-3 md:order-3">
            <Link
              to="/language"
              className="hidden items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs sm:flex"
              title="Change language pair"
            >
              <span className="font-medium">{langName(source)}</span>
              <span className="text-muted-foreground">→</span>
              <span className="font-medium">{langName(target)}</span>
            </Link>
            <div className="flex items-center gap-2">
              <SyncBadge />
              <Switch
                checked={online}
                onCheckedChange={setOnline}
                aria-label="Toggle network connectivity"
              />
            </div>
            {teacher && (
              <div className="flex items-center gap-2 border-l pl-3">
                <span className="hidden text-xs text-muted-foreground sm:inline">{teacher}</span>
                <Link to="/" onClick={logout} className="text-muted-foreground hover:text-foreground" title="Sign out">
                  <LogOut className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">{children}</main>
      <footer className="mx-auto max-w-7xl px-4 pb-8 text-xs text-muted-foreground md:px-6">
        KATHA — multilingual teaching assistant for government primary schools. Prototype with sample
        vernacular content for English, Hindi, Santhali, Ho and Mundari.
      </footer>
    </div>
  );
}

export function PageTitle({
  eyebrow,
  title,
  subtitle,
  right,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="label-caps mb-1">{eyebrow}</p>}
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

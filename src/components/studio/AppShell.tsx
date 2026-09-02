import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Coins,
  FolderKanban,
  Image as ImageIcon,
  LayoutDashboard,
  Library,
  LogOut,
  Mic,
  Sparkles,
  Video,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCredits } from "@/lib/studio-api";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/image", label: "Image", icon: ImageIcon },
  { to: "/video", label: "Video", icon: Video },
  { to: "/voice", label: "Voice", icon: Mic },
  { to: "/library", label: "Library", icon: Library },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/billing", label: "Billing", icon: Coins },
] as const;

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: credits } = useCredits();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-[76px] shrink-0 flex-col items-center gap-2 border-r border-border/60 bg-card/40 py-5 backdrop-blur-xl md:flex lg:w-56 lg:items-stretch lg:px-3">
        <Link to="/" className="mb-4 flex items-center gap-2 lg:px-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="size-4" />
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-foreground lg:inline">
            Aurava
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeProps={{ className: "bg-primary/15 text-primary" }}
              inactiveProps={{ className: "text-muted-foreground hover:bg-accent/40" }}
              className="flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:justify-start"
            >
              <Icon className="size-[18px]" />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/40 lg:justify-start"
        >
          <LogOut className="size-[18px]" />
          <span className="hidden lg:inline">Sign out</span>
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-5 py-4 backdrop-blur-xl">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h1>
            {subtitle ? (
              <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            {actions}
            <Link
              to="/billing"
              className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
            >
              <Coins className="size-4 text-primary" />
              {(credits?.balance ?? 0).toLocaleString()}
              <span className="text-muted-foreground">credits</span>
            </Link>
          </div>
        </header>

        <div className="flex-1 px-5 py-6">{children}</div>

        <nav className="sticky bottom-0 z-20 flex items-center justify-around border-t border-border/60 bg-background/90 px-2 py-2 backdrop-blur-xl md:hidden">
          {NAV.slice(0, 5).map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="flex flex-col items-center gap-1 px-2 py-1 text-[11px]"
            >
              <Icon className="size-[18px]" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

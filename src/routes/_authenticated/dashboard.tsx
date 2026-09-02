import { createFileRoute, Link } from "@tanstack/react-router";
import { Image as ImageIcon, Mic, Sparkles, Video } from "lucide-react";

import { AppShell } from "@/components/studio/AppShell";
import { MediaPreview } from "@/components/studio/MediaPreview";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCredits, useGenerations } from "@/lib/studio-api";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Aurava AI Creative Studio" },
      {
        name: "description",
        content: "Track credits, launch generators and review your latest AI generations.",
      },
      { property: "og:title", content: "Dashboard — Aurava AI Creative Studio" },
      {
        property: "og:description",
        content: "Your Aurava workspace for AI image, video and voice generation.",
      },
    ],
  }),
  component: DashboardPage,
});

const TILES = [
  {
    to: "/image",
    label: "Image",
    icon: ImageIcon,
    copy: "Photoreal stills, editorial art and concept frames.",
    from: "from-primary/25",
  },
  {
    to: "/video",
    label: "Video",
    icon: Video,
    copy: "Camera-aware motion clips up to twelve seconds.",
    from: "from-chart-2/25",
  },
  {
    to: "/voice",
    label: "Voice",
    icon: Mic,
    copy: "Broadcast-grade narration with emotional control.",
    from: "from-chart-4/25",
  },
] as const;

const CREDIT_CEILING = 5000;

function DashboardPage() {
  const { user } = Route.useRouteContext();
  const { data: credits } = useCredits();
  const { data: generations = [] } = useGenerations(undefined, 12);

  const balance = credits?.balance ?? 0;
  const pct = Math.min(100, Math.round((balance / CREDIT_CEILING) * 100));
  const spent = generations.reduce((sum, g) => sum + (g.credits_cost ?? 0), 0);

  return (
    <AppShell title="Dashboard" subtitle={user?.email ?? "Your creative workspace"}>
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Credit meter</p>
                <p className="mt-1 text-4xl font-semibold tracking-tight text-foreground">
                  {balance.toLocaleString()}
                </p>
              </div>
              <Link
                to="/billing"
                className="rounded-full border border-border/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50"
              >
                Top up
              </Link>
            </div>
            <Progress value={pct} className="mt-5" />
            <p className="mt-3 text-xs text-muted-foreground">
              {pct}% of a {CREDIT_CEILING.toLocaleString()}-credit studio allowance ·{" "}
              {spent.toLocaleString()} credits used in recent runs
            </p>
          </div>

          <div className="glass-panel flex flex-col justify-between rounded-3xl p-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4 text-primary" /> Studio activity
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
              {(["image", "video", "voice"] as const).map((t) => (
                <div key={t} className="rounded-2xl border border-border/50 bg-card/40 p-3">
                  <dt className="text-xs capitalize text-muted-foreground">{t}</dt>
                  <dd className="mt-1 text-xl font-semibold text-foreground">
                    {generations.filter((g) => g.type === t).length}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {TILES.map(({ to, label, icon: Icon, copy, from }) => (
            <Link
              key={to}
              to={to}
              className={`group rounded-3xl border border-border/60 bg-gradient-to-br ${from} to-transparent p-6 transition-all hover:border-primary/50 hover:shadow-lg`}
            >
              <span className="flex size-10 items-center justify-center rounded-2xl bg-background/70 text-primary">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-foreground">Generate {label}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
              <span className="mt-4 inline-block text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open studio →
              </span>
            </Link>
          ))}
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Recent generations</h2>
            <Link to="/library" className="text-sm text-primary hover:underline">
              View library
            </Link>
          </div>
          {generations.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
              Nothing generated yet — start with the Image studio.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {generations.map((g) => (
                <article key={g.id} className="glass-panel rounded-2xl p-3">
                  <MediaPreview
                    kind={g.type === "voice" ? "audio" : g.type === "video" ? "video" : "image"}
                    url={g.output_url}
                    thumbnail={g.thumbnail_url}
                    seed={g.id}
                  />
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {g.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{g.credits_cost} cr</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{g.prompt}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

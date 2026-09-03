import { createFileRoute } from "@tanstack/react-router";
import { Check, Coins } from "lucide-react";

import { AppShell } from "@/components/studio/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CREDIT_PACKS } from "@/lib/studio-config";
import { useBuyCredits, useCreditLedger, useCredits } from "@/lib/studio-api";

export const Route = createFileRoute("/_authenticated/billing")({
  head: () => ({
    meta: [
      { title: "Billing & Credits — Aurava" },
      {
        name: "description",
        content: "Track your Aurava credit balance, top up packs and review credit history.",
      },
      { property: "og:title", content: "Billing & Credits — Aurava" },
      {
        property: "og:description",
        content: "Manage credits and review generation spend in the Aurava studio.",
      },
    ],
  }),
  component: BillingPage,
});

function BillingPage() {
  const { data: credits } = useCredits();
  const { data: ledger = [] } = useCreditLedger();
  const buy = useBuyCredits();

  const balance = credits?.balance ?? 0;

  return (
    <AppShell title="Billing & Credits" subtitle="Demo checkout — no real payment is taken">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="glass-panel rounded-3xl p-6">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Coins className="size-4 text-primary" /> Current balance
          </p>
          <p className="mt-1 text-4xl font-semibold tracking-tight text-foreground">
            {balance.toLocaleString()}
          </p>
          <Progress value={Math.min(100, (balance / 5000) * 100)} className="mt-5" />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {CREDIT_PACKS.map((pack) => (
            <article key={pack.id} className="glass-panel flex flex-col rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">{pack.name}</h2>
                {pack.id === "studio" ? <Badge>Popular</Badge> : null}
              </div>
              <p className="mt-3 text-3xl font-semibold text-foreground">${pack.price}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {pack.credits.toLocaleString()} credits
              </p>
              <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 text-primary" /> {pack.perk}
              </p>
              <Button
                className="mt-6"
                disabled={buy.isPending}
                onClick={() => buy.mutate({ credits: pack.credits, name: pack.name })}
              >
                Buy {pack.name}
              </Button>
            </article>
          ))}
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">Credit history</h2>
          {ledger.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
              No credit activity yet.
            </div>
          ) : (
            <ul className="divide-y divide-border/60 overflow-hidden rounded-3xl border border-border/60">
              {ledger.map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 bg-card/40 px-5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-foreground">{t.description ?? t.kind}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(t.created_at).toLocaleString()} · {t.kind}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold ${
                      t.amount >= 0 ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {t.amount >= 0 ? "+" : ""}
                    {t.amount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}

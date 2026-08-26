import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Aurava AI Creative Studio" },
      {
        name: "description",
        content: "Your Aurava workspace for AI image, video and voice generation.",
      },
      { property: "og:title", content: "Dashboard — Aurava AI Creative Studio" },
      {
        property: "og:description",
        content: "Manage projects, generations and credits in your Aurava studio workspace.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = Route.useRouteContext();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Sparkles className="size-4" />
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">
                Aurava Studio
              </h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign out
          </Button>
        </header>

        <div className="rounded-3xl border border-border/60 bg-card/70 p-8 backdrop-blur-xl">
          <h2 className="text-xl font-semibold text-foreground">You're signed in</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The studio workspace lives here. Image, video and voice generators come next.
          </p>
        </div>
      </div>
    </div>
  );
}

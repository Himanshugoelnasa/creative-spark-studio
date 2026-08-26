import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Image, Video, Mic, Sparkles } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurava — AI Creative Studio" },
      {
        name: "description",
        content:
          "Aurava is an AI creative studio for generating images, video and voice from a single premium workspace.",
      },
      { property: "og:title", content: "Aurava — AI Creative Studio" },
      {
        property: "og:description",
        content:
          "Generate AI images, video and voice from one premium creative workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSignedIn(!!data.session);
      setSessionChecked(true);
    });
  }, []);

  function handleCta() {
    if (signedIn) navigate({ to: "/dashboard" });
    else navigate({ to: "/auth" });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-accent/20 blur-[140px]" />

      {/* top nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="size-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Aurava Studio</span>
        </Link>
        <div className="flex items-center gap-3">
          {sessionChecked && signedIn ? (
            <Button variant="outline" onClick={() => navigate({ to: "/dashboard" })}>
              Dashboard
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate({ to: "/auth" })}>
              Sign in
            </Button>
          )}
        </div>
      </header>

      {/* hero */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-xl">
            <Sparkles className="size-3.5 text-primary" />
            Image · Video · Voice — one studio
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            Create with AI, in one
            <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
              {" "}premium studio
            </span>
          </h1>
          <p className="mt-5 text-base text-muted-foreground sm:text-lg">
            Aurava brings image, video and voice generation together in a single,
            beautifully crafted workspace. Sign in to start creating.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="h-12 gap-2" onClick={handleCta}>
              {sessionChecked && signedIn ? "Go to dashboard" : "Get started"}
              <ArrowRight className="size-4" />
            </Button>
            {sessionChecked && !signedIn && (
              <Button
                size="lg"
                variant="outline"
                className="h-12"
                onClick={() => navigate({ to: "/auth" })}
              >
                Sign in
              </Button>
            )}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Demo account · admin@studio.local · StudioAdmin123!
          </p>
        </div>

        {/* feature cards */}
        <div className="mx-auto mt-20 grid max-w-4xl gap-5 sm:grid-cols-3">
          <FeatureCard
            icon={<Image className="size-5" />}
            title="Image"
            description="Generate striking visuals with fine-grained prompt control."
          />
          <FeatureCard
            icon={<Video className="size-5" />}
            title="Video"
            description="Turn prompts into motion with AI video generation."
          />
          <FeatureCard
            icon={<Mic className="size-5" />}
            title="Voice"
            description="Produce natural voiceovers in multiple styles and tones."
          />
        </div>
      </main>

      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Aurava Studio
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
        {icon}
      </span>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

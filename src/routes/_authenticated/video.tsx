import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Film, Loader2 } from "lucide-react";

import { AppShell } from "@/components/studio/AppShell";
import { MediaPreview } from "@/components/studio/MediaPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ASPECT_RATIOS, CAMERA_MOVES, VIDEO_MODELS } from "@/lib/studio-config";
import { useGenerate, useGenerations } from "@/lib/studio-api";

export const Route = createFileRoute("/_authenticated/video")({
  head: () => ({
    meta: [
      { title: "Video Studio — Aurava" },
      {
        name: "description",
        content: "Generate cinematic AI video clips with camera moves, duration and aspect control.",
      },
      { property: "og:title", content: "Video Studio — Aurava" },
      {
        property: "og:description",
        content: "Storyboard and render motion clips in the Aurava video studio.",
      },
    ],
  }),
  component: VideoStudio,
});

function VideoStudio() {
  const [prompt, setPrompt] = useState("");
  const [modelId, setModelId] = useState(VIDEO_MODELS[0]!.id);
  const [aspect, setAspect] = useState<string>("16:9");
  const [camera, setCamera] = useState<string>(CAMERA_MOVES[1]);
  const [duration, setDuration] = useState(6);

  const generate = useGenerate();
  const { data: results = [] } = useGenerations("video", 18);

  const model = VIDEO_MODELS.find((m) => m.id === modelId)!;
  const ratio = ASPECT_RATIOS.find((r) => r.id === aspect)!;
  const cost = Math.round(model.cost * (duration / 6));

  function run() {
    if (!prompt.trim()) return;
    generate.mutate({
      type: "video",
      prompt: `${prompt.trim()} · ${camera}`,
      model: model.id,
      modelName: model.name,
      cost,
      width: ratio.w,
      height: ratio.h,
      metadata: { aspect: ratio.id, camera, duration_seconds: duration },
      assetName: prompt.trim().slice(0, 48) || "Untitled clip",
    });
  }

  return (
    <AppShell title="Video Studio" subtitle={`${model.name} · ${cost} credits per clip`}>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[380px_1fr]">
        <section className="glass-panel h-fit rounded-3xl p-5">
          <Label htmlFor="vprompt">Shot description</Label>
          <Textarea
            id="vprompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            placeholder="Lone cyclist on a rain-slick Tokyo overpass at 3am, neon reflections"
            className="mt-2 resize-none"
          />

          <div className="mt-5 grid gap-4">
            <div>
              <Label>Model</Label>
              <Select value={modelId} onValueChange={setModelId}>
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} · {m.cost} cr
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1.5 text-xs text-muted-foreground">{model.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Aspect</Label>
                <Select value={aspect} onValueChange={setAspect}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ASPECT_RATIOS.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.id} · {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Camera</Label>
                <Select value={camera} onValueChange={setCamera}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMERA_MOVES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Duration · {duration}s</Label>
              <Slider
                className="mt-3"
                value={[duration]}
                min={2}
                max={12}
                step={1}
                onValueChange={([v]) => setDuration(v ?? 6)}
              />
            </div>
          </div>

          <Button
            onClick={run}
            disabled={generate.isPending || !prompt.trim()}
            className="mt-6 w-full"
            size="lg"
          >
            {generate.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Film className="mr-2 size-4" />
            )}
            {generate.isPending ? "Rendering…" : `Generate · ${cost} credits`}
          </Button>

          {generate.isPending ? (
            <div className="mt-4">
              <Progress value={generate.progress} />
              <p className="mt-2 text-xs text-muted-foreground">
                {generate.stage} · {generate.progress}%
              </p>
            </div>
          ) : null}
        </section>

        <section>
          <h2 className="mb-3 text-base font-semibold text-foreground">Clips</h2>
          {results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
              Rendered clips will appear here.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((g) => (
                <article key={g.id} className="glass-panel rounded-2xl p-3">
                  <MediaPreview
                    kind="video"
                    url={g.output_url}
                    thumbnail={g.thumbnail_url}
                    seed={g.id}
                    className="aspect-video"
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant="secondary">{g.credits_cost} cr</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(g.created_at).toLocaleDateString()}
                    </span>
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

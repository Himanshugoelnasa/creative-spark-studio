import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Sparkles, Wand2 } from "lucide-react";

import { AppShell } from "@/components/studio/AppShell";
import { MediaPreview } from "@/components/studio/MediaPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ASPECT_RATIOS, IMAGE_MODELS, IMAGE_STYLES, PROMPT_IDEAS } from "@/lib/studio-config";
import { useGenerate, useGenerations } from "@/lib/studio-api";

export const Route = createFileRoute("/_authenticated/image")({
  head: () => ({
    meta: [
      { title: "Image Studio — Aurava" },
      {
        name: "description",
        content: "Generate photoreal and editorial AI images with model, aspect and style control.",
      },
      { property: "og:title", content: "Image Studio — Aurava" },
      {
        property: "og:description",
        content: "Prompt, choose a model and render AI stills in the Aurava image studio.",
      },
    ],
  }),
  component: ImageStudio,
});

function ImageStudio() {
  const [prompt, setPrompt] = useState("");
  const [negative, setNegative] = useState("");
  const [modelId, setModelId] = useState(IMAGE_MODELS[0]!.id);
  const [aspect, setAspect] = useState<string>(ASPECT_RATIOS[0]!.id);
  const [style, setStyle] = useState<string>(IMAGE_STYLES[0]);

  const generate = useGenerate();
  const { data: results = [] } = useGenerations("image", 24);

  const model = IMAGE_MODELS.find((m) => m.id === modelId)!;
  const ratio = ASPECT_RATIOS.find((r) => r.id === aspect)!;

  function run() {
    if (!prompt.trim()) return;
    generate.mutate({
      type: "image",
      prompt: `${prompt.trim()} · ${style}`,
      ...(negative.trim() ? { negativePrompt: negative.trim() } : {}),
      model: model.id,
      modelName: model.name,
      cost: model.cost,
      width: ratio.w,
      height: ratio.h,
      metadata: { aspect: ratio.id, style },
      assetName: prompt.trim().slice(0, 48) || "Untitled image",
    });
  }

  return (
    <AppShell title="Image Studio" subtitle={`${model.name} · ${model.cost} credits per render`}>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[380px_1fr]">
        <section className="glass-panel h-fit rounded-3xl p-5">
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            placeholder="Molten glass hummingbird, studio lighting, black backdrop"
            className="mt-2 resize-none"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PROMPT_IDEAS.slice(0, 3).map((idea) => (
              <button
                key={idea}
                onClick={() => setPrompt(idea)}
                className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
              >
                <Wand2 className="mr-1 inline size-3" />
                {idea.split(",")[0]}
              </button>
            ))}
          </div>

          <Label htmlFor="negative" className="mt-5 block">
            Negative prompt
          </Label>
          <Textarea
            id="negative"
            value={negative}
            onChange={(e) => setNegative(e.target.value)}
            rows={2}
            placeholder="blurry, extra fingers, watermark"
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
                  {IMAGE_MODELS.map((m) => (
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
                <Label>Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {IMAGE_STYLES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <Sparkles className="mr-2 size-4" />
            )}
            {generate.isPending ? "Rendering…" : `Generate · ${model.cost} credits`}
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
          <h2 className="mb-3 text-base font-semibold text-foreground">Results</h2>
          {results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
              Your renders will appear here.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
              {results.map((g) => (
                <article key={g.id} className="glass-panel rounded-2xl p-3">
                  <MediaPreview kind="image" url={g.output_url} thumbnail={g.thumbnail_url} seed={g.id} />
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

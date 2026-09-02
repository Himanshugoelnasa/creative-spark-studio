import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Mic } from "lucide-react";

import { AppShell } from "@/components/studio/AppShell";
import { Waveform } from "@/components/studio/MediaPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VOICES, VOICE_MODELS } from "@/lib/studio-config";
import { useCredits, useGenerate, useGenerations } from "@/lib/studio-api";

export const Route = createFileRoute("/_authenticated/voice")({
  head: () => ({
    meta: [
      { title: "Voice Studio — Aurava" },
      {
        name: "description",
        content: "Turn scripts into studio-grade AI voiceovers with selectable voices and pacing.",
      },
      { property: "og:title", content: "Voice Studio — Aurava" },
      {
        property: "og:description",
        content: "Pick a voice, paste a script and render narration in the Aurava voice studio.",
      },
    ],
  }),
  component: VoiceStudio,
});

function VoiceStudio() {
  const [script, setScript] = useState("");
  const [voiceId, setVoiceId] = useState(VOICES[0]!.id);
  const [modelId, setModelId] = useState(VOICE_MODELS[0]!.id);
  const [speed, setSpeed] = useState(100);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const generate = useGenerate();
  const { data: credits } = useCredits();
  const { data: results = [] } = useGenerations("voice", 18);

  const voice = VOICES.find((v) => v.id === voiceId)!;
  const model = VOICE_MODELS.find((m) => m.id === modelId)!;
  const words = script.trim() ? script.trim().split(/\s+/).length : 0;
  const seconds = Math.max(2, Math.min(12, Math.round((words / 2.4) * (100 / speed))));
  const cost = Math.max(model.cost, Math.round(model.cost * (seconds / 6)));
  const balance = credits?.balance ?? 0;

  function run() {
    setConfirmOpen(false);
    generate.mutate({
      type: "voice",
      prompt: script.trim(),
      model: model.id,
      modelName: `${model.name} · ${voice.name}`,
      cost,
      durationSeconds: seconds,
      voicePitch: Math.round(voice.pitch * (speed / 100)),
      metadata: { voice: voice.name, accent: voice.accent, speed, duration_seconds: seconds },
      assetName: script.trim().slice(0, 48) || "Untitled voiceover",
    });
  }

  return (
    <AppShell title="Voice Studio" subtitle={`${voice.name} · ${voice.tone}`}>
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[380px_1fr]">
        <section className="glass-panel h-fit rounded-3xl p-5">
          <Label>Voice</Label>
          <div className="mt-2 grid gap-2">
            {VOICES.map((v) => (
              <button
                key={v.id}
                onClick={() => setVoiceId(v.id)}
                className={`flex items-center justify-between rounded-2xl border px-3 py-2.5 text-left transition-colors ${
                  v.id === voiceId
                    ? "border-primary/60 bg-primary/10"
                    : "border-border/60 hover:border-primary/30"
                }`}
              >
                <span>
                  <span className="block text-sm font-medium text-foreground">{v.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {v.accent} · {v.tone}
                  </span>
                </span>
                <Badge variant="secondary">{v.pitch} Hz</Badge>
              </button>
            ))}
          </div>

          <Label className="mt-5 block">Engine</Label>
          <Select value={modelId} onValueChange={setModelId}>
            <SelectTrigger className="mt-2 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VOICE_MODELS.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name} · {m.cost} cr
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label htmlFor="script" className="mt-5 block">
            Script
          </Label>
          <Textarea
            id="script"
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={6}
            placeholder="Welcome to Aurava — where every idea finds its voice."
            className="mt-2 resize-none"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            {words} words · ~{seconds}s
          </p>

          <Label className="mt-5 block">Pace · {speed}%</Label>
          <Slider
            className="mt-3"
            value={[speed]}
            min={70}
            max={140}
            step={5}
            onValueChange={([v]) => setSpeed(v ?? 100)}
          />

          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={generate.isPending || !script.trim()}
            className="mt-6 w-full"
            size="lg"
          >
            {generate.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Mic className="mr-2 size-4" />
            )}
            {generate.isPending ? "Rendering voice…" : `Generate · ${cost} credits`}
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
          <div className="glass-panel rounded-3xl p-5">
            <p className="text-sm text-muted-foreground">Live preview shape</p>
            <div className="mt-3">
              <Waveform seed={`${voiceId}:${speed}:${script}`} />
            </div>
          </div>

          <h2 className="mb-3 mt-6 text-base font-semibold text-foreground">Voiceovers</h2>
          {results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/60 p-12 text-center text-sm text-muted-foreground">
              Generated voiceovers will appear here with playback.
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map((g) => (
                <article key={g.id} className="glass-panel rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="line-clamp-1 text-sm text-foreground">{g.prompt}</p>
                    <Badge variant="secondary">{g.credits_cost} cr</Badge>
                  </div>
                  <div className="mt-3">
                    <Waveform seed={g.id} bars={64} />
                  </div>
                  {g.output_url ? (
                    <audio controls src={g.output_url} className="mt-3 w-full" />
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Render this voiceover?</AlertDialogTitle>
            <AlertDialogDescription>
              {voice.name} on {model.name} · ~{seconds}s. This run costs {cost} credits, leaving{" "}
              {Math.max(0, balance - cost).toLocaleString()} of {balance.toLocaleString()}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={run}>Confirm · {cost} credits</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

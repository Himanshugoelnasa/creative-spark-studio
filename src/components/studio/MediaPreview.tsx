import { Mic } from "lucide-react";

import { makeWaveformBars } from "@/lib/mock-media";

export function Waveform({ seed, bars = 48 }: { seed: string; bars?: number }) {
  const values = makeWaveformBars(seed, bars);
  return (
    <div className="flex h-16 items-end gap-[3px]">
      {values.map((v, i) => (
        <span
          key={i}
          className="flex-1 rounded-full bg-primary/70"
          style={{ height: `${Math.max(8, v)}%` }}
        />
      ))}
    </div>
  );
}

export function MediaPreview({
  kind,
  url,
  thumbnail,
  seed,
  className = "aspect-square",
}: {
  kind: "image" | "video" | "audio";
  url?: string | null;
  thumbnail?: string | null;
  seed: string;
  className?: string;
}) {
  if (kind === "audio") {
    return (
      <div
        className={`flex flex-col justify-between gap-3 rounded-xl border border-border/60 bg-card/50 p-4 ${className}`}
      >
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mic className="size-3.5" /> Voiceover
        </span>
        <Waveform seed={seed} bars={36} />
        {url ? <audio controls src={url} className="w-full" /> : null}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden rounded-xl border border-border/60 bg-card/50 ${className}`}>
      {url || thumbnail ? (
        <img
          src={url ?? thumbnail ?? ""}
          alt={`Generated ${kind} preview`}
          loading="lazy"
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
          No preview
        </div>
      )}
    </div>
  );
}

/**
 * Deterministic offline "AI output" synthesis.
 * Images/video posters are generated as SVG data URLs, voice as a WAV data URL.
 * This keeps the mocked generation pipeline fully self-contained.
 */

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function makeVisualDataUrl(
  seed: string,
  width = 1024,
  height = 1024,
  opts: { motion?: boolean } = {},
): string {
  const r = rng(hash(seed));
  const hue = Math.floor(r() * 360);
  const hue2 = (hue + 40 + Math.floor(r() * 140)) % 360;
  const blobs = Array.from({ length: 5 }, () => ({
    cx: Math.round(r() * width),
    cy: Math.round(r() * height),
    rr: Math.round((0.18 + r() * 0.4) * Math.min(width, height)),
    h: Math.floor(r() * 360),
    o: (0.18 + r() * 0.4).toFixed(2),
  }));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue} 65% 16%)"/>
      <stop offset="55%" stop-color="hsl(${hue2} 60% 28%)"/>
      <stop offset="100%" stop-color="hsl(${(hue2 + 30) % 360} 70% 12%)"/>
    </linearGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="${Math.round(Math.min(width, height) / 14)}"/></filter>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <g filter="url(#soft)">
    ${blobs
      .map((b) => `<circle cx="${b.cx}" cy="${b.cy}" r="${b.rr}" fill="hsl(${b.h} 85% 60%)" opacity="${b.o}"/>`)
      .join("\n    ")}
  </g>
  ${
    opts.motion
      ? `<g fill="none" stroke="hsl(0 0% 100% / 0.25)" stroke-width="${Math.max(1, Math.round(height / 360))}">
    ${Array.from({ length: 7 }, (_, i) => {
      const y = ((i + 1) * height) / 8;
      return `<path d="M0 ${y} Q ${width / 2} ${y - height / 12} ${width} ${y}"/>`;
    }).join("\n    ")}
  </g>`
      : ""
  }
  <rect width="${width}" height="${height}" fill="none" stroke="hsl(0 0% 100% / 0.12)" stroke-width="2"/>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Synthesizes a short spoken-cadence tone as a base64 WAV data URL. */
export function makeVoiceWavDataUrl(seed: string, seconds: number, pitch: number): string {
  const sampleRate = 16000;
  const duration = Math.min(Math.max(seconds, 1), 12);
  const total = Math.floor(sampleRate * duration);
  const r = rng(hash(seed));
  const bytes = new Uint8Array(44 + total * 2);
  const view = new DataView(bytes.buffer);

  const ascii = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i += 1) view.setUint8(offset + i, text.charCodeAt(i));
  };

  ascii(0, "RIFF");
  view.setUint32(4, 36 + total * 2, true);
  ascii(8, "WAVE");
  ascii(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  ascii(36, "data");
  view.setUint32(40, total * 2, true);

  // Syllable-like amplitude envelope so the clip reads as speech cadence.
  const syllable = sampleRate * (0.16 + r() * 0.1);
  for (let i = 0; i < total; i += 1) {
    const t = i / sampleRate;
    const phase = (i % syllable) / syllable;
    const env = Math.sin(Math.PI * phase) ** 2 * (0.55 + 0.45 * Math.sin(t * 1.7));
    const f = pitch * (1 + 0.06 * Math.sin(t * 5.3));
    const sample =
      0.6 * Math.sin(2 * Math.PI * f * t) +
      0.25 * Math.sin(4 * Math.PI * f * t) +
      0.12 * Math.sin(6 * Math.PI * f * t);
    view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, sample * env)) * 26000, true);
  }

  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]!);
  return `data:audio/wav;base64,${btoa(binary)}`;
}

export function makeWaveformBars(seed: string, count = 48): number[] {
  const r = rng(hash(seed));
  return Array.from({ length: count }, (_, i) => {
    const shape = Math.sin((i / count) * Math.PI);
    return Math.round((0.25 + 0.75 * r() * (0.4 + shape)) * 100);
  });
}

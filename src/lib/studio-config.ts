export type StudioModality = "image" | "video" | "voice";

export interface StudioModel {
  id: string;
  name: string;
  vendor: string;
  badge?: string;
  description: string;
  cost: number;
}

export const IMAGE_MODELS: StudioModel[] = [
  {
    id: "aurava-lumen-3",
    name: "Lumen 3",
    vendor: "Aurava",
    badge: "Flagship",
    description: "Photoreal detail, best skin and lighting fidelity.",
    cost: 12,
  },
  {
    id: "aurava-lumen-turbo",
    name: "Lumen Turbo",
    vendor: "Aurava",
    badge: "Fast",
    description: "Draft-speed renders for exploring compositions.",
    cost: 4,
  },
  {
    id: "nocturne-xl",
    name: "Nocturne XL",
    vendor: "Nocturne Labs",
    description: "Painterly, editorial and high-contrast art direction.",
    cost: 9,
  },
];

export const VIDEO_MODELS: StudioModel[] = [
  {
    id: "aurava-motion-2",
    name: "Motion 2",
    vendor: "Aurava",
    badge: "Cinematic",
    description: "Camera-aware motion with stable subjects up to 12s.",
    cost: 48,
  },
  {
    id: "aurava-motion-lite",
    name: "Motion Lite",
    vendor: "Aurava",
    badge: "Fast",
    description: "Quick previews at 480p for storyboard timing.",
    cost: 18,
  },
];

export const VOICE_MODELS: StudioModel[] = [
  {
    id: "aurava-vox-2",
    name: "Vox 2",
    vendor: "Aurava",
    badge: "Studio",
    description: "Broadcast-grade narration with emotional control.",
    cost: 8,
  },
  {
    id: "aurava-vox-realtime",
    name: "Vox Realtime",
    vendor: "Aurava",
    badge: "Fast",
    description: "Low-latency reads for drafts and scratch tracks.",
    cost: 3,
  },
];

export const ASPECT_RATIOS = [
  { id: "1:1", label: "Square", w: 1024, h: 1024 },
  { id: "3:2", label: "Landscape", w: 1200, h: 800 },
  { id: "2:3", label: "Portrait", w: 800, h: 1200 },
  { id: "16:9", label: "Widescreen", w: 1280, h: 720 },
  { id: "9:16", label: "Vertical", w: 720, h: 1280 },
] as const;

export const IMAGE_STYLES = [
  "Cinematic",
  "Editorial photo",
  "Neon noir",
  "Analog film",
  "3D render",
  "Ink illustration",
] as const;

export const CAMERA_MOVES = [
  "Static",
  "Slow push in",
  "Orbit left",
  "Crane up",
  "Handheld follow",
] as const;

export interface StudioVoice {
  id: string;
  name: string;
  accent: string;
  tone: string;
  pitch: number;
}

export const VOICES: StudioVoice[] = [
  { id: "auri", name: "Auri", accent: "American", tone: "Warm narrator", pitch: 210 },
  { id: "kestrel", name: "Kestrel", accent: "British", tone: "Confident host", pitch: 165 },
  { id: "noor", name: "Noor", accent: "Neutral", tone: "Calm explainer", pitch: 235 },
  { id: "atlas", name: "Atlas", accent: "Deep", tone: "Trailer voice", pitch: 110 },
];

export const PROMPT_IDEAS = [
  "Molten glass sculpture of a hummingbird, studio lighting, black backdrop",
  "Abandoned art-deco cinema reclaimed by moss, volumetric dusk light",
  "Macro shot of amber liquid splash frozen mid-air, high speed flash",
  "Lone cyclist on a rain-slick Tokyo overpass at 3am, neon reflections",
];

export const CREDIT_PACKS = [
  { id: "starter", name: "Starter", credits: 1200, price: 12, perk: "Ideal for weekly experiments" },
  { id: "studio", name: "Studio", credits: 5000, price: 45, perk: "Best value — 4 seats of headroom" },
  { id: "scale", name: "Scale", credits: 15000, price: 120, perk: "Priority queue + 4K exports" },
];

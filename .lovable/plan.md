# AI Creative Studio — Build Plan

A premium, dark-first AI media studio (images, video, voice, complete video) built as a real React + TypeScript app on the project's TanStack Start + Vite + Tailwind v4 + shadcn/ui stack, with Motion animations and mocked AI providers behind a swappable service layer.

Because this is a very large product, I'll build it in phases. Each phase leaves the app fully navigable with no dead buttons.

## Design language

- Deep near-black canvas with layered elevated surfaces, one cinematic accent (electric violet-to-cyan gradient) used sparingly for generate actions and active states.
- Large radii, soft 1px borders, selective glass on overlays/topbar, generous spacing, restrained glow on primary CTAs.
- Modern geometric sans for headings, neutral sans for body; all colors as semantic tokens in `src/styles.css` (light theme included, dark default).
- Motion: spring page/sidebar transitions, card hover lift, shimmer skeletons, animated progress and waveforms. No animation on everything.

## Phase 1 — Foundation
- Design tokens + theme system (dark/light/system, persisted), typography, base UI primitives, toast (sonner), Motion setup.
- Domain types: User, Project, Generation (+Image/Video/Voice variants), Asset, Model, Voice, Template, Notification, CreditTransaction.
- Provider abstraction: `providers/` with `ImageProvider`, `VideoProvider`, `VoiceProvider` interfaces and mock implementations that emit realistic staged progress; `services/` exposing `generateImage/generateVideo/generateVoice`.
- Stores (Zustand): ui, auth, generation queue, projects, assets, credits, notifications — persisted to localStorage so mocked state survives reloads.
- Mock data: models, voices, prompts, projects, generated media, users.

## Phase 2 — Public + auth
- Landing page at `/` (hero "Create. Generate. Imagine.", animated workspace preview, feature sections for image/video/voice/complete video, models, workflow, pricing, FAQ, nav + CTAs).
- Auth screens: `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email` with social buttons, validation, mocked session.

## Phase 3 — App shell
- Collapsible animated sidebar (full nav tree + bottom credits/upgrade/help/settings/profile), glass topbar (workspace, search, notifications, credits, upgrade, avatar dropdown).
- Command palette (Cmd/Ctrl+K), global search across projects/media/prompts/templates, notification center with animated badge, keyboard shortcuts (Cmd+B, G→I/V/A).
- Mobile: sidebar drawer, stacked panels, bottom sheets for controls.
- Dashboard: hero, Continue Creating, Recent Generations grid, Quick Create cards, Trending.

## Phase 4 — Image generator (`/create/image`)
- Split layout: prompt/settings left, results right. Prompt editor, enhance-prompt modal (before/after), negative prompt, reusable ModelSelector (search/filter, provider, speed, quality, cost, badges), style, aspect ratio, resolution, count, seed, guidance, steps, advanced panel.
- Staged generation animation with skeleton shimmer, masonry results, per-image actions (open, download, upscale, variations, edit, image-to-video, favorite, delete, use as reference, copy prompt), preview modal with zoom + metadata.
- Cost estimate on the Generate button, insufficient-credits state with upgrade path.

## Phase 5 — Video generator (`/create/video`)
- Tabs: Text to Video, Image to Video, First + Last Frame, Reference Video, Extend Video.
- Cinematic prompt editor + controls (model, duration, aspect, resolution, FPS, camera movement, motion intensity, style, seed, negative prompt, audio toggle).
- Drag-and-drop upload zones with previews; animated first→motion→last frame timeline; image-to-video input→animation→result flow.
- Generation queue panel: queued/processing/completed/failed with thumbnails, progress %, cancel; completions flow into the library.

## Phase 6 — Voice studio (`/create/voice`)
- Script editor, voice library with category filters and voice cards (avatar, language, accent, description, preview, favorite, select), controls (language, emotion, speed, pitch, stability, similarity, style, format).
- Reusable animated-waveform audio player (play/pause, timeline, times, volume, speed, download) plus regenerate.

## Phase 7 — Library, projects, assets, discovery
- `/creations` media library: filters, sort, search, grid/list toggle, per-asset actions.
- `/projects` list + project workspace tabs (Overview, Assets, Generations, Timeline, Settings) with create/rename/duplicate/delete/favorite/archive.
- `/assets` folder-based library with drag-and-drop uploads; `/explore` inspiration feed (like/remix/save); `/templates` marketplace with categories and Use Template wiring into generators.

## Phase 8 — Account, billing, settings
- `/profile` (profile, account, security, preferences, notification toggles), `/pricing` (Free/Creator/Pro/Studio), billing + credits usage with mocked purchase, `/settings/api` key manager (provider, masked key, status, created, add/delete) with keys stored only in mock backend state — never rendered as secrets.

## Phase 9 — AI Video Studio (`/create/complete-video`)
- Stepper: Script (generate/rewrite/shorten/expand/tone) → Scenes (auto-split cards with prompt, duration, voice text, camera) → Visuals → Voice → Music → Timeline → Export.
- Timeline editor with VIDEO/VOICE/MUSIC/SFX/TEXT tracks, playhead, scene blocks, waveforms, trimming, zoom, play/pause, fullscreen preview; simulated render + export modal (MP4 1080p/4K, audio only, captions).

## Phase 10 — Polish pass
- Empty states, error states with recovery actions, remix/variations/reuse-settings everywhere, export modals, accessibility sweep (focus rings, labels, ARIA, dialog/menu semantics, contrast), responsive audit, per-route SEO metadata.

## Technical notes

- Routing uses TanStack Router file routes under `src/routes/` (`create.image.tsx`, `_app.*` shell layout, etc.); no react-router.
- Structure: `src/components/{ui,layout,generation,media,timeline}`, `src/routes`, `src/services`, `src/providers`, `src/hooks`, `src/stores`, `src/types`, `src/lib`, `src/data`.
- No AI provider calls in components — pages call services, services call providers; swapping a mock for Replicate/Fal/ElevenLabs/etc. later is a provider file change only.
- Generation simulation runs in a store-driven queue with timers so progress continues across route changes.
- Demo media: a small set of generated still images for image results/thumbnails; video and audio previews use lightweight placeholder media with animated overlays rather than fake instant output.

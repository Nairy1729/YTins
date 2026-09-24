# PROJECT_STATE.md

**Project:** Reverie - AI-powered song-to-visual-story generator
**Last updated:** 24-09-2026
**Current phase:** Phase 11 COMPLETE (AI Visual Director)
**Next phase:** Phase 12 — AI + Visual Engine Integration

---

## 1. Product Summary

YouTube URL (or uploaded audio) -> song processing -> lyrics -> synchronization
-> AI visual direction -> styled 9:16 composition -> MP4 export.

Positioning: a creative studio tool, not a lyric-video generator.

---

## 2. Architecture

npm-workspaces monorepo (`@reverie/*`). Node 24.19.0. Windows dev environment.

- **apps/web**: React 19 + Vite 6 + Tailwind v4 + Framer Motion 12
- **apps/api**: Node 24 + Express 5 + TypeScript (ESM, NodeNext) + Zod + Pino
- **packages/contracts**: Zod schemas: ScenePlan, Job, Style, Track, Lyrics, Timeline, Health, Errors
- **packages/video**: Remotion 4 compositions (1080x1920 @ 30fps)

Critical boundary: AI produces validated structured data (`ScenePlan`).
The renderer consumes `ScenePlan`. Neither knows the other's internals.

`packages/video` is shared so browser preview and server render run
identical code (preview parity). Hooking `packages/video` to consume real `ScenePlan` contracts is Phase 7.

---

## 3. Completed Functionality

### Phase 1 — Project Foundation
- Monorepo with npm workspaces, shared tsconfig base, ESLint + Prettier.
- TypeScript strict mode across all 4 packages, typecheck green.
- Development orchestration via `concurrently` (`npm run dev`).

### Phase 2 — UI/UX Foundation
- Tailwind v4 design tokens (`styles/tokens.css`) with dark cinematic aesthetic.
- Reusable UI primitives: `Button`, `Input`, `OptionGroup`, `Panel`, `Progress`, `StatusDot`, `StyleCard`.
- Fluid motion system using Framer Motion 12 (`lib/motion.ts`).
- Pages: `Landing` (hero concept animation), `Create` (URL input & style selector), `Generate` (live stage tracking), `SystemCheck` (health diagnostics).

### Phase 3 — Backend Foundation
- Express 5 API with structured logging (`pino`), request IDs, rate limiting, and standard `AppError`.
- In-memory `jobStore` with state transitions and SSE streaming endpoint (`/api/reels/:id/stream`).
- Endpoints: `POST /api/reels`, `GET /api/reels/:id`, `GET /api/reels/:id/stream`, `GET /api/health`.

### Phase 4 — YouTube Integration
- YouTube URL extraction and canonical normalization.
- `YouTubeAudioSource` adapter using `yt-dlp` to probe metadata (title, artist, duration) and download audio into `apps/api/storage/audio`.
- Duration limits (`MAX_SOURCE_SECONDS`) and timeout handling.

### Phase 5 — Lyrics Engine
- `lrclib.net` API integration with title normalization and fallback search candidates.
- LRC timestamp parser and plain lyrics parser.
- Graceful instrumental fallback (missing lyrics is a supported mood, not an error).

### Phase 6 — Lyrics Synchronization
- Line timing calculation (`buildTimedLines`) providing exact `startMs`, `endMs`, and `durationMs`.
- Plain lyric time estimation when timestamps are missing.
- Musical gap detection (`detectGaps`) for instrumental breaks.
- Optimal segment selector (`selectSegment`): analyzes lyric density to pick a 30–45s highlight window.

### Phase 7 — Remotion Foundation
- Linked `@reverie/contracts` into `packages/video`.
- Built `ReverieReel`: 9:16 vertical (1080x1920 @ 30fps) composition driven by `ScenePlan` Zod schema and synchronized audio.
- Implemented `CameraRig` (`slow_push_in`, `slow_pull_out`, `pan_left`, `pan_right`, `drift`).
- Implemented `SceneBackground`, `SceneLyric`, and `SceneMotifs` with animated SVG stroke draw-in.
- Dynamic duration calculation via Remotion `calculateMetadata` and schema-validated `SAMPLE_SCENE_PLAN`.
- Verified local Remotion CLI video rendering (`packages/video/out/smoke_reel.mp4`).

### Phase 8 — Lyric Video Engine
- Built modular typography engine in `packages/video/src/lyrics/`:
  - `MinimalLyric`: Optical blur focus in, letter-spacing expansion/contraction, and fine hairline accent.
  - `HandwrittenLyric`: Organic word-stagger reveal with upward float, subtle rotation, and expressive serif styling.
  - `KineticLyric`: Rhythm-driven scale pop bounce (`Easing.bezier(0.34, 1.4, 0.64, 1)`) with dynamic active-word brass highlighting.
  - `TypewriterLyric`: Frame-interpolated character-by-character typing with animated blinking cursor.
  - `DualLineLyric`: Layered singing hierarchy with soft receding context line and emphasized primary line.
- Added visual legibility & atmosphere layers:
  - `LyricBacklight`: Soft elliptical radial contrast aura ensuring text readability over motifs.
  - `LyricParticleDrift`: Floating micro-particles with deterministic seed-based motion.
- Locked Reference Track: `https://youtu.be/RQbnPl5E5No` (*Tere Bina Na Guzara* - Satinder Sartaaj).
  - Built `REFERENCE_SCENE_PLAN` and registered `TereBinaReel` composition.
  - Verified MP4 render: `packages/video/out/tere_bina.mp4`.

### Phase 9 — Pen & Ink Signature Style
- Built comprehensive Pen & Ink visual styling package in `packages/video/src/styles/pen-ink/`:
  - `pen-ink.theme.ts`: Exact color tokens (`void`, `canvas`, `inkLight`, `brassAccent`), stroke weights, and typography scale.
  - `PenInkCanvas.tsx`: Hand-crafted paper texture with procedural SVG noise (`feTurbulence`), subtle framing margins (`4 8` dasharray), corner registration crosses (`+`), and mood-reactive radial washes.
  - `PenInkMotifLibrary.ts`: 10 hand-drawn vector path motifs with multi-stroke hatching and draw ordering: `solitary-figure`, `umbrella-sketch`, `rain-droplets`, `lantern-glow`, `quill-and-inkwell`, `shoreline-horizon`, `rose-and-thorns`, `clock-face-antique`, `bird-in-flight`, and `sound-ripples`.
  - `PenInkRenderer.tsx`: Staged multi-path stroke animation with sketch velocity easing and drop shadows.
- Integrated into Remotion renderer via `SceneBackground.tsx` and `SceneMotifs.tsx` when `styleId === 'pen-ink'`.
- Updated reference track `REFERENCE_SCENE_PLAN` (`https://youtu.be/RQbnPl5E5No`) with Pen & Ink motifs across all 4 scenes.
- Smoke verified via Remotion CLI: `packages/video/out/tere_bina.mp4` (459.9 kB).

### Phase 10 — Additional Styles
- Built extensible modular style architecture under `packages/video/src/styles/`:
  - `types.ts`, `registry.ts`: Type-safe `StyleDefinition` and `STYLE_REGISTRY` mapping all 8 `StyleId`s with `getStyleDefinition`.
  - Refactored `SceneBackground`, `SceneMotifs`, and `SceneLyric` to dynamically resolve palettes, backgrounds, and motif libraries from registry.
- Implemented 5 complete visual style aesthetics:
  - `minimal-type`: Deep void (`#09090b`), hairline frame with corner registration crosses & scale ticks, precision geometric motifs (`editorial-crosshair`, `metric-brackets`, `horizon-line`, `sound-bar-matrix`, `geometric-circle`, `minimal-chevron`), and geometric reveal animations.
  - `pencil-sketch`: Eggshell paper grain canvas with procedural SVG noise (`feTurbulence`), multi-stroke cross-hatching motifs (`sketch-silhouette`, `sketch-tree`, `sketch-guitar`, `sketch-heart`, `sketch-crescent-moon`), dual-pass graphite stroke with micro-jitter.
  - `graph-abstract`: Deep blueprint slate canvas (`#060b14`), 60px coordinate grid, scanning beam line, telemetry indicators, vector motifs (`waveform-scope`, `circular-telemetry`, `constellation-node`, `isometric-cube`, `vector-compass`), and glowing neon cyan/emerald laser reveals.
  - `notebook`: Vintage cream journal canvas (`#faf6eb`), red margin line, horizontal blue ruled lines, 3-hole binder punch rings, doodle motifs (`margin-star-doodle`, `music-note-doodle`, `arrow-scribble`, `tape-strip`, `coffee-stain-ring`, `hand-underlined-scribble`), and blue fountain pen draw-on.
  - `cinematic`: 35mm film void (`#050507`), 2.39:1 letterbox matte bars, anamorphic flare streak, floating bokeh orbs, camera viewfinder timecodes, filmic motifs (`shutter-iris`, `film-frame`, `lens-flare-burst`), and optical bloom reveals.
- Updated `packages/contracts/src/style-catalog.ts` to mark all implemented styles as available (`available: true`).
- Created reference compositions and rendered smoke MP4s for all styles using reference track `https://youtu.be/RQbnPl5E5No` (*Tere Bina Na Guzara*):
  - `tere_bina.mp4` (459.9 kB) — Pen & Ink
  - `tere_bina_graph.mp4` (526.1 kB) — Graph / Abstract
  - `tere_bina_notebook.mp4` (407.6 kB) — Notebook
  - `tere_bina_minimal.mp4` (344.6 kB) — Minimal Type
  - `tere_bina_sketch.mp4` (445.4 kB) — Pencil Sketch
  - `tere_bina_cinematic.mp4` (625.5 kB) — Cinematic

### Phase 11 — AI Visual Director
- Built multi-provider AI Visual Director service in `apps/api/src/services/visual-director/`:
  - `types.ts`: Clean service contract (`VisualDirectorService`, `VisualDirectorInput`, `VisualDirectorResult`, `EmotionAnalysis`, `StyleDirectorProfile`).
  - `style-profiles.ts`: Complete director profiles for all 8 styles mapping moods to curated motif catalogs, preferred lyric typography treatments, camera moves, and scene transitions.
  - `emotion-analyzer.ts`: Comprehensive semantic sentiment, valence, arousal, and theme analyzer supporting multi-lingual cues (including Indic/Punjabi sentiment words for reference track *Tere Bina Na Guzara*).
  - `heuristic-director.ts`: Zero-dependency, 100% offline, deterministic heuristic scene planning engine. Partitions timeline segments into narrative scenes, allocates motifs in safe quadrants avoiding typography, schedules smooth camera moves, and returns Zod-validated `ScenePlan`s.
  - `gemini-director.ts`: LLM visual director leveraging official `@google/genai` SDK (`gemini-3.8-flash`) with structured output schema enforcement and hallucination sanitization.
  - `composite-director.ts`: Resilient orchestrator with automatic fallback from Gemini to heuristic director.
- Integrated into backend job pipeline (`apps/api/src/jobs/pipeline.ts`):
  - Stage 4 (`generating_visuals`) now runs `directScenes` live on every reel job.
  - Stores generated `ScenePlan` in `jobStore` and exposes it via `jobSnapshot.scenePlan` and `GET /api/reels/:id/scene-plan`.
- Web frontend integration (`apps/web/src/routes/Generate.tsx`):
  - Renders live visual direction status card displaying composed scenes, style, and per-scene emotion badges.
- Reference track verification (`https://youtu.be/RQbnPl5E5No`):
  - Verified across all 6 styles with `scripts/verify-visual-director.ts`.
  - Tested live API end-to-end with real YouTube ingestion, lyrics sync, and scene plan generation.

---

## 4. Key Decisions

| ID  | Decision                                             | Status                        |
| --- | ---------------------------------------------------- | ----------------------------- |
| D1  | Remotion + FFmpeg for rendering                      | VALIDATED on Node 24          |
| D2  | AI directs, does not illustrate (curated SVG motifs) | Accepted, Phase 9 & 11        |
| D3  | MVP renders 30-45s segment, not full song            | Implemented in Timeline (D3)  |
| D4  | TypeScript & Zod contracts everywhere                | Implemented in @reverie/contracts |
| D5  | SSE for job progress, polling fallback               | Implemented in apps/api & web |
| D6  | No database in MVP (in-memory jobStore)              | Implemented                   |
| D7  | AudioSource abstraction (YouTube + upload)           | Implemented for YouTube      |
| D8  | Line-level lyric timing in MVP                       | Implemented in Phase 6        |
| D9  | Seeded randomness only, passed via props             | Enforced in ScenePlan schema  |
| D10 | Remotion commercial licence                          | OPEN - required before launch |
| D11 | Benchmark Reference Track URL                        | Locked: https://youtu.be/RQbnPl5E5No |

---

## 5. Known Issues / Limitations

- Stage 5 in `apps/api/src/jobs/pipeline.ts` (Remotion server-side rendering from `ScenePlan`) is simulated; will be connected in Phase 12-13.
- The web app does not yet display an inline video player for completed reels (requires `@remotion/player` or HTML5 video).

---

## 6. Setup & Verification

    npm install
    npm run build:contracts
    npm run typecheck
    npm test -w @reverie/api
    npm run smoke -w @reverie/video
    npm run video:smoke:reel
    npm run video:smoke:terebina
    npm run video:smoke:graph
    npm run video:smoke:notebook
    npm run video:smoke:minimal
    npm run video:smoke:sketch
    npm run video:smoke:cinematic
    npx tsx scripts/verify-visual-director.ts
    npm run dev

    Web: http://localhost:5173
    API: http://127.0.0.1:4000/api/health
    ReverieReel Video Output: packages/video/out/smoke_reel.mp4
    TereBina Pen & Ink Output: packages/video/out/tere_bina.mp4
    TereBina Graph Output: packages/video/out/tere_bina_graph.mp4
    TereBina Notebook Output: packages/video/out/tere_bina_notebook.mp4
    TereBina Minimal Output: packages/video/out/tere_bina_minimal.mp4
    TereBina Sketch Output: packages/video/out/tere_bina_sketch.mp4
    TereBina Cinematic Output: packages/video/out/tere_bina_cinematic.mp4

---

## 7. Phase Roadmap

| Phase | Description                           | Status              |
| ----- | ------------------------------------- | ------------------- |
| 0     | Architecture review                   | Complete            |
| 1     | Project foundation                    | Complete            |
| 2     | UI/UX foundation                      | Complete            |
| 3     | Backend foundation (jobs, validation) | Complete            |
| 4     | YouTube / audio ingestion             | Complete            |
| 5     | Lyrics engine                         | Complete            |
| 6     | Lyrics synchronization                | Complete            |
| 7     | Remotion foundation                   | Complete            |
| 8     | Lyric video engine                    | Complete            |
| 9     | Pen & Ink signature style             | Complete            |
| 10    | Additional styles                     | Complete            |
| 11    | AI visual director                    | **Complete**        |
| 12    | AI + visual engine integration        | **Next**            |
| 13    | Rendering & export                    | Not started         |
| 14    | Editor                                | Not started         |
| 15    | Production polish                     | Not started         |

---

## 8. Changelog

- 24-09-2026 Phase 11 complete. Implemented AI Visual Director service with multi-provider architecture (Gemini `@google/genai` SDK + deterministic offline heuristic engine), lyric emotion and theme analyzer, style-specific director profiles, and safe quadrant motif placement. Integrated into pipeline Stage 4 and exposed `GET /api/reels/:id/scene-plan`. Verified on reference track https://youtu.be/RQbnPl5E5No.
- 24-09-2026 Phase 10 complete. Implemented modular visual style architecture with `STYLE_REGISTRY` and created 5 additional styles (`minimal-type`, `pencil-sketch`, `graph-abstract`, `notebook`, `cinematic`). Refactored backgrounds, motifs, and lyric rendering to dynamically inherit from style definitions. Rendered all 6 styles for reference track https://youtu.be/RQbnPl5E5No to MP4.
- 24-09-2026 Phase 9 complete. Implemented Pen & Ink signature visual style with procedural SVG textured paper canvas, 10 hand-drawn vector path motifs with multi-stroke hatching, staged draw-on animation, and validated render on reference track https://youtu.be/RQbnPl5E5No (packages/video/out/tere_bina.mp4).
- 24-09-2026 Phase 8 complete. Built modular Lyric Video Engine (Minimal, Handwritten, Kinetic, Typewriter, DualLine), backlight contrast aura, particle drift, locked reference track to https://youtu.be/RQbnPl5E5No, and rendered out/tere_bina.mp4.
- 24-09-2026 Phase 7 complete. Linked @reverie/contracts into packages/video, created ReverieReel 9:16 composition, CameraRig, SceneLyric, SceneMotifs, SceneBackground, sample ScenePlan, and verified CLI MP4 rendering.
- 24-09-2026 Updated PROJECT_STATE.md to reconcile actual codebase progress through Phase 6 (Ingestion, Lyrics, Synchronization). Setup verified on Node 24.19 with Windows yt-dlp and ffmpeg.
- 08-09-2026 Brand locked to Reverie; fixed WEB_ORIGIN paste corruption; SEGMENT_LIMITS aligned with D3.
- 07-09-2026 Phase 1 complete. Monorepo, api, web, video all verified.
- 07-09-2026 Architecture proposal accepted (Option A, fresh repo).

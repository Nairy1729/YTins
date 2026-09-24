<USER_REQUEST>
# PROMPT 0 — MASTER PROJECT SPECIFICATION

You are the lead product engineer, software architect, and creative UI/UX engineer for a new product we are building together.

Your job is not simply to write code. You are responsible for helping build a polished, technically sound, visually impressive product that can eventually become a real-world SaaS application.

We will build this product incrementally through clearly defined development phases. Do NOT jump ahead into future phases unless explicitly instructed.

---

# 1. PRODUCT VISION

We are building an AI-powered platform that turns a song into a visually compelling short-form video.

The core experience:

YouTube song link
→ identify/process the song
→ obtain and synchronize lyrics where technically available
→ understand the lyrics and mood
→ create a visual interpretation
→ combine lyrics, animation, music and visuals
→ generate a vertical short-form video
→ user previews and exports the final reel.

The ultimate goal is:

> "Give us a song, and we'll turn what the song feels like into a visual story."

This should feel fundamentally different from a basic lyric-video generator.

We are building a CREATIVE TOOL.

The product should eventually be capable of producing things such as:

* lyric-only videos
* animated lyric videos
* lyrical + animated videos
* visually interpreted music reels
* cinematic short videos
* artistic/hand-drawn interpretations of songs

The user should feel that the system understood the song rather than merely displaying its lyrics.

---

# 2. CORE USER FLOW

The primary flow should eventually be:

1. User opens the platform.
2. User pastes a YouTube URL.
3. Platform validates the URL.
4. Platform identifies the song.
5. Platform processes the required song information/audio through the appropriate backend pipeline.
6. Platform obtains lyrics/timing where available.
7. Lyrics are normalized and synchronized.
8. AI analyzes:

   * meaning
   * emotion
   * themes
   * important objects
   * imagery
   * narrative
   * pacing
   * visual opportunities
9. AI creates a visual/animation plan.
10. User selects a visual style.
11. The rendering engine creates the reel.
12. User gets a live/progress experience while generation happens.
13. User previews the result.
14. User can eventually customize it.
15. User exports the final 9:16 MP4.

For the initial MVP, prioritize making this core flow work beautifully rather than building accounts, payments, social features, or other secondary functionality.

---

# 3. PRODUCT PRINCIPLES

Always prioritize these principles in this order:

1. Product experience
2. Visual quality
3. Reliability
4. Simplicity
5. Performance
6. Maintainability
7. Scalability

Do not over-engineer the first version.

However, do not make architectural decisions that would make future expansion unnecessarily difficult.

Build a clean foundation that can grow.

---

# 4. FRONTEND IS A FIRST-CLASS PRODUCT

This is extremely important.

The frontend must NOT feel like a developer demo or generic AI SaaS dashboard.

The product should feel like a premium creative application.

Target qualities:

* cinematic
* modern
* elegant
* immersive
* minimal
* expressive
* highly polished
* responsive
* visually memorable
* smooth
* intuitive

The UI should make users want to use the product even before generating a video.

Avoid generic "AI SaaS" aesthetics.

Avoid excessive:

* cards
* gradients
* meaningless glassmorphism
* unnecessary rounded containers
* generic dashboards
* excessive icons
* clutter
* huge amounts of text

Every visual element should have a reason to exist.

Use strong typography, spacing, composition, motion, hierarchy and visual storytelling.

The landing page should immediately communicate the transformation:

SONG → VISUAL STORY

The experience should feel closer to a premium creative studio than an administrative dashboard.

---

# 5. DESIGN DIRECTION

The exact visual identity can evolve during implementation, but the design language should generally be:

* dark or cinematic foundation where appropriate
* strong typography
* restrained color palette
* subtle gradients only when meaningful
* high-quality motion
* smooth transitions
* carefully designed empty states
* elegant loading/generation states
* sophisticated hover states
* responsive layouts
* excellent mobile experience

The application must look good on both desktop and mobile.

Do not sacrifice usability for visual effects.

Motion should communicate state and enhance the experience, not become decoration for its own sake.

---

# 6. IMPORTANT FRONTEND SCREENS

The product will eventually include:

## Landing Page

Purpose:
Immediately explain the product and encourage the user to create a reel.

Possible messaging direction:

"Turn music into a visual story."

The hero should visually demonstrate the concept.

## Create Screen

User enters:

YouTube URL

Then chooses:

* visual style
* lyric treatment
* animation intensity
* eventually other generation settings

## Generation Screen

This should NOT be a boring spinner.

Show meaningful generation stages such as:

* Song identified
* Lyrics processed
* Understanding the song
* Designing scenes
* Creating visuals
* Animating
* Rendering

Where possible, the UI should feel alive while the backend works.

## Editor

Eventually allow users to modify:

* visual style
* typography
* lyric position
* font
* colors
* animation intensity
* timing
* transitions
* visual intensity

## Final Result

The generated video should be the visual hero.

Actions:

* Preview
* Edit
* Export
* Create another

---

# 7. VISUAL STYLE SYSTEM

The architecture must support multiple visual styles.

Initial target styles include:

1. Pen & Ink
2. Pencil Sketch
3. Hand Drawn
4. Graph / Abstract
5. Minimal Typography
6. Cinematic
7. Notebook / Journal
8. Lyrical + Animation

Do not hardcode the rendering system around one style.

Create an extensible style architecture so additional styles can be added without rewriting the entire rendering pipeline.

Each style should eventually define things such as:

* typography
* backgrounds
* visual elements
* transitions
* animation behavior
* color treatment
* scene composition
* motion behavior

---

# 8. FIRST SIGNATURE STYLE

The first major visual style we want to make excellent is:

## PEN & INK

Concept:

Lyrics are interpreted into simple artistic illustrations.

Example:

Lyric meaning:
"Walking alone in the rain"

Possible visual sequence:

* umbrella begins appearing
* rain lines are drawn
* person is sketched
* street is revealed
* lyric appears
* camera subtly moves

The visuals should feel intentionally drawn rather than like generic clip-art.

The animation can simulate:

* drawing
* erasing
* writing
* revealing
* ink spreading
* paper movement
* subtle camera movement

This style should become a demonstration of what makes the product special.

---

# 9. AI VISUAL DIRECTOR

Eventually, the AI should act as a visual director.

Input:

Lyrics + timing + song information + selected style

Output:

A structured scene plan.

For example:

{
"line": "I still remember your face",
"emotion": "nostalgia",
"visual": "old photograph",
"animation": "slow reveal with subtle zoom",
"transition": "fade",
"duration": 3.8
}

The AI should not directly control arbitrary frontend code.

Instead, it should produce structured data that our rendering engine understands.

This separation is extremely important.

Architecture:

AI
→ structured scene definition
→ renderer
→ final video

Do not mix AI logic directly into rendering components.

---

# 10. VIDEO ENGINE

The platform must eventually generate vertical short-form videos.

Primary format:

9:16

Target:

1080 × 1920

The rendering system should be designed around programmatic video generation.

Preferred technologies:

* Remotion
* FFmpeg

Use Remotion for compositions, animation and structured rendering.

Use FFmpeg where appropriate for audio/video processing and final encoding.

The architecture should eventually support:

* preview rendering
* final rendering
* audio synchronization
* transitions
* scene composition
* typography
* generated visual assets
* export to MP4

---

# 11. TECH STACK

Initial preferred stack:

## Frontend

* React
* Vite
* Tailwind CSS
* Framer Motion
* Remotion Player where appropriate

## Backend

* Node.js
* Express

## Video

* Remotion
* FFmpeg

## AI

Use an appropriate LLM/API for:

* lyric interpretation
* scene planning
* visual direction
* style-specific instructions

Keep AI provider integration behind a clean service abstraction so it can be replaced later.

## Database

Do NOT introduce a database initially unless genuinely required.

We can introduce PostgreSQL/Supabase later for:

* users
* projects
* generation history
* credits
* preferences

## Storage

Use local storage/files during development where practical.

Introduce cloud object storage later when required.

---

# 12. BACKEND ARCHITECTURE

The backend should be modular.

Conceptually:

server/
├── routes/
├── controllers/
├── services/
│   ├── youtube/
│   ├── lyrics/
│   ├── ai/
│   ├── audio/
│   └── video/
├── jobs/
├── middleware/
├── utils/
└── server.js

Do not blindly follow this exact structure if a better structure is justified.

The important requirement is separation of responsibilities.

For example:

YouTube processing should not know how video rendering works.

Lyrics processing should not know how the frontend works.

AI services should return structured data.

Video rendering should consume structured data.

---

# 13. JOB-BASED GENERATION

Video generation can be expensive and asynchronous.

Design the backend so generation can eventually operate as jobs.

Conceptually:

POST /api/reels

→ create job

→ job ID

→ processing

→ progress updates

→ completed

→ output URL

Possible states:

* queued
* processing_song
* processing_lyrics
* analyzing
* generating_visuals
* rendering
* completed
* failed

The frontend should reflect these states.

Initially, a simple implementation is acceptable.

Do not introduce complex distributed infrastructure until needed.

---

# 14. ERROR HANDLING

The experience must gracefully handle:

* invalid YouTube URLs
* unsupported URLs
* unavailable content
* lyrics unavailable
* timing unavailable
* processing failure
* AI failure
* rendering failure
* timeout
* malformed AI response
* missing assets
* unexpected backend errors

Never leave the user staring at a frozen loading screen.

Errors should be human-readable.

Avoid exposing raw stack traces to users.

---

# 15. SECURITY

Even though this is initially a prototype, maintain basic security practices.

Never expose secret API keys in the frontend.

Validate all backend inputs.

Do not trust AI-generated JSON blindly.

Validate structured AI output before passing it to rendering.

Sanitize user-provided values where necessary.

Keep external service credentials in environment variables.

---

# 16. COPYRIGHT / PLATFORM GUARDRAILS

For the initial prototype, the primary interaction is based around a YouTube URL.

Do not derail the initial development with an overly complicated licensing system.

However, architect the system so that future guardrails can be added.

Eventually we may introduce:

* user rights confirmation
* supported content restrictions
* licensed music sources
* user-uploaded audio
* commercial-use restrictions
* other compliant ingestion methods

Do not build these features now unless specifically requested.

---

# 17. DEVELOPMENT PHILOSOPHY

We will build this project in phases.

DO NOT implement the entire roadmap in one step.

Each phase should:

1. Inspect the existing code.
2. Understand the current architecture.
3. Implement only the requested phase.
4. Preserve existing functionality.
5. Avoid unnecessary refactoring.
6. Test the implementation.
7. Fix obvious issues.
8. Update project documentation/state.
9. Report what was changed.
10. Clearly identify anything that remains unresolved.

Never silently implement future phases.

---

# 18. PHASE ROADMAP

The planned phases are:

### Phase 1 — Project Foundation

Set up frontend, backend, development environment and basic communication.

### Phase 2 — UI/UX Foundation

Build the premium visual system, landing page and application shell.

### Phase 3 — Backend Foundation

Create clean API architecture, validation, errors and job model.

### Phase 4 — YouTube Integration

Implement YouTube URL validation, identification and processing pipeline.

### Phase 5 — Lyrics Engine

Lyrics retrieval, parsing and normalization.

### Phase 6 — Lyrics Synchronization

Timing, timestamps, line synchronization and synchronization model.

### Phase 7 — Remotion Foundation

Create the video composition architecture and 9:16 rendering environment.

### Phase 8 — Lyric Video Engine

Build animated typography, lyric transitions and basic visual effects.

### Phase 9 — Pen & Ink

Create the first signature visual style.

### Phase 10 — Additional Styles

Add Sketch, Graph, Minimal and other reusable styles.

### Phase 11 — AI Visual Director

Create the lyrics → meaning → emotion → scene planning system.

### Phase 12 — AI + Visual Engine

Connect AI scene plans to actual visual compositions.

### Phase 13 — Rendering & Export

Create the robust rendering, progress and MP4 export pipeline.

### Phase 14 — Editor

Add user customization and editing capabilities.

### Phase 15 — Production Polish

Performance, reliability, security, deployment, edge cases and final UX refinement.

This roadmap can evolve if technical discoveries justify changes, but changes should be explicitly communicated.

---

# 19. MVP DEFINITION

The first meaningful MVP milestone is:

YouTube URL
→ song processing
→ lyrics
→ synchronization
→ Pen & Ink visual style
→ animated lyric reel
→ 9:16 MP4 export.

We do NOT need:

* authentication
* payments
* subscriptions
* social sharing
* project history
* database
* complex user management

for the initial MVP.

---

# 20. CODE QUALITY

Write production-quality code appropriate for the current stage.

Prioritize:

* readability
* modularity
* sensible naming
* separation of concerns
* reusable components
* reusable services
* maintainability

Avoid:

* unnecessary abstractions
* massive components
* duplicated logic
* hardcoded secrets
* magic values everywhere
* premature optimization
* unnecessary dependencies

Do not add libraries simply because they are popular.

Use a dependency only when it provides meaningful value.

---

# 21. DOCUMENTATION

Maintain a project state document such as:

PROJECT_STATE.md

It should contain:

* current phase
* completed functionality
* current architecture
* important decisions
* known issues
* next phase
* setup instructions where useful

Update it after meaningful implementation phases.

This file is the project's persistent engineering memory.

---

# 22. TESTING PHILOSOPHY

Every major feature should be tested before moving forward.

At minimum:

* happy path
* invalid input
* failure state
* edge case relevant to the feature

For video rendering, test actual output rather than assuming code is correct.

For APIs, test actual requests.

For frontend flows, verify the user experience end-to-end.

---

# 23. RESPONSIVE DESIGN

Mobile is NOT an afterthought.

The product must work beautifully on:

* mobile
* tablet
* desktop

However, the editor/rendering workspace may appropriately prioritize larger screens while remaining usable on mobile.

Do not simply shrink desktop UI onto mobile.

Adapt the layout intentionally.

---

# 24. DESIGN CONSISTENCY

Create reusable design primitives where appropriate:

* buttons
* inputs
* typography
* panels
* modal/dialog patterns
* progress indicators
* style selectors
* timeline controls
* video preview
* loading states
* empty states
* error states

Do not create a new visual pattern every time.

---

# 25. PERFORMANCE

The application will eventually deal with expensive video processing.

Keep the frontend lightweight.

Avoid unnecessary re-renders.

Keep video rendering outside the browser when final rendering requires significant processing.

Use asynchronous jobs for expensive backend operations.

Do not block API requests unnecessarily.

---

# 26. IMPORTANT PRODUCT FEEL

When making implementation decisions, ask:

"Does this make the product feel more like a premium creative tool?"

If the answer is no, reconsider the implementation.

We want the user to experience:

Paste song
↓
Choose a style
↓
Watch the song become visual
↓
Feel surprised
↓
Download something beautiful.

That emotional progression is part of the product.

---

# 27. YOUR ROLE DURING DEVELOPMENT

Act as:

* senior full-stack engineer
* software architect
* creative frontend engineer
* product designer
* video rendering engineer
* pragmatic technical lead

Do not blindly follow instructions if you identify a serious architectural problem.

If you believe a requested approach will cause significant problems, explain the issue briefly and propose a better approach.

But do not unnecessarily block development over theoretical future problems.

Favor practical implementation.

---

# 28. PHASE DISCIPLINE

When I give you a phase prompt:

* Work ONLY on that phase.
* Inspect existing implementation first.
* Reuse existing components/services.
* Do not rewrite working code without reason.
* Do not implement future phases.
* Do not introduce unrelated features.
* Test the result.
* Update PROJECT_STATE.md.
* Tell me exactly what was implemented.
* Tell me how I can test it.
* Tell me about any known limitations.

At the end of every phase, STOP.

Wait for the next phase instruction.

---

# 29. FIRST TASK — DO NOT START BUILDING YET

For this prompt, DO NOT implement the product.

Instead:

1. Confirm that you understand the product.
2. Analyze the proposed architecture.
3. Identify any major technical risks or architectural changes you recommend.
4. Propose the final folder structure.
5. Propose the initial dependency list.
6. Explain how the frontend, backend, AI layer and rendering engine will communicate.
7. Explain any important decisions we should make before Phase 1.
8. Create the initial PROJECT_STATE.md if the repository is already initialized.
9. Do NOT implement Phase 1 yet.

Keep the response practical and concise.

We will review your architecture before beginning Phase 1.


this is our prompt 0 for our project first check how much part is done and how much is reamining then comlete the reaming part from this part as we are doing this 
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-09-24T19:19:18+05:30.
</ADDITIONAL_METADATA>
# Lucida

A **camera-lucida / optical-tracing atelier booth** — drafting plate, brass prism arm, tracing paper, image-cache drawer. Fonts **Libre Baskerville** (display) + **Source Sans 3** (body) + **JetBrains Mono** (mono). Palette: vellum `#f7f0e4`, brass `#8b5a2b`, prism violet `#5c4d8a`, optical cyan `#3d7a86`, pathless crimson `#9b2e2e` — warm atelier, not sterile lab, pulse-damper, wet-clay trench, CRT afterimage, or diplopia acuity.

Primary:

- [anthropics/claude-code#93429](https://github.com/anthropics/claude-code/issues/93429) (OPEN, bug, has repro, platform:macos, area:desktop). Title: Desktop app (Code tab) drops the image source path: pasted images are never written to image-cache and no `[Image: source: <path>]` line is injected. Filed by Lumidew 2026-09-10. Desktop app **1.49585.0** (macOS arm64, built 2026-09-08). Bundled Claude Code **2.1.260** (also 2.1.258). CLI for comparison **2.1.266**. macOS 15.3.2. Desktop Code tab paste should write `~/.claude/image-cache/<session-id>/N.png` and inject a turnCompanion `[Image: source: <path>]` the way CLI does. Instead desktop receives only the inline image block. Measured across 8 sessions in one project: **4/4** `entrypoint: "cli"` inject; **0/4** `entrypoint: "claude-desktop"` inject. Pixels byte-identical **852x525**; `ImageChops.difference` getbbox None.

05:50 lucida: a camera-lucida / optical-tracing atelier booth for #93429. Idle **traced** / seeded **pathless** / path **image-cache**. Score lucida or admit traced.

Score lucida or admit traced.

Idle word: **traced** (HOLD: CLI writes image-cache and injects `[Image: source: <path>]`; plate stays addressable). Seeded word: **pathless** / #93429 (Desktop Code tab omits the companion; no image-cache dir for that session). Path word: **image-cache**. Product score: **lucida**. Never idle scrubbed / contaminated / fomite / gitignore / mounted / fossed / plan9 / fosse / warm / paged-out / majflt / hibernacle / damped / spinning / mux / snubber / latent / flushed / afterimage / distinct / conflated / diplopia / diopter.

Phrase: **when the desktop Code tab drops the image source path so pasted images never hit image-cache and no [Image: source: path] companion is injected, score lucida or admit traced.**

- **traced** = IDLE: HOLD; CLI writes image-cache and injects `[Image: source: <path>]`; plate stays addressable
- **pathless** = #93429 seeded path: Desktop Code tab paste receives only the inline image block
- **lucida** = product score word for the missing tracing-plate path
- **image-cache** = path word: `~/.claude/image-cache/<session-id>/N.png` never written on desktop
- **hold** = HOLD alias for idle traced
- **cli-inject** = 4/4 `entrypoint: "cli"` sessions inject the path
- **desktop-omit** = 0/4 `entrypoint: "claude-desktop"` sessions inject
- **companion-missing** = no turnCompanion `[Image: source: <path>]` line
- **no-cache-dir** = `~/.claude/image-cache/` contains no directory for that session
- **content-block** = desktop takes the content-block branch (issue note; NON-BINDING)
- **pasted-contents** = CLI / pastedContents path writes cache and returns id → path
- **turn-companion** = `isMeta` `turnCompanion` user message
- **bytes-identical** = pixels 852x525; `ImageChops.difference` getbbox None; max channel diff 0
- **has-repro** = Desktop 1.49585.0 · Lumidew · bundled 2.1.260 · CLI 2.1.266 · 8 sessions
- **cousins** = cite-only #84251 #89223 — do not rebuild; do not clone Afterimage
- **backups** = cite-only #93446 #93445 #93403 #93405 #93402 #93426 — do not auto-pick
- **fixtures** = drafting-plate / prism / tissue / drawer table for the lucida booth
- **walk** = published idle traced → paste-cli → write-cache → inject-companion → paste-desktop → content-block → omit-companion → no-cache-dir → bytes-identical → pathless → image-cache → lucida

Verdicts: traced, pathless, lucida, image-cache, hold, cli-inject, desktop-omit, companion-missing, no-cache-dir, content-block, pasted-contents, turn-companion, bytes-identical, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the plate is **pathless** / **lucida** or already **traced**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): prompt-submission path branches on how the image arrived; desktop takes the content-block branch missing the cache+path argument the CLI / pastedContents path uses. Invite verify against #93429 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93429](https://github.com/anthropics/claude-code/issues/93429)
- Cite-only cousin: [anthropics/claude-code#84251](https://github.com/anthropics/claude-code/issues/84251) (macOS file-path images become a generic PNG placeholder; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#89223](https://github.com/anthropics/claude-code/issues/89223) (WSL/WSLg paste writes BMP into a `.png` path; do not rebuild)
- CLI-vs-desktop parity theme noted without cloning Afterimage/#92596 (Windows assistant text deltas / paint, not image-cache)
- Backup (data only): #93446 mcp add-json client-secret key mismatch
- Backup (data only): #93445 `/branch` RC reconnection record
- Backup (data only): #93403 nested skills never load in auto mode
- Backup (data only): #93405 autoMode trusted-repo path pinned user-global
- Backup (data only): #93402 Cmd+Enter interrupts instead of queues
- Backup (data only): #93426 host writes `.in_use` / `.orphaned_at` into pinned plugin tree

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:desktop
- Desktop app **1.49585.0** (macOS, arm64, built 2026-09-08)
- Bundled Claude Code **2.1.260** (also 2.1.258) at `~/Library/Application Support/Claude/claude-code/<version>/...`
- CLI for comparison **2.1.266**; macOS 15.3.2
- Reporter: Lumidew
- CLI writes `~/.claude/image-cache/<session-id>/N.png` and injects a `turnCompanion` meta user message `[Image: source: ...]`
- Desktop Code tab omits that companion; no image-cache dir for that session
- 8 sessions one project: 4/4 `entrypoint: "cli"` inject; 0/4 `entrypoint: "claude-desktop"` inject
- Image pixels identical (852x525 example; `ImageChops.difference` getbbox None; max channel diff 0)
- Root-cause note in the issue (NON-BINDING): prompt-submission path branches on how the image arrived; desktop takes the content-block branch missing the cache+path argument the CLI path uses

Problem found: DESKTOP CODE TAB PASTE STRIPS THE FILESYSTEM PATH COMPANION THE CLI PROVIDES, SO THE MODEL CAN SEE PIXELS BUT CANNOT READ/BASH THE CACHED FILE FOR CROP/UPSCALE.

Why this solution: A camera-lucida atelier booth makes the missing tracing-plate path tangible (traced vs pathless) without cloning CRT-afterimage or ophthalmology-diplopia UIs.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Both clients inject the source-path companion message
2. Desktop Code tab paste writes `~/.claude/image-cache/<session-id>/N.png`
3. The model can Read/Bash the cached file for crop/upscale

## Why not a clone

This is specifically: **DESKTOP CODE TAB DROPS THE IMAGE SOURCE PATH SO PASTED IMAGES NEVER HIT IMAGE-CACHE AND NO `[Image: source: path]` COMPANION IS INJECTED** — camera-lucida atelier, not CRT afterimage / diplopia acuity / sterile-lab fomite / pulse-damper / earthwork fosse.

**NOT Afterimage/#92596** (Windows assistant text deltas arrive but are not painted until `message_stop`). Different defect. NOT phosphor / mega-frame.

**NOT Diplopia/#93012** (Remote Control web/mobile environment-label double vision). Different defect. NOT Snellen / phoropter.

**NOT Diopter/#92524** (per-session scratchpad UUID defocuses the prompt cache). Different defect.

**NOT Fomite/#93423** (directory marketplace install copies gitignored files including root `.env`). Different defect. NOT culture dish.

**NOT Snubber/#93398** (sandboxed Bash EPIPE spin on leaked srt-mux). Different defect. NOT pulse-damper.

**NOT Fosse/#93358** (Win10 Plan9 host-honest / guest 0/4 EINVAL). Different defect. NOT wet clay trench.

**NOT Hibernacle/#93372.** **NOT Pontoon/#93288.** **NOT Concordat/#93290.** **NOT Ward / Latchkey / Bitting / Escutcheon** lock-key booths.

**NOT leftover woodworking / mm-slider Vernier/#93219.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **camera lucida / optical tracing — a prism that should keep the plate path inscribed so the draft stays addressable** — unused in catalog as this atelier walk.

Do NOT rename this product Afterimage, Diplopia, Diopter, Fomite, Snubber, Fosse, Hibernacle, Pontoon, Concordat, Ward, Latchkey, Bitting, Escutcheon, or any existing catalog slug.
Do NOT reuse idle traced / pathless / image-cache on a later booth.
Do NOT reuse Alegreya, Nunito Sans, Fira Code, Fraunces, Outfit, IBM Plex Mono, Source Serif 4, Karla, Roboto Mono. Display here is **Libre Baskerville**. Body is **Source Sans 3**. Mono is **JetBrains Mono**.

Different surface: desktop Code tab image-cache / companion-path omit vs Windows text-paint deferral vs environment-label diplopia vs directory-marketplace gitignore-blind copy.

Product name stays **Lucida**. Name/slug `lucida` unused in catalog.json (276 products before this ship; Fomite is #276).

Different UI: camera-lucida / optical-tracing atelier / drafting plate / brass prism / tracing paper / image-cache drawer. Libre Baskerville / Source Sans 3 / JetBrains Mono. NOT CRT phosphor (Afterimage). NOT Snellen chart (Diplopia). NOT sterile lab (Fomite). NOT pulse-damper (Snubber). NOT earthwork / sod lip (Fosse). NOT millimeter-slider.

Different verbs: Trace the plate, Score lucida, Lift the tissue, Audit the cache, Pin idle traced, Pin seeded pathless, Pin image-cache, Clear the plate.

Different idle: **traced**. Different #93429 seeded path: **pathless**. HOLD: **traced** / **hold**. ALARM: **pathless** / **lucida** / **image-cache** / **desktop-omit**. Path: **image-cache**.

## How to score

```bash
node --test projects/lucida/lucida.test.mjs
node projects/lucida/lucida.mjs projects/lucida/data/pathless.json
echo '{"seed":"pathless"}' | node projects/lucida/lucida.mjs
```

Open the living card at `projects/lucida/index.html` (or the live path `/lucida/`). Buttons: Trace the plate, Score lucida, Lift the tissue, Audit the cache, Pin idle traced, Pin seeded pathless, Pin image-cache, Clear the plate. Toggle write image-cache / inject companion / entrypoint CLI / entrypoint desktop / content-block branch / bytes identical — the score flips. Lay a fixture JSON on the drafting plate. `?embed=1` hides chrome.

The booth reconstructs the reporter’s CLI vs desktop injection / image-cache / companion walk from the published #93429 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/lucida/
- Folder: `projects/lucida/`

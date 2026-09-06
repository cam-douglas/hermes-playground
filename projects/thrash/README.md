# Thrash

An **OS thrashing / working-set / paging-storm console** — CRT phosphor green-on-black memory gauges, stall chronograph, RSS thermometer, event-loop heartbeat flatline — IBM Plex Sans + IBM Plex Mono + Orbitron — for a real Claude Code defect: **FIRST PROMPT FREEZES TUI ~40–60S (EVENT-LOOP STALL, ~2.6GB RSS) EVEN WITH `--SAFE-MODE`.** On the first prompt of every new process the TUI looks dead: event-loop stall ~40808ms, ~100% CPU, RSS ~2.5–3.5 GB (**thrashing**). Expected: first prompt streams in a couple of seconds and the terminal stays alive (**responsive**).

Primary:

- [anthropics/claude-code#88257](https://github.com/anthropics/claude-code/issues/88257) (live, bug, has repro, platform:linux, area:tui, area:core, perf:memory). Title: `[BUG] First prompt freezes TUI ~40–60s (event-loop stall, ~2.6GB RSS) even with --safe-mode`. Filed 2026-08-20T14:06:34Z. Reporter: radcliffkey. Claude Code 2.1.237.

23:50 thrash: a paging-storm console that should keep the first prompt streaming in a couple of seconds but instead lets the working set balloon and the event-loop heartbeat flatline — stall 40808ms, rss=2646MB, CPU≈wall, `[likely sleep/wake]` already a lie. Score thrashing or admit responsive.

Idle word: **thrashing** (first-prompt event-loop stall with ballooned RSS / frozen TUI). Seeded state: **responsive** / #88257 — first prompt streams in a couple of seconds; terminal stays alive. Never idle/seed as leaking, excised, remanent, rewritten, cleared, maxed, mute, inherited, freewheeling, deaf, choking, miscast, unguided, dropped, strobing, stolen, dawnlocked, cold, voided, alongside, shed, latched, quiet, bound, open, sostenutoed, or frozen (Sostenuto owns CoreAudio mic freeze — different bug).

**Thrash** is a CRT working-set console. The first prompt of every new process should stay responsive. Instead the TUI freezes while RSS balloons.

- **thrashing** = IDLE: first-prompt event-loop stall with ballooned RSS / frozen TUI
- **responsive** = seeded word: first prompt streams in a couple of seconds; terminal stays alive
- **event-loop-stall** = blocked for 40808ms (expected 200ms, actual 41008ms); Ctrl+C often ignored
- **rss-balloon** = rss=2646MB heap=896MB ext=270MB; range ~2.5–3.5 GB on 62 GB host
- **cpu-bound-gap** = silence between `Sending 12 skills via attachment (initial)` and first byte 40832ms; CPU≈wall
- **safe-mode-still-stalls** = `--safe-mode`, Haiku, one-file git repo; `[claudeai-mcp] Disabled in safe mode`; still freezes
- **sleep-wake-mislabelled** = detector's `[likely sleep/wake]` tag is misleading when cpu=40899ms ≈ wall
- **cousins** = cite-only #89772 #91633 #88072 #92325 #91941

Verdicts: thrashing, responsive, event-loop-stall, rss-balloon, cpu-bound-gap, safe-mode-still-stalls, sleep-wake-mislabelled, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a first prompt would leave the console thrashing or already responsive. Fixtures use the issue's stall measurements, RSS figures, isolation table, and debug gap only.

Hypothesis only (NON-BINDING): something between skills-attachment send and first API byte does heavy synchronous main-thread work (possibly skill/attachment materialization or related), ballooning RSS and stalling the event loop; detector mis-tags sleep/wake. Verify nothing — encode issue facts only. Encoded from the issue body only. Do not invent runtime source claims.

## Research brief

Sources:

- Primary: [anthropics/claude-code#88257](https://github.com/anthropics/claude-code/issues/88257)
- Cousins cite-only (NOT primary): [anthropics/claude-code#89772](https://github.com/anthropics/claude-code/issues/89772), [anthropics/claude-code#91633](https://github.com/anthropics/claude-code/issues/91633), [anthropics/claude-code#88072](https://github.com/anthropics/claude-code/issues/88072), [anthropics/claude-code#92325](https://github.com/anthropics/claude-code/issues/92325), [anthropics/claude-code#91941](https://github.com/anthropics/claude-code/issues/91941)

What happened (from the issue — do not invent):

- Claude Code 2.1.237 blocks the main thread for ~40–60 seconds on the first prompt of every new process. The TUI looks dead (no redraw, Ctrl+C ignored). The process is not stuck forever: it recovers and answers if you wait.
- Reproduces with `--safe-mode`, no user MCP, Haiku, and a one-file git repo under `/tmp`.
- Environment: Linux 7.0.0-29-generic x86_64, installMethod local, bundled claude.exe (Bun), 62 GB RAM (not memory-constrained). Reporter: radcliffkey. Filed 2026-08-20T14:06:34Z. Labels: bug, has repro, platform:linux, area:tui, area:core, perf:memory.
- Actual: TUI freezes immediately after the first prompt; process at ~100% CPU; RSS ~2.5–3.5 GB; Ctrl+C / SIGTERM often ignored until the stall ends; after ~40–60s the reply appears; every new process pays this cost again (not a one-time warmup).
- Expected: first prompt starts streaming within a couple of seconds; terminal stays responsive.
- Isolation ruled out user MCP, opus[1m]/always-thinking, large workspace / nested git repos, session history / temp files, and user config (CLAUDE.md, plugins, hooks, MCP). `--safe-mode` log confirms `[claudeai-mcp] Disabled in safe mode` and it still stalls.
- Debug (`--safe-mode -p` + `--debug-file`, Haiku, empty git dir). Wall clock 45s, then pong:
  - `[DEBUG] Sending 12 skills via attachment (initial)`
  - `[DEBUG] [API:timing] dispatching to firstParty model=claude-haiku-4-5-20251001`
  - ~41s gap, no log lines
  - `[DEBUG] [API:timing] first byte after 40832ms`
  - `[WARN] [event-loop-stall] blocked for 40808ms (expected 200ms, actual 41008ms). Total stalls: 1, cumulative: 40808ms [likely sleep/wake] cpu=40899ms majflt=0 rss=2646MB heap=896MB ext=270MB`
- The silence is between `Sending 12 skills via attachment (initial)` and the next API dispatch. CPU time ≈ wall time, so this is synchronous main-thread work, not I/O wait. The stall detector's `[likely sleep/wake]` tag is misleading here.
- Same pattern without `--safe-mode`: 50–64s, RSS up to ~3.5 GB. Interactive sessions killed during the stall show 0 input/output tokens and TUI FPS ~0.1.

Problem found: first prompt of every new process → TUI freeze → event-loop stall ~40808ms + RSS ~2.6 GB → CPU≈wall gap after skills-attachment send → detector mis-tags sleep/wake → `--safe-mode` does not prevent it.

Why this solution: a diagnostic scorer for the thrashing working set → responsive first-prompt chain, so a reader can admit idle thrashing, pin seeded responsive, and score event-loop-stall / rss-balloon / cpu-bound-gap / safe-mode-still-stalls / sleep-wake-mislabelled / cousins against the published facts.

## Why not a clone

This is specifically: **first prompt of every new Claude Code process freezes the TUI ~40–60s with an event-loop stall (~40808ms) and RSS balloon (~2.6 GB), even with `--safe-mode`, Haiku, and a one-file git repo.**

NOT Sostenuto — CoreAudio mic / voice dictation main-thread freeze. Thrash is first-prompt API-path event-loop stall + RSS balloon.
NOT Muzzle/#92459 — safe-mode skills wire leak. Thrash is freeze/perf, not attachment strip.
NOT Watchdog — compaction-nap kill. Different.
NOT Stroboscope — terminal panel focus steal. Different.
NOT Hysteresis/#92444 — mid-session `/effort` prompt-cache remanence. Different.
NOT Hardstand/#92452 — Dispatch exclusive-cwd. Different paradigm entirely.
NOT Rheostat/#92436 — bakelite effort dial hardwired high. Different.
NOT Oubliette — stone-pit forgotten child queue. Different.
NOT #85050 silent Windows startup gaps (backup only; do not ship that).
NOT #91633 FileIndex large cwd stall (cousin cite-only; Thrash is first-prompt even in a tiny git repo).

Do NOT name this after prior paradigm desks.
Do NOT reuse idle leaking / excised / remanent / rewritten / cleared / maxed / mute / inherited / freewheeling / deaf / choking / miscast / unguided / dropped / strobing / stolen / dawnlocked / cold / voided / alongside / shed / latched / quiet / bound / open / sostenutoed / frozen.

Different surface: first-prompt API-path event-loop stall + RSS balloon vs CoreAudio mic freeze / attachment-strip leak / compaction-nap kill / terminal focus steal / FileIndex large-cwd walk.

Product name stays **Thrash**. Name/slug `thrash` confirmed unused in catalog.json (182 products).

Different UI: OS thrashing / working-set / paging-storm console / CRT phosphor green-on-black / memory gauges / stall chronograph / RSS thermometer / event-loop heartbeat flatline. IBM Plex Sans / IBM Plex Mono / Orbitron. NOT suppressor bay (Muzzle — Bebas + Barlow + Source Code Pro). NOT magnetic remanence (Hysteresis). NOT asphalt/sodium taxiway (Hardstand). NOT bakelite dial (Rheostat). NOT optics strobe (Stroboscope). NOT piano freeze (Sostenuto). NOT kennel (Watchdog). NOT stone pit (Oubliette).

Different verbs: admit thrashing, pin seeded responsive, score thrashing vs responsive, load #88257 fixture, score probes.

Different idle: **thrashing**. Different seeded: **responsive**. HOLD: **responsive**. ALARM: **thrashing** / **event-loop-stall** / **rss-balloon** / **cpu-bound-gap** / **safe-mode-still-stalls** / **sleep-wake-mislabelled**.

Cousins cite-only (NOT primary):

- [#89772](https://github.com/anthropics/claude-code/issues/89772) (live) — Bash tool dispatch blocks the event loop ~80s in a CPU spin. Large resumed context; not first-prompt / tiny-repo.
- [#91633](https://github.com/anthropics/claude-code/issues/91633) (live) — Startup FileIndex blocks the event loop ~41s when cwd is a large non-git directory. Thrash is first-prompt even in a one-file git repo.
- [#88072](https://github.com/anthropics/claude-code/issues/88072) (live) — Auto-updater blocks Desktop main-process event loop.
- [#92325](https://github.com/anthropics/claude-code/issues/92325) (live) — Desktop stalls over 5s discarded as `[likely sleep: duration_heuristic]`.
- [#91941](https://github.com/anthropics/claude-code/issues/91941) (live) — Linux Desktop event-loop stalls compound into whole-app crash-loop.

## Live catalog path

`/thrash/` is this static paging-storm scoring assay. Path `https://hermes-playground-green.vercel.app/thrash/` and subdomain `https://thrash.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `23:50 Sydney · thrash · catalog #183 · #88257`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Idle **thrashing** → first-prompt event-loop stall with ballooned RSS / frozen TUI.
2. Seeded **responsive** → first prompt streams in a couple of seconds; terminal stays alive.
3. Diagnostic **event-loop-stall** → 40808ms block; Ctrl+C ignored until stall ends.
4. Diagnostic **rss-balloon** → rss=2646MB heap=896MB; range ~2.5–3.5 GB.
5. Diagnostic **cpu-bound-gap** → 12-skills attachment → first byte 40832ms; CPU≈wall.
6. Diagnostic **safe-mode-still-stalls** → `--safe-mode` + Haiku + one-file repo still freezes.
7. Diagnostic **sleep-wake-mislabelled** → `[likely sleep/wake]` tag is misleading.
8. Diagnostic **cousins** → #89772 #91633 #88072 #92325 #91941 cite-only.
9. Assay UI: CRT phosphor, working-set gauges, stall chronograph, RSS thermometer, heartbeat flatline.
10. Stay-off strip: suppressor bay / remanence lab / night apron / bakelite dial / optics strobe / piano freeze / kennel / stone pit. Primary stays #88257.
11. **Score probes** walks the probe ticket and lights chips on the chronograph. Chip-switch every verdict. Paste or drop JSON. Console simulator chips rewrite the bay (thrashing / responsive / stall / rss).

## How to score

Open `projects/thrash/index.html` in a browser, or serve the repo root and visit `/thrash/` (Vercel rewrite → `/projects/thrash`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
node --test projects/thrash/hook/thrash.test.mjs
```

Empty paste scores the idle **thrashing** ticket if you admit thrashing. Paste a probe on the page or drop a fixture from `data/`. The living page admits **thrashing** / event-loop stall / RSS balloon / #88257.

## Hook

`projects/thrash/hook/` scores a probe `{ seed, thrashing, responsive, stallMs, rssMB, safeMode, cpuBoundGap, sleepWakeMislabelled }` and returns `{ verdict, reasons[], thrashing, responsive, chips[] }`. See `hook/README.md`.

```bash
node projects/thrash/hook/index.mjs projects/thrash/data/88257.json
echo '{"seed":"responsive","responsive":true,"thrashing":false}' | node projects/thrash/hook/index.mjs
```

`responsive` is true ONLY when the verdict is responsive (first prompt streams; terminal stays alive). Seeded 88257 numbers must produce thrashing / `responsive=false` on the first-prompt stall path. A thrashing working set is never responsive.

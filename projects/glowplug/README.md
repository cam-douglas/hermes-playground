# Glowplug

A **diesel glow-plug preheat bay** — deep charcoal / soot, steel bulkheads, amber tip-glow on the plug, subtle heat-shimmer — Teko + Outfit + Share Tech Mono — for a real Claude Code defect: **WINDOWS: ~75S OF SILENT, UNLOGGED STARTUP PHASES ENDING AT `[skills] idle` / `[ScheduledTasks] scheduler start` — PERSISTS WITH SKILLS REMOVED, MCP DISABLED, NONESSENTIAL TRAFFIC OFF.** Before the engine can fire, the glow plug silently soaks heat with no telemetry. Claude Code on Windows sits in two unlogged warm-up voids (**preheating**). When the empty-config path is already 6s (**lit**), that is the hold path.

Primary:

- [anthropics/claude-code#85050](https://github.com/anthropics/claude-code/issues/85050) (OPEN, area:core). Title: `[BUG] Windows: ~75s of silent, unlogged startup phases (ending at '[skills] idle' / '[ScheduledTasks] scheduler start') - persists with skills removed, MCP disabled, nonessential traffic off`. Filed 2026-08-08T14:02:50Z. Reporter: arpitjaiswal-0701. Claude Code 2.1.224 (also 2.1.223).

01:50 glowplug: a diesel glow-plug preheat bay that should fire `claude` in seconds but instead soaks ~75s in two silent Windows preheat gaps — nothing written to `--debug` while they run — ending at `[skills] idle` and `[ScheduledTasks] scheduler start`. Score preheating or admit lit.

Idle word: **preheating** (two silent unlogged Windows startup soaks). Seeded state: **lit** / #85050 — empty-config path already 6s. Never idle as hangfired, thrashing, leaking, remanent, rewritten, cleared, maxed, mute, inherited, freewheeling, deaf, choking, miscast, unguided, dropped, strobing, stolen, dawnlocked, cold, voided, alongside, shed, latched, quiet, bound, open, sostenutoed, or frozen.

**Glowplug** is a diesel glow-plug preheat bay. Before the engine can fire, the plug silently soaks heat with no telemetry.

- **preheating** = IDLE: two silent Windows startup phases (~57–60s + ~17–38s) with nothing written to `--debug`
- **lit** = seeded word: empty-config path already 6s; plug already glowing
- **gap-skills-idle** = ~57–60s silent (this run 59.7s) from `Org fast mode: enabled` to `[skills] idle`
- **gap-scheduler** = ~17–38s silent (this run 38.4s) from `[skills] idle` to `[ScheduledTasks] scheduler start`
- **skills-removed-persists** = `~/.claude/skills` renamed away: 85.5s; first gap is not only skill scanning
- **nonessential-traffic-noop** = `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`: 127.9s (no effect)
- **cert-store-bundled-noop** = `CLAUDE_CODE_CERT_STORE=bundled` (#84478 workaround): 115.3s (no effect)
- **empty-config-fast** = fresh empty `CLAUDE_CONFIG_DIR` + empty cwd: **6s**
- **cousins** = cite-only #84478 #83988

Verdicts: preheating, lit, gap-skills-idle, gap-scheduler, skills-removed-persists, nonessential-traffic-noop, cert-store-bundled-noop, empty-config-fast, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a Windows `claude` start would preheat through two unlogged voids or already light. Fixtures use the issue's debug gaps, wall-time table, and isolation notes only.

Hypothesis only (NON-BINDING): silent gaps may be network/proxy/VPN or config-hydration work that logs nothing; empty config bypasses them (6s). Verify nothing — encode measurements only. Encoded from the issue body only. Do not invent runtime source claims.

## Research brief

Sources:

- Primary: [anthropics/claude-code#85050](https://github.com/anthropics/claude-code/issues/85050)
- Cousins cite-only (NOT primary): [anthropics/claude-code#84478](https://github.com/anthropics/claude-code/issues/84478), [anthropics/claude-code#83988](https://github.com/anthropics/claude-code/issues/83988)

What happened (from the issue — do not invent):

- On Windows, every `claude` start (interactive, `-p`, and `--resume`) spends ~75 seconds in two completely silent startup phases — nothing written to `--debug` while they run.
- Trivial `claude -p --model haiku "Reply OK"` cold start is 111–136s with full config; same command with fresh empty `CLAUDE_CONFIG_DIR` in empty directory is **6s**.
- Two large debug gaps: ~59.7s between `Org fast mode: enabled` and `[skills] idle — switching poll interval to 30000ms`; then ~38.4s until `[ScheduledTasks] scheduler start() — enabled=false, hasTasks=false`. Same two-gap structure (~57–60s + ~17–38s) every run.
- Gaps persist with user skills directory renamed away (so first gap is not only skill scanning). After second gap, rest of startup completes in ~1s.
- Measurements (all `claude -p --model haiku --strict-mcp-config "Reply OK"`, PowerShell Stopwatch):
  - Full config (1,811 skills / 8.3k files, 3 plugins, 4 SessionStart hooks): 128–136s
  - After pruning skills 40k→8.3k files: 111s
  - `~/.claude/skills` renamed away: 85.5s
  - `--disable-slash-commands`: 85.1s
  - `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`: 127.9s (no effect)
  - `CLAUDE_CODE_CERT_STORE=bundled` (#84478 workaround): 115.3s (no effect)
  - Fresh empty `CLAUDE_CONFIG_DIR` + empty cwd: **6s**
- So ~25–45s scales with skill count, but the ~57s + ~17–38s silent phases persist with skills removed and are unexplained.
- Working-directory choice irrelevant. stdio MCP ruled out via `--strict-mcp-config`.
- Knock-on: `claude -p --resume` of 8.7 KB session ~130s; 44 MB session 5.4 minutes. Interactive resume looks hung; users abandon.
- Env: win32 Windows 11 Enterprise 10.0.26200 corporate proxy+VPN; native install; version 2.1.224 (also 2.1.223); Windows Terminal / PowerShell 5.1.
- Asks in issue: what runs in those windows; emit debug start/finish with durations; if network/proxy then aggressive timeouts / opt-out (nonessential traffic flag did not help).

Problem found: Windows `claude` start → two unlogged soaks (~57–60s to `[skills] idle`, then ~17–38s to ScheduledTasks) → full config 111–136s vs empty config 6s → resume looks hung.

Why this solution: a diagnostic scorer for the preheating plug → lit engine chain, so a reader can admit idle preheating, pin seeded lit, and score gap-skills-idle / gap-scheduler / skills-removed-persists / nonessential-traffic-noop / cert-store-bundled-noop / empty-config-fast / cousins against the published facts.

## Why not a clone

This is specifically: **Windows ~75s of silent, unlogged startup phases ending at `[skills] idle` / `[ScheduledTasks] scheduler start` — persists with skills removed, MCP disabled, nonessential traffic off.**

NOT Thrash/#88257 — first-prompt TUI freeze / event-loop stall ~40808ms AFTER “Sending 12 skills via attachment”; Glowplug is PRE-prompt silent unlogged Windows startup gaps ending at skills idle / ScheduledTasks.
NOT Hangfire/#92478 — queued `/compact` demoted to plain prompt (`promptSource:queued`).
NOT Muzzle/#92459 — safe-mode skill_listing attachment leak.
NOT Hysteresis/#92444 — `/effort` cache remanence.
NOT Hardstand/#92452 — Dispatch exclusive-cwd.
NOT Rheostat/#92436 — `--level low` hardwired high.
NOT Aphonia/Fulcrum/Wildcat/Clobber/Watchdog/Understudy or any prior catalog slug.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle hangfired / thrashing / leaking / remanent / rewritten / cleared / maxed / mute / inherited / freewheeling / deaf / choking / miscast / unguided / dropped / strobing / stolen / dawnlocked / cold / voided / alongside / shed / latched / quiet / bound / open / sostenutoed / frozen.
Do NOT reuse seeded executed / responsive / excised / rewritten / refused / hardwired.

Different surface: PRE-prompt Windows silent startup soaks vs first-prompt event-loop stall / queued slash demotion / attachment-strip leak / cache remanence / exclusive-cwd / effort-dial.

Product name stays **Glowplug**. Name/slug `glowplug` confirmed unused in catalog.json (184 products).

Different UI: diesel engine bay / deep charcoal soot / steel bulkheads / amber tip-glow / heat-shimmer. Teko / Outfit / Share Tech Mono. NOT cordite/brass chronograph (Hangfire — Anybody + Source Sans 3 + JetBrains Mono). NOT phosphor CRT (Thrash — IBM Plex + Orbitron). Stay OFF cartridge primer / CRT paging-storm / olive range / magnetic loop / night apron / bakelite rheostat.

Different verbs: admit preheating, pin seeded lit, score preheating vs lit, load #85050 fixture, score probes.

Different idle: **preheating**. Different seeded: **lit**. HOLD: **lit**. ALARM: **preheating** / **gap-skills-idle** / **gap-scheduler** / **skills-removed-persists** / **nonessential-traffic-noop** / **cert-store-bundled-noop**. Control: **empty-config-fast**.

Cousins cite-only (NOT primary):

- [#84478](https://github.com/anthropics/claude-code/issues/84478) — macOS: 45s+ silent startup in system CA trust-store lookup (same shape; bundled cert workaround does NOT help on this Windows issue).
- [#83988](https://github.com/anthropics/claude-code/issues/83988) — Desktop: window appears ~1s then blank up to 117s with no progress indication.

## Live catalog path

`/glowplug/` is this static glow-plug scoring assay. Path `https://hermes-playground-green.vercel.app/glowplug/` and subdomain `https://glowplug.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `01:50 Sydney · glowplug · catalog #185 · #85050`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Idle **preheating** → two silent Windows startup soaks.
2. Seeded **lit** → empty-config path already 6s.
3. Diagnostic **gap-skills-idle** → ~57–60s silent to `[skills] idle`.
4. Diagnostic **gap-scheduler** → ~17–38s silent to ScheduledTasks.
5. Diagnostic **skills-removed-persists** → 85.5s with skills renamed away.
6. Diagnostic **nonessential-traffic-noop** → flag 127.9s, no effect.
7. Diagnostic **cert-store-bundled-noop** → #84478 workaround 115.3s, no effect.
8. Control **empty-config-fast** → empty `CLAUDE_CONFIG_DIR` + empty cwd: 6s.
9. Diagnostic **cousins** → #84478 #83988 cite-only.
10. Assay UI: steel bulkhead, ceramic glow plug, amber tip, two-gap crankshaft timeline, Stopwatch wall-time table, preheat lamp.
11. Stay-off strip: delayed-primer chronograph / CRT paging-storm / olive suppressor / magnetic remanence / night apron / bakelite dial. Primary stays #85050.
12. **Score probes** walks the probe ticket and lights chips on the bay. Chip-switch every verdict. Paste or drop JSON. Bay simulator chips rewrite the plug (preheating / lit / gaps / empty).

## How to score

Open `projects/glowplug/index.html` in a browser, or serve the repo root and visit `/glowplug/` (Vercel rewrite → `/projects/glowplug`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
node --test projects/glowplug/hook/glowplug.test.mjs
```

Empty paste scores the idle **preheating** ticket if you admit preheating. Paste a probe on the page or drop a fixture from `data/`. The living page admits **preheating** / two silent soaks / unlogged warm-up / #85050.

## Hook

`projects/glowplug/hook/` scores a probe `{ seed, preheating, lit, gapSkillsIdleSec, gapSchedulerSec, skillsRemoved, nonessentialTraffic, certStoreBundled, emptyConfig, wallSec }` and returns `{ verdict, reasons[], preheating, lit, chips[] }`. See `hook/README.md`.

```bash
node projects/glowplug/hook/index.mjs projects/glowplug/data/85050.json
echo '{"seed":"lit","lit":true,"preheating":false,"emptyConfig":true,"wallSec":6}' | node projects/glowplug/hook/index.mjs
```

`lit` is true ONLY when the verdict is lit or empty-config-fast (the plug already glowed / empty config bypassed the soaks). Seeded 85050 numbers must produce preheating / `lit=false` on the two-gap path. A preheating plug is never the hold path.

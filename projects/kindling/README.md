# Kindling

A blacksmith / camp **hearth** — charcoal firebox, kindling rack, ash drawer of uuid stubs, OTel counter dial, focus-switch bellows — for a real Claude Code Desktop defect: **every focus switch pre-warms via WarmLifecycle and spawns a fresh Claude Code CLI session that is then never used**. When the conversation resumes, the app maps the local session to its **pre-existing** CLI session. The warm spawn fires SessionStart, writes per-session dirs, increments `claude_code.session.count`, and is discarded without ever receiving a message.

Primary: [anthropics/claude-code#90798](https://github.com/anthropics/claude-code/issues/90798) (OPEN, filed 2026-08-30T17:15:16Z). Title: Desktop: every session switch spawns a throwaway Claude Code session — 950 unused sessions in 4 weeks, inflating claude_code.session.count and littering ~/.claude/projects. Labels: bug, has repro, platform:macos, area:desktop. Env: Claude Desktop 1.40609.0 macOS, bundled Claude Code 2.1.247.

A preview spark that never takes is not a hold. Score the rack or admit **cued**.

Idle word: **cued** (honest control: warm reuses/attaches the real CLI session — no throwaway spawn; or warm deferred until attach).
NEVER use cued for a failure. NEVER use the product name or these prior idle words: fresh, engaged, stood, muted, liveried, penned, underwrit, plated, collated, unheard, passed, squared, bound, girt, sheltered, alongside, seated, credited, level, verbatim, fronted, locked, yanked, caught, posted, bunged, belayed, rove, keyed, housed, beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, heard, clear, paired, empty, mute, idle, silent, flat, kernel, valid, sealed, dry, intact, open, still, loose, even, quiet, cool, latched, upheld, sterling, home.

Verdicts: **cued**, **warmed**, **discarded**, **session-start**, **littered**, **inflated**, **remapped**, **switch-focus**, **hook-ash**, **otel-skew**.

- **cued** = idle / honest: warm attaches or reuses the pre-existing CLI session; no discarded spawn
- **warmed** = WarmLifecycle:preview / warming up fired on focus switch
- **discarded** = spawned CLI session never receives a message / never mapped to conversation
- **session-start** = SessionStart fires on the throwaway
- **littered** = session-env + projects uuid dirs created and never pruned
- **inflated** = `claude_code.session.count` incremented for unused sessions
- **remapped** = resume maps `local_*` to a pre-existing CLI uuid, not the warm spawn
- **switch-focus** = `setFocusedSession` / focus switch is the driver
- **hook-ash** = SessionStart hook stdout written into discarded uuid tool-results
- **otel-skew** = session.count climbs while tokens/cost/active_time stay flat

The seeded #90798 board (137 focus switches → 137 startShellPty → 116 on disk → 4 mapped → 113 never used; remap to a pre-existing CLI uuid) is **discarded**, never **cued**. Unique nearby flags win their own seeds. Admit does not lie: a discarded spark stays discarded.

## Why not a clone

This is specifically: WarmLifecycle preview warm spawns a disposable CLI session identity that is never attached, inflating OTel session.count and leaving unreaped session-env/project dirs. Nearby WarmLifecycle issues frame memory/process; this is identity/metric/disk churn.

NOT **Deadband** ([#90789](https://github.com/anthropics/claude-code/issues/90789)) — settings echo suppress.
NOT **Pawl** ([#90784](https://github.com/anthropics/claude-code/issues/90784)) — UserPromptSubmit stop.
NOT **Cenotaph** ([#90771](https://github.com/anthropics/claude-code/issues/90771)) — orphaned advisor_tool_result.
NOT **Fetch** ([#90755](https://github.com/anthropics/claude-code/issues/90755)) — ghost suggestions.
NOT **Livery** ([#90748](https://github.com/anthropics/claude-code/issues/90748)) — TCC path churn.
NOT **Fob** ([#90527](https://github.com/anthropics/claude-code/issues/90527)) — Keychain credential litter (different litter object).
NOT **Lacuna** ([#90709](https://github.com/anthropics/claude-code/issues/90709)) — Task store silent wipe.
NOT **Fusee** ([#90485](https://github.com/anthropics/claude-code/issues/90485)) — early schedule dispatch.
NOT **Damper** ([#90341](https://github.com/anthropics/claude-code/issues/90341)) — Remote Control auto-enable.
NOT **Reveille** (catalog) — different wake metaphor.
NOT **Husk** — hollow success envelopes.
NOT **Wraith** — live-image unlink.

Nearby-but-different (cite, do not treat as primary — those frame memory/process):

- [anthropics/claude-code#76268](https://github.com/anthropics/claude-code/issues/76268) — process trees stay alive (183 idle sessions)
- [anthropics/claude-code#85104](https://github.com/anthropics/claude-code/issues/85104) — WarmLifecycle spawns with no memory backpressure
- [anthropics/claude-code#82023](https://github.com/anthropics/claude-code/issues/82023) — WarmLifecycle idle timeout re-arms scheduled sessions
- [anthropics/claude-code#73512](https://github.com/anthropics/claude-code/issues/73512) — SIGKILL correlates with session-switching WarmLifecycle

Different UI: blacksmith / camp hearth / firebox / kindling rack / ash drawer of uuid stubs / OTel counter dial / focus-switch bellows. Charcoal, ember orange, ash gray, banked-coal red. Fraunces + DM Sans + JetBrains Mono. NOT Deadband teal/phosphor CRT, NOT Pawl walnut/amber machine-shop, NOT Cenotaph Portland stone, NOT Fetch looking-glass parlor, NOT Livery wardrobe.
Different idle: **cued**.

## Live catalog path

`/kindling/` is this static hearth desk. Demo works with no secrets and no npm. Mark: `04:50 Sydney · kindling`.

1. Seeded `#90798` **discarded** is already on the rack: 137 focus switches → 137 startShellPty → 116 on disk → 4 mapped → 113 never used; resume remaps `local_*` to a pre-existing CLI uuid → **discarded**. Never cued.
2. File **warmed** — WarmLifecycle:preview fired.
3. File **session-start** — SessionStart on the throwaway.
4. File **littered** — session-env + projects uuid dirs, never pruned.
5. File **inflated** — `claude_code.session.count` incremented for unused sessions.
6. File **remapped** — resume maps to a pre-existing CLI uuid.
7. File **switch-focus** — focus switch is the driver.
8. File **hook-ash** — SessionStart hook stdout in discarded tool-results.
9. File **otel-skew** — session.count climbs; tokens/cost/active_time stay flat.
10. **Score** the rack. Wrong stamps bind the spark. **Admit cued** unlocks only on the honest hearth. **Restore · #90798** shows the discarded board.

## How to run (static)

Open `projects/kindling/index.html` in a browser, or serve the repo root and visit `/kindling/` (Vercel rewrite → `/projects/kindling`). No build step. Optional hook:

```bash
node projects/kindling/hook/index.mjs < projects/kindling/data/90798.jsonl
node --test projects/kindling/hook/kindling.test.mjs
```

`cued` (and `fresh`, the catalog equivalent) is true ONLY when the verdict is cued (idle, or honest control: warm attaches/reuses the pre-existing CLI session, or warm deferred until attach). Seeded 90798 numbers must produce discarded / `cued=false` / `fresh=false` / alarm true.

## Hook

`projects/kindling/hook/` scores a probe `{ warmLifecyclePreview, startShellPty, focusSwitch, neverUsed, remappedToPreexisting, sessionStartFired, sessionEnvCreated, sessionCountIncremented, tokensFlat, hookStdoutCaptured, warmReusesExisting }` and returns `{ verdict, reasons[], cued, fresh, alarm }`. See `hook/README.md`. Seed JSONL: `data/90798.jsonl`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90798](https://github.com/anthropics/claude-code/issues/90798) — OPEN, filed 2026-08-30T17:15:16Z. Desktop 1.40609.0 / bundled CLI 2.1.247. One busy day 2026-08-17: 137 focus switches to a different session → 137 startShellPty → 116 CLI sessions on disk → 4 ever mapped to a conversation → 113 never used. 91% of on-disk creations align within ±2s of Warming up / startShellPty. Driver is focus-switch count, not message volume. ~4 weeks: 950 unused vs 57 that hold conversation (94% waste). Disk litter under `~/.claude/session-env/<uuid>/` and `~/.claude/projects/<project>/<uuid>/`. SessionStart hook stdout captured even for discarded spawns. Nothing prunes (`cleanupPeriodDays` targets transcripts; these dirs have none).

Nearby (cite, not primary): [#76268](https://github.com/anthropics/claude-code/issues/76268), [#85104](https://github.com/anthropics/claude-code/issues/85104), [#82023](https://github.com/anthropics/claude-code/issues/82023), [#73512](https://github.com/anthropics/claude-code/issues/73512).

Ask: reuse the warmed session when the user switches to it, or do not spawn a CLI session for a warm until attach — and at minimum tear down unused artifacts and do not count them in `claude_code.session.count`.

## Env

| Variable | Meaning |
| --- | --- |
| `KINDLING_SLACK_WEBHOOK` / `SLACK_WEBHOOK` | Unused at page runtime. Absent → honest demo. |
| `KINDLING_GITHUB_TOKEN` / `GITHUB_TOKEN` | Unused at page runtime. |
| `KINDLING_LINEAR_KEY` / `LINEAR_API_KEY` | Unused at page runtime. |
| `KINDLING_GITHUB_ISSUE` | Optional deep-link stub. |
| `KINDLING_CATALOG_HOST` | Optional catalog host stub. |

Missing secrets stay in honest demo mode. The static page does not need them.

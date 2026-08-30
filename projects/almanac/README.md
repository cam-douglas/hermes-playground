# Almanac

A stationer's **almanac / feast-day desk** — printed red-letter annual, brass date-wheels, clerk's manuscript ledger, lookup-by-id not-found stamps, ICS ghost-year projection — for a real Claude Code defect: **the Background Tasks panel still lists a fired one-shot CronCreate as a recurring Loop a year out, while CronList is empty and CronDelete-by-id returns not found**.

Primary: [anthropics/claude-code#90804](https://github.com/anthropics/claude-code/issues/90804) (OPEN, filed 2026-08-30T18:09:30Z). Title: Background Tasks panel shows a CronCreate one-shot job as a recurring 'Loop' after CronList confirms it's deleted. Labels: bug, platform:macos, area:agent-view. Claude Code 2.1.236, macOS arm64.

A fired one-shot is not next year's Loop. Score the feast page or admit **dated**.

Idle word: **dated** (honest control: the feast already fired and auto-deleted; the printed page is a ghost annual, not a live Loop).
NEVER use **dated** for a failure. NEVER use the product name as an idle word. NEVER reuse these prior idle words: backed, voucher, cued, fresh, engaged, stood, muted, liveried, penned, underwrit, plated, collated, unheard, passed, squared, bound, girt, sheltered, alongside, seated, credited, level, verbatim, fronted, locked, yanked, caught, posted, bunged, belayed, rove, keyed, housed, beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, heard, clear, paired, empty, mute, idle, silent, flat, kernel, valid, sealed, dry, intact, open, still, loose, even, quiet, cool, latched, upheld, sterling, home, receipted, vouched.

Verdicts: **dated**, **looped**, **annual**, **fired**, **emptied**, **not-found**, **next-364d**, **ends-3d**, **one-shot-lie**, **gazetted**.

- **dated** = idle / honest: fired+gone; panel is a ghost annual, not treated as a live Loop
- **looped** = panel still shows Loop / Next 364d while CronList is empty and CronDelete is not-found
- **annual** = month/day with no year, after the match, projected as next year's feast
- **fired** = one-shot already ran at 10:40 and should have auto-deleted
- **emptied** = CronList reports No scheduled jobs
- **not-found** = CronDelete(id) lookup-by-id misses 1a6f1a3f and 92d0877f
- **next-364d** = panel Next 364d 23h
- **ends-3d** = Ends 3d matches neither immediate delete nor 7-day recurring expiry
- **one-shot-lie** = CronCreate recurring:false still labeled Loop
- **gazetted** = feast still printed on the annual after the clerk struck the manuscript

The seeded #90804 board (one-shot `40 10 30 8 *` fired at 10:40; CronList empty; CronDelete not-found for both ids; panel still Loop / Next 364d 23h / Ends 3d) is **looped**, never **dated**. Unique nearby flags win their own seeds. Admit does not lie: a gazetted ghost Loop stays looped until the page is struck.

## Why not a clone

This is specifically: **a source-of-truth split**. The printed almanac page (Background Tasks panel) still lists a feast as a recurring annual Loop a year out, while the clerk's manuscript ledger (CronList) is empty and a lookup-by-id (CronDelete) returns not found. The one-shot already fired and auto-deleted. The panel is holding a ghost annual.

NOT **Fusee** ([#90485](https://github.com/anthropics/claude-code/issues/90485)) — early schedule dispatch; a written cron firing too soon.
NOT **Cotter** ([#90533](https://github.com/anthropics/claude-code/issues/90533)) — poison fireAt registry.
NOT **Sounder** ([#90555](https://github.com/anthropics/claude-code/issues/90555)) — missed background wakeup.
NOT **Reveille** — heartbeats survive compaction / duplicate dispatch held.
NOT **Leat** ([#90475](https://github.com/anthropics/claude-code/issues/90475)) — sleep-block unbounded until.
NOT **Voucher** ([#90807](https://github.com/anthropics/claude-code/issues/90807)) — nested subagent fabricated findings.

Same-class corroborator (cite, not primary): [anthropics/claude-code#67293](https://github.com/anthropics/claude-code/issues/67293) — Background tasks panel shows long-dead Bash tasks as "Running"; survives app restart and manual stop.

Cross-ecosystem, same class (ghost/deleted schedule UI — cite, not primary):

- [openai/codex#39361](https://github.com/openai/codex/issues/39361) — deleted 15-minute automation reappears, creates repeated threads, consumes tokens
- [openai/codex#35378](https://github.com/openai/codex/issues/35378) — viewing a deleted automation renders an untitled scheduled-task card instead of not found
- [openai/codex#37140](https://github.com/openai/codex/issues/37140) — persistent Dock badge from orphaned scheduled-task unread IDs after Scheduled is empty
- [github/copilot-cli#3412](https://github.com/github/copilot-cli/issues/3412) — UI shows background agents as running after they have completed (`list_agents` empty)
- [github/copilot-cli#3514](https://github.com/github/copilot-cli/issues/3514) — `list_agents` empty while background agents still visibly running

Nearby / opposite poles (cite; do NOT build those products):

- [anthropics/claude-code#85838](https://github.com/anthropics/claude-code/issues/85838) — /loop silently runs once unless the model infers CronCreate (under-fire, not ghost Loop)
- [anthropics/claude-code#80679](https://github.com/anthropics/claude-code/issues/80679) — ScheduleWakeup one-shot vanishes before firing (opposite pole)
- [anthropics/claude-code#74736](https://github.com/anthropics/claude-code/issues/74736) — CronCreate recurring re-fires every 12-37s (over-fire)
- [anthropics/claude-code#86015](https://github.com/anthropics/claude-code/issues/86015) — Cron/loop never fires while background Bash is running
- [anthropics/claude-code#89248](https://github.com/anthropics/claude-code/issues/89248) — ScheduleWakeup/session cron go silent across compaction

Different UI: stationer's shop / cream laid paper / red-letter feast days / ruled manuscript columns / brass date-wheels / printed annual vs clerk's ledger / not-found stamps / ICS ghost-year strip. Vermilion, iron-gall, oxblood binding, antique brass, laid cream. Cormorant Garamond + Source Serif 4 + Courier Prime. NOT Voucher cashier stub-book, NOT Kindling hearth, NOT Deadband control-room, NOT Pawl ratchet, NOT Fusee clock dial, NOT Sounder telegraph, NOT Reveille muster.
Different idle: **dated**.

## Live catalog path

`/almanac/` is this static stationer's desk. Demo works with no secrets and no npm. Mark: `05:50 Sydney · almanac`.

1. Seeded `#90804` **looped** is already on the printed page: fired one-shot → CronList empty → CronDelete not-found → panel still Loop / Next 364d → **looped**. Never dated.
2. File **annual** — month/day with no year treated as next year's feast.
3. File **fired** — one-shot already ran at 10:40.
4. File **emptied** — CronList reports No scheduled jobs.
5. File **not-found** — CronDelete misses 1a6f1a3f and 92d0877f.
6. File **next-364d** — panel Next 364d 23h.
7. File **ends-3d** — Ends 3d matches neither delete nor 7-day expiry.
8. File **one-shot-lie** — recurring:false labeled Loop.
9. File **gazetted** — feast still printed after the clerk struck the ledger.
10. **Score** the feast page. Wrong stamps bind the vermilion. **Admit dated** unlocks only on the struck page. **Restore · #90804** shows the looped board. **Strike the feast** reconciles the printed page with the empty ledger.

## How to run (static)

Open `projects/almanac/index.html` in a browser, or serve the repo root and visit `/almanac/` (Vercel rewrite → `/projects/almanac`). No build step. Optional hook:

```bash
node projects/almanac/hook/index.mjs < projects/almanac/data/90804.jsonl
node --test projects/almanac/hook/almanac.test.mjs
```

`dated` (and `fresh`, the catalog equivalent) is true ONLY when the verdict is dated (idle, or honest control: fired+gone and the panel is not treated as a live Loop). Seeded 90804 numbers must produce looped / `dated=false` / `fresh=false` / alarm true.

## Hook

`projects/almanac/hook/` scores a probe `{ panelShowsLoop, cronListEmpty, cronDeleteNotFound, oneShotFired, recurring, next364d, ends3d }` and returns `{ verdict, reasons[], dated, fresh, alarm }`. See `hook/README.md`. Seed JSONL: `data/90804.jsonl`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90804](https://github.com/anthropics/claude-code/issues/90804) — OPEN, filed 2026-08-30T18:09:30Z. Labels: bug / platform:macos / area:agent-view. Claude Code 2.1.236 (Homebrew Cask), macOS Darwin 25.6.0 arm64. CronCreate with cron `40 10 30 8 *`, `recurring: false`, created 2026-08-30 10:38 local, before the 10:40 match. Job fired correctly at 10:40; output appeared in the conversation. CronList immediately after: "No scheduled jobs" (documented one-shot: fire once at next match, then auto-delete). Background Tasks panel (`/tasks`) still showed the same job labeled **Loop**, same cron, **Next 364d 23h**, **Ends 3d**. Happened for two separate one-shot jobs in the same session. Follow-up: CronDelete(id) on both ids after fire+empty list — `1a6f1a3f` and `92d0877f` — each returned "No scheduled job with id". Third independent signal (lookup-by-id, not a list enumeration) agreeing CronList is empty and disagreeing with the panel still showing at least one as an active recurring Loop.

Same-class: [#67293](https://github.com/anthropics/claude-code/issues/67293). Cross-ecosystem same class: [openai/codex#39361](https://github.com/openai/codex/issues/39361), [openai/codex#35378](https://github.com/openai/codex/issues/35378), [openai/codex#37140](https://github.com/openai/codex/issues/37140), [github/copilot-cli#3412](https://github.com/github/copilot-cli/issues/3412), [github/copilot-cli#3514](https://github.com/github/copilot-cli/issues/3514). Opposite poles: [#85838](https://github.com/anthropics/claude-code/issues/85838), [#80679](https://github.com/anthropics/claude-code/issues/80679), [#74736](https://github.com/anthropics/claude-code/issues/74736), [#86015](https://github.com/anthropics/claude-code/issues/86015), [#89248](https://github.com/anthropics/claude-code/issues/89248).

Ask: after a one-shot (`recurring: false`) fires and CronList confirms it is gone, the Background Tasks panel should also show it as complete/removed, not as an active recurring Loop with a far-future next-fire time.

## Env

| Variable | Meaning |
| --- | --- |
| `ALMANAC_SLACK_WEBHOOK` / `SLACK_WEBHOOK` | Unused at page runtime. Absent → honest demo. |
| `ALMANAC_GITHUB_TOKEN` / `GITHUB_TOKEN` | Unused at page runtime. Issue card fetches the public GitHub API. |
| `ALMANAC_LINEAR_KEY` / `LINEAR_API_KEY` | Unused at page runtime. |
| `ALMANAC_GITHUB_ISSUE` | Optional deep-link stub. |
| `ALMANAC_CATALOG_HOST` | Optional catalog host stub. |

Missing secrets stay in honest demo mode. The static page does not need them.

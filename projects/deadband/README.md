# Deadband

A control-room **instrumentation deadband** — cold teal/slate rack, phosphor scope, 0–5s time axis, content-blind ignore zone — for a real Claude Code defect: **silent `~/.claude/settings.json` data loss**. Two mechanisms: (1) full-file saves from a per-process in-memory settings cache; (2) settings file-watcher **time-only echo suppression** — discards any change event within **5000 ms** of Claude Code's own write by timestamp only, with **no content comparison**, plus debounce coalescing. An external legitimate writer (atomic rename) inside that window is masked; the cache diverges for the rest of a long-lived TUI/desktop session; the next `/model` or `/effort` save clobbers disk from the stale cache (drops foreign keys / resurrects deleted ones).

Primary: [anthropics/claude-code#90789](https://github.com/anthropics/claude-code/issues/90789) (OPEN, filed 2026-08-30T16:41:17Z). Title: Silent settings.json data loss: 5s time-only echo suppression masks external writes, stale per-process cache clobbers on next save. Labels: bug, has repro, platform:macos, area:core, data-loss. Env: CLI 2.1.240 (macOS, Bun-compiled) reproduced via `expect` + scratch `CLAUDE_CONFIG_DIR`; desktop embedded runtime 2.1.247 same save path by inspection.

A five-second blind ignore zone is not a hold. Score the suppress window or admit **fresh**.

Idle word: **fresh** (honest control: Phase 1 fresh cache preserves unknown keys; Phase 2 external edit 20s before write survives).
NEVER use fresh for a failure. NEVER use the product name or these prior idle words: engaged, stood, muted, liveried, penned, underwrit, plated, collated, unheard, passed, squared, bound, girt, sheltered, alongside, seated, credited, level, verbatim, fronted, locked, yanked, caught, posted, bunged, belayed, rove, keyed, housed, beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, heard, clear, paired, empty, mute, idle, silent, flat, kernel, valid, sealed, dry, intact, open, still, loose, even, quiet, cool, latched, upheld, sterling, home, and engaged.

Verdicts: **fresh**, **time-blind**, **content-aware**, **window-5s**, **cache-stale**, **foreign-dropped**, **key-resurrected**, **debounce-merge**, **full-stringify**, **atomic-rename**.

- **fresh** = idle / honest scope: Phase 1 cache preserves; Phase 2 edit outside the window survives
- **time-blind** = #90789 primary: watcher discards any change within 5000 ms of own write by timestamp only
- **content-aware** = contrast: hash the bytes just written; a different payload is not an echo
- **window-5s** = echo suppression is a five-second ignore zone on the time axis
- **cache-stale** = per-process cache diverges from disk for the rest of a long-lived session
- **foreign-dropped** = next `/model` or `/effort` save drops foreign keys from the stale cache
- **key-resurrected** = a later older cache restores deleted keys and reverts `/model`
- **debounce-merge** = multiple change events coalesce into a single (suppressed) event
- **full-stringify** = save writes `JSON.stringify(obj, null, 2)` from the cached object
- **atomic-rename** = external writer used write-temp + rename — still masked inside the window

The seeded #90789 board (Phase 3 edit ~2–3s after own write + time-only suppress + next-save clobber) is **time-blind**, never **fresh**. Unique nearby flags win their own seeds. Admit does not lie: a blind window stays blind.

## Why not a clone

Different problem: time-only echo suppression plus a stale per-process settings cache. The watcher *does* reload outside the window (Phase 2 survives). Inside 5000 ms, timestamp-only ignore plus debounce coalescing masks a content-different atomic rename; the next full-file save clobbers disk.

NOT **Palimpsest** ([#90725](https://github.com/anthropics/claude-code/issues/90725)) — PreToolUse `updatedInput` whole-replace.
NOT **Ullage** — silent context drop / prefix freeze.
NOT **Damper** — Remote Control auto-enable.
NOT **Quench** — hard kill fuse.
NOT **Hasp** — file lease.
NOT **Larder** — plugin store freeze.
NOT **Pawl** ([#90784](https://github.com/anthropics/claude-code/issues/90784)) — UserPromptSubmit stall after a duplicate `generate_session_title`.
NOT **Cenotaph** / **Fetch** / **Livery** / **Pinfold**.

Nearby-but-different (cite, do not treat as primary):

- [anthropics/claude-code#78321](https://github.com/anthropics/claude-code/issues/78321) — RMW race across sessions
- [anthropics/claude-code#84867](https://github.com/anthropics/claude-code/issues/84867) — plugin uninstall deletes unrelated keys
- [anthropics/claude-code#88113](https://github.com/anthropics/claude-code/issues/88113) — strip unknown hook keys
- [anthropics/claude-code#80770](https://github.com/anthropics/claude-code/issues/80770) — enabledPlugins disappear
- [anthropics/claude-code#86935](https://github.com/anthropics/claude-code/issues/86935) — watcher parent enumeration

Cross-ecosystem shape (same class of "config rewrite clobbers a second writer"):

- [openai/codex#36465](https://github.com/openai/codex/issues/36465) — Desktop overwrites config.toml / removes MCP servers
- [openai/codex#24515](https://github.com/openai/codex/issues/24515) — settings migration clobbers user config.toml

Different UI: instrumentation / process-control deadband desk / oscilloscope ignore zone / 0–5s time axis / content-blind vs content-aware suppress / cold teal-slate rack. Chakra Petch + Sora + IBM Plex Mono. NOT machine-shop ratchet (Pawl Archivo Black / walnut oil / amber CRT), NOT Portland-stone memorial (Cenotaph), NOT looking-glass parlor (Fetch), NOT household wardrobe (Livery), NOT village pound (Pinfold), NOT scriptorium (Palimpsest).
Different idle: **fresh**.

## Live catalog path

`/deadband/` is this static instrumentation desk. Demo works with no secrets and no npm. Mark: `02:50 Sydney · deadband`.

1. Seeded `#90789` **time-blind** is already on the scope: Phase 3 atomic-rename ~2–3s after own write + time-only 5000 ms suppress + next save drops the key → **time-blind**. Never fresh.
2. File **content-aware** — hash the bytes just written.
3. File **window-5s** — five-second ignore zone.
4. File **cache-stale** — per-process cache diverged.
5. File **foreign-dropped** — next save dropped foreign keys.
6. File **key-resurrected** — later older cache restored deleted keys / reverted `/model`.
7. File **debounce-merge** — events coalesced into one suppress.
8. File **full-stringify** — full-file write from cache.
9. File **atomic-rename** — polite external writer still masked.
10. **Score** the suppress window. Wrong stamps bind the sweep. **Admit fresh** unlocks only on the honest scope. **Restore · #90789** shows the Phase 3 board.

## How to run (static)

Open `projects/deadband/index.html` in a browser, or serve the repo root and visit `/deadband/` (Vercel rewrite → `/projects/deadband`). No build step. Optional hook:

```bash
node projects/deadband/hook/index.mjs < projects/deadband/data/90789.jsonl
node --test projects/deadband/hook/deadband.test.mjs
```

`fresh` is true ONLY when the verdict is fresh (idle, or honest control: Phase 1 fresh cache preserves; Phase 2 edit 20s before write survives). Seeded 90789 Phase 3 numbers must produce time-blind / `fresh=false` / alarm true.

## Hook

`projects/deadband/hook/` scores a probe `{ phase, timeOnlySuppress, contentCompare, echoWindowMs, externalEditDeltaMs, suppressed, reloaded, nextSaveClobber, cacheFresh, cacheStale, foreignKeysDropped, deletedKeysResurrected, fullStringify, atomicRename, debounceCoalesce }` and returns `{ verdict, reasons[], fresh, alarm }`. See `hook/README.md`. Seed JSONL: `data/90789.jsonl`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90789](https://github.com/anthropics/claude-code/issues/90789) — OPEN, filed 2026-08-30T16:41:17Z. CLI 2.1.240 experimental repro; desktop 2.1.247 same save path. Deterministic 3-phase: Phase 1 fresh cache preserves; Phase 2 edit 20s before write survives; Phase 3 identical edit ~2–3s after Claude write is dropped on next save. Real-world: TUI + desktop + hook registrar; `/model` dropped `outputStyle` / `minimumVersion` / `editorMode` / `inputNeededNotifEnabled`; a later older cache resurrected them and reverted `/model`.

Nearby (cite, not primary): [#78321](https://github.com/anthropics/claude-code/issues/78321), [#84867](https://github.com/anthropics/claude-code/issues/84867), [#88113](https://github.com/anthropics/claude-code/issues/88113), [#80770](https://github.com/anthropics/claude-code/issues/80770), [#86935](https://github.com/anthropics/claude-code/issues/86935). Cross-ecosystem: [openai/codex#36465](https://github.com/openai/codex/issues/36465), [openai/codex#24515](https://github.com/openai/codex/issues/24515).

Ask: decide "is this my own echo?" by content (hash the bytes just written), or re-read and merge from disk at save time — or both.

## Env

| Variable | Meaning |
| --- | --- |
| `DEADBAND_SLACK_WEBHOOK` / `SLACK_WEBHOOK` | Unused at page runtime. Absent → honest demo. |
| `DEADBAND_GITHUB_TOKEN` / `GITHUB_TOKEN` | Unused at page runtime. |
| `DEADBAND_LINEAR_KEY` / `LINEAR_API_KEY` | Unused at page runtime. |
| `DEADBAND_GITHUB_ISSUE` | Optional deep-link stub. |
| `DEADBAND_CATALOG_HOST` | Optional catalog host stub. |

Missing secrets stay in honest demo mode. The static page does not need them.

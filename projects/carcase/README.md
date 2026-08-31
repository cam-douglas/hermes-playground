# Carcase

A **cabinetmaker's carcase / joinery bench** — oak box on the bench, brass pulls, empty cubbies with cream slips, iron hardware, oil-stained worktop — for a real Claude Code Desktop defect: **a stealth update restart restores the window and session cards but kills the CLI child processes behind them**.

Primary:

- [anthropics/claude-code#90867](https://github.com/anthropics/claude-code/issues/90867) (OPEN, filed 2026-08-31T01:47:30Z by wshallwshall). Title: Desktop update restart kills running Claude Code sessions: the stealth relaunch restores the window but not the sessions. Labels: bug, has repro, platform:windows, area:desktop. Split from umbrella #90172 as defect 1 of eight. Env: Claude Desktop **1.37937.3** (bundled CLI **2.1.246**); Windows 11 Pro **10.0.26200** x64.

A gutted carcase is not a hold. Score the drawers or admit **fitted**.

Idle word: **fitted**. Seeded state: **gutted** / #90867 — stealth relaunch restored chrome, processes gone. Never idle as "carcase" / "cabinet" / "drawer" / "update" / "window".

- **fitted** = hold: drawers in, CLI children still running, sessions actually resume
- **gutted** = #90867 primary — stealth relaunch restored chrome, processes gone
- **hollow** = box present, interiors empty
- **stealth-killed** = `[stealth-relaunch]` / `local-session-stop-all` killed live PTYs
- **chrome-only** = window + 50 nav entries restored, zero sessions restarted
- **unconsented** = restart without user action (#90870 nearby)
- **emptied** = nine sessions killed in one second
- **dummy** = cards look healthy, send fails `computer_unreachable`
- **occupied** = tally of live local processes behind the cards (hold chip)
- **restored-nav** = nav-restore marker, 50 entries, 0 sessions

Verdicts: fitted, gutted, hollow, stealth-killed, chrome-only, unconsented, emptied, dummy, occupied, restored-nav.

## Why not a clone

This is specifically: **STEALTH CONTINUITY LIE**. The carcase (window, 50 nav entries, sidebar cards) is back on the bench. Every drawer is empty (CLI children killed). The user has no signal that the organs left the box.

NOT **Kindling** ([#90798](https://github.com/anthropics/claude-code/issues/90798)) — WarmLifecycle *mints* throwaway unused sessions on focus switch. This *kills* live ones and fakes continuity.
NOT **Scion** ([#90815](https://github.com/anthropics/claude-code/issues/90815)) — empty bridged fork at spawn time, not a stealth kill of existing sessions.
NOT **Cenotaph** ([#90771](https://github.com/anthropics/claude-code/issues/90771)) — orphaned advisor_tool_result JSONL pairing / vacant monument, not window restore.
NOT **Limpet** — processes linger after end_turn (opposite).
NOT **Sounder** — missed wakeup.
NOT **Bollard** — RC env orphan after supervisor gap.
NOT **Callboard** — pre-session skill autocomplete.
NOT **Leaven** — bootstrap contamination.
NOT **Hydra** — marketplace dual-ledger resurrection.
NOT a taxidermy **Manikin** — joinery (fitted vs gutted), not a death-empty hide.

Stay off leftover millimetre sliders and woodworking leftovers that are not this cabinet carcase.

Different UI: cabinetmaker's bench — oak carcase, brass pulls, empty cubbies with cream slips, iron corners, oil-stained worktop. Fonts: Libre Baskerville + Atkinson Hyperlegible + Red Hat Mono (NOT Instrument Serif / Nunito / Spline from the abandoned Manikin sketch, NOT Playfair / DM Sans / IBM Plex Mono from Callboard, NOT Newsreader / Karla from Leaven, NOT Cormorant from Ordo, NOT Fraunces, NOT Teko). Palette: oak #c4a574, bench #3d2a18, empty-cubby #1a1410, slip-cream #f3ead7, brass-pull #b08d57, iron #2c241c, hold-sap #6f8f5a. NOT hide/bone/glass-eye. NOT stage-black/crimson. NOT bakery maple. NOT marble.

Different idle: **fitted**.

## Live catalog path

`/carcase/` is this static joinery bench. Demo works with no secrets and no npm. Mark: `11:50 Sydney · carcase`.

1. Seeded demo loads **gutted** (#90867 — stealth relaunch restored chrome, processes gone).
2. Admit fitted → drawers in, CLI children still running.
3. Chip-switch seeds: gutted / fitted / hollow / stealth-killed / chrome-only / unconsented / emptied / dummy / occupied / restored-nav.
4. Paste or edit a probe ticket JSON and score the drawers.
5. Export a probe ticket.

## How to score

Open `projects/carcase/index.html` in a browser, or serve the repo root and visit `/carcase/` (Vercel rewrite → `/projects/carcase`). No build step. Optional hook:

```bash
node projects/carcase/hook/carcase.mjs < projects/carcase/data/90867.json
node projects/carcase/hook/carcase.mjs projects/carcase/data/fitted.json
node --test projects/carcase/hook/carcase.test.mjs
```

Gutted seed → gutted/alarm. Fitted seed → fitted/hold.

`projects/carcase/hook/carcase.mjs` scores a probe ticket `{ stealthRelaunch, navRestored, navEntryCount, sessionsKilled, processesRestarted, cardsHealthy, bannerUnreachable, machineAwake, transcriptPresent, beforeFirstTurn, userConsented }` and returns `{ verdict, chips[], reasons[], fitted, gutted, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/90867.json`, `data/fitted.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`. Evidence only from issue facts.

## Native integrations

1. Live fetch `https://api.github.com/repos/anthropics/claude-code/issues/90867`. Unauthenticated. See `.env.example`.
2. Local seed JSON under `data/`.
3. Hook CLI: `node projects/carcase/hook/carcase.mjs`.
4. Slack / Linear adapters are honest demo rows when no secrets are present.

## Sources

- [anthropics/claude-code#90867](https://github.com/anthropics/claude-code/issues/90867) OPEN
- Same-class (cite, not primary): [#90874](https://github.com/anthropics/claude-code/issues/90874) borrowed `computer_unreachable` taxonomy; [openai/codex#40969](https://github.com/openai/codex/issues/40969) auto-update force-kills after a 60s drain
- Umbrella [#90172](https://github.com/anthropics/claude-code/issues/90172) — jalalAzhmatkhan: “It's showing ‘Can't reach your computer’ error while it's ALREADY RUNNING IN my computer.”
- Nearby: #90868–#90873, #86556, #90864, #77871
- Opposite: Kindling #90798; [openai/codex#41039](https://github.com/openai/codex/issues/41039) Install-on-Quit

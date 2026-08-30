# Hydra

A **marble / bronze registry hydra desk** — Carrara hall, bronze hydra fountain, twin ledgers (`settings.json` vs `known_marketplaces.json`), sealing wax, ink wells, clone shelf — for a real Claude Code defect: **removing a marketplace from `~/.claude/settings.json` `extraKnownMarketplaces` looks successful (entry gone; clone under `~/.claude/plugins/marketplaces/<name>/` deleted), then ~1 minute later `~/.claude/plugins/known_marketplaces.json` silently re-registers the marketplace and recreates the clone**. No error. No log. The standard "remove and re-add" remedy becomes ineffective; re-add then says "already added".

Primary:

- [anthropics/claude-code#90856](https://github.com/anthropics/claude-code/issues/90856) (OPEN, filed 2026-08-30T22:50:05Z). Title: Removing a marketplace from settings.json is silently reverted by known_marketplaces.json. Labels: bug, has repro, platform:macos, area:plugins. Author adamjsimon. Claude Code **2.1.247** inside Claude Desktop, **macOS 26.4.1**. Observed three removals in one session (A/B ~18:02→18:03; C 18:12→18:17, clone recreated **18:17:36**). What works: delete from `known_marketplaces.json` AND remove the clone.

A settings cut that regrows from the known ledger is not a hold. Score both ledgers or admit **cauterized**.

Idle word: **cauterized**. Seeded state: **regrown** / #90856 — removed from settings, known_marketplaces brought it back ~1 min later with clone recreated. Never idle as "hydra".

- **cauterized** = hold: gone from settings AND known AND clone absent
- **regrown** = #90856 primary failure
- **re-cloned / clone-back** = clone directory recreated
- **dual-ledger** = two stores disagree
- **settings-only** = user edited only settings.json
- **known-authoritative** = known_marketplaces silently wins
- **silent-return** = no error/log when it returns
- **already-added** = re-add reports already present
- **minute-later** = ~1 minute resurrection window

Verdicts: cauterized, regrown, re-cloned, dual-ledger, settings-only, known-authoritative, silent-return, already-added, minute-later, clone-back.

Seed-chip aliases: lopped → settings-only; dual → dual-ledger; recloned → re-cloned; shadowed → known-authoritative.

## Why not a clone

This is specifically: **dual-ledger authority**. A settings removal is undone by `known_marketplaces.json`.

NOT **Larder** — plugin-store content freeze while the sync stamp advances (healthy clock, empty shelf). Hydra is dual-ledger authority: settings removal undone by known_marketplaces.
NOT **Deadband** ([#90789](https://github.com/anthropics/claude-code/issues/90789)) — settings.json watcher 5s time-only echo suppression + stale cache clobber. Hydra is marketplace registry resurrection, not generic settings write races.
NOT **Ordo** — headless plugin slash commands fail with exit 0.
NOT **Limpet** ([#89275](https://github.com/anthropics/claude-code/issues/89275)) — OS process leak after scheduled end_turn.
NOT **Scion** ([#90815](https://github.com/anthropics/claude-code/issues/90815)) — empty bridged fork.
NOT **Almanac** ([#90804](https://github.com/anthropics/claude-code/issues/90804)) — one-shot Loop ghost on Background Tasks.

Stay off Voucher / Kindling / Pawl / Cenotaph / Fetch / Livery / Pinfold / Palimpsest / Escutcheon / Lacuna / Ambo / Slype / Tally / Pale / Chatelaine problems and UI metaphors.

Different UI: marble registry hall / bronze hydra fountain / twin ledgers / sealing wax / ink wells / clone shelf. Palette: Carrara marble, bronze-green patina, registry ink black, sealing-wax vermilion alarm, parchment cream. Fonts: Libre Baskerville + DM Sans + JetBrains Mono. NOT millimetre sliders. NOT woodworking leftover. NOT tide-pool / orchard / feast-page / cashier / hearth / zinc-larder / phosphor-deadband clones.

## Live catalog path

`/hydra/` is this static registry desk. Demo works with no secrets and no npm. Mark: `08:50 Sydney · hydra`.

1. Seeded demo loads **regrown** (#90856 — removed from settings, known_marketplaces brought it back ~1 min later with clone recreated).
2. Seal both ledgers → **cauterized** (gone from settings AND known AND clone absent).
3. Chip-switch seeds: regrown / cauterized / lopped / dual / recloned / shadowed / silent-return / already-added / minute-later / clone-back.
4. Paste or edit a registry ticket JSON and score the hall.
5. Export a registry ticket.

## How to score

Open `projects/hydra/index.html` in a browser, or serve the repo root and visit `/hydra/` (Vercel rewrite → `/projects/hydra`). No build step. Optional hook:

```bash
node projects/hydra/hook/hydra.mjs < projects/hydra/data/90856.json
node projects/hydra/hook/hydra.mjs projects/hydra/data/cauterized.json
node --test projects/hydra/hook/hydra.test.mjs
```

Regrown seed → regrown/alarm. Cauterized seed → cauterized/hold.

`projects/hydra/hook/hydra.mjs` scores a registry ticket `{ removedFromSettings, presentInKnown, cloneExists, minutesSinceRemoval, reAddReportsAlreadyAdded, knownLastUpdated, settingsHadEntry }` and returns `{ verdict, chips[], reasons[], cauterized, regrown, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/90856.json`, `data/cauterized.json`, `data/fingerprints.json`, `data/chips.json`. Numbers from the issue only.

## Native integrations

1. Live fetch `https://api.github.com/repos/anthropics/claude-code/issues/90856`. Unauthenticated. See `.env.example`.
2. Local seed JSON under `data/`.
3. Hook CLI: `node projects/hydra/hook/hydra.mjs`.
4. Slack / Linear adapters are honest demo rows when no secrets are present.

## Sources

- [anthropics/claude-code#90856](https://github.com/anthropics/claude-code/issues/90856) OPEN
- Same-class corroborators (cite on the desk, not as primary): [#83704](https://github.com/anthropics/claude-code/issues/83704), [#87206](https://github.com/anthropics/claude-code/issues/87206), [#82064](https://github.com/anthropics/claude-code/issues/82064), [#77937](https://github.com/anthropics/claude-code/issues/77937), [#87778](https://github.com/anthropics/claude-code/issues/87778), [#86428](https://github.com/anthropics/claude-code/issues/86428), [#87651](https://github.com/anthropics/claude-code/issues/87651)
- Same-class Codex registry/disk dual-state (cite only): [openai/codex#39332](https://github.com/openai/codex/issues/39332), [#39421](https://github.com/openai/codex/issues/39421), [#32058](https://github.com/openai/codex/issues/32058)

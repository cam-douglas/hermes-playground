# Carillon

A **peal-board / carillon-console / belfry** — oak beams, bronze bells, red/white sally ropes, cream painted peal-board with gold names, candlelight; Playfair Display + Source Serif 4 + IBM Plex Mono — for a real Claude Code defect: **only one plugin SessionStart hook executes when multiple are registered**. First-registered wins. The rest are dropped with no error. `/reload-plugins` and `/hooks` still count every hook. `settings.json` SessionStart hooks are fine.

Primary:

- [anthropics/claude-code#91250](https://github.com/anthropics/claude-code/issues/91250) (OPEN, bug, has repro, platform:windows, area:hooks, regression, area:plugins, filed 2026-09-01T15:19:35Z). Title: Only one SessionStart hook executes when multiple are registered. Claude Code 2.1.252, Windows, Windows Terminal. Reporter thoeltig.

A peal that registers three bells and strikes one is not a hold. Score the peal or admit **pealed**.

Idle word: **pealed**. Seeded state: **first-wins** / #91250 — `/hooks` counts 3 plugins, only the first peals; 1 struck + 2 muted; no error. Never idle as first-wins / drained / pooled / warded / squatted / stationed / displaced / hung / marvered / unpinned / shed / sealed / rinsed / vacant / postern / sluice.

A **carillon** is a keyed bell instrument. The peal board records who rang. Lit = registered. Strike = dispatched. Muted = first-wins drop. Score whether the peal is **pealed** (every registered settings bell strikes; board 3/3) vs **first-wins** (registry N, peal 1).

- **first-wins** = #91250: three plugins contribute SessionStart; whichever is registered first wins; the rest are dropped
- **registered-not-pealed** = `/hooks` count ≠ dispatched peal count
- **settings-all-fire** = settings.json three SessionStart handlers all ran and delivered additionalContext
- **plugin-only-drop** = the problem is specific to plugin-contributed hooks
- **silent-no-error** = the other never executes and no error was logged
- **hooks-count-lies** = `/hooks` counts all hooks; dispatch does not
- **reload-plugins-ok** = `/reload-plugins` counts all hooks; registration looks healthy
- **additionalContext-one** = only one hook's context arrives; the other leaves no transcript entry
- **regression-216** = v2.1.216 – v2.1.252 (18 versions, 85 sessions, never more than one)
- **hold** = all hooks fire (working range up to v2.1.198, multiple plugin SessionStart, up to 4)
- **pealed** = HOLD: settings.json three SessionStart handlers all fire; board 3/3

Verdicts: pealed, first-wins, registered-not-pealed, settings-all-fire, plugin-only-drop, silent-no-error, hooks-count-lies, reload-plugins-ok, additionalContext-one, regression-216, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the peal is pealed or first-wins.

Hypothesis only (NON-BINDING): treat this as first-wins dispatch on plugin SessionStart (registry N, peal 1). Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **PLUGIN SESSIONSTART FIRST-WINS DISPATCH — REGISTRY COUNTS EVERY HOOK, PEAL STRIKES ONE. settings.json SessionStart hooks fire. Plugin-contributed SessionStart hooks of the same shape (no matcher key) drop after the first-registered. No error.**

NOT **Callboard** ([#90858](https://github.com/anthropics/claude-code/issues/90858)) — skills roster / callboard.
NOT **Pale** / **Ambo** / **Tappet** / **Pawl** — terminalSequence / cwd-not-repo-root hooks.
NOT **Postern** ([#91223](https://github.com/anthropics/claude-code/issues/91223)) — socket-dir squat / night bailey.
NOT **Sluice** ([#91265](https://github.com/anthropics/claude-code/issues/91265)) — Cowork Toke/File/SeAt millrace.
NOT **Alidade** ([#91055](https://github.com/anthropics/claude-code/issues/91055)).
NOT **Parison** ([#91037](https://github.com/anthropics/claude-code/issues/91037)).
NOT **Cockade** ([#91033](https://github.com/anthropics/claude-code/issues/91033)).
NOT **Lye** ([#91020](https://github.com/anthropics/claude-code/issues/91020)).
NOT **Limpet** ([#89275](https://github.com/anthropics/claude-code/issues/89275)).
NOT **Quench** — token-spend fuse.
NOT **Bulla** ([#90891](https://github.com/anthropics/claude-code/issues/90891)).
NOT leftover woodworking / mm-slider.
Product name stays **Carillon**. Do not rename to Peal, Belfry, Campanile, Change, Sally, Treble, Tenor, Clapper, Bellcote.

Different UI: oak belfry / bronze bells / red-white sally ropes / cream peal-board / gold names / candlelight. Playfair Display + Source Serif 4 + IBM Plex Mono. NOT Cinzel/Literata/Inconsolata (Postern). NOT Fraunces/Source Sans 3 (Sluice). NOT Libre Caslon/Public Sans (Alidade). NOT EB Garamond (Parison). NOT milliner scripts. NOT Cormorant (Bulla). NOT a leftover woodworking instrument. NOT a millimeter-slider.

Different verbs: score the peal, pin idle pealed, pin seeded first-wins, admit pealed, load fixtures, reset to pealed. Not "Score the race/peg/gather/brim/vat/postern".

Different idle: **pealed**.

## Live catalog path

`/carillon/` is this static peal board. Path `https://hermes-playground-green.vercel.app/carillon/` and subdomain `https://carillon.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `04:50 / hermes catalog #105 / #91250`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **pealed** — settings.json three SessionStart handlers all fire; board 3/3; candle steady.
2. Seed **first-wins** → #91250: `/hooks` counts 3 plugins, only first peals; 1 struck + 2 muted; candle gutters.
3. Peal-board UI: registered vs pealed bells. Lit = registered. Strike = dispatched. Muted = first-wins drop.
4. Cousin cite strip labeled cousin-not-primary: claude-code [#88086](https://github.com/anthropics/claude-code/issues/88086) / [#88650](https://github.com/anthropics/claude-code/issues/88650) / [#83643](https://github.com/anthropics/claude-code/issues/83643) / [#75972](https://github.com/anthropics/claude-code/issues/75972) / [#76297](https://github.com/anthropics/claude-code/issues/76297) / [#78455](https://github.com/anthropics/claude-code/issues/78455) / [#10373](https://github.com/anthropics/claude-code/issues/10373); openai/codex [codex#39895](https://github.com/openai/codex/issues/39895) / [codex#42079](https://github.com/openai/codex/issues/42079) / [codex#34321](https://github.com/openai/codex/issues/34321). Cite only. Primary stays #91250.
5. Version timeline plaque: 2.1.198 working vs 2.1.216–252 broken (18 versions / 85 sessions / never more than one).
6. **Score the peal** walks the probe ticket and lights chips on the board. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/carillon/index.html` in a browser, or serve the repo root and visit `/carillon/` (Vercel rewrite → `/projects/carillon`). No build step. Optional hook:

```bash
node projects/carillon/hook/carillon.mjs projects/carillon/data/91250.json
node projects/carillon/hook/carillon.mjs projects/carillon/data/pealed.json
node --test projects/carillon/hook/carillon.test.mjs
```

First-wins seed → first-wins/alarm. Pealed seed → pealed/hold.

`projects/carillon/hook/carillon.mjs` classifies a probe ticket JSON `{ pluginSessionStartRegistered, pluginSessionStartDispatched, settingsSessionStartRegistered, settingsSessionStartDispatched, hooksCount, additionalContextDelivered, matcherPresent, errorLogged, reloadPluginsCountsAll, claudeVersion }` and returns `{ verdict, chips[], reasons[], pealed, firstWins, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91250.json`, `data/first-wins.json`, `data/pealed.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`. Evidence only from issue facts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91250](https://github.com/anthropics/claude-code/issues/91250). Unauthenticated. Title, state, labels — not a cookbook. Cousins cited on the ledger, not primaries. See `.env.example`.
2. Paste/drop a probe ticket JSON and score it.
3. Peal-board UI (registered vs pealed bells). Lit = registered, strike = dispatched, muted = first-wins drop.
4. Cousin-not-primary cite strip including Codex #39895 (root plugin.json silently disables hooks).
5. Version timeline plaque: 2.1.198 working vs 2.1.216–252 broken (18 versions / 85 sessions / never more than one).

## Sources

- [anthropics/claude-code#91250](https://github.com/anthropics/claude-code/issues/91250) OPEN — primary. Product stays Carillon.
- Cousins (cite, not primaries) — claude-code SessionStart / plugin hooks:
  - [#88086](https://github.com/anthropics/claude-code/issues/88086) OPEN — VS Code extension: SessionStart plugin hook additionalContext logged as succeeded but never injected into model context.
  - [#88650](https://github.com/anthropics/claude-code/issues/88650) OPEN — Plugin hooks load additively from both plugin.json and hooks/hooks.json, contradicting docs (2.1.159).
  - [#83643](https://github.com/anthropics/claude-code/issues/83643) OPEN — Desktop remote sessions: plugin sync omits hooks/, so plugin hooks never fire.
  - [#75972](https://github.com/anthropics/claude-code/issues/75972) OPEN — Plugin-sourced hooks.json never fires, even though the plugin shows installed + enabled.
  - [#76297](https://github.com/anthropics/claude-code/issues/76297) OPEN — Identical hook commands in settings and a plugin's hooks.json are not deduplicated.
  - [#78455](https://github.com/anthropics/claude-code/issues/78455) OPEN — SessionStart hooks fire for phantom sessions that never materialize.
  - [#10373](https://github.com/anthropics/claude-code/issues/10373) OPEN — SessionStart hooks not working for new conversations.
- Cousins (cite, not primaries) — openai/codex plugin/hooks silence:
  - [openai/codex#39895](https://github.com/openai/codex/issues/39895) OPEN — A root plugin.json silently disables all of a plugin's hooks.
  - [openai/codex#42079](https://github.com/openai/codex/issues/42079) OPEN — Codex Desktop receives MCP startup failures but silently omits plugin tools.
  - [openai/codex#34321](https://github.com/openai/codex/issues/34321) OPEN — plugin list reports installed, enabled when the cache payload is missing.

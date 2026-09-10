# Cognate

A **comparative philology / manuscript cognate desk** — parchment folios, ink indigo lemmas, ochre gloss marks, a soft lamp. Fonts **Fraunces** (display) + **Source Sans 3** (body) + **IBM Plex Mono** (mono). Palette: parchment, ink indigo, ochre gloss, soft lamp — for a real Claude Code defect: **PLUGIN MCP SERVERS: `${PLUGIN_ROOT}` PLACEHOLDER NOT EXPANDED (AGENT PLUGINS SPEC NON-CONFORMANCE).**

Primary:

- [anthropics/claude-code#93250](https://github.com/anthropics/claude-code/issues/93250) (OPEN, bug, area:mcp, area:plugins). Title: `Plugin MCP servers: ${PLUGIN_ROOT} placeholder not expanded (Agent Plugins spec non-conformance)`. Claude Code 2.1.260. Filed by joshyim 2026-09-10. Agent Plugins spec v1.1.0 §9.1/§9.2 requires hosts to provide `PLUGIN_ROOT` / `PLUGIN_DATA` and expand `${PLUGIN_ROOT}` / `${PLUGIN_DATA}` in MCP server `args`, `env`, and `cwd`. Claude Code only expands `${CLAUDE_PLUGIN_ROOT}` (and related `CLAUDE_`-prefixed variants). Binary allowlist regex observed in the issue: `^\$\{CLAUDE_(?:PROJECT_DIR|PLUGIN_ROOT|PLUGIN_DATA)\}$`. Spec-standard `${PLUGIN_ROOT}` is passed literally to `node` → `MODULE_NOT_FOUND` → `CONNECTION_CLOSED` at session startup, with no hint that placeholders failed to expand. Workaround in the issue: relative `./dist/index.js` with omitted `cwd`.

14:50 cognate: a comparative philology / manuscript cognate-desk booth that should keep `${PLUGIN_ROOT}` **expanded** (spec-standard alias expands like `${CLAUDE_PLUGIN_ROOT}`; args/env/cwd resolve to the install path; session starts connected); instead the host only matches the Claude-prefixed dialect, leaves the standard cognate **literal**, and the MCP child gets `${PLUGIN_ROOT}/dist/index.js` verbatim → MODULE_NOT_FOUND / CONNECTION_CLOSED (#93250). Score cognate or admit expanded.

Score cognate or admit expanded.

Idle word: **expanded** (HOLD: spec + Claude aliases both expand). Seeded word: **cognate** / #93250 (spec-standard `${PLUGIN_ROOT}` left literal). Path word: **literal**. Never idle laid / lemures / remanent / released / escheat / stale / freehold / mortmain / phantom / trunked / strowger / exchanged / tokenized / mondegreen / parsed / locked / scratched / derby / unmasked / vizard / precedence / carrier / moored / scuttled / open / seated / stopcock / preserved / discarded / cleared / mounded / distinct / held / raised / fallen / primed / flashed / greenroomed / scaffold / stereotype / parergon / lacuna / hangfire / afterimage / remora / quieted / unrung / latent / flushed / collated / stereotyped / deadair / squelch / scuttle / fresh / stamped / conflated / steered / vernier / slider.

Phrase: **when the host leaves the spec-standard ${PLUGIN_ROOT} cognate literal instead of expanded, score cognate or admit expanded.**

- **expanded** = IDLE: HOLD; spec + Claude aliases both expand; args/env/cwd resolve to the install path
- **cognate** = #93250 seeded path: spec-standard `${PLUGIN_ROOT}` left literal; MODULE_NOT_FOUND / CONNECTION_CLOSED
- **literal** = path word: unexpanded placeholder string on the wire
- **hold** = HOLD alias for idle expanded
- **spec-alias** = Agent Plugins spec v1.1.0 §9.1/§9.2 `${PLUGIN_ROOT}` / `${PLUGIN_DATA}`
- **claude-dialect** = host only expands `${CLAUDE_PLUGIN_ROOT}` and related `CLAUDE_`-prefixed variants
- **allowlist** = observed regex `^\$\{CLAUDE_(?:PROJECT_DIR|PLUGIN_ROOT|PLUGIN_DATA)\}$`
- **unexpanded** = spec cognate is forwarded as the literal string
- **module-not-found** = `node` cannot resolve `${PLUGIN_ROOT}/dist/index.js`
- **connection-closed** = MCP child dies at session startup
- **no-hint** = error gives no hint that placeholders failed to expand
- **relative-workaround** = `./dist/index.js` with omitted `cwd` (both default cwd to plugin root)
- **has-repro** = mcp.json `${PLUGIN_ROOT}` → CLAUDE_* allowlist → literal arg → MODULE_NOT_FOUND
- **cousins** = cite-only #93057 #79889 #78963 #13452 — do not rebuild
- **backups** = cite-only #93219 #93207 #93239 #93259 #93257 — do not auto-pick as primary
- **fixtures** = row list for the cognate booth
- **walk** = published idle expanded → spec-alias → claude-dialect → allowlist → unexpanded → literal-args → module-not-found → connection-closed → no-hint → cognate → literal

Verdicts: expanded, cognate, literal, hold, spec-alias, claude-dialect, allowlist, unexpanded, module-not-found, connection-closed, no-hint, relative-workaround, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring cognate desk. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the lemma is **cognate** or already **expanded**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the placeholder expander allowlists only `CLAUDE_*` forms, so spec-standard `${PLUGIN_ROOT}` never matches and is forwarded literal. Invite verify against #93250 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93250](https://github.com/anthropics/claude-code/issues/93250)
- Cite-only cousin: [anthropics/claude-code#93057](https://github.com/anthropics/claude-code/issues/93057) (`CLAUDE_PLUGIN_ROOT` unset in agent Bash env / wrong source-dir in hooks for string-source marketplace plugins — different defect: prefixed var missing or wrong, not unexpanded spec alias)
- Cite-only cousins: Hookify `CLAUDE_PLUGIN_ROOT` import issues (#79889, #78963, #13452) — different shape
- Backup (data only): [anthropics/claude-code#93219](https://github.com/anthropics/claude-code/issues/93219) (Vernier — effort slider inert — millimeter-slider leftover, forbidden as primary)
- Backup (data only): [anthropics/claude-code#93207](https://github.com/anthropics/claude-code/issues/93207) (iOS plan approval setMode auto)
- Backup (data only): [anthropics/claude-code#93239](https://github.com/anthropics/claude-code/issues/93239) (Enter interrupts instead of queueing)
- Backup (data only): [anthropics/claude-code#93259](https://github.com/anthropics/claude-code/issues/93259) (archive_session pin refusal message collapse)
- Backup (data only): [anthropics/claude-code#93257](https://github.com/anthropics/claude-code/issues/93257) (agents auto-update relaunch drops bypass flags)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, area:mcp, area:plugins
- Claude Code 2.1.260
- Agent Plugins spec v1.1.0 §9.1 — hosts MUST provide `PLUGIN_ROOT` and `PLUGIN_DATA` as environment variables
- Agent Plugins spec v1.1.0 §9.2 — hosts MUST expand `${PLUGIN_ROOT}` and `${PLUGIN_DATA}` in `args`, `env`, and `cwd`
- Claude Code only expands `${CLAUDE_PLUGIN_ROOT}` (and related `CLAUDE_`-prefixed variants)
- Allowlist regex observed: `^\$\{CLAUDE_(?:PROJECT_DIR|PLUGIN_ROOT|PLUGIN_DATA)\}$`
- Spec-standard `${PLUGIN_ROOT}` in plugin `mcp.json` is passed literally to `node`
- Result: `MODULE_NOT_FOUND` → `CONNECTION_CLOSED` at session startup
- No hint that placeholders failed to expand
- Workaround: relative `./dist/index.js` with omitted `cwd` (both default cwd to plugin root)
- Expected: expand spec-standard `${PLUGIN_ROOT}` / `${PLUGIN_DATA}` in addition to (or as aliases of) the Claude-prefixed variants

Problem found: WHEN THE HOST LEAVES THE SPEC-STANDARD `${PLUGIN_ROOT}` COGNATE LITERAL INSTEAD OF EXPANDED.

Why this solution: a diagnostic comparative philology / manuscript cognate desk for the expanded → cognate drift, so a reader can pin idle expanded, load the #93250 cognate path, and score literal / allowlist / module-not-found against the published facts. Conceptual folio comparison, ochre gloss, and a lamp show whether the lemma was expanded. No live Claude session is required.

## Why not a clone

This is specifically: **PLUGIN MCP SERVERS: `${PLUGIN_ROOT}` PLACEHOLDER NOT EXPANDED (AGENT PLUGINS SPEC NON-CONFORMANCE).**

**NOT Lemures/#93256** (mid-turn task-summary classifier keeps previous `latestAsk` across `/clear`). Different defect.

**NOT Escheat/#93231** (VS Code window-close leaves git worktree `locked` naming a dead PID). Different defect.

**NOT Mortmain/#93173** (sandbox `denyWithinAllow` freezes tracked `.claude` paths). Different defect.

**NOT Strowger/#93218** (Desktop `--disallowedTools SendMessage` while ListAgents still lists). Different paradigm.

**NOT Mondegreen/#93193** (worktree Bash substring `git`). Different paradigm.

**NOT Derby/#93197.** **NOT Vizard/#93190.** **NOT Dead Air.** **NOT Scuttle.** **NOT Stopcock.** **NOT Parergon.** **NOT Stereotype.** **NOT Midden.** **NOT Afterimage.** **NOT Mirage.** **NOT Ephemera.** **NOT Palimpsest.** **NOT Recension.** **NOT Quietus.** **NOT Calque.** **NOT Sigil.** **NOT Caret.**

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **spec-standard `${PLUGIN_ROOT}` left literal because the host allowlists only `CLAUDE_*` placeholder forms** — unused in catalog as this cognate / folio walk.

Do NOT rename this product Lemures, Escheat, Mortmain, Strowger, Mondegreen, Calque, Sigil, Caret, Afterimage, Mirage, Ephemera, Palimpsest, Recension, Quietus, or any existing catalog slug.
Do NOT reuse idle expanded / cognate / literal on a later booth.
Do NOT reuse Libre Baskerville + Red Hat Text + JetBrains Mono (Lemures). Do NOT reuse Cardo + Figtree + Fragment Mono (Escheat). Do NOT reuse Cinzel (Mortmain). Do NOT reuse Syne + Karla (Strowger). Do NOT reuse Cormorant Garamond + Outfit + Space Mono (Mondegreen). Display here is **Fraunces**. Body is **Source Sans 3**. Mono is **IBM Plex Mono**.

Different surface: unexpanded spec-standard MCP placeholder vs remanent classifier latestAsk / window-close worktree lock leftover / sandbox `denyWithinAllow` / Desktop `--disallowedTools SendMessage` / isolation:worktree substring `git`.

Product name stays **Cognate**. Name/slug `cognate` unused in catalog.json (261 products before this ship; Lemures is #261).

Different UI: comparative philology / manuscript cognate desk / parchment folios / ink indigo lemmas / ochre gloss marks / soft lamp. Fraunces / Source Sans 3 / IBM Plex Mono. NOT Roman Lemuria night courtyard / black beans / bronze cymbals (Lemures). NOT feudal escheat chamber / struck PID ledger (Escheat). NOT muniment room / sealed charter (Mortmain). NOT Strowger exchange / switchboard. NOT ballad-sheet studio (Mondegreen). NOT racecourse (Derby).

Different verbs: Expand the lemma, Score cognate, Mark the gloss, Compare the folios, Pin idle expanded, Pin seeded cognate, Pin literal, Reset the desk.

Different idle: **expanded**. Different #93250 seeded path: **cognate**. HOLD: **expanded** / **hold**. ALARM: **cognate** / **literal** / **spec-alias** / **claude-dialect** / **allowlist** / **unexpanded** / **module-not-found** / **connection-closed** / **no-hint**. Path: **literal**.

## How to score

```bash
node --test projects/cognate/cognate.test.mjs
node projects/cognate/cognate.mjs projects/cognate/data/cognate.json
echo '{"seed":"cognate"}' | node projects/cognate/cognate.mjs
```

Open the living card at `projects/cognate/index.html` (or the live path `/cognate/`). Buttons: Expand the lemma, Score cognate, Mark the gloss, Compare the folios, Pin idle expanded, Pin seeded cognate, Pin literal, Reset the desk. Toggle spec `${PLUGIN_ROOT}` / CLAUDE_* allowlist / args literal / cwd literal / MODULE_NOT_FOUND / CONNECTION_CLOSED — the score flips. Rest a fixture JSON on the folio. `?embed=1` hides chrome.

The booth reconstructs the reporter’s mcp.json `${PLUGIN_ROOT}` / CLAUDE_* allowlist / literal arg walk from the published #93250 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/cognate/
- Folder: `projects/cognate/`

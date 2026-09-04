# Hectograph

A **gelatin hectograph / spirit-duplicator atelier** — gelatin tray (master sheet impressed in cool teal), pull strips (one copy per OTEL attribute path), flag matrix toggles (five `OTEL_LOG_*` switches), canary blot lamp (scrubbed teal-green / pulled amber), OTEL attribute path ledger; cool gelatin teal-green / ink violet / paper cream / warning amber — Fraunces + Outfit + Fira Code — for a real Claude Code defect: **TOOL ARGUMENT CONTENT IS EXPORTED IN TOOL_INPUT/TOOL_PARAMETERS REGARDLESS OF ANY OTEL_LOG_TOOL_* SETTING; AREA:CORE + AREA:SECURITY; PLATFORM:MACOS.**

Primary:

- [anthropics/claude-code#92056](https://github.com/anthropics/claude-code/issues/92056) (OPEN, bug, has repro, platform:macos, area:core, area:security, filed 2026-09-04T11:07:44Z, updated 2026-09-04T11:08:48Z). Title: `Tool argument content is exported in tool_input/tool_parameters regardless of any OTEL_LOG_TOOL_* setting`. Reporter michalszelagsonos. Claude Code 2.1.259 (also seen on 2.1.252 and 2.1.258). macOS darwin 25.6.0 arm64. OTLP gRPC to otelcol-contrib 0.160.0 on loopback.

a hectograph that still pulls a canary when every scrub flag is off is not a private log — it is a gelatin already impressed. Score the gelatin or admit the canary already pulled.

Idle word: **scrubbed**. Seeded state: **pulled** / #92056 — canary still appears in the exported payload with scrub flags off. Never idle as masked / bled / sounded / muted / slipped / fouled / verbatim / mangled / moored / aloft / resolved / literal / sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard / withheld / enacted.

A **hectograph** is a gelatin duplicator: the master is written once, then every pull lifts a copy from the tray. The OTEL “master” always transfers a pull of full tool argument text even when every scrub flag is set to off. Score the gelatin or admit the canary already pulled.

- **pulled** = #92056: canary still appears in `tool_decision.tool_parameters` (`full_command`), `tool_result.tool_parameters`, and `tool_result.tool_input` with scrub flags off
- **flag-matrix** = five content flags unset or off; canary still pulled on every tool attribute path
- **tool-parameters** = canary present in `tool_decision.tool_parameters` and/or `tool_result.tool_parameters`
- **tool-input** = canary present in `tool_result.tool_input`
- **full-command** = `tool_decision.tool_parameters.full_command` still carries the bash text
- **content-false** = `OTEL_LOG_TOOL_CONTENT=false`; canary still appears
- **content-zero** = `OTEL_LOG_TOOL_CONTENT=0`; canary still appears
- **flags-unset** = all `OTEL_LOG_*` flags unset (default); canary still appears
- **hold** = gelatin holds; canary absent; scrub flags honored
- **scrubbed** = HOLD: every `OTEL_LOG_TOOL_*` flag off or unset; canary absent from `tool_input` and `tool_parameters`

Verdicts: scrubbed, pulled, flag-matrix, tool-parameters, tool-input, full-command, content-false, content-zero, flags-unset, hold.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the gelatin scrubbed the canary or already pulled a copy. Fixtures use the fake string `HECTOGRAPH_CANARY_DO_NOT_EXPORT`.

Hypothesis only (NON-BINDING): `tool_input` / `tool_parameters` may be serialised onto `tool_decision` and `tool_result` events outside the `OTEL_LOG_TOOL_*` gates, so `full_command` still leaves even when every scrub flag is off. Discard if issue evidence disagrees. Encoded from the issue's flag matrix, canary table, and three attribute paths. Do not claim Claude Code source you have not seen.

## Why not a clone

This is specifically: **TELEMETRY / PRIVACY EXPORT — OTEL ATTRIBUTES THAT IGNORE SCRUB FLAGS.**

NOT Placet ([#92040](https://github.com/anthropics/claude-code/issues/92040)) — ExitPlanMode Accept vs Accept-and-implement consent-scope mismatch.
NOT Frisket ([#91574](https://github.com/anthropics/claude-code/issues/91574)) — PreToolUse deny unenforced on Write-family.
NOT Tangent ([#92021](https://github.com/anthropics/claude-code/issues/92021)) — WezTerm CSI-u shifted-field parse.
NOT Hawser ([#91578](https://github.com/anthropics/claude-code/issues/91578)) — Windows idle warm MCP unreaped children.
NOT Caret / Buoy / Solecism / Coffer / Codicil / Crimp / Jackfield / Tocsin / Bolter / Deadeye / Reglet / Reliquary / Annunciator / Caisson / Spindle / Knell / Tumbler / Escapement / Geneva / Scotch / Pintle paradigms.
NOT leftover congregation chamber / print-shop frisket / clavichord tangent / dockyard hawser / proof-desk caret / harbor-buoy / usage-desk / vault-coffer / probate parchment / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging.

Different surface: diagnostic scoring of OTEL attributes that ignore scrub flags. Completely different UI (duplicator gelatin tray + pull strips + canary blot), backend (fixture JSON of OTEL attribute paths + flag matrix), and UX.

Cousins are cite-only on a cousin strip; primary stays #92056.

- [#92057](https://github.com/anthropics/claude-code/issues/92057) — OPEN — `query_source` embeds the user's outputStyle (`repl_main_thread:outputStyle:Concise`) so exact-match filters silently match nothing. Related telemetry field pollution. Cite-only.
- [#91766](https://github.com/anthropics/claude-code/issues/91766) — OPEN — `OTEL_LOG_RAW_API_BODIES` ignored in project settings since 2.1.251. Related OTEL flag-ignore. Cite-only.

Distant cost cousins (mention only, not primary): [#92033](https://github.com/anthropics/claude-code/issues/92033) prompt-cache rewrite cost; [#92062](https://github.com/anthropics/claude-code/issues/92062) background wait status-probe cost.

Backups (document only, do not build): #92062 (background wait status-probe cost), #92061 (squash-merge worktree leftover). Do not auto-pick #92019, #92014.

Product name stays **Hectograph**. Do not rename to Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle.

Different UI: gelatin tray + master sheet + pull strips + flag matrix toggles + canary blot lamp + OTEL attribute path ledger / cool gelatin teal-green / ink violet / paper cream / warning amber. Fraunces + Outfit + Fira Code. NOT Spectral/Figtree/JetBrains Mono (Placet). NOT Libre Baskerville/Karla/IBM Plex Mono (Frisket). Stay OFF congregation chamber / print-shop frisket / clavichord keycaps / hawser bitts / proof-desk caret / harbor-buoy / usage-desk / vault-coffer / probate parchment / crimp pliers / jackfield channel-strip / tocsin fire-bell.

Different verbs: Score the gelatin, pin idle scrubbed, pin seeded pulled, admit the canary already pulled, load fixtures, reset to scrubbed. Score the gelatin is this desk's phrase.

Different idle: **scrubbed**.

## Live catalog path

`/hectograph/` is this static hectograph atelier. Path `https://hermes-playground-green.vercel.app/hectograph/` and subdomain `https://hectograph.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `21:50 / hermes catalog #135 / #92056`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **scrubbed** — every `OTEL_LOG_TOOL_*` flag off; canary absent from `tool_input` and `tool_parameters`; gelatin holds.
2. Seed **pulled** → #92056: canary still appears in `tool_decision.tool_parameters.full_command`, `tool_result.tool_parameters`, and `tool_result.tool_input` with `OTEL_LOG_TOOL_CONTENT=false` (and `=0`, and all flags unset).
3. Atelier UI: gelatin tray / master sheet / pull strips / flag matrix toggles / canary blot lamp / OTEL attribute path ledger. Scrubbed = gelatin holds. Pulled = the canary already left on the copy.
4. Cousin cite strip labeled cousin-not-primary: [#92057](https://github.com/anthropics/claude-code/issues/92057), [#91766](https://github.com/anthropics/claude-code/issues/91766). Cite only. Primary stays #92056.
5. **Score the gelatin** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/hectograph/index.html` in a browser, or serve the repo root and visit `/hectograph/` (Vercel rewrite → `/projects/hectograph`). No build step. Optional hook:

```bash
node projects/hectograph/hook/hectograph.mjs projects/hectograph/data/92056.json
node --test projects/hectograph/hook/hectograph.test.mjs
```

Empty stdin scores the idle **scrubbed** ticket. Paste a probe on the page or drop a fixture from `data/`.

# Procrustes

A **blacksmith / innkeeper's iron bed bench** — dark forge iron, linen sheets, rust-blood accents, brass measuring marks; Vollkorn + Cabin + Ubuntu Mono — for a real Claude Code defect: **ONE LEGAL BOOLEAN PROPERTY SCHEMA ANYWHERE IN ONE TOOL'S `inputSchema` (E.G. `"payload": true`, JSON SCHEMA ANY-VALUE) CAUSES THE AGENT SDK CLI (0.1.77) CONVERTER TO SILENTLY CULL EVERY TOOL FROM A CONNECTED STDIO MCP SERVER — BISECT 0/53 VS 53/53 — WITH ZERO DIAGNOSTICS.**

Primary:

- [anthropics/claude-code#92900](https://github.com/anthropics/claude-code/issues/92900) (OPEN, bug, has repro, platform:linux, area:mcp, area:agent-sdk). Title: `MCP (stdio): one boolean property schema silently drops ALL tools of the server (SDK 0.1.77; stdio twin of #88049, re-filing of #82949)`. `@anthropic-ai/claude-agent-sdk` 0.1.77 (declared `^0.1.0`); Node.js 22.x via `tsx`; Linux x86_64.

05:50 procrustes: a blacksmith / innkeeper's iron bed bench that should keep an MCP server's full tool palette intact while the server reports connected; instead one legal boolean property schema anywhere in one tool's inputSchema (e.g. payload: true meaning JSON Schema any-value) causes the Agent SDK CLI (0.1.77) converter to silently cull EVERY tool from that server (bisect 0/53 vs 53/53) with zero diagnostics — Procrustean fit: one bad measure, whole guest mutilated; score culled or admit intact.

Score culled or admit intact.

Idle word: **intact** (HOLD: 53/53 tools reach the API while the server reports connected). #92900 path: **culled**. Seeded recovery: **relisted**. Never idle enrolled / as-penned / rove / vaulted / cleared. Never seed regranted / misbound / fouled / escheated.

**Procrustes** = the innkeeper who stretched or chopped every guest to fit one iron bed. An MCP server's full tool palette should stay intact on that bed. Instead one boolean measure culls the whole guest.

- **intact** = IDLE: HOLD; 53/53 tools reach the API; server connected
- **culled** = #92900 path: one boolean property schema → 0/53, zero diagnostics
- **relisted** = seeded recovery: object-form any-value restores 53/53
- **bisect** = path without `payload:true` → 53/53; with it → 0/53
- **connected-silent** = server status connected; no stderr, no error, no warning
- **boolean-trigger** = `payload: true` inside `properties` — legal JSON Schema any-value
- **object-form-workaround** = `{ description: Any JSON value }` (no type) passes conversion
- **cousins** = cite-only #88049 (OPEN, HTTP non-object) and #82949 (CLOSED not_planned)
- **sdk-0-1-77** = Agent SDK 0.1.77 bundled `cli.js` converter
- **before-after** = boolean node → 0/53 culled; object-form → 53/53 relisted

Verdicts: intact, culled, relisted, bisect, connected-silent, boolean-trigger, object-form-workaround, cousins, sdk-0-1-77, before-after.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. No network to Anthropic. Score whether a tool palette would sit **culled** or already **intact**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): `jsonSchemaToZodShape` throws on a boolean node (`'properties' in true`) and `createSdkServer` maps the whole tool list without per-tool isolation, so one legal schema culls the server. Invite verify against #92900 only. Do NOT implement a fix in anthropics/claude-code.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92900](https://github.com/anthropics/claude-code/issues/92900)
- Cite-only: [anthropics/claude-code#88049](https://github.com/anthropics/claude-code/issues/88049) (OPEN)
- Cite-only: [anthropics/claude-code#82949](https://github.com/anthropics/claude-code/issues/82949) (CLOSED not_planned)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:linux, area:mcp, area:agent-sdk
- SDK: `@anthropic-ai/claude-agent-sdk` 0.1.77 (declared `^0.1.0`, lockfile-resolved `0.1.77`) and bundled `cli.js`
- Runtime: Node.js 22.x via `tsx`; Linux x86_64
- Transport: stdio MCP server
- Trigger: one tool (`propose`) advertises `inputSchema.properties.payload = true` — legal JSON Schema 2020-12 §4.3.2 any-value
- Observed: 0 of the server's tools reach the API request; server status "connected"; no warning or error anywhere
- Expected: accept the boolean schema, or drop only the offending tool with a diagnostic
- Bisect: path without `payload: true` → 53/53; path with it → 0/53; object-form any-value → 53/53
- Two operations in an OpenAPI-enriched 53-tool bridge declared `"payload": true`
- Capture method: `ANTHROPIC_BASE_URL` pointed at a credential-free Anthropic-format stub; count `tools` in the recorded request body
- Impact: capability floor collapsed 11/11 → 1/6; looked like a model-behavior regression
- Workaround: `true` → `{ "description": "Any JSON value" }` (no `type`); lint properties-map values as objects
- Suggested fix: handle `typeof node === 'boolean'` before `'properties' in node`; per-tool `try/catch` in `createSdkServer`
- Cousins cite-only: #88049 (HTTP non-object schema, OPEN, same blast radius); #82949 (boolean named-property, CLOSED not_planned by bot 2026-09-08, no fix landed — this re-files)

Problem found: AN IRON BED THAT SHOULD KEEP THE GUEST'S FULL TOOL PALETTE INTACT WHILE THE SERVER REPORTS CONNECTED INSTEAD LETS ONE BOOLEAN MEASURE CULL EVERY TOOL — 0/53, ZERO DIAGNOSTICS.

Why this solution: a diagnostic blacksmith / innkeeper's iron bed bench for the intact → culled drop, so a reader can pin idle intact, load the #92900 culled path, and score relisted / bisect / connected-silent / boolean-trigger / object-form-workaround / cousins / sdk-0-1-77 / before-after against the published facts.

## Why not a clone

This is specifically: **ONE LEGAL BOOLEAN PROPERTY SCHEMA ANYWHERE IN ONE TOOL'S `inputSchema` CAUSES THE AGENT SDK CLI (0.1.77) CONVERTER TO SILENTLY CULL EVERY TOOL FROM A CONNECTED STDIO MCP SERVER (BISECT 0/53 VS 53/53) WITH ZERO DIAGNOSTICS.**

**NOT Cadastre/#92908** (trust RMW lock — just shipped #231). Cite only. Do not touch Cadastre.

**NOT Rubric/#92855** (TUI ordered-list renumber — shipped #230). Cite only. Do not touch Rubric.

**NOT Sheave/#92827** (queued path-as-slash). Cite only. Do not touch Sheave.

**NOT Crenel** (MCP resources `{}`). Cite only. Do not touch Crenel.

**NOT Clepsydra/#92776** (OTel stall). Cite only. Do not touch Clepsydra.

**NOT Mailslot/#92839, Ukase/#92833, Scabbard/#92820, Deadletter/#90049, Dryjoint/#92809.** Already shipped. Cite only. Do not touch.

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session.

Different paradigm: **an iron bed that should keep the guest's full tool palette intact; instead one boolean measure culls the whole guest.**

Do NOT rename this product Cadastre, Rubric, Sheave, Crenel, Clepsydra, or any existing catalog slug.
Do NOT reuse idle enrolled / as-penned / rove / vaulted / cleared. Do NOT reuse seeded regranted / misbound / fouled / escheated.

Different surface: stdio MCP tool-conversion silent whole-server drop from one boolean schema node vs whole-file RMW advisory-lock escheat / TUI ordered-list echo / mid-turn `/Users` slash hitch / MCP resources `{}` / OTel stall.

Product name stays **Procrustes**. Name/slug `procrustes` confirmed unused in catalog.json (231 products before this ship; Cadastre is #231).

Different UI: blacksmith / innkeeper's iron bed / dark forge iron / linen sheets / rust-blood accents / brass measuring marks. Vollkorn / Cabin / Ubuntu Mono. NOT Instrument Serif (Espagnolette / Afterimage). NOT Source Sans 3 (Ukase). NOT Crimson Pro + Work Sans + Cousine (Cadastre). NOT Cardo + Figtree + Source Code Pro (Rubric). NOT Fraunces + Plus Jakarta + IBM Plex (Sheave). NOT a baize survey desk, scriptorium, deck sheave, merlon, or water-clock.

Different verbs: Score culled, Admit intact, Pin idle intact, Load culled, Load relisted, Reset to intact.

Different idle: **intact**. Different #92900 path: **culled**. HOLD: **intact**. ALARM: **culled** / **relisted** / **bisect** / **connected-silent** / **boolean-trigger** / **object-form-workaround** / **cousins** / **sdk-0-1-77** / **before-after**.

## How to score

Open the living card at `projects/procrustes/index.html` (or the live path `/procrustes/`). Buttons: Score culled, Admit intact, Pin idle intact, Load culled, Load relisted, Load fixtures, Reset to intact. Hang a measure chip. Drop a fixture JSON. Assay a boolean node vs object-form to see intact palette vs culled guest vs relisted recovery. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/procrustes/
- Folder: `projects/procrustes/`

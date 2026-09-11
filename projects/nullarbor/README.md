# Nullarbor

A **Nullarbor Plain / empty saltbush expanse / blank ticket booth** — horizon codes, Eyre mile-posts, brass stamp blotter, ticket that should carry a bearer but the plain is empty. Fonts **Teko** (display) + **Hind** (body) + **Fira Mono** (mono). Palette: saltbush dusk `#1A1F18`, clay `#C4A574`, sky bleach `#E8E4D9`, horizon indigo `#2C3E50`, empty-token red `#B33A3A`, mirage teal `#3D7A6A`, stamp brass `#B89A3A`. NOT siege petard, NOT speech-break vellum, NOT manor disseisin, NOT flashback, NOT sanctuary monstrance, NOT cloister compline, NOT vault cipherlock, NOT concert sourdine, NOT cheque counterfoil, NOT wax cachet.

The Nullarbor is an empty saltbush plain: the ticket booth should stamp a bearer token from `${VAR}`, but on 2.1.260 the plain is empty.

Primary:

- [anthropics/claude-code#93595](https://github.com/anthropics/claude-code/issues/93595) (OPEN, bug, has repro, platform:windows, area:mcp, regression, area:plugins). Title: `[BUG] Plugin HTTP MCP ${VAR} header expansion resolves to empty in 2.1.260 (works in 2.1.247 / 2.1.223) — bearer token never sent`. A plugin-defined HTTP MCP server with `Authorization: Bearer ${SONAR_TOKEN}` (or any `${VAR}`) fails on **2.1.260** with HTTP 401 because the header is sent with no token. Identical plugin + env var + shell + config connect on **2.1.247** and **2.1.223**. Reproduces when 2.1.260 is launched from a plain shell (not only desktop-vs-terminal); desktop happens to bundle 2.1.260 under `%APPDATA%\Claude\claude-code\<version>\` while npm-global PATH may be older. Bisect same machine/shell/config/env: 2.1.223 Connected, 2.1.247 Connected, 2.1.260 Failed HTTP 401. Direct POST evidence: `Bearer $TOKEN` (shell-expanded) → 200; literal `Bearer ${SONAR_TOKEN}` unexpanded → 403; `Bearer ` (empty) → **401**. 2.1.260 matches the empty case, NOT trailing-brace corruption. Distinct from #84367 (trailing `}` leaks → HTTP 400 / badly formatted; that bug on 2.1.222 which still works for this reporter's empty-expand case). Also distinct cite-only: #84314 (non-deterministic `${VAR}` for MCP env on Linux), #90074 (Windows desktop sanitizes stdio MCP env — ruled out; var present in 2.1.260's own env), #91307 (host-app state Desktop vs Terminal). Error text falsely says "Check that the token is valid"; OAuth fallback disabled when headers.Authorization is set. Regression bracket 2.1.248–2.1.260; last working 2.1.247. Plugin manifest byte-identical; no competing mcpServers in ~/.claude.json; var inherited from process env (not profile scripts). Practical impact: every plugin-distributed HTTP MCP using `${VAR}` headers silently unusable on 2.1.260 desktop-bundled CLI. Repro: install plugin with type http + Authorization Bearer ${SOME_TOKEN}; set SOME_TOKEN in user env; confirm expanded-token POST 200; `claude mcp list` on 2.1.247 → Connected; same on 2.1.260 → Failed 401. Cousins cite-only: #84367, #84314, #90074, #91307, #90677, #90050. Backups cite-only: #93585, #93570, #93589, #93618, #93615, #93622.

22:50 nullarbor: a Nullarbor Plain / empty-bearer booth for #93595. Idle **stamped** / seeded **emptied** / path **empty-expand**. Score nullarbor or admit stamped.

Score nullarbor or admit stamped.

Idle word: **stamped** (HOLD: `${VAR}` expands from process env; Authorization Bearer token present; `claude mcp list` Connected; direct POST with expanded token → HTTP 200). Seeded word: **emptied** / #93595 (2.1.260 expands plugin HTTP MCP `${VAR}` header to empty → HTTP 401 matching `Bearer ` empty case, not literal unexpanded `${VAR}` which is 403). Path word: **empty-expand**. Product score: **nullarbor**. Never idle standing / raised / seised / ordered / viewed / closed / sealed / voiced or seeded hoisted / furled / disseised / redelivered / withheld / lingering / blanked / muted.

Phrase: **Score nullarbor or admit stamped.**

- **stamped** = IDLE: HOLD; `${VAR}` expands from process env; Bearer token present; mcp list Connected; expanded POST → 200
- **emptied** = #93595 seeded path: 2.1.260 expands `${VAR}` to empty → HTTP 401 matching `Bearer ` empty
- **nullarbor** = product score word for an empty saltbush ticket booth
- **empty-expand** = path word: `${VAR}` resolves to empty, not a literal unexpanded string
- **hold** = HOLD alias for idle stamped
- **token-present** = SOME_TOKEN inherited from process env
- **connected** = `claude mcp list` Connected on working binaries
- **http-200** = direct POST with expanded token → HTTP 200
- **http-401** = `Bearer ` empty → HTTP 401; 2.1.260 matches this
- **http-403** = literal unexpanded `Bearer ${VAR}` → HTTP 403
- **bearer-empty** = Authorization sent as `Bearer ` with no token
- **not-literal** = 2.1.260 matches empty 401, not literal 403
- **not-trailing-brace** = distinct from #84367 trailing `}` → HTTP 400
- **plugin-http** = plugin-defined MCP server with type http
- **var-header** = `Authorization: Bearer ${VAR}` in plugin headers
- **process-env** = var inherited from process env, not profile scripts
- **desktop-bundle** = Windows desktop bundles 2.1.260 under `%APPDATA%\Claude\claude-code\<version>\`
- **npm-global** = npm-global PATH may still be a working older binary
- **plain-shell** = reproduces when 2.1.260 is launched from a plain shell
- **bisect-260** = 2.1.223 Connected, 2.1.247 Connected, 2.1.260 Failed 401
- **last-working-247** = 2.1.247 last confirmed Connected
- **regression-248-260** = regression bracket 2.1.248–2.1.260
- **false-token-check** = error text falsely says "Check that the token is valid"
- **oauth-disabled** = OAuth fallback disabled when headers.Authorization is set
- **byte-identical** = plugin manifest byte-identical across cached versions
- **no-competing-mcp** = no competing mcpServers in ~/.claude.json
- **has-repro** = published shape: plugin http + `${VAR}` header / env present / 247 Connected / 260 Failed 401
- **cousins** = cite-only #84367 #84314 #90074 #91307 #90677 #90050 — do not rebuild
- **backups** = cite-only #93585 #93570 #93589 #93618 #93615 #93622 — do not auto-pick
- **fixtures** = blank ticket booth / saltbush expanse / horizon codes / Eyre mile-posts / brass stamp blotter
- **walk** = published idle stamped → plugin http → process env → POST 200 → 2.1.247 Connected → 2.1.260 401 → empty not literal → not trailing-brace → desktop-bundle → plain-shell → false token-valid → empty-expand → nullarbor

Verdicts: stamped, emptied, nullarbor, empty-expand, hold, token-present, connected, http-200, http-401, http-403, bearer-empty, not-literal, not-trailing-brace, plugin-http, var-header, process-env, desktop-bundle, npm-global, plain-shell, bisect-260, last-working-247, regression-248-260, false-token-check, oauth-disabled, byte-identical, no-competing-mcp, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the ticket is **emptied** / **nullarbor** or already **stamped**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): plugin HTTP MCP `${VAR}` header expansion should resolve from the CLI process environment on 2.1.260 exactly as it does on 2.1.247 / 2.1.223. Invite verify against #93595 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93595](https://github.com/anthropics/claude-code/issues/93595)
- Cite-only cousins: #84367 (trailing `}` leaks → HTTP 400 / badly formatted), #84314 (non-deterministic `${VAR}` for MCP env on Linux), #90074 (Windows desktop sanitizes stdio MCP env — ruled out), #91307 (host-app state Desktop vs Terminal), #90677, #90050
- Backups (data only): #93585 (stale cloud branch after pre-warm; alt Anachronism), #93570 (single-task shutdown kills all; alt Overkill), #93589 (Cowork egress additional domains ignored), #93618 (Windows/Git Bash ~8175 truncation + backslash halving), #93615 (scheduled WebSearch hangs), #93622 (channel messages merge lose prompt cache)

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:mcp, regression, area:plugins.
- Plugin-defined HTTP MCP server with `Authorization: Bearer ${SONAR_TOKEN}` (or any `${VAR}`) fails on 2.1.260 with HTTP 401 because the header is sent with no token
- Identical plugin + env var + shell + config connect on 2.1.247 and 2.1.223
- Reproduces when 2.1.260 is launched from a plain shell (not only desktop-vs-terminal)
- Desktop happens to bundle 2.1.260 under `%APPDATA%\Claude\claude-code\<version>\` while npm-global PATH may be older
- Bisect same machine/shell/config/env: 2.1.223 Connected, 2.1.247 Connected, 2.1.260 Failed HTTP 401
- Direct POST: expanded `Bearer $TOKEN` → 200; literal `Bearer ${SONAR_TOKEN}` → 403; `Bearer ` empty → **401**
- 2.1.260 matches the empty case, NOT trailing-brace corruption
- Distinct from #84367 (trailing `}` → HTTP 400 on 2.1.222 which still works here)
- Error text falsely says "Check that the token is valid"; OAuth fallback disabled when headers.Authorization is set
- Regression bracket 2.1.248–2.1.260; last working 2.1.247
- Plugin manifest byte-identical; no competing mcpServers in ~/.claude.json
- Var inherited from process env (not profile scripts)
- Practical impact: every plugin-distributed HTTP MCP using `${VAR}` headers silently unusable on 2.1.260 desktop-bundled CLI

Problem found: PLUGIN HTTP MCP `${VAR}` HEADER EXPANSION RESOLVES TO EMPTY IN 2.1.260 → HTTP 401 matching `Bearer ` empty, not literal unexpanded `${VAR}` (403). Last working 2.1.247.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the ticket stayed **stamped** or was **emptied**. Educational Nullarbor Plain booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. `${VAR}` in a plugin manifest's `mcpServers.*.headers` should resolve from the CLI process environment on 2.1.260 exactly as it does on 2.1.247 and 2.1.223, and the server should connect

## Why not a clone

This is specifically: **PLUGIN HTTP MCP `${VAR}` HEADER EXPANSION RESOLVES TO EMPTY IN 2.1.260 (WORKS IN 2.1.247 / 2.1.223) — BEARER TOKEN NEVER SENT.**

**NOT Petard/#93607** (Linux Bash-tool `pkill -f` matches wrapper argv). Different defect. NOT siege petard.

**NOT Aposiopesis/#93588** (statusLine git-cwd mute). Different defect. NOT vellum/ink speech-break.

**NOT Disseisin/#93574** (Cowork VM-home evaporation / ghost connected folder). Different defect. NOT manor parchment.

**NOT Analepsis/#93569** (Desktop feed redelivery behind `background_tasks_redelivered`). NOT flashback dusk.

**NOT Monstrance/#93563** (Artifact read binds withdrawn native WebFetch). NOT sanctuary gilt.

**NOT Compline/#93549** (remote-control bridge never sends `end_session`). NOT cloister.

**NOT Cipherlock/#93537** (concurrent Keychain wipe). NOT vault brass.

**NOT Sourdine/#93531** (mid-turn narration mute). NOT concert velvet.

**NOT Counterfoil/#93446** (add-json client-secret store / headers-hash). NOT cheque counterfoil.

**NOT Cachet/#93490** (Fable resume string-carrier busts prompt cache). NOT wax cachet.

**NOT #84367** — trailing `}` leaks → HTTP 400. Cite only. That build (2.1.222) still works for this empty-expand case.

**NOT #84314** — non-deterministic `${VAR}` for MCP env on Linux. Cite only.

**NOT #90074** — Windows desktop sanitizes stdio MCP env. Ruled out; var present in 2.1.260's own env. Cite only.

**NOT #91307** — host-app state Desktop vs Terminal. This reproduces from a plain shell. Cite only.

Do NOT rename Nullarbor to any existing catalog slug. Catalog currently has 293 products; Nullarbor is #294.
Do NOT reuse idle standing / raised / seised / ordered / viewed / closed / sealed / voiced, or seeded hoisted / furled / disseised / redelivered / withheld / lingering / blanked / muted.
Display here is **Teko**. Body is **Hind**. Mono is **Fira Mono**.

Different surface: plugin HTTP MCP `${VAR}` empty-expand 401 vs Linux Bash-tool pkill wrapper-argv vs statusLine git-cwd never-spawn vs Cowork VM-home evaporation vs Desktop feed redelivery vs cheque headers-hash vs wax cachet string-carrier.

Different UI: blank ticket booth / saltbush expanse / horizon codes / Eyre mile-posts / brass stamp blotter. Teko / Hind / Fira Mono. Saltbush dusk with clay, sky bleach, horizon indigo, empty-token red, mirage teal, stamp brass. NOT siege trench. NOT speech-break vellum. NOT manor roll. NOT flashback dusk. NOT sanctuary night. NOT cloister dusk. NOT bank vault. NOT concert velvet. NOT cheque blotter. NOT wax press.

Different verbs: Stamp the ticket, Score nullarbor, Empty the plain, Compare stamped / emptied, Pin idle stamped, Pin seeded emptied, Pin empty-expand, Hold the bearer.

Different idle: **stamped**. Different #93595 seeded path: **emptied**. HOLD: **stamped** / **hold**. ALARM: **emptied** / **nullarbor** / **empty-expand** / **http-401**. Path: **empty-expand**.

## How to score

```bash
node --test projects/nullarbor/nullarbor.test.mjs
node projects/nullarbor/nullarbor.mjs projects/nullarbor/data/emptied.json
echo '{"seed":"emptied"}' | node projects/nullarbor/nullarbor.mjs
```

Open the living card at `projects/nullarbor/index.html` (or the live path `/nullarbor/`). Buttons: Stamp the ticket, Score nullarbor, Empty the plain, Compare stamped / emptied, Pin idle stamped, Pin seeded emptied, Pin empty-expand, Hold the bearer. Toggle chips for: token present, connected, expanded 200, empty 401, literal 403, 2.1.260, desktop bundle, plain shell — the score flips. Lay a fixture JSON on the salt blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s emptied walk from the published #93595 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/nullarbor/
- Folder: `projects/nullarbor/`

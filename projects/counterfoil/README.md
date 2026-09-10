# Counterfoil

A **cheque-counter / ticket-stub / banker's counterfoil booth** — perforated stub, brass grille window, ink dating stamp, ledger blotter. Fonts **Source Serif 4** (display) + **Libre Franklin** (body) + **Noto Sans Mono** (mono). Palette: banker's green `#0d3b2e`, cream paper `#f4efe6`, stamp crimson `#9b1b1b`, brass `#b08d57`, graphite ink — cheque-desk, not parchment-scriptorium, not wax-seal notary, not camera-lucida, not sterile lab, not hydraulic damper.

Primary:

- [anthropics/claude-code#93446](https://github.com/anthropics/claude-code/issues/93446) (OPEN, bug, has repro, platform:linux, area:auth, area:mcp). Title: `[BUG] mcp add-json --client-secret stores secret under headers-stripped key, login looks up headers-included key (#67528 closed as stale, still present in 2.1.267)`. Filed by medley56 2026-09-10. Claude Code **2.1.197** reproduced; defective `add-json` path confirmed unchanged in the **2.1.267** linux-x64 binary. Ubuntu/Debian Linux; VS Code devcontainer (`python:3.13-slim`); zsh. `claude mcp add-json <name> '<json>' --client-secret` for an HTTP MCP server whose JSON has a non-empty `headers` field stores the OAuth client secret under a credential-store key computed **without** the headers, while `claude mcp login <name>` looks the secret up under a key computed **with** the headers. Lookup misses → token exchange goes out with no `client_secret` → auth server rejects. GitHub remote MCP (`https://api.githubcopilot.com/mcp/`, `X-MCP-Toolsets: default,actions`) surfaces as `The client_id and/or client_secret passed are incorrect.` Published keys: store `github|1eea5f274543f247` hashed with `headers:{}`; login `github|01759ec9120e7ef8` hashed with the toolsets header. Plain `claude mcp add` is not affected. Same defect as closed-stale #67528 (v2.1.173, closed 2026-07-22).

05:50 counterfoil: a cheque-counterfoil booth for #93446. Idle **matched** / seeded **skewed** / path **headers-hash**. Score counterfoil or admit matched.

Score counterfoil or admit matched.

Idle word: **matched** (HOLD: store + login use same keyFor with full config incl. headers). Seeded word: **skewed** / #93446 (headers-stripped store vs headers-included lookup). Path word: **headers-hash**. Product score: **counterfoil**. Never idle traced / pathless / image-cache / lucida / scrubbed / contaminated / fomite / gitignore / damped / spinning / mux / snubber / mounted / fossed / plan9 / fosse / warm / paged-out / majflt / hibernacle / honest / scapegoated / ungranted / scapegoat / bound / accreted / session-url / cartulary / sealed / mismatched / issuer / paraph / routed / inherited / cascade / appanage.

Phrase: **when add-json --client-secret stores the secret under a headers-stripped keyFor while mcp login looks it up under a headers-included key, score counterfoil or admit matched.**

- **matched** = IDLE: HOLD; store + login use same keyFor with full config incl. headers
- **skewed** = #93446 seeded path: headers-stripped store vs headers-included lookup
- **counterfoil** = product score word for the stub filed under a different serial than the cheque presented at the grille
- **headers-hash** = path word: keyFor hashes `{type,url,headers}`; add-json drops headers on store
- **hold** = HOLD alias for idle matched
- **add-json** = `claude mcp add-json` persists full config then stores secret on rebuilt `{type,url}`
- **client-secret** = `--client-secret` / `saveMcpClientSecret`
- **keyFor** = shared `keyFor(serverName, cfg)` hashing `{type,url,headers}`
- **headers-stripped** = store key `github|1eea5f274543f247` hashed with `headers:{}`
- **headers-included** = login key `github|01759ec9120e7ef8` hashed with `X-MCP-Toolsets`
- **token-exchange** = token request after browser OAuth
- **no-secret** = lookup miss; exchange goes out with no `client_secret`
- **github-mcp** = GitHub remote MCP reject text
- **stale-67528** = closed-stale same defect (v2.1.173, closed 2026-07-22)
- **has-repro** = Claude Code 2.1.197 · medley56 · confirmed 2.1.267 · Ubuntu/Debian · VS Code devcontainer
- **cousins** = cite-only #67528 #89969 #84839 — do not rebuild
- **backups** = cite-only #93458 #92264 #86531 #93403 #93445 #93405 #93402 #93426 — do not auto-pick
- **fixtures** = stub / grille / stamp / blotter table for the counterfoil booth
- **walk** = published idle matched → add-json-persist → save-secret-stripped → store-key → mcp-login → lookup-key → lookup-miss → token-exchange → github-reject → skewed → headers-hash → counterfoil

Verdicts: matched, skewed, counterfoil, headers-hash, hold, add-json, client-secret, keyFor, headers-stripped, headers-included, token-exchange, no-secret, github-mcp, stale-67528, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the blotter is **skewed** / **counterfoil** or already **matched**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): add-json persists the full config then calls saveMcpClientSecret with a rebuilt {type,url} that drops headers, while login hashes the full stored config, so keyFor diverges. Invite verify against #93446 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93446](https://github.com/anthropics/claude-code/issues/93446)
- Cite-only cousin: [anthropics/claude-code#67528](https://github.com/anthropics/claude-code/issues/67528) (closed stale, same defect — do not rebuild)
- Cite-only cousin: [anthropics/claude-code#89969](https://github.com/anthropics/claude-code/issues/89969) (oauth block clientId cached unsubstituted in the keychain; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#84839](https://github.com/anthropics/claude-code/issues/84839) (Kaggle MCP token exchange missing client_secret; do not rebuild)
- Backup (data only): #93458 SessionStart hook additionalContext silently dropped when source=fork
- Backup (data only): #92264 Idle background session stops advancing while async subagents are in flight
- Backup (data only): #86531 /rename renames other concurrent sessions
- Backup (data only): #93403 nested skills never load in auto mode
- Backup (data only): #93445 /branch RC reconnection record
- Backup (data only): #93405 autoMode trusted-repo path pinned user-global
- Backup (data only): #93402 Cmd+Enter interrupts instead of queues
- Backup (data only): #93426 host writes `.in_use` / `.orphaned_at` into pinned plugin tree

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:linux, area:auth, area:mcp
- Claude Code **2.1.197** reproduced; **2.1.267** linux-x64 binary confirmed unchanged
- Reporter: medley56; Ubuntu/Debian Linux; VS Code devcontainer (`python:3.13-slim`); zsh
- Credential store `$CLAUDE_CONFIG_DIR/.credentials.json` (no OS keychain)
- `add-json` persists the full config (incl. headers), then stores the secret against a rebuilt `{type, url}` that drops `headers`
- Login calls `keyFor(serverName, serverConfig)` with the full stored config, so the real headers are hashed
- Published keys: store `github|1eea5f274543f247` vs login `github|01759ec9120e7ef8`
- Token exchange goes out with no `client_secret`; GitHub rejects
- Plain `claude mcp add ... --header ... --client-secret` is not affected
- Same defect as #67528 (closed stale 2026-07-22)

Problem found: ADD-JSON CLIENT-SECRET STORE KEY DROPS HEADERS WHILE LOGIN LOOKUP INCLUDES THEM, SO THE SECRET IS FILED UNDER A DIFFERENT SERIAL THAN THE CHEQUE PRESENTED AT THE GRILLE.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether store and login still share a counterfoil. Educational cheque-desk booth for the catalog; encodes matched vs skewed vs headers-hash path. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. `add-json` should pass the same config object it persists to the secret-store function (as `claude mcp add` already does)
2. Store key and login-time lookup key match
3. The secret is included in the token exchange

## Why not a clone

This is specifically: **ADD-JSON `--client-secret` STORES UNDER A HEADERS-STRIPPED KEYFOR WHILE LOGIN LOOKS UP A HEADERS-INCLUDED KEY** — cheque-counterfoil booth, not monastic cartulary, not wax-seal notary, not camera-lucida atelier, not sterile-lab fomite, not pulse-damper.

**NOT Cartulary/#93331** (unbounded `mcpOAuth` accretion: identical claude.ai connector tokens re-stored under a new session-scoped `serverUrl` every session; 1,681 records / 906 KB). Different defect: this is key *asymmetry* on add-json client-secret when headers are present, not unbounded folio growth. NOT oak lectern / quire.

**NOT Paraph/#93327** (Desktop BYO OAuth MCP issuer mismatch whose quotes close `%22`). Different defect: this is store/lookup keyFor headers, not RFC 8414 issuer-seal quotes. NOT wax-seal notary.

**NOT Lucida/#93429** (Desktop Code tab paste drops the image source path). Different defect. NOT camera-lucida / drafting plate.

**NOT Fomite/#93423** (directory marketplace install copies gitignored files including root `.env`). Different defect. NOT culture dish.

**NOT Snubber/#93398** (sandboxed Bash EPIPE spin on leaked srt-mux). Different defect. NOT pulse-damper.

**NOT Fosse/#93358.** **NOT Hibernacle/#93372.** **NOT Scapegoat/#93348.** **NOT Appanage/#93307.** **NOT Pontoon/#93288.** **NOT Concordat/#93290.** **NOT Revenant/#93274.**

**NOT leftover woodworking / mm-slider Vernier/#93219.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **cheque counterfoil — the bank keeps the stub under one serial; the teller window presents the cheque under another** — unused in catalog as this blotter walk.

Do NOT rename this product Lucida, Fomite, Snubber, Cartulary, Paraph, Fosse, Hibernacle, Scapegoat, Appanage, Pontoon, Concordat, Revenant, or any existing catalog slug.
Do NOT reuse idle matched / skewed / headers-hash on a later booth.
Display here is **Source Serif 4**. Body is **Libre Franklin**. Mono is **Noto Sans Mono**.

Different surface: add-json client-secret keyFor headers asymmetry vs unbounded mcpOAuth session-url accretion vs issuer `%22` vs desktop image-cache omit vs directory-marketplace gitignore-blind copy.

Product name stays **Counterfoil**. Name/slug `counterfoil` unused in catalog.json (277 products before this ship; Lucida is #277).

Different UI: cheque-counter / ticket-stub / banker's booth / perforated stub / brass grille / ink dating stamp / ledger blotter. Source Serif 4 / Libre Franklin / Noto Sans Mono. NOT monastic scriptorium (Cartulary). NOT wax-seal notary (Paraph). NOT camera-lucida atelier (Lucida). NOT sterile lab (Fomite). NOT pulse-damper (Snubber). NOT millimeter-slider.

Different verbs: Stamp the stub, Score counterfoil, Tear the perforation, Audit the grille, Pin idle matched, Pin seeded skewed, Pin headers-hash, Clear the blotter.

Different idle: **matched**. Different #93446 seeded path: **skewed**. HOLD: **matched** / **hold**. ALARM: **skewed** / **counterfoil** / **headers-hash** / **headers-stripped**. Path: **headers-hash**.

## How to score

```bash
node --test projects/counterfoil/counterfoil.test.mjs
node projects/counterfoil/counterfoil.mjs projects/counterfoil/data/skewed.json
echo '{"seed":"skewed"}' | node projects/counterfoil/counterfoil.mjs
```

Open the living card at `projects/counterfoil/index.html` (or the live path `/counterfoil/`). Buttons: Stamp the stub, Score counterfoil, Tear the perforation, Audit the grille, Pin idle matched, Pin seeded skewed, Pin headers-hash, Clear the blotter. Toggle store with headers / login with headers / add-json path / mcp add path / X-MCP-Toolsets / token-exchange no secret — the score flips. Lay a fixture JSON on the blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s add-json headers-stripped store / login headers-included lookup / GitHub reject walk from the published #93446 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/counterfoil/
- Folder: `projects/counterfoil/`

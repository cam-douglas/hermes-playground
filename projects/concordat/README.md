# Concordat

A **diplomatic chancery / treaty-desk / protocol desk** — parchment, seal-wax, ink, brass. Fonts **Vollkorn** (display) + **DM Sans** (body) + **Inconsolata** (mono). Palette: parchment vellum, seal-wax crimson, walnut ink, brass fittings — for a real Claude Code defect: **CLAUDE DESKTOP / CLAUDE CODE CLI SEND MCP-PROTOCOL-VERSION: 2025-11-25 WITH _META PROTOCOLVERSION 2026-07-28 VIA CLAUDE.AI CONNECTORS — SPEC-COMPLIANT STATELESS SERVERS REJECT EVERY CALL (-32020 HEADER MISMATCH).**

Primary:

- [anthropics/claude-code#93290](https://github.com/anthropics/claude-code/issues/93290) (OPEN, bug, has repro, area:mcp, platform:macos). Title: `[BUG] Claude Desktop / Claude Code CLI send Mcp-Protocol-Version: 2025-11-25 with _meta protocolVersion 2026-07-28 via claude.ai connectors — spec-compliant stateless servers reject every call (-32020 header mismatch)`. Claude Code 2.1.267 (CLI, macOS — failing); 2.1.267 (VS Code extension, Linux — working). Claude for Mac 1.49585.0. Filed by StephaneBernard 2026-09-10. After negotiating MCP protocol 2026-07-28 (SEP-2575 via `server/discover`), Desktop and CLI keep sending HTTP header `Mcp-Protocol-Version: 2025-11-25` while JSON-RPC `params._meta["io.modelcontextprotocol/protocolVersion"] = "2026-07-28"`. Spec-compliant stateless servers (Go MCP SDK `StreamableHTTPOptions{Stateless:true}`) reject with JSON-RPC `-32020` HEADER_MISMATCH / HTTP 400; the connector relays `-32603`. Connector UI shows Connected but every tool call fails. Same connector from the VS Code extension works because that path stays on legacy initialize 2025-11-25 with no `_meta`. Client-side mirror of go-sdk#1162 / #1164.

17:50 concordat: a diplomatic chancery / treaty-desk booth that should keep MCP header and body versions concordant after SEP-2575 discover; instead Desktop and CLI send `Mcp-Protocol-Version: 2025-11-25` while `_meta` carries `2026-07-28`, and a spec-compliant stateless server rejects every call (`-32020`) (#93290). Score concordat or admit concordant.

Score concordat or admit concordant.

Idle word: **concordant** (HOLD: header and body versions agree; the concord forms; tools fire). Seeded word: **mismatched** / #93290 (header 2025-11-25 vs `_meta` 2026-07-28; `-32020`). Path word: **header-mismatch**. Product score: **concordat**. Never idle reaped / restored / expanded / laid / released / freehold / trunked / tokenized / locked / scratched / unmasked / revenant / replevin / cognate / lemures / escheat / mortmain / strowger / mondegreen / derby / vizard.

Phrase: **when Desktop or CLI send a 2025-11-25 header with a 2026-07-28 _meta after SEP-2575 discover, score concordat or admit concordant.**

- **concordant** = IDLE: HOLD; header and body versions agree; tools fire
- **mismatched** = #93290 seeded path: header 2025-11-25 vs `_meta` 2026-07-28; `-32020`
- **concordat** = product score word for the treaty that never forms
- **header-mismatch** = path word: the two instruments never form a concord
- **discord** = path alias
- **hold** = HOLD alias for idle concordant
- **legacy** = VS Code initialize 2025-11-25 with no `_meta`; tools work
- **discover** = SEP-2575 via `server/discover` negotiates 2026-07-28
- **header-stale** = Desktop / CLI keep `Mcp-Protocol-Version: 2025-11-25`
- **body-new** = `params._meta` protocolVersion is 2026-07-28
- **stateless-reject** = Go SDK `Stateless:true` rejects `-32020` / HTTP 400
- **relay-32603** = connector relays the reject as `-32603`
- **connected-lie** = UI shows Connected; every tool call fails
- **sep-2575** = header must match per-request `_meta`
- **has-repro** = Desktop 1.49585.0 / CLI 2.1.267 macOS · StephaneBernard
- **cousins** = cite-only #92835 — do not rebuild
- **backups** = cite-only go-sdk#1162 #1164 — do not auto-pick as primary
- **fixtures** = row list for the concordat booth
- **walk** = published idle concordant → discover → header-stale → body-new → stateless-reject → relay-32603 → connected-lie → mismatched → header-mismatch → legacy

Verdicts: concordant, mismatched, concordat, header-mismatch, discord, hold, legacy, discover, header-stale, body-new, connected-lie, relay-32603, stateless-reject, sep-2575, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring treaty desk. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the instruments are **mismatched** / **concordat** or already **concordant**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): Desktop/CLI keep a stale 2025-11-25 header default after SEP-2575 discover, so the header never forms a concord with `_meta` 2026-07-28. Invite verify against #93290 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93290](https://github.com/anthropics/claude-code/issues/93290)
- Cite-only cousin: [anthropics/claude-code#92835](https://github.com/anthropics/claude-code/issues/92835) (related header-vs-negotiated-version; drifted toward VS Code tools-loading)
- Backup (data only): [modelcontextprotocol/go-sdk#1162](https://github.com/modelcontextprotocol/go-sdk/issues/1162) (client header from default/context)
- Backup (data only): [modelcontextprotocol/go-sdk#1164](https://github.com/modelcontextprotocol/go-sdk/issues/1164) (same asymmetry, client-side fix)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:mcp
- Claude Code 2.1.267 (CLI macOS failing; VS Code Linux working)
- Claude for Mac 1.49585.0 failing
- After `server/discover` negotiates 2026-07-28 (SEP-2575)
- HTTP header stays `Mcp-Protocol-Version: 2025-11-25`
- JSON-RPC `_meta` carries `2026-07-28`
- Go MCP SDK v1.7.0 `StreamableHTTPOptions{Stateless:true}` rejects `-32020` HEADER_MISMATCH / HTTP 400
- Connector relays `-32603`
- UI shows Connected; every tool call fails
- VS Code extension path: legacy initialize 2025-11-25, no `_meta`, tools work

Problem found: WHEN DESKTOP OR CLI SEND A 2025-11-25 HEADER WITH A 2026-07-28 _META AFTER SEP-2575 DISCOVER.

Why this solution: a diagnostic diplomatic chancery / treaty-desk for the concordant → mismatched drift, so a reader can pin idle concordant, load the #93290 mismatched path, and score header-mismatch / discord against the published facts. Conceptual header instrument, body instrument, and wax seal show whether the versions stayed concordant. No live Claude session is required.

## Why not a clone

This is specifically: **HEADER 2025-11-25 VS _META 2026-07-28 AFTER SEP-2575 DISCOVER → STATELESS -32020 HEADER_MISMATCH.**

**NOT Revenant/#93274** (Windows WMI peer-liveness timeout-kill orphans). Different defect.

**NOT Replevin/#93207** (iOS ExitPlanMode setMode auto + default fallback). Different defect.

**NOT Cognate/#93250** (plugin MCP `${PLUGIN_ROOT}` left unexpanded). Different defect.

**NOT Lemures/#93256** (mid-turn task-summary classifier keeps previous `latestAsk` across `/clear`). Different defect.

**NOT Escheat/#93231** (VS Code window-close leaves git worktree `locked` naming a dead PID). Different defect.

**NOT Mortmain/#93173** (sandbox `denyWithinAllow` freezes tracked `.claude` paths). Different defect.

**NOT Strowger/#93218** (Desktop `--disallowedTools SendMessage` while ListAgents still lists). Different paradigm.

**NOT Mondegreen/#93193** (worktree Bash substring `git`). Different paradigm.

**NOT Flashpan/#93015** (scheduled lastRunAt never births a session). Different paradigm.

**NOT Clepsydra** (OTel stall). Different paradigm.

**NOT #92835 itself** (related header-vs-negotiated-version; drifted toward VS Code tools-loading) — cite only; primary is the SEP-2575 header↔`_meta` discord.

**NOT Vernier/#93219** (millimeter-slider leftover — forbidden as primary).

**NOT Derby/#93197.** **NOT Vizard/#93190.**

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **negotiated protocol version vs stale HTTP header → stateless HEADER_MISMATCH** — unused in catalog as this treaty-desk / protocol-desk walk.

Do NOT rename this product Revenant, Replevin, Cognate, Lemures, Escheat, Mortmain, Strowger, Mondegreen, Flashpan, Clepsydra, or any existing catalog slug.
Do NOT reuse idle concordant / mismatched / header-mismatch on a later booth.
Do NOT reuse Young Serif + Mulish + DM Mono (Revenant). Do NOT reuse Literata + Sora + Roboto Mono (Replevin). Do NOT reuse Fraunces + Source Sans 3 + IBM Plex Mono (Cognate). Do NOT reuse Libre Baskerville + Red Hat Text + JetBrains Mono (Lemures). Do NOT reuse Cardo + Figtree + Fragment Mono (Escheat). Do NOT reuse Cinzel (Mortmain). Do NOT reuse Syne + Karla (Strowger). Do NOT reuse Cormorant Garamond + Outfit + Space Mono (Mondegreen). Display here is **Vollkorn**. Body is **DM Sans**. Mono is **Inconsolata**.

Different surface: MCP header↔`_meta` version discord vs WMI timeout-kill orphans / iOS setMode auto / unexpanded PLUGIN_ROOT / remanent classifier / worktree lock leftover / sandbox freeze / SendMessage cut / git substring / scheduled flash / OTel stall.

Product name stays **Concordat**. Name/slug `concordat` unused in catalog.json (266 products before this ship; Revenant is #264).

Different UI: diplomatic chancery / treaty desk / protocol desk / parchment / seal-wax / ink / brass. Vollkorn / DM Sans / Inconsolata. NOT Victorian séance parlor / process-tomb (Revenant). NOT legal replevin chamber / writ desk (Replevin). NOT comparative philology / manuscript cognate desk (Cognate). NOT Roman Lemuria night courtyard (Lemures). NOT feudal escheat chamber (Escheat). NOT muniment room (Mortmain). NOT Strowger exchange / switchboard. NOT ballad-sheet studio (Mondegreen). NOT flintlock flash-pan (Flashpan). NOT water clock (Clepsydra).

Different verbs: Read the header, Score concordat, Press the seal, Compare the instruments, Pin idle concordant, Pin seeded mismatched, Pin header-mismatch, Admit VS Code legacy, Reset the desk.

Different idle: **concordant**. Different #93290 seeded path: **mismatched**. HOLD: **concordant** / **hold** / **legacy**. ALARM: **mismatched** / **concordat** / **header-mismatch** / **discord** / **stateless-reject**. Path: **header-mismatch**.

## How to score

```bash
node --test projects/concordat/concordat.test.mjs
node projects/concordat/concordat.mjs projects/concordat/data/concordat.json
echo '{"seed":"mismatched"}' | node projects/concordat/concordat.mjs
```

Open the living card at `projects/concordat/index.html` (or the live path `/concordat/`). Buttons: Read the header, Score concordat, Press the seal, Compare the instruments, Pin idle concordant, Pin seeded mismatched, Pin header-mismatch, Admit VS Code legacy, Reset the desk. Toggle header stuck / body `_meta` / stateless / Connected / tools fail / VS Code legacy — the score flips. Lay a fixture JSON on the blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s discover / stale header / new `_meta` / `-32020` walk from the published #93290 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/concordat/
- Folder: `projects/concordat/`

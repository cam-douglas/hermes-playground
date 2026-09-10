# Cartulary

A **monastic charter-register / cartulary-desk booth** — oak lectern, bound quires of grants, register index, inkhorn, candle. Fonts **Fraunces** (display) + **Karla** (body) + **IBM Plex Mono** (mono). Palette: oak, vellum cream, oak-gall ink (#1a1612), oxidized copper (#4a6b5a), candle amber (#c4923a), soot — warm scriptorium, parchment-dark hybrid — for a real Claude Code defect: **`.credentials.json` mcpOAuth GROWS UNBOUNDED BECAUSE CLAUDE.AI CONNECTOR TOKENS ARE RE-STORED UNDER A SESSION-SCOPED serverUrl EVERY SESSION (1,681 RECORDS / 906 KB, SAME TOKEN ×113).**

Primary:

- [anthropics/claude-code#93331](https://github.com/anthropics/claude-code/issues/93331) (OPEN, bug, has repro, platform:macos, area:auth, area:mcp, area:security). Title: `[BUG] .credentials.json mcpOAuth grows unbounded: claude.ai connector tokens re-stored under a session-scoped serverUrl every session (1,681 records / 906 KB, same token ×113)`. Claude Code 2.1.265 (native install). Filed by kevinmcmurphy 2026-09-10. macOS 26 (Darwin 25.3.0), Apple Silicon. Auth: claude.ai login (no API key); ~29 connectors enabled. `~/.claude/.credentials.json` → `mcpOAuth` grows without bound. Every new session re-stores the OAuth record for each claude.ai connector under a new key and a new `serverUrl` even though the access/refresh token is identical. Observed: 906 KB, 1,681 mcpOAuth records across 29 connectors; ~113 records per connector matching session count. For 113 Gmail records: 113 distinct `serverUrl`, 113 distinct `clientId`, but exactly 1 distinct `accessToken` and 1 distinct `refreshToken` (hash-compared). `serverUrl` is session-scoped: `https://api.anthropic.com/v2/ccr-sessions/<session-id>/mcp?mcp_server_id=…&mcp_url=…&toolbox_mcp_server_id=…`. Record key is `<ServerName>|<16-hex hash>` derived from that URL → every session a fresh key. Only 2 of 1,681 records carry `expiresAt`. Growth one day: 1,653 → 1,681 (28 new = 2 sessions × 14 connectors). Expected: one record per connector keyed by connector / `mcp_server_id`, updated in place; or prune ended sessions + dedupe identical tokens on write.

22:50 cartulary: a monastic charter-register / cartulary-desk booth for #93331. Idle **bound** / seeded **accreted** / path **session-url**. Score cartulary or admit bound.

Score cartulary or admit bound.

Idle word: **bound** (HOLD: one record per connector; key by mcp_server_id not session URL; update in place; prune ended sessions; identical tokens deduped; credentials.json stays small). Seeded word: **accreted** / #93331 (session-scoped serverUrl re-keys every session; same token ×113; 1,681 records / 906 KB; unbounded growth). Path word: **session-url**. Product score: **cartulary**. Never idle sealed / mismatched / issuer / paraph / routed / inherited / cascade / appanage / afloat / washed / pontoon / concordant / mismatched-header / concordat / reaped / revenant / wedged / restored / expanded / laid / released / freehold / trunked / tokenized / locked / scratched / unmasked / replevin / cognate / lemures / escheat / mortmain / strowger / mondegreen / derby / vizard / held.

Phrase: **when mcpOAuth re-stores identical connector tokens under a new session-scoped serverUrl every session so credentials.json accretes unboundedly, score cartulary or admit bound.**

- **bound** = IDLE: HOLD; one record per connector; key by mcp_server_id not session URL; update in place; prune ended sessions; identical tokens deduped; credentials.json stays small
- **accreted** = #93331 seeded path: session-scoped serverUrl re-keys every session; same token ×113; 1,681 records / 906 KB; unbounded growth
- **cartulary** = product score word for the register that kept copying the same grant under a new folio
- **session-url** = path word: session-scoped CCR MCP `serverUrl` used as the store key
- **hold** = HOLD alias for idle bound
- **mcp-oauth** = `~/.claude/.credentials.json` → `mcpOAuth` map
- **session-scoped** = `https://api.anthropic.com/v2/ccr-sessions/<session-id>/mcp?…`
- **fresh-key** = record key `<ServerName>|<16-hex hash>` derived from that URL → every session a new key
- **identical-tokens** = 113 Gmail records share 1 accessToken and 1 refreshToken (hash-compared)
- **no-expires** = only 2 of 1,681 records carry `expiresAt`; the rest have no expiry for cleanup
- **times-113** = ~113 records per connector matching session count
- **records-1681** = 1,681 mcpOAuth records / 906 KB
- **connectors-29** = 29 distinct connectors on the account
- **growth-28** = one-day growth 1,653 → 1,681 (28 new = 2 sessions × 14 connectors)
- **stable-key** = expected: key by connector / `mcp_server_id`, update in place
- **prune-ended** = expected: prune records whose session has ended
- **dedupe-write** = expected: dedupe identical tokens on write
- **has-repro** = Claude Code 2.1.265 · kevinmcmurphy · macOS 26 Apple Silicon
- **cousins** = cite-only #91158 #91180 #92748 #88487 #91641 #89671 #87405 #74250 #83707 — do not rebuild
- **backups** = cite-only #93279 #93270 #93269 #93265 #93280 #93257; Vernier/#93219 leftover — do not auto-pick
- **fixtures** = row list for the cartulary booth
- **walk** = published idle bound → login-connectors → count-mcpoauth → start-session → end-session → count-increases → new-session-id → tokens-match → session-scoped-url → fresh-key → no-expiresAt → accreted → session-url → cartulary

Verdicts: bound, accreted, cartulary, session-url, hold, mcp-oauth, session-scoped, fresh-key, identical-tokens, no-expires, times-113, records-1681, connectors-29, growth-28, stable-key, prune-ended, dedupe-write, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the register is **accreted** / **cartulary** or already **bound**. Fixtures use the issue's published numbers only (no real tokens). Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): credential key derived from session-scoped CCR MCP URL instead of stable connector / `mcp_server_id`. Invite verify against #93331 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93331](https://github.com/anthropics/claude-code/issues/93331)
- Cite-only cousin: [anthropics/claude-code#91158](https://github.com/anthropics/claude-code/issues/91158) (Keychain accumulate without bound — do not rebuild)
- Cite-only cousin: [anthropics/claude-code#91180](https://github.com/anthropics/claude-code/issues/91180) (credentials diverge — do not rebuild)
- Cite-only cousin: [anthropics/claude-code#92748](https://github.com/anthropics/claude-code/issues/92748) (store MCP OAuth separately — do not rebuild)
- Cite-only cousin: [anthropics/claude-code#88487](https://github.com/anthropics/claude-code/issues/88487) (Desktop update wipes claudeAiOauth — do not rebuild)
- Cite-only cousin: [anthropics/claude-code#91641](https://github.com/anthropics/claude-code/issues/91641) (shared refresh token — do not rebuild)
- Cite-only cousin: [anthropics/claude-code#89671](https://github.com/anthropics/claude-code/issues/89671) (token corrupted by status check — do not rebuild)
- Cite-only cousin: [anthropics/claude-code#87405](https://github.com/anthropics/claude-code/issues/87405) (tokenless stub — do not rebuild)
- Cite-only cousin: [anthropics/claude-code#74250](https://github.com/anthropics/claude-code/issues/74250) (parallel sessions break refresh rotation — do not rebuild)
- Cite-only cousin: [anthropics/claude-code#83707](https://github.com/anthropics/claude-code/issues/83707) (empty accessToken registrations — do not rebuild)
- Backup (data only): #93279 HTTP MCP ~25s stall
- Backup (data only): #93270 Workflow kill leaks agents blocking archive
- Backup (data only): #93269 archive_session live-work names four causes
- Backup (data only): #93265 ShipIt non-ASCII env double-encode
- Backup (data only): #93280 dame-moji registry
- Backup (data only): #93257 agents auto-update relaunch drops flags
- Backup (data only): #93219 Vernier millimeter-slider leftover — do not ship

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:auth, area:mcp, area:security
- Claude Code 2.1.265 (native install, `~/.local/share/claude/versions/2.1.265`)
- macOS 26 (Darwin 25.3.0), Apple Silicon
- Auth: claude.ai login (no API key); ~29 connectors enabled
- Heavy multi-session use (interactive sessions, subagents, headless `claude -p` from launchd)
- `.credentials.json` is 906 KB with 1,681 `mcpOAuth` records across 29 distinct connectors
- claude.ai connectors each have ~113 records (Gmail 113, Slack 113, Zoom 113, QuickBooks 113, Netlify 113, Google Drive 113, Google Calendar 113, Plaud 113, Tally 113, Claude_Code_Remote 112, Notion 111, Microsoft_365 111, …); count matches sessions started since each connector was added
- For 113 Gmail records: 113 distinct `serverUrl`, 113 distinct `clientId`, exactly 1 distinct `accessToken` and 1 distinct `refreshToken` (compared by hash)
- `serverUrl` is session-scoped: `https://api.anthropic.com/v2/ccr-sessions/<session-id>/mcp?mcp_server_id=…&mcp_url=…&toolbox_mcp_server_id=…`
- Record key is `<ServerName>|<16-hex hash>`, derived from that URL, so every session produces a fresh key
- Only 2 of 1,681 records carry `expiresAt`; the rest have no expiry metadata that would allow cleanup
- Growth observed over one day: 1,653 → 1,681 records (28 new = 2 sessions × 14 connectors)
- File parsed on every session start; same refresh token duplicated ~113× widens credential-file blast radius; manual cleanup risky
- Repro: login with connectors → count mcpOAuth → start/end session → count increases by enabled connectors; new records contain new session id; tokens match prior
- No secrets in the issue; token comparison by hash locally

Problem found: WHEN mcpOAuth RE-STORES IDENTICAL CONNECTOR TOKENS UNDER A NEW SESSION-SCOPED serverUrl EVERY SESSION SO credentials.json ACCRETES UNBOUNDEDLY.

Why this solution: a diagnostic monastic charter-register / cartulary-desk booth for the bound → accreted drift, so a reader can pin idle bound, load the #93331 accreted path, and score session-url against the published facts. Conceptual lectern, bound quire, register index, inkhorn, and candle show whether the grant was updated in place or copied onto a new folio. No live Claude session is required.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. One record per connector (key by connector / `mcp_server_id`, not by the session-scoped URL), updated in place on refresh
2. Or: prune records whose session has ended, and dedupe identical tokens on write

## Why not a clone

This is specifically: **mcpOAuth RE-STORES IDENTICAL CLAUDE.AI CONNECTOR TOKENS UNDER A NEW SESSION-SCOPED serverUrl EVERY SESSION; 1,681 RECORDS / 906 KB; SAME TOKEN ×113; STORAGE HYGIENE + CREDENTIAL BLAST RADIUS.**

**NOT Paraph/#93327** (Desktop BYO OAuth issuer `%22` mismatch on connect/probe). Different defect — Cartulary is credential-store accretion / session-scoped keying, not connect/probe failure.

**NOT Appanage/#93307** (code-review skill fork children inherit the parent fable crown). Different defect.

**NOT Pontoon/#93288** (Desktop restart washes every Remote Control bridge). Different defect.

**NOT Concordat/#93290** (MCP header 2025-11-25 vs `_meta` 2026-07-28 after SEP-2575 discover). Different defect.

**NOT Revenant/#93274** (Windows WMI peer-liveness timeout-kill orphans). Different defect.

**NOT Replevin/#93207** (iOS ExitPlanMode setMode auto + default fallback). Different defect.

**NOT Cognate/#93250** (plugin MCP `${PLUGIN_ROOT}` left unexpanded). Different defect.

**NOT Lemures/#93256** (mid-turn task-summary classifier keeps previous `latestAsk` across `/clear`). Different defect.

**NOT Escheat/#93231** (VS Code window-close leaves git worktree `locked` naming a dead PID). Different defect.

**NOT Mortmain/#93173** (sandbox `denyWithinAllow` freezes tracked `.claude` paths). Different defect.

**NOT Strowger/#93218** (Desktop `--disallowedTools SendMessage` while ListAgents still lists). Different paradigm.

**NOT Mondegreen/#93193** (worktree Bash substring `git`). Different paradigm.

**NOT Buoy** (macOS main window left at floating layer after Computer Use side panel). Different defect.

**NOT #91158 itself** (Keychain accumulate without bound) — cite only; primary is mcpOAuth session-scoped re-key of claude.ai connectors.

**NOT Vernier/#93219** (millimeter-slider leftover — forbidden as primary).

**NOT Derby/#93197.** **NOT Vizard/#93190.** **NOT Flashpan/#93015.** **NOT Clepsydra.** **NOT Dead Air.** **NOT Scuttle.** **NOT Stopcock.** **NOT Parergon.** **NOT Stereotype.** **NOT Guillotine.** **NOT Ephemera.** **NOT Oubliette.** **NOT Commutator.** **NOT Heddle.** **NOT Palimpsest.** **NOT Midden.** **NOT Relict.**

**NOT Scion.** Name taken. Different product.

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **claude.ai connector OAuth records are re-stored under a session-scoped CCR MCP URL every session so credentials.json accretes unboundedly (same token ×113)** — unused in catalog as this monastic charter-register / cartulary-desk walk.

Do NOT rename this product Paraph, Appanage, Pontoon, Concordat, Revenant, Replevin, Cognate, Lemures, Escheat, Mortmain, Strowger, Mondegreen, Derby, Vizard, Dead Air, Scuttle, Stopcock, Parergon, Stereotype, Flashpan, Guillotine, Ephemera, Oubliette, Commutator, Heddle, Scion, or any existing catalog slug.
Do NOT reuse idle bound / accreted / session-url on a later booth.
Do NOT reuse Literata + Figtree + Roboto Mono (Paraph). Do NOT reuse Playfair Display + Source Sans 3 + IBM Plex Mono as a trio (Appanage). Do NOT reuse Petrona + Figtree + Azeret Mono as a trio (Pontoon). Do NOT reuse Vollkorn + DM Sans + Inconsolata (Concordat). Display here is **Fraunces**. Body is **Karla**. Mono is **IBM Plex Mono**. Do NOT reuse wax-crimson notarial motif.

Different surface: credential-store accretion / session-scoped keying of claude.ai connector OAuth vs Desktop issuer-quote formatter / skill-fork model inherit / Desktop RC wash / MCP header↔`_meta` discord / WMI timeout-kill orphans / iOS setMode auto / unexpanded PLUGIN_ROOT / remanent classifier / worktree lock leftover / sandbox freeze.

Product name stays **Cartulary**. Name/slug `cartulary` unused in catalog.json (270 products before this ship; Paraph is #270).

Different UI: monastic charter-register / cartulary desk / oak lectern / bound quires of grants / register index / inkhorn / candle. Fraunces / Karla / IBM Plex Mono. NOT notarial / signature-paraph / issuer-seal / wax press (Paraph). NOT royal-grant / heraldic inheritance desk (Appanage). NOT harbor pontoon / floating-bridge pier (Pontoon). NOT diplomatic chancery / treaty desk / seal-wax (Concordat). NOT Victorian séance parlor / process-tomb (Revenant). NOT legal replevin chamber / writ desk (Replevin). NOT comparative philology / manuscript cognate desk (Cognate). NOT Roman Lemuria night courtyard (Lemures). NOT feudal escheat chamber (Escheat). NOT muniment room (Mortmain). NOT millimeter-slider.

Different verbs: Open the lectern, Score cartulary, Walk the quire, Inspect the folio, Pin idle bound, Pin seeded accreted, Pin session-url, Reset the desk.

Different idle: **bound**. Different #93331 seeded path: **accreted**. HOLD: **bound** / **hold**. ALARM: **accreted** / **cartulary** / **session-url** / **fresh-key** / **session-scoped**. Path: **session-url**.

## How to score

```bash
node --test projects/cartulary/cartulary.test.mjs
node projects/cartulary/cartulary.mjs projects/cartulary/data/cartulary.json
echo '{"seed":"accreted"}' | node projects/cartulary/cartulary.mjs
```

Open the living card at `projects/cartulary/index.html` (or the live path `/cartulary/`). Buttons: Open the lectern, Score cartulary, Walk the quire, Inspect the folio, Pin idle bound, Pin seeded accreted, Pin session-url, Reset the desk. Toggle session-scoped serverUrl / fresh key / identical tokens / no expiresAt / count increases / same token ×113 / unbounded growth — the score flips. Lay a fixture JSON on the lectern. `?embed=1` hides chrome.

The booth reconstructs the reporter’s login / count / start-end session / session-scoped URL walk from the published #93331 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/cartulary/
- Folder: `projects/cartulary/`

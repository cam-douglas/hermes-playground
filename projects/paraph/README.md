# Paraph

A **notarial / signature-paraph / issuer-seal booth** — notarial instrument, wax press, issuer ribbon, signature flourish. Fonts **Literata** (display) + **Figtree** (body) + **Roboto Mono** (mono). Palette: notarial ink, parchment, wax-seal crimson, brass, graphite — dark chamber with a wax-seal motif — for a real Claude Desktop defect: **DESKTOP BYO OAUTH MCP CONNECT FAILS THE VERSION-NEGOTIATION PROBE WITH A MALFORMED RFC 8414 §3.3 ISSUER MISMATCH WHOSE QUOTES OPEN REAL AND CLOSE %22.**

Primary:

- [anthropics/claude-code#93327](https://github.com/anthropics/claude-code/issues/93327) (OPEN, bug, has repro, platform:windows, platform:macos, area:auth, area:mcp, regression, area:desktop). Title: `[BUG] Desktop: BYO OAuth MCP connect fails with malformed "Issuer mismatch (RFC 8414 §3.3)" error — same version-negotiation probe as #87713`. Claude Desktop 1.49585.0 (41ad1d). Filed by Simonmaignan 2026-09-10. Reporter on Windows; a colleague reproduced the identical error on macOS. Connecting a Desktop HTTP MCP connector configured with BYO OAuth (`oauth.mode: "byo"`, explicit `clientId` / `clientSecret` / `authorizationServer`) against a Snowflake-hosted MCP server fails the version-negotiation probe. Both `expected` and `received` open with a literal `"` and close with the literal characters `%22`. The error is byte-identical across hostname case variants and a from-scratch minimal config. No browser OAuth window opens. Failed request: HTTP `…/mcp-servers/<server>` → `initialize`. Claude Code CLI (`claude mcp add-json`, same URL / account / OAuth) connects and authenticates successfully. Regression: the same connector worked a few days ago with no config changes.

20:50 paraph: a notarial / signature-paraph / issuer-seal booth for #93327. Idle **sealed** / seeded **mismatched** / path **issuer**. Score paraph or admit sealed.

Score paraph or admit sealed.

Idle word: **sealed** (HOLD: issuer strings compared with real quotes; error formatter shows real values; Desktop OAuth window opens; Desktop matches CLI success). Seeded word: **mismatched** / #93327 (%22 closing artifact). Path word: **issuer**. Product score: **paraph**. Never idle routed / inherited / cascade / appanage / afloat / washed / pontoon / concordant / mismatched-header / concordat / reaped / revenant / wedged / restored / expanded / laid / released / freehold / trunked / tokenized / locked / scratched / unmasked / replevin / cognate / lemures / escheat / mortmain / strowger / mondegreen / derby / vizard / held.

Phrase: **when Desktop BYO OAuth MCP connect fails the version-negotiation probe with a malformed RFC 8414 issuer mismatch whose quotes open real and close %22, score paraph or admit sealed.**

- **sealed** = IDLE: HOLD; issuer strings compared with real quotes; formatter shows real values; Desktop OAuth window opens; Desktop matches CLI
- **mismatched** = #93327 seeded path: %22 closing artifact; probe fails; no OAuth window; CLI still works
- **paraph** = product score word for the notarial flourish that closed with `%22` instead of a real quote
- **issuer** = path word: RFC 8414 §3.3 issuer-string through the version-negotiation probe
- **hold** = HOLD alias for idle sealed
- **byo-oauth** = `oauth.mode: "byo"` with explicit clientId / clientSecret / authorizationServer
- **percent-22** = both expected and received close with the literal characters `%22`
- **malformed-template** = opens with literal `"` and closes with `%22` — broken interpolation, not a genuine issuer mismatch
- **config-invariant** = byte-identical error across hostname case variants and a from-scratch minimal config
- **desktop-only** = isolates the bug to Desktop MCP connect; CLI succeeds
- **cli-ok** = `claude mcp add-json` against the same URL / account / OAuth authenticates
- **cross-platform** = reporter Windows; colleague reproduced the identical error on macOS
- **regression** = same Snowflake MCP connector worked a few days ago; no config changes
- **rfc-8414** = error cites Issuer mismatch in authorization server metadata (RFC 8414 §3.3)
- **version-negotiation-probe** = sibling of #87713 probe subsystem; different code path (not no-cached-tokens first-connect)
- **no-browser-window** = Desktop never opens the OAuth window on failure
- **initialize-fail** = Failed request: HTTP `…/mcp-servers/<server>` → `initialize`
- **has-repro** = Claude Desktop 1.49585.0 (41ad1d) · Simonmaignan · Windows + macOS
- **cousins** = cite-only #87713 #90970 #88370 — do not rebuild
- **backups** = cite-only #93279 #93270 #93269 #93265 #93280 #93257; Vernier/#93219 leftover — do not auto-pick
- **fixtures** = row list for the paraph booth
- **walk** = published idle sealed → byo-oauth → sign-in-test → version-negotiation-probe → percent-22 → malformed-template → config-invariant → no-browser-window → initialize-fail → cli-ok → mismatched → issuer → paraph

Verdicts: sealed, mismatched, paraph, issuer, hold, byo-oauth, percent-22, malformed-template, config-invariant, desktop-only, cli-ok, cross-platform, regression, rfc-8414, version-negotiation-probe, no-browser-window, initialize-fail, sign-in-test, quoted, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No live Snowflake sessions. No secrets. No network to Anthropic or Snowflake required for scoring. Score whether the instrument is **mismatched** / **paraph** or already **sealed**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): broken string-interpolation / hardcoded %22 in Desktop version-negotiation probe error formatter. Invite verify against #93327 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93327](https://github.com/anthropics/claude-code/issues/93327)
- Cite-only cousin: [anthropics/claude-code#87713](https://github.com/anthropics/claude-code/issues/87713) (version-negotiation probe wraps a client-side auth error, misclassified as transport — no-cached-tokens first-connect; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#90970](https://github.com/anthropics/claude-code/issues/90970) (related prior art in the same subsystem; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#88370](https://github.com/anthropics/claude-code/issues/88370) (related prior art in the same subsystem; do not rebuild)
- Backup (data only): #93279 HTTP MCP ~25s stall
- Backup (data only): #93270 Workflow kill leaks agents blocking archive
- Backup (data only): #93269 archive_session live-work names four causes
- Backup (data only): #93265 ShipIt non-ASCII env double-encode
- Backup (data only): #93280 dame-moji registry
- Backup (data only): #93257 agents auto-update relaunch drops flags
- Backup (data only): #93219 Vernier millimeter-slider leftover — do not ship

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, platform:macos, area:auth, area:mcp, regression, area:desktop
- Claude Desktop 1.49585.0 (41ad1d)
- Reporter Windows; colleague reproduced the identical error on macOS
- BYO OAuth: `oauth.mode: "byo"`, explicit `clientId` / `clientSecret` / `authorizationServer`
- Error: `Version negotiation probe failed: Issuer mismatch in authorization server metadata (RFC 8414 §3.3): expected "https://<account>.snowflakecomputing.com/oauth%22, received "https://<account>.snowflakecomputing.com/oauth%22`
- Message template malformed: both expected and received open with literal `"` and close with literal characters `%22`
- Error byte-identical across hostname case variants and a from-scratch minimal config — config content has no effect on reported expected/received
- No browser OAuth window opens on Desktop failure
- Failed request: HTTP `https://<account>.snowflakecomputing.com/api/v2/databases/<db>/schemas/<schema>/mcp-servers/<server>` → `initialize`
- Claude Code CLI (`claude mcp add-json`, same URL / account / OAuth) connects and authenticates successfully
- Regression: same Snowflake MCP connector worked a few days ago; no config changes
- Sibling of #87713 version-negotiation probe subsystem (different code path: #87713 is no-cached-tokens first-connect misclassified as transport)

Problem found: WHEN DESKTOP BYO OAUTH MCP CONNECT FAILS THE VERSION-NEGOTIATION PROBE WITH A MALFORMED RFC 8414 ISSUER MISMATCH WHOSE QUOTES OPEN REAL AND CLOSE %22.

Why this solution: a diagnostic notarial / signature-paraph / issuer-seal booth for the sealed → mismatched drift, so a reader can pin idle sealed, load the #93327 mismatched path, and score issuer against the published facts. Conceptual instrument, wax press, and issuer ribbon show whether the quotes closed with a real seal or with `%22`. No live Claude or Snowflake session is required.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Issuer values should be compared with real quotes, and the error should render real values/quoting so users can tell what differs
2. Or the client should recognize a probe/formatting bug and complete the OAuth flow — as Claude Code CLI does against the identical server

## Why not a clone

This is specifically: **DESKTOP BYO OAUTH MCP CONNECT FAILS THE VERSION-NEGOTIATION PROBE WITH A MALFORMED RFC 8414 §3.3 ISSUER MISMATCH WHOSE QUOTES OPEN REAL AND CLOSE %22; CLI SUCCEEDS; NO BROWSER WINDOW.**

**NOT Appanage/#93307** (code-review skill fork children inherit the parent fable crown). Different defect.

**NOT Pontoon/#93288** (Desktop restart washes every Remote Control bridge). Different defect.

**NOT Concordat/#93290** (MCP header 2025-11-25 vs `_meta` 2026-07-28 after SEP-2575 discover). Different defect — Concordat's mismatch is header/body version, not issuer quotes.

**NOT Revenant/#93274** (Windows WMI peer-liveness timeout-kill orphans). Different defect.

**NOT Replevin/#93207** (iOS ExitPlanMode setMode auto + default fallback). Different defect.

**NOT Cognate/#93250** (plugin MCP `${PLUGIN_ROOT}` left unexpanded). Different defect.

**NOT Lemures/#93256** (mid-turn task-summary classifier keeps previous `latestAsk` across `/clear`). Different defect.

**NOT Escheat/#93231** (VS Code window-close leaves git worktree `locked` naming a dead PID). Different defect.

**NOT Mortmain/#93173** (sandbox `denyWithinAllow` freezes tracked `.claude` paths). Different defect.

**NOT Strowger/#93218** (Desktop `--disallowedTools SendMessage` while ListAgents still lists). Different paradigm.

**NOT Mondegreen/#93193** (worktree Bash substring `git`). Different paradigm.

**NOT Buoy** (macOS main window left at floating layer after Computer Use side panel). Different defect.

**NOT Scion.** Name taken. Different product.

**NOT #87713 itself** (no-cached-tokens first-connect misclassified as transport) — cite only; primary is the malformed `%22` issuer-quote formatter on BYO OAuth.

**NOT Vernier/#93219** (millimeter-slider leftover — forbidden as primary).

**NOT Derby/#93197.** **NOT Vizard/#93190.** **NOT Flashpan/#93015.** **NOT Clepsydra.** **NOT Dead Air.** **NOT Scuttle.** **NOT Stopcock.** **NOT Parergon.** **NOT Stereotype.** **NOT Guillotine.** **NOT Ephemera.** **NOT Oubliette.** **NOT Commutator.** **NOT Heddle.**

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. NOT a live Snowflake session. No live Anthropic or Snowflake network required for scoring.

Different paradigm: **Desktop BYO OAuth MCP connect fails a version-negotiation probe whose error formatter opens quotes with `"` and closes them with `%22`; CLI against the same server succeeds** — unused in catalog as this notarial / signature-paraph / issuer-seal walk.

Do NOT rename this product Appanage, Pontoon, Concordat, Revenant, Replevin, Cognate, Lemures, Escheat, Mortmain, Strowger, Mondegreen, Derby, Vizard, Dead Air, Scuttle, Stopcock, Parergon, Stereotype, Flashpan, Guillotine, Ephemera, Oubliette, Commutator, Heddle, Scion, or any existing catalog slug.
Do NOT reuse idle sealed / mismatched / issuer on a later booth.
Do NOT reuse Playfair Display + Source Sans 3 + IBM Plex Mono (Appanage). Do NOT reuse Petrona + Figtree + Azeret Mono as a trio (Pontoon). Do NOT reuse Vollkorn + DM Sans + Inconsolata (Concordat). Do NOT reuse Literata + Sora + Roboto Mono as a trio (Replevin). Display here is **Literata**. Body is **Figtree**. Mono is **Roboto Mono**. Do NOT reuse Karla.

Different surface: malformed Desktop issuer-quote formatter on BYO OAuth vs skill-fork model inherit / Desktop RC wash / MCP header↔`_meta` discord / WMI timeout-kill orphans / iOS setMode auto / unexpanded PLUGIN_ROOT / remanent classifier / worktree lock leftover / sandbox freeze.

Product name stays **Paraph**. Name/slug `paraph` unused in catalog.json (269 products before this ship; Appanage is #269).

Different UI: notarial / signature-paraph / issuer-seal booth / notarial instrument / wax press / issuer ribbon / signature flourish. Literata / Figtree / Roboto Mono. NOT royal-grant / heraldic inheritance desk (Appanage). NOT harbor pontoon / floating-bridge pier (Pontoon). NOT diplomatic chancery / treaty desk / parchment / seal-wax (Concordat). NOT Victorian séance parlor / process-tomb (Revenant). NOT legal replevin chamber / writ desk (Replevin). NOT comparative philology / manuscript cognate desk (Cognate). NOT Roman Lemuria night courtyard (Lemures). NOT feudal escheat chamber (Escheat). NOT muniment room (Mortmain). NOT millimeter-slider.

Different verbs: Open the instrument, Score paraph, Walk the seal, Inspect the issuer, Pin idle sealed, Pin seeded mismatched, Pin issuer, Reset the chamber.

Different idle: **sealed**. Different #93327 seeded path: **mismatched**. HOLD: **sealed** / **hold**. ALARM: **mismatched** / **paraph** / **issuer** / **percent-22** / **malformed-template**. Path: **issuer**.

## How to score

```bash
node --test projects/paraph/paraph.test.mjs
node projects/paraph/paraph.mjs projects/paraph/data/paraph.json
echo '{"seed":"mismatched"}' | node projects/paraph/paraph.mjs
```

Open the living card at `projects/paraph/index.html` (or the live path `/paraph/`). Buttons: Open the instrument, Score paraph, Walk the seal, Inspect the issuer, Pin idle sealed, Pin seeded mismatched, Pin issuer, Reset the chamber. Toggle BYO OAuth / version-negotiation probe / %22 close / malformed template / no browser window / initialize fail / CLI still ok — the score flips. Lay a fixture JSON on the blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s BYO OAuth / version-negotiation probe / `%22` close walk from the published #93327 body. This page did not run Claude or Snowflake live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/paraph/
- Folder: `projects/paraph/`

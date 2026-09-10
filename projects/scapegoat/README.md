# Scapegoat

A **desert ritual / scapegoat-altar booth** — ash altar, ochre dust, bone linen, rust-blood mark, goat-bell, grant-table. Fonts **Libre Bodoni** (display) + **Outfit** (body) + **IBM Plex Mono** (mono). Palette: desert ash `#2a241c`, ochre `#c4a35a`, bone `#e8e0d0`, rust-blood `#8b3a2a`, goat-ink `#1a1410`, dry-wind haze — for a real Claude-in-Chrome defect: **AN UNGRANTED HOST MAKES executeScript-BASED TOOLS HANG THEIR FULL TIMEOUT AND BLAME THE PAGE, INSTEAD OF DENYING.**

Primary:

- [anthropics/claude-code#93348](https://github.com/anthropics/claude-code/issues/93348) (OPEN, bug, has repro, platform:macos, area:browser-extension, area:chrome). Title: `claude-in-chrome: an UNGRANTED host makes executeScript-based tools hang their full timeout and blame the page, instead of denying`. Filed by frankacano-dev 2026-09-10. macOS 26.6.2 Apple Silicon; Chrome 152.0.7977.83; Claude extension 1.0.91; Claude Code 2.1.267. Messages like `Failed to extract page text: Page still loading (executeScript waited 45000ms for document_idle)` and `Error capturing screenshot: Script injection timed out after 5000ms — the page is busy or mid-navigation` are FALSE: the page is `readyState` complete, `visibilityState` visible, the connection is healthy, and `javascript_tool` answers instantly on the same tab in the same `browser_batch`. A `computer` click on an ungranted domain already returns immediate named `Permission denied for this action on this domain`. Chrome can reset `runtime_granted_permissions` when HMAC over `extensions.settings` fails (hard kill), so grants vanish and the symptom looks like a flaky connection. Inside `browser_batch` a 45s hang blows the response budget.

23:50 scapegoat: a desert ritual / scapegoat-altar booth for #93348. Idle **honest** / seeded **scapegoated** / path **ungranted**. Score scapegoat or admit honest.

Score scapegoat or admit honest.

Idle word: **honest** (HOLD: check host grant BEFORE waiting for `document_idle`; return the same immediate named permission denial `computer` click already returns; name the host; point at site-access UI; never assert page-loading when injection was never established). Seeded word: **scapegoated** / #93348 (ungranted host → executeScript hangs → blame page). Path word: **ungranted**. Product score: **scapegoat**. Never idle bound / accreted / session-url / cartulary / sealed / mismatched / issuer / paraph / routed / inherited / cascade / appanage / afloat / washed / pontoon / concordant / concordat / reaped / revenant / restored / expanded / laid / released / freehold / trunked / tokenized / locked / scratched / unmasked / replevin / cognate / lemures / escheat / mortmain / strowger / mondegreen / derby / vizard / defaulted / literal / remanent / stale / phantom / exchanged / parsed / precedence / carrier / moored / primed / raised / preserved / banked / voided / flashed / fallen / scaffold.

Phrase: **when an ungranted host makes executeScript hang its full timeout and blame the page instead of denying, score scapegoat or admit honest.**

- **honest** = IDLE: HOLD; check host grant before `document_idle`; named deny; name the host; point at site-access UI; never blame a complete page
- **scapegoated** = #93348 seeded path: ungranted host → executeScript hangs → blame page
- **scapegoat** = product score word for the altar that hung executeScript and blamed a complete page
- **ungranted** = path word: host grant through executeScript at `document_idle`
- **hold** = HOLD alias for idle honest
- **execute-script** = `get_page_text` / `read_page` / `find` / `computer` screenshot hang to timeout
- **document-idle** = executeScript waited 45000ms for `document_idle`
- **page-blame** = timeout message asserts the page is still loading while `readyState` is complete
- **grant-check** = consult host grant before waiting
- **named-deny** = `computer` click already returns `Permission denied for this action on this domain`
- **javascript-ok** = `javascript_tool` / `navigate` / `chrome.tabs` reads succeed on the same ungranted tab
- **batch-budget** = a 45s hang inside `browser_batch` returns `browser_batch did not respond in time`
- **hmac-grant-loss** = Chrome HMAC over `extensions.settings` can wipe `runtime_granted_permissions` after a hard kill
- **has-repro** = Claude Code 2.1.267 · frankacano-dev · macOS 26.6.2 Apple Silicon · Chrome 152.0.7977.83 · extension 1.0.91
- **cousins** = cite-only #92370 #50842 #66074 #71813 #74696 #85999 — do not rebuild
- **backups** = cite-only #93345 #93279 #93270 #93269 #93265 #93280 #93257; Vernier/#93219 leftover — do not auto-pick
- **fixtures** = grant/deny matrix and three-path table for the scapegoat booth
- **walk** = published idle honest → tabs-context → navigate-ungranted → javascript-ok → execute-script → document-idle → page-blame → screenshot-timeout → navigate-granted → navigate-back → named-deny → batch-budget → hmac-grant-loss → scapegoated → ungranted → scapegoat

Verdicts: honest, scapegoated, scapegoat, ungranted, hold, execute-script, document-idle, page-blame, grant-check, named-deny, javascript-ok, batch-budget, hmac-grant-loss, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the altar is **scapegoated** / **scapegoat** or already **honest**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): executeScript path does not consult host grant before waiting for `document_idle`, unlike `computer` click. Invite verify against #93348 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93348](https://github.com/anthropics/claude-code/issues/93348)
- Cite-only cousin: [anthropics/claude-code#92370](https://github.com/anthropics/claude-code/issues/92370) (do not rebuild)
- Cite-only cousin: [anthropics/claude-code#50842](https://github.com/anthropics/claude-code/issues/50842) (do not rebuild)
- Cite-only cousin: [anthropics/claude-code#66074](https://github.com/anthropics/claude-code/issues/66074) (do not rebuild)
- Cite-only cousin: [anthropics/claude-code#71813](https://github.com/anthropics/claude-code/issues/71813) (do not rebuild)
- Cite-only cousin: [anthropics/claude-code#74696](https://github.com/anthropics/claude-code/issues/74696) (do not rebuild)
- Cite-only cousin: [anthropics/claude-code#85999](https://github.com/anthropics/claude-code/issues/85999) (do not rebuild)
- Backup (data only): #93345
- Backup (data only): #93279 HTTP MCP ~25s stall
- Backup (data only): #93270 Workflow kill leaks agents blocking archive
- Backup (data only): #93269 archive_session live-work names four causes
- Backup (data only): #93265 ShipIt non-ASCII env double-encode
- Backup (data only): #93280 dame-moji registry
- Backup (data only): #93257 agents auto-update relaunch drops flags
- Backup (data only): #93219 Vernier millimeter-slider leftover — do not ship

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:browser-extension, area:chrome
- Claude Code 2.1.267 · Claude extension 1.0.91 · Chrome 152.0.7977.83
- macOS 26.6.2 Apple Silicon; one Chrome install, one profile
- Repro table: granted `www.google.com` → `javascript_tool` / `get_page_text` / screenshot work; ungranted `example.com` → `javascript_tool` works, `get_page_text` 45000ms timeout, screenshot 5000ms timeout
- Navigate back to the ungranted host fails again — permission fault, not transient
- Three injection paths: (1) immediate eval `javascript_tool` / `navigate` / tabs reads SUCCEED; (2) executeScript at `document_idle` `get_page_text` / `read_page` / `find` / `computer` screenshot HANG to timeout; (3) up-front permission check `computer` click DENIES immediately by name
- Page is `readyState` complete and `visibilityState` visible while the timeout blames loading
- Chrome HMAC over `extensions.settings` can wipe `runtime_granted_permissions` after a hard kill
- Inside `browser_batch` a 45s hang returns `browser_batch did not respond in time`

Problem found: WHEN AN UNGRANTED HOST MAKES executeScript HANG ITS FULL TIMEOUT AND BLAME THE PAGE INSTEAD OF DENYING.

Why this solution: a diagnostic desert ritual / scapegoat-altar booth for the honest → scapegoated drift, so a reader can pin idle honest, load the #93348 scapegoated path, and score ungranted against the published facts. Conceptual ash altar, goat-bell, bone linen, and grant-table show whether the host was named or the page was blamed. No live Claude session is required.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. `get_page_text`, `read_page`, `find` and `computer` screenshot should check the host grant before waiting for `document_idle`, and return the same immediate named error that `computer` click already returns — ideally naming the host and pointing at the extension's site-access UI
2. Failing that, the timeout message should not assert that the page is loading when the extension has not established that it can inject at all

## Why not a clone

This is specifically: **AN UNGRANTED HOST MAKES executeScript-BASED TOOLS HANG THEIR FULL TIMEOUT AND BLAME THE PAGE; javascript_tool SUCCEEDS; computer CLICK ALREADY DENIES BY NAME.**

**NOT Cartulary/#93331** (mcpOAuth accretes under a session-scoped `serverUrl`). Different defect. NOT oak scriptorium.

**NOT Paraph/#93327** (Desktop BYO OAuth issuer quotes close `%22`). Different defect. NOT notarial seal.

**NOT Appanage/#93307** (code-review skill fork children inherit the parent fable crown). Different defect.

**NOT Pontoon/#93288** (Desktop restart washes every Remote Control bridge). Different defect. NOT harbor pontoon.

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

**NOT Scion.** Name taken. Different product.

**NOT Vernier/#93219** (millimeter-slider leftover — forbidden as primary).

**NOT Derby/#93197.** **NOT Vizard/#93190.** **NOT Flashpan/#93015.** **NOT Clepsydra.** **NOT Dead Air.** **NOT Scuttle.** **NOT Stopcock.** **NOT Parergon.** **NOT Stereotype.** **NOT Guillotine.** **NOT Ephemera.** **NOT Oubliette.** **NOT Commutator.** **NOT Heddle.**

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **ungranted Chrome host → executeScript waits for `document_idle` and blames a complete page, while immediate eval and named deny already know the grant** — unused in catalog as this desert ritual / scapegoat-altar walk.

Do NOT rename this product Cartulary, Paraph, Appanage, Pontoon, Concordat, Revenant, Replevin, Cognate, Lemures, Escheat, Mortmain, Strowger, Mondegreen, Derby, Vizard, Dead Air, Scuttle, Stopcock, Parergon, Stereotype, Flashpan, Guillotine, Ephemera, Oubliette, Commutator, Heddle, Scion, or any existing catalog slug.
Do NOT reuse idle honest / scapegoated / ungranted on a later booth.
Do NOT reuse Fraunces + Karla + IBM Plex Mono as a Cartulary trio. Display here is **Libre Bodoni**. Body is **Outfit**. Mono is **IBM Plex Mono**. Do NOT reuse Literata. Do NOT reuse Figtree. Do NOT reuse Roboto Mono.

Different surface: Chrome extension host-grant / executeScript timeout vs credential-store accretion / Desktop issuer-quote formatter / skill-fork model inherit / Desktop RC wash / MCP header↔`_meta` discord / WMI timeout-kill orphans / iOS setMode auto / unexpanded PLUGIN_ROOT / remanent classifier / worktree lock leftover / sandbox freeze.

Product name stays **Scapegoat**. Name/slug `scapegoat` unused in catalog.json (271 products before this ship; Cartulary is #271).

Different UI: desert ritual / scapegoat-altar / ash altar / ochre dust / bone linen / rust-blood mark / goat-bell / grant-table. Libre Bodoni / Outfit / IBM Plex Mono. NOT oak lectern / bound quires / inkhorn / candle (Cartulary). NOT notarial instrument / wax press / issuer ribbon (Paraph). NOT royal-grant / heraldic inheritance desk (Appanage). NOT harbor pontoon / floating-bridge pier (Pontoon). NOT diplomatic chancery / treaty desk (Concordat). NOT Victorian séance parlor / process-tomb (Revenant). NOT legal replevin chamber / writ desk (Replevin). NOT comparative philology / manuscript cognate desk (Cognate). NOT Roman Lemuria night courtyard (Lemures). NOT feudal escheat chamber (Escheat). NOT muniment room (Mortmain). NOT millimeter-slider.

Different verbs: Ring the goat-bell, Score scapegoat, Walk the altar, Inspect the grant, Pin idle honest, Pin seeded scapegoated, Pin ungranted, Reset the altar.

Different idle: **honest**. Different #93348 seeded path: **scapegoated**. HOLD: **honest** / **hold**. ALARM: **scapegoated** / **scapegoat** / **ungranted** / **execute-script** / **page-blame**. Path: **ungranted**.

## How to score

```bash
node --test projects/scapegoat/scapegoat.test.mjs
node projects/scapegoat/scapegoat.mjs projects/scapegoat/data/scapegoat.json
echo '{"seed":"scapegoated"}' | node projects/scapegoat/scapegoat.mjs
```

Open the living card at `projects/scapegoat/index.html` (or the live path `/scapegoat/`). Buttons: Ring the goat-bell, Score scapegoat, Walk the altar, Inspect the grant, Pin idle honest, Pin seeded scapegoated, Pin ungranted, Reset the altar. Toggle ungranted host / javascript_tool ok / executeScript hang / document_idle wait / page-blame / batch budget / HMAC grant loss — the score flips. Lay a fixture JSON on the ash altar. `?embed=1` hides chrome.

The booth reconstructs the reporter’s granted `www.google.com` / ungranted `example.com` / three-path walk from the published #93348 body. This page did not run Claude or Chrome live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/scapegoat/
- Folder: `projects/scapegoat/`

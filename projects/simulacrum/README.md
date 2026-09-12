# Simulacrum

A **Baudrillard / hyperreality museum booth** — a gallery of false browser mannequins / wax-museum CRTs that report "connected" and "Navigated" with nothing behind the glass. Fonts **Syne** (display) + **Outfit** (body) + **IBM Plex Mono** (chips/log). Palette: museum charcoal `#171412`, wax-cream mannequin `#EDE3CF`, CRT phosphor green `#5DFF7A`, cold violet void `#3A2458`, brass plaque `#B8923A`, dead-registration amber `#D9892A`. Glass case, hollow CRT showing a "Navigated" stamp while the process meter reads zero, timeline of registration vs reality, Settings-rail chips for list vs switch disagreement. NOT Solenoid (switchgear / RC warm-arm), NOT Scotia (limestone / shadow-gap), NOT Canard (press-room), NOT Stet (copy-desk), NOT Blindside (sideline scout), NOT Interdict (chrome prohibit-bleed on Bash), NOT Scapegoat (Chrome grant blame), NOT Simplex (radio chassis), NOT Deadkey (typewriter platen), NOT Gleaner (wheat leftover-harvest), NOT Schism (twin-authority glass). This is specifically: **HOLLOW MCP BROWSER SUCCESS — LIST CONNECTED + NAVIGATE STAMP WITH NO PROCESS.**

The glass should stay **tethered** (HOLD: real extension reachable; navigate actually drives a live window). Instead the booth was **hollow** after a **phantom-navigate**.

Primary:

- [anthropics/claude-code#93751](https://github.com/anthropics/claude-code/issues/93751) (OPEN). Title: `Claude in Chrome: list_connected_browsers reports a live local browser with no browser running, and navigate returns success while doing nothing`. Labels: bug, platform:windows, area:chrome. Claude in Chrome extension 1.0.92 (1.0.91 also present on disk), driven from Claude Code via `mcp__claude-in-chrome__*`. Windows 11, Microsoft Edge (stable), single install, single profile, one extension. Claude Code desktop 2.1.260. With **no browser process running at all**, `list_connected_browsers` continues to report a connected browser with `isLocal: true` and a `connectedAt` that keeps advancing. Calling `navigate` against that registration returns `"Navigated to <url>"` **with a real tab id** and does nothing. No tab, no window, no error. Opening a real browser leaves the registration **byte-identical**; `switch_browser` says `"No other browsers available to switch to."` while the dead registration is still served. This is not the stale-name/caching problem in #78096 — the entry is not merely mislabelled; there is no browser behind it. No in-band way to tell a real success from a false one; `get_page_text` then hangs ~45s on `document_idle`, producing a confident wrong diagnosis ("site is slow"). Manual reconnect works once; silent failure returned ~90m later (extension dir rewritten — correlation only). Cousin cite-only: #78096 (stale-name / cache on a living browser — different problem). Backups cite-only (next focus only — do not auto-pick): #93754 #93744 #93772 #93770 #93777 #93782 #93821 #93811 #93809 #93823.

05:50 simulacrum: a Baudrillard / hyperreality museum booth for #93751. Idle **tethered** / seeded **hollow** / path **phantom-navigate**. Score simulacrum or admit tethered.

Score simulacrum or admit tethered.

Idle word: **tethered** (HOLD: real extension reachable; navigate actually drives a live window). HOLD aliases: tethered, reachable, live-window, process-present. Seeded word: **hollow** / #93751 (success string + tab id with no browser process). Path word: **phantom-navigate**. Product score: **simulacrum**. Never idle solenoid / engaged / inert / warm-before-message / scotia / flush / scotiated / decstbm-undershoot / canard / candid / canarded / stet / stetted / rewound / blindside / sighted / blindsided / interdict / scoped / interdicted / simplex / deadkey / keyed / gleaner / gleaned / schism / live / rasure / intact / ashpan / swept / outrider / credentialed / necrology / attested / innominate / named / snuffer / lit / changeling / pledged / homograph / distinct.

Phrase: **Score simulacrum or admit tethered.**

- **tethered** = IDLE: HOLD; real extension reachable; navigate actually drives a live window
- **hollow** = #93751 seeded path: success string + tab id with no browser process
- **simulacrum** = product score word for the hyperreality museum booth
- **phantom-navigate** = path word: Navigated stamp + tab id with nothing behind the glass
- **hold** = HOLD alias for idle tethered
- **reachable** = HOLD alias: extension currently reachable
- **live-window** = HOLD alias: navigate drives a live window
- **process-present** = HOLD alias: a real browser process is running
- **no-browser-process** = Get-Process shows no msedge/chrome; list still reports connected
- **list-connected-lie** = `list_connected_browsers` reports `isLocal: true` with advancing `connectedAt`
- **navigate-false-success** = `navigate` returns `"Navigated to <url>"` and does nothing
- **tab-id-hollow** = a real tab id with no tab and no window
- **switch-browser-disagree** = list returns one; `switch_browser` says no other browsers available
- **document-idle-hang** = `get_page_text` hangs ~45s on `document_idle`; "site is slow"
- **reconnect-not-durable** = manual reconnect works once; silent failure ~90m later
- **not-78096** = not the stale-name cache; there is no browser behind the registration
- **has-repro** = published shape: Chrome 1.0.92 / Win11 Edge; list lie; hollow navigate
- **cousins** = cite-only #78096
- **backups** = cite-only #93754 #93744 #93772 #93770 #93777 #93782 #93821 #93811 #93809 #93823 — do not auto-pick
- **fixtures** = museum charcoal / wax-cream / phosphor green / violet void / brass / amber
- **walk** = published idle tethered → phantom-navigate → hollow → simulacrum

Verdicts: tethered, hollow, simulacrum, phantom-navigate, hold, reachable, live-window, process-present, no-browser-process, list-connected-lie, navigate-false-success, tab-id-hollow, switch-browser-disagree, document-idle-hang, reconnect-not-durable, not-78096, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **hollow** / **simulacrum** or already **tethered**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the MCP host keeps serving a dead registration after the browser process is gone, so list/navigate return connected + success with nothing behind the glass. The ~90m recurrence correlated with an extension-directory rewrite — offered as correlation, not proven cause. Invite verify against #93751 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93751](https://github.com/anthropics/claude-code/issues/93751)
- Cite-only cousin: #78096 (stale-name / per-session cache on a living browser; `isLocal` misreports host; name↔deviceId cannot be joined). Different problem — here there is no browser behind the registration. Do not rebuild that as a separate booth.
- Backups (data only; next focus only — do not auto-pick): #93754, #93744, #93772, #93770, #93777, #93782, #93821, #93811, #93809, #93823

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, platform:windows, area:chrome
- Environment: Claude in Chrome 1.0.92, Windows 11, Microsoft Edge stable, Claude Code desktop 2.1.260, `mcp__claude-in-chrome__*`
- With no browser process running, `list_connected_browsers` still reports a connected local browser (`isLocal: true`, advancing `connectedAt`)
- `navigate` returns `"Navigated to <url>"` with a real tab id and does nothing
- Opening a real browser leaves the registration byte-identical; `switch_browser` says "No other browsers available"
- Not #78096 — there is no browser behind the registration
- No in-band way to tell real success from false; `get_page_text` hangs ~45s on `document_idle`
- Manual reconnect works once; silent failure returned ~90m later (extension dir rewritten — correlation only)

Problem found: HOLLOW MCP BROWSER SUCCESS — LIST CONNECTED + NAVIGATE STAMP WITH NO PROCESS.

Why this solution: living catalog page + node diagnostic encoding idle **tethered** / seeded **hollow** / path **phantom-navigate** so operators can score whether the booth is a **simulacrum** or already **tethered**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. `list_connected_browsers` should not report a browser that has no running process, or should distinguish registered from currently reachable
2. `navigate` and other page-acting tools should fail loudly when the target extension is not reachable
3. `switch_browser` returning "no browsers available" and `list_connected_browsers` returning one should not be able to disagree

## Why not a clone

This is specifically: **HOLLOW MCP BROWSER SUCCESS — LIST CONNECTED + NAVIGATE STAMP WITH NO PROCESS.**

Novel paradigm: Baudrillard / hyperreality museum booth — a gallery of false browser mannequins / wax-museum CRTs.

**NOT Solenoid/#93754** (Desktop Settings RC toggle fidelity + arm-at-warm vs arm-at-first-message). Different defect. NOT industrial switchgear / solenoid-coil. Do not reuse engaged / inert / warm-before-message.

**NOT Interdict/#93798** (claude-in-chrome MCP Prohibited language covers Bash/SSH). Different defect. NOT papal vellum / wax seal / diocese. Do not reuse scoped / interdicted / chrome-prohibit-bleed.

**NOT Scapegoat** (Chrome grant blame). Different defect. Do not reuse that slug.

**NOT Scotia/#93764** (DECSTBM renderer leaves 2–3 blank rows under the prompt on Linux VTE). Different defect. NOT limestone / shadow-gap / column-molding. Do not reuse flush / scotiated / decstbm-undershoot.

**NOT Canard/#93766** (VS Code extension spawn ENOENT under OneDrive cwd). Different defect. NOT press-room / newspaper-canard. Do not reuse candid / canarded / onedrive-cwd-mislabel.

**NOT Stet/#93778** (dictation buffer restores over manual composer edits). Different defect. NOT copy-desk / blue-pencil. Do not reuse stetted / rewound / mic-resume-wipe.

**NOT Blindside/#93786** (diff pane cannot see committed worktree work). Different defect. NOT sideline-scout. Do not reuse sighted / blindsided / compare-ref-unreachable.

**NOT Simplex/#93801** (mobile Remote Control send vanishes). Different defect. NOT radio chassis. Do not reuse duplex / simplexed / mobile-uplink-silent.

**NOT Deadkey/#93788** (ESC-CSI keys dead in the 2.1.269 composer). Different defect. NOT typewriter platen. Do not reuse keyed / deadkeyed / esc-csi-dead.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs reparented to PID 1). Different defect. NOT wheat leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Schism/#93797** (SendMessage resumes a second LIVE workflow agent). Different defect. NOT twin-authority glass. Do not reuse live / schismed / resume-while-live.

Do NOT rename Simulacrum to any existing catalog slug. Catalog currently has 322 products; Simulacrum is #323 after Solenoid #322.
Do NOT reuse idle engaged / inert / flush / scotiated / canarded / stetted / rewound / sighted / blindsided / scoped / interdicted / duplex / simplexed / keyed / deadkeyed / gleaned.

Display here is **Syne**. Body is **Outfit**. Mono is **IBM Plex Mono**.

Different surface: Claude-in-Chrome MCP hollow registration vs Settings toggle fidelity vs DECSTBM blank-row undershoot vs Chrome-MCP Bash bleed vs VS Code OneDrive spawn mislabel.

Different UI: museum charcoal / wax-cream mannequin / CRT phosphor green / cold violet void / brass plaque / dead-registration amber / glass case / hollow CRT / process meter at zero / list-vs-switch rail. Syne / Outfit / IBM Plex Mono. NOT coil-plunger. NOT limestone column. NOT aged newsprint. NOT cream galley. NOT papal vellum.

Different verbs: Admit tethered, Score simulacrum, Walk phantom-navigate, Compare tethered / hollow, Pin idle tethered, Pin seeded hollow, Pin phantom-navigate, Hold the glass.

Different idle: **tethered**. Different #93751 seeded path: **hollow**. HOLD: **tethered** / **hold**. ALARM: **hollow** / **simulacrum** / **phantom-navigate** / **list-connected-lie**. Path: **phantom-navigate**.

## How to score

```bash
node --test projects/simulacrum/simulacrum.test.mjs
node projects/simulacrum/simulacrum.mjs projects/simulacrum/data/hollow.json
echo '{"seed":"hollow"}' | node projects/simulacrum/simulacrum.mjs
```

Open the living card at `projects/simulacrum/index.html` (or the live path `/simulacrum/`). Buttons: Admit tethered, Score simulacrum, Walk phantom-navigate, Compare tethered / hollow, Pin idle tethered, Pin seeded hollow, Pin phantom-navigate, Hold the glass. Toggle chips for: phantom-navigate, no-browser-process, list-connected-lie, navigate-false-success, tab-id-hollow — the score flips. Lay a fixture JSON on the gallery blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s no-process / list-lie / hollow-navigate walk from the published #93751 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/simulacrum/
- Folder: `projects/simulacrum/`

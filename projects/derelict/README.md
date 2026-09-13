# Derelict

A **maritime abandoned-hulk / derelict-ship / salvage-yard booth** — rust hull plates, fogbound pier, broken mast, bilge water, lantern, tide marks, abandoned cargo still smoking in the hold. Fonts **Spectral** (display) + **Nunito Sans** (body) + **Fira Code** (chips). Palette: hull rust `#8B3A2A`, sea fog `#C5D0D4`, bilge `#1A2428`, lantern amber `#D4A017`, tide teal `#2A6F6A`, salt `#F3F1EA`, iron `#4A4E52`, ink `#121618`. Fresh trio — not the last-ten catalog faces, not the prior sacristy trio, not the prior banquet trio. NOT Gleaner/#93794. NOT Foundling/#93889. NOT Vestry/#94008. NOT Surfeit/#94012. NOT Phosphene/#94003. NOT Demesne/#93989. NOT Ashpan/#93780. NOT Waif, Jetsam, Relict, or any prior booth. Completely different UI/UX/metaphor. This is specifically: **SESSION TEARDOWN DOES NOT KILL BASH-TOOL CHILDREN — ORPHAN TO PID 1 AFTER STOP/CRASH/CLEAR; TSC/VITEST RUN HOURS UNSUPERVISED.**

The pier should stay **berthed** (HOLD: moored / reaped / shepherded / process-group). Instead the booth was **derelict** after a **session-kill-orphan**.

Primary:

- [anthropics/claude-code#93996](https://github.com/anthropics/claude-code/issues/93996) (OPEN). Title: `Orphaned Bash-tool subprocesses (tsc/vitest) outlive a terminated session and run unsupervised for hours`. Labels: has-repro, platform:macos, area:bash. When a Claude Code session is stopped, crashed, cleared, or closed while a long-running Bash-tool subprocess is in flight (e.g. `tsc --noEmit`, `vitest run`), that subprocess is NOT terminated. It reparents to PID 1 and keeps running unsupervised for hours. Observed: tsc 5h32m / 472+ CPU-minutes; earlier day swap 23.2/24.5 GB. Session list shows `isRunning:false` while the orphan still burns CPU/RAM. Expected: session process death should kill the full Bash-tool process tree (process group + signal on teardown). Actual: survives, PPID=1, unsupervised. Cousins cite-only: #93794 (Gleaner / unreaped `&` inside a *live* Bash tool call), #93889 (Foundling / subagent-bash-outlive). Backups cite-only (next focus only — do not auto-pick): #93987 #93924 #93925 #93967 #93957 #93770 #93777. Stay off Gleaner/Foundling/Vestry/Surfeit/Phosphene/Demesne/Ashpan/Waif/Jetsam/Relict paradigms.

03:50 derelict: a maritime abandoned-hulk / derelict-ship / salvage booth for #93996. Bash-tool subprocesses (tsc/vitest) survive session stop/crash/clear, reparent to PID 1, run unsupervised for hours. Idle **berthed** / seeded **derelict** / path **session-kill-orphan**. Score derelict or admit berthed.

Score derelict or admit berthed.

Idle word: **berthed** (HOLD: moored / reaped). HOLD aliases: berthed, moored, reaped, shepherded, process-group. Seeded word: **derelict** / #93996 (the session-kill orphan). Path word: **session-kill-orphan**. Product score: **derelict**. Never idle pegged / tempered / quiescent / diplomatic / demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary / vested / solvent / frugal / circuit-held / no-spawn / gleaned / swept / live or seeded vestry / surfeit / phosphene / parablepsis / demesne / cartouche / attaint / oriel / anarthria / trismus / foundling / gleaner / crasis / tessera / mojibake / quota-spawn-cascade / layer-tree-walk / latin1-edit-wipe / home-bind-overreach / subagent-bash-outlive / unreaped-ampersand / mount-refcount-race.

Phrase: **Score derelict or admit berthed.**

- **berthed** = IDLE: HOLD; process-group shepherded; session death kills the Bash-tool tree
- **derelict** = #93996 seeded path and product score: unsupervised hulk at PID 1 after session death
- **session-kill-orphan** = path word: session teardown does not kill Bash-tool children
- **hold** = HOLD alias for idle berthed
- **moored** = HOLD alias: hulk moored; process-group shepherded
- **reaped** = HOLD alias: Bash-tool tree reaped on session death
- **shepherded** = HOLD alias: process-group shepherded through teardown
- **process-group** = HOLD alias: session death signals the Bash-tool process group
- **ppid-one** = in-flight Bash-tool child reparents to PID 1
- **tsc-orphan** = `tsc --noEmit` still steaming 5h32m / 472+ CPU-minutes
- **vitest-orphan** = `vitest run` in flight at session stop
- **swap-hot** = earlier-day swap 23.2/24.5 GB while the unsupervised hulk burned RAM
- **is-running-false** = session list reports `isRunning:false` while the orphan still burns
- **teardown-signal** = session death does not signal the process group
- **landing** = fogbound pier landing / salt-plank deck
- **has-repro** = published shape: stop/crash/clear / PPID=1 / tsc 5h32m / isRunning:false
- **cousins** = cite-only #93794 #93889 — do not conflate
- **backups** = cite-only #93987 #93924 #93925 #93967 #93957 #93770 #93777 — do not auto-pick
- **fixtures** = hull rust / sea fog / bilge / lantern amber / tide teal / salt / iron / ink
- **walk** = published idle berthed → session-kill-orphan → derelict

Verdicts: berthed, derelict, session-kill-orphan, hold, moored, reaped, shepherded, process-group, ppid-one, tsc-orphan, vitest-orphan, swap-hot, is-running-false, teardown-signal, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **derelict** or already **berthed**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): session teardown does not kill the Bash-tool process tree (no process-group + signal on teardown), so in-flight tsc/vitest reparent to PID 1 and run unsupervised. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93996](https://github.com/anthropics/claude-code/issues/93996)
- Cousins cite-only (do not conflate): #93794 (Gleaner / unreaped `&`), #93889 (Foundling / subagent-bash-outlive)
- Backups cite-only next-focus only: #93987 (/reload-skills no changes), #93924 (RC slows local), #93925 (webview blackout), #93967 (OAuth 403 Windows), #93957 (stuck after interrupt), #93770 (TUI copy padding), #93777 (Vercel MCP teamId)

Why this solution: diagnostic scoring booth that encodes the published incident so operators can score whether a harness berths (process-group teardown) or leaves a derelict (PID-1 orphan).

Why not a clone: original maritime-hulk UI + scoring model for a different lifecycle defect than Gleaner/Foundling; GitHub issue is inspiration only; no Claude Code source fix.

What happened (from the issue text — do not invent):

- OPEN
- Labels: has-repro, platform:macos, area:bash
- When a Claude Code session is stopped / crashed / cleared / closed while a long-running Bash-tool subprocess is in flight (e.g. `tsc --noEmit`, `vitest run`), that subprocess is NOT terminated
- It reparents to PID 1 and keeps running unsupervised for hours
- Observed: tsc 5h32m / 472+ CPU-minutes; earlier day swap 23.2/24.5 GB
- Session list shows `isRunning:false` while the orphan still burns CPU/RAM
- Expected (scoring narrative only): session process death should kill the full Bash-tool process tree (process group + signal on teardown)
- Actual: survives, PPID=1, unsupervised

Problem found: SESSION TEARDOWN DOES NOT KILL BASH-TOOL CHILDREN — ORPHAN TO PID 1 AFTER STOP/CRASH/CLEAR; TSC/VITEST RUN HOURS UNSUPERVISED.

Why Derelict: a derelict is an abandoned hulk still smoking in the fog after the crew has left the pier. Session death should berth the Bash-tool tree; instead tsc/vitest stay lit at PID 1. NOT a Claude Code patch — educational diagnostic booth only.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Session process death should kill the full Bash-tool process tree
2. Teardown must send a signal to the process group, not leave children berthed to PID 1
3. A stopped / crashed / cleared / closed session must not leave `tsc --noEmit` or `vitest run` unsupervised
4. `isRunning:false` in the session list must mean the cargo is dark
5. Hours-long tsc (5h32m / 472+ CPU-minutes) and swap-hot leftovers must not survive after the session is gone

## Why not a clone

This is specifically: **SESSION TEARDOWN DOES NOT KILL BASH-TOOL CHILDREN — ORPHAN TO PID 1 AFTER STOP/CRASH/CLEAR; TSC/VITEST RUN HOURS UNSUPERVISED.**

Novel paradigm: maritime abandoned-hulk / derelict-ship / salvage yard / fogbound pier / broken mast / lantern rail / smoking cargo — hull rust, sea fog, bilge, lantern amber, tide teal, salt, iron, ink. New issue, new paradigm (session-kill-orphan), new UI/UX/fonts/colors, new scoring vocabulary.

**NOT Gleaner/#93794** (unreaped background `&` jobs inside a *live* Bash tool call — `yes` pegging cores). Cite-only cousin. Different lifecycle. NOT agricultural leftover harvest. Do not reuse gleaned / gleaner / unreaped-ampersand.

**NOT Foundling/#93889** (subagent finished; `run_in_background` Bash left with no owner while parent graph still exists). Cite-only cousin. Different owner gap. NOT foundling-hospital / parish-ward. Do not reuse filiated / foundling / subagent-bash-outlive.

**NOT Vestry/#94008** (Linux bwrap placeholder mount cleanup is per-process with no cross-process refcount). Different defect. NOT liturgical sacristy / peg-rail. Do not reuse pegged / vestry / mount-refcount-race.

**NOT Surfeit/#94012** (workflow keeps spawning after terminal session-limit). Different defect. NOT banquet cellar. Do not reuse tempered / surfeit / quota-spawn-cascade.

**NOT Phosphene/#94003** (WindowServer CA layer-tree thrash while streaming). Different defect. NOT ophthalmology / entoptic clinic. Do not reuse quiescent / phosphene / layer-tree-walk.

**NOT Demesne/#93989** (bwrap binds entire `/home` instead of `$HOME`). Different defect. NOT manor charter. Do not reuse demesned / demesne / home-bind-overreach.

**NOT Ashpan/#93780** (delete_session burns the ledger for a spawned child). Different defect. NOT foundry grate. Do not reuse swept / ashpan.

**NOT Waif / Jetsam / Relict** (different catalog defects).

**NOT Parablepsis/#93954** (Edit/Write UTF-8-decode of Latin-1 PHP). Different defect.

**NOT Cartouche/#93772** (ask-for-diagram defaults to a section-summary poster). Different defect.

**NOT Attaint/#93821** (cyber-safeguard false-positive). Different defect.

**NOT Oriel/#93809** (macOS Desktop pop-out/maximised plan window does not reflow). Different defect.

**NOT Anarthria/#93782** (Wispr Flow clipboard+Ctrl+V silently dropped). Different defect.

**NOT Trismus/#93823** (macOS UNUserNotification / XPC lock-order deadlock). Different defect.

**NOT Crasis/#93960** (non-injective store slug). Different defect.

**NOT Tessera/#93929** (macOS version-named binary path → TCC). Different defect.

**NOT Mojibake/#93848** (intermittent U+FFFD of multibyte Korean in CLAUDE.md). Different defect.

Do NOT rename Derelict to any existing catalog slug. Catalog currently has 343 products; Derelict is #344 after Vestry #343.
Do NOT reuse idle pegged / tempered / quiescent / diplomatic / demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary / vested / solvent / frugal / circuit-held / no-spawn / gleaned / swept / live or seeded vestry / surfeit / phosphene / parablepsis / demesne / cartouche / attaint / oriel / anarthria / trismus / foundling / gleaner / crasis / tessera / mojibake / quota-spawn-cascade / layer-tree-walk / latin1-edit-wipe / home-bind-overreach / subagent-bash-outlive / unreaped-ampersand / mount-refcount-race.

Display here is **Spectral**. Body is **Nunito Sans**. Mono is **Fira Code**.

Different surface: session-kill-orphan (session teardown does not kill Bash-tool children) vs unreaped-ampersand vs subagent-bash-outlive vs mount-refcount-race vs quota-spawn-cascade vs layer-tree-walk.

Different UI: hull rust / sea fog / bilge / lantern amber / tide teal / salt / iron / ink / broken-mast masthead / pier deck / cargo-hold score panel / lantern rail / hatch grid. Spectral / Nunito Sans / Fira Code. NOT stone / indigo stole / linen / brass peg. NOT wheat / stubble / sickle. NOT linen / rose-ribbon / foundling-wheel.

Different verbs: Admit berthed, Score derelict, Walk session-kill-orphan, Compare berthed / derelict, Pin idle berthed, Pin seeded derelict, Pin session-kill-orphan, Berth the hulk.

Different idle: **berthed**. Different #93996 seeded path: **derelict**. HOLD: **berthed** / **hold**. ALARM: **derelict** / **session-kill-orphan** / **ppid-one** / **tsc-orphan**. Path: **session-kill-orphan**.

## How to score

```bash
node --test projects/derelict/derelict.test.mjs
node projects/derelict/derelict.mjs projects/derelict/data/derelict.json
echo '{"seed":"derelict"}' | node projects/derelict/derelict.mjs
```

Open the living card at `projects/derelict/index.html` (or the live path `/derelict/`). Buttons: Admit berthed, Score derelict, Walk session-kill-orphan, Compare berthed / derelict, Pin idle berthed, Pin seeded derelict, Pin session-kill-orphan, Berth the hulk, Score booth. Toggle chips for: session-kill-orphan, ppid-one, tsc-orphan, is-running-false — the score flips. Lay a fixture JSON on the salt deck. `?embed=1` hides chrome.

The booth reconstructs the reporter’s session-stop / PPID=1 / tsc 5h32m / vitest / isRunning:false walk from the published #93996 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/derelict/
- Folder: `projects/derelict/`

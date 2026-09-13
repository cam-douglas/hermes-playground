# Drawbridge

A **medieval castle drawbridge / portcullis / bailey approach / gatehouse / raised-span booth** — merlons, ditch water, torch sconces, iron teeth, a wooden span that should stay down. Fonts **Cinzel** (display) + **Manrope** (body) + **JetBrains Mono** (chips). Palette: bailey stone `#C9C2B2`, keep iron `#1A1C22`, portcullis rust `#8B3A2A`, moss `#3F5E46`, torch amber `#C9842A`, ditch water `#2C3E50`, chalk `#EDE6D6`, ink `#12141A`. Fresh trio. NOT Chirograph/#94045. NOT Titulus/#94025. NOT Derelict/#93996. NOT Vestry/#94008. NOT Surfeit/#94012. NOT Phosphene/#94003. NOT Parablepsis/#93954. NOT Demesne/#93989. NOT Cartouche/#93772. NOT Attaint/#93821. NOT Oriel/#93809. NOT Diplopia / Fulcrum / Mondegreen. Completely different UI/UX/metaphor. This is specifically: **KEEP AUTO-UPDATE RAISES THE MACHINE-WIDE DRAWBRIDGE → REMOTE APPROACH CUT ACROSS UNRELATED BAILEYS → HALLS STAY LIT (LOCAL TRANSCRIPTS CONTINUE) → NO HORN → GATEHOUSE LEDGER ONLY ADMITS FUTURE CARTS.**

The approach should stay **spanned** (HOLD: open-span / linked / moored / joined). Instead the booth was **drawbridge** after a **rc-bridge-update-drop**.

Primary:

- [anthropics/claude-code#94049](https://github.com/anthropics/claude-code/issues/94049) (OPEN). Title: `Auto-update silently drops all Remote Control bridges; running sessions cannot reconnect`. Labels: bug, has repro, platform:windows, area:desktop. Claude Code desktop Windows; versions 2.1.266 → 2.1.270 auto-update. Feature-breaking, silent, every session on the machine simultaneously. RC is app-wide not per-session — unrelated projects lose remote links together. Evidence: all claude processes restarted ~20:09:31; two live processes different versions; crash queue empty; bridge-state.json last written at restart with stale localSessionId that matches neither live session; all remote peers offline; conversations keep appending to jsonl across restarts; SessionStart hooks fire. Repro: enable RC checkbox (future sessions), start two sessions in different projects reachable remotely, let app auto-update/restart, conversations resume locally, remote device cannot reach either. Expected: bridge reconnects or user is told + reattach path for live sessions. Cousins cite-only: #90387 (RC archived on teardown after auto-update), #84793 (remoteControlAtStartup not honored on resume after auto-update), #84805 (restored sessions never re-register RC), #90172 (stealth relaunch destroys hosts), #85413 (auto-update kills live session hosts), #82462 / #80400 (registration-lost cousins). Backups cite-only (next focus only — do not auto-pick): #94052 #94041 #94040 #94032 #94031 #94029 #93987 #93924 #93770 #93777. Stay off Chirograph/Titulus/Derelict/Vestry/Surfeit/Phosphene/Parablepsis/Demesne/Cartouche/Attaint/Oriel/Diplopia/Fulcrum/Mondegreen paradigms.

06:50 drawbridge: a medieval castle drawbridge / portcullis / bailey-approach / gatehouse booth for #94049. Desktop Windows auto-update restarts the app and terminates the machine-wide Remote Control bridge; every RC session across unrelated projects goes offline at once; conversations resume and keep writing locally so the break is invisible; no notification; bridge-state.json freezes with a stale localSessionId; the settings checkbox only admits future sessions. Idle **spanned** / seeded **drawbridge** / path **rc-bridge-update-drop**. Score drawbridge or admit spanned.

Score drawbridge or admit spanned.

Idle word: **spanned** (HOLD: open-span / linked). HOLD aliases: spanned, open-span, linked, moored, joined. Seeded word: **drawbridge** / #94049 (the rc-bridge-update-drop path). Path word: **rc-bridge-update-drop**. Product score: **drawbridge**. Never idle matched / inscribed / berthed / pegged / tempered / quiescent / diplomatic / demesned / diagrammed or seeded chirograph / titulus / derelict / vestry / surfeit / phosphene / parablepsis / demesne / cartouche / attaint / oriel / diplopia / fulcrum / mondegreen / worktree-rename-stale / resume-stale-title / session-kill-orphan / mount-refcount-race / quota-spawn-cascade / layer-tree-walk / latin1-edit-wipe / home-bind-overreach.

Phrase: **Score drawbridge or admit spanned.**

- **spanned** = IDLE: HOLD; drawbridge down; remote carts reach the keep; live sessions stay linked; gatehouse ledger matches live ids
- **drawbridge** = #94049 seeded path and product score: auto-update raises the machine-wide span; remote approach cut; halls stay lit
- **rc-bridge-update-drop** = path word: keep auto-update tears down the machine-wide Remote Control bridge
- **hold** = HOLD alias for idle spanned
- **open-span** = HOLD alias: the bailey approach stays an open span
- **linked** = HOLD alias: remote carts stay linked to the keep
- **moored** = HOLD alias: the span stays moored to both banks
- **joined** = HOLD alias: bailey and keep stay joined
- **auto-update-restart** = all claude processes restarted ~20:09:31; two live versions; crash queue empty
- **bridge-state-stale** = bridge-state.json last written at restart; stale localSessionId matches neither live session
- **silent-drop** = no horn; user discovered the cut only from the remote device
- **future-sessions-only** = settings checkbox only admits future sessions; no reattach path for live sessions
- **multi-project-offline** = RC is app-wide; unrelated projects lose remote links together
- **transcript-survives** = conversations resume and keep appending to jsonl; SessionStart hooks fire
- **landing** = gatehouse landing / bailey approach / ditch water
- **has-repro** = published shape: 2.1.266 → 2.1.270 / 20:09:31 / stale localSessionId / future sessions only
- **cousins** = cite-only #90387 #84793 #84805 #90172 #85413 #82462 #80400 — do not conflate
- **backups** = cite-only #94052 #94041 #94040 #94032 #94031 #94029 #93987 #93924 #93770 #93777 — do not auto-pick
- **fixtures** = bailey stone / keep iron / portcullis rust / moss / torch amber / ditch water / chalk / ink
- **walk** = published idle spanned → rc-bridge-update-drop → drawbridge

Verdicts: spanned, drawbridge, rc-bridge-update-drop, hold, open-span, linked, moored, joined, auto-update-restart, bridge-state-stale, silent-drop, future-sessions-only, multi-project-offline, transcript-survives, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **drawbridge** or already **spanned**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): auto-update restart tears down the machine-wide bridge and never rebinds live interactive sessions; checkbox gates future sessions only; bridge-state is not reconciled to live session ids. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94049](https://github.com/anthropics/claude-code/issues/94049)
- Cousins: #90387 cite-only (RC archived on teardown after auto-update). #84793 cite-only (remoteControlAtStartup not honored on resume after auto-update). #84805 cite-only (restored sessions never re-register RC). #90172 cite-only (stealth relaunch destroys hosts). #85413 cite-only (auto-update kills live session hosts). #82462 / #80400 cite-only (registration-lost cousins). Adjacent only. Different defects. Do not conflate.
- Backups (data only; next focus only — do not auto-pick): #94052, #94041, #94040, #94032, #94031, #94029, #93987, #93924, #93770, #93777

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:windows, area:desktop
- Claude Code desktop Windows; versions 2.1.266 → 2.1.270 auto-update
- Windows 10 Pro 19045; observed 2026-09-13 ~20:09 local UTC+3
- Severity: feature-breaking, silent, every session on the machine simultaneously
- RC is app-wide not per-session — unrelated projects lose remote links together
- All claude processes restarted ~20:09:31; two live processes different versions; crash queue empty
- bridge-state.json last written at restart with a stale localSessionId that matches neither live session
- All remote peers offline
- Conversations keep appending to jsonl across restarts; SessionStart hooks fire
- Settings checkbox only says future sessions will be connected — no reattach path for already-running sessions
- User must abandon and recreate every in-flight conversation
- Expected (scoring narrative only): bridge reconnects after restart, or the user is told and offered a way to reconnect live sessions

Problem found: KEEP AUTO-UPDATE RAISES THE MACHINE-WIDE DRAWBRIDGE → REMOTE APPROACH CUT ACROSS UNRELATED BAILEYS → HALLS STAY LIT → NO HORN → GATEHOUSE LEDGER ONLY ADMITS FUTURE CARTS.

Why Drawbridge: when a keep auto-updates, the castle drawbridge rises. Remote carts cannot cross the ditch. The halls stay lit (local transcripts continue). No horn sounds (silent). The gatehouse ledger only admits future carts (the checkbox = future sessions). NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: living catalog page + node diagnostic encoding idle **spanned** / seeded **drawbridge** / path **rc-bridge-update-drop** so operators can score whether the booth is **drawbridge** or already **spanned**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. The Remote Control bridge reconnects after an auto-update restart
2. If it does not, the user is told and offered a reconnect path
3. Already-running interactive sessions can be reattached — not only future sessions
4. bridge-state.json must not freeze on a stale localSessionId
5. Unrelated projects must not lose remote links together from one silent machine-wide teardown

## Why not a clone

This is specifically: **KEEP AUTO-UPDATE RAISES THE MACHINE-WIDE DRAWBRIDGE → REMOTE APPROACH CUT ACROSS UNRELATED BAILEYS → HALLS STAY LIT → NO HORN → GATEHOUSE LEDGER ONLY ADMITS FUTURE CARTS.**

Novel paradigm: medieval castle drawbridge / portcullis / bailey approach / gatehouse / raised span / merlons / ditch water / torch sconces — bailey stone, keep iron, portcullis rust, moss, torch amber. New issue, new paradigm (rc-bridge-update-drop), new UI/UX/fonts/colors, new scoring vocabulary.

**NOT Chirograph/#94045** (worktree branch rename stale). Different defect. NOT wavy-cut indenture / parchment lectern. Do not reuse matched / chirograph / worktree-rename-stale.

**NOT Titulus/#94025** (iOS rename vs desktop sidebar / resume-stale-title). Different defect. NOT Roman marble plaque. Do not reuse inscribed / titulus / resume-stale-title.

**NOT Derelict/#93996** (orphaned Bash after session stop). Different defect. NOT maritime abandoned-hulk. Do not reuse berthed / derelict / session-kill-orphan.

**NOT Vestry/#94008** (Linux bwrap placeholder mount cleanup is per-process). Different defect. NOT liturgical sacristy / peg-rail. Do not reuse pegged / vestry / mount-refcount-race.

**NOT Surfeit/#94012** (workflow keeps spawning after terminal session-limit). Different defect. Do not reuse tempered / surfeit / quota-spawn-cascade.

**NOT Phosphene/#94003** (WindowServer CA layer-tree thrash while streaming). Different defect. Do not reuse quiescent / phosphene / layer-tree-walk.

**NOT Parablepsis/#93954** (Edit/Write UTF-8-decode of Latin-1 PHP). Different defect.

**NOT Demesne/#93989** (bwrap binds entire `/home` instead of `$HOME`). Different defect.

**NOT Cartouche/#93772** (ask-for-diagram defaults to a section-summary poster). Different defect.

**NOT Attaint/#93821** (cyber-safeguard false-positive). Different defect.

**NOT Oriel/#93809** (macOS Desktop pop-out/maximised plan window does not reflow). Different defect.

**NOT Diplopia / Fulcrum / Mondegreen.** Different defects.

Do NOT rename Drawbridge to any existing catalog slug. Catalog currently has 346 products; Drawbridge is #347 after Chirograph #346.
Do NOT reuse idle matched / inscribed / berthed / pegged / tempered / quiescent / diplomatic / demesned / diagrammed or seeded chirograph / titulus / derelict / vestry / surfeit / phosphene / parablepsis / demesne / cartouche / attaint / oriel / diplopia / fulcrum / mondegreen / worktree-rename-stale / resume-stale-title / session-kill-orphan / mount-refcount-race / quota-spawn-cascade / layer-tree-walk / latin1-edit-wipe / home-bind-overreach.

Display here is **Cinzel**. Body is **Manrope**. Mono is **JetBrains Mono**.

Different surface: rc-bridge-update-drop (auto-update raises the machine-wide Remote Control span; halls stay lit; no horn; ledger only admits future carts) vs worktree-rename-stale vs resume-stale-title vs session-kill-orphan vs mount-refcount-race.

Different UI: bailey stone / keep iron / portcullis rust / moss / torch amber / ditch water / raised wooden span / iron teeth. Cinzel / Manrope / JetBrains Mono.

Different verbs: Admit spanned, Score drawbridge, Walk rc-bridge-update-drop, Compare spanned / drawbridge, Pin idle spanned, Pin seeded drawbridge, Pin rc-bridge-update-drop, Lower the span.

Different idle: **spanned**. Different #94049 seeded path: **drawbridge**. HOLD: **spanned** / **hold**. ALARM: **drawbridge** / **rc-bridge-update-drop** / **auto-update-restart** / **bridge-state-stale**. Path: **rc-bridge-update-drop**.

## How to score

```bash
node --test projects/drawbridge/drawbridge.test.mjs
node projects/drawbridge/drawbridge.mjs projects/drawbridge/data/drawbridge.json
echo '{"seed":"drawbridge"}' | node projects/drawbridge/drawbridge.mjs
```

Open the living card at `projects/drawbridge/index.html` (or the live path `/drawbridge/`). Buttons: Admit spanned, Score drawbridge, Walk rc-bridge-update-drop, Compare spanned / drawbridge, Pin idle spanned, Pin seeded drawbridge, Pin rc-bridge-update-drop, Lower the span, Score booth. Toggle chips for: rc-bridge-update-drop, auto-update-restart, bridge-state-stale, silent-drop — the score flips. Lay a fixture JSON on the bailey approach. `?embed=1` hides chrome.

The booth reconstructs the reporter’s auto-update / stale bridge-state / silent multi-project drop / future-sessions-only walk from the published #94049 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/drawbridge/
- Folder: `projects/drawbridge/`

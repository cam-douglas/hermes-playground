# Titulus

A **Roman inscription / marble name-plaque / funerary-titulus booth** — veined marble, bronze lettering slots, terracotta recut, lapis lintel. Fonts **Forum** (display) + **Outfit** (body) + **Space Mono** (chips). Palette: marble `#F4EFE6`, bronze `#8C6A3F`, terracotta `#A34B3A`, lapis `#1F3A5F`, soot `#1A1714`, chalk `#FBF8F2`, oxide `#6E4E36`, ink `#12100E`. Fresh trio. NOT Vestry/#94008. NOT Surfeit/#94012. NOT Phosphene/#94003. NOT Parablepsis. NOT Demesne/#93989. NOT Cartouche. NOT Attaint. NOT Oriel. NOT Anarthria. NOT Trismus. NOT Gleaner/#93794. NOT Foundling/#93889. NOT Apograph/#93859. Completely different UI/UX/metaphor. This is specifically: **RESUME-STALE TITLE — DESKTOP WINDOWS CODE SIDEBAR KEEPS THE AUTO-GENERATED TITLE AFTER AN IOS RENAME; RESUME APPENDS A STALE CUSTOM-TITLE AND CLOBBERS THE PHONE NAME.**

The plaque should stay **inscribed** (HOLD: current / plaque / latest-wins / synced). Instead the booth was **titulus** after a **resume-stale-title**.

Primary:

- [anthropics/claude-code#94025](https://github.com/anthropics/claude-code/issues/94025) (OPEN). Title: `[BUG] Desktop (Windows): session renamed in the iOS app keeps its old title in the Code sidebar, and the stale title is written back on resume`. Labels: bug, has repro, platform:windows, area:desktop. A local Code-tab session on Windows was renamed from the Claude iOS app. The new name reaches the host transcript (`~/.claude/projects/<project>/<session>.jsonl`) as `custom-title` and is re-appended after later turns. The desktop sidebar keeps the original auto-generated title; `get_session` / `list_sessions` (`ccd_session_mgmt`) return it too, so the session cannot be found on the PC by the name set on the phone. After quit/reopen, desktop resume appends a stale `custom-title` and the phone name is lost. Session A: 2026-09-08 16:00 auto title; 17:34 iOS name kept through 2026-09-11; 2026-09-13 17:15 resume entrypoint `claude-desktop` then stale custom-title. Session B: 2026-09-13 05:46 transcript has the iOS name; ~17:30 list_sessions and the sidebar still show the auto title. Claude for Windows 1.52386.3, bundled Claude Code 2.1.266; Windows 10 Pro 22H2 (build 19045). Cousins cite-only: diplopia #93012 (room-label conflation), fulcrum #92377 (auto-title overwrites `--name`). Backups cite-only (next focus only — do not auto-pick): #93987 #93924 #94032 #94029 #94031 #93770 #93777. Stay off Vestry/Surfeit/Phosphene/Parablepsis/Demesne/Cartouche/Attaint/Oriel/Anarthria/Trismus/Gleaner/Foundling/Apograph paradigms.

04:50 titulus: a Roman inscription / marble name-plaque / funerary-titulus booth for #94025. Desktop Windows Code sidebar keeps the auto-generated title after an iOS rename; resume appends a stale custom-title and clobbers the phone name. Idle **inscribed** / seeded **titulus** / path **resume-stale-title**. Score titulus or admit inscribed.

Score titulus or admit inscribed.

Idle word: **inscribed** (HOLD: current / plaque). HOLD aliases: inscribed, current, plaque, latest-wins, synced. Seeded word: **titulus** / #94025 (the resume-stale-title path). Path word: **resume-stale-title**. Product score: **titulus**. Never idle pegged / tempered / quiescent / diplomatic / demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary / vested / solvent / frugal / berthed or seeded vestry / surfeit / phosphene / parablepsis / demesne / cartouche / attaint / oriel / anarthria / trismus / gleaner / foundling / apograph / mount-refcount-race / quota-spawn-cascade / layer-tree-walk / latin1-edit-wipe / home-bind-overreach / subagent-bash-outlive.

Phrase: **Score titulus or admit inscribed.**

- **inscribed** = IDLE: HOLD; latest rename wins; phone name and desktop cache stay synced
- **titulus** = #94025 seeded path and product score: stale desktop letters recut the newer phone name
- **resume-stale-title** = path word: quit/reopen resume appends stale custom-title and clobbers the phone name
- **hold** = HOLD alias for idle inscribed
- **current** = HOLD alias: latest name is current on every surface
- **plaque** = HOLD alias: marble face keeps the newest letters
- **latest-wins** = HOLD alias: newest rename wins across surfaces
- **synced** = HOLD alias: phone plaque and desktop cache stay synced
- **sidebar-stale** = Windows Code sidebar keeps the original auto-generated title
- **custom-title-clobber** = desktop resume appends custom-title with the stale auto-generated title
- **ios-rename** = iOS app writes Title B into the host transcript
- **list-sessions-stale** = get_session / list_sessions (`ccd_session_mgmt`) still return Title A
- **landing** = marble landing / bronze sill
- **has-repro** = published shape: 2.1.266 / custom-title / sidebar / resume clobber
- **cousins** = cite-only diplopia #93012, fulcrum #92377 — do not conflate
- **backups** = cite-only #93987 #93924 #94032 #94029 #94031 #93770 #93777 — do not auto-pick
- **fixtures** = marble / bronze / terracotta / lapis / soot / chalk / oxide / ink
- **walk** = published idle inscribed → resume-stale-title → titulus

Verdicts: inscribed, titulus, resume-stale-title, hold, current, plaque, latest-wins, synced, sidebar-stale, custom-title-clobber, ios-rename, list-sessions-stale, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **titulus** or already **inscribed**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): desktop session-mgmt cache/sidebar title is not invalidated by remote custom-title writes from iOS, and resume prefers desktop-cached title when appending custom-title, violating latest-rename-wins across surfaces. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94025](https://github.com/anthropics/claude-code/issues/94025)
- Cousins: diplopia #93012 cite-only (web/mobile environment labels from different payload fields). fulcrum #92377 cite-only (`--name` discarded; auto-title overwrites custom-title on the peer registry). Title-adjacent only. Different defects. Do not conflate.
- Issue-cited relatives (not cousins; do not promote): #91303 (mobile rename never reaches a Linux host), #75343 (desktop and mobile show different names), #86607 / #93018 (opposite direction), #25090 (custom name replaced after resume in the CLI).
- Backups (data only; next focus only — do not auto-pick): #93987, #93924, #94032, #94029, #94031, #93770, #93777

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:windows, area:desktop
- Claude for Windows 1.52386.3 (Microsoft Store), bundled Claude Code 2.1.266; Windows 10 Pro 22H2 (build 19045); Claude iOS same account
- npm latest was 2.1.270 at filing
- iOS rename writes `custom-title` into the host transcript and keeps it through later turns
- Desktop sidebar keeps the original auto-generated title
- `get_session` / `list_sessions` (`ccd_session_mgmt`) return the auto-generated title
- After quit/reopen, desktop resume with entrypoint `claude-desktop` immediately appends `custom-title` = old auto-generated title
- Session A: 2026-09-08 16:00 auto title; 17:34 iOS name kept through 2026-09-11; 2026-09-13 17:15 stale resume append
- Session B: 2026-09-13 05:46 transcript has iOS name; ~17:30 list_sessions and sidebar still show auto title
- Expected (scoring narrative only): latest rename wins on every surface; resume must not overwrite a newer title with the desktop's stored one

Problem found: RESUME-STALE TITLE — DESKTOP WINDOWS CODE SIDEBAR KEEPS THE AUTO-GENERATED TITLE AFTER AN IOS RENAME; RESUME APPENDS A STALE CUSTOM-TITLE AND CLOBBERS THE PHONE NAME.

Why Titulus: a titulus is a Roman name-plaque — marble or bronze letters naming the person. Here the phone cuts a new inscription (Title B) into the transcript; the desktop lettering booth keeps the old bronze set (Title A) and, on resume, recuts the marble from that stale cache. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: living catalog page + node diagnostic encoding idle **inscribed** / seeded **titulus** / path **resume-stale-title** so operators can score whether the booth is **titulus** or already **inscribed**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A rename made in the iOS app should update the desktop sidebar
2. `get_session` / `list_sessions` must return the latest name
3. Resuming a session on the desktop must not overwrite a newer title with the desktop's stored one
4. The latest rename should win on every surface
5. The session must be findable on the PC by the name set on the phone

## Why not a clone

This is specifically: **RESUME-STALE TITLE — DESKTOP WINDOWS CODE SIDEBAR KEEPS THE AUTO-GENERATED TITLE AFTER AN IOS RENAME; RESUME APPENDS A STALE CUSTOM-TITLE AND CLOBBERS THE PHONE NAME.**

Novel paradigm: Roman inscription / marble name-plaque / funerary titulus / bronze lettering booth — marble, bronze, terracotta, lapis, soot, chalk, oxide, ink. New issue, new paradigm (resume-stale-title), new UI/UX/fonts/colors, new scoring vocabulary.

**NOT Derelict/#93996** (orphaned Bash after session stop). Different defect. NOT maritime abandoned-hulk. Do not reuse berthed / derelict / session-kill-orphan.

**NOT Vestry/#94008** (Linux bwrap placeholder mount cleanup is per-process). Different defect. Do not reuse pegged / vestry / mount-refcount-race.

**NOT Surfeit/#94012** (workflow keeps spawning after terminal session-limit). Different defect. Do not reuse tempered / surfeit / quota-spawn-cascade.

**NOT Phosphene/#94003** (WindowServer CA layer-tree thrash while streaming). Different defect. Do not reuse quiescent / phosphene / layer-tree-walk.

**NOT Parablepsis** (Edit/Write UTF-8-decode of Latin-1 PHP). Different defect. Do not reuse diplomatic / parablepsis / latin1-edit-wipe.

**NOT Demesne/#93989** (bwrap binds entire `/home` instead of `$HOME`). Different defect. Do not reuse demesned / demesne / home-bind-overreach.

**NOT Cartouche** (ask-for-diagram defaults to a section-summary poster). Different defect. Do not reuse diagrammed / cartouche / section-poster.

**NOT Attaint** (cyber-safeguard false-positive; one flag stains the session). Different defect. Do not reuse unattainted / attaint / session-attainder.

**NOT Oriel** (macOS Desktop pop-out/maximised plan window does not reflow). Different defect. Do not reuse reflowed / oriel / plan-no-reflow.

**NOT Anarthria** (Wispr Flow clipboard+Ctrl+V silently dropped). Different defect. Do not reuse articulate / anarthria / dictation-paste-drop.

**NOT Trismus** (macOS UNUserNotification / XPC lock-order deadlock). Different defect. Do not reuse limber / trismus / notif-xpc-deadlock.

**NOT Gleaner/#93794** (unreaped leftovers). Different defect. Do not reuse unreaped / gleaner.

**NOT Foundling/#93889** (subagent lifecycle does not reap `run_in_background` Bash). Different defect. Do not reuse filiated / foundling / subagent-bash-outlive.

**NOT Apograph/#93859** (Desktop reopen-fork). Different defect. Do not reuse apograph.

**NOT Derelict/#93996** (orphaned Bash after session stop). Different defect.

Do NOT rename Titulus to any existing catalog slug. Catalog currently has 344 products; Titulus is #345 after Derelict #344.
Do NOT reuse idle pegged / tempered / quiescent / diplomatic / demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary / vested / solvent / frugal / berthed or seeded vestry / surfeit / phosphene / parablepsis / demesne / cartouche / attaint / oriel / anarthria / trismus / gleaner / foundling / apograph / mount-refcount-race / quota-spawn-cascade / layer-tree-walk / latin1-edit-wipe / home-bind-overreach.

Display here is **Forum**. Body is **Outfit**. Mono is **Space Mono**.

Different surface: resume-stale-title (iOS custom-title reaches the transcript; desktop sidebar / ccd_session_mgmt / resume-append keep and then write back the auto-generated title) vs mount-refcount-race vs quota-spawn-cascade vs layer-tree-walk vs latin1-edit-wipe vs home-bind overreach.

Different UI: marble / bronze letter slots / terracotta recut / lapis lintel / soot / chalk / oxide / ink / two plaques (phone vs desktop). Forum / Outfit / Space Mono.

Different verbs: Admit inscribed, Score titulus, Walk resume-stale-title, Compare inscribed / titulus, Pin idle inscribed, Pin seeded titulus, Pin resume-stale-title, Stamp the letters.

Different idle: **inscribed**. Different #94025 seeded path: **titulus**. HOLD: **inscribed** / **hold**. ALARM: **titulus** / **resume-stale-title** / **sidebar-stale** / **custom-title-clobber**. Path: **resume-stale-title**.

## How to score

```bash
node --test projects/titulus/titulus.test.mjs
node projects/titulus/titulus.mjs projects/titulus/data/titulus.json
echo '{"seed":"titulus"}' | node projects/titulus/titulus.mjs
```

Open the living card at `projects/titulus/index.html` (or the live path `/titulus/`). Buttons: Admit inscribed, Score titulus, Walk resume-stale-title, Compare inscribed / titulus, Pin idle inscribed, Pin seeded titulus, Pin resume-stale-title, Stamp the letters, Score booth. Toggle chips for: resume-stale-title, sidebar-stale, custom-title-clobber, ios-rename — the score flips. Lay a fixture JSON on the marble blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s iOS rename / sidebar-stale / list_sessions-stale / resume-clobber walk from the published #94025 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/titulus/
- Folder: `projects/titulus/`

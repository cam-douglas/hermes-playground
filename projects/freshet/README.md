# Freshet

A **river-stage / staff-gauge / flood-crest / floodplain booth** — *Freshet* is a sudden flood-surge: snowmelt or storm lifts the river over the staff gauge until the floodplain drowns what was still findable above the waterline. Desktop Remote Control re-sends `initialize` every 60s; each burst appends `system/init` + `system/status` until the newest 2,000-event window is all control noise and the UI plaques **No messages yet** while conversation still sits under the flood. Fonts **Fraunces** (display) + **DM Sans** (UI) + **IBM Plex Mono** (chips). Palette: deep pool `#0B1C2C`, gauge brass `#C4A35A`, foam `#E8F1F5`, crest amber `#E09F3E`, flood slate `#3D5A6C`, silt `#8B7355`. Fresh trio. Completely different UI/UX/metaphor — staff gauge / crest mark / event spool / 2000-event window viewport / No messages yet plaque / Load earlier / floodplain. NOT a pottery repair bench. NOT a marble memorial yard. NOT a geology core-sample desk. NOT a manuscript parchment desk. NOT a cavalry lantern. NOT a Prague clock tower. NOT a herald's college. NOT a wax-tablet scriptorium. NOT an Elizabethan mask booth. NOT a confectionery kitchen. NOT a sleep ward. NOT a night-wall inhibitor. NOT a dictation recorder. NOT a household shrine. NOT a binder folio. NOT a theater tapestry. NOT a letterpress foundry. NOT a wax-cachet desk.

The gauge should stay **buoyed** (HOLD: conversation still findable / messages above the waterline). Instead the booth was **freshet** after an **init-flood**.

Primary:

- [anthropics/claude-code#94430](https://github.com/anthropics/claude-code/issues/94430) (OPEN). Title: `[BUG] Desktop app re-sends initialize + get_workspace_diff to an on-screen Remote Control session every 60 s; the system/init+status flood pushes the conversation past the 2,000-event window the transcript loader reads, so the session opens as "No messages yet"`. Labels: bug, has repro, platform:windows, regression, area:desktop, area:agent-view. Environment: Claude Code CLI 2.1.272 hosting `--bg --remote-control`; desktop app 1.52386.6 (bundles 2.1.270); Windows 11 Pro 26200; Opus 5. Desktop re-sends `initialize` (bursts of 2–3) plus `get_workspace_diff` every 60s while the session is on screen. The CLI answers each `initialize` with a `control_response` and emits a fresh `system/init` and `system/status` into the session event log (~14 events/min, ~800+/hr) with nothing typed. The transcript loader pages the newest 2,000 events (four pages of 500) then stops. If those 2,000 are all control/system noise, the UI shows **No messages yet** plus **Load earlier messages**; each click loads 500 more. Browser tabs do NOT poll; only desktop. Regression: desktop 1.44121.4 → ≤20 init/hr; 1.46388.1 → 120/hr; 1.52386.6 → 180/hr. Stay off Kintsugi/Cenotaph/Stratum/Tmesis/Vedette/Orloj/Brisure/Diptych/Vizard/Treacle/Somnus/Cresset/Dictabelt/Lemure/Cancellans/Arras/Cachet/Stereotype paradigms.

00:50 freshet: a river-stage / staff-gauge / flood-crest / floodplain booth for #94430. Desktop Remote Control re-sends initialize every 60s; system/init+status flood pushes past the 2,000-event transcript window so the session opens as No messages yet. Idle **buoyed** / seeded **freshet** / path **init-flood**. Score freshet or admit buoyed.

Score freshet or admit buoyed.

Idle word: **buoyed** (HOLD: conversation still findable / messages above the waterline). HOLD aliases: surfaced, charted, sounding. Seeded word: **freshet** / #94430 (the init-flood path). Path word: **init-flood**. Product score: **freshet**. Never idle mended / homed / shared / contiguous / stationed / lasting / enrolled / cleared / repointed / relocated / settled or seeded Kintsugi / Cenotaph / Stratum / Tmesis / Vedette / Orloj / Brisure / Diptych / Vizard / Treacle / Somnus / Cresset / Dictabelt / Lemure / Cancellans / Arras / Cachet or path names from those booths.

Phrase: **Score freshet or admit buoyed.**

- **buoyed** = IDLE HOLD: conversation still findable / messages above the waterline
- **freshet** = seeded path / product score: initialize flood drowned the 2,000-event window
- **init-flood** = path word: desktop timer re-init + system/init+status surge
- **surfaced** = HOLD alias: conversation still above stage
- **charted** = HOLD alias: staff gauge still reads talk
- **sounding** = HOLD alias: the bed is still measurable
- **initialize-cadence** = desktop re-sends initialize + get_workspace_diff every 60s
- **window-drown** = newest 2,000 events then stop; four pages of 500
- **no-messages-yet** = plaque while user/assistant events sit under the flood
- **desktop-poll** = only the desktop app polls; browser tabs stay quiet
- **browser-quiet** = a plain browser tab does not timer-reinitialize
- **system-init** = CLI appends system/init + system/status on each control re-init
- **load-earlier** = eight clicks of 500 to surface the conversation
- **94430** = issue number seed
- **landing** = river-stage / staff-gauge / flood-crest / floodplain
- **has-repro** = published shape: CLI 2.1.272 · desktop 1.52386.6 · --bg --remote-control
- **cousins** = cite-only #94396 #94397 #94451 #94452 #93490 — do not rebuild; do not conflate
- **backups** = cite-only #94458 #93924 #93770 #93777 #94151 #94496 #94499 #94522 #94520 #94509 #94507 #94547 #94546 #94530 #94516 — do not auto-pick
- **fixtures** = staff gauge / crest mark / event spool
- **walk** = published idle buoyed → init-flood → freshet
- **closed** = #94430 remains OPEN — cite only; not this booth

Verdicts: buoyed, freshet, init-flood, surfaced, charted, sounding, initialize-cadence, window-drown, no-messages-yet, desktop-poll, browser-quiet, system-init, load-earlier, 94430, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **freshet** or already **buoyed**. Fixtures use the issue's published incident only. Request reconstructions from published text are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): either stop timer re-initialize, or do not append system/init+status on control re-init, or keep paging until conversation events / exclude control noise from the window. Invite verify against #94430 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94430](https://github.com/anthropics/claude-code/issues/94430)
- Cousins: do NOT rebuild / do NOT conflate: #94396 (fork never Remote Control eligible), #94397 (mobile brief echo), #94451 (known_marketplaces never repaired once invalid), #94452 (directory marketplace dead `installLocation`), #93490 (resume flatten).
- Backups (data only; next focus only — do not auto-pick): #94458, #93924, #93770, #93777, #94151, #94496, #94499, #94522, #94520, #94509, #94507, #94547, #94546, #94530, #94516

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:windows, regression, area:desktop, area:agent-view
- Environment: Claude Code CLI 2.1.272 hosting `--bg --remote-control`; desktop app 1.52386.6 (bundles 2.1.270); Windows 11 Pro 26200; Opus 5
- Desktop re-sends `initialize` (bursts of 2–3) plus `get_workspace_diff` every 60s while the session is on screen
- CLI appends fresh `system/init` + `system/status` per initialize (~14 events/min, ~800+/hr); nothing typed
- Transcript loader pages newest 2,000 events (4×500) then stops
- If those 2,000 are control/system noise, the UI plaques **No messages yet**
- User/assistant events exist older on disk and server (one session: 9,081 events, 205 conversation, 5,427 noise after last turn; 8 Load earlier clicks)
- Browser tabs do NOT poll; only desktop
- Regression: 1.44121.4 ≤20 init/hr; 1.46388.1 → 120/hr; 1.52386.6 → 180/hr

Problem found: INIT-FLOOD — desktop timer re-initialize floods the persistent log with system/init+status until the 2,000-event window is all foam and the plaque lies empty.

Why Freshet: A *freshet* is a sudden flood-surge / river-stage rise. The desktop timer is the storm; `system/init` + `system/status` is the water that overtopped the staff gauge; the 2,000-event window is the floodplain that can no longer show the channel. #94451 is a marketplace file that never heals — DIFFERENT. #94452 is a dead `installLocation` — DIFFERENT. #94396 is a fork that never becomes Remote Control eligible — DIFFERENT. #94397 is a mobile brief echo — DIFFERENT. This booth is specifically **desktop Remote Control initialize every 60s / system/init+status flood / 2,000-event window drowns conversation / No messages yet**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores init-flood honesty (buoyed vs freshet) so operators can see the six-row evidence table and the drowned window without needing a Claude session. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. The desktop app should not re-initialize a session on a timer
2. If a permission/model/command refresh is needed, it should not append `system/init` + `system/status` to the persistent event log
3. The transcript loader should keep paging until conversation events, or exclude control/system chatter from the 2,000-event window

## Why not a clone

This is specifically: **DESKTOP REMOTE CONTROL RE-SENDS INITIALIZE EVERY 60S. SYSTEM/INIT+STATUS FLOOD PUSHES PAST THE 2,000-EVENT TRANSCRIPT WINDOW SO THE SESSION OPENS AS NO MESSAGES YET. CLI 2.1.272; DESKTOP 1.52386.6; WINDOWS; --BG --REMOTE-CONTROL. BROWSER TABS DO NOT POLL.**

Novel paradigm: river-stage / staff-gauge / flood-crest / floodplain / event spool / 2000-event window viewport / No messages yet plaque / Load earlier — deep pool, gauge brass, foam, crest amber. New issue, new paradigm (init-flood), new UI/UX/fonts/colors, new scoring vocabulary. A floodplain gauge, not a pottery bench, memorial yard, geology core, manuscript parchment desk, cavalry lantern, Prague clock tower, herald's college, wax-tablet scriptorium, Elizabethan mask atelier, confectionery kitchen, sleep clinic, night-wall inhibitor, voice recorder, household shrine, binder folio, or theater tapestry.

**NOT #94451** (known_marketplaces.json never repaired once invalid). DIFFERENT. Do not conflate.

**NOT #94396** (fork never becomes Remote Control eligible). DIFFERENT. Do not rebuild.

**NOT #94397** (Remote Control mobile brief echo). DIFFERENT. Do not rebuild.

**NOT #94452** (directory marketplace dead `installLocation`). DIFFERENT. Do not rebuild.

**NOT #93490** (resume flatten). DIFFERENT. Do not rebuild.

**NOT Kintsugi/#94451** (marketplace rewrite never lands). Different defect. Do not reuse mended / Kintsugi / heal-abort.

**NOT Cenotaph/#94452** (dead-install / plaque polished, stone never moved). Different defect. Do not reuse homed / Cenotaph / dead-install.

**NOT Stratum/#94417** (layer-unsealed project-context). Different defect. Do not reuse shared / Stratum / layer-unsealed.

**NOT Tmesis/#86198** (mid-inject slash splice). Different defect. Do not reuse contiguous / Tmesis / mid-inject.

**NOT Vedette/#94392** (headless `-p` idle-exit / false success). Different defect. Do not reuse stationed / Vedette / idle-exit.

**NOT Orloj/#94393** (Monitor schema cap / half-life during an active session). Different defect. Do not reuse lasting / Orloj / half-life.

**NOT Brisure/#94396** (fork never becomes Remote Control eligible). Different defect. Do not reuse enrolled / Brisure / fork-resume.

**NOT Diptych/#94397** (brief echo). Different defect. Do not reuse single / Diptych / brief-echo.

**NOT Vizard/#94398** (background-reset to Opus 4.8). Different defect. Do not reuse pledged / Vizard / background-reset.

**NOT Treacle/#94344** (Windows PowerShell streaming-stall). Different defect. Do not reuse brisk / Treacle / streaming-stall.

**NOT Somnus/#94415** (Cowork cloud schedule `device_absent`). Different defect. Do not reuse cadence / Somnus / device-absent.

**NOT Cresset/#94420** (keep-awake hold-leak). Different defect. Do not reuse released / Cresset / hold-leak.

**NOT Dictabelt/#94406** (voice-dictation fragment path). Different defect. Do not reuse verbatim / Dictabelt / segment-drop.

**NOT Lemure/#94410** (orphan scheduled-task ticks). Different defect. Do not reuse quiet / Lemure / orphan-tick.

**NOT Cancellans/#94400** (deferred-delta / tools-array drop). Different defect. Do not reuse intact / Cancellans / deferred-delta.

**NOT Arras/#94348** (phantom approval card). Different defect. Do not reuse cleared / Arras / phantom-prompt.

**NOT Cachet/#93490** (resume flatten). Different defect.

**NOT Stereotype** (plugin freshness). Different defect.

Live: https://hermes-playground-green.vercel.app/freshet/

```
node --test projects/freshet/freshet.test.mjs
node projects/freshet/freshet.mjs projects/freshet/data/freshet.json
```

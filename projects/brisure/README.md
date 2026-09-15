# Brisure

A **herald's college / armorial roll / cadency desk / lacquered shield rack booth** — a *brisure* is a heraldic mark of cadency (difference) for a cadet / younger branch of a coat of arms. The parent session is on the main roll (Remote Control mobile list). The fork is a cadet branch that never receives its brisure enrollment into the bridge roll — silently omitted while every other signal looks fine (recent activity, pinned, host online). Fonts **Cinzel** (display) + **Sora** (UI) + **IBM Plex Mono** (mono). Palette: gules `#7B1224`, argent parchment `#F3EBDC`, sable ink `#0E0B09`, or `#D6B45A`, azure `#1F4F8F`, lacquer `#24160F`. Fresh trio. Completely different UI/UX/metaphor — parent shield / cadet vacancy / first-turn path / cold-resume path / bridge gap / mobile roll. NOT a scriptorium tablet. NOT an Elizabethan mask booth. NOT a confectionery kitchen. NOT a sleep ward. NOT a night-wall inhibitor. NOT a dictation recorder. NOT a household shrine. NOT a binder folio. NOT a theater tapestry. NOT Forksink. NOT Diplopia subdirectory rooms.

The college should stay **enrolled** (HOLD: parent on the main roll; first_turn armed eligible). Instead the booth was **brisure** after a **fork-resume**.

Primary:

- [anthropics/claude-code#94396](https://github.com/anthropics/claude-code/issues/94396) (OPEN). Title: `[BUG] Forked sessions never become Remote Control eligible, so they never appear in the mobile Code tab`. Labels: bug, has repro, platform:macos, area:core. Environment: Claude desktop 1.52386.6 on macOS 26.6.2 Apple Silicon; Claude Code CLI 2.1.266; Claude mobile Code tab. A session created by forking an existing session is never registered with the Remote Control bridge, so it never appears in the mobile Code tab — no error, no UI hint; simply absent. `remoteControlAutoEligible` is only assigned on a session's first turn (`finishInitialEnqueue` with first_turn). A fork adopts an existing transcript so it takes the `cold_resume` path and the flag is never set for the whole life of the session. Policy `remoteControlPolicyCovers` requires `remoteControlAutoEligible` and no `scheduledTaskId`. Nothing references `forkedFromSessionId`, so fork exclusion looks incidental. Neighbouring resume-like paths DO re-arm: `/clear` uses `??= true`; prewarm claim sets true then first_turn. Data across 25 sessions: ordinary 18 eligible+visible; scheduled 2 eligible but no bridge (expected); forked 5 absent eligible + absent bridge + never visible. Workaround: manual Remote Control enable works (`remoteControlUserRequested`) but needs an active query first. Stay off Diptych/Vizard/Treacle/Somnus/Cresset/Dictabelt/Lemure/Cancellans/Arras/Forksink/Diplopia paradigms.

19:50 brisure: a herald's college / armorial roll / cadency desk / lacquered shield rack booth for #94396. Forked sessions never become Remote Control eligible so they never appear in the mobile Code tab. Idle **enrolled** / seeded **brisure** / path **fork-resume**. Score brisure or admit enrolled.

Score brisure or admit enrolled.

Idle word: **enrolled** (HOLD: parent on the main roll; first_turn armed eligible). HOLD aliases: lineal, registered, parent, rollcall. Seeded word: **brisure** / #94396 (the fork-resume path). Path word: **fork-resume**. Product score: **brisure**. Never idle single / pledged / brisk / cadence / released / verbatim / quiet / intact / cleared or seeded Diptych / Vizard / Treacle / Somnus / Cresset / Dictabelt / Lemure / Cancellans / Arras or path names from those booths.

Phrase: **Score brisure or admit enrolled.**

- **enrolled** = IDLE HOLD: parent on the main roll; first_turn armed eligible
- **brisure** = seeded path / product score: cadet never receives its mark of cadency
- **fork-resume** = path word: cold_resume never arms eligibility
- **lineal** = HOLD alias: parent shield on the rack
- **registered** = HOLD alias: parent registered on the roll
- **parent** = HOLD alias: lineal session
- **rollcall** = HOLD alias: parchment roll-call names the parent
- **cadet** = younger branch / fork of the parent session
- **omitted** = no error and no UI hint; simply absent from the list
- **cold-resume** = fork adopts an existing transcript; flag never set
- **first-turn** = remoteControlAutoEligible is only assigned here
- **auto-eligible** = policy gate on remoteControlAutoEligible
- **user-requested** = workaround: manual Remote Control after an active query
- **scheduled** = 2 eligible but no bridge — expected, scheduledTaskId
- **bridge-absent** = forked 5: absent eligible + absent bridge
- **mobile-absent** = parent present on the Code tab; fork never is
- **94396** = issue number seed
- **landing** = herald's college / armorial roll / cadency desk
- **has-repro** = published shape: desktop 1.52386.6 · CLI 2.1.266 · macOS 26.6.2
- **cousins** = cite-only #94400 #94397 #93458 — do not rebuild; do not conflate
- **backups** = cite-only #94393 #94392 #86198 #94417 #94452 #94451 #94430 #94458 #93924 #93770 #93777 #94151 — do not auto-pick
- **fixtures** = parent shield / cadet vacancy / mobile roll
- **walk** = published idle enrolled → fork-resume → brisure
- **closed** = #94396 remains OPEN — cite only; not this booth

Verdicts: enrolled, brisure, fork-resume, lineal, registered, parent, rollcall, cadet, omitted, cold-resume, first-turn, auto-eligible, user-requested, scheduled, bridge-absent, mobile-absent, 94396, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **brisure** or already **enrolled**. Fixtures use the issue's published incident only. Session-census rows reconstructed from published text are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): a fork takes cold_resume so remoteControlAutoEligible is never armed, and the policy therefore never offers the cadet to the bridge. Invite verify against #94396 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94396](https://github.com/anthropics/claude-code/issues/94396)
- Cousins: do NOT rebuild / do NOT conflate: #94400 (Cancellans — resume-fork dropping tools-array / deferred_tools_delta / prompt-cache miss), #94397 (Diptych brief-echo double render), #93458 (Forksink source-fork). None of them is a fork that never becomes Remote Control eligible.
- Backups (data only; next focus only — do not auto-pick): #94393, #94392, #86198, #94417, #94452, #94451, #94430, #94458, #93924, #93770, #93777, #94151

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:core
- Environment: Claude desktop 1.52386.6 on macOS 26.6.2 Apple Silicon; Claude Code CLI 2.1.266; Claude mobile Code tab
- A session created by forking an existing session is never registered with the Remote Control bridge
- Never appears in the mobile Code tab — no error, no UI hint; simply absent
- Every visible signal points the other way: recent activity, pinned, host online
- An offline host could still be listed while the fork was missing
- Why (per issue): `remoteControlAutoEligible` is only assigned on first_turn
- A fork adopts an existing transcript so it takes `cold_resume` and the flag is never set
- Policy `remoteControlPolicyCovers` requires `remoteControlAutoEligible` and no `scheduledTaskId`
- Nothing references `forkedFromSessionId`, so fork exclusion looks incidental
- Neighbouring resume-like paths DO re-arm: `/clear` uses `??= true`; prewarm claim sets true then first_turn
- Data across 25 sessions: ordinary 18 eligible+visible; scheduled 2 eligible but no bridge (expected); forked 5 absent eligible + absent bridge + never visible
- Workaround: manual Remote Control enable works (`remoteControlUserRequested`) but needs an active query first
- Expected: a fork is an ordinary local session and should be offered to the bridge on the same terms

Problem found: FORK-RESUME — cold_resume never arms eligibility, so the cadet never appears on the mobile roll.

Why Brisure: A *brisure* is a heraldic mark of cadency for a cadet / younger branch. The parent stays on the main roll. The fork is a cadet that never receives its enrollment mark, so the mobile Code tab silently omits it. Cancellans/#94400 is resume-fork tools-array / deferred_tools_delta — DIFFERENT. Forksink is a storm-drain source-fork — DIFFERENT. Diptych/#94397 is brief-echo double render — DIFFERENT. This booth is specifically **forked sessions never becoming Remote Control eligible**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores fork-resume honesty (enrolled vs brisure) so operators can see the missing cadet on the mobile roll without needing Claude mobile. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A fork is an ordinary local session and should be offered to the Remote Control bridge on the same terms
2. Eligibility should re-arm on the fork path as `/clear` and prewarm already do
3. Failing that, mark such sessions as not remotely reachable instead of silently omitting them

## Why not a clone

This is specifically: **FORKED SESSIONS NEVER BECOME REMOTE CONTROL ELIGIBLE, SO THEY NEVER APPEAR IN THE MOBILE CODE TAB. DESKTOP 1.52386.6 / CLI 2.1.266; MACOS 26.6.2; COLD_RESUME NEVER ARMS REMOTECONTROLAUTOELIGIBLE; PARENT PRESENT, FORK ABSENT; NO ERROR, NO UI HINT.**

Novel paradigm: herald's college / armorial roll / cadency desk / lacquered shield rack / parchment roll-call — gules, argent, sable, or, azure. New issue, new paradigm (fork-resume), new UI/UX/fonts/colors, new scoring vocabulary. A cadency booth, not a wax-tablet scriptorium, Elizabethan mask atelier, confectionery kitchen, sleep clinic, night-wall inhibitor, voice recorder, household shrine, binder folio, or theater tapestry.

**NOT Cancellans/#94400** (deferred-delta / tools-array drop). Same family of "fork" words. DIFFERENT defect. Do not reuse intact / Cancellans / deferred-delta.

**NOT Forksink/#93458** (source-fork storm-drain). Different defect. Do not remask.

**NOT Diptych/#94397** (brief-echo). Different defect. Do not reuse single / Diptych / brief-echo.

**NOT Vizard/#94398** (background-reset to Opus 4.8). Different defect. Do not reuse pledged / Vizard / background-reset.

**NOT Treacle/#94344** (Windows PowerShell streaming-stall). Different defect. Do not reuse brisk / Treacle / streaming-stall.

**NOT Somnus/#94415** (Cowork cloud schedule `device_absent`). Different defect. Do not reuse cadence / Somnus / device-absent.

**NOT Cresset/#94420** (keep-awake hold-leak). Different defect. Do not reuse released / Cresset / hold-leak.

**NOT Dictabelt/#94406** (voice-dictation fragment path). Different defect. Do not reuse verbatim / Dictabelt / segment-drop.

**NOT Lemure/#94410** (orphan dispatcher ticks). Different defect. Do not reuse quiet / Lemure / orphan-tick.

**NOT Arras/#94348** (phantom approval card). Different defect. Do not reuse cleared / Arras / phantom-prompt.

**NOT Diplopia** (subdirectory rooms). DIFFERENT product. Do not remask.

**NOT Escutcheon.** Empty plate / keyhole. Different catalog paradigm.

Live: https://hermes-playground-green.vercel.app/brisure/

```
node --test projects/brisure/brisure.test.mjs
node projects/brisure/brisure.mjs projects/brisure/data/brisure.json
```

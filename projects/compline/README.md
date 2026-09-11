# Compline

A **cloister / monastic evening-office / compline booth** — candle, choir stall, closing bell. Fonts **Alegreya** (display) + **Karla** (body) + **Red Hat Mono** (mono). Palette: cloister dusk — deep indigo `#1A1528`, candle `#E8C872`, worn stone `#8A8478`, vellum `#EDE6D9`, cancelled-wine `#9B3B4A`, vespers violet `#5C4A7A` — dark cloister night, NOT bank vault steel/brass, NOT parchment court, NOT concert-hall velvet, NOT municipal grate, NOT marsh foxfire.

Compline is the last canonical hour that should close the day when a remote-control bridge routine finishes. Instead the office is never said: the print-resume child keeps the stall warm overnight, and the only way to force the knell (archive) rings it as failure and cancels the record.

Primary:

- [anthropics/claude-code#93549](https://github.com/anthropics/claude-code/issues/93549) (OPEN, bug, has repro, platform:macos, area:routines). Title: `remote-control: routine sessions are never sent end_session on completion, and when it is sent the harness exits non-zero.` Claude Code runtime **2.1.247**, macOS Apple Silicon, Desktop. `claude remote-control --spawn=same-dir`. Cloud routines `/v1/code/triggers` targeting `kind: bridge`. Every firing of a scheduled routine on a remote-control bridge spawns a local `claude --print --resume=<cse_…>` child. When the run completes, nothing ends it. Process stays resident indefinitely, holding a concurrent-session slot. After 10 days: 14 processes, ~1.9 GB RSS combined, oldest 10 days old, all finished hours/days earlier. Once capacity fills, next firing cannot spawn; scheduled job silently stops. Teardown exists: archiving the session delivers `control_request/end_session` and the process exits within seconds — but it is never triggered by run completion. When `end_session` IS triggered via archive: harness exits non-zero; bridge logs `Session failed: Process exited with error`; Routines UI flips succeeded → cancelled while API `last_run.status` stays SUCCEEDED. No supported cleanup: remote-control has no idle/TTL/reap; `claude stop|rm|respawn` operate on `cli_bg_*` registry not bridge sessions; kill is the only recourse. Fourth distinct spawner with the same lifecycle gap: Desktop scheduled tasks (#72308), Windows headless (#68626), agent-view (#73631), now remote-control bridge. Control trial: same routine fired twice six minutes apart; archived one exited; other completed 01:18:02 and still alive/idle 20 minutes later until manual kill. One run reported `result: success is_error=false turns=51 duration=720s` and was still resident 18 hours later with no `end_session` in log (only `rate_limit_event` ×9, `system/hook_*` ×3). Desired in the issue (scoring narrative only): send `end_session` when a routine completes at least for `persist_session:false`; that path exit 0 so recorded completed; client read the run's own status rather than deriving cancelled from archived session state. Cousins cite-only: #54626 #74682 #83718 #73900 #72308 #68626 #73631.

16:50 compline: a cloister / evening-office / compline booth for #93549. Idle **closed** / seeded **lingering** / path **unrung**. Score compline or admit closed.

Score compline or admit closed.

Idle word: **closed** (HOLD: end_session on completion, exit 0, slot freed). Seeded word: **lingering** / #93549 (run succeeded; no end_session; process resident). Path word: **unrung**. Product score: **compline**. Never idle sealed / blanked / concurrent-write / cipherlock / untainted / attainted / attainder / voiced / muted / sourdine / lodged / dropped / forksink.

Phrase: **when a remote-control bridge routine run completes successfully but never receives end_session and the child stays resident holding a concurrent-session slot (and archive-forced end_session exits non-zero flipping UI to cancelled while API stays SUCCEEDED), score compline or admit closed.**

- **closed** = IDLE: HOLD; `end_session` on completion, exit 0, slot freed
- **lingering** = #93549 seeded path: run succeeded; no `end_session`; process resident
- **compline** = product score word for the cloister whose evening office is never said
- **unrung** = path word: completion never rings `end_session`; archive-forced knell exits non-zero / UI cancelled
- **hold** = HOLD alias for idle closed
- **bridge-fire** = scheduled routine fires on a `claude remote-control` bridge
- **print-resume** = local `claude --print --resume=<cse_…>` child spawned
- **result-success** = `result: success is_error=false turns=51 duration=720s`
- **no-end-session** = no `end_session` in log (only `rate_limit_event` ×9, `system/hook_*` ×3)
- **process-resident** = still resident 18 hours later; control trial idle 20 minutes after 01:18:02
- **slot-held** = concurrent-session slot held; no idle/TTL/reap
- **capacity-full** = after 10 days: 14 processes, ~1.9 GB RSS; next firing cannot spawn
- **archive-end-session** = archiving delivers `control_request/end_session`; process exits within seconds
- **exit-nonzero** = harness exits non-zero; bridge logs `Session failed: Process exited with error`
- **ui-cancelled** = Routines UI flips succeeded → cancelled
- **api-succeeded** = API `last_run.status` stays SUCCEEDED
- **end-session-on-completion** = expected: send `end_session` when the routine completes, at least for `persist_session:false`
- **exit-zero** = expected: that path exit 0 so recorded completed
- **slot-freed** = expected: concurrent-session slot freed
- **persist-session-false** = desired least-scope for completion teardown
- **control-trial** = same routine fired twice six minutes apart; archived one exited; other lingered
- **has-repro** = Claude Code 2.1.247 · macOS Apple Silicon · Desktop · `--spawn=same-dir`
- **cousins** = cite-only #54626 #74682 #83718 #73900 #72308 #68626 #73631 — do not rebuild
- **backups** = cite-only #93475 #93439 #93438 #93466 #93495 #93508 #93530 #93536 #93534 #93532 #93494 #93525 #34690 — do not auto-pick
- **fixtures** = candle / stall / choir / bell table for the compline booth
- **walk** = published idle closed → bridge-fire → print-resume → result-success → no-end-session → process-resident → slot-held → capacity-full → archive-end-session → unrung → compline

Verdicts: closed, lingering, compline, unrung, hold, bridge-fire, print-resume, result-success, no-end-session, process-resident, slot-held, capacity-full, archive-end-session, exit-nonzero, ui-cancelled, api-succeeded, end-session-on-completion, exit-zero, slot-freed, persist-session-false, control-trial, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the office is **lingering** / **compline** or already **closed**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): routine completion path never owns `end_session` on bridge-spawned print-resume children; archive path uses non-zero exit; UI derives cancelled from archived session state. Invite verify against #93549 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93549](https://github.com/anthropics/claude-code/issues/93549)
- Cite-only cousin: [anthropics/claude-code#54626](https://github.com/anthropics/claude-code/issues/54626) (closed COMPLETED; behaviour persists; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#74682](https://github.com/anthropics/claude-code/issues/74682) (FEATURE auto-archive scheduled/routine sessions; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#83718](https://github.com/anthropics/claude-code/issues/83718) (archived session background process keeps running; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#73900](https://github.com/anthropics/claude-code/issues/73900) (`archive_session` self deletes worktree but resumes; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#72308](https://github.com/anthropics/claude-code/issues/72308) (Desktop scheduled/background never exit; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#68626](https://github.com/anthropics/claude-code/issues/68626) (Windows headless leak; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#73631](https://github.com/anthropics/claude-code/issues/73631) (agent-view stale done sessions; do not rebuild)
- Backup (data only): #93475 #93439 #93438 #93466 #93495 #93508 #93530 #93536 #93534 #93532 #93494 #93525 #34690

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:routines
- Claude Code **2.1.247**; macOS Apple Silicon; Desktop
- `claude remote-control --spawn=same-dir`; cloud routines `/v1/code/triggers` targeting `kind: bridge`
- Every scheduled-routine fire spawns `claude --print --resume=<cse_…>`
- Completion never sends `end_session`; process stays resident holding a concurrent-session slot
- After 10 days: 14 processes, ~1.9 GB RSS, oldest 10 days old
- Archive path delivers `end_session` and exits within seconds — but exits non-zero; UI cancelled; API SUCCEEDED
- Control trial six minutes apart; one archived exited; other completed 01:18:02 and lingered 20 minutes
- One run `turns=51 duration=720s` still resident 18 hours later; log had `rate_limit_event` ×9 and `system/hook_*` ×3 only

Problem found: ROUTINE COMPLETION ON REMOTE-CONTROL BRIDGE NEVER SENDS end_session → process leak + silent capacity fill; archive path exits non-zero and misreports cancelled.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the office stayed **closed** or was **lingering**. Educational cloister booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Send `end_session` when a routine completes, at least for `persist_session:false`
2. That path should exit 0 so the run is recorded completed
3. Client should read the run's own status rather than deriving cancelled from archived session state

## Why not a clone

This is specifically: **ROUTINE COMPLETION ON REMOTE-CONTROL BRIDGE NEVER SENDS end_session → process leak + silent capacity fill; archive path exits non-zero and misreports cancelled.**

**NOT Cipherlock/#93537** (concurrent Keychain MCP OAuth wipe). Different defect. NOT vault/brass dial.

**NOT Attainder/#93529** (parked-permission false user-rejected). NOT parchment court.

**NOT Sourdine/#93531** (MessageDisplay mute). NOT concert hall.

**NOT Forksink/#93458** (SessionStart additionalContext drop on fork). NOT municipal grate.

**NOT Foxfire/#93502.** **NOT Pentimento/#93482.** **NOT Vinculum/#93485.** **NOT Cachet/#93490.** **NOT Cartulary/#93331.** **NOT Pontoon/#93288** (RC bridge wash on Desktop restart — different: restart washes bridges; here completion never ends a live bridge routine child).

**NOT Quietus** (SubagentStop missing). **NOT Revenant** (peer-session liveness). **NOT Hawser/Snatch** (Bash auto-background reap).

**NOT #72308/#68626/#73631** — cousins only; this booth is remote-control bridge + `end_session` + archive non-zero + UI cancelled vs API SUCCEEDED.

Do NOT rename Compline to any existing catalog slug. Catalog currently has 287 products; Compline is #288.
Do NOT reuse idle sealed / blanked / concurrent-write, untainted / attainted, voiced / muted, lodged / dropped, or other prior booth verbs.
Display here is **Alegreya**. Body is **Karla**. Mono is **Red Hat Mono**.

Different surface: remote-control bridge routine completion never owns `end_session` vs concurrent Keychain wipe vs parked-permission false user-rejected vs MessageDisplay narration mute vs SessionStart fork drop vs Desktop-restart bridge wash.

Different UI: candle / choir stall / closing-bell gauges. Alegreya / Karla / Red Hat Mono. Dark cloister dusk. NOT bank vault. NOT parchment court. NOT concert-hall velvet. NOT municipal grate. NOT marsh lantern.

Different verbs: Ring compline, Score compline, Open the stall, Compare closed / lingering, Pin idle closed, Pin seeded lingering, Pin unrung, Clear the choir.

Different idle: **closed**. Different #93549 seeded path: **lingering**. HOLD: **closed** / **hold**. ALARM: **lingering** / **compline** / **unrung** / **no-end-session**. Path: **unrung**.

## How to score

```bash
node --test projects/compline/compline.test.mjs
node projects/compline/compline.mjs projects/compline/data/lingering.json
echo '{"seed":"lingering"}' | node projects/compline/compline.mjs
```

Open the living card at `projects/compline/index.html` (or the live path `/compline/`). Buttons: Ring compline, Score compline, Open the stall, Compare closed / lingering, Pin idle closed, Pin seeded lingering, Pin unrung, Clear the choir. Toggle chips for: bridge routine fire, print-resume child, result success, no end_session in log, process resident, concurrent slot held, capacity full, archive end_session, exit non-zero, UI cancelled, API SUCCEEDED — the score flips. Lay a fixture JSON on the choir tray. `?embed=1` hides chrome.

The booth reconstructs the reporter’s lingering walk from the published #93549 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/compline/
- Folder: `projects/compline/`

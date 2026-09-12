# Scotoma

An **ophthalmology / Humphrey-style visual-field / perimetry booth** — a clinical chart whose perimetry evaluator has a scotoma over the exact sector where the goal is written. Fonts **Libre Baskerville** (display) + **Figtree** (body) + **JetBrains Mono** (chips/log). Palette: exam ink `#0C1418`, bowl slate `#1E2C32`, chart bone `#F3EBDA`, fixation gold `#D4A017`, blind-spot carmine `#B81D45`, perimetry teal `#2A8A7A`. Humphrey bowl, fixation cross, temporal blind-spot marker, 24-2 field grid, reliability FL·FP·FN, gray-scale printout, command-args sector on the chart. NOT Aneroid (instrument-panel / wrong-window ring), NOT Simulacrum (hyperreality / phantom Chrome navigate), NOT Solenoid (switchgear / RC warm-arm), NOT Scotia (limestone / shadow-gap), NOT Canard (press-room), NOT Stet (copy-desk), NOT Blindside (sideline scout), NOT Interdict (chrome prohibit-bleed on Bash), NOT Scapegoat (Chrome grant blame), NOT Simplex (radio chassis), NOT Deadkey (typewriter platen), NOT Gleaner (wheat leftover-harvest), NOT Schism (twin-authority glass), NOT Galley (Stop hook dirty-tree billing). This is specifically: **STOP-CONDITION EVALUATOR CANNOT SEE `/goal` IN `<command-args>` — LOOPS UNTIL IT DECLARES ITSELF UNACHIEVABLE.**

The chart should stay **legible** (HOLD: goal instruction readable by the evaluator path; field clear). Instead the booth was **scotomized** after a **command-args-blind**.

Primary:

- [anthropics/claude-code#93744](https://github.com/anthropics/claude-code/issues/93744) (OPEN). Title: `/goal: Stop condition evaluator cannot see the instruction passed via /goal, loops until it declares itself unachievable`. Labels: bug, has repro, platform:macos, area:core. Claude Code **2.1.268**; macOS 15 (Darwin 25.5.0), Apple Silicon, zsh; Opus 5 (1M context). Observed 2026-09-12, unattended overnight session. A goal set with `/goal <instruction>` is stored in the transcript **only** inside `<command-args>`. There is no separate user-message record carrying that text. A scan of the transcript for slash-command records returns only two entries (`/clear` at line 7, `/goal` at line 12). Despite that, Stop fired ~9 times, each time unable to confirm the goal, and the final firing stated the condition was structurally unachievable. Last several firings produced no new work. This was **not** caused by a user hook — the user's only Stop hook is a fail-open telemetry shim that never inspects `goal`, `command-args`, or `command-name`. Confirming whether the evaluator truly cannot see `<command-args>` requires internal knowledge — inferred from the observed behavior, not verified from source. Cousins cite-only (NOT duplicates / do not rebuild as separate booths): #83266 (Stop skipped while a background task is live), #85182 (/goal stalls in plan mode because Stop cannot fire), #79981 (/goal case-insensitive). Backups cite-only (next focus only — do not auto-pick): #93772 #93770 #93777 #93782 #93862 #93859 #93863 #93889 #93821 #93811 #93809 #93823.

07:50 scotoma: an ophthalmology / visual-field / perimetry booth for #93744. Idle **legible** / seeded **scotomized** / path **command-args-blind**. Score scotoma or admit legible.

Score scotoma or admit legible.

Idle word: **legible** (HOLD: goal instruction readable by the evaluator path; field clear). HOLD aliases: legible, goal-readable, field-clear, evaluator-sees. Seeded word: **scotomized** / #93744 (goal exists only in command-args and the evaluator cannot confirm). Path word: **command-args-blind**. Product score: **scotoma**. Never idle aneroid / calibrated / aneroided / wrong-window-ring / simulacrum / tethered / hollow / phantom-navigate / solenoid / engaged / inert / warm-before-message / scotia / flush / scotiated / decstbm-undershoot / canard / candid / canarded / stet / stetted / rewound / blindside / sighted / blindsided / interdict / scoped / interdicted / simplex / deadkey / keyed / gleaner / gleaned / schism / live / rasure / intact / ashpan / swept / outrider / credentialed / necrology / attested / innominate / named / snuffer / lit / changeling / pledged / homograph / distinct / galley / billed / stop-dirty.

Phrase: **Score scotoma or admit legible.**

- **legible** = IDLE: HOLD; goal instruction readable by the evaluator path; field clear
- **scotomized** = #93744 seeded path: goal exists only in command-args and the evaluator cannot confirm
- **scotoma** = product score word for the perimetry booth
- **command-args-blind** = path word: evaluator appears not to read `<command-args>`
- **hold** = HOLD alias for idle legible
- **goal-readable** = HOLD alias: evaluator reads the `/goal` instruction
- **field-clear** = HOLD alias: no scotoma over the command-args sector
- **evaluator-sees** = HOLD alias: Stop-condition evaluator confirms the goal
- **command-args-only** = instruction exists in exactly one place — a `type:user` command-metadata record
- **no-user-message-goal** = no separate user-message record carries that text
- **stop-loop-nine** = Stop fired ~9 times; last firings produced no new work
- **unachievable-declare** = final firing declared the condition structurally unachievable
- **slash-scan-present** = `/clear` at line 7, `/goal` at line 12
- **fail-open-hook** = fail-open telemetry shim never inspects goal state
- **not-user-hook** = ruled out: not caused by a user Stop hook
- **has-repro** = published shape: Claude Code 2.1.268 / macOS / Opus 5; `/goal` only in command-args
- **cousins** = cite-only #83266 #85182 #79981
- **backups** = cite-only #93772 #93770 #93777 #93782 #93862 #93859 #93863 #93889 #93821 #93811 #93809 #93823 — do not auto-pick
- **fixtures** = exam ink / bowl slate / chart bone / fixation gold / blind-spot carmine / perimetry teal
- **walk** = published idle legible → command-args-blind → scotomized → scotoma

Verdicts: legible, scotomized, scotoma, command-args-blind, hold, goal-readable, field-clear, evaluator-sees, command-args-only, no-user-message-goal, stop-loop-nine, unachievable-declare, slash-scan-present, fail-open-hook, not-user-hook, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **scotomized** / **scotoma** or already **legible**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the Stop-condition evaluator does not read `<command-args>`, the only field that stores the `/goal` instruction, so it cannot confirm the goal and keeps re-firing until it declares the condition unachievable. Confirming that the evaluator truly cannot see `<command-args>` requires internal knowledge — inferred from the observed behavior, not verified from source. Invite verify against #93744 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93744](https://github.com/anthropics/claude-code/issues/93744)
- Cite-only cousins: #83266 (/goal Stop hook skipped while a background task is live — different: Stop never fires). #85182 (/goal stalls in plan mode because Stop cannot fire on a plan-approval prompt — different: Stop does not fire). #79981 (built-in `/goal` should be case-insensitive — different: command matching). Do not rebuild those as separate booths.
- Backups (data only; next focus only — do not auto-pick): #93772, #93770, #93777, #93782, #93862, #93859, #93863, #93889, #93821, #93811, #93809, #93823

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:core
- Environment: Claude Code 2.1.268, macOS 15 (Darwin 25.5.0), Apple Silicon, zsh, Opus 5 1M context
- `/goal <instruction>` stored in the transcript only inside `<command-args>`
- No separate user-message record carrying that text
- Slash-command scan: `/clear` at line 7, `/goal` at line 12
- Stop fired ~9 times, each time unable to confirm the goal
- Final firing declared the condition structurally unachievable
- Last several firings produced no new work
- Not a user Stop hook — fail-open telemetry shim never inspects goal / command-args / command-name
- Evaluator-cannot-see-command-args is inferred from observed behavior, not verified from source

Problem found: STOP-CONDITION EVALUATOR CANNOT SEE `/goal` IN `<command-args>` — LOOPS UNTIL IT DECLARES ITSELF UNACHIEVABLE.

Why this solution: living catalog page + node diagnostic encoding idle **legible** / seeded **scotomized** / path **command-args-blind** so operators can score whether the booth is a **scotoma** or already **legible**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. The Stop-condition evaluator should read the goal from `<command-args>` (the only place it is stored)
2. `/goal` should additionally persist the goal in a field the evaluator does read (e.g. session-level goal state)
3. When the evaluator determines its condition can never be satisfied, it should stop re-firing instead of looping

## Why not a clone

This is specifically: **STOP-CONDITION EVALUATOR CANNOT SEE `/goal` IN `<command-args>` — LOOPS UNTIL IT DECLARES ITSELF UNACHIEVABLE.**

Novel paradigm: ophthalmology / Humphrey-style visual-field / perimetry booth — a clinical chart whose evaluator has a scotoma over the exact sector where the goal is written.

**NOT Aneroid/#93901** (VS Code context ring ignores autoCompactWindow). Different defect. NOT aneroid-barometer / instrument-panel / sealed gauge. Do not reuse calibrated / aneroided / wrong-window-ring.

**NOT Blindside/#93786** (diff pane cannot see committed worktree work). Different defect. NOT sideline-scout. Do not reuse sighted / blindsided / compare-ref-unreachable.

**NOT Galley/#93745** (Stop hook dirty-tree billing). Different defect. NOT printer's galley / wet-proof. Do not reuse dry / billed / stop-dirty.

**NOT Simulacrum/#93751** (Claude-in-Chrome hollow MCP success — list connected + Navigated stamp with no process). Different defect. NOT Baudrillard / hyperreality museum / wax-museum CRT. Do not reuse tethered / hollow / phantom-navigate.

**NOT Solenoid/#93754** (Desktop Settings RC toggle fidelity + arm-at-warm vs arm-at-first-message). Different defect. NOT industrial switchgear / solenoid-coil. Do not reuse engaged / inert / warm-before-message.

**NOT Interdict/#93798** (claude-in-chrome MCP Prohibited language covers Bash/SSH). Different defect. NOT papal vellum / wax seal / diocese. Do not reuse scoped / interdicted / chrome-prohibit-bleed.

**NOT Scapegoat** (Chrome grant blame). Different defect. Do not reuse that slug.

**NOT Scotia/#93764** (DECSTBM renderer leaves 2–3 blank rows under the prompt on Linux VTE). Different defect. NOT limestone / shadow-gap / column-molding. Do not reuse flush / scotiated / decstbm-undershoot.

**NOT Canard/#93766** (VS Code extension spawn ENOENT under OneDrive cwd). Different defect. NOT press-room / newspaper-canard. Do not reuse candid / canarded / onedrive-cwd-mislabel.

**NOT Stet/#93778** (dictation buffer restores over manual composer edits). Different defect. NOT copy-desk / blue-pencil. Do not reuse stetted / rewound / mic-resume-wipe.

**NOT Simplex/#93801** (mobile Remote Control send vanishes). Different defect. NOT radio chassis. Do not reuse duplex / simplexed / mobile-uplink-silent.

**NOT Deadkey/#93788** (ESC-CSI keys dead in the 2.1.269 composer). Different defect. NOT typewriter platen. Do not reuse keyed / deadkeyed / esc-csi-dead.

**NOT Gleaner/#93794** (unreaped Bash `&` jobs reparented to PID 1). Different defect. NOT wheat leftover-harvest. Do not reuse gleaned / orphaned / unreaped-ampersand.

**NOT Schism/#93797** (SendMessage resumes a second LIVE workflow agent). Different defect. NOT twin-authority glass. Do not reuse live / schismed / resume-while-live.

Do NOT rename Scotoma to any existing catalog slug. Catalog currently has 324 products; Scotoma is #325 after Aneroid #324.
Do NOT reuse idle calibrated / aneroided / wrong-window-ring / tethered / hollow / engaged / inert / flush / scotiated / canarded / stetted / rewound / sighted / blindsided / scoped / interdicted / duplex / simplexed / keyed / deadkeyed / gleaned.

Display here is **Libre Baskerville**. Body is **Figtree**. Mono is **JetBrains Mono**.

Different surface: Stop-condition evaluator vs `/goal` command-args vs VS Code context-ring vs Claude-in-Chrome MCP hollow registration vs Settings toggle fidelity vs DECSTBM blank-row undershoot vs Chrome-MCP Bash bleed vs VS Code OneDrive spawn mislabel.

Different UI: exam ink / bowl slate / chart bone / fixation gold / blind-spot carmine / perimetry teal / Humphrey bowl / fixation cross / field grid / reliability FL·FP·FN / gray-scale printout. Libre Baskerville / Figtree / JetBrains Mono. NOT sealed gauge. NOT museum vitrine. NOT coil-plunger. NOT limestone column. NOT aged newsprint. NOT cream galley. NOT papal vellum. NOT sideline turf.

Different verbs: Admit legible, Score scotoma, Walk command-args-blind, Compare legible / scotomized, Pin idle legible, Pin seeded scotomized, Pin command-args-blind, Fixate the bowl.

Different idle: **legible**. Different #93744 seeded path: **scotomized**. HOLD: **legible** / **hold**. ALARM: **scotomized** / **scotoma** / **command-args-blind** / **command-args-only**. Path: **command-args-blind**.

## How to score

```bash
node --test projects/scotoma/scotoma.test.mjs
node projects/scotoma/scotoma.mjs projects/scotoma/data/scotomized.json
echo '{"seed":"scotomized"}' | node projects/scotoma/scotoma.mjs
```

Open the living card at `projects/scotoma/index.html` (or the live path `/scotoma/`). Buttons: Admit legible, Score scotoma, Walk command-args-blind, Compare legible / scotomized, Pin idle legible, Pin seeded scotomized, Pin command-args-blind, Fixate the bowl. Toggle chips for: command-args-blind, command-args-only, no-user-message-goal, stop-loop-nine, unachievable-declare — the score flips. Lay a fixture JSON on the chart blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s command-args-only / no-user-message / Stop-loop / unachievable walk from the published #93744 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/scotoma/
- Folder: `projects/scotoma/`

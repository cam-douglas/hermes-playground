# Surfeit

A **banquet / cellar / excess booth** — deep claret cellar, candle-gold drip, linen cloth, ink-dark casks, wine-stain spill, pewter service. Fonts **Fraunces** (display) + **Manrope** (body) + **DM Mono** (chips). Palette: deep claret `#3B0F1A`, candle gold `#E6B84D`, linen `#F3EDE2`, ink `#1A1410`, wine-stain `#8B1E3F`, pewter `#6E6A62`. Fresh trio — not the last-ten catalog faces, not the prior ophthalmology trio, not the prior paleography trio. NOT Phosphene/#94003. NOT Parablepsis/#93954. NOT Demesne/#93989. NOT Cartouche/#93772. NOT Attaint/#93821. NOT Oriel/#93809. NOT Anarthria/#93782. NOT Trismus/#93823. NOT Foundling/#93889. NOT Crasis, Tessera, Mojibake, Scissel, Feoffee, Apograph, Airlock, Scotoma, Afterimage, Thrash, Gleaner. Completely different UI/UX/metaphor. This is specifically: **QUOTA-SPAWN CASCADE — WORKFLOW KEEPS SPAWNING AFTER A TERMINAL SESSION-LIMIT; RESUMEFROMRUNID DOUBLES THE BLEED; BOTH RUNS REPORT STATUS: COMPLETED.**

The cellar should stay **tempered** (HOLD: solvent / frugal / circuit-held / no-spawn). Instead the booth was **surfeit** after a **quota-spawn-cascade**.

Primary:

- [anthropics/claude-code#94012](https://github.com/anthropics/claude-code/issues/94012) (OPEN). Title: `[BUG] Workflow keeps spawning agents after a terminal "session limit" error, and resumeFromRunId re-runs them into a second exhaustion — both report status: completed`. Labels: bug, has repro, platform:macos, area:cost, area:agents. Workflow keeps spawning agents after session quota is already gone. `resumeFromRunId` re-runs the dead ones into a second exhaustion. Neither run aborts; both report `status: completed`. Once an agent dies with `You've hit your session limit · resets <time>`, that error is terminal for the whole window — every subsequent spawn will hit it too. Orchestrator treats it as a per-agent failure and keeps feeding the queue. Measured across two runs of one workflow (same runId, second with resumeFromRunId): run 1: 108 agents, 8,527,469 subagent tokens, 34 killed by quota, 51 min wall, status completed; run 2 (resume): 108 agents, 8,052,689 subagent tokens, 42 killed by quota, 56 min wall, status completed. Shared journal.jsonl (424 records): after the FIRST agent failure, 133 more agents were started, 75 of which failed. Three defects: (1) no circuit breaker on terminal quota error; (2) resume amplifies instead of protecting (replayed cached research then re-ran failed verifiers into a different reset window, doubling spend); (3) `status: completed` on a run that lost ~39% of agents — failures in a `<failures>` block but headline says completed; model reading summary treats partial as finished (8 of 52 verifier claims had zero votes). Cost: researching one factual API question four greps + SDK header answered; 16.6M subagent tokens, two full session windows, user's Fable quota for the day. Sizing half is #92631/#91942; this report is the harness continuing after being told 34 times it was out of budget. Cousins cite-only: #91449 (in-flight subagent checkpoint after usage-limit), #92631 (Ultracode overrides workflow size), #91942 (Ultracode reported ON; 160 subagents). Backups cite-only (next focus only — do not auto-pick): #93770 #93777 #93924 #93925 #93967 #93957 #93987 #93996. Stay off Phosphene/Parablepsis/Demesne/Cartouche/Attaint/Oriel/Anarthria/Trismus/Foundling/Crasis/Tessera/Mojibake paradigms.

01:50 surfeit: a banquet / cellar / excess booth for #94012. Workflow keeps spawning after terminal session-limit; resumeFromRunId doubles the bleed; both runs report status: completed. Idle **tempered** / seeded **surfeit** / path **quota-spawn-cascade**. Score surfeit or admit tempered.

Score surfeit or admit tempered.

Idle word: **tempered** (HOLD: solvent / frugal). HOLD aliases: tempered, solvent, frugal, circuit-held, no-spawn. Seeded word: **surfeit** / #94012 (the quota-spawn cascade). Path word: **quota-spawn-cascade**. Product score: **surfeit**. Never idle quiescent / diplomatic / demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim or seeded phosphene / parablepsis / demesne / cartouche / attaint / oriel / anarthria / trismus / foundling / crasis / tessera / mojibake / layer-tree-walk / latin1-edit-wipe / home-bind-overreach / subagent-bash-outlive.

Phrase: **Score surfeit or admit tempered.**

- **tempered** = IDLE: HOLD; cellar solvent; circuit held; no spawn after quota
- **surfeit** = #94012 seeded path and product score: kitchen keeps plating after the cellar is empty
- **quota-spawn-cascade** = path word: orchestrator feeds the queue after a terminal session-limit
- **hold** = HOLD alias for idle tempered
- **solvent** = HOLD alias: cellar still has stock; quota remaining
- **frugal** = HOLD alias: kitchen plates only what the cellar can pour
- **circuit-held** = HOLD alias: terminal session-limit trips a run-wide breaker
- **no-spawn** = HOLD alias: no more agents after the first quota death
- **session-limit** = `You've hit your session limit · resets <time>` — terminal for the whole window
- **resume-amplify** = `resumeFromRunId` replays cached research then re-runs failed verifiers into a different reset window
- **status-completed-lie** = both runs headline `status: completed` after losing ~39% of agents
- **agents-108** = 108 agents on each run
- **killed-34** = run 1: 34 killed by quota
- **killed-42** = run 2 resume: 42 killed by quota
- **after-first-133** = after the FIRST agent failure, 133 more agents started, 75 failed
- **tokens-16m** = 16.6M subagent tokens; two full session windows
- **journal-424** = shared journal.jsonl 424 records
- **landing** = cellar landing / linen sill
- **has-repro** = published shape: 108 / 34 then 42 / 133 more / 16.6M / status: completed
- **cousins** = cite-only #91449 #92631 #91942 — do not conflate
- **backups** = cite-only #93770 #93777 #93924 #93925 #93967 #93957 #93987 #93996 — do not auto-pick
- **fixtures** = deep claret / candle gold / linen / ink / wine-stain / pewter
- **walk** = published idle tempered → quota-spawn-cascade → surfeit

Verdicts: tempered, surfeit, quota-spawn-cascade, hold, solvent, frugal, circuit-held, no-spawn, session-limit, resume-amplify, status-completed-lie, agents-108, killed-34, killed-42, after-first-133, tokens-16m, journal-424, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **surfeit** or already **tempered**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): orchestrator lacks a run-terminal circuit breaker on session-limit errors and treats them as per-agent failures. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94012](https://github.com/anthropics/claude-code/issues/94012)
- Cousins: #91449 cite-only (in-flight subagent checkpoint after usage-limit). #92631 cite-only (Ultracode overrides workflow size / no agent ceiling). #91942 cite-only (Ultracode reported ON without enabling; 160 subagents). Different defects. Do not conflate.
- Backups (data only; next focus only — do not auto-pick): #93770, #93777, #93924, #93925, #93967, #93957, #93987, #93996

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:cost, area:agents
- Workflow keeps spawning agents after session quota is already gone
- `resumeFromRunId` re-runs the dead ones into a second exhaustion
- Neither run aborts; both report `status: completed`
- Once an agent dies with `You've hit your session limit · resets <time>`, that error is terminal for the whole window — every subsequent spawn will hit it too
- Orchestrator treats it as a per-agent failure and keeps feeding the queue
- Run 1: 108 agents, 8,527,469 subagent tokens, 34 killed by quota, 51 min wall, status completed
- Run 2 (resume): 108 agents, 8,052,689 subagent tokens, 42 killed by quota, 56 min wall, status completed
- Shared journal.jsonl (424 records): after the FIRST agent failure, 133 more agents were started, 75 of which failed
- Three defects: (1) no circuit breaker on terminal quota error; (2) resume amplifies instead of protecting; (3) `status: completed` on a run that lost ~39% of agents (8 of 52 verifier claims had zero votes)
- Cost: one factual API question four greps + SDK header answered; 16.6M subagent tokens, two full session windows, user's Fable quota for the day
- Expected (scoring narrative only): a terminal session-limit trips a run-wide breaker; resume protects; headline does not say completed when ~39% of agents died

Problem found: QUOTA-SPAWN CASCADE — WORKFLOW KEEPS SPAWNING AFTER A TERMINAL SESSION-LIMIT; RESUMEFROMRUNID DOUBLES THE BLEED; BOTH RUNS REPORT STATUS: COMPLETED.

Why Surfeit: a surfeit is excess at a banquet — more courses than the cellar can pour. Here the kitchen keeps plating after the cellar is empty. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: living catalog page + node diagnostic encoding idle **tempered** / seeded **surfeit** / path **quota-spawn-cascade** so operators can score whether the booth is **surfeit** or already **tempered**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A terminal session-limit error should trip a run-wide circuit breaker — no further agents after the cellar is empty
2. `resumeFromRunId` should protect spent work, not replay cached research and re-run failed verifiers into a second reset window
3. A run that lost ~39% of agents should not headline `status: completed`
4. The orchestrator should not treat a window-terminal quota death as a per-agent failure and keep feeding the queue
5. After the first `You've hit your session limit · resets <time>`, 133 more agents should not start

## Why not a clone

This is specifically: **QUOTA-SPAWN CASCADE — WORKFLOW KEEPS SPAWNING AFTER A TERMINAL SESSION-LIMIT; RESUMEFROMRUNID DOUBLES THE BLEED; BOTH RUNS REPORT STATUS: COMPLETED.**

Novel paradigm: banquet / cellar / excess / empty casks / plated courses after the stock is gone — deep claret, candle gold, linen, ink, wine-stain, pewter. New issue, new paradigm (quota-spawn-cascade), new UI/UX/fonts/colors, new scoring vocabulary.

**NOT Phosphene/#94003** (WindowServer CA layer-tree thrash while streaming). Different defect. NOT ophthalmology / entoptic clinic. Do not reuse quiescent / phosphene / layer-tree-walk.

**NOT Parablepsis/#93954** (Edit/Write UTF-8-decode of Latin-1 PHP). Different defect. NOT paleography / collation desk. Do not reuse diplomatic / parablepsis / latin1-edit-wipe.

**NOT Demesne/#93989** (bwrap binds entire `/home` instead of `$HOME`). Different defect. NOT manor charter. Do not reuse demesned / demesne / home-bind-overreach.

**NOT Cartouche/#93772** (ask-for-diagram defaults to a section-summary poster). Different defect. NOT Egyptian name-oval. Do not reuse diagrammed / cartouche / section-poster.

**NOT Attaint/#93821** (cyber-safeguard false-positive; one flag stains the session). Different defect. NOT court-roll attainder. Do not reuse unattainted / attaint / session-attainder.

**NOT Oriel/#93809** (macOS Desktop pop-out/maximised plan window does not reflow). Different defect. Do not reuse reflowed / oriel / plan-no-reflow.

**NOT Anarthria/#93782** (Wispr Flow clipboard+Ctrl+V silently dropped). Different defect. Do not reuse articulate / anarthria / dictation-paste-drop.

**NOT Trismus/#93823** (macOS UNUserNotification / XPC lock-order deadlock). Different defect. Do not reuse limber / trismus / notif-xpc-deadlock.

**NOT Foundling/#93889** (subagent lifecycle does not reap `run_in_background` Bash). Different defect: child Bash outlives subagent. Surfeit is the orchestrator ignoring a terminal session-limit. Do not reuse filiated / foundling / subagent-bash-outlive.

**NOT Crasis/#93960** (non-injective store slug). Different defect. Do not reuse injective / crased / store-slug-collide.

**NOT Tessera/#93929** (macOS version-named binary path → TCC). Different defect. Do not reuse unitary / tessellated / version-path-tcc.

**NOT Mojibake/#93848** (intermittent U+FFFD of multibyte Korean in CLAUDE.md). Different defect. Do not reuse verbatim / mojibaked / fffd-spall.

**NOT Scissel / Feoffee / Apograph / Airlock** (different catalog defects).

**NOT Afterimage** (CRT phosphor residual). Different defect. NOT CRT arcade.

**NOT Scotoma/#93744** (Stop-condition evaluator cannot see `/goal` in `<command-args>`). Different defect. NOT Humphrey bowl.

**NOT Thrash / Gleaner** (different catalog thrash / unreaped leftovers). Different defects.

Do NOT rename Surfeit to any existing catalog slug. Catalog currently has 341 products; Surfeit is #342 after Phosphene #341.
Do NOT reuse idle quiescent / diplomatic / demesned / diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary or seeded phosphene / parablepsis / demesne / cartouche / attaint / oriel / anarthria / trismus / foundling / crasis / tessera / mojibake / layer-tree-walk / latin1-edit-wipe / home-bind-overreach.

Display here is **Fraunces**. Body is **Manrope**. Mono is **DM Mono**.

Different surface: quota-spawn-cascade (orchestrator keeps spawning after terminal session-limit) vs layer-tree-walk vs latin1-edit-wipe vs home-bind overreach vs wrong diagram type vs session-flag contamination vs plan-window no-reflow vs dictation paste swallow vs child Bash outliving a subagent.

Different UI: deep claret / candle gold / linen / ink / wine-stain / pewter / empty-cask meter / plated courses after stock is gone. Fraunces / Manrope / DM Mono. NOT charcoal / vitreous lilac / phosphene flash. NOT cool vellum / indigo / oxblood. NOT parchment / oak / heraldic green.

Different verbs: Admit tempered, Score surfeit, Walk quota-spawn-cascade, Compare tempered / surfeit, Pin idle tempered, Pin seeded surfeit, Pin quota-spawn-cascade, Tally the cellar.

Different idle: **tempered**. Different #94012 seeded path: **surfeit**. HOLD: **tempered** / **hold**. ALARM: **surfeit** / **quota-spawn-cascade** / **session-limit** / **resume-amplify**. Path: **quota-spawn-cascade**.

## How to score

```bash
node --test projects/surfeit/surfeit.test.mjs
node projects/surfeit/surfeit.mjs projects/surfeit/data/surfeit.json
echo '{"seed":"surfeit"}' | node projects/surfeit/surfeit.mjs
```

Open the living card at `projects/surfeit/index.html` (or the live path `/surfeit/`). Buttons: Admit tempered, Score surfeit, Walk quota-spawn-cascade, Compare tempered / surfeit, Pin idle tempered, Pin seeded surfeit, Pin quota-spawn-cascade, Tally the cellar, Score booth. Toggle chips for: quota-spawn-cascade, session-limit, resume-amplify, status-completed-lie — the score flips. Lay a fixture JSON on the linen blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s 108 / 34 then 42 / 133 more / 16.6M / status: completed walk from the published #94012 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/surfeit/
- Folder: `projects/surfeit/`

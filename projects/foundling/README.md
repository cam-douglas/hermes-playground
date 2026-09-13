# Foundling

A **foundling-hospital / orphanage / foundling-wheel / parish-ward booth** — linen wraps, brass name-tokens, abandoned cradles left at the hatch when the parent (subagent) departs; polling loops as foundlings with no ward on the register. Fonts **Cormorant Garamond** (display) + **Nunito Sans** (body) + **IBM Plex Mono** (chips). Palette: linen `#F3EDE3`, soot `#1E1A17`, rose-ribbon `#A84B5C`, brass `#B08D57`, ward-green `#3E6B5A`, panel `#FAF7F1`. NOT Gleaner/#93794 (agricultural leftover harvest / unreaped `&` / PPID 1). NOT Outrider/#93776 (cavalry dispatch / early-connect). NOT Crasis (vellum/ligature), NOT Tessera (mosaic), NOT Mojibake (compositor), NOT Scissel (mint), NOT Feoffee (chancery), NOT Apograph (scriptorium leaves), NOT Airlock (pressure-lock), NOT Scotoma (perimetry), NOT Aneroid (barometer), NOT Simulacrum (museum mannequins), NOT Solenoid (switchgear), NOT Scotia (molding), NOT Canard (press room), NOT Stet (copy desk), NOT Blindside (sideline), NOT Homograph, NOT Waif (parish intake board / sheltered), NOT Jetsam, NOT Rasure. Completely different UI/UX/metaphor. This is specifically: **SUBAGENT LIFECYCLE DOES NOT REAP OR HAND OFF ITS `run_in_background` BASH TASKS; PARENT CANNOT TASKSTOP THEM.**

The ward should stay **filiated** (HOLD: parent subagent still on the ward register; background Bash bonded to a living agent). Instead the booth was **foundling** after a **subagent-bash-outlive**.

Primary:

- [anthropics/claude-code#93889](https://github.com/anthropics/claude-code/issues/93889) (OPEN). Title: `Subagents' background Bash tasks outlive the subagent; orphaned polling loops run for an hour with no way for the parent to stop them`. Labels: bug, platform:macos, area:bash, area:agents. Environment: Claude Code 2.1.260 in Claude Desktop (macOS, Code tab), desktop app 1.52386.3. When a subagent (Agent tool, `run_in_background: true`) starts Bash with `run_in_background: true` and then finishes or is told to stop, those Bash tasks keep running. Published loops: `until ... do sleep 3; done` and `while ps ... | grep ...; do sleep 15; done`. They ran 45 to 60 minutes after their agents had reported completion, showed in the user's Background tasks panel, and could only be found and killed via `ps` and `kill`. Some loops matched their own cmdline and never exit. TaskStop covers the orchestrating session's own tasks, not a child agent's. Repro: spawn a background agent whose brief runs `until false; do sleep 3; done` with `run_in_background: true` then returns — the loop outlives the agent indefinitely with no owner. Related cite-only: #93880. **NOT #93794** (Gleaner already shipped — unreaped `&` leftover harvest). Cousins cite-only: #93794, #93126, #88702, #92583, #91523, #81462, #93880, #93387. Backups cite-only (next focus only — do not auto-pick): #93772 #93770 #93777 #93782 #93821 #93811 #93809 #93823 #93924 #93925 #93954. Stay off Gleaner/Outrider/Crasis/Tessera/Mojibake/Scissel/Feoffee/Apograph/Airlock/Scotoma/Aneroid/Simulacrum/Solenoid/Scotia/Canard/Stet/Blindside/Homograph/Waif paradigms.

17:50 foundling: a foundling-hospital / parish-ward booth for #93889. Idle **filiated** / seeded **foundling** / path **subagent-bash-outlive**. Score foundling or admit filiated.

Score foundling or admit filiated.

Idle word: **filiated** (HOLD: parent subagent still on the ward register; background Bash bonded to a living agent). HOLD aliases: filiated, bonded, registered, warded, acknowledged, parented. Seeded word: **foundling** / #93889 (subagent finished; background Bash left at the hatch with no owner). Path word: **subagent-bash-outlive**. Product score: **foundling**. Never idle injective / crased / store-slug-collide / unitary / tessellated / tessera / version-path-tcc / verbatim / plenary / vested / singular / equalized / legible / calibrated / tethered / engaged / flush / candid / stetted / scisselled / unseised / apographed / mojibaked / mojibake / fffd-spall / gleaned / orphaned / unreaped-ampersand / credentialed / outridden / early-connect / intact / rasured / creation-time-flip.

Phrase: **Score foundling or admit filiated.**

- **filiated** = IDLE: HOLD; parent subagent still on the ward register; background Bash bonded to a living agent
- **foundling** = #93889 seeded path and product score: subagent finished; background Bash left at the hatch with no owner
- **subagent-bash-outlive** = path word: subagent lifecycle does not reap or hand off `run_in_background` Bash
- **hold** = HOLD alias for idle filiated
- **bonded** = HOLD alias: Bash still bonded to a living parent
- **registered** = HOLD alias: parent name still on the ward register
- **warded** = HOLD alias: cradle stays in the ward, not at the hatch
- **acknowledged** = HOLD alias: parent still acknowledges the loop
- **parented** = HOLD alias: living parent still owns the token
- **polling-loop** = `until false; do sleep 3; done` still turns after the parent departs
- **taskstop-gap** = TaskStop covers the parent's own tasks, not a child agent's
- **background-panel** = hour-old tasks the user did not start; no owner on the panel
- **cmdline-self-match** = `while ps | grep` matches its own cmdline and never exits
- **agent-finished** = subagent reported completion; parent name leaves the register
- **has-repro** = published shape: macOS Desktop 2.1.260 / 1.52386.3 / until-sleep / TaskStop gap
- **cousins** = cite-only #93794, #93126, #88702, #92583, #91523, #81462, #93880, #93387
- **backups** = cite-only #93772 #93770 #93777 #93782 #93821 #93811 #93809 #93823 #93924 #93925 #93954 — do not auto-pick
- **fixtures** = linen / soot / rose-ribbon / brass / ward-green / panel
- **walk** = published idle filiated → subagent-bash-outlive → foundling

Verdicts: filiated, foundling, subagent-bash-outlive, hold, bonded, registered, warded, acknowledged, parented, polling-loop, taskstop-gap, background-panel, cmdline-self-match, agent-finished, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **foundling** or already **filiated**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): background Bash tasks are session-scoped rather than agent-scoped, so subagent completion does not cascade a reap/hand-off; TaskStop is keyed to the parent session's own task ids. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93889](https://github.com/anthropics/claude-code/issues/93889)
- Cite-only cousins: #93794 (Gleaner already shipped — unreaped `&`); #93126, #88702, #92583, #91523, #81462, #93880, #93387. Do not rebuild as separate booths.
- Backups (data only; next focus only — do not auto-pick): #93772, #93770, #93777, #93782, #93821, #93811, #93809, #93823, #93924, #93925, #93954 (Latin-1 byte corruption — encoding-adjacent to Mojibake, cite only)

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, platform:macos, area:bash, area:agents
- Environment: Claude Code 2.1.260 in Claude Desktop (macOS, Code tab), desktop app 1.52386.3
- Subagent (Agent tool, `run_in_background: true`) starts Bash with `run_in_background: true`
- When the subagent finishes or is told to stop, those Bash tasks keep running
- Polling loops: `until ... do sleep 3; done` and `while ps ... | grep ...; do sleep 15; done`
- Ran 45 to 60 minutes after agents reported completion
- Showed in the user's Background tasks panel
- Could only be killed via `ps` and `kill`
- Some loops matched their own cmdline and never exit
- TaskStop covers the orchestrating session's own tasks, not a child agent's
- tsc-waiter case: the loop blocks the typecheck it waits for
- Related cite-only: #93880
- Repro: spawn a background agent whose brief runs `until false; do sleep 3; done` with `run_in_background: true` then returns — loop outlives the agent indefinitely with no owner

Problem found: SUBAGENT LIFECYCLE DOES NOT REAP OR HAND OFF ITS `run_in_background` BASH TASKS; PARENT CANNOT TASKSTOP THEM.

Why this solution: living catalog page + node diagnostic encoding idle **filiated** / seeded **foundling** / path **subagent-bash-outlive** so operators can score whether the booth is a **foundling** or already **filiated**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A subagent's background Bash tasks are terminated (or at least surfaced to the parent with their ids) when the subagent's turn ends, unless it explicitly hands them off
2. The parent session can list and stop background tasks started by its subagents
3. The Background tasks panel offers a "stop all from finished agents" action

## Why not a clone

This is specifically: **SUBAGENT LIFECYCLE DOES NOT REAP OR HAND OFF ITS `run_in_background` BASH TASKS; PARENT CANNOT TASKSTOP THEM.**

Novel paradigm: foundling hospital / orphanage / foundling-wheel / parish ward — linen wraps, brass name-tokens, abandoned cradles left at the hatch when the parent (subagent) departs.

**NOT Gleaner/#93794** (Background `&` jobs in a Bash tool call orphaned to PID 1). Different defect. NOT agricultural leftover-harvest / wheat / stubble / sickle. Do not reuse gleaned / orphaned / unreaped-ampersand. Gleaner is leftover harvest at Bash-call end; Foundling is subagent-lifecycle `run_in_background` with no parent TaskStop.

**NOT Outrider/#93776** (bare connect rode ahead of headersHelper). Different defect. NOT cavalry dispatch. Do not reuse credentialed / outridden / early-connect.

**NOT Crasis/#93960** (non-injective store slug fuses two project paths). Different defect. NOT manuscript crasis / fused ligature / vellum drawers. Do not reuse injective / crased / store-slug-collide.

**NOT Tessera/#93929** (macOS version-named binary path → TCC row per release). Different defect. NOT mosaic / tesserae / privacy-pane. Do not reuse unitary / tessellated / version-path-tcc.

**NOT Mojibake/#93848** (Windows embedded CLAUDE.md UTF-8 → three U+FFFD). Different defect. NOT compositor / foul-proof / geta-tofu. Do not reuse verbatim / mojibaked / fffd-spall.

**NOT Scissel/#93915** (Windows Bash argv `-c` 8203 truncation / `\\` collapse). Different defect. NOT mint / coin-press / punch-and-scissel. Do not reuse plenary / scisselled / argv-trunc.

**NOT Feoffee/#93863** (preview_start getcwd EPERM despite parent FDA). Different defect. NOT medieval feoffment / livery-of-seisin / chancery. Do not reuse vested / unseised / preview-eperm.

**NOT Apograph/#93859** (Desktop reopen forks a full transcript copy). Different defect. NOT scriptorium / stacked parchment leaves / session-ID wax seals. Do not reuse singular / apographed / reopen-fork.

**NOT Airlock/#93862** (sandbox socat proxy readiness race). Different defect. NOT submarine / spacecraft pressure-lock. Do not reuse equalized / blown / socat-race.

**NOT Scotoma/#93744** (Stop-condition evaluator cannot see `/goal` in `<command-args>`). Different defect. NOT ophthalmology / Humphrey bowl / perimetry. Do not reuse legible / scotomized / command-args-blind.

**NOT Aneroid/#93901** (VS Code context ring ignores autoCompactWindow). Different defect. NOT aneroid-barometer / instrument-panel / sealed gauge. Do not reuse calibrated / aneroided / wrong-window-ring.

**NOT Simulacrum/#93751** (Claude-in-Chrome hollow MCP success). Different defect. NOT Baudrillard / hyperreality museum. Do not reuse tethered / hollow / phantom-navigate.

**NOT Solenoid/#93754** (Desktop Settings RC toggle fidelity). Different defect. NOT industrial switchgear / solenoid-coil. Do not reuse engaged / inert / warm-before-message.

**NOT Scotia/#93764** (DECSTBM renderer leaves 2–3 blank rows). Different defect. NOT limestone / shadow-gap. Do not reuse flush / scotiated / decstbm-undershoot.

**NOT Canard/#93766** (VS Code extension spawn ENOENT under OneDrive cwd). Different defect. NOT press-room. Do not reuse candid / canarded / onedrive-cwd.

**NOT Stet/#93778** (dictation buffer restores over manual composer edits). Different defect. NOT copy-desk. Do not reuse stetted / rewound / mic-resume-wipe.

**NOT Blindside/#93786** (diff pane cannot see committed worktree work). Different defect. NOT sideline-scout. Do not reuse sighted / blindsided / compare-ref-unreachable.

**NOT Homograph/#93743** (non-ASCII store-slug collision). Different framing. Do not reuse collided / lossy-slug / dash-collapse.

**NOT Waif** (parish foundling-home intake board / idle sheltered). Different defect and different UI. Do not reuse sheltered / intake board.

**NOT Rasure/#93791** (CreationTime flip / parchment scrape). Different defect. Do not reuse intact / rasured / creation-time-flip.

Do NOT rename Foundling to any existing catalog slug. Catalog currently has 332 products; Foundling is #333 after Crasis #332.
Do NOT reuse idle injective / crased / store-slug-collide / unitary / tessellated / version-path-tcc / verbatim / plenary / vested / unseised / preview-eperm / singular / apographed / reopen-fork / equalized / blown / socat-race / legible / scotomized / command-args-blind / calibrated / aneroided / wrong-window-ring / tethered / hollow / engaged / inert / flush / scotiated / canarded / stetted / rewound / sighted / blindsided / scoped / interdicted / gleaned / orphaned / inherited / unreaped-ampersand / credentialed / outridden / early-connect / intact / rasured / creation-time-flip / scisselled / argv-trunc / mojibaked / mojibake / fffd-spall / sheltered.

Display here is **Cormorant Garamond**. Body is **Nunito Sans**. Mono is **IBM Plex Mono**.

Different surface: subagent `run_in_background` Bash that outlives the child agent vs Bash-call `&` leftover harvest vs cavalry early-connect vs non-injective store slug vs version-named TCC path vs Windows embedded CLAUDE.md U+FFFD vs argv `-c` truncation vs preview_start getcwd EPERM vs Desktop sidebar reopen session-ID fork vs sandbox socat race vs Stop-condition evaluator vs VS Code context-ring vs Claude-in-Chrome MCP hollow registration vs Settings toggle fidelity vs DECSTBM blank-row undershoot vs VS Code OneDrive spawn mislabel.

Different UI: linen / soot / rose-ribbon / brass / ward-green / panel / foundling wheel / brass name-token / abandoned cradle / parish ward register. Cormorant Garamond / Nunito Sans / IBM Plex Mono. NOT wheat stubble. NOT cavalry pouch. NOT vellum ligature. NOT limestone mosaic. NOT rice-paper type case. NOT slag floor copper die. NOT oak panel parchment. NOT cream parchment scriptorium. NOT navy hull. NOT Humphrey bowl. NOT sealed gauge. NOT museum vitrine. NOT coil-plunger. NOT limestone column-molding. NOT aged newsprint. NOT Waif intake board.

Different verbs: Admit filiated, Score foundling, Walk subagent-bash-outlive, Compare filiated / foundling, Pin idle filiated, Pin seeded foundling, Pin subagent-bash-outlive, Turn the foundling wheel.

Different idle: **filiated**. Different #93889 seeded path: **foundling**. HOLD: **filiated** / **hold**. ALARM: **foundling** / **subagent-bash-outlive** / **polling-loop** / **taskstop-gap**. Path: **subagent-bash-outlive**.

## How to score

```bash
node --test projects/foundling/foundling.test.mjs
node projects/foundling/foundling.mjs projects/foundling/data/foundling.json
echo '{"seed":"foundling"}' | node projects/foundling/foundling.mjs
```

Open the living card at `projects/foundling/index.html` (or the live path `/foundling/`). Buttons: Admit filiated, Score foundling, Walk subagent-bash-outlive, Compare filiated / foundling, Pin idle filiated, Pin seeded foundling, Pin subagent-bash-outlive, Turn the foundling wheel. Toggle chips for: subagent-bash-outlive, agent-finished, polling-loop, taskstop-gap — the score flips. Lay a fixture JSON on the linen blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s until-sleep / TaskStop-gap / Background-tasks-panel walk from the published #93889 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/foundling/
- Folder: `projects/foundling/`

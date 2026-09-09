# Vizard

A **masquerade / Elizabethan vizard atelier booth** — deep wine velvet, gilt filigree mask frame, candle amber, ivory parchment, oxblood, soft gold leaf; fonts **Cinzel** (display) + **Karla** (body) + **Azeret Mono** (mono) — for a real Claude Code defect: **DESKTOP APP RESOLVES /PLAN TO BUILT-IN PLAN MODE; CLI CORRECTLY RESOLVES IT TO THE PROJECT'S /PLAN COMMAND.**

Primary:

- [anthropics/claude-code#93190](https://github.com/anthropics/claude-code/issues/93190) (OPEN, bug, has repro, platform:windows, area:skills, area:desktop). Title: `[BUG] Desktop app resolves /plan to built-in plan mode; CLI correctly resolves it to the project's /plan command`. Project-level `/plan` at `.claude/commands/plan.md` invokes a project `planning` skill. In the terminal CLI, typing `/plan` shows the command description with `(project)` and runs the project command. In Remote Control from Claude Desktop, `/plan <slug> <context>` enters built-in plan mode with the argument string as the plan description. The project command is unreachable from Desktop. Two surfaces disagree on slash-command precedence; Desktop is wrong. CLI already gives project commands priority over built-ins; Desktop should match. Semantics are incompatible, not just different: Plan mode is a read-only permission mode. The project's `/plan` is a workflow (interview, explore via subagents, draft `.claude/plans/<slug>/PLAN.md`, review agents, may write/run tests, commit and land on origin/main). Read-only is wrong for it. Companion `/work <slug>` executes a plan. Repro: (1) `.claude/commands/plan.md` project command that does more than enter plan mode. (2) CLI: `/plan foo bar` runs the project command with `$ARGUMENTS`. (3) Start Remote Control `claude --remote-control --spawn worktree`, connect from Desktop. (4) Desktop: `/plan foo bar` — Instantly locally: permission mode flips to Plan, `/plan` stripped, `foo bar` left unsent in composer. No round trip; server-side CLI resolution never runs. Regression: yes, worked in a previous version. Claude Code CLI 2.1.266; Claude Desktop Windows 1.49585.0 (41ad1d) built 2026-09-08; Windows 11 Pro 23H2 22631.3155; PowerShell; intercept appears entirely client-side in Desktop.

06:50 vizard: a masquerade / Elizabethan vizard atelier booth that should keep the face **unmasked** (CLI-style precedence — project `/plan` wins; description shows `(project)`); instead Desktop wears the built-in `/plan` as a **vizard** — score vizard or admit unmasked.

Score vizard or admit unmasked.

Idle word: **unmasked** (HOLD: CLI-style precedence — project `/plan` wins; description shows `(project)`; command runs with `$ARGUMENTS`). Seeded word: **vizard** / #93190 (Desktop client-side intercept — built-in plan mode; `/plan` stripped; args left unsent; no round trip). Path word: **precedence**. Never idle carrier / deadair / squelch / moored / scuttled / scuttle / open / seated / stopcock / preserved / discarded / fresh / stamped / cleared / mounded / distinct / conflated / held / steered / raised / fallen / sterling / primed / flashed / lodged / bypassed / greenroomed / scaffold / diplopic / freewheeling / doubled.

Phrase: **when Desktop wears the built-in /plan as a vizard over the project's command, precedence never runs — score vizard or admit unmasked.**

- **unmasked** = IDLE: HOLD; CLI-style precedence; project `/plan` wins; `(project)`; `$ARGUMENTS` run
- **vizard** = #93190 seeded path: Desktop client-side intercept; built-in plan mode; `/plan` stripped; args unsent; no round trip
- **precedence** = path word: project commands must outrank built-ins on every surface
- **project-command** = HOLD alias: `.claude/commands/plan.md` invokes a `planning` skill
- **hold** = HOLD alias for idle unmasked
- **built-in-plan-mode** = permission mode flips to Plan
- **client-side-intercept** = intercept appears entirely client-side in Desktop
- **remote-control-desktop** = `claude --remote-control --spawn worktree`
- **arguments-unsent** = `foo bar` left unsent in composer
- **no-round-trip** = server-side CLI resolution never runs
- **read-only-wrong-mode** = Plan mode is read-only; project `/plan` may write
- **companion-work** = companion `/work <slug>` executes a plan
- **has-repro** = CLI 2.1.266 + Desktop 1.49585.0 (41ad1d) windows walk
- **cousins** = cite-only #82676 #89398 #85654 #68252 #68102 #29156 #28379 #92138 — do not clone
- **fixtures** = row list for the vizard booth
- **walk** = published idle unmasked → project-command → cli-project → remote-control-desktop → client-side-intercept → built-in-plan-mode → slash-stripped → arguments-unsent → no-round-trip → read-only-wrong-mode → companion-work → vizard → precedence

Verdicts: unmasked, vizard, precedence, hold, project-command, built-in-plan-mode, client-side-intercept, remote-control-desktop, arguments-unsent, no-round-trip, read-only-wrong-mode, companion-work, has-repro, cousins, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring masquerade booth. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the face is **vizard** or already **unmasked**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): Desktop composer does its own slash handling and hard-binds `/plan` to built-in plan mode before submission, so project-command precedence that the CLI applies never gets a chance. Invite verify against #93190 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93190](https://github.com/anthropics/claude-code/issues/93190)
- Cite-only: [anthropics/claude-code#82676](https://github.com/anthropics/claude-code/issues/82676) (Desktop SSH slash palette omits remote custom skills — lazy CLI spawn)
- Cite-only: [anthropics/claude-code#89398](https://github.com/anthropics/claude-code/issues/89398) (Desktop slash picker only opens when `/` is first character)
- Cite-only: [anthropics/claude-code#85654](https://github.com/anthropics/claude-code/issues/85654) (slash inside collapsed pasted-text never dispatched)
- Cite-only: [anthropics/claude-code#68252](https://github.com/anthropics/claude-code/issues/68252) (opposite failure: built-ins typed in Remote Control routed as plain text)
- Cite-only: [anthropics/claude-code#68102](https://github.com/anthropics/claude-code/issues/68102) (opposite failure: built-ins typed in Remote Control routed as plain text)
- Cite-only: [anthropics/claude-code#29156](https://github.com/anthropics/claude-code/issues/29156) (opposite failure: built-ins typed in Remote Control routed as plain text)
- Cite-only: [anthropics/claude-code#28379](https://github.com/anthropics/claude-code/issues/28379) (opposite failure: built-ins typed in Remote Control routed as plain text)
- Cite-only: [anthropics/claude-code#92138](https://github.com/anthropics/claude-code/issues/92138) (two built-ins share `/design`)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:skills, area:desktop
- Project `/plan` at `.claude/commands/plan.md` invokes a `planning` skill
- CLI: `/plan` shows `(project)` and runs the project command
- Desktop Remote Control: `/plan <slug> <context>` enters built-in plan mode
- Project command unreachable from Desktop
- CLI already gives project commands priority; Desktop should match
- Plan mode is read-only; project's `/plan` may write/run tests, commit, land on origin/main
- Companion `/work <slug>` executes a plan
- Desktop: `/plan foo bar` — Instantly locally: Plan mode, `/plan` stripped, `foo bar` unsent
- No round trip; server-side CLI resolution never runs
- Regression: yes. CLI 2.1.266; Desktop Windows 1.49585.0 (41ad1d) built 2026-09-08
- Windows 11 Pro 23H2 22631.3155; PowerShell; intercept appears entirely client-side

Problem found: WHEN DESKTOP WEARS THE BUILT-IN /PLAN AS A VIZARD OVER THE PROJECT'S COMMAND, PRECEDENCE NEVER RUNS.

Why this solution: a diagnostic masquerade booth for the unmasked → vizard drift, so a reader can pin idle unmasked, load the #93190 vizard path, and score precedence / built-in-plan-mode / client-side-intercept / arguments-unsent against the published facts.

## Why not a clone

This is specifically: **DESKTOP APP RESOLVES /PLAN TO BUILT-IN PLAN MODE; CLI CORRECTLY RESOLVES IT TO THE PROJECT'S /PLAN COMMAND.**

**NOT Dead Air/#93155** (silent 900s API stall with keepalive ACK / zero log). Different paradigm.

**NOT Scuttle/#93154** (remote SSH warm-up-failure `server.shutdown` SIGKILL). Different paradigm.

**NOT Stopcock/#93143** (Streamable HTTP MCP ~6min hard seat). Different paradigm.

**NOT Parergon/#93122** (stealth idle over an open `/btw` side chat). Different paradigm.

**NOT Stereotype/#93108** (plugin update version-string-only freshness). Different paradigm.

**NOT Midden/#93081** (WorktreePool partial-remove GC remound loop). Different paradigm.

**NOT Diplopia/#93012** (Remote Control environment-label field split). Different paradigm.

**NOT Greenroom/#92988** (Desktop Code tab missing wait-for-full-turn-end queue). Different paradigm.

**NOT Guillotine/#92974** (background-mode Deny-only permission dialog). Different paradigm.

**NOT Understudy / Mirage / Trompe / Homonym / Shibboleth / Procrustes / Interlock** (different slash/MCP/name paradigms).

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **Desktop client-side `/plan` intercept so CLI project-command precedence never runs.**

Do NOT rename this product Dead Air, Scuttle, Stopcock, Parergon, Stereotype, Midden, Guillotine, Understudy, Mirage, Trompe, Homonym, Shibboleth, or any existing catalog slug.
Do NOT reuse idle unmasked / vizard / precedence on a later booth.
Do NOT reuse Oswald + Source Sans 3 + Share Tech Mono (Dead Air). Do NOT reuse DM Serif Display + Lexend + JetBrains Mono (Scuttle). Do NOT reuse Literata + Source Sans 3 + IBM Plex Mono as a stack (Stopcock). Do NOT reuse Instrument Serif + Schibsted Grotesk + Fragment Mono (Parergon). Do NOT reuse Alegreya + Karla + Noto Sans Mono as a stack (Stereotype — body font Karla is shared here, display and mono are not). Display here is **Cinzel**. Body is **Karla**. Mono is **Azeret Mono**.

Different surface: Desktop `/plan` built-in intercept vs silent 900s API stall / remote-SSH `server.shutdown` / Streamable HTTP MCP hard seat / stealth-/btw-aside discard / version-string-only plugin freshness / WorktreePool orphaned-GC deadlock / Deny-only permission dialog.

Product name stays **Vizard**. Name/slug `vizard` unused in catalog.json (254 products before this ship; Dead Air is #254).

Different UI: masquerade / Elizabethan vizard atelier / deep wine velvet / gilt filigree mask / candle amber / ivory parchment / oxblood / soft gold leaf. Cinzel / Karla / Azeret Mono. NOT charcoal radio studio (Dead Air). NOT naval shipyard (Scuttle). NOT brass plumbing (Stopcock). NOT parchment/manuscript aside (Parergon). NOT letterpress (Stereotype). NOT scaffold/guillotine. NOT theater green room.

Different verbs: Walk the atelier, Admit unmasked, Score vizard, Pin idle unmasked, Pin seeded vizard, Lift the vizard, Gild the frame, Light the taper, Reset the masque.

Different idle: **unmasked**. Different #93190 seeded path: **vizard**. HOLD: **unmasked** / **project-command**. ALARM: **vizard** / **precedence** / **built-in-plan-mode** / **client-side-intercept** / **remote-control-desktop** / **arguments-unsent** / **no-round-trip** / **read-only-wrong-mode** / **companion-work**. Path: **precedence**.

## How to score

```bash
node --test projects/vizard/vizard.test.mjs
node projects/vizard/vizard.mjs projects/vizard/data/93190.json
node projects/vizard/vizard.mjs projects/vizard/data/unmasked.json
echo '{"seed":"vizard"}' | node projects/vizard/vizard.mjs
```

Open the living card at `projects/vizard/index.html` (or the live path `/vizard/`). Buttons: Walk the atelier, Admit unmasked, Score vizard, Pin idle unmasked, Pin seeded vizard, Pin precedence, Lift the vizard, Gild the frame, Light the taper, Reset the masque. Toggle project-wins / plan-mode / intercept / args-unsent — the score flips. Rest a fixture JSON on the atelier tray. `?embed=1` hides chrome.

The booth reconstructs the reporter’s Desktop `/plan` intercept walk from the published #93190 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/vizard/
- Folder: `projects/vizard/`

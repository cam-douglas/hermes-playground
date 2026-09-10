# Escheat

A **feudal escheat chamber / royal escheator inquisition post mortem desk** — twilight stone hall, parchment inquisitions, struck PID ledger, orphan worktree coffer, wax escheat seal. Fonts **Cardo** (display) + **Figtree** (UI) + **Fragment Mono** (mono). Palette: twilight stone, slate-teal desk, cool inquisition vellum, struck-PID vermillion, royal escheat teal, iron-coffer steel — for a real Claude Code defect: **VS CODE WINDOW-CLOSE SHUTDOWN LEAVES GIT WORKTREE `locked` NAMING A DEAD PID WITH NO LATER REAPER.**

Primary:

- [anthropics/claude-code#93231](https://github.com/anthropics/claude-code/issues/93231) (OPEN, bug, has repro, platform:windows, area:core, platform:vscode). Title: `Session exit on VS Code window close never releases its git worktree lock; locked keeps naming the dead PID and no later session reaps it`. Claude Code 2.1.118; Windows 11 Pro 10.0.26200; VS Code 1.137.0 (entrypoint `claude-vscode`); git 2.53.0.windows.1. Session in `.claude/worktrees/feature-branch` on `worktree-feature-branch` under `X:\myrepo`. 20:17:04 final turn `stop_reason end_turn`. ~20:22 VS Code closed; shutdown writes `bridge-session` and `last-prompt`. 20:24 new session in main checkout; PID 75688 confirmed dead; lock file unchanged (`claude session feature-branch (pid 75688)`). `git worktree prune` skips; `git worktree remove` refuses without `--force`. `--resume` from the main checkout does not list the session.

12:50 escheat: a feudal escheat chamber / royal escheator desk booth that should keep the git worktree lock **released** when the session ends (shutdown that writes bridge-session / last-prompt also releases the lock; failing that, a later session in the same repo treats a lock whose recorded PID is not running as stale and reaps it); instead VS Code window-close dies without releasing `.git/worktrees/<name>/locked`, the file keeps naming the dead PID, prune skips it, remove refuses without `--force`, and `--resume` from the main checkout does not list the session (#93231). Score escheat or admit released.

Score escheat or admit released.

Idle word: **released** (HOLD: lock released on session end; later session finds nothing to reap). Seeded word: **escheat** / #93231 (window-close shutdown writes bridge-session / last-prompt but leaves `locked` naming a dead PID; no later reaper). Path word: **stale**. Never idle freehold / mortmain / phantom / trunked / strowger / exchanged / tokenized / mondegreen / parsed / locked / scratched / derby / unmasked / vizard / precedence / carrier / deadair / squelch / moored / scuttled / scuttle / open / seated / stopcock / preserved / discarded / fresh / stamped / cleared / mounded / corked / relayed.

Phrase: **when VS Code window-close shutdown leaves the git worktree lock naming a dead PID with no later reaper, escheat never stays released — score escheat or admit released.**

- **released** = IDLE: HOLD; lock given back on session end; later session finds nothing to reap
- **escheat** = #93231 seeded path: window-close leaves `locked` naming a dead PID; no later reaper
- **stale** = path word: later session should reap a lock whose recorded PID is not running; it does not
- **hold** = HOLD alias for idle released
- **window-close** = ~20:22 VS Code closed; session in `.claude/worktrees/feature-branch`
- **shutdown-wrote** = shutdown writes `bridge-session` and `last-prompt`; process exits
- **lock-unreleased** = lock file unchanged: `claude session feature-branch (pid 75688)`
- **dead-pid** = 20:24 new session in main checkout; PID 75688 confirmed dead
- **prune-skips** = `git worktree list` still shows the worktree; prune will not remove
- **remove-refuses** = `git worktree remove` errors without `--force`
- **resume-hidden** = session not listed by `--resume` from the main checkout; work looks lost
- **has-repro** = window-close + shutdown-wrote + dead-PID lock walk
- **cousins** = cite-only #79888 #51643 #77268 #84787 #89199 #28546 — do not rebuild
- **backups** = cite-only #93219 #93207 #93198 #93177 #93210 — do not auto-pick as primary
- **fixtures** = row list for the escheat booth
- **walk** = published idle released → window-close → shutdown-wrote → lock-unreleased → dead-pid → prune-skips → remove-refuses → resume-hidden → escheat → stale

Verdicts: released, escheat, stale, hold, window-close, lock-unreleased, dead-pid, prune-skips, remove-refuses, resume-hidden, shutdown-wrote, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring escheat chamber. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the inquest is **escheat** or already **released**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the VS Code window-close shutdown that writes `bridge-session` / `last-prompt` does not release the worktree lock, and a later session does not treat a lock whose recorded PID is not running as stale. Invite verify against #93231 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93231](https://github.com/anthropics/claude-code/issues/93231)
- Cite-only cousin: [anthropics/claude-code#79888](https://github.com/anthropics/claude-code/issues/79888) (bg session locks not released on end; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#51643](https://github.com/anthropics/claude-code/issues/51643) (closed — detect/clean stale-PID locks; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#77268](https://github.com/anthropics/claude-code/issues/77268) (cite-only from the #93231 brief; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#84787](https://github.com/anthropics/claude-code/issues/84787) (cite-only from the #93231 brief; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#89199](https://github.com/anthropics/claude-code/issues/89199) (cite-only from the #93231 brief; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#28546](https://github.com/anthropics/claude-code/issues/28546) (stale `index.lock` — different lock family; do not rebuild)
- Backup (data only): [anthropics/claude-code#93219](https://github.com/anthropics/claude-code/issues/93219) (Vernier — effort slider inert)
- Backup (data only): [anthropics/claude-code#93207](https://github.com/anthropics/claude-code/issues/93207) (iOS plan approval setMode auto)
- Backup (data only): [anthropics/claude-code#93198](https://github.com/anthropics/claude-code/issues/93198) (Cedilla accented paths)
- Backup (data only): [anthropics/claude-code#93177](https://github.com/anthropics/claude-code/issues/93177) (opusplan stays Opus)
- Backup (data only): [anthropics/claude-code#93210](https://github.com/anthropics/claude-code/issues/93210) (sidebar stale order)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:core, platform:vscode
- Claude Code 2.1.118; Windows 11 Pro 10.0.26200; VS Code 1.137.0 (entrypoint `claude-vscode`); git 2.53.0.windows.1
- Session running in `.claude/worktrees/feature-branch` on branch `worktree-feature-branch` under main checkout `X:\myrepo`
- 20:17:04 final assistant turn completes normally (`stop_reason end_turn`)
- ~20:22 VS Code closed; shutdown writes `bridge-session` and `last-prompt`; process exits
- 20:24 new session in main checkout; PID confirmed dead; lock file unchanged (`claude session feature-branch (pid 75688)`)
- `git worktree list` still shows the worktree; prune will not remove; remove errors without `--force`
- Expected: release lock on that shutdown path, OR later session reaps lock when PID is not running. Neither happens.
- Secondary: session not listed by `--resume` from main checkout (user thinks work lost)

Problem found: WHEN VS CODE WINDOW-CLOSE SHUTDOWN LEAVES THE GIT WORKTREE LOCK NAMING A DEAD PID WITH NO LATER REAPER, ESCHEAT NEVER STAYS RELEASED.

Why this solution: a diagnostic feudal escheat chamber / royal escheator inquisition desk for the released → escheat drift, so a reader can pin idle released, load the #93231 escheat path, and score stale / window-close / lock-unreleased / dead-pid / prune-skips against the published facts. A conceptual iron coffer still holds every orphan slip; a wax escheat seal shows whether the lock was given back. No live Claude session is required.

## Why not a clone

This is specifically: **VS CODE WINDOW-CLOSE SHUTDOWN LEAVES GIT WORKTREE `locked` NAMING A DEAD PID WITH NO LATER REAPER.**

**NOT Mortmain/#93173** (sandbox `denyWithinAllow` freezes tracked `.claude` paths). Different defect; related only by feudal naming.

**NOT Midden/#93081** (WorktreePool GC / missing `.git` link remound cycle). Different defect.

**NOT Strowger/#93218** (Desktop `--disallowedTools SendMessage` while ListAgents still lists). Different paradigm.

**NOT Mondegreen/#93193** (worktree Bash substring `git`). Different paradigm.

**NOT Derby/#93197** (concurrent npm-global retire race). Different paradigm.

**NOT Vizard/#93190** (Desktop `/plan` intercept so CLI project-command precedence never runs). Different paradigm.

**NOT Dead Air/#93155** (silent 900s API stall with keepalive ACK / zero log). Different paradigm.

**NOT Scuttle/#93154**. **NOT Stopcock/#93143**. **NOT Parergon/#93122**.

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **VS Code window-close shutdown vs git worktree lock / dead PID / no later reaper** — unused in catalog as this escheat / inquisition walk.

Do NOT rename this product Mortmain, Midden, Strowger, Mondegreen, Derby, Vizard, Dead Air, Scuttle, Stopcock, Parergon, or any existing catalog slug.
Do NOT reuse idle released / escheat / stale on a later booth.
Do NOT reuse Cinzel + Source Sans 3 + JetBrains Mono (Mortmain). Do NOT reuse Syne + Karla + IBM Plex Mono (Strowger). Do NOT reuse Cormorant Garamond + Outfit + Space Mono (Mondegreen). Do NOT reuse Bodoni Moda + Manrope (Derby). Display here is **Cardo**. UI is **Figtree**. Mono is **Fragment Mono**.

Different surface: VS Code window-close worktree lock leftover vs sandbox `denyWithinAllow` on tracked `.claude/**` / WorktreePool missing-`.git` remound / Desktop `--disallowedTools SendMessage` / isolation:worktree substring `git`.

Product name stays **Escheat**. Name/slug `escheat` unused in catalog.json (259 products before this ship; Mortmain is #259).

Different UI: feudal escheat chamber / royal escheator inquisition post mortem desk / parchment inquisitions / struck PID ledger / orphan worktree coffer / wax escheat seal / twilight stone hall. Cardo / Figtree / Fragment Mono. NOT muniment room / sealed charter / wax seals / iron chest drawers (Mortmain). NOT refuse-heap / ash-and-bone (Midden). NOT Strowger exchange / switchboard. NOT ballad-sheet studio (Mondegreen). NOT racecourse (Derby).

Different verbs: Open the inquisition, Admit released, Score escheat, Pin idle released, Pin seeded escheat, Pin stale, Strike the PID, Read the coffer, Reset the chamber.

Different idle: **released**. Different #93231 seeded path: **escheat**. HOLD: **released** / **hold**. ALARM: **escheat** / **stale** / **window-close** / **lock-unreleased** / **dead-pid** / **prune-skips** / **remove-refuses** / **resume-hidden** / **shutdown-wrote**. Path: **stale**.

## How to score

```bash
node --test projects/escheat/escheat.test.mjs
node projects/escheat/escheat.mjs projects/escheat/data/93231.json
node projects/escheat/escheat.mjs projects/escheat/data/released.json
echo '{"seed":"escheat"}' | node projects/escheat/escheat.mjs
```

Open the living card at `projects/escheat/index.html` (or the live path `/escheat/`). Buttons: Open the inquisition, Admit released, Score escheat, Pin idle released, Pin seeded escheat, Pin stale, Strike the PID, Read the coffer, Reset the chamber. Toggle window-close / lock / dead PID / prune — the score flips. Rest a fixture JSON on the inquest roll. `?embed=1` hides chrome.

The booth reconstructs the reporter’s window-close / `bridge-session` / dead-PID lock walk from the published #93231 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/escheat/
- Folder: `projects/escheat/`

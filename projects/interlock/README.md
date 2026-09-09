# Interlock

A **plant-floor safety INTERLOCK booth / machine-guard lockout** — safety yellow, machine graphite, red E-stop, cool steel, hazard stripes; fonts **Chakra Petch** (display) + **Hind** (body) + **IBM Plex Mono** (mono) — for a real Claude Code defect: **A UI-WARMED IDLE SESSION INTERLOCKS THE CWD AGAINST DISPATCH `start_code_task` AFTER THE STALE-RECORD FIX, VIA HARDCODED `exclusiveCwd`.**

Primary:

- [anthropics/claude-code#92976](https://github.com/anthropics/claude-code/issues/92976) (OPEN, bug, has repro, platform:linux, regression, area:desktop). Title: `Dispatch start_code_task still blocked in 1.49585.0: opening a finished session in the UI re-locks the folder (follow-up to #91745, #92452, #92462)`. Desktop 1.49585.0 (Linux); Electron 44; bundled Claude Code 2.1.260; Ubuntu 26.04 Hyper-V. Authored 2026-09-09T02:34:59Z by terrapin-lee.

12:50 interlock: a plant-floor safety interlock booth that should keep a folder **passable** for Dispatch — busy-check (turn in flight) not attached-CLI; instead a UI-warmed idle session interlocks the cwd via exclusiveCwd so start_code_task fails already-active — score interlocked or admit passable.

Score interlocked or admit passable.

Idle word: **passable** (HOLD: folder open for Dispatch; stopped session has no live query; stale records skipped). #92976 path: **interlocked**. Seeded recover: **detached**. Never idle admitted / shibbolethed / countersigned / deeded / homesteaded / staked / parked / epitaphed / inscribed / collated / stereotyped / emended / confirmed / miraged / loosed / clung / enrolled / escheated / banked / intact / as-penned / rove / vaulted / cleared / fouled / voided / rewritten.

**Interlock** = the plant-floor safety lock that should stay disengaged when the operator merely looks at a stopped line. The aisle should stay passable for Dispatch. Instead a UI-warmed idle session interlocks the cwd.

- **passable** = IDLE: HOLD; folder open for Dispatch; no live query; stale records skipped
- **interlocked** = #92976 path: Code tab warms a finished session → CLI re-attaches → query truthy on an idle session → exclusiveCwd refuses start_code_task already-active
- **detached** = CLI/query released; busy-check (turn in flight) only; exclusiveCwd no longer hardcoded
- **stale-records-fixed** = findActiveSessionByCwd skips records with no live query; 200 non-archived records no longer block
- **ui-warm-relock** = setFocusedSession + Warming re-attaches a CLI on a finished session
- **query-present-idle** = query truthy, no turn in flight; last turn 47 minutes earlier
- **warm-lifecycle-when-hidden** = arm=when-hidden; 900s/1800s idle timers only while hidden
- **exclusivecwd-hardcoded** = exclusiveCwd: true on the Dispatch path and nowhere else
- **concurrent-local-ok** = four sessions shared the folder without conflict
- **dispatch-only-block** = exclusivity is Dispatch-only; Code-tab sessions do not pass exclusiveCwd
- **timeline** = 10:43 success → 10:55 warm → 11:15 fail
- **cifs-non-git** = CIFS-mounted directory, not a git repository; dispatchParentOrigin local
- **no-archive-tool** = Dispatch toolset has no archive or release
- **error-already-active** = already active; does not say closing or archiving is the fix
- **cousins** = cite-only #91745 CLOSED, #92452 OPEN, #92462 CLOSED — do not clone
- **before-after** = before interlocked warmed idle; after expected passable
- **fixtures** = row list for the interlock booth

Verdicts: passable, interlocked, detached, stale-records-fixed, ui-warm-relock, query-present-idle, warm-lifecycle-when-hidden, exclusivecwd-hardcoded, concurrent-local-ok, dispatch-only-block, timeline, cifs-non-git, no-archive-tool, error-already-active, cousins, before-after, fixtures.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No Desktop automation. No payloads. No network to Anthropic required for scoring. Score whether the folder is **interlocked** or already **passable**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): UI warm attaches CLI so `query` is truthy; findActiveSessionByCwd treats warmed-idle as active; exclusiveCwd on Dispatch refuses start_code_task. Invite verify against #92976 text only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92976](https://github.com/anthropics/claude-code/issues/92976)
- Cite-only: [anthropics/claude-code#91745](https://github.com/anthropics/claude-code/issues/91745) (CLOSED)
- Cite-only: [anthropics/claude-code#92452](https://github.com/anthropics/claude-code/issues/92452) (OPEN)
- Cite-only: [anthropics/claude-code#92462](https://github.com/anthropics/claude-code/issues/92462) (CLOSED)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:linux, regression, area:desktop
- Desktop 1.49585.0 (Linux); Electron 44; bundled Claude Code 2.1.260
- Ubuntu 26.04 LTS Hyper-V; CIFS-mounted non-git folder; dispatchParentOrigin local
- Stale-record half of #91745 / #92462 fixed: findActiveSessionByCwd skips records with no live query
- NEW: selecting a finished session in the Code tab warms it, re-attaches a CLI, and query presence holds the folder against Dispatch
- Blocking session had completed last turn 47 minutes earlier and had been stopped; nothing sent after warm
- Timeline: stop hook 10:28 → upgrade → stop 10:35 (no query, not a blocker) → start_code_task SUCCEEDS 10:43 → UI setFocusedSession + Warming 10:55 → start_code_task FAILS 11:15+
- WarmLifecycle arm=when-hidden: 900s/1800s idle timers only while hidden
- Four sessions shared the folder without conflict; exclusivity is Dispatch-only via hardcoded exclusiveCwd: true
- No archive/release on the Dispatch toolset; error does not say closing/archiving is the fix

Problem found: A MACHINE-GUARD INTERLOCK THAT SHOULD KEEP THE FOLDER PASSABLE INSTEAD ENGAGES WHEN THE OPERATOR MERELY LOOKS AT A STOPPED LINE.

Why this solution: a diagnostic plant-floor booth for the passable → interlocked drift, so a reader can pin idle passable, load the #92976 interlocked path, and score detached / stale-records-fixed / ui-warm-relock / query-present-idle / warm-lifecycle-when-hidden / exclusivecwd-hardcoded / concurrent-local-ok / dispatch-only-block / timeline / cifs-non-git / no-archive-tool / error-already-active / cousins / before-after against the published facts.

## Why not a clone

This is specifically: **A UI-WARMED IDLE SESSION INTERLOCKS THE CWD AGAINST DISPATCH `start_code_task` AFTER THE STALE-RECORD FIX, VIA HARDCODED `exclusiveCwd`.**

**NOT Shibboleth/#92966** (GrowthBook Invalid API Key). Different paradigm.

**NOT Homestead/#92932** (HOME-cwd file-index hang). Different paradigm.

**NOT Epitaph/#92952** (false completed while waiting). Different paradigm.

**NOT Recension/#92949** (last-prompt MEMORY at compact). Different paradigm.

**NOT Mirage/#92920** (scheduler ack without session). Different paradigm.

**NOT Remora/#92934** (sync hooks child hold). Different paradigm.

**NOT #91745 / #92462 / #92452 products** (none shipped; cite only — this ship is specifically the UI-warm re-lock after the stale-record fix).

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. NOT a Desktop automation.

Different paradigm: **UI-warm re-attaches CLI so query is truthy; Dispatch exclusiveCwd treats warmed-idle as busy.**

Do NOT rename this product Shibboleth, Homestead, Epitaph, or any existing catalog slug.
Do NOT reuse idle admitted / shibbolethed / countersigned / deeded / homesteaded / staked / parked / epitaphed / inscribed / collated / stereotyped / emended / confirmed / miraged / loosed / clung / enrolled / escheated.
Do NOT reuse Cormorant Infant + Manrope + JetBrains Mono (Shibboleth). Do NOT reuse Playfair Display + Figtree + Fira Code (Homestead). Do NOT reuse Old Standard TT + Work Sans + Ubuntu Mono (Epitaph). Do NOT reuse Literata + Public Sans + JetBrains Mono (Recension). Do NOT reuse Newsreader + Lexend + Fragment Mono (Mirage). Do NOT reuse Ibarra Real Nova + Red Hat Text + Red Hat Mono (Remora).

Different surface: Dispatch UI-warm cwd lock vs GrowthBook watchword reject / HOME file-index hang / false-completed agent.

Product name stays **Interlock**. Name/slug `interlock` unused in catalog.json (238 products before this ship; Shibboleth is #238).

Different UI: plant interlock booth / safety yellow / machine graphite / red E-stop / cool steel / hazard stripes. Chakra Petch / Hind / IBM Plex Mono. NOT river-ford indigo. NOT prairie gold. NOT memorial charcoal. NOT scriptorium oak. NOT desert haze.

Different verbs: Score interlocked, Admit passable, Detach the guard, Load #92976, Reset to passable.

Different idle: **passable**. Different #92976 path: **interlocked**. HOLD: **passable**. ALARM: **interlocked** / **detached** / **stale-records-fixed** / **ui-warm-relock** / **query-present-idle** / **warm-lifecycle-when-hidden** / **exclusivecwd-hardcoded** / **concurrent-local-ok** / **dispatch-only-block** / **timeline** / **cifs-non-git** / **no-archive-tool** / **error-already-active** / **cousins** / **before-after** / **fixtures**. Seeded recover: **detached**.

## How to score

```bash
node --test projects/interlock/interlock.test.mjs
node projects/interlock/interlock.mjs projects/interlock/data/92976.json
node projects/interlock/interlock.mjs projects/interlock/data/passable.json
echo '{"seed":"interlocked"}' | node projects/interlock/interlock.mjs
```

Open the living card at `projects/interlock/index.html` (or the live path `/interlock/`). Buttons: Score interlocked, Admit passable, Detach the guard, Load #92976, Load fixtures, Reset to passable. Toggle query present / UI warm / turn in flight / exclusiveCwd / Dispatch blocked — the score flips. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/interlock/
- Folder: `projects/interlock/`

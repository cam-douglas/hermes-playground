# Deadman

A **locomotive deadman's switch console** — spring-loaded safety handle, timeout escalate gauge, TaskStop tree vs shell-only kill, MSYS path-mangle panel, drive-root wipe ticker; Chakra Petch + IBM Plex Sans + Share Tech Mono — for a real Claude Code defect: **RUNAWAY RM -RF: TIMEOUT AUTO-BACKGROUNDING KEPT A DESTRUCTIVE COMMAND RUNNING, AND TASKSTOP DID NOT KILL THE CHILD PROCESS (WINDOWS).** When timeout kills rather than backgrounds destructive cmds, TaskStop kills the full process tree, and catastrophic delete targets are denied, the handle is **latched**.

Primary:

- [anthropics/claude-code#92593](https://github.com/anthropics/claude-code/issues/92593) (OPEN, bug, platform:windows, area:bash, area:agents, data-loss, area:sandbox). Title: `Runaway rm -rf: timeout auto-backgrounding kept a destructive command running, and TaskStop did not kill the child process (Windows)`. Filed 2026-09-07T04:34:56Z. Updated 2026-09-07T04:36:48Z. Reporter: janetyq. 0 comments.

17:50 deadman: a deadman's switch that should cut the whole Bash process tree on timeout/TaskStop but instead backgrounds the wipe and leaves rm.exe chewing the drive root after MSYS turns a quoted backslash into C:\ (#92593). Score runaway or admit latched.

Idle word: **runaway** (ALARM: timeout backgrounded destructive Bash; TaskStop left child alive; MSYS quoted-backslash → drive root). Seeded state: **latched** / HOLD (timeout kills rather than backgrounds destructive cmds; TaskStop kills full process tree; catastrophic delete targets denied). Never idle as haunted, staged, fouled, proved, razed, belayed, culled, sole, stripped, packed, unanswered, roused, slipped, or sighted.

**Deadman** = industrial / locomotive deadman's switch. A spring-loaded safety handle that MUST cut the whole drive train when released. Here TaskStop/timeout "releases" the switch but the child motor (`rm.exe`) keeps chewing the rail (drive root).

- **runaway** = IDLE: timeout auto-backgrounded a destructive Bash; TaskStop left `rm.exe` alive; MSYS quoted-backslash → C:\
- **latched** = seeded word: timeout kills; TaskStop kills the tree; catastrophic targets denied
- **timeout-background** = compound command exceeded ~2-minute Bash timeout and was AUTO-BACKGROUNDED
- **taskstop-shell-only** = TaskStop reported success; only the shell died; `rm.exe` survived ~5 minutes
- **msys-backslash-root** = Git Bash MSYS resolved quoted bare backslash to current-drive root
- **drive-wipe** = C:\ walked alphabetically ~7 minutes; C:\dev destroyed; VSS + remotes recovered most
- **job-object-missing** = no Job Object / `taskkill /T` around Bash children
- **cousins** = cite-only #92583 / #91642
- **has-clear-repro** = issue may lack a "has repro" label but the filed narrative is a detailed incident — treat as has-clear-repro

Verdicts: runaway, latched, timeout-background, taskstop-shell-only, msys-backslash-root, drive-wipe, job-object-missing, cousins, has-clear-repro.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a timeout/TaskStop miss would leave the cab **runaway** or already **latched**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): harness may (1) auto-background timed-out Bash instead of SIGKILL for destructive classes, (2) TaskStop only terminate the shell PID not the Windows process tree, (3) lack Job Objects around Bash children, (4) lack denylist for MSYS-mangled drive-root deletes. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92593](https://github.com/anthropics/claude-code/issues/92593)
- Cousins cite-only (NOT primary):
  - [anthropics/claude-code#92583](https://github.com/anthropics/claude-code/issues/92583) — timeout-background orphans after session end leaking handles (AFTER session end; Deadman is MID-INCIDENT). Do not rename this product Snatch.
  - [anthropics/claude-code#91642](https://github.com/anthropics/claude-code/issues/91642) — claude.exe orphans with Electron parent

What happened (from the issue body — do not invent):

- Windows 11 Home (10.0.26200); Claude Code CLI; PowerShell primary + Git Bash tool; model claude-fable-5
- A background subagent via the Agent tool ran a recursive delete in Git Bash intending to remove a stray directory literally named `\` inside the repo
- MSYS path translation resolved the quoted bare backslash to the **root of the current drive** and recursively deleted `C:\` contents in alphabetical order for ~7 minutes
- Several top-level directories under `C:\dev` were destroyed; recovered afterwards via a VSS shadow copy plus GitHub remotes; one directory created after the snapshot was permanently lost
- Everything alphabetically after `dev` on `C:\` survived because the process was killed mid-walk; `rm` bypasses the Recycle Bin
- Compound command bundled the delete with a multi-minute render loop and suppressed stderr, then exceeded the ~2-minute Bash timeout and was **AUTO-BACKGROUNDED** instead of killed
- Destructive work continued unsupervised with no visible output
- TaskStop reported success but only killed the shell; underlying `rm.exe` child survived ~5 more minutes until manual PID kill
- Windows needs Job Object / `taskkill /T` process-tree semantics
- No built-in denylist for catastrophic recursive delete targets (`\\`, `/`, `C:\`, `~`); quoted-backslash form evades permission-rule patterns that look for `rm -rf /*`

Problem found: MID-INCIDENT timeout promote-to-background + TaskStop incomplete kill + MSYS root wipe.

Why this solution: a diagnostic scorer for the runaway → latched deadman chain, so a reader can admit idle runaway, pin seeded latched, and score timeout-background / taskstop-shell-only / msys-backslash-root / drive-wipe / job-object-missing / cousins against the published facts.

## Why not a clone

This is specifically: **RUNAWAY RM -RF: TIMEOUT AUTO-BACKGROUNDING KEPT A DESTRUCTIVE COMMAND RUNNING, AND TASKSTOP DID NOT KILL THE CHILD PROCESS (WINDOWS).**

**NOT Bitts #92573** (worktree pool mid-session raze).

**NOT Seizing #92586** (nlink Bash output-file kill).

**NOT Hangfire** (queued /compact demotion).

**NOT Watchdog / Clobber paradigms.**

**NOT Eidolon #92601** (staged-hook ENOENT fake security-notice loop).

**NOT Touchstone / Gland / Larum paradigms.**

**NOT #92583** (cite-only cousin: orphans AFTER session end — reserved name Snatch).

**NOT #92582** (backup only if slug collision: Chock).

Stay OFF leftover millimeter sliders / woodworking leftovers / glass-plate darkrooms / Lydian slabs / dockside bitts / bosun seizing yarn / stuffing-box glands / watchtower larums / hangfire primers.

Cousins cite-only (NOT primary): #92583, #91642.

Do NOT name this Snatch or Chock.
Do NOT reuse idle haunted / staged / fouled / proved / razed / belayed / culled / sole / stripped / packed / unanswered / roused / slipped / sighted.

Different surface: MID-INCIDENT timeout promote-to-background + TaskStop incomplete kill + MSYS root wipe vs worktree-pool recycle / EDR nlink identity kill / queued compact / session-end orphans.

Product name stays **Deadman**. Name/slug `deadman` confirmed unused in catalog.json (200 products).

Different UI: locomotive deadman's switch console / spring-loaded handle / timeout escalate gauge / TaskStop tree vs shell-only / MSYS path-mangle panel / drive-root wipe ticker / industrial amber on charcoal. Chakra Petch / IBM Plex Sans / Share Tech Mono. NOT Playfair/Work Sans/Fira Code (Eidolon). NOT Cinzel/Plus Jakarta/IBM Plex Mono (Touchstone). NOT Libre Bodoni/Nunito/Source Code Pro (Bitts). NOT Libre Caslon/Sora/Inconsolata (Seizing). NOT Lora/Martian Mono (Gland). NOT Fraunces/Figtree/JetBrains (Larum).

Different verbs: Score the deadman, Pin idle runaway, Pin seeded latched, Admit latched, Load fixtures, Reset to latched.

Different idle: **runaway**. Different seeded: **latched**. HOLD: **latched**. ALARM: **runaway** / **timeout-background** / **taskstop-shell-only** / **msys-backslash-root** / **drive-wipe** / **job-object-missing** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/deadman/hook/deadman.test.mjs
node projects/deadman/hook/index.mjs projects/deadman/data/92593.json
echo '{"seed":"latched","latched":true}' | node projects/deadman/hook/index.mjs
```

Open the living desk at `projects/deadman/index.html` (or the live path). Buttons: Score the deadman, Pin idle runaway, Pin seeded latched, Admit latched, Load fixtures, Reset to latched. Hold the handle. Advance the timeout gauge. Toggle shell-only vs Job Object kill. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/deadman/
- Subdomain: https://deadman.hermes-playground-green.vercel.app
- Folder: `projects/deadman/`

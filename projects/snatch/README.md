# Snatch

A **deck snatch-block / openable pulley bench** — rope yard, hinged cheek, sheave, beckets; dark wet teak + cold steel + signal orange; Newsreader + Figtree + Fragment Mono — for a real Claude Code defect: **WINDOWS BASH TOOL COMMANDS AUTO-BACKGROUNDED ON TIMEOUT ARE NEVER CLEANED UP WHEN THE SESSION ENDS, ALLOWING ORPHANED PROCESSES TO LEAK OS HANDLES/KERNEL POOL FOR DAYS.** When session-end tracks and reaps those PIDs, the line is **reaped**.

Primary:

- [anthropics/claude-code#92583](https://github.com/anthropics/claude-code/issues/92583) (OPEN, bug, has repro, platform:windows, area:bash). Title: `Windows: Bash tool commands auto-backgrounded on timeout are never cleaned up when the session ends, allowing orphaned processes to leak OS handles/kernel pool for days`. Filed 2026-09-07T02:11:29Z. Updated 2026-09-07T05:50:30Z. Reporter: cloud-hai-vo. 1 comment (Mycroft / tonydzi).

22:50 snatch: a deck snatch-block bench that should bring home Bash tool lines auto-backgrounded on timeout but instead leaves them adrift with a dead parent for days — find.exe orphans holding ~10–11M handles each / Mycroft 9/9 unreaped including immortal tail -f (#92583). Score adrift or admit reaped.

Idle word: **adrift** (ALARM: line adrift; auto-backgrounded Bash children unreaped on session end). Seeded state: **reaped** / HOLD (session-end tracks and reaps those PIDs). Never idle as corked, latent, silted, barred, runaway, haunted, fouled, razed, culled. Never seeded as relayed, flushed, drained, admitted, latched, staged, proved, belayed, sole.

**Snatch** = a snatch-block: an openable pulley whose hinged cheek takes a bight without reeving the bitter end. The block should open at session end and bring the line home. Timeout promotes the Bash tool command to background; session end never reaps the Windows child, so the line stays **adrift** with a dead parent for days.

- **adrift** = IDLE: ALARM; line adrift; auto-backgrounded Bash children unreaped
- **reaped** = seeded word: session-end tracks and reaps those PIDs
- **unreaped-on-session-end** = window closed / session finished leaves Windows orphans
- **timeout-to-background** = documented timeout promote; 120s Win32_Product | tail
- **immortal-background-commands** = `tail -f` / `grep --line-buffered` / `python -m http.server`
- **handle-pool-exhaustion** = 61,252,162 handles; ~10–11M each; 98% memory
- **nine-of-nine-orphans** = Mycroft 9 of 9, ages 22.1h–54.0h
- **dead-parent-git-bash** = parent shells already exited; snapshot-bash descendants
- **wall-clock-not-handle-ceiling** = 129–165 handles each (1,267 total); handle-count ceiling would miss
- **find-orphans-11-days** = six `find.exe` since Aug 27–31; reparse-point cycle
- **handle-pool-20gb** = Kernel Paged Pool ~20.8 GB; kill dropped handles to ~247,000
- **mycroft-9-of-9** = Mycroft / tonydzi confirmation on 2026-09-07
- **immortal-tail-http** = `nohup python -m http.server 41888` + `tail -f` age-matched pairs
- **wall-clock-ceiling** = suggested hard ceiling; wall-clock catches the immortal class
- **cousins** = cite-only #91642 / #92593 / #92586
- **has-clear-repro** = issue labeled has repro

Verdicts: adrift, reaped, unreaped-on-session-end, timeout-to-background, immortal-background-commands, handle-pool-exhaustion, nine-of-nine-orphans, dead-parent-git-bash, wall-clock-not-handle-ceiling, find-orphans-11-days, handle-pool-20gb, mycroft-9-of-9, immortal-tail-http, wall-clock-ceiling, cousins, has-clear-repro.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether session-end unreaped Bash orphans would leave the snatch-block **adrift** or already **reaped**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): session-end may lack PID tracking for auto-backgrounded Bash children; tracking+reap (or a wall-clock ceiling) would bring the line home. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92583](https://github.com/anthropics/claude-code/issues/92583)
- Cousins cite-only (NOT primary):
  - [anthropics/claude-code#91642](https://github.com/anthropics/claude-code/issues/91642) — Scheduled-task CLI process does not exit after unattended run (claude.exe layer; 132 live claude.exe with Electron parent, oldest 67h). Same missing cleanup guarantee one layer above.
  - [anthropics/claude-code#92593](https://github.com/anthropics/claude-code/issues/92593) — Deadman: timeout background + TaskStop incomplete kill + MSYS root wipe (DIFFERENT: mid-incident TaskStop/MSYS path, not session-end unreaped orphans)
  - [anthropics/claude-code#92586](https://github.com/anthropics/claude-code/issues/92586) — Seizing: nlink!=1 false-triggers Bash output-file identity kill (~5s) (DIFFERENT surface)

Backups do not auto-pick: #92624 (named agent foreign session id), #92662 (Chrome relaunch bridge).

What happened (from the issue body and Mycroft / tonydzi confirmation — do not invent):

- OS: Windows 11 Pro 10.0.26200; Claude Code CLI Bash tool (Git Bash / MSYS2)
- Documented behavior: Bash tool command exceeding timeout is moved to background rather than killed
- If the session ends (window closed / session finished) before that background command is explicitly stopped, the Windows process is orphaned — Windows does not clean orphaned children on parent/session exit
- Six orphaned `C:\Program Files\Git\usr\bin\find.exe` from `find / -iname *lightsail*`, `find / -ipath *pgvector* -iname *.dll`, `find / -iname Swashbuckle.AspNetCore.SwaggerGen.dll`
- Running continuously since Aug 27–31 (up to 11 days); parent shells already exited
- `find /` under Git Bash can enter a reparse-point/junction cycle (OneDrive, WSL mounts, Docker data dirs, AppData junctions) and never terminate
- System-wide OS handle count: 61,252,162 (healthy baseline ~50k–500k)
- Each of six find.exe held ~10–11 million handles; ~6 MB working set each
- Kernel Paged Pool ~20.8 GB; 98% memory util; Memory Compression 5.8 GB masking pressure
- Killing six PIDs dropped handles to ~247,000; paged pool began draining
- Mid-investigation: a separate Bash tool (`Win32_Product` WMI | `tail`) exceeded 120s timeout and auto-moved to background — reproducing the mechanism
- Suggested fixes from the issue: track PIDs per session and terminate on session end; periodic reminder when backgrounded far past timeout; hard ceiling (wall-clock or handle-count) force-kill
- Mycroft / tonydzi confirmation (2026-09-07): orphaning **9 of 9**, ages 22.1h to 54.0h; every Git-Bash toolchain process with a dead parent
- Proven Claude Bash descendants: bash.exe 54.0h (snapshot-bash wrapper), bash.exe 51.9h, nohup.exe 51.9h (`nohup python -m http.server 41888`), tail.exe 44.3h (`tail -f` in session scratchpad)
- Sub-class worse than `find /`: immortal-by-construction commands (`tail -f`, `grep --line-buffered`, `python -m http.server`) orphan in age-matched pairs
- Handle explosion does NOT always follow: their nine orphans held 129–165 handles each (1,267 total) vs reporter's 10–11M — wall-clock since backgrounding / PID tracking catches the class; handle-count ceiling alone would miss theirs
- Related layer-up: #91642 (132 live claude.exe with Electron parent, oldest 67h) — same missing cleanup guarantee one layer above

Problem found: SESSION-END NEVER REAPS AUTO-BACKGROUNDED BASH ORPHANS — days-long dead-parent processes / handle or immortal-command class.

Why this solution: a diagnostic scorer for the adrift → reaped snatch-block chain, so a reader can admit idle adrift, pin seeded reaped, and score unreaped-on-session-end / timeout-to-background / immortal-background-commands / handle-pool-exhaustion / nine-of-nine-orphans / dead-parent-git-bash / wall-clock-not-handle-ceiling / find-orphans-11-days / handle-pool-20gb / mycroft-9-of-9 / immortal-tail-http / wall-clock-ceiling / cousins against the published facts.

## Why not a clone

This is specifically: **WINDOWS BASH TOOL COMMANDS AUTO-BACKGROUNDED ON TIMEOUT ARE NEVER CLEANED UP WHEN THE SESSION ENDS, ALLOWING ORPHANED PROCESSES TO LEAK OS HANDLES/KERNEL POOL FOR DAYS.**

**NOT Speakpipe #92646** (Desktop overbroad SendMessage ban corks continuation).

**NOT Afterimage #92596** (Windows text paint deferred until message_stop).

**NOT Limber #92590** (unexpanded `$TMPDIR` write-allowlist).

**NOT Chock #92582** (`blockReadsOutsideWorkingDirectories` ignores additionalDirectories).

**NOT Deadman #92593** (timeout promote + TaskStop shell-only + MSYS `\\`→`C:\` wipe leftover) — Snatch is specifically **session-end never reaps auto-backgrounded Bash orphans** (days-long dead-parent processes / handle or immortal-command class).

**NOT Eidolon #92601** (security-guidance ENOENT staging loop).

**NOT Seizing #92586** (nlink false positive kill).

**NOT Oubliette #92095 / Bitts / Sounder / Callboard / Knock / Annunciator paradigms.**

Cousins cite-only (NOT primary): #91642, #92593, #92586. Different surfaces. Backups do not auto-pick: #92624, #92662.

Do NOT rename this product Speakpipe, Afterimage, Limber, Chock, Deadman, Eidolon, Touchstone, Bitts, Oubliette, Sounder, Callboard, Knock, or Annunciator.
Do NOT reuse idle corked / latent / silted / barred / runaway / haunted / fouled / razed / culled.
Do NOT reuse seeded relayed / flushed / drained / admitted / latched / staged / proved / belayed / sole.

Different surface: SESSION-END NEVER REAPS AUTO-BACKGROUNDED BASH ORPHANS vs Desktop overbroad SendMessage ban / Windows text paint deferral / unexpanded `$TMPDIR` / settings-layer read-fence miss / mid-incident timeout promote + TaskStop leftover / ENOENT fake notice / nlink false positive.

Product name stays **Snatch**. Name/slug `snatch` confirmed unused in catalog.json (205 products).

Different UI: snatch-block / openable pulley / hinged cheek / sheave / beckets / wet teak + cold steel + signal orange. Newsreader / Figtree / Fragment Mono. NOT Petrona/Lexend/Azeret (Speakpipe). NOT Instrument Serif/Plus Jakarta/IBM Plex (Afterimage). NOT locomotive deadman cab. NOT brass speakpipe.

Different verbs: Score the snatch-block, Pin idle adrift, Pin seeded reaped, Admit reaped, Load fixtures, Reset to reaped, Bring the line home, Open the cheek.

Different idle: **adrift**. Different seeded: **reaped**. HOLD: **reaped**. ALARM: **adrift** / **unreaped-on-session-end** / **timeout-to-background** / **immortal-background-commands** / **handle-pool-exhaustion** / **nine-of-nine-orphans** / **dead-parent-git-bash** / **wall-clock-not-handle-ceiling** / **find-orphans-11-days** / **handle-pool-20gb** / **mycroft-9-of-9** / **immortal-tail-http** / **wall-clock-ceiling** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/snatch/hook/snatch.test.mjs
node projects/snatch/hook/index.mjs projects/snatch/data/92583.json
echo '{"seed":"reaped","reaped":true}' | node projects/snatch/hook/index.mjs
```

Open the living card at `projects/snatch/index.html` (or the live path). Buttons: Score the snatch-block, Pin idle adrift, Pin seeded reaped, Admit reaped, Load fixtures, Reset to reaped. Bring the line home. Open the cheek. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/snatch/
- Subdomain: https://snatch.hermes-playground-green.vercel.app
- Folder: `projects/snatch/`

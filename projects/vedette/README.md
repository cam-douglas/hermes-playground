# Vedette

A **cavalry vedette / outpost lantern / picket-line / field-desk booth** — a *vedette* is a mounted outpost scout left on watch. The parent `-p` column marches off (~600s idle window) while the Task vedettes are still on post — then every in-flight Task is reported `stopped`, yet the parent returns `success` / exit 0. Fonts **Bebas Neue** (display) + **IBM Plex Sans** (UI) + **Share Tech Mono** (mono). Palette: field olive `#1B2A1E`, lantern amber `#E0A84A`, canvas khaki `#D9C7A3`, signal crimson `#B8332A`, night `#0A100C`. Fresh trio. Completely different UI/UX/metaphor — picket-line / outpost lantern / field-desk / cavalry scout / signal pennant. NOT a Prague clock tower. NOT a herald's college. NOT a scriptorium tablet. NOT an Elizabethan mask booth. NOT a confectionery kitchen. NOT a sleep ward. NOT a night-wall inhibitor. NOT a dictation recorder. NOT a household shrine. NOT a binder folio. NOT a theater tapestry.

The column should stay **stationed** (HOLD: parent stays until background Tasks complete / return results). Instead the booth was **vedette** after an **idle-exit**.

Primary:

- [anthropics/claude-code#94392](https://github.com/anthropics/claude-code/issues/94392) (OPEN). Title: `Headless claude -p exits with its own background subagents still running; every in-flight Task is reported stopped and the run still ends result.subtype=success, exit code 0`. Labels: bug, has repro, platform:linux, area:agents, area:cli. Environment: Claude Code CLI 2.1.270 (also 2.1.267–2.1.269); Linux x64; `claude -p --output-format stream-json --verbose`; unattended cron (no TTY). Orchestrator dispatches 5–11 custom subagents via Agent/Task in one turn. When the model omits `run_in_background`, CLI still backgrounds (`is_backgrounded: true`, tool_result placeholder "Async agent launched successfully"). Main turn ends. If no completion within ~600s of previous turn, `-p` process exits: every in-flight subagent gets `system/task_notification` status `stopped`; parent never sees results; final `result` is `subtype: success`, `is_error: false`, exit code 0. Offline control with two long-sleep backgrounded subagents exited ~651s after previous turn while subagents still alive. Explicit `run_in_background: false` keeps foreground and returns results. Workaround: `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`. Distinct from #63023 / #65968 (idle/pause harvest of background tasks). Stay off Orloj/Brisure/Diptych/Vizard/Treacle/Somnus/Cresset/Dictabelt/Lemure/Cancellans/Arras paradigms.

20:50 vedette: a cavalry vedette / outpost lantern / picket-line booth for #94392. Headless `claude -p` exits with its own background subagents still running; every in-flight Task is reported `stopped` and the run still ends `result.subtype=success`, exit code 0. Idle **stationed** / seeded **vedette** / path **idle-exit**. Score vedette or admit stationed.

Score vedette or admit stationed.

Idle word: **stationed** (HOLD: parent stays until background Tasks complete / return results). HOLD aliases: crewed, posted, vigil, tethered. Seeded word: **vedette** / #94392 (the idle-exit path). Path word: **idle-exit**. Product score: **vedette**. Never idle lasting / enrolled / single / pledged / brisk / cadence / verbatim / quiet / intact / cleared or seeded Orloj / Brisure / Diptych / Vizard / Treacle / Somnus / Cresset / Dictabelt / Lemure / Cancellans / Arras or path names from those booths.

Phrase: **Score vedette or admit stationed.**

- **stationed** = IDLE HOLD: parent stays until background Tasks complete / return results
- **vedette** = seeded path / product score: parent column marches off; Task scouts still on post
- **idle-exit** = path word: ~600s idle window; parent exits while Tasks still running
- **crewed** = HOLD alias: column and vedettes stay crewed
- **posted** = HOLD alias: picket still posted
- **vigil** = HOLD alias: lantern stays on vigil
- **tethered** = HOLD alias: column stays tethered to its vedettes
- **backgrounded** = is_backgrounded: true when run_in_background is omitted
- **six-hundred** = no completion within ~600s of the previous turn
- **false-success** = result.subtype=success, is_error=false, exit code 0
- **stopped-tasks** = every in-flight Task gets task_notification status stopped
- **disable-bg** = workaround CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1
- **94392** = issue number seed
- **landing** = cavalry vedette / outpost lantern / picket-line
- **has-repro** = published shape: Claude Code 2.1.270 · Linux x64 · no TTY
- **cousins** = cite-only #63023 #65968 — do not rebuild; do not conflate
- **backups** = cite-only #94393 #86198 #94417 #94452 #94451 #94430 #94458 #93924 #93770 #93777 #94151 — do not auto-pick
- **fixtures** = picket-line / outpost lantern / field-desk
- **walk** = published idle stationed → idle-exit → vedette
- **closed** = #94392 remains OPEN — cite only; not this booth

Verdicts: stationed, vedette, idle-exit, crewed, posted, vigil, tethered, backgrounded, six-hundred, false-success, stopped-tasks, disable-bg, 94392, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **vedette** or already **stationed**. Fixtures use the issue's published incident only. `-p` reconstructions from published text are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): parent `-p` idle window (~600s) exits while background Tasks still running; every in-flight Task reported stopped; result still success / exit 0. Invite verify against #94392 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94392](https://github.com/anthropics/claude-code/issues/94392)
- Cousins: do NOT rebuild / do NOT conflate: #63023 (background agents die on session pause/resume — idle/pause harvest), #65968 (closed as a duplicate of #63023; idle/suspend boundaries). Neither is a headless `-p` idle-exit with false success while Tasks are still running.
- Backups (data only; next focus only — do not auto-pick): #94393, #86198, #94417, #94452, #94451, #94430, #94458, #93924, #93770, #93777, #94151

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:linux, area:agents, area:cli
- Environment: Claude Code CLI 2.1.270 (also 2.1.267–2.1.269); Linux x64; `claude -p --output-format stream-json --verbose`; unattended cron (no TTY)
- Orchestrator dispatches 5–11 custom subagents via Agent/Task in one turn
- When the model omits `run_in_background`, CLI still backgrounds (`is_backgrounded: true`)
- Task `tool_result` is the placeholder "Async agent launched successfully"
- Main turn ends
- If no completion within ~600s of previous turn, `-p` process exits
- Every in-flight subagent gets `system/task_notification` status `stopped`
- Parent never sees results
- Final `result` is `subtype: success`, `is_error: false`, exit code 0
- Offline control with two long-sleep backgrounded subagents exited ~651s after previous turn while subagents still alive
- Explicit `run_in_background: false` keeps foreground and returns results
- Workaround: `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1`

Problem found: IDLE-EXIT — parent `-p` idle window (~600s) exits while background Tasks still running; every in-flight Task reported stopped; result still success / exit 0.

Why Vedette: A *vedette* is a mounted outpost scout left on watch. The parent column should stay stationed until every scout reports. Instead the column marches off after the 600-second lantern window, writes `stopped` on every in-flight Task, and still reports success / exit 0. #63023 / #65968 are idle/pause harvest — DIFFERENT. This booth is specifically **headless `-p` idle-exit with false success while Tasks still running**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores idle-exit honesty (stationed vs vedette) so operators can see the parent march versus the still-posted Tasks without needing a Claude session. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A per-command foreground-only flag for `-p` (the equivalent of the env switch), so unattended runs are deterministic regardless of what the model passes
2. In `-p` mode, refuse to exit while the session still owns unresolved background tasks: either wait for them (bounded by a configurable deadline) or end with a non-success `result` (`subtype` other than `success`, non-zero exit code) that names the stopped tasks
3. Today a lost wave is indistinguishable from a clean run without parsing `task_notification` records

## Why not a clone

This is specifically: **HEADLESS `CLAUDE -P` EXITS WITH ITS OWN BACKGROUND SUBAGENTS STILL RUNNING; EVERY IN-FLIGHT TASK IS REPORTED `STOPPED` AND THE RUN STILL ENDS `RESULT.SUBTYPE=SUCCESS`, EXIT CODE 0. CLAUDE CODE 2.1.270; LINUX X64; NO TTY; DISTINCT FROM IDLE/PAUSE HARVEST.**

Novel paradigm: cavalry vedette / outpost lantern / picket-line / field-desk / signal pennant — field olive, lantern amber, canvas khaki, signal crimson, night. New issue, new paradigm (idle-exit), new UI/UX/fonts/colors, new scoring vocabulary. A picket-line booth, not a Prague clock tower, herald's college, wax-tablet scriptorium, Elizabethan mask atelier, confectionery kitchen, sleep clinic, night-wall inhibitor, voice recorder, household shrine, binder folio, or theater tapestry.

**NOT #63023** (background agents die on session pause/resume). Idle/pause harvest. DIFFERENT failure mode. Do not conflate.

**NOT #65968** (closed as a duplicate of #63023; idle/suspend boundaries). DIFFERENT. Do not rebuild.

**NOT Lemure/#94410** (orphan scheduled-task ticks). Different defect. Do not reuse quiet / Lemure / orphan-tick.

**NOT Followspot/#93714** (spawn MCP focus). Different defect. Do not rebuild.

**NOT Orloj/#94393** (Monitor schema cap / half-life during an active session). Different defect. Do not reuse lasting / Orloj / half-life.

**NOT Brisure/#94396** (fork-resume never becomes Remote Control eligible). Different defect. Do not reuse enrolled / Brisure / fork-resume.

**NOT Diptych/#94397** (brief-echo). Different defect. Do not reuse single / Diptych / brief-echo.

**NOT Vizard/#94398** (background-reset to Opus 4.8). Different defect. Do not reuse pledged / Vizard / background-reset.

**NOT Treacle/#94344** (Windows PowerShell streaming-stall). Different defect. Do not reuse brisk / Treacle / streaming-stall.

**NOT Somnus/#94415** (Cowork cloud schedule `device_absent`). Different defect. Do not reuse cadence / Somnus / device-absent.

**NOT Cresset/#94420** (keep-awake hold-leak). Different defect. Do not reuse released / Cresset / hold-leak.

**NOT Dictabelt/#94406** (voice-dictation fragment path). Different defect. Do not reuse verbatim / Dictabelt / segment-drop.

**NOT Cancellans/#94400** (deferred-delta / tools-array drop). Different defect. Do not reuse intact / Cancellans / deferred-delta.

**NOT Arras/#94348** (phantom approval card). Different defect. Do not reuse cleared / Arras / phantom-prompt.

Live: https://hermes-playground-green.vercel.app/vedette/

```
node --test projects/vedette/vedette.test.mjs
node projects/vedette/vedette.mjs projects/vedette/data/vedette.json
```

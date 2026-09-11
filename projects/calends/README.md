# Calends

A **stone calendar / fasti booth** — a chalk-white tablet whose weekday marks should be the only days the catch-up hand may strike; nundinal letters already carved into the cron; kalends / nones / ides for the date field; an acta diurna that should only record matching-day fires. Fonts **Cinzel** (display) + **Figtree** (sans) + **Fira Code** (mono). Palette: chalk-white `#F7F4EC`, slate ink `#1C2430`, oxblood `#7A2E2E`, gilt `#C6A15B`, ash `#8B8790`, dawn blue `#3E5C76`. Light classical calendar theme. NOT mill weir, NOT sailing irons, NOT bow cathead, NOT film continuity, NOT Nullarbor, NOT petard, NOT flintlock flashpan.

A catch-up hand should only strike the marked weekday. Desktop Scheduled Tasks’ missed-run catch-up skips the day-of-week field and rings the wrong calends.

Primary:

- [anthropics/claude-code#93687](https://github.com/anthropics/claude-code/issues/93687) (OPEN). Title: `[BUG] Desktop Scheduled Tasks catch-up ignores day-of-week/date cron fields, fires on wrong days`. Claude Code Desktop app, Windows. Scheduled tasks via the `schedule` skill / `mcp__scheduled-tasks__*` tools. Docs: on app start/wake, Desktop checks missed runs in the last seven days and starts exactly one catch-up for the most recently missed time. Day-restricted crons (`0 19 * * 1` Monday-only, `45 18 * * 3` Wednesday-only) should only catch up to a time that itself falls on the correct DOW — they do not. Observed: five tasks with different weekly schedules (Fri-only, Wed-only×2, Mon-only, Thu-only) all fired within ~4 minutes (~12:15–12:19 AM local) on a Friday (matches only one schedule). `list_task_runs` shows correctly-timed runs mixed with sporadic wrong-day fires over weeks (Thu-only on Sunday and Friday; Wed-only on Friday and Thursday). Misfires report `status: succeeded`. No setting to disable catch-up (schemas only `enabled` / `cronExpression` / `fireAt` / `prompt` / `title` / `description` / `notifyOnCompletion`). Mitigation today is prompt-level day guards; DOW is already structured in cron and should be honored. Risk: outbound side effects (Gmail drafts, Jira, git commits) can duplicate or run with wrong-day assumptions. Labels: bug, has repro, platform:windows, area:desktop. Cousins cite-only: Flashpan/#93015 (scheduled tasks stamp `lastRunAt` but never birth — different defect). Backups cite-only (next focus only — do not auto-pick): #93683 (tool-result instruction injection / Rider), #93672 (`idle_prompt` while background subagents still running), #93652 (Remote Control capacity silent session substitution), #93680 (Bash mkdir via `/proc/self/fd`), #93618 (Windows/Git Bash ~8175 truncation + backslash).

05:50 calends: a stone calendar / fasti booth for #93687. Idle **due** / seeded **misfired** / path **catchup-dow**. Score calends or admit due.

Score calends or admit due.

Idle word: **due** (HOLD: catch-up only when DOW/date fields match; calendar day correct). Seeded word: **misfired** / #93687 (wrong-day catch-up; status succeeded). Path word: **catchup-dow**. Product score: **calends**. Never idle flowing / underway / seated / tip / stamped / standing / raised / seised / ordered / viewed / closed / sealed / voiced / primed or seeded dammed / becalmed / raced / stale / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / muted / flashed.

Phrase: **Score calends or admit due.**

- **due** = IDLE: HOLD; catch-up only when DOW/date fields match; calendar day correct
- **misfired** = #93687 seeded path: wrong-day catch-up; status succeeded
- **calends** = product score word for a stone calendar whose hand rings the wrong day
- **catchup-dow** = path word: catch-up walks time-of-day and skips the DOW mark
- **hold** = HOLD alias for idle due
- **wrong-day-cluster** = five weekly tasks fire ~12:15–12:19 AM local on a Friday
- **status-succeeded** = misfires report status: succeeded — they are not hanging
- **no-disable-setting** = schemas omit a catch-up toggle
- **dow-ignored** = Monday-only and Wednesday-only fire off their weekday
- **cron-full-fields** = expectation: walk backward through the cron’s full field set including DOW and DOM
- **list-task-runs** = correctly-timed runs mixed with sporadic wrong-day fires
- **outbound-risk** = Gmail drafts, Jira issues, git commits can duplicate or run with wrong-day assumptions
- **has-repro** = published shape: Windows Desktop; Friday cluster; five weekly tasks; status succeeded
- **cousins** = cite-only #93015 Flashpan — do not rebuild
- **backups** = cite-only #93683 #93672 #93652 #93680 #93618 — do not auto-pick
- **fixtures** = fasti stone / catch-up hand / nundinal letters / kalends date / acta diurna
- **walk** = published idle due → docs catch-up → Monday-only → Wednesday-only → Friday cluster → list_task_runs → Thu-only wrong days → Wed-only wrong days → status succeeded → no disable → outbound risk → catchup-dow → calends

Verdicts: due, misfired, calends, catchup-dow, hold, wrong-day-cluster, status-succeeded, no-disable-setting, dow-ignored, cron-full-fields, list-task-runs, outbound-risk, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the stone calendar is **misfired** / **calends** or already **due**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): missed-run catch-up may pick the most recent clock time in the last 7 days that matches HH:MM while ignoring DOW/DOM constraints. Invite verify against #93687 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93687](https://github.com/anthropics/claude-code/issues/93687)
- Cite-only cousins: #93015 (Flashpan — stamp without birth)
- Backups (data only; next focus only — do not auto-pick): #93683, #93672, #93652, #93680, #93618

What happened (from the issue text — do not invent):

- OPEN.
- Claude Code Desktop app, Windows
- Scheduled tasks via `schedule` skill / `mcp__scheduled-tasks__*`
- Docs: on start/wake, check missed runs in last seven days; start exactly one catch-up for the most recently missed time
- Day-restricted crons (`0 19 * * 1` Monday-only, `45 18 * * 3` Wednesday-only) fire on the wrong weekday
- Five tasks (Fri-only, Wed-only×2, Mon-only, Thu-only) all fired ~12:15–12:19 AM local on a Friday
- `list_task_runs`: correctly-timed runs mixed with sporadic wrong-day fires
- Thursday-only fires on Sunday and Friday; Wednesday-only fires on Friday and Thursday
- Misfires report `status: succeeded`
- No disable-catch-up setting (schemas: enabled / cronExpression / fireAt / prompt / title / description / notifyOnCompletion)
- Mitigation today is prompt-level day guards
- Outbound risk: Gmail drafts, Jira issues, git commits
- One Gmail/Jira task exited early via a “nothing new this week” guard
- Labels: bug / has repro / platform:windows / area:desktop

Problem found: DESKTOP SCHEDULED TASKS CATCH-UP IGNORES DAY-OF-WEEK / DATE CRON FIELDS AND FIRES ON WRONG DAYS; STATUS SUCCEEDED; NO DISABLE SETTING.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the stone calendar stayed **due** or went **misfired**. Educational fasti booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Catch-up should compute “the most recently missed time” by walking backward through the cron’s full field set (including day-of-week and day-of-month), so a Wednesday-only task’s most recent missed time is always a Wednesday

## Why not a clone

This is specifically: **DESKTOP SCHEDULED TASKS CATCH-UP IGNORES DOW/DATE CRON FIELDS AND FIRES ON WRONG DAYS.**

Novel paradigm: stone calendar / fasti whose catch-up hand should only strike the marked weekday, but skips the DOW field and rings the wrong calends.

**NOT Weir/#93589** (Cowork Desktop additional-domains / All domains egress 403 after VM 2.1.266). Different defect. NOT mill weir / millrace. Do not reuse flowing / dammed / egress-allowlist.

**NOT Irons/#93615** (scheduled / cron WebSearch hang). Different defect. NOT sailing in-irons / head-to-wind. Do not reuse underway / becalmed / cron-websearch.

**NOT Cathead/#93624** (macOS teammate spawn ENXIO / xnu ptmx race). Different defect. NOT bow cathead / PTY-slot. Do not reuse seated / raced / ptmx-race.

**NOT Anachronism/#93585** (cloud pre-warm vs session-start checkout race). Different defect. NOT continuity slate / darkroom. Do not reuse tip / stale / prewarm-latch.

**NOT Nullarbor/#93595** (plugin HTTP MCP `${VAR}` header expands empty). Different defect. NOT saltbush / empty-bearer. Do not reuse stamped / emptied / empty-expand.

**NOT Petard/#93607** (Linux Bash-tool `pkill -f` matches wrapper argv). Different defect. NOT siege petard. Do not reuse standing / hoisted / wrapper-argv.

**NOT Flashpan/#93015** (`lastRunAt` stamp with zero session birth). DIFFERENT bug — cite only. Do not reuse primed / flashed.

**NOT Hangfire** (queued job never fires). Different defect. Here the job fires — on the wrong day — and reports succeeded.

**NOT Gnomon / Almanac / Clepsydra** — different catalog timepieces. This booth is a Roman fasti whose weekday marks are skipped, not a sundial, almanac page, or water clock.

**NOT #93015** — cite only.

Do NOT rename Calends to any existing catalog slug. Catalog currently has 298 products; Calends is #299.
Do NOT reuse idle flowing / underway / seated / tip / stamped / standing / raised / seised / ordered / viewed / closed / sealed / voiced / primed, or seeded dammed / becalmed / raced / stale / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / muted / flashed.
Display here is **Cinzel**. Body is **Figtree**. Mono is **Fira Code**.

Different surface: wrong-day catch-up vs sandbox egress allowlist ignore vs scheduled WebSearch hang vs xnu ptmx race vs cloud pre-warm checkout vs lastRunAt-without-birth.

Different UI: fasti stone / catch-up hand / nundinal letters / kalends date / acta diurna. Cinzel / Figtree / Fira Code. Chalk-white marble with slate ink, oxblood, gilt, ash, dawn blue. NOT mill-house parchment. NOT Atlantic sailing. NOT oak timber. NOT priming-pan.

Different verbs: Mark the weekday, Score calends, Walk the fasti, Compare due / misfired, Pin idle due, Pin seeded misfired, Pin catchup-dow, Hold the due.

Different idle: **due**. Different #93687 seeded path: **misfired**. HOLD: **due** / **hold**. ALARM: **misfired** / **calends** / **catchup-dow** / **wrong-day-cluster**. Path: **catchup-dow**.

## How to score

```bash
node --test projects/calends/calends.test.mjs
node projects/calends/calends.mjs projects/calends/data/misfired.json
echo '{"seed":"misfired"}' | node projects/calends/calends.mjs
```

Open the living card at `projects/calends/index.html` (or the live path `/calends/`). Buttons: Mark the weekday, Score calends, Walk the fasti, Compare due / misfired, Pin idle due, Pin seeded misfired, Pin catchup-dow, Hold the due. Toggle chips for: wrong-day cluster, status succeeded, no disable setting, DOW ignored, cron full fields, list_task_runs, outbound risk — the score flips. Lay a fixture JSON on the marble blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s catch-up walk from the published #93687 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/calends/
- Folder: `projects/calends/`

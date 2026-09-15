# Lemure

A **lararium / salt-bean / Lemuria-rite / household-shrine booth** — in Roman household religion, *lemures* are the restless dead; the Lemuria festival stilled them with a salt-bean rite at the lararium. The ScheduledTasks dispatcher should stay **quiet** (no orphan minute-ticks; ghosts absent from the dispatcher, or listed and deletable). Instead two deleted ids still walk once a minute at a vanished legacy path while the shrine roster will not name them and will not let them be removed. Fonts **Bodoni Moda** (display) + **Figtree** (body) + **Fira Code** (mono). Palette: ashlar stone `#A39888`, salt-white `#F7F4EC`, bean-black `#120E0C`, lararium bronze `#C17A3A`, midnight indigo `#16182F`, ember-red tick `#E24A32`. Fresh trio. Completely different UI/UX/metaphor — lararium niche / salt circle / bean rite / ember tick. NOT a flintlock flash-pan. NOT a desert heat-haze. NOT a binder folio. NOT a theater tapestry. NOT Deadlight / Glowplug / Relict / Ashpan / Gleaner. NOT Cancellans / Arras / Frangible / Nameplate / Matryoshka / Dragnet / Matricula / Allograph / Agraphia / Gauntlet.

The shrine should stay **quiet** (HOLD: no orphan minute-ticks; ghosts absent from dispatcher OR listed AND deletable). Instead the booth was **lemure** after an **orphan-tick**.

Primary:

- [anthropics/claude-code#94410](https://github.com/anthropics/claude-code/issues/94410) (OPEN). Title: `Desktop: ghost scheduled tasks fire every minute but are absent from UI, MCP list, and on-disk registry`. Labels: bug, has repro, platform:macos, area:desktop, area:routines. Environment: Claude Desktop 1.52386.6, Claude Code 2.1.270, macOS 26.6.2 Apple Silicon. Desktop `ScheduledTasks` manager still dispatches two deleted/legacy tasks once per minute (`ohayo-morning-report`, `mercari-daily-sales-check`). Logs show task file not found / ENOENT at legacy path `/Users/<user>/Claude/Scheduled/.../SKILL.md`. Tasks are absent from Routines UI, `scheduled-tasks` MCP list, on-disk `~/.claude/scheduled-tasks/`, and `scheduled-tasks.json`. MCP delete says not found. Survives full app restart. ~1440 lines/day of log noise. Working tasks live under `~/.claude/scheduled-tasks/`; legacy `~/Claude/Scheduled/` does not exist. Suspected leftover after app update. Stay off Flashpan/Mirage/Deadlight/Glowplug/Relict/Ashpan/Gleaner/Cancellans/Arras/Frangible/Nameplate/Matryoshka/Dragnet/Matricula/Allograph/Agraphia/Gauntlet paradigms.

10:50 lemure: a lararium / salt-bean / Lemuria-rite / household-shrine booth for #94410. Desktop ScheduledTasks manager still dispatches two deleted/legacy tasks once per minute (ohayo-morning-report, mercari-daily-sales-check). Logs show task file not found / ENOENT at legacy path ~/Claude/Scheduled/.../SKILL.md. Tasks absent from Routines UI, scheduled-tasks MCP list, on-disk ~/.claude/scheduled-tasks/, and scheduled-tasks.json. MCP delete says not found. Survives full app restart. ~1440 lines/day of log noise. Idle **quiet** / seeded **lemure** / path **orphan-tick**. Score lemure or admit quiet.

Score lemure or admit quiet.

Idle word: **quiet** (HOLD: no orphan minute-ticks; ghosts absent from dispatcher OR listed AND deletable). HOLD aliases: rostered, enrolled, lararium, stilled, listed, removable. Seeded word: **lemure** / #94410 (the orphan-tick path). Path word: **orphan-tick**. Product score: **lemure**. Never idle intact / cleared / armed / affixed / unpacked / primed / confirmed / blanked or seeded Flashpan / Mirage / Deadlight / Cancellans or path lastRunAt / deferred-delta.

Phrase: **Score lemure or admit quiet.**

- **quiet** = IDLE HOLD: no orphan minute-ticks; ghosts absent from dispatcher OR listed AND deletable
- **lemure** = seeded path / product score: dispatcher still walks unlisted names at a vanished path
- **orphan-tick** = path word
- **hold** = HOLD alias for idle quiet
- **rostered** = HOLD alias: every ticking id is on the tablet
- **enrolled** = HOLD alias: names written in the rite
- **lararium** = HOLD alias: household shrine holds
- **stilled** = HOLD alias: salt-bean rite completed
- **listed** = HOLD alias: UI + MCP name every ticking id
- **removable** = HOLD alias: delete_scheduled_task accepts the id
- **legacy-path** = ~/Claude/Scheduled/ does not exist; working tasks live under ~/.claude/scheduled-tasks/
- **enoent-skip** = task file not found / path not symlink-free before open
- **mcp-absent** = list_scheduled_tasks returns 33; neither ghost is among them
- **ui-absent** = Routines search returns no matching routines
- **registry-miss** = scheduled-tasks.json has 0 matches for either id
- **restart-survives** = leftover source is re-read after a full app restart
- **minute-tick** = once per minute; about 1440 lines/day
- **landing** = lararium / salt-bean / Lemuria-rite / household-shrine
- **has-repro** = published shape: Desktop 1.52386.6 · Code 2.1.270 · macOS 26.6.2
- **cousins** = cite-only #93015 #92920 #92249 #91527 — do not rebuild; do not conflate
- **backups** = cite-only #93924 #93770 #93777 #94151 — do not auto-pick
- **fixtures** = working roster / ghost dispatcher
- **walk** = published idle quiet → orphan-tick → lemure
- **closed** = #94410 remains OPEN — cite only; not this booth

Verdicts: quiet, lemure, orphan-tick, hold, rostered, enrolled, lararium, stilled, listed, removable, legacy-path, enoent-skip, mcp-absent, ui-absent, registry-miss, restart-survives, minute-tick, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **lemure** or already **quiet**. Fixtures use the issue's published incident only. Orphan-tick rows are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): leftover registration after an app update still feeds the ScheduledTasks dispatcher from a source that is not the on-disk registry / UI / MCP list; dispatcher ticks deleted ids at the legacy ~/Claude/Scheduled/ path. Invite verify against #94410 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94410](https://github.com/anthropics/claude-code/issues/94410)
- Cousins: do NOT rebuild / do NOT conflate: #93015 (stamp without a session birth), #92920 (renderer ack without a session), #92249 (blanked tools on a scheduled session), #91527 (scheduler skip / success report with no session). None of them covers leftover dispatcher ticks of deleted ids at a vanished legacy path that are absent from UI, MCP, and disk.
- Backups (data only; next focus only — do not auto-pick): #93924, #93770, #93777, #94151

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:desktop, area:routines
- Environment: Claude Desktop 1.52386.6; Claude Code 2.1.270; macOS 26.6.2 Apple Silicon
- `ScheduledTasks` still dispatches `ohayo-morning-report` and `mercari-daily-sales-check` once per minute
- `[warn] Skipping scheduled task ohayo-morning-report: task file not found at /Users/<user>/Claude/Scheduled/ohayo-morning-report/SKILL.md`
- `[error] Failed to read task file for mercari-daily-sales-check: path not symlink-free before open { code: 'ENOENT' }`
- Volume: 708 (2026-09-09 from 12:12), then 1444 / 1442 / 1440 / 1444 / 1443 — about 1440 lines/day
- Legacy `~/Claude/Scheduled/` does not exist; `~/Claude/` itself does not exist
- Working tasks live under `~/.claude/scheduled-tasks/` — no directory for either id
- MCP `list_scheduled_tasks` returns 33 tasks; neither ghost is among them
- MCP `delete_scheduled_task` rejected: `Scheduled task "ohayo-morning-report" not found.`
- Routines UI searches for ohayo, おはよう, and メルカリ return "no matching routines"
- `scheduled-tasks.json` exists (28 KB) and parses; grep for either id returns 0 matches
- IndexedDB / Local Storage / Session Storage / Partitions: 0 matches
- Restart does not clear it (main process 08:33:48; same warning at 08:38:54 and every minute after)
- First occurrence 2026-09-09 12:12 coincides with Application Support/Claude mtime 12:11 — suspected leftover after app update
- Impact: log noise only; no effect on the 33 working routines

Problem found: ORPHAN-TICK — leftover dispatcher still walks unlisted names at a vanished legacy path.

Why Lemure: A *lemure* is a restless dead that walks the house after the living roster has forgotten the name. The dispatcher should stay quiet. Instead two deleted ids still knock the legacy lintel once a minute, while the lararium tablet (UI, MCP, on-disk registry) will not list them and the salt-bean rite (delete) is rejected as not found. Flashpan/#93015 stamped a time without birthing a session — DIFFERENT. Mirage/#92920 acknowledged a dispatch without a session — DIFFERENT. Deadlight/#92249 blanked tools on a scheduled session — DIFFERENT. This booth is specifically leftover **dispatcher ticks of deleted ids** vs **roster honesty**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores the orphan-tick path (ghost dispatcher) vs a quiet/rostered hold — makes the invisible registration failure legible. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Either the stale registration is dropped when its task file is missing
2. Or the leftover id is exposed somewhere the user can delete it (Routines UI, or `delete_scheduled_task` accepting it)
3. A restart should re-read only the on-disk registry — not rekindle vanished legacy ids

## Why not a clone

This is specifically: **LEFTOVER DESKTOP SCHEDULER REGISTRATION. TWO DELETED/LEGACY TASK IDS STILL FIRE ONCE PER MINUTE AT A VANISHED `~/Claude/Scheduled/.../SKILL.md` PATH; THEY ARE ABSENT FROM ROUTINES UI, MCP LIST, AND ON-DISK REGISTRY; DELETE IS REJECTED AS NOT FOUND; A FULL APP RESTART DOES NOT CLEAR THEM.**

Novel paradigm: lararium / salt-bean / Lemuria-rite / household-shrine — ashlar stone, salt-white, bean-black, lararium bronze, midnight indigo, ember-red tick. New issue, new paradigm (orphan-tick), new UI/UX/fonts/colors, new scoring vocabulary. A memorial rite, not a flintlock pan, desert haze, binder folio, theater tapestry, shuttered porthole, diesel preheat, MSIX outcrop, industrial grate, or leftover harvest.

**NOT Flashpan/#93015** (stamps lastRunAt, never births session). Different defect. Do not reuse primed / Flashpan / lastRunAt.

**NOT Mirage/#92920** (renderer ack without session). Different defect. NOT desert heat-haze. Do not reuse confirmed / Mirage.

**NOT Deadlight/#92249** (blanked ListAgents on scheduled). Different defect. NOT shuttered porthole. Do not reuse blanked / Deadlight.

**NOT Glowplug/#85050** (Windows preheat). Different defect. NOT diesel glow-plug bay. Do not reuse lit / Glowplug.

**NOT Relict** (stale MSIX path). Different defect. Do not reuse Relict.

**NOT Ashpan/#93780** (orphan-jsonl). Different metaphor. Do not reuse swept / Ashpan.

**NOT Gleaner/#93794** (unreaped-ampersand). Different metaphor. Do not reuse gleaned / Gleaner.

**NOT Cancellans/#94400** (deferred-delta). Different defect. NOT binder folio. Do not reuse intact / Cancellans / deferred-delta.

**NOT Arras/#94348** (phantom approval card). Different defect. Do not reuse cleared / Arras / phantom-prompt.

**NOT Frangible/#94362** (chmod-failopen). Different defect. NOT wax-seal atelier. Do not reuse armed / Frangible / chmod-failopen.

**NOT Nameplate/#94349** (header-rename). Different defect. NOT hotel door-plate. Do not reuse affixed / Nameplate / header-rename.

**NOT Matryoshka/#94350** (subst-nest). Different defect. NOT lacquer nesting-doll. Do not reuse unpacked / Matryoshka / subst-nest.

**NOT Dragnet/#94064** (root-find). Different defect. NOT night blotter. Do not reuse scoped / Dragnet / root-find.

**NOT Matricula/#93987** (reload-blind). Different defect. NOT enrollment desk.

**NOT Allograph/#94256** (win-posix-mismatch). Different defect. NOT type-foundry.

**NOT Agraphia/#94251** (pre-tool-omit). Different defect. NOT clinical writing-desk.

**NOT Gauntlet/#94029** (attach-mouse). Different defect. NOT tilting-yard / iron glove.

Live: https://hermes-playground-green.vercel.app/lemure/

```
node --test projects/lemure/lemure.test.mjs
node projects/lemure/lemure.mjs projects/lemure/data/lemure.json
```

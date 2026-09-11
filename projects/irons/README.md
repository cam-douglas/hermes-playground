# Irons

A **sailing vessel in irons / head-to-wind booth** — helm locked into the wind, sails aback, no way on; scheduled chronometer whose `lastActivityAt` hand never moves; WebSearch kite that never fills on the cron path; interactive wind gauge that still shows breeze. Fonts **Cardo** (display/serif) + **Figtree** (body) + **IBM Plex Mono** (mono). Palette: deep Atlantic `#0A1628`, foam white `#E8F1F8`, storm grey `#4A5568`, signal amber `#E0A100`, kelp green `#1F6F5B`, rust `#8B3A2A`. Dark theme. NOT bow cathead / PTY, NOT film continuity, NOT saltbush plain, NOT siege petard, NOT manuscript vellum, NOT flintlock flashpan, NOT desert mirage, NOT Hangfire.

A vessel in irons sits head-to-wind with no way: the scheduled kite should fill; instead WebSearch never returns and the chronometer freezes while the interactive gauge still shows breeze.

Primary:

- [anthropics/claude-code#93615](https://github.com/anthropics/claude-code/issues/93615) (OPEN). Title: `[BUG] Scheduled tasks: WebSearch tool calls hang indefinitely in background/cron-triggered sessions`. A scheduled task (Claude Code desktop app's Scheduled / scheduled-tasks MCP, cron-triggered) that calls WebSearch gets stuck indefinitely — no result, no error, no timeout. The exact same WebSearch query executed manually in an interactive session on the same machine, same account, at essentially the same time, returns normally within a few seconds. Cap WebSearch to 2 calls still hangs on the first call. Evidence: session `local_aa541c89-94e6-44e3-9a0c-5dac2a188f0b` started 2026-09-11T08:55:28Z, stalled on the 5th WebSearch, still running at 2026-09-11T10:36:05Z (~1h40m); `local_3d6a8422-0097-4fb2-9eb1-9fbaf195ba9e` trickled 41→49 messages then stopped mid-WebSearch; `local_7e5dc769-7eaf-4aba-bdee-c65ee8d910b5` created 2026-09-11T11:56:00Z, hung on the first WebSearch, still stuck after 17 minutes (2026-09-11T12:13:19Z). Interrupt landed mid-WebSearch (`[Request interrupted by user for tool use]`). Windows desktop Scheduled Tasks / scheduled-tasks MCP. Labels: bug, has repro, platform:windows, area:tools, area:desktop, area:routines. Cousins cite-only: #89639 (macOS scheduled-task mid-tool wedge), #83859 (headless `claude -p` ~405s stall), #91723 (WebSearch quota exhausted without warning), #81478 / #89633 (WebSearch model-access / adaptive-thinking), #85119 (VS Code ignores WebFetch/WebSearch permission rules), #47180 (Cowork scheduled tasks ignore Always-allow). Backups cite-only (next focus only — do not auto-pick): #93570 (single-task shutdown kills all), #93589 (Cowork egress additional domains ignored), #93618 (Windows/Git Bash ~8175 truncation + backslash), #93622 (channel messages merge lose prompt cache), #93652 (Remote Control capacity silent session substitution).

02:50 irons: a sailing in-irons / head-to-wind booth for #93615. Idle **underway** / seeded **becalmed** / path **cron-websearch**. Score irons or admit underway.

Score irons or admit underway.

Idle word: **underway** (HOLD: interactive WebSearch returns in seconds; vessel has way). Seeded word: **becalmed** / #93615 (scheduled session stuck mid-WebSearch with zero progress). Path word: **cron-websearch**. Product score: **irons**. Never idle seated / tip / stamped / standing / raised / seised / ordered / viewed / closed / sealed / voiced / primed or seeded raced / stale / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / muted / flashed.

Phrase: **Score irons or admit underway.**

- **underway** = IDLE: HOLD; interactive WebSearch returns in seconds; vessel has way
- **becalmed** = #93615 seeded path: scheduled session stuck mid-WebSearch with zero progress
- **irons** = product score word for a vessel locked head-to-wind
- **cron-websearch** = path word: scheduled/cron WebSearch never returns
- **hold** = HOLD alias for idle underway
- **websearch-hang** = WebSearch call never returns — no result, no error
- **no-timeout** = no timeout fires; the kite luffs indefinitely
- **last-activity-freeze** = `lastActivityAt` stops advancing
- **session-running** = session status stays running with zero progress
- **first-call-hang** = cap of 2 still hangs on the first WebSearch call
- **interactive-ok** = identical query in an interactive session returns in seconds
- **cap-two** = prompt capped WebSearch usage at exactly 2 calls
- **interrupt-mid-call** = interrupt landed mid-WebSearch-tool-call
- **windows-desktop** = Windows desktop Scheduled Tasks
- **scheduled-tasks-mcp** = scheduled-tasks MCP trigger
- **fifth-call-stall** = Run 1 stalled on the 5th WebSearch
- **run-now** = triggered via Run now as well as cron
- **cron-trigger** = cron / scheduled background spawn
- **has-repro** = published shape: Windows desktop; local_aa541c89… / local_3d6a8422… / local_7e5dc769…; cap 2 hangs on first call
- **cousins** = cite-only #89639 #83859 #91723 #81478 #89633 #85119 #47180 — do not rebuild
- **backups** = cite-only #93570 #93589 #93618 #93622 #93652 — do not auto-pick
- **fixtures** = helm / WebSearch kite / scheduled chronometer / interactive wind gauge / session log
- **walk** = published idle underway → cron trigger → WebSearch hang → no-timeout → lastActivityAt freeze → session running → first-call hang → interactive control → interrupt mid-call → cron-websearch → irons

Verdicts: underway, becalmed, irons, cron-websearch, hold, websearch-hang, no-timeout, last-activity-freeze, session-running, first-call-hang, interactive-ok, cap-two, interrupt-mid-call, windows-desktop, scheduled-tasks-mcp, fifth-call-stall, run-now, cron-trigger, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the vessel is **becalmed** / **irons** or already **underway**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): scheduled/background sessions may lack the interactive WebSearch auth/session/egress path or miss a timeout. Invite verify against #93615 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93615](https://github.com/anthropics/claude-code/issues/93615)
- Cite-only cousins: #89639, #83859, #91723, #81478, #89633, #85119, #47180
- Backups (data only; next focus only — do not auto-pick): #93570, #93589, #93618, #93622, #93652

What happened (from the issue text — do not invent):

- OPEN.
- Scheduled / cron / background Claude Code sessions hang indefinitely on WebSearch
- No result, no error, no timeout
- `lastActivityAt` freezes; session stays "running"
- Identical WebSearch query in an interactive session on the same machine/account returns in a few seconds
- Cap WebSearch to 2 calls still hangs on the first call
- Run 1 `local_aa541c89…` started 2026-09-11T08:55:28Z, stalled on the 5th WebSearch, still running at 10:36:05Z (~1h40m)
- Run 2 `local_3d6a8422…` trickled 41→49 messages then stopped mid-WebSearch
- Run 3 `local_7e5dc769…` created 11:56:00Z, hung on the first WebSearch, still stuck after 17 minutes (12:13:19Z)
- Interrupt: `[Request interrupted by user for tool use]`
- Windows desktop Scheduled Tasks / scheduled-tasks MCP; triggered by cron and by Run now
- Sonnet (default); Anthropic API; labels bug / has repro / platform:windows / area:tools / area:desktop / area:routines

Problem found: SCHEDULED / CRON / BACKGROUND WEBSEARCH HANGS INDEFINITELY — NO RESULT, NO ERROR, NO TIMEOUT; INTERACTIVE CONTROL RETURNS IN SECONDS.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the vessel stayed **underway** or went **becalmed**. Educational in-irons booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. WebSearch from a scheduled/background session should complete in roughly the same time as interactive (seconds), or fail/timeout with an error rather than hanging indefinitely

## Why not a clone

This is specifically: **SCHEDULED / CRON / BACKGROUND WEBSEARCH HANGS INDEFINITELY — NO RESULT, NO ERROR, NO TIMEOUT; INTERACTIVE CONTROL RETURNS IN SECONDS.**

Novel paradigm: scheduled-session WebSearch kite that never fills while the interactive wind gauge still shows breeze; chronometer frozen; session stays running.

**NOT Cathead/#93624** (macOS teammate spawn ENXIO / xnu ptmx race). Different defect. NOT bow cathead / PTY-slot. Do not reuse seated / raced / ptmx-race.

**NOT Anachronism/#93585** (cloud pre-warm vs session-start checkout race). Different defect. NOT continuity slate / darkroom. Do not reuse tip / stale / prewarm-latch.

**NOT Nullarbor/#93595** (plugin HTTP MCP `${VAR}` header expands empty). Different defect. NOT saltbush / empty-bearer. Do not reuse stamped / emptied / empty-expand.

**NOT Petard/#93607** (Linux Bash-tool `pkill -f` matches wrapper argv). Different defect. NOT siege petard. Do not reuse standing / hoisted / wrapper-argv.

**NOT Aposiopesis/#93588** (statusLine git-cwd mute). Different defect. NOT vellum/ink speech-break.

**NOT Flashpan/#93015** (`lastRunAt` stamp with zero session birth). DIFFERENT bug. Flashpan is a flintlock flash without discharge — a stamp with no session born. Irons is a born session that hangs mid-WebSearch. Do not reuse primed / flashed.

**NOT Mirage/#92920** (dispatch-ack-no-session). Different defect. NOT heat-haze / false oasis.

**NOT Hangfire** (queued job never fires). Different defect. Do not reuse hangfire vocabulary.

**NOT #89639** — macOS scheduled-task mid-tool wedge. Cite only.

Do NOT rename Irons to any existing catalog slug. Catalog currently has 296 products; Irons is #297.
Do NOT reuse idle seated / tip / stamped / standing / raised / seised / ordered / viewed / closed / sealed / voiced / primed, or seeded raced / stale / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / muted / flashed.
Display here is **Cardo**. Body is **Figtree**. Mono is **IBM Plex Mono**.

Different surface: scheduled WebSearch hang vs xnu ptmx race vs cloud pre-warm checkout vs empty-bearer MCP headers vs Linux Bash-tool pkill wrapper-argv vs lastRunAt-without-birth.

Different UI: helm head-to-wind / sails aback / WebSearch kite / scheduled chronometer / interactive wind gauge. Cardo / Figtree / IBM Plex Mono. Deep Atlantic with foam white, storm grey, signal amber, kelp green, rust. NOT oak timber. NOT darkroom film. NOT saltbush dusk. NOT siege trench. NOT flintlock pan. NOT desert haze.

Different verbs: Fill the kite, Score irons, Sheet the headsail, Compare underway / becalmed, Pin idle underway, Pin seeded becalmed, Pin cron-websearch, Hold the underway.

Different idle: **underway**. Different #93615 seeded path: **becalmed**. HOLD: **underway** / **hold**. ALARM: **becalmed** / **irons** / **cron-websearch** / **websearch-hang**. Path: **cron-websearch**.

## How to score

```bash
node --test projects/irons/irons.test.mjs
node projects/irons/irons.mjs projects/irons/data/becalmed.json
echo '{"seed":"becalmed"}' | node projects/irons/irons.mjs
```

Open the living card at `projects/irons/index.html` (or the live path `/irons/`). Buttons: Fill the kite, Score irons, Sheet the headsail, Compare underway / becalmed, Pin idle underway, Pin seeded becalmed, Pin cron-websearch, Hold the underway. Toggle chips for: WebSearch hang, no timeout, lastActivityAt freeze, session running, first-call hang, interactive ok, cap two, interrupt — the score flips. Lay a fixture JSON on the chart blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s WebSearch hang walk from the published #93615 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/irons/
- Folder: `projects/irons/`

# Orloj

A **Prague orloj / astronomical clock / zodiac dial / automaton tower / calendar dial booth** — an *orloj* is the Prague astronomical clock. The gilt face promises a full hour (`timeout_ms` schema max 3600000). The mechanism dies at **half-life** (~30 minutes) even during an active session, forcing perpetual re-arm. Fonts **Bodoni Moda** (display) + **Karla** (UI) + **Source Code Pro** (mono). Palette: night indigo `#0C1228`, gilt brass `#C9A24A`, clock-face cream `#F6EAD4`, rust automaton red `#A63A28`. Fresh trio. Completely different UI/UX/metaphor — clock face / zodiac ring / automaton apostles / calendar dial / death-bell half-life. NOT a herald's college. NOT a scriptorium tablet. NOT an Elizabethan mask booth. NOT a confectionery kitchen. NOT a sleep ward. NOT a night-wall inhibitor. NOT a dictation recorder. NOT a household shrine. NOT a binder folio. NOT a theater tapestry. NOT a wax-seal atelier.

The tower should stay **lasting** (HOLD: schema-promised hour honored during active use). Instead the booth was **orloj** after a **half-life**.

Primary:

- [anthropics/claude-code#94393](https://github.com/anthropics/claude-code/issues/94393) (OPEN). Title: `[BUG] Monitor tool: doesn't respect persistent flag and timeout_ms schema caps at 3600000 but actual lifetime is ~30 minutes, even during active (non-idle) sessions`. Labels: bug, has repro, platform:linux, area:tools. Environment: Claude Code 2.1.270; Ubuntu/Debian Linux; Anthropic API. The Monitor tool hard-rejects persistent and `timeout_ms` above 3600000 (1 hour); calling with `86400000` (24h) fails immediately with `InputValidationError: timeout_ms must be <= 3600000`. At the allowed max 3600000 the confirmation says "expires in 30m unless the source ends first; you get one notice at expiry — re-arm if you still need the watch". Distinct from #63023 / #65968 (background tasks harvested on session pause/idle-suspend): the reporter's session never went idle — actively processing `task-notification` every ~30m from this monitor's own expiry for hours. Re-arming immediately after each expiry produces the same ~30-minute lifetime again. Docs: https://code.claude.com/docs/en/tools-reference#monitor-tool. Stay off Brisure/Diptych/Vizard/Treacle/Somnus/Cresset/Dictabelt/Lemure/Cancellans/Arras paradigms.

19:50 orloj: a prague orloj / astronomical clock / zodiac dial / automaton tower booth for #94393. Monitor tool schema caps timeout_ms at 3600000 and ignores persistent; even at the allowed max the tool reports expires in 30m and dies ~30 minutes during an active session — perpetual re-arm. Idle **lasting** / seeded **orloj** / path **half-life**. Score orloj or admit lasting.

Score orloj or admit lasting.

Idle word: **lasting** (HOLD: schema-promised hour honored during active use). HOLD aliases: hourlong, promised, diurnal, calendar. Seeded word: **orloj** / #94393 (the half-life path). Path word: **half-life**. Product score: **orloj**. Never idle enrolled / single / pledged / brisk / cadence / suspend or seeded Brisure / Diptych / Vizard / Treacle / Somnus / Cresset / Dictabelt / Lemure / Cancellans / Arras or path names from those booths.

Phrase: **Score orloj or admit lasting.**

- **lasting** = IDLE HOLD: schema-promised hour honored during active use
- **orloj** = seeded path / product score: clock face promises an hour; mechanism dies at half-life
- **half-life** = path word: silent ~30m cap during an active session
- **hourlong** = HOLD alias: gilt hand sweeps a full circle
- **promised** = HOLD alias: confirmation names the accepted timeout
- **diurnal** = HOLD alias: the tower's day cycle holds
- **calendar** = HOLD alias: calendar dial still names the hour
- **schema-cap** = InputValidationError: timeout_ms must be <= 3600000
- **thirty-minute** = confirmation says expires in 30m, not 1h
- **persistent-reject** = persistent is ignored / hard-rejected
- **re-arm** = re-arming immediately after each expiry produces the same ~30m
- **active-session** = session never idle; task-notification every ~30m for hours
- **docs-promise** = docs imply longer/persistent watches
- **94393** = issue number seed
- **landing** = Prague orloj / astronomical clock / zodiac dial
- **has-repro** = published shape: Claude Code 2.1.270 · Ubuntu/Debian Linux
- **cousins** = cite-only #63023 #65968 — do not rebuild; do not conflate
- **backups** = cite-only #94392 #86198 #94417 #94452 #94451 #94430 #94458 #93924 #93770 #93777 #94151 — do not auto-pick
- **fixtures** = clock face / zodiac ring / automaton walk
- **walk** = published idle lasting → half-life → orloj
- **closed** = #94393 remains OPEN — cite only; not this booth

Verdicts: lasting, orloj, half-life, hourlong, promised, diurnal, calendar, schema-cap, thirty-minute, persistent-reject, re-arm, active-session, docs-promise, 94393, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **orloj** or already **lasting**. Fixtures use the issue's published incident only. Monitor reconstructions from published text are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): schema max / docs disagree with honored lifetime; silent ~30m cap during active use. Invite verify against #94393 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94393](https://github.com/anthropics/claude-code/issues/94393)
- Cousins: do NOT rebuild / do NOT conflate: #63023 (background agents die on session pause/resume — idle/pause harvest), #65968 (closed as a duplicate of #63023; idle/suspend boundaries). Neither is a schema-capped Monitor that dies at ~30m during an active session.
- Backups (data only; next focus only — do not auto-pick): #94392, #86198, #94417, #94452, #94451, #94430, #94458, #93924, #93770, #93777, #94151

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:linux, area:tools
- Environment: Claude Code 2.1.270; Ubuntu/Debian Linux; Anthropic API
- Monitor hard-rejects persistent and `timeout_ms` above 3600000 (1 hour)
- Calling with `timeout_ms: 86400000` (24 hours) fails immediately: `InputValidationError: timeout_ms must be <= 3600000`
- At allowed max 3600000, confirmation says "expires in 30m unless the source ends first; you get one notice at expiry — re-arm if you still need the watch"
- Distinct from #63023 / #65968 (background tasks harvested on session pause/idle-suspend)
- Reporter's session never went idle — actively processing `task-notification` every ~30m from this monitor's own expiry for hours
- Re-arming immediately after each expiry produces the same ~30-minute lifetime again
- Expiry notice: "Monitor expired after 30m with no events delivered"
- Docs: https://code.claude.com/docs/en/tools-reference#monitor-tool
- Expected: no limit, or bring back the old 24h limit; schema max should match honored lifetime; a Monitor at the allowed max should run that long during active use

Problem found: HALF-LIFE — schema max / docs disagree with honored lifetime; silent ~30m cap during active use.

Why Orloj: An *orloj* is the Prague astronomical clock. The gilt face promises a full hour. The automaton mechanism dies at half-life and Death rings the 30-minute chime, forcing the apostles to walk again. #63023 / #65968 are idle/pause harvest — DIFFERENT. This booth is specifically **Monitor schema cap + ignored persistent + ~30m lifetime during an active session**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores half-life honesty (lasting vs orloj) so operators can see the promised hour versus the 30-minute death-bell without needing a Claude session. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. No limit on the monitor time, or bring back the old 24h limit
2. The `timeout_ms` schema max should match the tool's actual honored lifetime
3. A Monitor started with any value up to the documented/allowed max should actually run for that long during active use, not silently cap out near 30 minutes

## Why not a clone

This is specifically: **MONITOR TOOL SCHEMA CAPS TIMEOUT_MS AT 3600000 AND IGNORES PERSISTENT; EVEN AT THE ALLOWED MAX THE TOOL REPORTS EXPIRES IN 30M AND DIES ~30 MINUTES DURING AN ACTIVE SESSION — PERPETUAL RE-ARM. CLAUDE CODE 2.1.270; UBUNTU/DEBIAN LINUX; DISTINCT FROM IDLE/PAUSE HARVEST.**

Novel paradigm: Prague orloj / astronomical clock / zodiac dial / automaton apostles / calendar dial / death-bell — night indigo, gilt brass, clock-face cream, rust automaton red. New issue, new paradigm (half-life), new UI/UX/fonts/colors, new scoring vocabulary. A clock-tower booth, not a herald's college, wax-tablet scriptorium, Elizabethan mask atelier, confectionery kitchen, sleep clinic, night-wall inhibitor, voice recorder, household shrine, binder folio, or theater tapestry.

**NOT #63023** (background agents die on session pause/resume). Idle/pause harvest. DIFFERENT failure mode. Do not conflate.

**NOT #65968** (closed as a duplicate of #63023; idle/suspend boundaries). DIFFERENT. Do not rebuild.

**NOT Brisure/#94396** (fork-resume never becomes Remote Control eligible). Different defect. Do not reuse enrolled / Brisure / fork-resume.

**NOT Diptych/#94397** (brief-echo). Different defect. Do not reuse single / Diptych / brief-echo.

**NOT Vizard/#94398** (background-reset to Opus 4.8). Different defect. Do not reuse pledged / Vizard / background-reset.

**NOT Treacle/#94344** (Windows PowerShell streaming-stall). Different defect. Do not reuse brisk / Treacle / streaming-stall.

**NOT Somnus/#94415** (Cowork cloud schedule `device_absent`). Different defect. Do not reuse cadence / Somnus / device-absent.

**NOT Cresset/#94420** (keep-awake hold-leak). Different defect. Do not reuse released / Cresset / hold-leak.

**NOT Dictabelt/#94406** (voice-dictation fragment path). Different defect. Do not reuse verbatim / Dictabelt / segment-drop.

**NOT Lemure/#94410** (orphan dispatcher ticks). Different defect. Do not reuse quiet / Lemure / orphan-tick.

**NOT Cancellans/#94400** (deferred-delta / tools-array drop). Different defect. Do not reuse intact / Cancellans / deferred-delta.

**NOT Arras/#94348** (phantom approval card). Different defect. Do not reuse cleared / Arras / phantom-prompt.

Live: https://hermes-playground-green.vercel.app/orloj/

```
node --test projects/orloj/orloj.test.mjs
node projects/orloj/orloj.mjs projects/orloj/data/orloj.json
```

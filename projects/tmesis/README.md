# Tmesis

A **manuscript / rhetoric / spliced parchment / editorial-desk booth** — a *tmesis* is the rhetorical figure of cutting a word and inserting another in the middle (abso-bloody-lutely). Slash-command `system` / `local_command` records are tmesis-spliced into the middle of an unresolved advisor turn, breaking the tool_use↔tool_result contiguity the API requires. Fonts **Cormorant Garamond** (display) + **Source Sans 3** (UI) + **IBM Plex Mono** (mono). Palette: parchment `#F4E8D0`, desk walnut `#2C1B12`, iron-gall `#1A1612`, vermillion splice `#C43C2C`, wax-seal `#8B1E1E`, ink blue `#243B55`, gold leaf `#C4A46A`, night desk `#14100C`. Fresh trio. Completely different UI/UX/metaphor — open folio / advisor ink-flow / slash-command ribbon / broken parentUuid chain / permanent 400 seal. NOT a cavalry lantern. NOT a Prague clock tower. NOT a herald's college. NOT a wax-tablet scriptorium. NOT an Elizabethan mask booth. NOT a confectionery kitchen. NOT a sleep ward. NOT a night-wall inhibitor. NOT a dictation recorder. NOT a household shrine. NOT a binder folio. NOT a theater tapestry.

The folio should stay **contiguous** (HOLD: defer local_command until the open assistant message — all blocks for that message.id — has closed). Instead the booth was **tmesis** after a **mid-inject**.

Primary:

- [anthropics/claude-code#86198](https://github.com/anthropics/claude-code/issues/86198) (OPEN). Title: `Running a slash command (/effort) while advisor is in flight injects local_command records mid-message and permanently 400s the session`. Labels: bug, has repro, reproduced, platform:macos, area:core. Environment: Claude Code 2.1.226; macOS 15.5 / darwin 25.5.0. While a server-side `advisor` tool call is in flight, typing an ordinary slash command (e.g. `/effort`) appends that command's `system` / `local_command` records **inside** the still-open assistant message, between `server_tool_use` and `advisor_tool_result`. The `advisor_tool_result`'s `parentUuid` then chains to the command's stdout record instead of the `server_tool_use`. Every subsequent request replays the corrupted history and fails with a non-retryable 400. Session permanently dead. Session `f11035d0-7407-4b01-8b8a-b9aaf785457d` made 63 advisor calls; 62 well-formed; the 63rd is broken. Lines 79113 and 79116 share one `message.id` (`msg_011CdyMt`). Error: `API Error: 400 messages.83.content.0: unexpected tool_use_id found in advisor_tool_result blocks: srvtoolu_01MF7bundmTNou6yC7iNqAs6`. Same mechanism as #81397 but injector is a **plain user slash command**, not a Stop hook. NOT the compaction variants (#81233, #60523). Stay off Vedette/Orloj/Brisure/Diptych/Vizard/Treacle/Somnus/Cresset/Dictabelt/Lemure/Cancellans/Arras paradigms.

21:50 tmesis: a manuscript / rhetoric / spliced parchment / editorial desk booth for #86198. Running a slash command (`/effort`) while `advisor` is in flight injects `local_command` records mid-message and permanently 400s the session. Idle **contiguous** / seeded **tmesis** / path **mid-inject**. Score tmesis or admit contiguous.

Score tmesis or admit contiguous.

Idle word: **contiguous** (HOLD: defer local_command until the open assistant message has closed). HOLD aliases: joined, uncut, bound, clause-shut. Seeded word: **tmesis** / #86198 (the mid-inject path). Path word: **mid-inject**. Product score: **tmesis**. Never idle stationed / lasting / enrolled / single / pledged / brisk / cadence / verbatim / quiet / intact / cleared or seeded Vedette / Orloj / Brisure / Diptych / Vizard / Treacle / Somnus / Cresset / Dictabelt / Lemure / Cancellans / Arras or path names from those booths.

Phrase: **Score tmesis or admit contiguous.**

- **contiguous** = IDLE HOLD: defer local_command until the open assistant message has closed
- **tmesis** = seeded path / product score: slash ribbon spliced through wet advisor ink
- **mid-inject** = path word: local_command records land between server_tool_use and advisor_tool_result
- **joined** = HOLD alias: tool_use and tool_result stay joined
- **uncut** = HOLD alias: the clause stays uncut
- **bound** = HOLD alias: parentUuid stays bound to server_tool_use
- **clause-shut** = HOLD alias: folio stays clause-shut
- **local-command** = system / local_command records spliced mid-message
- **orphan-result** = advisor_tool_result has no preceding server_tool_use in the assembled request
- **parent-break** = parentUuid points at stdout instead of server_tool_use
- **four-hundred** = non-retryable 400; session permanently dead
- **slash-effort** = injector is a plain user slash command (`/effort`), not a Stop hook
- **86198** = issue number seed
- **landing** = manuscript / rhetoric / spliced parchment / editorial desk
- **has-repro** = published shape: Claude Code 2.1.226 · macOS 15.5 / darwin 25.5.0
- **cousins** = cite-only #81397 #92509 #81233 #60523 — do not rebuild; do not conflate
- **backups** = cite-only #94417 #94452 #94451 #94430 #94458 #93924 #93770 #93777 #94151 — do not auto-pick
- **fixtures** = open folio / advisor ink / splice ribbon
- **walk** = published idle contiguous → mid-inject → tmesis
- **closed** = #86198 remains OPEN — cite only; not this booth

Verdicts: contiguous, tmesis, mid-inject, joined, uncut, bound, clause-shut, local-command, orphan-result, parent-break, four-hundred, slash-effort, 86198, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **tmesis** or already **contiguous**. Fixtures use the issue's published incident only. Transcript reconstructions from published text are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): local_command records are appended to the open assistant message while server_tool_use awaits advisor_tool_result; parentUuid chain breaks; API 400 forever. Invite verify against #86198 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#86198](https://github.com/anthropics/claude-code/issues/86198)
- Cousins: do NOT rebuild / do NOT conflate: #81397 (Stop-hook injector, same contiguity break), #92509 (server tool result separated by interleaved system messages), #81233 / #60523 (compaction — different).
- Backups (data only; next focus only — do not auto-pick): #94417, #94452, #94451, #94430, #94458, #93924, #93770, #93777, #94151

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, reproduced, platform:macos, area:core
- Environment: Claude Code 2.1.226; macOS 15.5 / darwin 25.5.0
- While `advisor` is in flight, typing `/effort` injects `system` / `local_command` records inside the still-open assistant message
- `advisor_tool_result.parentUuid` then points at the command's stdout uuid instead of the `server_tool_use` uuid
- Lines 79113 and 79116 share one `message.id` (`msg_011CdyMt`)
- Session made 63 advisor calls; 62 well-formed; the 63rd is broken
- Every subsequent request fails with a non-retryable 400
- Same mechanism as #81397 but injector is a plain user slash command
- NOT compaction (#81233, #60523)

Problem found: MID-INJECT — local_command records spliced into an unresolved advisor turn; parentUuid chain breaks; API 400 forever.

Why Tmesis: A *tmesis* is the rhetorical figure of cutting a word and inserting another in the middle. The slash-command records are tmesis-spliced into the middle of an unresolved advisor turn, breaking tool_use↔tool_result contiguity the API requires. #81397 is a Stop-hook injector — DIFFERENT injector. #81233 / #60523 are compaction — DIFFERENT. This booth is specifically **mid-message slash/local_command inject into in-flight advisor → permanent session 400**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores mid-inject honesty (contiguous vs tmesis) so operators can see the four-row evidence table and the broken parentUuid chain without needing a Claude session. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Defer local_command injection until the open assistant message (all blocks for that message.id) has closed
2. Belt-and-braces: detect orphaned advisor_tool_result at request-assembly and drop rather than send
3. Nothing may be chained into an assistant message with an unresolved server-side tool call

## Why not a clone

This is specifically: **RUNNING A SLASH COMMAND (`/EFFORT`) WHILE `ADVISOR` IS IN FLIGHT INJECTS `LOCAL_COMMAND` RECORDS MID-MESSAGE AND PERMANENTLY 400S THE SESSION. CLAUDE CODE 2.1.226; MACOS 15.5; PLAIN USER SLASH COMMAND, NOT A STOP HOOK, NOT COMPACTION.**

Novel paradigm: manuscript / rhetoric / spliced parchment / editorial desk / open folio / advisor ink / slash-command ribbon / 400 wax seal — parchment, walnut, iron-gall, vermillion, seal. New issue, new paradigm (mid-inject), new UI/UX/fonts/colors, new scoring vocabulary. A spliced-parchment booth, not a cavalry lantern, Prague clock tower, herald's college, wax-tablet scriptorium, Elizabethan mask atelier, confectionery kitchen, sleep clinic, night-wall inhibitor, voice recorder, household shrine, binder folio, or theater tapestry.

**NOT #81397** (Stop-hook injector, same contiguity break). DIFFERENT injector. Do not conflate.

**NOT #92509** (server tool result separated by interleaved system messages). DIFFERENT. Do not rebuild.

**NOT #81233** (compaction variant of the same invariant break). DIFFERENT. Do not rebuild.

**NOT #60523** (compaction variant). DIFFERENT. Do not rebuild.

**NOT Vedette/#94392** (headless `-p` idle-exit / false success). Different defect. Do not reuse stationed / Vedette / idle-exit.

**NOT Orloj/#94393** (Monitor schema cap / half-life during an active session). Different defect. Do not reuse lasting / Orloj / half-life.

**NOT Brisure/#94396** (fork-resume never becomes Remote Control eligible). Different defect. Do not reuse enrolled / Brisure / fork-resume.

**NOT Diptych/#94397** (brief-echo). Different defect. Do not reuse single / Diptych / brief-echo.

**NOT Vizard/#94398** (background-reset to Opus 4.8). Different defect. Do not reuse pledged / Vizard / background-reset.

**NOT Treacle/#94344** (Windows PowerShell streaming-stall). Different defect. Do not reuse brisk / Treacle / streaming-stall.

**NOT Somnus/#94415** (Cowork cloud schedule `device_absent`). Different defect. Do not reuse cadence / Somnus / device-absent.

**NOT Cresset/#94420** (keep-awake hold-leak). Different defect. Do not reuse released / Cresset / hold-leak.

**NOT Dictabelt/#94406** (voice-dictation fragment path). Different defect. Do not reuse verbatim / Dictabelt / segment-drop.

**NOT Lemure/#94410** (orphan scheduled-task ticks). Different defect. Do not reuse quiet / Lemure / orphan-tick.

**NOT Cancellans/#94400** (deferred-delta / tools-array drop). Different defect. Do not reuse intact / Cancellans / deferred-delta.

**NOT Arras/#94348** (phantom approval card). Different defect. Do not reuse cleared / Arras / phantom-prompt.

Live: https://hermes-playground-green.vercel.app/tmesis/

```
node --test projects/tmesis/tmesis.test.mjs
node projects/tmesis/tmesis.mjs projects/tmesis/data/tmesis.json
```

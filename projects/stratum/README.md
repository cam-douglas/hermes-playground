# Stratum

A **geology / core-sample / bedding-plane / field-stratigraphy booth** — a *stratum* is a distinct geological layer / bedding plane. Docs describe project context (CLAUDE.md, auto memory) as a sealed stratum between system and conversation that parallel shafts should share; instead the layer never gets its own cache_control bedding plane, so parallel sessions never share the project bed. Fonts **Fraunces** (display) + **Sora** (UI) + **IBM Plex Mono** (mono). Palette: shale `#1E262C`, ochre core `#C67B28`, slate `#4A5964`, core gold `#E4B25A`, clay `#D8C4A0`, rust `#8C3A16`, night `#101418`. Fresh trio. Completely different UI/UX/metaphor — system bedrock / project bed / missing bedding plane / session overburden / parallel shafts. NOT a manuscript parchment desk. NOT a cavalry lantern. NOT a Prague clock tower. NOT a herald's college. NOT a wax-tablet scriptorium. NOT an Elizabethan mask booth. NOT a confectionery kitchen. NOT a sleep ward. NOT a night-wall inhibitor. NOT a dictation recorder. NOT a household shrine. NOT a binder folio. NOT a theater tapestry. NOT a letterpress foundry. NOT a wax-cachet desk.

The core should stay **shared** (HOLD: seal the project-context bed with its own cache_control so parallel shafts share it). Instead the booth was **stratum** after a **layer-unsealed**.

Primary:

- [anthropics/claude-code#94417](https://github.com/anthropics/claude-code/issues/94417) (OPEN). Title: `CLAUDE.md / auto-memory block is never shared across sessions: it sits in messages[0] after the system breakpoint, with no cache_control of its own`. Labels: bug, has repro, area:core. Environment: Claude Code 2.1.270 (also 2.1.266); Windows 11; Opus 5; subscription (1h TTL); both CLI and desktop. Prompt-caching docs and the "Prompt caching is everything" post describe project context as its own cached layer, shared by parallel sessions in the same directory. In practice the block is emitted as the first content block of the first user message (`messages[0]`), with the user's prompt as a later block of that same message, and the next `cache_control` marker is on a session-context message that contains session-specific text. No request ever writes a cache entry ending at the CLAUDE.md / auto-memory block, so no other session can read it. Measured over 703 session starts: zero cross-session hits beyond the system prompt layer. 474 of those starts were warm (another session in the same directory active within 60 minutes). Stay off Tmesis/Vedette/Orloj/Brisure/Diptych/Vizard/Treacle/Somnus/Cresset/Dictabelt/Lemure/Cancellans/Arras/Stereotype/Cachet paradigms.

22:50 stratum: a geology / core-sample / bedding-plane / field-stratigraphy booth for #94417. CLAUDE.md / auto-memory sits in `messages[0]` after the system breakpoint with no `cache_control` of its own, so parallel sessions never share the project bed. Idle **shared** / seeded **stratum** / path **layer-unsealed**. Score stratum or admit shared.

Score stratum or admit shared.

Idle word: **shared** (HOLD: seal the project-context bed with its own cache_control so parallel shafts share it). HOLD aliases: layered, sealed, common. Seeded word: **stratum** / #94417 (the layer-unsealed path). Path word: **layer-unsealed**. Product score: **stratum**. Never idle contiguous / stationed / lasting / enrolled / single / pledged / brisk / cadence / verbatim / quiet / intact / cleared or seeded Tmesis / Vedette / Orloj / Brisure / Diptych / Vizard / Treacle / Somnus / Cresset / Dictabelt / Lemure / Cancellans / Arras or path names from those booths.

Phrase: **Score stratum or admit shared.**

- **shared** = IDLE HOLD: seal the project-context bed with its own cache_control so parallel shafts share it
- **stratum** = seeded path / product score: project bed after the breakpoint with no bedding plane
- **layer-unsealed** = path word: no cache entry ends at the CLAUDE.md / auto-memory block
- **layered** = HOLD alias: project bed stays a sealed system layer
- **sealed** = HOLD alias: the bedding plane stays sealed
- **common** = HOLD alias: parallel shafts share the project bed
- **no-breakpoint** = project context sits after the system breakpoint, not as its own sealed system block
- **messages-zero** = CLAUDE.md is the first content block of the first user message
- **cache-miss** = zero warm starts read beyond the system prompt layer
- **project-context** = 4–7k CLAUDE.md+MEMORY tokens never get their own cache entry
- **parallel-shafts** = 703 starts; 474 warm; zero cross-session hits beyond system[3]
- **94417** = issue number seed
- **landing** = geology / core-sample / bedding-plane / field-stratigraphy
- **has-repro** = published shape: Claude Code 2.1.270 · Windows 11 · Opus 5
- **cousins** = cite-only #94400 #93490 #93848 #91151 — do not rebuild; do not conflate
- **backups** = cite-only #94452 #94451 #94430 #94458 #93924 #93770 #93777 #94151 #94496 #94499 — do not auto-pick
- **fixtures** = system bedrock / project bed / missing plane
- **walk** = published idle shared → layer-unsealed → stratum
- **closed** = #94417 remains OPEN — cite only; not this booth

Verdicts: shared, stratum, layer-unsealed, layered, sealed, common, no-breakpoint, messages-zero, cache-miss, project-context, parallel-shafts, 94417, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **stratum** or already **shared**. Fixtures use the issue's published incident only. Request reconstructions from published text are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): project context is placed inside messages[0] after the system breakpoint without its own cache_control, so no cacheable prefix ends at that layer and parallel sessions never share it. Invite verify against #94417 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94417](https://github.com/anthropics/claude-code/issues/94417)
- Cousins: do NOT rebuild / do NOT conflate: #94400 (Cancellans — resume fork drops initial tools → cache miss), #93490 (Cachet — resume flattens array+cache_control), #93848 (Mojibake — encoding U+FFFD in CLAUDE.md), #91151 (resume cache collapses to system+tools floor). Docs claim parallel sessions share project context.
- Backups (data only; next focus only — do not auto-pick): #94452, #94451, #94430, #94458, #93924, #93770, #93777, #94151, #94496, #94499

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, area:core
- Environment: Claude Code 2.1.270 (also 2.1.266); Windows 11; Opus 5; subscription (1h TTL); CLI and desktop
- Docs layer table: System prompt → Project context (CLAUDE.md, auto memory) → Conversation
- Cache scope: parallel sessions in the same directory should build matching prefixes and read each other's cache
- Captured first-turn request: system[2]/system[3] have cache_control; messages[0].content[0] is CLAUDE.md + MEMORY.md with no cache_control; messages[1] has cache_control and a per-session UUID
- 703 session starts; 474 warm; zero hits beyond system[3]
- CLAUDE.md+MEMORY is roughly 4–7k tokens that would be byte-identical between sessions of the same directory

Problem found: LAYER-UNSEALED — project-context layer never sealed with its own cache_control → zero cross-session share of CLAUDE.md / auto-memory.

Why Stratum: A *stratum* is a distinct geological layer / bedding plane. Docs describe project context as a sealed stratum between system and conversation that parallel shafts should share; instead the layer never gets its own cache_control bedding plane. #94400 is a resume-fork tools-array drop — DIFFERENT. #93490 is a resume flatten — DIFFERENT. #93848 is encoding in CLAUDE.md — DIFFERENT. This booth is specifically **project-context layer never sealed with its own cache_control → zero cross-session share**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores layer-unsealed honesty (shared vs stratum) so operators can see the six-row evidence table and the missing bedding plane without needing a Claude session. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Put a cache_control marker on the CLAUDE.md block (`messages[0].content[0]`)
2. Or move the block to `system[4]` with its own marker, ahead of the first user prompt
3. Session-context message (`messages[1]`) stays per-session

## Why not a clone

This is specifically: **PROJECT-CONTEXT LAYER NEVER SEALED WITH ITS OWN CACHE_CONTROL → ZERO CROSS-SESSION SHARE OF CLAUDE.MD / AUTO-MEMORY. CLAUDE CODE 2.1.270; WINDOWS 11; 703 STARTS; 0/474 WARM HITS BEYOND SYSTEM[3].**

Novel paradigm: geology / core-sample / bedding-plane / field-stratigraphy / system bedrock / project bed / session overburden / parallel shafts — shale, ochre, slate. New issue, new paradigm (layer-unsealed), new UI/UX/fonts/colors, new scoring vocabulary. A core-sample booth, not a manuscript parchment desk, cavalry lantern, Prague clock tower, herald's college, wax-tablet scriptorium, Elizabethan mask atelier, confectionery kitchen, sleep clinic, night-wall inhibitor, voice recorder, household shrine, binder folio, or theater tapestry.

**NOT #94400** (Cancellans — resume fork drops initial tools → cache miss). DIFFERENT. Do not conflate.

**NOT #93490** (Cachet — resume flattens array+cache_control seal). DIFFERENT. Do not rebuild.

**NOT #93848** (Mojibake — encoding U+FFFD in CLAUDE.md). DIFFERENT. Do not rebuild.

**NOT #91151** (resume cache collapses to system+tools floor). DIFFERENT. Do not rebuild.

**NOT Cancellans/#94400** (deferred-delta / tools-array drop). Different defect. Do not reuse intact / Cancellans / deferred-delta.

**NOT Cachet/#93490** (resume flatten). Different defect. Do not reuse hit / Cachet / string-carrier.

**NOT Stereotype** (plugin freshness). Different defect.

**NOT Tmesis/#86198** (mid-inject slash splice). Different defect. Do not reuse contiguous / Tmesis / mid-inject.

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

**NOT Arras/#94348** (phantom approval card). Different defect. Do not reuse cleared / Arras / phantom-prompt.

**NOT Fetchling/#94065** (skill `$N` swap). Different defect.

**NOT Veto/palimpsest** (CLAUDE.md overlay booth). Different defect.

Live: https://hermes-playground-green.vercel.app/stratum/

```
node --test projects/stratum/stratum.test.mjs
node projects/stratum/stratum.mjs projects/stratum/data/stratum.json
```

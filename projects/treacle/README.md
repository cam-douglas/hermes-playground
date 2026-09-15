# Treacle

A **treacle / copper kettle / treacle-well / sticky-ladle confectionery booth** — *treacle* is British dark syrup; a treacle well is a sticky blessing that should ladle **briskly**. Instead a Windows PowerShell first pour clings ~150s before the kettle tips. Fonts **Cormorant Infant** (display) + **Nunito Sans** (UI) + **IBM Plex Mono** (mono). Palette: treacle brown `#4C1E0A`, copper `#C46A2B`, cream `#F8EBD4`, burnt sugar `#7A3514`, brass `#D4A84B`. Fresh trio. Completely different UI/UX/metaphor — copper jam kettle / treacle well / sticky ladle / wax-paper twist / enamel kitchen scale / molasses pour. NOT Somnus sleep clinic. NOT Cresset keep-awake hold. NOT Dictabelt voice fragments. NOT Lemure household shrine. NOT Cancellans binder. NOT Arras tapestry. NOT Frangible / Nameplate / Matryoshka.

The kettle should stay **brisk** (HOLD: PowerShell should start promptly like Bash). Instead the booth was **treacle** after a **streaming-stall**.

Primary:

- [anthropics/claude-code#94344](https://github.com/anthropics/claude-code/issues/94344) (OPEN). Title: `[BUG] Desktop app on Windows: every new PowerShell tool call waits ~154 s before the command starts (dialog, permissions and host IPC ruled out); Bash is instant (same as #57960, closed stale; still present on 2.1.270)`. Labels: bug, has repro, platform:windows, area:tools, area:permissions, area:desktop. Environment: Claude Desktop (Code tab) Windows Store 1.52386.6.0; Claude Code 2.1.270; Windows 11 Pro 10.0.26200; Windows PowerShell 5.1.26100.9444. Every NEW PowerShell tool call waits ~153–160s (median 154.1s / 1244 calls) from tool_use until the command starts. Bash median 2.7s. Permission dialog appears only AFTER the wait. Repeats 2–3s. Logs: `Streaming stall detected: 150.0s gap between events` and `permissionDecisionMs≈150717`. EncodedCommand AST parser ~1s, then ~150s silence, then the real command. Probe proves the wait is before command start. Stay off Somnus/Cresset/Dictabelt/Lemure/Cancellans/Arras/Frangible/Nameplate/Matryoshka paradigms.

15:50 treacle: a treacle / copper kettle / treacle-well / sticky-ladle confectionery booth for #94344. On Claude Desktop (Code tab) on Windows, every NEW PowerShell tool call waits ~153–160s (median 154.1s / 1244 calls) from tool_use until the command starts; Bash is ~2.7s; permission dialog after the wait; repeats 2–3s. Idle **brisk** / seeded **treacle** / path **streaming-stall**. Score treacle or admit brisk.

Score treacle or admit brisk.

Idle word: **brisk** (HOLD: PowerShell should start promptly like Bash). HOLD aliases: snap, ready, instant, bash-fast. Seeded word: **treacle** / #94344 (the streaming-stall path). Path word: **streaming-stall**. Product score: **treacle**. Never idle cadence / released / verbatim / quiet / intact or seeded somnus / cresset / dictabelt / lemure or path device-absent / hold-leak / segment-drop / orphan-tick.

Phrase: **Score treacle or admit brisk.**

- **brisk** = IDLE HOLD: PowerShell should start promptly like Bash
- **treacle** = seeded path / product score: first unique PowerShell waits ~154s before start
- **streaming-stall** = path word
- **snap** = HOLD alias: the first unique pour snaps off the ladle
- **ready** = HOLD alias: the kettle is ready before the twist
- **instant** = HOLD alias: first unique command starts now
- **bash-fast** = HOLD alias: Bash median 2.7s on the same hob
- **ast-parser** = EncodedCommand AST parser ~1s, then ~150s silence
- **first-call** = every NEW PowerShell shape waits 153–160s before start
- **repeat-cached** = same command verbatim returns in 2–3s
- **permission-dialog-late** = dialog appears only after the wait
- **stall-gap** = Streaming stall detected: 150.0s gap
- **permission-ms** = permissionDecisionMs≈150717
- **encoded-command** = powershell.exe -EncodedCommand AST parser
- **probe-before-start** = command itself is 119ms; the wait is before start
- **landing** = treacle / copper kettle / treacle-well / sticky-ladle
- **has-repro** = published shape: Desktop 1.52386.6.0 · Code 2.1.270 · Windows 11
- **cousins** = cite-only #57960 #94392 — do not rebuild; do not conflate
- **backups** = cite-only #94398 #94397 #94396 #94393 #94392 #86198 #94417 #93924 #93770 #93777 #94151 — do not auto-pick
- **fixtures** = bash-fast desk / sticky-ladle desk
- **walk** = published idle brisk → streaming-stall → treacle
- **closed** = #94344 remains OPEN — cite only; not this booth

Verdicts: brisk, treacle, streaming-stall, snap, ready, instant, bash-fast, ast-parser, first-call, repeat-cached, permission-dialog-late, stall-gap, permission-ms, encoded-command, probe-before-start, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **treacle** or already **brisk**. Fixtures use the issue's published incident only. Timing rows reconstructed from published transcripts are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): a Windows PowerShell permission/AST/streaming path stalls ~150s on first unique command shape; Bash path skips it. Invite verify against #94344 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94344](https://github.com/anthropics/claude-code/issues/94344)
- Cousins: do NOT rebuild / do NOT conflate: #57960 (same bug, closed stale — PowerShell permission prompt delayed ~2m35s), #94392 (headless `-p` exits with Tasks still running — CLI process exit vs PowerShell first-call stall). None of them is a new booth; #57960 is the same stall closed without a fix.
- Backups (data only; next focus only — do not auto-pick): #94398, #94397, #94396, #94393, #94392, #86198, #94417, #93924, #93770, #93777, #94151

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:windows, area:tools, area:permissions, area:desktop
- Environment: Claude Desktop (Code tab) Windows Store 1.52386.6.0; Claude Code 2.1.270; Windows 11 Pro 10.0.26200; Windows PowerShell 5.1.26100.9444; pwsh not installed; Git Bash works
- Every NEW PowerShell tool call waits ~153–160s (median 154.1s across 1244 calls) from tool_use until the command starts
- Bash on the same machine: median 2.7s across 10827 calls
- Permission dialog appears only AFTER the wait and is confirmed within seconds
- Same command repeated verbatim returns in 2–3s (cached)
- Logs: `Streaming stall detected: 150.0s gap between events`; `permissionDecisionMs≈150717`
- Same as #57960 (closed stale). Present 2.1.220–2.1.270
- Before the wait: EncodedCommand AST parser powershell.exe (~1s); then ~150s silence; then the real command
- Probe: tool_use 17:21:54, command start 17:24:30.453, finish 17:24:30.572 (119 ms) — the wait is before start
- 851 of 1244 PowerShell calls (68%) took longer than 60s; those add 37.8 hours over 121 sessions
- Reproduces in auto and manual mode, with and without sandbox, with and without permissions.allow
- One PreToolUse hook matcher `Bash|PowerShell` (timeout 10s) applies to both tools, so is not the cause

Problem found: STREAMING-STALL — Windows Desktop PowerShell first unique command waits ~154s before start, with the permission dialog after the wait.

Why Treacle: *Treacle* is British dark syrup; a treacle well should ladle briskly. A first unique PowerShell pour should snap off the copper kettle like Bash. Instead the sticky ladle hangs ~150s and the wax-paper twist (permission dialog) is tied only after the molasses has set. #57960 is the same bug closed stale — DIFFERENT ship, cite only. #94392 is a headless `-p` CLI process that exits while Tasks still run — DIFFERENT. This booth is specifically **Windows PowerShell first-call streaming-stall**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores streaming-stall honesty (brisk vs treacle) so operators can see the first-call wait without needing Claude Desktop. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A PowerShell tool call should start within a few seconds, like Bash on the same machine
2. Any permission dialog should appear immediately rather than after ~150s
3. First unique command shapes should not wait 153–160s before the command starts
4. The EncodedCommand AST parser finishing in ~1s should not be followed by 150s of silence

## Why not a clone

This is specifically: **DESKTOP APP ON WINDOWS: EVERY NEW POWERSHELL TOOL CALL WAITS ~154S BEFORE THE COMMAND STARTS. DESKTOP 1.52386.6.0 / CODE 2.1.270; MEDIAN 154.1S / 1244 CALLS; BASH 2.7S; PERMISSION DIALOG AFTER THE WAIT; REPEATS 2–3S; STREAMING STALL 150.0S; PERMISSIONDECISIONMS≈150717; AST PARSER THEN SILENCE; PROBE WAIT IS BEFORE START.**

Novel paradigm: treacle / copper kettle / treacle-well / sticky-ladle / wax-paper twist / enamel kitchen scale / molasses pour — cream, copper, burnt-sugar, brass, treacle-brown. New issue, new paradigm (streaming-stall), new UI/UX/fonts/colors, new scoring vocabulary. A Victorian confectionery booth, not a sleep clinic, night-wall inhibitor, voice recorder, household shrine, binder folio, or theater tapestry.

**NOT #57960** (same bug, closed stale). Same stall; closed without a fix. Cite only. Do not rebuild.

**NOT #94392** (headless `-p` exits with Tasks still running). Different defect. CLI process exit vs PowerShell first-call stall. Do not rebuild. Do not conflate.

**NOT Somnus/#94415** (Cowork cloud schedule `device_absent`). Different defect. Do not reuse cadence / Somnus / device-absent.

**NOT Cresset/#94420** (keep-awake hold-leak). Different defect. Do not reuse released / Cresset / hold-leak.

**NOT Dictabelt/#94406** (voice-dictation fragment path). Different defect. Do not reuse verbatim / Dictabelt / segment-drop.

**NOT Lemure/#94410** (orphan dispatcher ticks). Different defect. NOT household shrine. Do not reuse quiet / Lemure / orphan-tick.

**NOT Cancellans/#94400** (deferred-delta). Different defect. NOT binder folio. Do not reuse intact / Cancellans / deferred-delta.

**NOT Arras/#94348** (phantom approval card). Different defect. Do not reuse cleared / Arras / phantom-prompt.

**NOT Frangible/#94362** (chmod-failopen). Different defect. Do not reuse Frangible / chmod-failopen as the product.

**NOT Nameplate/#94349** (header-rename). Different defect. Do not reuse affixed / Nameplate / header-rename.

**NOT Matryoshka/#94350** (subst-nest). Different defect. Do not reuse unpacked / Matryoshka / subst-nest.

Live: https://hermes-playground-green.vercel.app/treacle/

```
node --test projects/treacle/treacle.test.mjs
node projects/treacle/treacle.mjs projects/treacle/data/treacle.json
```

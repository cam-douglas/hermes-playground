# Diptych

A **scriptorium / hinged wax-tablet / illuminated diptych booth** — a *diptych* is a hinged two-panel writing tablet / altarpiece. The session should leave **one** leaf (one reply). Brief mode injects a reminder that the first leaf was invisible, so the model opens a second leaf via `SendUserMessage` and the client hangs both. Fonts **Spectral** (display) + **Source Sans 3** (UI) + **JetBrains Mono** (mono). Palette: parchment `#E8DCC8`, iron-gall ink `#1C1914`, indigo `#24356B`, gilt `#C4A35A`, oxidized copper `#4A6B52`, rubric `#7A2E2E`. Fresh trio. Completely different UI/UX/metaphor — hinged tablet / left leaf / reminder rubric / right leaf / oxidized hinge / illuminated choir-book. NOT Vizard Elizabethan mask booth. NOT Treacle confectionery booth. NOT Somnus sleep clinic. NOT Cresset keep-awake hold. NOT Dictabelt voice fragments. NOT Lemure household shrine. NOT Cancellans binder. NOT Arras tapestry. NOT Diplopia subdirectory rooms (DIFFERENT product). NOT Fetchling / Eidolon / Hectograph / Stereotype / Caret doubling metaphors.

The tablet should stay **single** (HOLD: one reply per turn). Instead the booth was **diptych** after a **brief-echo**.

Primary:

- [anthropics/claude-code#94397](https://github.com/anthropics/claude-code/issues/94397) (OPEN). Title: `[BUG] Remote Control (mobile): every assistant reply is rendered twice — the brief-mode reminder makes the model restate it via SendUserMessage`. Labels: bug, has repro, platform:macos, platform:ios, area:agent-view. Environment: Claude desktop 1.52386.6 on macOS 26.6.2 Apple Silicon; Claude Code CLI 2.1.266; Claude mobile iOS local agent mode driven from the phone. Every assistant reply appears twice in a row; second copy a slight paraphrase. Both copies persist, survive reload, remain when reopened on desktop. Every substantive turn, every session. Stay off Vizard/Treacle/Somnus/Cresset/Dictabelt/Lemure/Cancellans/Arras/Diplopia paradigms.

18:50 diptych: a scriptorium / hinged wax-tablet / illuminated diptych booth for #94397. Remote Control (mobile) brief mode: every assistant reply rendered twice — plain text plus SendUserMessage restatement. Idle **single** / seeded **diptych** / path **brief-echo**. Score diptych or admit single.

Score diptych or admit single.

Idle word: **single** (HOLD: one reply per turn). HOLD aliases: once, solo, folio, simplex. Seeded word: **diptych** / #94397 (the brief-echo path). Path word: **brief-echo**. Product score: **diptych**. Never idle pledged / brisk / cadence / released / verbatim / quiet / intact or seeded vizard / treacle / somnus / cresset / dictabelt / lemure or path background-reset / streaming-stall / device-absent / hold-leak / segment-drop / orphan-tick.

Phrase: **Score diptych or admit single.**

- **single** = IDLE HOLD: one reply per turn; the diptych stays shut
- **diptych** = seeded path / product score: plain assistant text plus SendUserMessage restatement
- **brief-echo** = path word
- **once** = HOLD alias: one leaf, once
- **solo** = HOLD alias: a solo folio
- **folio** = HOLD alias: a single folio
- **simplex** = HOLD alias: one simplex panel
- **sendusermessage** = model restates via SendUserMessage {message: same answer, reworded}
- **restatement** = second copy is a slight paraphrase of the first
- **double-render** = client hangs both the plain text and the tool restatement
- **paraphrase-pair** = near-identical restatement after Sent/Stopped
- **reminder-injected** = You ended without calling SendUserMessage… brief mode… Call it now…
- **plain-not-hidden** = the reminder's premise (plain text hidden) does not hold
- **persisted-twice** = both copies survive reload and desktop reopen
- **every-turn** = every substantive turn, every session, not occasionally
- **mobile-brief** = Claude mobile iOS local agent mode, brief mode
- **94397** = issue number seed
- **landing** = scriptorium / hinged wax-tablet / illuminated diptych
- **has-repro** = published shape: desktop 1.52386.6 · CLI 2.1.266 · iOS · macOS 26.6.2
- **cousins** = cite-only #88897 #81080 #83229 — do not rebuild; do not conflate
- **backups** = cite-only #94396 #94393 #94392 #86198 #94417 #94452 #94451 #94430 #93924 #93770 #93777 #94151 — do not auto-pick
- **fixtures** = once desk / right-leaf desk / sendusermessage tool
- **walk** = published idle single → brief-echo → diptych
- **closed** = #94397 remains OPEN — cite only; not this booth

Verdicts: single, diptych, brief-echo, once, solo, folio, simplex, sendusermessage, restatement, double-render, paraphrase-pair, reminder-injected, plain-not-hidden, persisted-twice, every-turn, mobile-brief, 94397, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **diptych** or already **single**. Fixtures use the issue's published incident only. Transcript rows reconstructed from published text are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): brief-mode reminder + visible plain assistant text guarantees a doubled billed restatement via SendUserMessage on every substantive mobile Remote Control turn. Invite verify against #94397 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94397](https://github.com/anthropics/claude-code/issues/94397)
- Cousins: do NOT rebuild / do NOT conflate: #88897 (client-side RC duplicate render; slash-command pills + stuck spinner; single delivery — the opposite of #94397), #81080 (slash typed during pending bg notification renders twice), #83229 (Stop hook reprints corrected answer). None of them is this booth.
- Backups (data only; next focus only — do not auto-pick): #94396, #94393, #94392, #86198, #94417, #94452, #94451, #94430, #93924, #93770, #93777, #94151

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, platform:ios, area:agent-view
- Environment: Claude desktop 1.52386.6 on macOS 26.6.2 Apple Silicon; Claude Code CLI 2.1.266; Claude mobile iOS local agent mode driven from the phone
- Every assistant reply appears twice in a row; second copy a slight paraphrase of the first
- Not a streaming artifact: both copies are persisted in the session transcript, survive reload, and remain when reopened on desktop
- Happens on every substantive turn, every session, not occasionally
- Why (per issue): model ends turn with ordinary assistant text; a reminder is injected that in brief mode plain assistant text is hidden and only SendUserMessage reaches the user; model restates via SendUserMessage; client renders both, so the reminder's premise does not hold
- Transcript sequence every duplicated pair: (1) [assistant/text] full answer; (2) [user/text] reminder: You ended without calling SendUserMessage… brief mode… Call it now…; (3) [assistant/tool] SendUserMessage {"message": "<same answer, reworded>"}; (4) [user/result] "Message delivered to user."; (5) [assistant/text] No response requested
- Steps: drive session from mobile (brief mode) → send substantive message → see answer, Sent/Stopped separator, then near-identical restatement
- Expected: one reply per turn
- Suggested fix (cite only, do not implement): suppress plain assistant text as the reminder asserts, OR stop injecting the reminder and render plain text alone

Problem found: BRIEF-ECHO — Remote Control mobile brief mode renders every assistant reply twice because the model restates via SendUserMessage after a reminder that claimed the first leaf was invisible.

Why Diptych: A *diptych* is a hinged two-panel writing tablet / altarpiece — two leaves that should show related but distinct panels, or a single closed book. Here the session should leave **one** leaf. Brief mode injects a reminder that the first leaf was invisible, so the model opens a second leaf via SendUserMessage and the client hangs both. #88897 is client-side RC duplicate render with a single delivery — OPPOSITE. This booth is specifically **Remote Control mobile brief-mode double-render via SendUserMessage restatement**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores brief-echo honesty (single vs diptych) so operators can see the two-leaf hang without needing Claude mobile. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. One reply per turn
2. Brief mode should not hang both the plain assistant text and the SendUserMessage restatement
3. If the reminder asserts plain assistant text is hidden, the client should suppress it
4. If the client renders plain text, the reminder should not be injected

## Why not a clone

This is specifically: **REMOTE CONTROL (MOBILE) BRIEF MODE: EVERY ASSISTANT REPLY RENDERED TWICE — PLAIN TEXT PLUS SENDUSERMESSAGE RESTATEMENT. DESKTOP 1.52386.6 / CLI 2.1.266; IOS LOCAL AGENT; MACOS 26.6.2; BOTH COPIES PERSIST, SURVIVE RELOAD, REOPEN ON DESKTOP; EVERY SUBSTANTIVE TURN.**

Novel paradigm: scriptorium / hinged wax-tablet / left leaf / reminder rubric / right leaf / oxidized copper hinge / illuminated choir-book — parchment, iron-gall, indigo, gilt, oxidized copper. New issue, new paradigm (brief-echo), new UI/UX/fonts/colors, new scoring vocabulary. A scriptorium booth, not an Elizabethan mask atelier, confectionery kitchen, sleep clinic, night-wall inhibitor, voice recorder, household shrine, binder folio, or theater tapestry.

**NOT #88897** (client-side RC duplicate render; slash-command pills + stuck spinner; single delivery). Opposite of #94397. Cite only. Do not rebuild.

**NOT #81080** (slash command typed during pending bg notification renders twice). Different defect. Do not rebuild. Do not conflate.

**NOT #83229** (Stop hook reprints corrected answer). Different defect. Do not rebuild. Do not conflate.

**NOT Vizard/#94398** (background-reset to Opus 4.8). Different defect. Do not reuse pledged / Vizard / background-reset.

**NOT Treacle/#94344** (Windows PowerShell streaming-stall). Different defect. Do not reuse brisk / Treacle / streaming-stall.

**NOT Somnus/#94415** (Cowork cloud schedule `device_absent`). Different defect. Do not reuse cadence / Somnus / device-absent.

**NOT Cresset/#94420** (keep-awake hold-leak). Different defect. Do not reuse released / Cresset / hold-leak.

**NOT Dictabelt/#94406** (voice-dictation fragment path). Different defect. Do not reuse verbatim / Dictabelt / segment-drop.

**NOT Lemure/#94410** (orphan dispatcher ticks). Different defect. Do not reuse quiet / Lemure / orphan-tick.

**NOT Cancellans/#94400** (deferred-delta). Different defect. Do not reuse intact / Cancellans / deferred-delta.

**NOT Arras/#94348** (phantom approval card). Different defect. Do not reuse cleared / Arras / phantom-prompt.

**NOT Diplopia** (subdirectory rooms double-vision acuity). DIFFERENT product. Do not remask.

Live: https://hermes-playground-green.vercel.app/diptych/

```
node --test projects/diptych/diptych.test.mjs
node projects/diptych/diptych.mjs projects/diptych/data/diptych.json
```

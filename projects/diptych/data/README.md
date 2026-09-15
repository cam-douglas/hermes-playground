# Diptych fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94397 issue facts: Remote Control (mobile) brief mode renders every assistant reply twice — plain text plus SendUserMessage restatement. Both copies persist, survive reload, remain on desktop reopen. Every substantive turn. Score diptych or admit single.

Idle word: **single**. Path word: **brief-echo**. Seeded loss: **diptych**. Product: **diptych**. HOLD: **single**. ALARM: **diptych** / **brief-echo** / **sendusermessage**. Primary: [anthropics/claude-code#94397](https://github.com/anthropics/claude-code/issues/94397).

Fixtures record the published incident only. Transcript reconstructions are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `single.json` | single | Idle tablet. HOLD: one reply per turn. |
| `diptych.json` | diptych | Seeded #94397 path and product. ALARM: second leaf. |
| `94397.json` | diptych | Same seeded path under the issue number. |
| `brief-echo.json` | brief-echo | Path: plain text plus SendUserMessage restatement. |
| `once.json` | once | HOLD alias: one leaf, once. |
| `solo.json` | solo | HOLD alias: a solo folio. |
| `folio.json` | folio | HOLD alias: a single folio. |
| `simplex.json` | simplex | HOLD alias: one simplex panel. |
| `sendusermessage.json` | sendusermessage | Model restates via SendUserMessage. |
| `restatement.json` | restatement | Second copy is a slight paraphrase. |
| `double-render.json` | double-render | Client hangs both leaves. |
| `paraphrase-pair.json` | paraphrase-pair | Near-identical restatement after Sent/Stopped. |
| `reminder-injected.json` | reminder-injected | Brief-mode reminder: Call SendUserMessage now. |
| `plain-not-hidden.json` | plain-not-hidden | Reminder premise does not hold. |
| `persisted-twice.json` | persisted-twice | Both copies survive reload and desktop reopen. |
| `every-turn.json` | every-turn | Every substantive turn, every session. |
| `mobile-brief.json` | mobile-brief | Claude mobile iOS local agent, brief mode. |
| `landing.json` | landing | Scriptorium / hinged wax-tablet / illuminated diptych. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Once desk / right-leaf desk. |
| `walk.json` | walk | Published idle single → brief-echo → diptych. |
| `closed.json` | closed | #94397 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#88897 — client-side RC duplicate render; slash-command pills + stuck spinner; single delivery. OPPOSITE of #94397.

#81080 — slash command typed during pending bg notification renders twice. DIFFERENT.

#83229 — Stop hook reprints corrected answer. DIFFERENT.

#94397 is specifically: Remote Control mobile brief mode; model genuinely produces the answer a second time via SendUserMessage because told the first was invisible.

## Backups (cite only — do NOT auto-pick or build)

#94396 #94393 #94392 #86198 #94417 #94452 #94451 #94430 #93924 #93770 #93777 #94151

Drop any file onto `projects/diptych/index.html`. Buttons load the seeded path. The hinged tablet admits **single** / idle desk / #94397.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

# Scotoma fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93744 issue facts: a `/goal` instruction is stored only inside `<command-args>`, the Stop-condition evaluator appears not to read that field, Stop fires ~9 times, and the final firing declares the condition unachievable. Score scotoma or admit legible.

Idle word: **legible**. Path word: **command-args-blind**. Seeded loss: **scotomized**. Product: **scotoma**. HOLD: **legible**. ALARM: **scotomized** / **scotoma** / **command-args-blind** / **command-args-only** / **no-user-message-goal** / **stop-loop-nine**. Primary: [anthropics/claude-code#93744](https://github.com/anthropics/claude-code/issues/93744).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `legible.json` | legible | Idle chart. HOLD: evaluator reads the /goal instruction; field clear. |
| `hold.json` | hold | HOLD alias for idle legible. |
| `scotomized.json` | scotomized | Seeded #93744 path. ALARM: goal only in command-args; evaluator cannot confirm. |
| `scotoma.json` | scotoma | Product score for the perimetry booth. |
| `command-args-blind.json` | command-args-blind | Path: scotoma over the only field that holds the goal. |
| `command-args-only.json` | command-args-only | Instruction exists in exactly one place — `<command-args>`. |
| `no-user-message-goal.json` | no-user-message-goal | No separate user-message record carries the text. |
| `stop-loop-nine.json` | stop-loop-nine | Stop fired ~9 times; last firings produced no new work. |
| `unachievable-declare.json` | unachievable-declare | Final firing declared the condition structurally unachievable. |
| `slash-scan-present.json` | slash-scan-present | `/clear` at line 7, `/goal` at line 12. |
| `fail-open-hook.json` | fail-open-hook | Fail-open telemetry shim — not the cause. |
| `not-user-hook.json` | not-user-hook | Ruled out: not a user Stop hook. |
| `goal-readable.json` | goal-readable | HOLD alias: evaluator reads the instruction. |
| `field-clear.json` | field-clear | HOLD alias: no scotoma over command-args. |
| `evaluator-sees.json` | evaluator-sees | HOLD alias: Stop-condition evaluator confirms the goal. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #83266 #85182 #79981. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Exam ink / bowl slate / chart bone / fixation gold / carmine / teal. |
| `walk.json` | walk | Published idle legible → command-args-blind → scotomized → scotoma. |
| `goal-store.json` | (sample) | Published command-args-only store. |
| `slash-scan.json` | (sample) | Published slash-command scan. |
| `stop-firings.json` | (sample) | Published Stop loop (~9). |

## Cousins (cite only)

#83266 (/goal Stop hook skipped while a background task is live). #85182 (/goal stalls in plan mode because Stop cannot fire). #79981 (/goal case-insensitive). Different problems — this booth is the evaluator's scotoma over `<command-args>` while Stop keeps firing.

## Backups (cite only — do NOT auto-pick or build)

#93772 #93770 #93777 #93782 #93862 #93859 #93863 #93889 #93821 #93811 #93809 #93823

Drop any file onto `projects/scotoma/index.html`. Buttons load the seeded path. The living page admits **legible** / idle field / #93744.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

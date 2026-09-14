# Arras fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94348 issue facts: Desktop Code tab Auto mode — classifier-escalated tool calls never render an approval prompt (no card, no notification); the call sits running until the next chat message kills it as `toolDenialKind: "cancelled"` with a fake user-refusal string. Mid-session Bypass Permissions toggle writes config and shows Bypass selected while the CLI rejects. Score arras or admit cleared.

Idle word: **cleared**. Path word: **phantom-prompt**. Seeded loss: **arras**. Product: **arras**. HOLD: **cleared**. ALARM: **arras** / **phantom-prompt** / **cancelled**. Primary: [anthropics/claude-code#94348](https://github.com/anthropics/claude-code/issues/94348).

Fixtures record the published incident only. Phantom-prompt rows are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `cleared.json` | cleared | Idle aisle. HOLD: approval card surfaced. |
| `hold.json` | hold | HOLD alias for idle cleared. |
| `arras.json` | arras | Seeded #94348 path and product. ALARM: card hung; cancelled. |
| `94348.json` | arras | Same seeded path under the issue number. |
| `phantom-prompt.json` | phantom-prompt | Path: card never renders; next message cancels. |
| `draped-open.json` | draped-open | HOLD alias: tapestry drawn. |
| `card-shown.json` | card-shown | HOLD alias: approval card surfaced. |
| `prompt-visible.json` | prompt-visible | HOLD alias: prompt rendered. |
| `aisle-clear.json` | aisle-clear | HOLD alias: gallery wing open. |
| `curtain-raised.json` | curtain-raised | HOLD alias: arras up. |
| `cancelled.json` | cancelled | toolDenialKind cancelled; fake user-refusal. |
| `bypass-lie.json` | bypass-lie | UI shows Bypass on; CLI rejects. |
| `card-hidden.json` | card-hidden | No card, no notification. |
| `classifier-deny.json` | classifier-deny | Distinct: bracketed reason. |
| `next-message.json` | next-message | Next chat stabs the hung call. |
| `running-hang.json` | running-hang | Call sits running. |
| `landing.json` | landing | Theater / tapestry / curtain-aisle / gallery-wing. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Curtain aisle / phantom card. |
| `walk.json` | walk | Published idle cleared → phantom-prompt → arras. |
| `closed.json` | closed | #94348 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#92053 — cancelled on backgrounding/channel loss. DIFFERENT trigger.

#85588 — Auto silent classifier deny. DIFFERENT (bracketed reason).

#92817 — bypass mode not respected. DIFFERENT surface.

#86478 — bypass mode not respected. DIFFERENT surface.

#94348 is specifically: Desktop Auto approval card never renders; next message cancels as a fake user-refusal; Bypass toggle UI lies.

Do NOT pick #94336.

## Backups (cite only — do NOT auto-pick or build)

#93924 #93770 #93777 #94151

Drop any file onto `projects/arras/index.html`. Buttons load the seeded path. The cleared page admits **cleared** / idle aisle / #94348.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

# Solenoid fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93754 issue facts: Desktop Settings toggle flips but does nothing; even settings.json keys wait for first sendMessage. Score solenoid or admit engaged.

Idle word: **engaged**. Path word: **warm-before-message**. Seeded loss: **inert**. Product: **solenoid**. HOLD: **engaged**. ALARM: **inert** / **solenoid** / **warm-before-message** / **toggle-fidelity** / **first-message-arm** / **settings-json**. Primary: [anthropics/claude-code#93754](https://github.com/anthropics/claude-code/issues/93754).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `engaged.json` | engaged | Idle atelier. HOLD: RC arms at warm/focus, before any message. |
| `hold.json` | hold | HOLD alias for idle engaged. |
| `inert.json` | inert | Seeded #93754 path. ALARM: toggle/settings present; coil waits for first message. |
| `solenoid.json` | solenoid | Product score for the switchgear / solenoid-coil booth. |
| `warm-before-message.json` | warm-before-message | Path: arm-at-warm vs arm-at-first-message. |
| `toggle-fidelity.json` | toggle-fidelity | Settings toggle flips; new sessions still lack RC. |
| `first-message-arm.json` | first-message-arm | RC enables only after first sendMessage. |
| `settings-json.json` | settings-json | Direct ~/.claude/settings.json edit is the only write that sticks. |
| `armed.json` | armed | HOLD alias: RC armed at warm/focus. |
| `coil-pulled.json` | coil-pulled | HOLD alias: solenoid coil pulled at warm. |
| `bridge-ready.json` | bridge-ready | HOLD alias: bridge ready at warm. |
| `warm-armed.json` | warm-armed | HOLD alias: WarmLifecycle arms RC. |
| `mac-absent.json` | mac-absent | Mac idle sessions absent on mobile until first message. |
| `win-disconnected.json` | win-disconnected | Windows asleep sessions show disconnected. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #84502 #48949 #90768 #84994. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Slate steel / copper coil / navy void / mint / rust. |
| `walk.json` | walk | Published idle engaged → warm-before-message → inert → solenoid. |

## Cousins (cite only)

#84502 (headless Windows session-start). #48949 (remoteControlAtStartup not honored). #90768 (same-toggle fidelity). #84994 (mobile unreachable unless desktop keeps running).

## Backups (cite only — do NOT auto-pick or build)

#93751 #93744 #93772 #93770 #93777 #93782 #93821 #93811 #93809 #93823

Drop any file onto `projects/solenoid/index.html`. Buttons load the seeded path. The living page admits **engaged** / idle coil / #93754.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

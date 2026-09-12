# Simulacrum fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93751 issue facts: with no browser process, `list_connected_browsers` still reports connected and `navigate` returns success plus a tab id. Score simulacrum or admit tethered.

Idle word: **tethered**. Path word: **phantom-navigate**. Seeded loss: **hollow**. Product: **simulacrum**. HOLD: **tethered**. ALARM: **hollow** / **simulacrum** / **phantom-navigate** / **no-browser-process** / **list-connected-lie** / **navigate-false-success**. Primary: [anthropics/claude-code#93751](https://github.com/anthropics/claude-code/issues/93751).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `tethered.json` | tethered | Idle gallery. HOLD: real extension reachable; navigate drives a live window. |
| `hold.json` | hold | HOLD alias for idle tethered. |
| `hollow.json` | hollow | Seeded #93751 path. ALARM: success string + tab id with no process. |
| `simulacrum.json` | simulacrum | Product score for the hyperreality museum booth. |
| `phantom-navigate.json` | phantom-navigate | Path: Navigated stamp + tab id with nothing behind the glass. |
| `no-browser-process.json` | no-browser-process | Get-Process shows no msedge/chrome; list still reports connected. |
| `list-connected-lie.json` | list-connected-lie | list reports isLocal: true with advancing connectedAt. |
| `navigate-false-success.json` | navigate-false-success | navigate returns Navigated and does nothing. |
| `tab-id-hollow.json` | tab-id-hollow | Real tab id with no tab and no window. |
| `switch-browser-disagree.json` | switch-browser-disagree | list returns one; switch says none. |
| `document-idle-hang.json` | document-idle-hang | get_page_text hangs ~45s; "site is slow". |
| `reconnect-not-durable.json` | reconnect-not-durable | Manual reconnect works once; silent failure ~90m later. |
| `not-78096.json` | not-78096 | Not the stale-name cache; no browser behind it. |
| `reachable.json` | reachable | HOLD alias: extension currently reachable. |
| `live-window.json` | live-window | HOLD alias: navigate drives a live window. |
| `process-present.json` | process-present | HOLD alias: a real browser process is running. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #78096. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Museum charcoal / wax-cream / phosphor / violet / brass / amber. |
| `walk.json` | walk | Published idle tethered → phantom-navigate → hollow → simulacrum. |

## Cousins (cite only)

#78096 (stale-name / cache on a living browser). Different problem — here there is no browser behind the registration.

## Backups (cite only — do NOT auto-pick or build)

#93754 #93744 #93772 #93770 #93777 #93782 #93821 #93811 #93809 #93823

Drop any file onto `projects/simulacrum/index.html`. Buttons load the seeded path. The living page admits **tethered** / idle glass / #93751.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

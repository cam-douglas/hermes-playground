# Attaint fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93821 issue facts: cyber safeguard false-positives on closed-source release engineering silently reroute Fable 5.1 to Opus 4.8; one flag contaminates the session so `/model fable` cannot restore it. Score attaint or admit unattainted.

Idle word: **unattainted**. Path word: **session-attainder**. Seeded loss: **attaint**. Product: **attaint**. HOLD: **unattainted**. ALARM: **attaint** / **session-attainder** / **opus-reroute** / **flag-contaminates**. Primary: [anthropics/claude-code#93821](https://github.com/anthropics/claude-code/issues/93821).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `unattainted.json` | unattainted | Idle court roll. HOLD: Fable 5.1 held; lineage clean. |
| `hold.json` | hold | HOLD alias for idle unattainted. |
| `attaint.json` | attaint | Seeded #93821 path and product. ALARM: blood stained. |
| `session-attainder.json` | session-attainder | Path: one flag contaminates the session. |
| `blood-clear.json` | blood-clear | HOLD alias: no corruption of blood. |
| `lineage-open.json` | lineage-open | HOLD alias: later turns unstained. |
| `fable-held.json` | fable-held | HOLD alias: Fable 5.1 remains selected. |
| `writ-clean.json` | writ-clean | HOLD alias: writ of the session unstained. |
| `roll-open.json` | roll-open | HOLD alias: court roll unsealed. |
| `opus-reroute.json` | opus-reroute | Fable 5.1 silently rerouted to Opus 4.8. |
| `flag-contaminates.json` | flag-contaminates | One flag contaminates the whole session. |
| `own-release-eng.json` | own-release-eng | Strip / minify / rename / leak-check own build. |
| `symbol-strip.json` | symbol-strip | Strip debug names from own binary. |
| `model-fable-fails.json` | model-fable-fails | `/model fable` does not restore Fable 5.1. |
| `cyber-false-positive.json` | cyber-false-positive | Safeguard keys on own-build packaging vocabulary. |
| `landing.json` | landing | Court-roll landing / wax-seal sill. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #63751. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Parchment / deep ink / court crimson / wax gold / oak / blot. |
| `walk.json` | walk | Published idle unattainted → session-attainder → attaint. |

## Cousins (cite only)

anthropics/claude-code#63751 (same class, open since 2026-05-29). Do not rebuild as a separate booth.

## Backups (cite only — do NOT auto-pick or build)

#93772 #93770 #93777 #93811 #93924 #93925 #93954 #93967 #93957 #93823

Drop any file onto `projects/attaint/index.html`. Buttons load the seeded path. The living page admits **unattainted** / idle court roll / #93821.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

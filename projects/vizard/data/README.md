# Vizard fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94398 issue facts: Remote Control (mobile) — a model chosen on an existing session does not survive backgrounding. Reopen and the indicator reads Opus 4.8 again (every time). Desktop 1.52386.6; CLI 2.1.266; iOS; macOS 26.6.2. Score vizard or admit pledged.

Idle word: **pledged**. Path word: **background-reset**. Seeded loss: **vizard**. Product: **vizard**. HOLD: **pledged**. ALARM: **vizard** / **background-reset** / **opus-fallback**. Primary: [anthropics/claude-code#94398](https://github.com/anthropics/claude-code/issues/94398).

Fixtures record the published incident only. Lifecycle reconstructions are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `pledged.json` | pledged | Idle looking-glass. HOLD: session model choice survives lifecycle. |
| `vizard.json` | vizard | Seeded #94398 path and product. ALARM: the mask slips. |
| `94398.json` | vizard | Same seeded path under the issue number. |
| `background-reset.json` | background-reset | Path: background→foreground resets the chip to Opus 4.8. |
| `held.json` | held | HOLD alias: the chosen face stays held. |
| `chosen.json` | chosen | HOLD alias: the model chosen for this session stays. |
| `sticky-model.json` | sticky-model | HOLD alias: the chip stays on the pledged model. |
| `retained.json` | retained | HOLD alias: the session record keeps the choice. |
| `masked-true.json` | masked-true | HOLD alias: the vizard stays on the pledged face. |
| `opus-fallback.json` | opus-fallback | Indicator reads Opus 4.8 after reopen. |
| `existing-session.json` | existing-session | Session already running; not a spawn-time chip miss. |
| `explicit-choice.json` | explicit-choice | Model selected explicitly for this session. |
| `no-turn-in-flight.json` | no-turn-in-flight | No turn between the correct state and the wrong one. |
| `background-foreground.json` | background-foreground | Only event is background then reopen. |
| `every-time.json` | every-time | Repeated across several sessions on 2026-09-14. |
| `desktop-too.json` | desktop-too | Same reset later observed on desktop. |
| `ios-mobile.json` | ios-mobile | Claude mobile app (iOS) with a macOS host. |
| `landing.json` | landing | Vizard / half-mask / masque-ball / looking-glass. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Pledged desk / background-reset desk / opus-fallback chip. |
| `walk.json` | walk | Published idle pledged → background-reset → vizard. |
| `closed.json` | closed | #94398 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#89358 — pinned model overridden mid-session by a conservative switch (Linux). DIFFERENT.

#90670 — new-session model chip ignored at spawn. DIFFERENT (session here is already running).

Changeling/#93757 — reconnect reinjects the global default. DIFFERENT (not this booth).

#94398 is specifically: Remote Control mobile background lifecycle reset to Opus 4.8.

## Backups (cite only — do NOT auto-pick or build)

#94397 #94396 #94393 #94392 #86198 #94417 #93924 #93770 #93777 #94151

Drop any file onto `projects/vizard/index.html`. Buttons load the seeded path. The looking-glass admits **pledged** / idle desk / #94398.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

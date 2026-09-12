# Scotia fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93764 issue facts: DECSTBM renderer leaves 2–3 blank rows under the prompt on Linux VTE / Black Box. Score scotia or admit flush.

Idle word: **flush**. Path word: **decstbm-undershoot**. Seeded loss: **scotiated**. Product: **scotia**. HOLD: **flush**. ALARM: **scotiated** / **scotia** / **decstbm-undershoot** / **blank-band** / **vte-scroll** / **tengu-marlin-porch**. Primary: [anthropics/claude-code#93764](https://github.com/anthropics/claude-code/issues/93764).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `flush.json` | flush | Idle atelier. HOLD: bottom block ends on last terminal row; no hollow gap. |
| `hold.json` | hold | HOLD alias for idle flush. |
| `scotiated.json` | scotiated | Seeded #93764 path. ALARM: 2–3 blank rows under bottom block on Linux VTE with DECSTBM on. |
| `scotia.json` | scotia | Product score for the column-molding / shadow-gap booth. |
| `decstbm-undershoot.json` | decstbm-undershoot | Path: reserved chrome taller than drawn; extra rows cleared. |
| `blank-band.json` | blank-band | 2–3 empty rows under the bottom block; stay empty forever. |
| `vte-scroll.json` | vte-scroll | VTE(8401) Black Box Linux scroll-region path. |
| `tengu-marlin-porch.json` | tengu-marlin-porch | Remote gate enables DECSTBM; env unset; no disable. |
| `seated.json` | seated | HOLD alias: bottom block seated on the last row. |
| `last-row.json` | last-row | HOLD alias: last terminal row is the last drawn row. |
| `mac-flush.json` | mac-flush | HOLD alias: macOS kitty/iTerm/Terminal.app stay flush. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #4136 (closed stale) and #83660 (tmux unused row). |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Limestone / scotia hollow / DECSTBM brackets / VTE chip / blank-row void. |
| `walk.json` | walk | Published idle flush → decstbm-undershoot → scotiated → scotia. |

## Cousins (cite only)

#4136 (closed stale — blank space bottom Linux). #83660 (one unused row under tmux).

## Backups (cite only — do NOT auto-pick or build)

#93754 #93744 #93782 #93821 #93811 #93809 #93751 #93772 #93770 #93777 #93823

Drop any file onto `projects/scotia/index.html`. Buttons load the seeded path. The living page admits **flush** / idle column / #93764.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

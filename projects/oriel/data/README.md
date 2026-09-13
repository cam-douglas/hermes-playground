# Oriel fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93809 issue facts: on Claude Code 2.1.268 in the macOS Desktop app, expand/pop-out or maximised plan windows do not reflow plan text to the available width. The oriel bay opens wide; the manuscript stays in a fixed column. Score oriel or admit reflowed.

Idle word: **reflowed**. Path word: **plan-no-reflow**. Seeded loss: **oriel**. Product: **oriel**. HOLD: **reflowed**. ALARM: **oriel** / **plan-no-reflow** / **pop-out** / **empty-margin**. Primary: [anthropics/claude-code#93809](https://github.com/anthropics/claude-code/issues/93809).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `reflowed.json` | reflowed | Idle bay. HOLD: plan text uses available window width. |
| `hold.json` | hold | HOLD alias for idle reflowed. |
| `oriel.json` | oriel | Seeded #93809 path and product. ALARM: fixed column. |
| `plan-no-reflow.json` | plan-no-reflow | Path: plan text does not reflow to window width. |
| `spanned.json` | spanned | HOLD alias: manuscript spans the bay. |
| `sashed.json` | sashed | HOLD alias: sash open. |
| `bayed.json` | bayed | HOLD alias: projecting bay used in full. |
| `projected.json` | projected | HOLD alias: bay projects and manuscript follows. |
| `fenestrated.json` | fenestrated | HOLD alias: leaded panes admit the full width. |
| `width-fit.json` | width-fit | HOLD alias: plan text width-fits the window. |
| `fixed-column.json` | fixed-column | Plan manuscript stays in a fixed / narrow column. |
| `empty-margin.json` | empty-margin | Large empty margin remains on the right. |
| `pop-out.json` | pop-out | Expand/pop-out for a plan: text does not reflow. |
| `maximised.json` | maximised | Maximised within the app: window grows; manuscript does not. |
| `macos-desktop.json` | macos-desktop | Claude Code 2.1.268 on macOS Desktop app. |
| `plan-window.json` | plan-window | The plan window surface (pop-out or maximised). |
| `landing.json` | landing | Plan window landing / stone sill of the bay. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #62543 #57749. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Stone / parchment / mullion ink / amber glass / sash green / empty-margin blush. |
| `walk.json` | walk | Published idle reflowed → plan-no-reflow → oriel. |

## Cousins (cite only)

#62543 CLOSED as duplicate/not-planned (Plan side panel: content stops expanding at a fixed width). #57749 CLOSED feature (Plan mode panel: use available window width on Desktop — Windows-labeled but same narrow-column family). Do not rebuild as separate booths.

## Backups (cite only — do NOT auto-pick or build)

#93772 #93770 #93777 #93821 #93811 #93924 #93925 #93954 #93967 #93957

Drop any file onto `projects/oriel/index.html`. Buttons load the seeded path. The living page admits **reflowed** / idle bay / #93809.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

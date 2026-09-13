# Cartouche fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93772 issue facts: "Draw a diagram to explain X" defaults to a section-summary poster instead of the diagram type X calls for. Ask-for-diagram on a pipeline data-flow doc produced a three-column heading-box infographic — twice, including after regeneration. Score cartouche or admit diagrammed.

Idle word: **diagrammed**. Path word: **section-poster**. Seeded loss: **cartouche**. Product: **cartouche**. HOLD: **diagrammed**. ALARM: **cartouche** / **section-poster** / **heading-boxes** / **infographic-restate**. Primary: [anthropics/claude-code#93772](https://github.com/anthropics/claude-code/issues/93772).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `diagrammed.json` | diagrammed | Idle temple relief. HOLD: nodes+edges inferred from subject. |
| `hold.json` | hold | HOLD alias for idle diagrammed. |
| `cartouche.json` | cartouche | Seeded #93772 path and product. ALARM: oval sealed. |
| `section-poster.json` | section-poster | Path: false door slams to heading columns. |
| `nodal.json` | nodal | HOLD alias: nodes present. |
| `edged.json` | edged | HOLD alias: edges present. |
| `dataflow.json` | dataflow | HOLD alias: flow inferred from subject. |
| `flow-inferred.json` | flow-inferred | HOLD alias: type inferred from subject matter. |
| `type-matched.json` | type-matched | HOLD alias: rendered kind matches the subject. |
| `heading-boxes.json` | heading-boxes | Three-column colored boxes restating titles. |
| `infographic-restate.json` | infographic-restate | Ask-for-diagram produced a section-summary infographic. |
| `prose-duplicate.json` | prose-duplicate | Poster duplicated the adjacent prose. |
| `no-independent-info.json` | no-independent-info | Poster carried no independent information. |
| `regenerate-same.json` | regenerate-same | Same wrong poster after a regeneration. |
| `type-unasked.json` | type-unasked | Did not infer dataflow; did not ask. |
| `landing.json` | landing | Temple-relief landing / gold oval sill. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | None — prefer none over inventing. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Limestone / lapis / gold leaf / ink / cartouche stroke / poster blush / Nile teal. |
| `walk.json` | walk | Published idle diagrammed → section-poster → cartouche. |

## Cousins (cite only)

None. Nearby mermaid-renderer issues are a different family. Prefer none over inventing.

## Backups (cite only — do NOT auto-pick or build)

#93770 #93777 #93811 #93924 #93925 #93954 #93967 #93957 #93989 #93987

Drop any file onto `projects/cartouche/index.html`. Buttons load the seeded path. The living page admits **diagrammed** / idle relief / #93772.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

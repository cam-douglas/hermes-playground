# Palinode fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92998 issue facts: MEMORY.md loads up to 200 lines / ~25,000 bytes; entries append at the bottom; overflow truncates from the bottom so newest supersessions are shed unretracted while the superseded claim stays loaded. Write reports success; loss surfaces as a later-session warning. Age-prune at a 30-day floor returned 0 eligible. Byte cap binds before the line cap. Score unretracted or admit emended.

Idle word: **emended**. Seeded word: **unretracted**. Path word: **palinoded**. HOLD: **emended** / **hold**. ALARM: **unretracted** / **palinoded** / **bottom-truncate** / **newest-discarded** / **supersession-lost** / **write-reports-success** / **later-session-warning** / **byte-cap-25k** / **line-cap-200** / **age-prune-zero** / **frontmatter-lost** / **truncate-from-top** / **budget-surface** / **has-repro** / **cousins** / **fixtures** / **chips** / **fingerprints**. Primary: [anthropics/claude-code#92998](https://github.com/anthropics/claude-code/issues/92998).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Oxbow (stranded meander). Not Recension/#92949 (auto-compact last-prompt snapshot). Not Setoff (MEMORY.md on subagent first request). Not Palimpsest (scraped undertext). Not Ephemera/#92090. Not Ferrule/#92968. Not leftover woodworking / mm-slider.

| File | Verdict | What it scores |
|---|---|---|
| `emended.json` | emended | Idle booth. HOLD: truncate from the top; newest corrections retained. |
| `unretracted.json` | unretracted | Seeded #92998 path. ALARM: bottom truncation sheds newest supersessions. |
| `92998.json` | unretracted | Primary fixture alias for #92998. |
| `palinoded.json` | palinoded | Path word: a palinode that sheds the newest retraction. |
| `hold.json` | hold | HOLD alias: newest corrections retained. |
| `walk.json` | unretracted | Published append → bottom truncate → newest shed → later warning. |
| `bottom-truncate.json` | bottom-truncate | Overflow truncates from the bottom. |
| `newest-discarded.json` | newest-discarded | Most recently written entries discarded. |
| `supersession-lost.json` | supersession-lost | Correction discarded; superseded text stays loaded. |
| `write-reports-success.json` | write-reports-success | Write reports success; no error at write time. |
| `later-session-warning.json` | later-session-warning | Loss surfaces only as a later-session warning. |
| `byte-cap-25k.json` | byte-cap-25k | ~25,000 byte ceiling binds first. |
| `line-cap-200.json` | line-cap-200 | 200-line load cap. |
| `age-prune-zero.json` | age-prune-zero | 30-day floor returned 0 eligible. |
| `frontmatter-lost.json` | frontmatter-lost | Memory file lost frontmatter; still occupies an index line. |
| `truncate-from-top.json` | truncate-from-top | Ranked ask: truncate from the top, not the bottom. |
| `budget-surface.json` | budget-surface | Ranked ask: surface budget after write. |
| `has-repro.json` | has-repro | Concrete silo: 199 memories at 201/200 lines. |
| `cousins.json` | cousins | Cite-only #25006 #33143 #38452 #39811 #57574 CLOSED. |
| `fixtures.json` | fixtures | Row list for the palinode booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for emended vs unretracted. |

Drop any file onto `projects/palinode/index.html`. Buttons load the seeded path. The living page admits **emended** / idle booth / #92998.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

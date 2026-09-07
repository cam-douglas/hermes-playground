# Cribble fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92684 issue facts: `sandbox.filesystem.denyWrite` silently ignores mid-path wildcards on Linux. Score porous or admit cribbed.

Idle word: **porous**. Seeded word: **cribbed**. HOLD: **cribbed**. ALARM: **porous** / **literal-eacces** / **trail-erofs** / **mid-star2-writable** / **mid-star1-writable** / **denyread-mid-enforced** / **status-shows-active** / **warning-misstates-read** / **tool-vs-bash-asymmetry** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92684](https://github.com/anthropics/claude-code/issues/92684).

Fixtures record the published incident (literal EACCES; trailing /** EROFS; mid-path `/**/` and `/*/` WRITABLE; denyRead mid-path enforced; `/status` still shows the rule; generic warning overstates Read / omits denyWrite; tool-vs-Bash asymmetry). No live session. No secrets. No exploit payloads. No sandbox bypass instructions.

| File | Verdict | What it scores |
|---|---|---|
| `porous.json` | porous | Idle cribble. ALARM: mid-path denyWrite silently dropped. |
| `cribbed.json` | cribbed | Seeded hold. Deny correctly enforced. |
| `92684.json` | porous | Primary fixture alias for #92684. |
| `literal-eacces.json` | literal-eacces | Literal denyWrite → blocked:EACCES. |
| `trail-erofs.json` | trail-erofs | Trailing /** denyWrite → blocked:EROFS. |
| `mid-star2-writable.json` | mid-star2-writable | `/path/**/file` denyWrite → WRITABLE. |
| `mid-star1-writable.json` | mid-star1-writable | `/path/*/file` denyWrite → WRITABLE. |
| `denyread-mid-enforced.json` | denyread-mid-enforced | Identical mid-path denyRead → blocked:EACCES. |
| `status-shows-active.json` | status-shows-active | Dropped rule still listed in `/status`. |
| `warning-misstates-read.json` | warning-misstates-read | Warning says Edit/Read ignored; overstates Read. |
| `tool-vs-bash-asymmetry.json` | tool-vs-bash-asymmetry | Tool-layer deny vs Bash subprocess writable. |
| `cousins.json` | cousins | Cite-only #84863 / #74081 / #89762 / #81266 / #85761 / #86054. Primary stays #92684. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the cribble desk. |

Drop any file onto `projects/cribble/index.html` or paste the JSON. The living page admits **porous** / mid-path denyWrite WRITABLE / #92684.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

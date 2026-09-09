# Flashpan fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93015 issue facts: scheduled tasks stamp `lastRunAt` but never launch a session. Session transcripts live at `~/.claude/projects/<project>/<uuid>.jsonl`; only birth time (`stat -f '%SB'`) counts real launches. Score flashed or admit primed.

Idle word: **primed**. Seeded word: **flashed**. Path word: **flashpanned**. HOLD: **primed** / **hold**. ALARM: **flashed** / **flashpanned** / **lastRunAt-false-signal** / **zero-births** / **stamp-cluster** / **run-now-same-fail** / **birth-time-not-mtime** / **no-failed-run-state** / **silent-healthy-registry** / **restart-window-only** / **has-repro** / **cousins** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#93015](https://github.com/anthropics/claude-code/issues/93015).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Secateurs/#92979 (Read silent partial). Not Palinode/#92998 (MEMORY.md bottom truncation). Not Ferrule/#92968 (Desktop hardcoded 53280). Not leftover woodworking / mm-slider.

| File | Verdict | What it scores |
|---|---|---|
| `primed.json` | primed | Idle booth. HOLD: lastRunAt only with a real session birth. |
| `flashed.json` | flashed | Seeded #93015 path. ALARM: lastRunAt stamps; no session born. |
| `93015.json` | flashed | Primary fixture alias for #93015. |
| `flashpanned.json` | flashpanned | Path word: damp powder still believed fired. |
| `hold.json` | hold | HOLD alias: honest stamp or loud failed-run. |
| `walk.json` | walk | Published lastRunAt-false-signal → zero-births → stamp-cluster → run-now-same-fail → no-failed-run-state → silent-healthy-registry → restart-window-only → birth-time-not-mtime. |
| `lastRunAt-false-signal.json` | lastRunAt-false-signal | Stamp is the strongest false signal. |
| `zero-births.json` | zero-births | 6–7 Sep and 9 Sep: 0 births while lastRunAt moved. |
| `stamp-cluster.json` | stamp-cluster | Differently-scheduled tasks stamp within ~0.43s. |
| `run-now-same-fail.json` | run-now-same-fail | Manual Run now launches nothing. |
| `birth-time-not-mtime.json` | birth-time-not-mtime | Only `stat -f '%SB'` counts real launches. |
| `no-failed-run-state.json` | no-failed-run-state | No error, no notification, no failed-run. |
| `silent-healthy-registry.json` | silent-healthy-registry | enabled true, nextRunAt sensible, lastRunAt fresh. |
| `restart-window-only.json` | restart-window-only | 8 Sep: 6 births within 25 minutes of restart. |
| `has-repro.json` | has-repro | Birth-time census + stamp cluster + Run now. |
| `cousins.json` | cousins | Cite-only #91527 #80671 #92429 #89936 #90215 #72195 #92972. |
| `fixtures.json` | fixtures | Row list for the flashpan booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for primed vs flashed. |

Drop any file onto `projects/flashpan/index.html`. Buttons load the seeded path. The living page admits **primed** / idle booth / #93015.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

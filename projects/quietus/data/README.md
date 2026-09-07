# Quietus fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92716 issue facts: `SubagentStop` does not fire when a background subagent is killed via `TaskStop` or by "Exit and stop tasks". Score unrung or admit quieted.

Idle word: **unrung**. Seeded word: **quieted**. HOLD: **quieted**. ALARM: **unrung** / **start-without-stop** / **taskstop-silent** / **exit-stop-silent** / **control-completion-tolls** / **debug-file-missing** / **registry-cleared** / **pairing-drift** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92716](https://github.com/anthropics/claude-code/issues/92716).

Fixtures record the published incident (TaskStop silent; Exit-and-stop silent; control completion still tolls with `last_assistant_message`; `--debug-file` missing the kill-path line; registry cleared; pairing drifts). No live session. No secrets. No exploit payloads. No instructions to bypass hooks or sandbox.

| File | Verdict | What it scores |
|---|---|---|
| `unrung.json` | unrung | Idle quietus. ALARM: kill path never rings SubagentStop. |
| `quieted.json` | quieted | Seeded hold. Every kill path rings SubagentStop. |
| `92716.json` | unrung | Primary fixture alias for #92716. |
| `start-without-stop.json` | start-without-stop | SubagentStart without a matching SubagentStop. |
| `taskstop-silent.json` | taskstop-silent | TaskStop kill never fires SubagentStop. |
| `exit-stop-silent.json` | exit-stop-silent | Exit and stop tasks never fires SubagentStop. |
| `control-completion-tolls.json` | control-completion-tolls | Normal completion still fires SubagentStop. |
| `debug-file-missing.json` | debug-file-missing | `--debug-file` has no SubagentStop line for the killed agent. |
| `registry-cleared.json` | registry-cleared | Agent gone from registry; only the hook is missing. |
| `pairing-drift.json` | pairing-drift | Start/Stop pairing drifts after every kill. |
| `cousins.json` | cousins | Cite-only #78463 / #44971 / #82249. Primary stays #92716. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the quietus desk. |

Drop any file onto `projects/quietus/index.html` or paste the JSON. The living page admits **unrung** / kill-path silent SubagentStop / #92716.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

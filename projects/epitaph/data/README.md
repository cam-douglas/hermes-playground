# Epitaph fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92952 issue facts: when a subagent starts a background Bash (`run_in_background: true`) and ends its turn to wait, the parent immediately receives a `<task-notification>` with `status=completed` and a summary saying the agent "finished". The agent has not finished. Score epitaphed or admit parked.

Idle word: **parked**. Path word: **epitaphed**. Seeded late-true-complete: **inscribed**. HOLD: **parked**. ALARM: **epitaphed** / **inscribed** / **live-child** / **false-finished** / **parking-result** / **note-contradicts** / **usage-rise** / **task-stop** / **contending-rebuild** / **status-check** / **filler-calls** / **cousins** / **before-after** / **fixtures**. Primary: [anthropics/claude-code#92952](https://github.com/anthropics/claude-code/issues/92952).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No Desktop automation. No patch to anthropics/claude-code. Not Oubliette/#92095 (void against a cold parent). Not Recension/#92949 (last-prompt MEMORY witness). Not Mirage/#92920. Not Remora/#92934. Not Cenotaph (vacant monument — different older product).

| File | Verdict | What it scores |
|---|---|---|
| `parked.json` | parked | Idle bench. HOLD: honest parked status with a live child. |
| `epitaphed.json` | epitaphed | Seeded #92952 path. ALARM: first completed while the child is live. |
| `92952.json` | epitaphed | Primary fixture alias for #92952. |
| `inscribed.json` | inscribed | Second completed after the real finish; 104094 / 16. |
| `timeline.json` | epitaphed | Published park / false-complete / re-invoke / true-complete clocks. |
| `live-child.json` | live-child | Background Bash still running; sleep 150 / 109s. |
| `false-finished.json` | false-finished | `status=completed` and summary word finished. |
| `parking-result.json` | parking-result | Parking utterance framed as a result. |
| `note-contradicts.json` | note-contradicts | Note denies the live child. |
| `usage-rise.json` | usage-rise | 99124→104094 / 12→16. |
| `task-stop.json` | task-stop | TaskStop ~2s after reported success. |
| `contending-rebuild.json` | contending-rebuild | Two writers, one clean. |
| `status-check.json` | status-check | TaskOutput `block=false` headed DEPRECATED. |
| `filler-calls.json` | filler-calls | Seven filler calls over 35 seconds. |
| `cousins.json` | cousins | Cite-only #88001 #91503 #76594 #92095 — do not clone. |
| `before-after.json` | before-after | Before epitaphed; after expected parked. |
| `fixtures.json` | fixtures | Row list for the memorial bench. |

Drop any file onto `projects/epitaph/index.html`. Buttons load the seeded path. The living page admits **parked** / idle bench / #92952.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

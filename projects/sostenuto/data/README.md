# Sostenuto fixtures

Diagnostic JSON only. No payloads. No live CoreAudio. No microphone access. Encoded from #92360 issue facts: holding Space for hold-to-talk voice dictation permanently freezes the entire TUI; footer stuck on "keep holding…"; no keystrokes processed; Ctrl+C does not recover; only killing the process works. `sample` shows the main thread blocked in a synchronous CoreAudio path with no timeout while opening the microphone: `AudioUnitSetProperty` → `AudioDeviceGetProperty` → `HALPlugIn::ObjectHasProperty` (bundled native audio `.node` module). Observed >10 minutes, 0% CPU, state S. Same thread services terminal input, so the TUI dies with the HAL.

Idle word: **released**. Seeded word: **frozen**. Primary: [anthropics/claude-code#92360](https://github.com/anthropics/claude-code/issues/92360).

| File | Verdict | What it scores |
|---|---|---|
| `released.json` | released | Idle hold. Async open + timeout. TUI stays responsive. |
| `frozen.json` | frozen | Seeded #92360. Sync HAL on main thread. TUI dead. |
| `92360.json` | frozen | Primary fixture alias for #92360. |
| `stack.json` | stack-sample | Issue `sample` frames only. 1674/1674 main thread. |
| `scenario-a.json` | frozen | Matrix A: mixer running ~2 weeks → permanent freeze. |
| `scenario-b.json` | released | Matrix B: no third-party audio clients → dictation works. |
| `scenario-c.json` | released | Matrix C: freshly relaunched mixer → works (HAL builds up). |
| `remediation.json` | timeout-cancel | Async/worker open with timeout; cancel + "microphone unavailable". |
| `sync-hal.json` | sync-hal | Shipped path: synchronous `AudioUnitSetProperty` on the input loop. |
| `async-worker.json` | async-worker | Suggested path: open device on a worker with a timeout. |
| `cousins.json` | stay-off | Cite-only #20476 + stay-off catalog surfaces. |
| `fixtures.json` | index | Row list for the concert hold desk. |

Drop any file onto `projects/sostenuto/index.html` or paste the JSON. The living page seeds **frozen**.

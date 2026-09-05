# Sostenuto audio desk

Tiny async-open + timeout notes for the Claude Code defect where hold-to-talk voice dictation permanently freezes the TUI because the main thread blocks in a synchronous CoreAudio call (`AudioUnitSetProperty`) while opening the microphone. `sample` shows `AudioUnitSetProperty` → `AudioDeviceGetProperty` → `HALPlugIn::ObjectHasProperty` inside the bundled native audio `.node` module, with no timeout. Observed >10 minutes, 0% CPU, state S. The same thread services terminal input, so the TUI dies with the HAL. OPEN. Labels: bug, has repro, platform:macos, area:tui.

IDLE_WORD=released. SEEDED_WORD=frozen. Seeded state is frozen / #92360 (sync HAL on the input loop; footer stuck on "keep holding…"; Ctrl+C does not recover). Never idle as pruned / sealed / waiting / standing / razed / once / doubled / stuck / missed / gated / spilled / hushed / blurted / lit / blanked / cold / voided / banked / rewritten / miskeyed / leaked / adrift.

This stub is documentation and in-page simulation only. It does **not** ship in Claude Code. It does **not** open a microphone. It does **not** call CoreAudio. The living page at `projects/sostenuto/index.html` scores probes in-browser. No npm. No secrets. No live audio devices. Diagnostic shapes only (published stack frames, A/B/C matrix, expected async-open + timeout).

Preferred open (document only — do not treat this stub as a live audio path):

1. Do **not** call `AudioUnitSetProperty` synchronously on the thread that services terminal input, and
2. Do **not** wait on `AudioDeviceGetProperty` / `HALPlugIn::ObjectHasProperty` without a timeout, and
3. Open the audio device asynchronously (or on a worker thread) with a timeout. On timeout, cancel dictation, show "microphone unavailable", and keep the TUI responsive.

Detection: if hold-to-talk Space leaves the footer on "keep holding…", no keystroke is processed, Ctrl+C does not recover, and `sample` shows the main thread in `AudioUnitSetProperty` → `AudioDeviceGetProperty` → `HALPlugIn::ObjectHasProperty` at 0% CPU state S, the desk is already frozen.

Given a probe-shaped payload `{ openPath, timeout, workerThread, halState, scenario, persistHold, released, frozen, log }`:

- **RELEASED** if the device is opened asynchronously (or on a worker) with a timeout, or the HAL is healthy enough that dictation completes (scenarios B and C)
- **FROZEN** if the sync HAL path is chosen on a degraded HAL (scenario A / #92360)
- **SYNC-HAL** if `openPath` is `sync-main-thread` (the shipped defect)
- **ASYNC-WORKER** if `openPath` is `async-worker`
- **TIMEOUT-CANCEL** if timeout fires, dictation cancels, and the banner is "microphone unavailable"
- **STACK-SAMPLE** if scoring the issue `sample` frames (1674/1674 on the main thread)

This is a diagnostic scoring desk. Not an exploit. No secrets. No microphone. Score whether the input loop would stay free or already sostenutoed.

Primary: [anthropics/claude-code#92360](https://github.com/anthropics/claude-code/issues/92360). Cousin cite-only: [#20476](https://github.com/anthropics/claude-code/issues/20476) closed duplicate, same symptom, no stack.

Hypothesis only (NON-BINDING): the issue's own expected behavior — async/worker open with timeout, cancel + "microphone unavailable", keep TUI responsive — is the encoded fix. The external per-app volume mixer is the trigger; the defect is Claude Code. Discard if issue evidence disagrees.

NOT leftover Jetsam teak quay / Priory cloister / Latchkey latch / Stubble field / Intake pipe / Pasteboard paste desk / Spillway dam / Blurt CRT / Oubliette pit / Deadlight blank. Product name stays Sostenuto.

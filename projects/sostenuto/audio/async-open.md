# Async open + timeout (simulation only)

This file is documentation. It does not open a microphone and does not call CoreAudio.

## Shipped (scores **frozen** when HAL is slow)

```
main thread (also the TUI input loop)
  hold Space
  footer ← "keep holding…"
  AudioUnitSetProperty(...)          // synchronous, no timeout
    AudioDeviceGetProperty(...)
      HALPlugIn::ObjectHasProperty   // may never return
  // keystrokes not processed
  // Ctrl+C does not recover
```

Issue frames only: `1674 Thread DispatchQueue_1: com.apple.main-thread (serial)` → bundled `.5ed67dedd7cb7578-0.node` → `AudioUnitSetProperty (AudioToolboxCore) + 484` → `AudioDeviceGetProperty (CoreAudio) + 204` → `HALPlugIn::ObjectHasProperty + 44`. Observed >10 minutes, 0% CPU, state S.

## Suggested (scores **released**)

```
main thread                         audio worker
  hold Space                        open device
  keep reading keys                 with timeout
  if timeout ─────────────────────► cancel dictation
  footer ← "microphone unavailable"
  TUI stays responsive
```

From the issue expected behavior:

- Open the audio device asynchronously (or on a worker thread) with a timeout.
- On timeout, cancel dictation, show an error ("microphone unavailable"), and keep the TUI responsive.

A slow or hostile audio HAL must never hang the input loop. The third-party per-app volume mixer is the trigger (`coreaudiod` accumulated 10+ hours of CPU time after ~2 weeks). The defect is the missing timeout on the main thread.

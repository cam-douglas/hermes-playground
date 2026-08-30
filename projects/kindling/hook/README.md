# Kindling hook

Tiny hearth / kindling-rack scorer for Claude Code Desktop WarmLifecycle throwaway CLI sessions. Pipe a probe (`warmLifecyclePreview` / `startShellPty` / `neverUsed` / `remappedToPreexisting` / litter + OTel flags) and get **cued** or **discarded** (or a named nearby class).

Idle word is **cued**. NEVER use cued for a failure.

```bash
node projects/kindling/hook/index.mjs < transcript.txt
node --test projects/kindling/hook/kindling.test.mjs
```

Empty stdin uses the seeded #90798 discarded board. Stdout is JSON: `verdict`, `reasons[]`, `cued`, `fresh`, `alarm`.

Probe shape: `{ warmLifecyclePreview, startShellPty, focusSwitch, neverUsed, remappedToPreexisting, sessionStartFired, sessionEnvCreated, sessionCountIncremented, tokensFlat, hookStdoutCaptured, warmReusesExisting }` → `{ verdict, reasons[], cued, fresh, alarm }`.

Primary: [anthropics/claude-code#90798](https://github.com/anthropics/claude-code/issues/90798). Nearby-but-different (memory/process, not identity/metric/disk): [#76268](https://github.com/anthropics/claude-code/issues/76268) idle process trees, [#85104](https://github.com/anthropics/claude-code/issues/85104) WarmLifecycle no memory backpressure, [#82023](https://github.com/anthropics/claude-code/issues/82023) idle timeout re-arms scheduled sessions, [#73512](https://github.com/anthropics/claude-code/issues/73512) SIGKILL correlates with session-switching WarmLifecycle.

NOT Deadband / Pawl / Cenotaph / Fetch / Livery / Fob / Lacuna / Fusee / Damper / Reveille / Husk / Wraith.

Ask: reuse the warmed session on attach, or defer the CLI spawn until attach — and do not increment `claude_code.session.count` or leave unreaped dirs for a warm that never receives a message.

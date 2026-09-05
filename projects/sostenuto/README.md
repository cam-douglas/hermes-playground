# Sostenuto

A **piano sostenuto pedal / ebony-ivory concert hold desk** — ebony, ivory, amber hold-lamp, muted gold rail, cold steel damper, freeze-cyan warning, deep stage — Fraunces + Outfit + IBM Plex Mono — for a real Claude Code defect: **VOICE DICTATION PERMANENTLY FREEZES THE TUI BECAUSE THE MAIN THREAD BLOCKS IN A SYNCHRONOUS COREAUDIO CALL (`AudioUnitSetProperty`) WHILE OPENING THE MICROPHONE.**

Primary:

- [anthropics/claude-code#92360](https://github.com/anthropics/claude-code/issues/92360) (OPEN, bug, has repro, platform:macos, area:tui). Title: `Voice dictation permanently freezes TUI: main thread blocked in synchronous CoreAudio call (AudioUnitSetProperty) while opening microphone`. Filed 2026-09-05. Reporter: rk76ck7fcn-a11y.

03:50 sostenuto: a sostenuto that holds the whole keyboard while the mic HAL stalls is not dictation — it is already frozen. Score the release or admit the main thread already sostenutoed.

Idle word: **released**. Seeded state: **frozen** / #92360 — sync `AudioUnitSetProperty` on the thread that services terminal input; footer stuck on "keep holding…"; Ctrl+C does not recover. Never idle as pruned, sealed, waiting, standing, razed, once, doubled, stuck, missed, gated, spilled, hushed, blurted, lit, blanked, cold, voided, banked, rewritten, miskeyed, leaked, adrift, or any prior catalog idle.

**Sostenuto** is the middle piano pedal: it holds selected notes while the rest of the instrument should stay free. Here holding Space freezes the whole TUI because CoreAudio blocks the main thread. A slow or hostile audio HAL must never hang the input loop.

- **released** = HOLD: audio device opened asynchronously (or on a worker) with a timeout; on timeout cancel dictation, show "microphone unavailable", keep TUI responsive
- **frozen** = #92360: main thread blocked in synchronous CoreAudio; footer "keep holding…"; no keystrokes; Ctrl+C dead; kill only
- **sync-hal** = shipped path: `AudioUnitSetProperty` on `com.apple.main-thread` with no timeout
- **async-worker** = suggested path: open the device on a worker thread
- **timeout-cancel** = on timeout cancel dictation and surface "microphone unavailable"
- **stack-sample** = issue `sample` frames only (1674/1674 on the main thread)
- **scenario-a** = mixer running ~2 weeks → permanent freeze
- **scenario-b** = no third-party audio clients → dictation works end-to-end
- **scenario-c** = same app freshly relaunched → works; bad HAL state accumulates over time

Verdicts: released, frozen, sync-hal, async-worker, timeout-cancel, stack-sample.

This is a diagnostic scoring desk. Not an exploit. No secrets. No live CoreAudio. No microphone access. Score whether the input loop would stay free or already sostenutoed. Fixtures use the issue's A/B/C matrix and the published stack frames only.

Hypothesis only (NON-BINDING): the issue's own expected behavior — open the audio device asynchronously (or on a worker thread) with a timeout; on timeout cancel dictation, show "microphone unavailable", keep the TUI responsive — is the encoded fix. The external per-app volume mixer is the trigger; the defect is Claude Code. Discard if issue evidence disagrees. Encoded from the issue body only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92360](https://github.com/anthropics/claude-code/issues/92360)

What happened (from the issue — do not invent):

- Environment: Claude Code 2.1.226 (native build, `claude.exe` via Homebrew); macOS 26.6.2 (25G83), Apple Silicon (arm64); Terminal.app; hold-to-talk mode (default Space binding); claude.ai account.
- Holding Space to start voice dictation permanently freezes the entire TUI: the footer stays on "keep holding…" forever, no keystroke is processed, Ctrl+C does not recover, and the only way out is killing the process.
- `sample` shows the main thread blocked in a synchronous CoreAudio call with no timeout while opening the microphone. 100% of samples (1674/1674) on `DispatchQueue_1: com.apple.main-thread (serial)`.
- Stack path (issue frames only): bundled native audio module `.5ed67dedd7cb7578-0.node` → `AudioUnitSetProperty (AudioToolboxCore) + 484` → `AudioDeviceGetProperty (CoreAudio) + 204` → `HALPlugIn::ObjectHasProperty + 44` → `HAL_HardwarePlugIn_ObjectHasProperty + 480`.
- The process sits there indefinitely (observed >10 minutes, 0% CPU, state S). The same thread services terminal input, so the TUI freezes completely.
- Trigger: degraded `coreaudiod` state from a long-running third-party audio client (per-app volume mixer; `coreaudiod` had accumulated 10+ hours of CPU time). External app is the trigger; the defect is Claude Code.
- Controlled tests (Space hold simulated with synthetic CGEvents carrying the autorepeat flag — identical at the input layer):
  - A — mixer running ~2 weeks → permanent freeze, stack above
  - B — no third-party audio clients → dictation works end-to-end (mic opens, transcribes, inserts)
  - C — same app freshly relaunched → dictation works (bad HAL state builds up over time)
- Expected: open the audio device asynchronously (or on a worker thread) with a timeout. On timeout, cancel dictation, show "microphone unavailable", and keep the TUI responsive.
- Workarounds: `claude --continue` after killing the frozen process; quit/relaunch the offending audio client (or disable its mixer feature).

Suggested fix from the issue (document only) — async/worker open with timeout; never block the input loop on HAL.

## Why not a clone

This is specifically: **audio-HAL / main-thread input-loop freeze on hold-to-talk.**

NOT Jetsam ([#92338](https://github.com/anthropics/claude-code/issues/92338)) — stale tracking-ref Stop hook after a squash-merged PR whose branch was auto-deleted. Sostenuto is not a teak quay.
NOT Priory ([#92345](https://github.com/anthropics/claude-code/issues/92345)) — stray `priconfig.xml` in the shipped MSIX root. Sostenuto is not a limestone cloister.
NOT Latchkey ([#92330](https://github.com/anthropics/claude-code/issues/92330)) — Remote Control auto-start false `/login` while refreshToken still renewable. Sostenuto is not an oak latchkey board.
NOT Stubble ([#92328](https://github.com/anthropics/claude-code/issues/92328)) — Write UTF-8 LF `.cmd` + CP932 empty del / CWD wipe. Sostenuto is not a stubble field.
NOT Intake ([#92305](https://github.com/anthropics/claude-code/issues/92305)) — piped stdin double-composition. Sostenuto is not an intake pipe.
NOT Pasteboard ([#92312](https://github.com/anthropics/claude-code/issues/92312)) — platform-conditional Alt+V image-paste miss. Sostenuto is not a paste desk.
NOT Spillway — ultracode concurrency cap bypass. Sostenuto is not a dam spillway.
NOT Blurt — XTVERSION / DA echo through cooked ECHO. Sostenuto is not a CRT blurt.
NOT Oubliette — cold-parent child notices dropped into the pit. Sostenuto is not a dungeon trapdoor.
NOT Deadlight — ListAgents/SendMessage blanked by the Desktop host. Sostenuto is not a deadlight.

Different surface: CoreAudio HAL / hold-to-talk TUI freeze vs Stop-hook tracking-ref vs MSIX packaging leak vs OAuth startup-guard vs Write `.cmd` OEM wipe vs piped-stdin token double-count vs image-paste chord vs ultracode cap skip vs terminal-probe echo vs cold-parent notices vs blank Desktop host.

Cousin cite-only (NOT primary):

- [#20476](https://github.com/anthropics/claude-code/issues/20476) — closed duplicate "Claude Code hangs/freezes when using voice dictation input" (same symptom, no stack)

Product name stays **Sostenuto**. Do not rename to Jetsam, Priory, Latchkey, Stubble, Intake, Pasteboard, Spillway, Blurt, Oubliette, Deadlight, or any existing catalog slug.

Different UI: piano sostenuto pedal / ebony-ivory concert hold desk. Fraunces + Outfit + IBM Plex Mono. NOT Instrument Serif / Manrope (Jetsam). NOT Alegreya / Nunito Sans (Priory). NOT Cormorant Garamond (Latchkey). Stay OFF teak quay / limestone cloister / oak latch / stubble field / intake pipe / paste desk.

Different verbs: Score the release, pin idle released, pin seeded frozen, admit the main thread already sostenutoed, hold the pedal, load fixtures, reset to released.

Different idle: **released**. Different seeded: **frozen**.

## Live catalog path

`/sostenuto/` is this static concert hold scoring desk. Path `https://hermes-playground-green.vercel.app/sostenuto/` and subdomain `https://sostenuto.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets, no microphone, and no npm. Mark: `03:50 / hermes catalog #163 / #92360`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **frozen** — sync `AudioUnitSetProperty` on the main thread; footer "keep holding…"; no keystrokes; Ctrl+C dead; scenario A.
2. Idle **released** → async/worker open with timeout; cancel dictation; "microphone unavailable"; TUI stays free; idle word released.
3. Desk UI: ebony-ivory keyboard, amber hold-lamp, gold rail, steel damper, sostenuto pedal, main-thread vs audio-worker timeline, stack sample viewer (issue frames only), A/B/C matrix, timeout/async remediation scorer. Frozen = pedal locked, keys iced cyan, lamp stuck. Released = pedal up, keys free, lamp out.
4. Stay-off strip: Jetsam / Priory / Latchkey / Stubble / Intake / Pasteboard / Spillway / Blurt / Oubliette / Deadlight. Primary stays #92360.
5. **Score the release** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Pedal simulator chips rewrite open path (sync / async), timeout (none / armed), and HAL (degraded / healthy / fresh).

## How to score

Open `projects/sostenuto/index.html` in a browser, or serve the repo root and visit `/sostenuto/` (Vercel rewrite → `/projects/sostenuto`). No build step. Audio helper is a documentation / diagnostic fixture only:

```bash
# No live CoreAudio. No microphone. The living page scores probes in-browser.
# See projects/sostenuto/audio/README.md
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **released** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **frozen**.

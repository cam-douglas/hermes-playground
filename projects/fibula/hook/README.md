# Fibula hook

Tiny cloak-pin classifier for the fullscreen drag-select clipboard hang. In the fullscreen renderer, finishing a mouse drag-select can block the entire Claude Code process when `DISPLAY` points at a mute X socket. When `DISPLAY` is set and neither xclip nor xsel is installed, bundled `clipboard-napi` addon `setLinuxClipboardText` is called synchronously with no timeout. If the X socket accepts the connection but never completes the handshake, that call never returns and the event loop sticks in poll (wchan `do_sys_poll`). No OSC 52 fallback. Escape is dead. Kill-only exit.

Idle word is **sprung**. Seeded state is clasped / #91306 (drag-select → sync `setLinuxClipboardText` hang on mute X DISPLAY socket; no timeout; no OSC 52 fallback; Escape dead; kill-only exit; event loop stuck in poll). Never idle as clasped / literal / jammed / sifted / stocked / aired / drained / hinged / pealed / warded / first-wins / seized / pooled / cased.

```bash
node projects/fibula/hook/fibula.mjs projects/fibula/data/91306.json
node projects/fibula/hook/fibula.mjs projects/fibula/data/sprung.json
echo '{"display":":20","displaySet":true,"muteXSocket":true,"addonSync":true,"noTimeout":true,"osc52Emitted":false,"tuiResponsive":false,"escapeWorks":false,"eventLoopStuck":true,"dragSelect":true,"fullscreen":true,"killOnly":true}' | node projects/fibula/hook/fibula.mjs
node --test projects/fibula/hook/fibula.test.mjs
```

Empty stdin uses the idle **sprung** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `sprung`, `clasped`, `hold`, `alarm`, `idleWord`.

Given `{ display, displaySet, muteXSocket, addonSync, noTimeout, osc52Emitted, tuiResponsive, escapeWorks, eventLoopStuck }`:

- **SPRUNG** if clipboard path fails fast or uses OSC 52; TUI stays responsive after drag-select; Escape works; no sync hang on mute DISPLAY
- **CLASPED** if drag-select → sync `setLinuxClipboardText` hang on mute X DISPLAY socket; no timeout; no OSC 52 fallback; Escape dead; kill-only exit; event loop stuck in poll (#91306)
- **DISPLAY-HANG** if `DISPLAY=:20` hangs; no OSC 52; wchan `do_sys_poll`
- **CLIPBOARD-NAPI-SYNC** if bundled `clipboard-napi` addon `setLinuxClipboardText` is called synchronously on the main thread
- **NO-TIMEOUT** if `setLinuxClipboardText` is called synchronously with no timeout
- **X-SOCKET-MUTE** if Remote-Containers creates `/tmp/.X11-unix/X<N>` and sets `DISPLAY=:<N>` with no real X server
- **DRAG-SELECT-FREEZE** if finishing a mouse drag-select in the fullscreen renderer blocks the process
- **NO-OSC52-FALLBACK** if after mouse release no OSC 52 is emitted
- **KILL-ONLY-ESCAPE** if Escape does nothing and only killing the terminal recovers
- **EVENT-LOOP-STUCK** if the process sits in poll (wchan `do_sys_poll`)
- **HAS-REPRO** if a mute Unix socket plus fullscreen drag-select reproduces
- **HOLD** if the pin is sprung (fail-fast clipboard; TUI stays free)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the pin is sprung or clasped.

Primary: [anthropics/claude-code#91306](https://github.com/anthropics/claude-code/issues/91306). Cousins (cite only, not primaries): [#61936](https://github.com/anthropics/claude-code/issues/61936) mouse tracking cite; [#72173](https://github.com/anthropics/claude-code/issues/72173) mouse tracking cite; [#89097](https://github.com/anthropics/claude-code/issues/89097) WSL xclip branch miss; [#74214](https://github.com/anthropics/claude-code/issues/74214) OSC 52 duplicate writes; [#88898](https://github.com/anthropics/claude-code/issues/88898) Wayland image paste; [#80330](https://github.com/anthropics/claude-code/issues/80330) orphaned xclip grab; [#88779](https://github.com/anthropics/claude-code/issues/88779) Wayland copy silent fail; [openai/codex#33968](https://github.com/openai/codex/issues/33968) Linux/Wayland hang cousin.

Hypothesis only (NON-BINDING): fullscreen drag-select always takes the native Linux clipboard path when DISPLAY is set, with no timeout and no OSC 52 fallback when the X handshake stalls. Do not claim a root cause in Claude Code source you have not seen.

NOT leftover woodworking / mm-slider. Product name stays Fibula. Do not rename to Clipboard / Display / X11 / Socket / Hang / Freeze / Virgule / Riddle / Garner / Pintle.

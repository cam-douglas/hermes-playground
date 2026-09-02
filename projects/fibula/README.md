# Fibula

A **Roman cloak-pin / fibula atelier** desk — bronze bow fibula, iron pin, catch-plate, cloak fold, wax tablet, iron stylus; terracotta and bronze on a warm chalk ground; Cormorant Garamond + Outfit + Fira Code — for a real Claude Code defect: in the **fullscreen renderer**, finishing a mouse **drag-select** can **block the entire process** when `DISPLAY` points at a **mute X socket**. The bundled `clipboard-napi` addon `setLinuxClipboardText` is called **synchronously with no timeout**. No OSC 52 fallback. Escape is dead. Kill-only exit.

Primary:

- [anthropics/claude-code#91306](https://github.com/anthropics/claude-code/issues/91306) (OPEN, bug, has repro, platform:linux, area:tui, platform:vscode, filed 2026-09-01T19:42:48Z). Title: [Bug] Fullscreen drag-select blocks TUI when DISPLAY points to unresponsive X socket. Reporter Legonois.

A fibula that clasps on a mute DISPLAY is not a hold. Score the pin or admit **sprung**.

Idle word: **sprung**. Seeded state: **clasped** / #91306 — drag-select → sync `setLinuxClipboardText` hang on mute X DISPLAY socket; no timeout; no OSC 52 fallback; Escape dead; kill-only exit; event loop stuck in poll. Never idle as clasped / literal / jammed / sifted / stocked / aired / drained / hinged / pealed / warded / first-wins / seized / pooled / cased.

A **fibula** is a Roman cloak-pin: bow, pin, and catch-plate. After a fullscreen drag-select clipboard handoff the pin should **spring** open and leave the TUI free. Instead a mute X `DISPLAY` socket seizes the catch and the whole scriptorium **clasps** shut.

- **clasped** = #91306: drag-select → sync `setLinuxClipboardText` hang on mute X DISPLAY socket; no timeout; no OSC 52 fallback; Escape dead; kill-only exit; event loop stuck in poll
- **display-hang** = `DISPLAY=:20` hangs; no OSC 52; wchan `do_sys_poll`
- **clipboard-napi-sync** = bundled `clipboard-napi` addon `setLinuxClipboardText` called synchronously on the main thread; copy path `copySelectionNoClear -> setClipboard -> native Linux copy`
- **no-timeout** = `setLinuxClipboardText` is called synchronously with no timeout
- **x-socket-mute** = Remote-Containers creates `/tmp/.X11-unix/X<N>` and sets `DISPLAY=:<N>` even when no real X server answers; `DISPLAY=:20`
- **drag-select-freeze** = finishing a mouse drag-select in the fullscreen renderer blocks the entire Claude Code process; selection highlight stays on screen
- **no-osc52-fallback** = after mouse release no OSC 52 emitted; expected fail-fast fallback to OSC 52
- **kill-only-escape** = keypresses ignored; Escape does nothing; only recovery is killing the terminal
- **event-loop-stuck** = process sits in poll; wchan `do_sys_poll`; last rendered frame is the selection highlight
- **has-repro** = Unix socket that accepts and never replies; `DISPLAY` pointed at it; fullscreen drag-select and release
- **hold** = clipboard path fails fast or uses OSC 52; TUI stays responsive after drag-select; Escape works; the pin is sprung
- **sprung** = HOLD: clipboard path fails fast or uses OSC 52; TUI stays responsive after drag-select; Escape works; no sync hang on mute DISPLAY

Verdicts: sprung, clasped, display-hang, clipboard-napi-sync, no-timeout, x-socket-mute, drag-select-freeze, no-osc52-fallback, kill-only-escape, event-loop-stuck, has-repro, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the pin is sprung or clasped.

Hypothesis only (NON-BINDING): fullscreen drag-select always takes the native Linux clipboard path when DISPLAY is set, with no timeout and no OSC 52 fallback when the X handshake stalls. Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **FULLSCREEN DRAG-SELECT → SYNC clipboard-napi setLinuxClipboardText HANG WHEN DISPLAY POINTS AT A MUTE X SOCKET; NO TIMEOUT; NO OSC 52 FALLBACK; TUI EVENT LOOP STUCK (kill-only).**

NOT **Virgule** ([#91337](https://github.com/anthropics/claude-code/issues/91337)) — slash/skills menu trigger bound to message index 0 / composing stick.
NOT **Riddle** ([#91327](https://github.com/anthropics/claude-code/issues/91327)) — devcontainer ipset duplicate + set -e firewall abort / mesh sieve.
NOT **Garner** ([#91246](https://github.com/anthropics/claude-code/issues/91246)) — Desktop archive-to-pool no TTL / loft.
NOT **Pintle** ([#91226](https://github.com/anthropics/claude-code/issues/91226)) — PreToolUse Bash relative-path cwd-drift deadlock.
NOT **Carillon** ([#91250](https://github.com/anthropics/claude-code/issues/91250)) — plugin SessionStart first-wins.
NOT **Postern** ([#91223](https://github.com/anthropics/claude-code/issues/91223)) — socket-dir squat.
NOT **Sluice** ([#91265](https://github.com/anthropics/claude-code/issues/91265)) — Cowork Toke/File/SeAt kernel pool leak / millrace.
NOT **Alidade** ([#91055](https://github.com/anthropics/claude-code/issues/91055)) — silent foreign host.
NOT **Cockade** ([#91033](https://github.com/anthropics/claude-code/issues/91033)) — ultracode badge / effort slider mismatch.
NOT leftover woodworking / mm-slider.
NOT #89097 (WSL platform string misses xclip branch — copy fails; does not freeze TUI event loop).
NOT #80330 (orphaned xclip selection grab freezes desktop — different surface).

Cousins are cite-only on a cousin strip; primary stays #91306.

Product name stays **Fibula**. Do not rename to Clipboard, Display, X11, Socket, Hang, Freeze, Virgule, Riddle, Garner, Pintle.

Different UI: bronze bow fibula / iron pin / catch-plate / cloak fold / wax tablet / iron stylus / terracotta and bronze / warm chalk ground. Cormorant Garamond + Outfit + Fira Code. NOT Libre Baskerville/Work Sans/JetBrains Mono (Virgule). NOT Newsreader/Public Sans/Source Code Pro (Riddle). NOT Literata/Atkinson/IBM Plex Mono (Garner). NOT Fraunces (Sluice). NOT Syne/DM Sans (Pintle). NOT Playfair (Carillon). NOT Cinzel (Postern). NOT Libre Caslon (Alidade).

Different verbs: score the pin, pin idle sprung, pin seeded clasped, admit sprung, load fixtures, reset to sprung. Not "Score the stick/mesh/loft/hinge/peal/peg/postern/race".

Different idle: **sprung**.

## Live catalog path

`/fibula/` is this static fibula atelier desk. Path `https://hermes-playground-green.vercel.app/fibula/` and subdomain `https://fibula.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `09:50 / hermes catalog #110 / #91306`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **sprung** — clipboard path fails fast or uses OSC 52; TUI stays responsive after drag-select; Escape works; no sync hang on mute DISPLAY.
2. Seed **clasped** → #91306: drag-select → sync `setLinuxClipboardText` hang on mute X DISPLAY socket; no timeout; no OSC 52 fallback; Escape dead; kill-only exit; event loop stuck in poll.
3. Atelier UI: bronze bow fibula / iron pin / catch-plate / cloak fold / wax tablet. Sprung = pin open, cloak free. Clasped = mute DISPLAY seizes the catch.
4. Cousin cite strip labeled cousin-not-primary: [#61936](https://github.com/anthropics/claude-code/issues/61936) / [#72173](https://github.com/anthropics/claude-code/issues/72173) / [#89097](https://github.com/anthropics/claude-code/issues/89097) / [#74214](https://github.com/anthropics/claude-code/issues/74214) / [#88898](https://github.com/anthropics/claude-code/issues/88898) / [#80330](https://github.com/anthropics/claude-code/issues/80330) / [#88779](https://github.com/anthropics/claude-code/issues/88779) / [openai/codex#33968](https://github.com/openai/codex/issues/33968). Cite only. Primary stays #91306.
5. **Score the pin** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/fibula/index.html` in a browser, or serve the repo root and visit `/fibula/` (Vercel rewrite → `/projects/fibula`). No build step. Optional hook:

```bash
node projects/fibula/hook/fibula.mjs projects/fibula/data/91306.json
node projects/fibula/hook/fibula.mjs projects/fibula/data/sprung.json
node --test projects/fibula/hook/fibula.test.mjs
```

Clasped seed → clasped/alarm. Sprung seed → sprung/hold.

`projects/fibula/hook/fibula.mjs` classifies a probe ticket JSON `{ display, displaySet, muteXSocket, addonSync, noTimeout, osc52Emitted, tuiResponsive, escapeWorks, eventLoopStuck }` and returns `{ verdict, chips[], reasons[], sprung, clasped, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91306.json`, `data/clasped.json`, `data/sprung.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`, `data/relatives.json`, `data/cousins.json`. Evidence only from issue facts. Use versions 2.1.257 / 2.1.219 / 2.1.231, `DISPLAY=:20`, `setLinuxClipboardText`, `do_sys_poll`, related issue numbers 61936/72173. Never invent counts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91306](https://github.com/anthropics/claude-code/issues/91306). Unauthenticated. Title, state, labels — not a cookbook. Cousins cited on the ledger, not primaries. See `.env.example`.
2. Slack `#hermes-catalog` mention as the ship notice surface (text only; do not post).
3. Claude Code fullscreen TUI / Linux clipboard path as the third native surface. Paste or drop a probe ticket JSON and score it.
4. Atelier UI (bronze bow fibula / iron pin / catch-plate / cloak fold / wax tablet). Sprung = pin open after drag-select, clasped = mute DISPLAY seizes the catch.
5. Cousin-not-primary cite strip: #61936, #72173, #89097, #74214, #88898, #80330, #88779, openai/codex#33968.

## Sources

- [anthropics/claude-code#91306](https://github.com/anthropics/claude-code/issues/91306) OPEN — primary. Product stays Fibula.
- In the fullscreen renderer, finishing a mouse drag-select can block the entire Claude Code process.
- Selection highlight stays on screen; keypresses ignored; Escape does nothing; only recovery is killing the terminal.
- Cause (from the issue): Linux native clipboard path — when `DISPLAY` is set and neither xclip nor xsel is installed, bundled `clipboard-napi` addon `setLinuxClipboardText` is called **synchronously with no timeout**.
- If the X socket accepts the connection but never completes the handshake, that call never returns and the event loop sticks in `poll` (wchan `do_sys_poll`).
- Easy hit in VS Code Remote-SSH + Remote-Containers / Coder: Remote-Containers creates `/tmp/.X11-unix/X<N>` inside the container and sets `DISPLAY=:<N>` even when no real X server answers behind the forward.
- Environment cited: Claude Code 2.1.257 (BUILD_TIME 2026-09-01T05:28:54Z, GIT_SHA 2c673eef); same path present in 2.1.219 and 2.1.231; Linux x64 devcontainer; VS Code 1.134.0 integrated terminal; TERM_PROGRAM=vscode; `tui: fullscreen` in settings.json; `DISPLAY=:20`; no xclip/xsel/wl-copy.
- Evidence table from issue: DISPLAY=:20 (hangs) → no OSC 52, wchan `do_sys_poll`; DISPLAY unset → OSC 52 emitted, keeps responding; DISPLAY=:0 (refused) → OSC 52 emitted, keeps responding.
- Bundle path cited: Linux clipboard probe picks wl-copy, then xclip, then xsel, then the addon whenever DISPLAY matches `^(unix)?:`; copy path `copySelectionNoClear -> setClipboard -> native Linux copy`; addon call `recordAddonWrite(addon.setLinuxClipboardText(text) !== false)`, synchronous on the main thread.
- Workarounds that confirm cause: `unset DISPLAY` before launch; `CLAUDE_CODE_DISABLE_MOUSE=1`; `/tui default` classic renderer.
- Repro: create a Unix socket that accepts and never replies, point DISPLAY at it; run claude with fullscreen renderer; drag-select text and release.
- Expected: selected text copied via OSC 52 or a native tool, session keeps responding; if native path cannot reach the display, fail fast and fall back to OSC 52.
- Actual: after mouse release, no OSC 52 emitted; process sits in poll; stops reacting to keyboard and further mouse events; last rendered frame is the selection highlight.
- Suggested fix (from reporter, cite only): do addon write off main thread with bounded timeout, or probe display with short timeout before choosing addon.
- Cousins (cite, not primaries):
  - [#61936](https://github.com/anthropics/claude-code/issues/61936) — same symptom attributed to mouse tracking (cite; mouse tracking only enables in-app selection).
  - [#72173](https://github.com/anthropics/claude-code/issues/72173) — same symptom attributed to mouse tracking (cite).
  - [#89097](https://github.com/anthropics/claude-code/issues/89097) — WSL platform-string / xclip branch miss (cite; copy fails, TUI does not freeze).
  - [#74214](https://github.com/anthropics/claude-code/issues/74214) — OSC 52 duplicate clipboard writes (cite).
  - [#88898](https://github.com/anthropics/claude-code/issues/88898) — Wayland image paste / xclip interference (cite).
  - [#80330](https://github.com/anthropics/claude-code/issues/80330) — orphaned xclip grab freezes desktop (cite; different freeze surface).
  - [#88779](https://github.com/anthropics/claude-code/issues/88779) — Wayland copy silent fail (cite).
  - [openai/codex#33968](https://github.com/openai/codex/issues/33968) — Linux/Wayland hang cousin (cite-only cross-ecosystem).

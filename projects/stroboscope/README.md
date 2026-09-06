# Stroboscope

A **high-speed photography / optics lab stroboscope desk** — matte-black lab bench, xenon flash tubes, timing dials, oscilloscope CRT, darkroom safelight, shutter sync cable, frequency counter, chrome bezels — Syne + Manrope + IBM Plex Mono — for a real Claude Code defect: **DESKTOP APP CODE TAB: TERMINAL PANEL FLICKERS OPEN/CLOSED ON EVERY BASH/POWERSHELL TOOL CALL AND STEALS KEYBOARD FOCUS FROM THE CHAT INPUT (WINDOWS).**

Primary:

- [anthropics/claude-code#92395](https://github.com/anthropics/claude-code/issues/92395) (OPEN, bug, has-repro, platform:windows, area:desktop). Title: `[BUG] Desktop: Terminal panel flickers open/closed on every shell tool call, stealing keyboard focus (Windows)`. Filed 2026-09-05. Reporter: naji-atallah.

11:50 stroboscope: a terminal panel that flickers open and steals the chat caret on every shell tool call is not a helpful console — it is already strobing. Score the hold or admit the focus already stolen.

Idle word: **strobing**. Seeded state: **stolen** / #92395 — shell tool call flickered the panel and focus left the chat input. Never idle as dawnlocked, misaimed, washed, stranded, unstruck, leaked, nixied, settled, open, elided, grafted, frozen, adrift, cold, voided, banked, rewritten, discarded, held, witnessed, or any prior catalog idle.

**Stroboscope** is optics-lab work. A stroboscope should freeze motion with a timed flash, not yank the shutter sync off the photographer's hand. Here the Terminal panel strobes open/closed on every Bash/PowerShell tool call and steals the chat caret. Score whether a hold (shell vs file-tool vs background vs remediation) would stay strobing, hold, or leave the focus already stolen.

- **strobing** = IDLE / panel fence: Terminal panel already flickers open then closed on every Bash/PowerShell tool call
- **stolen** = seeded word: flicker + keyboard focus left the chat input; keystrokes during the flicker are lost or misdirected
- **held** = contrast hold: panel stays in whatever state the user left it; caret stays in chat
- **in-place-update** = contrast hold: output writes without raising or focusing the panel
- **file-tools-quiet** = contrast hold: file read/write/search produce no flicker — isolates trigger to the shell path
- **bg-double-strobe** = contrast: `run_in_background: true` is worse — two flickers per command (launch + completion)
- **docked-open** = leaving Terminal already docked open still flickers; prior state not respected
- **no-config-toggle** = no GUI toggle; config.json has no auto-open or auto-focus key
- **ruled-out** = hooks none; keybindings file absent; config only PowerShell path + layout
- **shell-strobe** = flicker only on Bash/PowerShell tool calls
- **setting-off** = expected fix: `autoOpenTerminalOnToolUse: false`
- **visibility-hold** = expected fix: do not change panel visibility or focus on tool-call execution

Verdicts: strobing, stolen, held, in-place-update, file-tools-quiet, bg-double-strobe, docked-open, no-config-toggle, ruled-out, shell-strobe, setting-off, visibility-hold.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a shell tool call on the Desktop Code tab would leave the bench strobing or already stolen. Fixtures use the issue's environment, published repro, ruled-out rows, isolation to the shell path, background double-strobe, and the requested visibility-hold / in-place-update / setting only.

Hypothesis only (NON-BINDING): do not change Terminal panel visibility or focus on tool-call execution; write output without raising or focusing; or add `autoOpenTerminalOnToolUse: false`. The panel that strobes is not a helpful console. Discard if issue evidence disagrees. Encoded from the issue body only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92395](https://github.com/anthropics/claude-code/issues/92395)

What happened (from the issue — do not invent):

- Environment: Claude Code desktop app (Code tab) **1.46388.4**; Windows 11 Enterprise **10.0.26200**; Windows PowerShell (`C:\WINDOWS\System32\WindowsPowerShell\v1.0\powershell.exe`).
- On every Bash/PowerShell tool call the assistant makes, the Terminal panel flickers (opens then closes) and steals keyboard focus from the chat input, interrupting typing. Keystrokes during the flicker are lost or misdirected.
- Expected: Terminal panel stays in whatever state the user left it, or updates in place without taking keyboard focus; typing in chat should never be interrupted by a tool call.
- Ruled out by reporter: hooks in `~/.claude/settings.json` (none), custom keybindings (file absent), desktop `config.json` (only `terminalCliPowerShellPath` + layout keys — **no auto-open or auto-focus setting exists**), leaving Terminal already docked open (still flickers).
- `run_in_background: true` is **worse** — two flickers per command (launch + completion).
- Flicker occurs **only** on Bash/PowerShell tool calls. File read/write/search tool calls produce no flicker — isolates trigger to the shell execution path.
- No user-facing workaround / GUI toggle / config key. Only mitigation is asking the assistant to avoid shell commands (not viable for git/npm/CLI work).
- Suggested fix: do not change Terminal panel visibility or focus on tool-call execution (write output without raising/focusing), OR add a setting e.g. `autoOpenTerminalOnToolUse: false`.

## Why not a clone

This is specifically: **Desktop Code-tab Terminal panel flicker + focus steal on shell tool calls only.**

NOT Heliostat/#92389 — theme auto never resamples because DECSET 2031 unrecognized on WT. Stroboscope is not an observatory heliostat.
NOT Lethe/#92335 — Chrome silent re-auth / session tokens. Stroboscope is not an underworld ferry.
NOT Frizzen/#92353 — UserPromptSubmit listed-but-never-invoked. Stroboscope is not a flintlock desk.
NOT Nixie/#92383 — auto-mode send_message 45s no-ack settle. Stroboscope is not a USPS nixie desk.
NOT Embrasure/#92365 — sandbox denyRead fail-open. Stroboscope is not a battlement.
NOT Elision/#92347 — summarize-up-to-here drops summaries. Stroboscope is not a blue-pencil folio.
NOT Graft/#92354 — plugin-cache copy-forward. Stroboscope is not an orchard grafting bench.
Do NOT name this Flutter (reserved alt), Fairlead, Chock, Gypsy, Wildcat, Fulcrum, Trunnion, or Aphonia.

Different surface: Desktop Code-tab Terminal panel flicker + focus steal on shell tool calls only.

Cousins cite-only (NOT primary):

- [#89071](https://github.com/anthropics/claude-code/issues/89071) / [#89072](https://github.com/anthropics/claude-code/issues/89072) / [#39634](https://github.com/anthropics/claude-code/issues/39634) / [#35797](https://github.com/anthropics/claude-code/issues/35797) — VS Code extension / hooks spawning console windows without `windowsHide` (conhost/WT flash). Related photosensitivity/focus pain, but NOT the Desktop Code-tab Terminal *panel* open/close path.
- [#7618](https://github.com/anthropics/claude-code/issues/7618) — VS Code terminal steals focus with /ide.
- [#32726](https://github.com/anthropics/claude-code/issues/32726) — request option to prevent panel focus steal (VS Code).
- [#1913](https://github.com/anthropics/claude-code/issues/1913) / [#10794](https://github.com/anthropics/claude-code/issues/10794) / [#82286](https://github.com/anthropics/claude-code/issues/82286) / [#84400](https://github.com/anthropics/claude-code/issues/84400) — other terminal flicker classes (redraw/CPU), not this Desktop panel strobe.

Product name stays **Stroboscope**. Do not rename to Heliostat, Lethe, Frizzen, Nixie, Embrasure, Elision, Graft, Flutter, Fairlead, Chock, Gypsy, Wildcat, Fulcrum, Trunnion, Aphonia, or any existing catalog slug. Name/slug `stroboscope` confirmed unused in catalog.json.

Different UI: matte-black lab bench / xenon flash tubes / timing dials / oscilloscope CRT / darkroom safelight / shutter sync cable / frequency counter / chrome bezels. Syne + Manrope + IBM Plex Mono. NOT Bricolage Grotesque / Sora / JetBrains Mono (Heliostat observatory). NOT Cormorant Garamond (Lethe river-mist). NOT Bodoni Moda / Commissioner / Space Mono (Frizzen walnut-steel-brass). Stay OFF rooftop observatory / underworld ferry quay / flintlock lockplate / postal pigeonholes / battlement merlons / blue-pencil folio / orchard cambium.

Different verbs: Score the hold, pin idle strobing, pin seeded stolen, admit the focus already stolen, flip shell vs file-tool vs background vs remediation, load fixtures, reset to held.

Different idle: **strobing**. Different seeded: **stolen**. Contrast: **held** / **in-place-update** / **file-tools-quiet** / **bg-double-strobe**.

## Live catalog path

`/stroboscope/` is this static optics-lab scoring assay. Path `https://hermes-playground-green.vercel.app/stroboscope/` and subdomain `https://stroboscope.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `11:50 / hermes catalog #171 / #92395`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **stolen** — shell flicker; focus left chat; keystrokes lost or misdirected.
2. Idle **strobing** → panel already strobes on every shell tool call; idle word strobing.
3. Contrast **held** → panel stays as left; caret stays in chat.
4. Contrast **in-place-update** → write output without raising or focusing.
5. Contrast **file-tools-quiet** → file read/write/search produce no flicker.
6. Contrast **bg-double-strobe** → `run_in_background: true`; two flickers.
7. Assay UI: matte-black bench, xenon tubes, timing dials, CRT, safelight, sync cable, frequency counter, chrome bezels, chat caret, Terminal panel.
8. Stay-off strip: Heliostat / Lethe / Frizzen / Nixie / Embrasure / Elision / Graft. Primary stays #92395.
9. **Score the hold** walks the probe ticket and lights chips on the bench. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite the flash (shell / file / background / hold).

## How to score

Open `projects/stroboscope/index.html` in a browser, or serve the repo root and visit `/stroboscope/` (Vercel rewrite → `/projects/stroboscope`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **strobing** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **stolen** / shell-path flicker / chat caret yanked.

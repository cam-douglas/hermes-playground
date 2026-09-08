# Ptybind

A **ConPTY bind-plate atelier** — CRT phosphor green on near-black, brass bind-screws, mux pane lattice, raw-mode console ledger, PTY BIND plate mark; Newsreader + Karla + IBM Plex Mono — for a real Claude Code defect: **CTRL+G EXTERNAL EDITOR RENDERS CORRECTLY BUT RECEIVES NO KEYSTROKES INSIDE CONPTY MULTIPLEXERS ON WINDOWS.** When a hypothetical tear-down of parent stdin before spawn hands keys to the child, the plate is **unbound**.

Primary:

- [anthropics/claude-code#92757](https://github.com/anthropics/claude-code/issues/92757) (OPEN, bug, has repro, platform:windows, area:tui). Title: `[BUG] Ctrl+G external editor receives no keyboard input inside ConPTY-based terminal multiplexers on Windows (refiling #73301)`. Filed 2026-09-08T01:32:11Z.

12:50 ptybind: a console-bind / ConPTY mux plate that shows Ctrl+G external editor rendering but receiving no keystrokes inside ConPTY multiplexers on Windows; score swallowed or admit unbound.

Score swallowed or admit unbound.

Idle word: **piped** (HOLD: editor receives keys / input correctly handed to child). Seeded state: **swallowed** / #92757. Admit word: **unbound**. Never idle as berthed, lean, attentive, echoed, laden, deaf, refused, ambered, waived, clear, bricked, unrung, porous, slipped, severed, misrouted, adrift, corked, latent, silted, barred, runaway, haunted, fouled, razed, culled, unanswered, stripped, quieted, cribbed, sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted. Never seeded as echoed, laden, deaf, refused, imprinted, ambered, bynamed, crenelled, quieted, cribbed, sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted, latched, staged, proved, belayed, sole, packed, roused, sighted, argbound, cleared.

**Ptybind** = a bind-plate that should release the parent's console read before a child editor takes the pane. The plate should pipe keystrokes to the child. Measured, the parent still wins the input race.

- **piped** = IDLE: HOLD; editor receives keys / input correctly handed to child
- **swallowed** = seeded word / #92757 path: parent still consuming input; editor renders; i / Esc / Ctrl+C dead
- **unbound** = admit hold: parent stdin fully torn down before spawn so the editor gets keys
- **editor-renders** = the editor draws correctly; the pane survives; only input is lost
- **keys-dead** = i, Esc and Ctrl+C are all dead
- **parent-consuming** = an i intended for the editor later appeared in Claude's own prompt
- **conpty-mux** = failure is Claude Code / raw-mode Node inside psmux / wtmux
- **gui-workaround** = gvim -f never touches the terminal input path and works
- **node-repro** = 13-line Node raw-mode + stdio inherit fails with no Claude Code
- **control-matrix** = works outside the mux / GUI editor / real tmux on WSL; fails in ConPTY mux
- **cousins** = cite-only #73301 CLOSED stale, #84264 OPEN, #58664 CLOSED, #88775 OPEN; primary stays #92757
- **has-clear-repro** = issue labeled has repro

Verdicts: piped, swallowed, unbound, editor-renders, keys-dead, parent-consuming, conpty-mux, gui-workaround, node-repro, control-matrix, has-clear-repro, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a Ctrl+G editor handoff would leave the plate **swallowed** or already **unbound**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): a pending parent `ReadConsoleInput` on Windows ConPTY is not cancelled by `setRawMode(false)` / `pause` before spawn, so the parent keeps winning the input race. The reporter inferred this and did not verify the mechanism directly. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92757](https://github.com/anthropics/claude-code/issues/92757)
- Cousins cite-only (NOT primary): [anthropics/claude-code#73301](https://github.com/anthropics/claude-code/issues/73301) CLOSED stale — identical symptom under WezTerm. [anthropics/claude-code#84264](https://github.com/anthropics/claude-code/issues/84264) OPEN — Ctrl+G kills the whole Windows Terminal window (different failure). [anthropics/claude-code#58664](https://github.com/anthropics/claude-code/issues/58664) CLOSED — hang instead of launch. [anthropics/claude-code#88775](https://github.com/anthropics/claude-code/issues/88775) OPEN — bg-spare daemon no controlling tty for emacs.

What happened (from the issue body — do not invent):

- Claude Code 2.1.263 on Windows 11 Pro, 10.0.26200.9168; Windows Terminal + Git Bash (`MSYSTEM=MINGW64`, `TERM=xterm-256color`) inside a **psmux** or **wtmux** pane; filed 2026-09-08T01:32:11Z; labels bug, has repro, platform:windows, area:tui; OPEN
- Reporter: tanaeakihiko; Claude Code Max; Node v24.19.0; vim 9.2 (Windows build and MSYS2); psmux 3.3.8 (66cf613 2026-08-18)
- Pressing Ctrl+G opens the external terminal editor and it **renders correctly**, but **no keystroke ever reaches it** — `i`, `Esc` and `Ctrl+C` are all dead
- The session has to be killed with stop-process
- A 13-line Node script that only puts stdin in raw mode, waits for one key, leaves raw mode and spawns an editor with `stdio: 'inherit'` fails exactly the same way with no Claude Code involved
- Non-deterministic: on one attempt, Enter immediately after the editor opened unblocked everything; the next attempt the same Enter did nothing, and repeated Enters dropped back into Claude Code and hung it
- During one failure, an `i` keystroke intended for the editor was later delivered into Claude Code's own prompt as a submitted message — the parent was still consuming input meant for the child
- Control matrix: vim alone (direct and in psmux), `git commit`, `less` then `v`, Claude Code in Windows Terminal direct, and Claude Code on real tmux on WSL all hand keys; Claude Code and `repro.js` inside psmux / wtmux do not
- Also ruled out, all failing identically: Windows `vim.exe` (`term=win32`) and MSYS2 `/usr/bin/vim` (`term=xterm-256color`); `vim --clean`; `tui` set to `"default"` and to `"fullscreen"`
- Workaround: set `EDITOR` to a GUI editor (`gvim -f`), which never touches the terminal's input path
- Adjacent (not a cousin product): nodejs/node#63852 — Windows console input when stdin is a pipe; different scenario

Problem found: CTRL+G EXTERNAL EDITOR RENDERS CORRECTLY BUT RECEIVES NO KEYSTROKES INSIDE CONPTY MULTIPLEXERS ON WINDOWS.

Why this solution: a diagnostic scorer for the piped → swallowed / unbound bind-plate chain, so a reader can pin idle piped, seed swallowed (#92757 path), and score editor-renders / keys-dead / parent-consuming / conpty-mux / gui-workaround / node-repro / control-matrix / cousins against the published facts.

## Why not a clone

This is specifically: **CTRL+G EXTERNAL EDITOR RENDERS CORRECTLY BUT RECEIVES NO KEYSTROKES INSIDE CONPTY MULTIPLEXERS ON WINDOWS**.

**NOT Dunnage/#92746** (RemoteTrigger `action=list` cursor ignore — already shipped). Do not touch Dunnage.

**NOT Setoff/#92750** (subagent first-request MEMORY.md + skill_listing set-off — already shipped). Do not touch Setoff.

**NOT Espagnolette/#92694** (AskUserQuestion selection keys dead after window refocus — already shipped). Do not touch Espagnolette.

**NOT Imprimatur/#92740** (Skip Artifact first-publish — already shipped). Do not touch Imprimatur.

**NOT Byname/#92738** (Desktop slash false-negative on a bare plugin-skill byname — already shipped). Do not touch Byname.

**NOT Crenel/#92729**. **NOT Quietus/#92716**. **NOT Cribble/#92684**. **NOT Springe/#92675**. **NOT Gangway/#92662**. **NOT Waybill/#92624**. **NOT Snatch/#92583**.

Different paradigm: **CTRL+G CONPTY MUX EDITOR RENDERS / KEYS SWALLOWED**.

Cousins cite-only (NOT primary): #73301 CLOSED stale, #84264 OPEN, #58664 CLOSED, #88775 OPEN. Do not auto-pick as thesis.

Do NOT rename this product Dunnage, Setoff, Espagnolette, Imprimatur, Byname, Crenel, Quietus, Cribble, Springe, Gangway, Waybill, or Snatch.
Do NOT reuse idle berthed / lean / attentive / echoed / laden / deaf / refused / ambered / waived / clear / bricked / unrung / porous / slipped / severed / misrouted / adrift / corked / latent / silted / barred / runaway / haunted / fouled / razed / culled / unanswered / stripped / quieted / cribbed / sprung / remoored / addressed / reaped / relayed / flushed / drained / admitted.
Do NOT reuse seeded echoed / laden / deaf / refused / imprinted / ambered / bynamed / crenelled / quieted / cribbed / sprung / remoored / addressed / reaped / relayed / flushed / drained / admitted / latched / staged / proved / belayed / sole / packed / roused / sighted / argbound / cleared.

Different surface: ConPTY mux Ctrl+G editor input race vs RemoteTrigger list cursor ignore / subagent first-request attachments / AskUserQuestion dead keys / Skip-mode first Artifact publish / Desktop slash false-negative byname / empty-object resources capability / SubagentStop kill path / denyWrite mid-path wildcards / plugin-native PreToolUse / Chrome never-redial / named-spawn foreign session id / Bash timeout orphans.

Product name stays **Ptybind**. Name/slug `ptybind` confirmed unused in catalog.json (217 products before this ship; Dunnage is #217).

Different UI: dark phosphor / ConPTY bind-plate atelier / CRT phosphor green on near-black / brass bind-screws / mux pane lattice / raw-mode console ledger / PTY BIND plate mark. Newsreader / Karla / IBM Plex Mono. NOT Literata / Red Hat Text / Fira Code (Dunnage). NOT DM Serif Display / Commissioner / Azeret Mono (Setoff). NOT Instrument Serif / Figtree / JetBrains Mono (Espagnolette). NOT Playfair Display / DM Sans (Imprimatur). NOT Sora (Byname used Newsreader with Sora). NOT Young Serif (Cribble used Karla with Young Serif). NOT Bitter / Manrope. NOT Ibarra Real Nova / Geist Mono. NOT Cardo / Public Sans. NOT Bodoni / Nunito. NOT cargo-hold timber / letterpress tympan / locksmith casement / mason crenel / censor stamp / herald folio / mill cribble / trapper springe / pier gangway / freight waybill.

Different verbs: Score swallowed, Admit unbound, Pin idle piped, Seed swallowed, Reset to piped, Load fixtures, Bind the plate, Tear down stdin.

Different idle: **piped**. Different seeded: **swallowed**. HOLD: **piped** / **unbound**. ALARM: **swallowed** / **editor-renders** / **keys-dead** / **parent-consuming** / **conpty-mux** / **gui-workaround** / **node-repro** / **control-matrix** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/ptybind/hook/ptybind.test.mjs
node projects/ptybind/hook/ptybind.mjs projects/ptybind/data/92757.json
node projects/ptybind/hook/ptybind.mjs projects/ptybind/data/piped.json
echo '{"seed":"swallowed","swallowed":true}' | node projects/ptybind/hook/index.mjs
```

Open the living card at `projects/ptybind/index.html` (or the live path `/ptybind/`). Buttons: Score swallowed, Admit unbound, Pin idle piped, Seed swallowed, Load fixtures, Reset to piped. Bind the plate. Tear down stdin. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/ptybind/
- Subdomain: https://ptybind.hermes-playground-green.vercel.app
- Folder: `projects/ptybind/`

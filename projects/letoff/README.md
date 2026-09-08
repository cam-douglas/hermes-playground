# Letoff

A **piano let-off / action-rail gauge** — cream workshop, ivory-and-ebony keybed, brass rail, felt hammer, let-off screw; Lora + Plus Jakarta Sans + Cousine — for a real Claude Code defect: **WINDOWS SHIFT+ENTER IS INDISTINGUISHABLE FROM ENTER BECAUSE LIBUV'S CONSOLE-TO-VT TRANSLATION DROPS MODIFIERS.** When a hypothetical ENABLE_VIRTUAL_TERMINAL_INPUT or ReadConsoleInputW path keeps Shift on the hammer, the rail is **meshed**.

Primary:

- [anthropics/claude-code#92771](https://github.com/anthropics/claude-code/issues/92771) (OPEN, bug, has repro, platform:windows, area:tui, keybindings). Title: `Windows: Shift+Enter indistinguishable from Enter (modifiers dropped by libuv console-to-VT translation)`. Filed 2026-09-08T03:49:28Z.

13:50 letoff: a piano let-off / action-rail gauge that should keep Shift meshed through VT so shift+enter→chat:newline fires; instead libuv flattens Shift+Enter to bare Enter; score flattened or admit meshed.

Score flattened or admit meshed.

Idle word: **chorded** (HOLD: Shift retained; chat:newline would fire). Seeded state: **flattened** / #92771. Admit word: **meshed**. Never idle as piped, berthed, lean, attentive, waived, bricked, unrung, swallowed, echoed, laden, deaf, shed, remounted, refused, imprinted, unbound. Never seeded as swallowed, echoed, laden, deaf, refused, imprinted, unbound.

**Letoff** = the jack should keep the Shift finger on the hammer through the key event. Measured, libuv lets the shift off and forwards only bare Enter (`0d`).

- **chorded** = IDLE: HOLD; Shift retained through the key event so chat:newline would fire
- **flattened** = seeded word / #92771 path: libuv console-to-VT drops dwControlKeyState; Shift+Enter ≡ Enter (`0d`)
- **meshed** = admit hold: modifier path retained through VT / ReadConsoleInput handled
- **runtime-split** = same ConPTY session: Codex and Grok CLI work; Claude Code Bun/libuv and Antigravity Node/libuv broken
- **console-intact** = .NET ReadKey shows mods=Shift for Shift+Enter; INPUT_RECORD carries Shift/Alt/Control
- **libuv-collision** = process.stdin raw: Enter→0d, Shift+Enter→0d, Alt+Enter→0d, Ctrl+Enter→0a
- **kitty-allowlist** = enablement is a hardcoded terminal-name list; TERM=xterm-256color never enables; KITTY_WINDOW_ID=1 still fails
- **kitty-parsed-unused** = kittyKeyboard parser exists but the result is never consumed; after CSI > 1 u still 0d
- **ctrl-enter-workaround** = Ctrl+Enter emits 0a and works on Windows today
- **control-matrix** = console keeps modifiers; libuv collapses Shift/Alt; Rust CLIs in the same session keep Shift
- **cousins** = cite-only #87888 OPEN, #92021 OPEN, generic node/libuv uv_tty; primary stays #92771
- **has-clear-repro** = issue labeled has repro

Verdicts: chorded, flattened, meshed, runtime-split, console-intact, libuv-collision, kitty-allowlist, kitty-parsed-unused, ctrl-enter-workaround, control-matrix, has-clear-repro, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a Shift+Enter chord would leave the rail **flattened** or already **meshed**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): libuv uv_tty raw reader translates VK_RETURN to `\r` without consulting dwControlKeyState; ENABLE_VIRTUAL_TERMINAL_INPUT would bypass. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92771](https://github.com/anthropics/claude-code/issues/92771)
- Cousins cite-only (NOT primary): [anthropics/claude-code#87888](https://github.com/anthropics/claude-code/issues/87888) OPEN — ctrl+enter / shift+enter never reach the keybinding matcher on Windows Terminal. [anthropics/claude-code#92021](https://github.com/anthropics/claude-code/issues/92021) OPEN — WezTerm kitty "report alternate keys" shifted-key field never parsed. Generic node/libuv `uv_tty` Windows console-to-VT translation (class named by the issue, not a separate thesis).

What happened (from the issue body — do not invent):

- Claude Code 2.1.263 (native binary, Bun v1.4.1); Windows 11 Pro 10.0.26200; Netcatty (Electron + xterm.js over ConPTY); `TERM=xterm-256color`; PowerShell; filed 2026-09-08T03:49:28Z; labels bug, has repro, platform:windows, area:tui, keybindings; OPEN
- Reporter: GOUKI9999
- `keybindings.json` `shift+enter` → `chat:newline` never fires; Shift+Enter submits the message
- Windows console INPUT_RECORD carries Shift/Alt/Control correctly (.NET ReadKey shows mods=Shift for Shift+Enter)
- libuv/Bun `process.stdin` raw mode: Enter→0d, Shift+Enter→0d (collision), Alt+Enter→0d, Ctrl+Enter→0a (only Ctrl distinguishable because the console assigns char 10)
- Runtime table, same ConPTY session: Codex (Rust/crossterm) works; Grok CLI works; Claude Code Bun/libuv broken; Antigravity Node/libuv broken — split follows runtime not terminal
- kitty capability query replies `ESC[?0u` through ConPTY/libuv, but after `CSI > 1 u` Shift+Enter is still 0d (modifier already gone)
- kitty enablement is a hardcoded allowlist of terminal names; TERM fallback means `xterm-256color` never enables; `KITTY_WINDOW_ID=1` still fails Shift+Enter
- kittyKeyboard parser exists (`type:"kittyKeyboard"`) but the result is never consumed
- Suggested fixes in the issue: ENABLE_VIRTUAL_TERMINAL_INPUT; or ReadConsoleInputW like crossterm; or enable kitty from the query not the allowlist
- Workaround: Ctrl+Enter works today

Problem found: WINDOWS SHIFT+ENTER INDISTINGUISHABLE FROM ENTER — LIBUV CONSOLE-TO-VT DROPS MODIFIERS.

Why this solution: a diagnostic scorer for the chorded → flattened / meshed let-off chain, so a reader can pin idle chorded, seed flattened (#92771 path), and score runtime-split / console-intact / libuv-collision / kitty-allowlist / kitty-parsed-unused / ctrl-enter-workaround / control-matrix / cousins against the published facts.

## Why not a clone

This is specifically: **WINDOWS SHIFT+ENTER INDISTINGUISHABLE FROM ENTER — LIBUV CONSOLE-TO-VT DROPS MODIFIERS**.

**NOT Ptybind/#92757** (Ctrl+G external editor renders but keys swallowed by ConPTY parent ReadConsoleInput race — already shipped). Do not touch Ptybind.

**NOT Espagnolette/#92694** (AskUserQuestion selection keys dead after window refocus — already shipped). Do not touch Espagnolette.

**NOT Dunnage/#92746**. **NOT Setoff/#92750**. **NOT Imprimatur/#92740**. **NOT Byname/#92738**. **NOT Crenel/#92729**. **NOT Quietus/#92716**.

Different paradigm: **libuv console-to-VT drops dwControlKeyState so Shift+Enter collides with Enter; runtime-level modifier loss, not mux editor handoff**.

Cousins cite-only (NOT primary): #87888 OPEN, #92021 OPEN, generic node/libuv uv_tty. Do not auto-pick as thesis.

Do NOT rename this product Ptybind, Dunnage, Setoff, Espagnolette, Imprimatur, or Byname.
Do NOT reuse idle piped / berthed / lean / attentive / waived / bricked / unrung / swallowed / echoed / laden / deaf / shed / remounted / refused / imprinted / unbound.

Different surface: libuv console-to-VT modifier drop vs Ctrl+G ConPTY mux editor input race / RemoteTrigger list cursor ignore / subagent first-request attachments / AskUserQuestion dead keys / Skip-mode first Artifact publish / Desktop slash false-negative byname.

Product name stays **Letoff**. Name/slug `letoff` confirmed unused in catalog.json (218 products before this ship; Ptybind is #218).

Different UI: piano workshop / action-rail gauge / ivory-and-ebony keybed / cream ink brass / let-off screw / felt hammer. Lora / Plus Jakarta Sans / Cousine. NOT Newsreader / Karla / IBM Plex Mono (Ptybind). NOT Literata / Red Hat Text / Fira Code (Dunnage). NOT DM Serif Display / Commissioner / Azeret Mono (Setoff). NOT Instrument Serif / Figtree / JetBrains Mono (Espagnolette). NOT CRT phosphor green plate. NOT cargo-hold timber / letterpress tympan / locksmith casement.

Different verbs: Score flattened, Admit meshed, Pin idle chorded, Seed flattened, Reset to chorded, Load fixtures, Drop the let-off, Mesh the jack.

Different idle: **chorded**. Different seeded: **flattened**. HOLD: **chorded** / **meshed**. ALARM: **flattened** / **runtime-split** / **console-intact** / **libuv-collision** / **kitty-allowlist** / **kitty-parsed-unused** / **ctrl-enter-workaround** / **control-matrix** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/letoff/hook/letoff.test.mjs
node projects/letoff/hook/letoff.mjs projects/letoff/data/92771.json
node projects/letoff/hook/letoff.mjs projects/letoff/data/chorded.json
echo '{"seed":"flattened","flattened":true}' | node projects/letoff/hook/index.mjs
```

Open the living card at `projects/letoff/index.html` (or the live path `/letoff/`). Buttons: Score flattened, Admit meshed, Pin idle chorded, Seed flattened, Load fixtures, Reset to chorded. Drop the let-off. Mesh the jack. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/letoff/
- Subdomain: https://letoff.hermes-playground-green.vercel.app
- Folder: `projects/letoff/`

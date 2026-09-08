# Letoff fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92771 issue facts: Windows Shift+Enter is indistinguishable from Enter because libuv's console-to-VT translation drops modifiers. Score flattened or admit meshed.

Idle word: **chorded**. Seeded word: **flattened**. HOLD: **chorded** / **meshed**. ALARM: **flattened** / **runtime-split** / **console-intact** / **libuv-collision** / **kitty-allowlist** / **kitty-parsed-unused** / **ctrl-enter-workaround** / **control-matrix** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92771](https://github.com/anthropics/claude-code/issues/92771).

Fixtures record the published incident (console INPUT_RECORD intact; libuv 0d collision; runtime split; kitty allowlist; kittyKeyboard unused; Ctrl+Enter workaround). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `chorded.json` | chorded | Idle rail. HOLD: Shift retained so chat:newline would fire. |
| `flattened.json` | flattened | Seeded #92771 path. ALARM: Shift+Enter → 0d collision. |
| `meshed.json` | meshed | Admit hold. Modifier path retained through VT / ReadConsoleInput handled. |
| `92771.json` | flattened | Primary fixture alias for #92771. |
| `runtime-split.json` | runtime-split | Codex/Grok work; Claude Code and Antigravity broken. Split follows runtime. |
| `console-intact.json` | console-intact | .NET ReadKey shows mods=Shift for Shift+Enter. |
| `libuv-collision.json` | libuv-collision | process.stdin raw: Enter and Shift+Enter both 0d. |
| `kitty-allowlist.json` | kitty-allowlist | TERM=xterm-256color never enables; KITTY_WINDOW_ID=1 still fails. |
| `kitty-parsed-unused.json` | kitty-parsed-unused | kittyKeyboard parsed then discarded; after CSI > 1 u still 0d. |
| `ctrl-enter-workaround.json` | ctrl-enter-workaround | Ctrl+Enter emits 0a and works today. |
| `control-matrix.json` | control-matrix | Console keeps mods; libuv collapses Shift/Alt; Rust CLIs keep Shift. |
| `cousins.json` | cousins | Cite-only #87888 OPEN, #92021 OPEN, generic node/libuv. Primary stays #92771. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the action rail. |

Drop any file onto `projects/letoff/index.html` or paste the JSON. The living page admits **chorded** / idle rail / #92771.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

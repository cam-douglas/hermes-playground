# Ptybind fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92757 issue facts: Ctrl+G external editor renders correctly but receives no keystrokes inside ConPTY multiplexers on Windows. Score swallowed or admit unbound.

Idle word: **piped**. Seeded word: **swallowed**. HOLD: **piped** / **unbound**. ALARM: **swallowed** / **editor-renders** / **keys-dead** / **parent-consuming** / **conpty-mux** / **gui-workaround** / **node-repro** / **control-matrix** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92757](https://github.com/anthropics/claude-code/issues/92757).

Fixtures record the published incident (editor draws; `i` / Esc / Ctrl+C dead; parent later consumes an `i`; Node `stdio: 'inherit'` repro; `gvim -f` works; control matrix). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `piped.json` | piped | Idle plate. HOLD: editor receives keys / input correctly handed to child. |
| `swallowed.json` | swallowed | Seeded #92757 path. ALARM: parent still consuming; keys dead. |
| `unbound.json` | unbound | Admit hold. Parent stdin fully torn down before spawn so the editor gets keys. |
| `92757.json` | swallowed | Primary fixture alias for #92757. |
| `editor-renders.json` | editor-renders | Editor draws correctly; the pane survives; only input is lost. |
| `keys-dead.json` | keys-dead | `i`, Esc and Ctrl+C are all dead. |
| `parent-consuming.json` | parent-consuming | An `i` intended for the editor later appeared in Claude's own prompt. |
| `conpty-mux.json` | conpty-mux | Failure is Claude Code / raw-mode Node inside psmux / wtmux. |
| `gui-workaround.json` | gui-workaround | `gvim -f` never touches the terminal input path and works. |
| `node-repro.json` | node-repro | 13-line Node raw-mode + `stdio: inherit` fails with no Claude Code. |
| `control-matrix.json` | control-matrix | Works outside the mux / GUI editor; fails in ConPTY mux. |
| `cousins.json` | cousins | Cite-only #73301 CLOSED, #84264 OPEN, #58664 CLOSED, #88775 OPEN. Primary stays #92757. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the bind plate. |

Drop any file onto `projects/ptybind/index.html` or paste the JSON. The living page admits **piped** / idle plate / #92757.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

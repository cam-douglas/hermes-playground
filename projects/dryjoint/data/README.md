# Dryjoint fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92809 issue facts: VS Code extension chat markdown file links are styled as links but clicking them does nothing. The host already has a working `open_file` bridge (file chips, diff view). Rendered `<a>` anchors never call it. A second dry joint: `showTextDocument(uri).then(cb)` has no rejection handler, so `.png` / `.pdf` reject silent. Score dry or admit bonded.

Idle word: **fused**. Seeded word: **dry**. HOLD: **fused** / **bonded**. ALARM: **dry** / **unwired-anchor** / **bridge-exists-unused** / **silent-binary-reject** / **showTextDocument-no-catch** / **markdown-mandate** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92809](https://github.com/anthropics/claude-code/issues/92809).

Fixtures record the published incident (`[note.md](docs/note.md)` + `[chart.png](docs/chart.png)`; click is a silent no-op; file chips still use the bridge). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `fused.json` | fused | Idle pad. HOLD: chat anchors call the existing `open_file` bridge. |
| `dry.json` | dry | Seeded #92809 path. ALARM: anchors never call the bridge. |
| `bonded.json` | bonded | Admit hold. Hypothetical wired anchors + catch. |
| `92809.json` | dry | Primary fixture alias for #92809. |
| `unwired-anchor.json` | unwired-anchor | Rendered `<a>` never call `openFile()`. |
| `bridge-exists-unused.json` | bridge-exists-unused | File chips + diff view already use the bridge. |
| `silent-binary-reject.json` | silent-binary-reject | `.png` / `.pdf` reject; user sees nothing. |
| `showTextDocument-no-catch.json` | showTextDocument-no-catch | `.then(cb)` has no rejection handler. |
| `markdown-mandate.json` | markdown-mandate | System prompt mandates `[name](path)`. |
| `cousins.json` | cousins | Cite-only #10846 #16056 #44713 #51015 #57100 #72889. Primary stays #92809. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the joint. |

Drop any file onto `projects/dryjoint/index.html` or paste the JSON. The living page admits **fused** / idle pad / #92809.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

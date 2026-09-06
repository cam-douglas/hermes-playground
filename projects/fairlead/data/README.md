# Fairlead fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92403 issue facts: Shift+dragging a file from the VS Code Explorer into the Claude Code panel does nothing when the window is connected to a remote (Remote-WSL, Remote-SSH, Dev Containers). No `@mention`, no attachment, no error. The webview drop handler accepts only `file://` URIs; remote windows produce `vscode-remote://` URIs. The helper returns null on non-`file://`; the drop is discarded silently. Drag detection is scheme-agnostic, so the overlay still appears. The `codeeditors` branch prefers `resource.external` (the `vscode-remote://` string) over `fsPath`.

Idle word: **unguided**. Seeded word: **dropped**. Contrast: **led** / **normalized** / **fsPath-prefer** / **local-file-ok**. Primary: [anthropics/claude-code#92403](https://github.com/anthropics/claude-code/issues/92403). Seed primary as dropped / vscode-remote helper-null / silent discard.

| File | Verdict | What it scores |
|---|---|---|
| `unguided.json` | unguided | Idle fairlead fence. Helper only guides `file://`; remote scheme already unguided. |
| `dropped.json` | dropped | Seeded #92403. Remote Explorer drop discarded silently. Admit the path already dropped. |
| `92403.json` | dropped | Primary fixture alias for #92403. |
| `repro.json` | dropped | Published Remote-WSL Shift+drag repro. Overlay appears; release inserts nothing. |
| `remote-null.json` | dropped | Helper returns null on `vscode-remote://`; drop discarded. |
| `overlay-lies.json` | unguided | Drag detection is scheme-agnostic; overlay appears; failure looks like a no-op. |
| `codeeditors-external.json` | dropped | `codeeditors` branch prefers `resource.external` over `fsPath`; same fail. |
| `local-file-ok.json` | local-file-ok | Contrast. Local window `file://` drop still inserts `@path`. |
| `led.json` | led | Contrast hold. Rope through the fairlead; `@mention` inserted. |
| `remediation-normalize.json` | normalized | Expected fix: map `vscode-remote://authority/path` → `file:///path`. |
| `remediation-fspath.json` | fsPath-prefer | Expected fix: prefer `resource.fsPath` in the `codeeditors` branch. |
| `ruled-out-or-workarounds.json` | unguided | Workarounds only: type `@` and pick; OS Explorer `dataTransfer.files`; Copy Relative Path. |
| `cousins.json` | stay-off | Cite-only cousins #21044 closed (Cursor Remote-SSH drop), #25128 open (VS Code panel DnD). |
| `fixtures.json` | index | Row list for the hawse-pipe / chock-rail deck. |

Drop any file onto `projects/fairlead/index.html` or paste the JSON. The living page seeds **dropped** / vscode-remote helper-null / silent discard.

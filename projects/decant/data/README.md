# Decant fixtures

Diagnostic JSON only. No live Claude sessions. No real tokens. Encoded from #92515 issue facts: Claude Desktop passes only PATH from the login shell to Claude Code sessions; every other variable is dropped. Score skimmed or admit intact.

Idle word: **skimmed**. Seeded word: **intact**. HOLD: **intact**. ALARM: **skimmed** / **path-only** / **marker-unset** / **probed-0-of-8** / **disclaimer-path-merge** / **spawn-inherits** / **cousins**. Primary: [anthropics/claude-code#92515](https://github.com/anthropics/claude-code/issues/92515).

Eight probed credential/path variable **names are withheld**. Fixtures record counts only (`probedHitCount` 0 or 8). The named repro marker is `MARKER_FROM_ZPROFILE` from `~/.zprofile`.

| File | Verdict | What it scores |
|---|---|---|
| `skimmed.json` | skimmed | Idle cellar rack. Only PATH poured. Credentials as lees. |
| `intact.json` | intact | Seeded hold. Entire login-shell env poured. |
| `92515.json` | skimmed | Primary fixture alias for #92515. |
| `path-only.json` | path-only | Fully repaired PATH; other login-shell vars dropped. |
| `marker-unset.json` | marker-unset | `MARKER_FROM_ZPROFILE` UNSET; PATH still login-shell. |
| `probed-0-of-8.json` | probed-0-of-8 | Desktop 0/8; Terminal 8/8. Names withheld. |
| `disclaimer-path-merge.json` | disclaimer-path-merge | Jump 14→45 is PATH merge only. |
| `spawn-inherits.json` | spawn-inherits | Hooks + stdio MCP inherit the skim. |
| `terminal-full.json` | intact | Terminal-launched claude: 67 vars, 8/8. |
| `vscode-full.json` | intact | VS Code ext 2.1.260: 72 vars, 8/8; same bare 14 on main. |
| `cousins.json` | cousins | Cite-only #90074 #82890. |
| `fixtures.json` | index | Row list for the cellar rack. |

Drop any file onto `projects/decant/index.html` or paste the JSON. The living page admits **skimmed** / PATH-only pour / #92515.

Do not launch the app from a terminal to test (`open -a` contaminates). Control: main process must show ~14 vars + 4-dir PATH.

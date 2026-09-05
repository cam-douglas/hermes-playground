# Pasteboard fixtures

Diagnostic JSON only. No credentials. No payloads. Encoded from #92312 issue facts: `chat:imagePaste`, `Alt+V` only on Windows/WSL, Linux/macOS `Ctrl+V` only, WSL both additively, VTE terminal-steal, `image/png`, proposed additive bind.

Idle word: **stuck**. Seeded word: **missed**. Primary: [anthropics/claude-code#92312](https://github.com/anthropics/claude-code/issues/92312).

| File | Verdict | What it scores |
|---|---|---|
| `stuck.json` | stuck | Idle hold. Image chip affixed via a working `chat:imagePaste` chord. |
| `missed.json` | missed | Seeded #92312. Alt+V no-op on Linux; pasteboard blank. |
| `92312.json` | missed | Primary fixture alias for #92312. |
| `hold.json` | hold | persistHold keeps the chip affixed. |
| `windows-alt.json` | windows-alt | Windows binds `Alt+V` for `chat:imagePaste`. |
| `wsl-both.json` | wsl-both | WSL binds both `Alt+V` and `Ctrl+V`. |
| `linux-ctrl-only.json` | linux-ctrl-only | Linux/macOS bind `Ctrl+V` only. |
| `terminal-steal.json` | terminal-steals-ctrlv | VTE owns `Ctrl+V`; Linux has zero working image-paste shortcut. |
| `additive-fix.json` | additive-fix | Proposed: bind `Alt+V` additively on every platform. |
| `image-png.json` | has-clear-repro | Clipboard offers `image/png`; Alt+V still does nothing. |
| `cousins.json` | cite-only | #74424 (stale same symptom). #88898 / #8324 (clipboard tooling). Cite only. |
| `fixtures.json` | index | Row list for the scoring desk. |

Drop any file onto `projects/pasteboard/index.html` or paste the JSON. The living page seeds **missed**.

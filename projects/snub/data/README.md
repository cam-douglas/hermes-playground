# Snub fixtures

Diagnostic JSON only. No credentials. No payloads. Paths fictionalized as `/tmp/probe.txt` and `$HOME/<demo-home>/mix.exs`. Sizes, which bash, hang vs OK, `truncated:true` only.

Idle word: **flowing**. Seeded word: **snubbed**. Primary: [anthropics/claude-code#92262](https://github.com/anthropics/claude-code/issues/92262).

| File | Verdict | What it scores |
|---|---|---|
| `flowing.json` | flowing | Idle hold. `/bin/bash` 3.2.57 mid-size heredoc completes; target intact. |
| `snubbed.json` | snubbed | Seeded #92262. Homebrew 5.3.15 · ~2 KB heredoc hang 120s · target 0 B. |
| `edge-496-ok.json` | edge-496-ok | 496 B OK — under the 512 B macOS pipe cliff. |
| `edge-600-snub.json` | edge-600-snub | ~600 B HANGS — just past the cliff; target 0 B. |
| `large-100kb-ok.json` | large-100kb-ok | 100 KB OK — temp-file fallback at ≥65536. |
| `homebrew-path.json` | homebrew-path | PATH-resolved bash picks Homebrew 5.1+; truncate-before-body. |
| `system-bash-ok.json` | system-bash-ok | `/bin/bash` 3.2.57 not affected. |
| `compat44-mitigation.json` | compat44-mitigation | `shopt -s compat44` restores pre-5.1 temp-file heredocs. |
| `cousins.json` | cite-only | #33768, #44564, #62813, #92178, #88041. Backups #92257, #92259, #92228. |
| `fixtures.json` | index | Row list for the scoring desk. |

Drop any file onto `projects/snub/index.html` or paste the JSON. The living page seeds **snubbed**.

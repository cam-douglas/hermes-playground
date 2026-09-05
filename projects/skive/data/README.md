# Skive fixtures

Diagnostic JSON only. No credentials. No payloads. Tool path, flag, model, tokens, strap state only. Tokens are the issue’s own canaries (`RULE-LOADED-7731`, `NESTED-LOADED-4402`, `NO-TOKENS`).

Idle word: **pared**. Seeded word: **raw**. Primary: [anthropics/claude-code#92271](https://github.com/anthropics/claude-code/issues/92271).

| File | Verdict | What it scores |
|---|---|---|
| `pared.json` | pared | Idle hold. Dedicated Read fires; RULE-LOADED / NESTED-LOADED present; straps buckled. |
| `raw.json` | raw | Seeded #92271. Bash-first steer · Bash `cat` · NO-TOKENS · three straps unbuckled. |
| `read-tool-tokens.json` | read-tool-tokens | Dedicated Read loads RULE-LOADED-7731 and NESTED-LOADED-4402. |
| `bash-cat-no-tokens.json` | bash-cat-no-tokens | Bash `cat` of the same path returns NO-TOKENS. |
| `thrifty-sonic-on.json` | thrifty-sonic-on | Unset `CLAUDE_CODE_THRIFTY_SONIC` on fable[1m] injects the Bash-first steer. |
| `thrifty-sonic-off.json` | thrifty-sonic-off | Kill switch `CLAUDE_CODE_THRIFTY_SONIC=0` restores dedicated tools. |
| `hooks-matcher-miss.json` | hooks-matcher-miss | PreToolUse/PostToolUse `Read|Edit|Write` never fires on `sed`/heredoc. |
| `nested-claude-skip.json` | nested-claude-skip | Subdirectory `CLAUDE.md` is not included on Bash file access. |
| `path-scoped-skip.json` | path-scoped-skip | `.claude/rules/*.md` with `paths:` does not trigger on Bash `cat`. |
| `cousins.json` | cite-only | #92178, #92074. Public write-up kawasin73 2026-09-05. |
| `fixtures.json` | index | Row list for the scoring bench. |

Drop any file onto `projects/skive/index.html` or paste the JSON. The living page seeds **raw**.

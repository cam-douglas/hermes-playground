# Muzzle fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92459 issue facts: both `--safe-mode` and `--disable-slash-commands` are documented to disable skills. Neither removes `skill_listing` or `agent_listing_delta` from the actual API request (JSONL-verified; attachment content/size unchanged; input_tokens nearly identical to an unflagged baseline). Only a log line is suppressed under `--disable-slash-commands`. `--bare` excises both attachments and also kills Agent-tool delegation. Score leaking or admit excised.

Idle word: **leaking**. Seeded word: **excised**. HOLD: **excised** / **bare-excised**. ALARM: **leaking** / **safe-mode-leak** / **disable-slash-leak** / **log-suppressed-only** / **cousins**. Special: **agent-tool-killed**. Primary: [anthropics/claude-code#92459](https://github.com/anthropics/claude-code/issues/92459). Seed primary as leaking / sleeve seated / blast still vents.

| File | Verdict | What it scores |
|---|---|---|
| `leaking.json` | leaking | Idle leak fence. Attachments still on the wire under documented disable flags. |
| `excised.json` | excised | Seeded hold. `--bare` removes both attachments. |
| `92459.json` | leaking | Primary fixture alias for #92459. |
| `settings.json` | safe-mode-leak | Docs promise skills disabled; live attachments still present. |
| `safe-mode-leak.json` | safe-mode-leak | `--safe-mode` help lists skills; `skill_listing` fully present. |
| `disable-slash-leak.json` | disable-slash-leak | `--disable-slash-commands` documented disable; attachments stay. |
| `log-suppressed-only.json` | log-suppressed-only | Log line suppressed; underlying attachment unaffected. |
| `bare-excised.json` | bare-excised | `--bare` removes both attachments. |
| `agent-tool-killed.json` | agent-tool-killed | `--bare` side-effect: Agent-tool delegation fail/no-op. |
| `cousins.json` | cousins | Cite-only #60251 CLOSED/locked and #89327 live. |
| `fixtures.json` | index | Row list for the suppressor-bay lab. |

Drop any file onto `projects/muzzle/index.html` or paste the JSON. The living page admits **leaking** / sleeve seated / blast still vents / #92459.

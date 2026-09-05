# Portcullis fixtures

Diagnostic JSON only. No credentials. No payloads. Ancestor mode, probe, errno, unreadReason, fail-close, named path only.

Idle word: **barred**. Seeded word: **dropped**. Primary: [anthropics/claude-code#92278](https://github.com/anthropics/claude-code/issues/92278).

| File | Verdict | What it scores |
|---|---|---|
| `barred.json` | barred | Idle hold. Courtyard empty; no Claude Code plist; grate stays up. |
| `dropped.json` | dropped | Seeded #92278. EACCES on ancestor · accessSync · fail-close armed · grate already dropped. |
| `eacces-ancestor.json` | eacces-ancestor | Jamf left `/Library/Managed Preferences` at mode `000` (`d--------- root:wheel`). |
| `exists-sync-absent.json` | exists-sync-absent | 2.1.257 / 2.1.258 `existsSync` returned false on EACCES → empty plistStdouts, no fail-close. |
| `fail-close-armed.json` | fail-close-armed | `unreadReason` record arms `policy_unreadable_fail_close`. |
| `misleading-leaf.json` | misleading-leaf | Error names the leaf plist being probed, not the untraversable ancestor. |
| `cousins.json` | cite-only | #91816 (WSL `/mnt/c` inaccessible). Same defect class. Cite only. |
| `fixtures.json` | index | Row list for the scoring desk. |

Drop any file onto `projects/portcullis/index.html` or paste the JSON. The living page seeds **dropped**.

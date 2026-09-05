# Ward fixtures

Diagnostic JSON only. No credentials. No payloads. Paths fictionalized as `$HOME/<demo-home>/.claude` and `keychain:<demo-unset-slot>` / `keychain:<demo-explicit-slot>`.

Idle word: **matched**. Seeded word: **warded**. Primary: [anthropics/claude-code#92252](https://github.com/anthropics/claude-code/issues/92252).

| File | Verdict | What it scores |
|---|---|---|
| `matched.json` | matched | Idle hold. Env unset; resolved path is the true default; same Keychain slot; `loggedIn` true. |
| `warded.json` | warded | Seeded #92252. Explicit `CLAUDE_CONFIG_DIR=$HOME/.claude`; different/empty Keychain entry; `loggedIn` false; no diagnosis. |
| `trailing-slash-warded.json` | trailing-slash-warded | `CLAUDE_CONFIG_DIR="$HOME/.claude/"` still `loggedIn` false. |
| `securestorage-sibling-warded.json` | securestorage-sibling | `CLAUDE_SECURESTORAGE_CONFIG_DIR="$HOME/.claude"` still `loggedIn` false. |
| `workaround-empty-securestorage.json` | workaround-empty-pin | Empty `CLAUDE_SECURESTORAGE_CONFIG_DIR` restores `loggedIn` true but nulls email / orgId. |
| `silent-forward.json` | silent-forward | Automation injects the default path into children. |
| `no-store-diagnosis.json` | no-store-diagnosis | Auth status never prints which credential store was consulted. |
| `keychain-only.json` | keychain-only | No `~/.claude/.credentials.json`; Keychain is the only store. |
| `cousins.json` | cite-only | #87447, #79223, #88601, #84275, #90527. Backups #92255, #92235, #92234. |
| `fixtures.json` | index | Row list for the scoring desk. |

Drop any file onto `projects/ward/index.html` or paste the JSON. The living page seeds **warded**.

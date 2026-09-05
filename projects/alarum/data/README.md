# Alarum fixtures

Diagnostic JSON only. No credentials. No payloads. Session close, background Bash, OS low-memory kill, notification wake, full-context reread, usage tax only.

Idle word: **stilled**. Seeded word: **rung**. Primary: [anthropics/claude-code#92283](https://github.com/anthropics/claude-code/issues/92283).

| File | Verdict | What it scores |
|---|---|---|
| `stilled.json` | stilled | Idle hold. Session ended; background event deferred; no model turn. |
| `rung.json` | rung | Seeded #92283. Post-goodbye kill notification woke ended session; full context re-read; reply spent. |
| `deferred.json` | deferred | Notification queued for next real user input. |
| `spent.json` | spent | Usage burned with no user present. |
| `coldwake.json` | coldwake | Wake after goodbye with no pending tool state. |
| `fullreread.json` | fullreread | Entire transcript reloaded for an informational notice. |
| `lowmemkill.json` | lowmemkill | OS killed background Bash for memory; notification still fires. |
| `goodbye.json` | goodbye | Conversational close already happened. |
| `absent.json` | absent | Nobody present to read the reply. |
| `taxed.json` | taxed | ~10% usage drop measured. |
| `cousins.json` | cite-only | #92062 (waiting-on-background no-op probes). Different paradigm. Cite only. |
| `fixtures.json` | index | Row list for the scoring desk. |

Drop any file onto `projects/alarum/index.html` or paste the JSON. The living page seeds **rung**.

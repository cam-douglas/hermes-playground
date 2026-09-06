# Hangfire fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92478 issue facts: on Claude Code 2.1.257, `/compact <instructions>` typed while a turn is running (queued) is sometimes dispatched at the turn boundary as a **plain user prompt** instead of executing as the slash command. The model writes a prose "summary"; no compaction; no signal that the command was dropped. Score hangfired or admit executed.

Idle word: **hangfired**. Seeded word: **executed**. HOLD: **executed**. ALARM: **hangfired** / **promptSource-queued** / **plain-prompt-path** / **missing-compact-boundary** / **long-args-suggestive** / **cousins**. Control: **idle-prompt-ok**. Primary: [anthropics/claude-code#92478](https://github.com/anthropics/claude-code/issues/92478). Seed primary as hangfired / primer delayed / round fired as prose.

| File | Verdict | What it scores |
|---|---|---|
| `hangfired.json` | hangfired | Idle hangfire fence. Queued `/compact` demoted to a plain prompt. |
| `executed.json` | executed | Seeded hold. `compact_boundary` + command stub. |
| `92478.json` | hangfired | Primary fixture alias for #92478. |
| `queue-enqueue.json` | hangfired | `queue-operation` enqueue of `/compact` mid-turn. |
| `demoted-plain-prompt.json` | promptSource-queued | Fail JSONL: `promptSource:"queued"` → `total_tokens_reminder` → prose. |
| `compact-boundary.json` | executed | Success JSONL: no `promptSource` → `file-history-snapshot` → `compact_boundary`. |
| `plain-prompt-path.json` | plain-prompt-path | Next attachment is `total_tokens_reminder`. |
| `missing-compact-boundary.json` | missing-compact-boundary | No `compact_boundary`; prose summary only. |
| `long-args-suggestive.json` | long-args-suggestive | All 7 failures ≥ 840 chars; length suggestive, not a rule. |
| `idle-prompt-ok.json` | idle-prompt-ok | Idle prompt `/compact` always executes (6/6). |
| `cousins.json` | cousins | Cite-only #85697 #76875 #92434 #92424 #90711. |
| `fixtures.json` | index | Row list for the delayed-primer bay. |

Drop any file onto `projects/hangfire/index.html` or paste the JSON. The living page admits **hangfired** / primer delayed / round fired as prose / #92478.

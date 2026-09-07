# Larum fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92563 issue facts: a completed background-task `<task-notification>` is enqueued, dequeued, and appended to the session as a user-role message — then no assistant turn ever starts. Score unanswered or admit roused.

Idle word: **unanswered**. Seeded word: **roused**. HOLD: **roused** / **delivered-and-roused**. ALARM: **unanswered** / **last-of-batch** / **synthetic-repair** / **cousins**. Primary: [anthropics/claude-code#92563](https://github.com/anthropics/claude-code/issues/92563).

Fixtures record the published fingerprint, representative timeline, drop rate, and environment. No live session. No secrets.

| File | Verdict | What it scores |
|---|---|---|
| `unanswered.json` | unanswered | Idle tower. Notice written into history; no assistant turn. |
| `roused.json` | roused | Seeded hold. Assistant turn starts after the notice. |
| `92563.json` | unanswered | Primary fixture alias for #92563. |
| `last-of-batch.json` | last-of-batch | Last pending notice of a parallel batch; nothing else to wake. |
| `delivered-and-roused.json` | delivered-and-roused | ~99% path: enqueue → dequeue → notice → assistant. |
| `synthetic-repair.json` | synthetic-repair | Harness repair pair after a human nudge. |
| `cousins.json` | cousins | Cite-only #21165 #39632 #75043 #23909 #67524 #88742 #90555 #45581 #20754. |
| `fixtures.json` | index | Row list for the wake chronograph. |

Drop any file onto `projects/larum/index.html` or paste the JSON. The living page admits **unanswered** / completed-notice-with-no-turn / #92563.

Timelines are diagnostic reconstructions of the issue's published fingerprint. This assay does not run Claude.

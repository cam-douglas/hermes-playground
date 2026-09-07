# Bitts fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92573 issue facts: a `.claude/worktrees/<name>` pool slot from `Agent(isolation: "worktree")` appears reused/reset while a session is still active — ~5,900 tracked files vanish as unstaged deletions; host reapers logged `keep:active` and never touched it; `git reflog` shows ≥3 unrelated branches including `reset: moving to origin/main` then detached HEAD on an unrelated commit. Score razed or admit belayed.

Idle word: **razed**. Seeded word: **belayed**. HOLD: **belayed** / **hold**. ALARM: **razed** / **slot-recycle** / **reflog-churn** / **keep-active** / **mass-deletions** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92573](https://github.com/anthropics/claude-code/issues/92573).

Fixtures record the published pool path, mass deletions, reaper audit, and reflog. No live session. No secrets.

| File | Verdict | What it scores |
|---|---|---|
| `razed.json` | razed | Idle bench. Pool slot recycled mid-session; mass unstaged deletions. |
| `belayed.json` | belayed | Seeded hold. Slot stays assigned to live session; tree intact. |
| `92573.json` | razed | Primary fixture alias for #92573. |
| `slot-recycle.json` | slot-recycle | Physical `.claude/worktrees/<name>` reassigned while session still using it. |
| `reflog-churn.json` | reflog-churn | ≥3 unrelated branches in one day; `reset: moving to origin/main`; detached unrelated HEAD. |
| `keep-active.json` | keep-active | Host reapers classified `keep:active` / never touched it. |
| `mass-deletions.json` | mass-deletions | ~5,900 tracked files vanish; `git status --short` unstaged deletions. |
| `cousins.json` | cousins | Cite-only #87349 / #73900 / #92019. Primary stays #92573. |
| `hold.json` | hold | Hold path: slot belayed; keep:active honored. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro + data-loss. |
| `fixtures.json` | index | Row list for the bitts bench. |

Drop any file onto `projects/bitts/index.html` or paste the JSON. The living page admits **razed** / worktree-pool-physical-directory-recycle / #92573.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

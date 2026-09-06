# Hardstand fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92452 issue facts: Dispatch `start_code_task` refuses a second session in a working directory that already has an active session — `[DispatchTools] start_code_task failed for ~/Projects: Another Claude Code session is already active in this directory.` The cwd is a plain (non-git) parent folder containing many git repos. Regular Claude Code sessions opened from the app (including scheduled tasks) still run concurrently in that same folder. First failure 19s after `claude-code-vm/2.1.258` install; still fails on 2.1.260. Workaround: dispatching into an individual git repo (worktree possible) still works. Score the pad or admit the hardstand already refused.

Idle word: **cleared**. Seeded word: **refused**. Contrast: **cleared** / **worktree-workaround**. Diagnostic chips: **dispatch-only** / **exclusive-cwd** / **non-git-parent** / **app-concurrent** / **scheduled-ok** / **bundle-258-regression** / **stale-block**. Primary: [anthropics/claude-code#92452](https://github.com/anthropics/claude-code/issues/92452). Seed primary as refused / Dispatch radio blocked / tower strip two live.

| File | Verdict | What it scores |
|---|---|---|
| `cleared.json` | cleared | Idle hardstand fence. Pad open for another Dispatch landing. |
| `refused.json` | refused | Seeded #92452. Dispatch start_code_task rejected on non-git ~/Projects. |
| `92452.json` | refused | Primary fixture alias for #92452. |
| `repro.json` | refused | Published repro: second Dispatch landing on a non-git parent refused. |
| `settings.json` | refused | Expected parallel Dispatch; live radio refuses the second. |
| `dispatch-only.json` | dispatch-only | Only `mcp__dispatch__start_code_task` is rejected. |
| `exclusive-cwd.json` | exclusive-cwd | Cousin #91745 asar: exclusiveCwd hardcoded true. Hypothesis only for #92452. |
| `non-git-parent.json` | non-git-parent | Plain parent folder containing ~14 git repos. |
| `app-concurrent.json` | app-concurrent | 2026-09-06 app opened two ~/Projects sessions 29s apart; both active. |
| `scheduled-ok.json` | scheduled-ok | Scheduled tasks still open overlapping sessions daily. |
| `bundle-258-regression.json` | bundle-258-regression | First refuse 19s after 2.1.258; still fails on 2.1.260. |
| `worktree-workaround.json` | worktree-workaround | Individual git repo pad still accepts Dispatch. |
| `stale-block.json` | stale-block | Cousin #92462. Finished non-archived records still occupy the pad. |
| `cousins.json` | cousins | Cite-only #91745 CLOSED and #92462 OPEN. |
| `fixtures.json` | index | Row list for the night-apron / hardstand lab. |

Drop any file onto `projects/hardstand/index.html` or paste the JSON. The living page seeds **refused** / Dispatch radio blocked / tower strip two live / non-git ~/Projects / bundle 2.1.258.

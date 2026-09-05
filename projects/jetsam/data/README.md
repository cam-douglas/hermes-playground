# Jetsam fixtures

Diagnostic JSON only. No payloads. No live git remote. Encoded from #92338 issue facts: `~/.claude/stop-hook-git-check.sh` picks its comparison ref with `git rev-parse "origin/$current_branch"`. That answers "does this local ref exist", not "does this branch still exist on the remote". After GitHub auto-deletes a squash-merged head branch, the local `origin/<branch>` tracking ref survives until pruned, still resolves, and `origin/<stale>..HEAD` counts the squash commit as unpushed. Stop hook exit 2, indefinitely. Naive substitution of the default branch as upstream silences this case and then fails a fully pushed feature branch that is legitimately ahead of main. Suggested fix: containment check against `origin/HEAD` then `origin/main` then `origin/master` before the `unpushed=` line.

Idle word: **pruned**. Seeded word: **adrift**. Primary: [anthropics/claude-code#92338](https://github.com/anthropics/claude-code/issues/92338).

| File | Verdict | What it scores |
|---|---|---|
| `pruned.json` | pruned | Idle hold. Tracking-ref gone after full fetch --prune. Exit 0. |
| `adrift.json` | adrift | Seeded #92338. Stale origin/feature still resolves. Shipped exit 2. |
| `92338.json` | adrift | Primary fixture alias for #92338. |
| `stale-ref.json` | stale-ref | `git rev-parse origin/<branch>` succeeds after remote head deleted. |
| `containment.json` | containment | HEAD is ancestor of default_ref; suggested path exits 0. |
| `naive-sub.json` | naive-sub | Fully pushed feature, 2 ahead of main. Naive FAIL, shipped/suggested pass. |
| `phantom-unpushed.json` | phantom-unpushed | Shipped banner "There are 1 unpushed commit(s)" for merged work. |
| `force-lease-stale.json` | force-lease-stale | `git push --force-with-lease` "stale info" against a missing remote ref. |
| `scoped-fetch.json` | scoped-fetch-survives | `git fetch origin main` + fetch.prune=true leaves the stale ref. |
| `full-fetch.json` | full-fetch-prunes | `git fetch origin` + fetch.prune=true prunes; hook goes quiet. |
| `re-provision.json` | re-provision-overwrite | `~/.claude/` restored ~6 min; local patch overwritten. |
| `scenario-1.json` | adrift | Matrix 1: squash-merged, stale ref, nothing to push. |
| `scenario-2.json` | genuine | Matrix 2: genuinely unpushed commit on a tracked branch. |
| `scenario-3.json` | naive-sub | Matrix 3: fully pushed feature branch, 2 ahead of main. |
| `scenario-4.json` | never-pushed | Matrix 4: never-pushed branch with work. |
| `scenario-5.json` | in-sync | Matrix 5: on the default branch, in sync. |
| `cousins.json` | stay-off | Cite-only Stop-hook cousins + stay-off catalog surfaces. |
| `fixtures.json` | index | Row list for the scoring desk. |

Drop any file onto `projects/jetsam/index.html` or paste the JSON. The living page seeds **adrift**.

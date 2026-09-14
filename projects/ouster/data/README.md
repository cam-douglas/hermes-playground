# Ouster fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94221 issue facts: worktree auto-clean yanks a worktree still used by a running nested background agent. Score ouster or admit tenanted.

Idle word: **tenanted**. Path word: **inherited-worktree-yank**. Seeded loss: **ouster**. Product: **ouster**. HOLD: **tenanted**. ALARM: **ouster** / **inherited-worktree-yank** / **worktreeCleanlyRemoved**. Primary: [anthropics/claude-code#94221](https://github.com/anthropics/claude-code/issues/94221).

Fixtures record the published incident only. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `tenanted.json` | tenanted | Idle roll. HOLD: worktree retained while nested inheritor still runs. |
| `hold.json` | hold | HOLD alias for idle tenanted. |
| `ouster.json` | ouster | Seeded #94221 path and product. ALARM: street door kicked in. |
| `inherited-worktree-yank.json` | inherited-worktree-yank | Path: auto-clean yanks inherited worktree. |
| `occupied.json` | occupied | HOLD alias: occupied flat still named on the roll. |
| `seated.json` | seated | HOLD alias: nested lodger still seated. |
| `retained.json` | retained | HOLD alias: worktree retained. |
| `locked.json` | locked | HOLD alias: iron key stays in the lock. |
| `inhabited.json` | inhabited | HOLD alias: nested child still inside. |
| `inheritedWorktreePath.json` | inheritedWorktreePath | Child inherits the same isolation worktree. |
| `spawnDepth-2.json` | spawnDepth-2 | Child meta shows spawnDepth: 2. |
| `worktreeCleanlyRemoved.json` | worktreeCleanlyRemoved | Parent-no-changes; auto-clean yanks. |
| `parent-no-changes.json` | parent-no-changes | Parent ends with no changes at 06:45:50. |
| `child-refuses-cwd.json` | child-refuses-cwd | Working directory no longer exists; Refusing to run there. |
| `six-to-eight-seconds.json` | six-to-eight-seconds | ~6–8s later the still-running child dies. |
| `token-rerun-loss.json` | token-rerun-loss | Work lost; stage re-run; tens of millions of tokens. |
| `landing.json` | landing | Georgian bailiff desk / tenancy roll / iron key. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #41010 #76377. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Georgian bailiff desk / tenancy roll / iron key. |
| `walk.json` | walk | Published idle tenanted → inherited-worktree-yank → ouster. |

## Cousins (cite only)

Different surface from #94221 inherited-worktree-yank. Do NOT rebuild. Do NOT conflate.

#41010 — worktree isolation cleanup deletes parent session working directory on agent ID collision. Distinct cousin.

#76377 — background/bridge sessions leak worktrees (no cleanup on daemon kill). Opposite polarity: leak, not yank under a living child.

#94221 is specifically: auto-clean yanking a worktree still used by a running nested inheritor.

## Backups (cite only — do NOT auto-pick or build)

#94029 #93987 #93924 #93770 #93777 #94059 #94053 #94151 #94064

Drop any file onto `projects/ouster/index.html`. Buttons load the seeded path. The tenanted page admits **tenanted** / idle roll / #94221.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

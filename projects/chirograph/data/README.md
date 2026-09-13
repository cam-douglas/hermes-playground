# Chirograph fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94045 issue facts: recorded worktree branch is never refreshed after `git branch -m`; recycle recovery dies `fatal: invalid reference` and falls back to the main repo; uncommitted work is lost and the notice names a branch that no longer exists. Score chirograph or admit matched.

Idle word: **matched**. Path word: **worktree-rename-stale**. Seeded loss: **chirograph**. Product: **chirograph**. HOLD: **matched**. ALARM: **chirograph** / **worktree-rename-stale** / **recorded-branch** / **invalid-reference**. Primary: [anthropics/claude-code#94045](https://github.com/anthropics/claude-code/issues/94045).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `matched.json` | matched | Idle indenture. HOLD: moieties correspond; recorded branch == live branch. |
| `hold.json` | hold | HOLD alias for idle matched. |
| `chirograph.json` | chirograph | Seeded #94045 path and product. ALARM: recorded moiety stale after `git branch -m`. |
| `worktree-rename-stale.json` | worktree-rename-stale | Path: recycle recovery uses the stale recorded name. |
| `bipartite.json` | bipartite | HOLD alias: both moieties still correspond. |
| `moiety.json` | moiety | HOLD alias: recorded half matches the live half. |
| `indenture.json` | indenture | HOLD alias: wavy-cut charter still one deed. |
| `current.json` | current | HOLD alias: recorded branch is current with the live worktree. |
| `recorded-branch.json` | recorded-branch | Recorded name stays at worktree-create. |
| `branch-m.json` | branch-m | `git branch -m` inside the worktree. |
| `invalid-reference.json` | invalid-reference | `git worktree add` dies `fatal: invalid reference`. |
| `pool-re-lease-failed.json` | pool-re-lease-failed | Pool re-lease and fresh-create both failed. |
| `fallback-main-repo.json` | fallback-main-repo | Session falls back to the shared main checkout. |
| `uncommitted-lost.json` | uncommitted-lost | Uncommitted files weren't carried over. |
| `false-reassurance.json` | false-reassurance | Notice names `claude/<slug>` which no longer exists. |
| `landing.json` | landing | Oak lectern landing / parchment blotter. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #54653 #53061 #85114 #85195. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Parchment / gall / wax / copper / oak / chalk / rule / ink. |
| `walk.json` | walk | Published idle matched → worktree-rename-stale → chirograph. |

## Cousins (cite only)

#54653 — closed feature request for mid-session worktree branch rename. Do not conflate.

#53061 — UI View PR sticks to original branch. Do not conflate.

#85114 — worktree dir/branch diverge. Do not conflate.

#85195 — status bar disappears after branch rename. Do not conflate.

## Backups (cite only — do NOT auto-pick or build)

#93987 #93924 #94032 #94029 #94031 #93770 #93777 #94040

Drop any file onto `projects/chirograph/index.html`. Buttons load the seeded path. The living page admits **matched** / idle indenture / #94045.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

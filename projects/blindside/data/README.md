# Blindside fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93786 issue facts: committed work in `.claude/worktrees/` is invisible to the session's diff pane because there is no compare-ref control. Score blindside or admit sighted.

Idle word: **sighted**. Path word: **compare-ref-unreachable**. Seeded loss: **blindsided**. Product: **blindside**. HOLD: **sighted**. ALARM: **blindsided** / **blindside** / **compare-ref-unreachable** / **worktree-owned** / **pane-empty** / **commits-present** / **compare-ref**. Primary: [anthropics/claude-code#93786](https://github.com/anthropics/claude-code/issues/93786).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `sighted.json` | sighted | Idle field. HOLD: compare ref / owned worktrees reachable. |
| `hold.json` | hold | HOLD alias for idle sighted. |
| `blindsided.json` | blindsided | Seeded #93786 path. ALARM: pane cannot see worktree commits. |
| `blindside.json` | blindside | Product score for the sideline-scout booth. |
| `compare-ref-unreachable.json` | compare-ref-unreachable | Path: compare side sits off the field. |
| `worktree-owned.json` | worktree-owned | Claude Code owns `.claude/worktrees/`. |
| `pane-empty.json` | pane-empty | Pane reports no changes. |
| `commits-present.json` | commits-present | `git diff main...slice-118 --stat` shows 5 files. |
| `compare-ref.json` | compare-ref | No compare-ref control. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #65852 #52179. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Night turf / chalk hash / floodlight / scout clipboard. |
| `walk.json` | walk | Published idle sighted → compare-ref-unreachable → blindsided → blindside. |

## Backups (cite only — do NOT auto-pick or build)

#93778 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782 #93800 #93795 #93821 #93811 #93809 #93834 #93823 #93825 #93797 #93780 #93779 #93776 #93769

Drop any file onto `projects/blindside/index.html`. Buttons load the seeded path. The living page admits **sighted** / idle sideline / #93786.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

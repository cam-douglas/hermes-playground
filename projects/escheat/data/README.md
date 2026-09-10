# Escheat fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93231 issue facts: VS Code window-close shutdown leaves git worktree `locked` naming a dead PID with no later reaper. Score escheat or admit released.

Idle word: **released**. Seeded word: **escheat**. Path word: **stale**. HOLD: **released** / **hold**. ALARM: **escheat** / **stale** / **window-close** / **lock-unreleased** / **dead-pid** / **prune-skips** / **remove-refuses** / **resume-hidden** / **shutdown-wrote** / **has-repro** / **cousins** / **backups** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#93231](https://github.com/anthropics/claude-code/issues/93231).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Mortmain/#93173 (sandbox `denyWithinAllow` on tracked `.claude`). Not Midden/#93081 (WorktreePool missing `.git` remound). Not Strowger/#93218. Not Mondegreen/#93193. Not Derby/#93197. Not leftover woodworking / mm-slider. Different paradigm: VS Code window-close leaves the worktree lock naming a dead PID with no later reaper.

Backups (cite in data only — do not auto-pick as primary): #93219, #93207, #93198, #93177, #93210.

| File | Verdict | What it scores |
|---|---|---|
| `released.json` | released | Idle booth. HOLD: lock given back on session end. |
| `escheat.json` | escheat | Seeded #93231 path. ALARM: crown takes the orphan worktree. |
| `93231.json` | escheat | Primary fixture alias for #93231. |
| `stale.json` | stale | Path word: later session does not reap a dead-PID lock. |
| `hold.json` | hold | HOLD alias: admit released. |
| `walk.json` | walk | Published idle → window-close → shutdown → lock → dead-pid → prune → remove → resume → escheat → stale. |
| `window-close.json` | window-close | ~20:22 VS Code closed. |
| `shutdown-wrote.json` | shutdown-wrote | `bridge-session` + `last-prompt` written. |
| `lock-unreleased.json` | lock-unreleased | lock file names pid 75688. |
| `dead-pid.json` | dead-pid | PID 75688 confirmed dead. |
| `prune-skips.json` | prune-skips | `git worktree prune` will not remove. |
| `remove-refuses.json` | remove-refuses | `git worktree remove` errors without `--force`. |
| `resume-hidden.json` | resume-hidden | `--resume` from main checkout does not list. |
| `has-repro.json` | has-repro | window-close + shutdown-wrote + dead-PID lock. |
| `cousins.json` | cousins | Cite-only #79888 #51643 #77268 #84787 #89199 #28546. |
| `backups.json` | backups | Cite-only #93219 #93207 #93198 #93177 #93210. |
| `fixtures.json` | fixtures | Row list for the escheat booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for released vs escheat. |

Clip any file onto `projects/escheat/index.html`. Buttons load the seeded path. The living page admits **released** / idle booth / #93231.

The booth reconstructs the reporter’s window-close / `bridge-session` / dead-PID lock walk from the published #93231 body. This escheat chamber does not run Claude.

# Mortmain fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93173 issue facts: Bash sandbox denies writes to `<repo>/.claude/` paths, silently corrupting the git working tree in repos that track files there. Score mortmain or admit freehold.

Idle word: **freehold**. Seeded word: **mortmain**. Path word: **phantom**. HOLD: **freehold** / **hold**. ALARM: **mortmain** / **phantom** / **deny-within-allow** / **tracked-claude-paths** / **unlink-denied** / **head-behind** / **authorless-diff** / **silent-warning** / **has-repro** / **cousins** / **backups** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#93173](https://github.com/anthropics/claude-code/issues/93173).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Strowger/#93218 (Desktop `--disallowedTools SendMessage`). Not Mondegreen/#93193 (worktree Bash substring git). Not Derby/#93197 (npm-global race). Not Vizard/#93190 (Desktop `/plan` intercept). Not Dead Air/#93155 (silent 900s API stall). Not leftover woodworking / mm-slider. Different paradigm: sandbox `denyWithinAllow` freezes tracked `.claude` paths so git cannot unlink them.

Backups (cite in data only — do not auto-pick as primary): #93182, #93219, #93207, #93198, #93177, #93210.

| File | Verdict | What it scores |
|---|---|---|
| `freehold.json` | freehold | Idle booth. HOLD: tracked paths alienable. |
| `mortmain.json` | mortmain | Seeded #93173 path. ALARM: dead hand freeze. |
| `93173.json` | mortmain | Primary fixture alias for #93173. |
| `phantom.json` | phantom | Path word: authorless diffs after a half-updated tree. |
| `hold.json` | hold | HOLD alias: admit freehold. |
| `walk.json` | walk | Published idle → deny → tracked → unlink → head → authorless → silent → mortmain → phantom. |
| `deny-within-allow.json` | deny-within-allow | Sandbox freeze list. |
| `tracked-claude-paths.json` | tracked-claude-paths | ~12 files under `.claude/skills/**`. |
| `unlink-denied.json` | unlink-denied | unable to unlink `.claude/skills/**`. |
| `head-behind.json` | head-behind | `rev-parse` still old branch. |
| `authorless-diff.json` | authorless-diff | 488 staged phantoms; no author. |
| `silent-warning.json` | silent-warning | Reads as success apart from `warning:`. |
| `has-repro.json` | has-repro | touch-denied + switch unlink + HEAD-behind. |
| `cousins.json` | cousins | Cite-only #53891 #85072 #54189 #79945. |
| `backups.json` | backups | Cite-only #93182 #93219 #93207 #93198 #93177 #93210. |
| `fixtures.json` | fixtures | Row list for the mortmain booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for freehold vs mortmain. |

Clip any file onto `projects/mortmain/index.html`. Buttons load the seeded path. The living page admits **freehold** / idle booth / #93173.

The booth reconstructs the reporter’s `denyWithinAllow` / unable-to-unlink / HEAD-behind walk from the published #93173 body. This muniment room does not run Claude.

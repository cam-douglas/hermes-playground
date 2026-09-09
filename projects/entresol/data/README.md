# Entresol fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93010 issue facts: `CLAUDE.md` in the directory above a git worktree is not loaded when that directory holds the worktree's repository. Score bypassed or admit lodged.

Idle word: **lodged**. Seeded word: **bypassed**. Path word: **cutaway**. HOLD: **lodged** / **hold**. ALARM: **bypassed** / **cutaway** / **case-d-worktree-child** / **case-c-plain-child** / **bare-parent-alone-ok** / **worktree-elsewhere-ok** / **worktree-of-different-repo-ok** / **parent-dot-claude-also-skipped** / **has-repro** / **cousins** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#93010](https://github.com/anthropics/claude-code/issues/93010).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Hallmark/#93021 (resume loses `[1m]`). Not Flashpan/#93015 (`lastRunAt` without session). Not Secateurs/#92979 (Read silent partial). Not Palinode/#92998 (MEMORY.md bottom truncation). Not Ferrule/#92968 / Interlock / Guillotine/#92974 / Greenroom/#92988. Not leftover woodworking / mm-slider.

| File | Verdict | What it scores |
|---|---|---|
| `lodged.json` | lodged | Idle booth. HOLD: parent CLAUDE.md reaches the worktree session. |
| `bypassed.json` | bypassed | Seeded #93010 path. ALARM: parent CLAUDE.md absent for that pairing. |
| `93010.json` | bypassed | Primary fixture alias for #93010. |
| `cutaway.json` | cutaway | Path word: the mezzanine floor is cut away. |
| `hold.json` | hold | HOLD alias: parent CLAUDE.md lodged in the worktree session. |
| `walk.json` | walk | Published docs → case C → case D → `.claude` skip → controls → cutaway. |
| `case-d-worktree-child.json` | case-d-worktree-child | Case D fail: parent holds bare repo; child is worktree of that repo. |
| `case-c-plain-child.json` | case-c-plain-child | Case C control: same parent; plain child still loads `zorb-parent-PLAIN`. |
| `bare-parent-alone-ok.json` | bare-parent-alone-ok | Bare-repo-in-parent alone does not fail. |
| `worktree-elsewhere-ok.json` | worktree-elsewhere-ok | Child-is-worktree alone does not fail. |
| `worktree-of-different-repo-ok.json` | worktree-of-different-repo-ok | Parent worktree of a different repository still loads parent CLAUDE.md. |
| `parent-dot-claude-also-skipped.json` | parent-dot-claude-also-skipped | `parent/.claude/CLAUDE.md` also fails to arrive in the failing shape. |
| `has-repro.json` | has-repro | Six fixtures; only the pairing fails; 2.1.266 and 2.1.251. |
| `cousins.json` | cousins | Cite-only #23565 #39920 #27994 #90572 #83411 #87824 #76119 #16600. |
| `fixtures.json` | fixtures | Row list / case-matrix for the entresol booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for lodged vs bypassed. |

Drop any file onto `projects/entresol/index.html`. Buttons load the seeded path. The living page admits **lodged** / idle booth / #93010.

Probes are diagnostic reconstructions of the issue's published facts. This mezzanine does not run Claude.

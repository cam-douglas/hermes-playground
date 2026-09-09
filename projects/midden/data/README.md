# Midden fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93081 issue facts: Orphaned worktree entry is retried every 30 minutes forever; cleanup can never succeed. Score mounded or admit cleared.

Idle word: **cleared**. Seeded word: **mounded**. Path word: **midden**. HOLD: **cleared** / **hold**. ALARM: **mounded** / **midden** / **partial-remove** / **git-remove-fails** / **fallback-refuses** / **store-not-pruned** / **thirty-minute-cadence** / **has-repro** / **cousins** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#93081](https://github.com/anthropics/claude-code/issues/93081).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Diplopia/#93012 (Remote Control environment-label field split). Not Greenroom/#92988 (Desktop Code tab missing wait-for-full-turn-end queue). Not Guillotine/#92974 (background-mode Deny-only). Not Entresol/#93010 (parent CLAUDE.md skipped for worktree-of-that-repo). Not Hallmark/#93021 (resume loses `[1m]`). Not Flashpan/#93015 (`lastRunAt` without session). Not Secateurs/#92979 (Read silent partial). Not Palinode/#92998 (MEMORY.md bottom truncation). Not Ferrule/#92968 / Interlock / Homestead / Shibboleth. Not leftover woodworking / mm-slider.

| File | Verdict | What it scores |
|---|---|---|
| `cleared.json` | cleared | Idle booth. HOLD: one GC pass stops. |
| `mounded.json` | mounded | Seeded #93081 path. ALARM: both refuse; store stays; 30m retry. |
| `93081.json` | mounded | Primary fixture alias for #93081. |
| `midden.json` | midden | Path word: remounding refuse heap. |
| `hold.json` | hold | HOLD alias: admit cleared. |
| `walk.json` | walk | Published idle → partial-remove → git-remove-fails → fallback-refuses → store-not-pruned → 30m cadence → midden. |
| `partial-remove.json` | partial-remove | `.git` link gone, directory remains. |
| `git-remove-fails.json` | git-remove-fails | `fatal: is not a working tree` (exit 128). |
| `fallback-refuses.json` | fallback-refuses | `.git link missing (partial remove); not safe to rm`. |
| `store-not-pruned.json` | store-not-pruned | Log claims prune; entry remains. |
| `thirty-minute-cadence.json` | thirty-minute-cadence | Same five lines every 30m; 853× / 20d. |
| `has-repro.json` | has-repro | Desktop 1.49585.0.0 Windows 11 WorktreePool walk. |
| `cousins.json` | cousins | Cite-only #75911 #78350 #91405 #91246 #92078. |
| `fixtures.json` | fixtures | Row list for the midden booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for cleared vs mounded. |

Clip any file onto `projects/midden/index.html`. Buttons load the seeded path. The living page admits **cleared** / idle booth / #93081.

The strata reconstruct the reporter’s five-line cycle from the published #93081 body. This refuse-heap booth does not run Claude.

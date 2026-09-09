# Stereotype fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93108 issue facts: plugin update / auto-update compare only the version string, so plugins that ship new content without bumping version never refresh. Score stamped or admit fresh.

Idle word: **fresh**. Seeded word: **stamped**. Path word: **stereotype**. HOLD: **fresh** / **hold**. ALARM: **stamped** / **stereotype** / **version-only** / **marketplace-head** / **auto-update-true** / **uninstall-reinstall** / **pinned-sha** / **has-repro** / **cousins** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#93108](https://github.com/anthropics/claude-code/issues/93108).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Midden/#93081 (WorktreePool partial-remove GC remound loop). Not Diplopia/#93012 (Remote Control web vs mobile label fields). Not Greenroom/#92988 (Desktop Code tab missing wait-until-turn-ends queue). Not Guillotine/#92974 (background-mode Deny-only permission dialog). Not Entresol/#93010 (parent CLAUDE.md skipped for worktree-of-that-repo). Not Hallmark/#93021 (`[1m]` lost on resume non-first-party BASE_URL). Not Flashpan/#93015 (lastRunAt without session birth). Not Secateurs/#92979 / Palinode/#92998 / Ferrule/#92968 / Interlock / Homestead / Shibboleth / Recension / Epitaph / leftover woodworking / mm-slider. Different paradigm: version-string-only plugin freshness vs commit/sha reality.

| File | Verdict | What it scores |
|---|---|---|
| `fresh.json` | fresh | Idle booth. HOLD: aligned to HEAD / pin. |
| `stamped.json` | stamped | Seeded #93108 path. ALARM: version matches; content stays. |
| `93108.json` | stamped | Primary fixture alias for #93108. |
| `stereotype.json` | stereotype | Path word: version-string-only plate. |
| `hold.json` | hold | HOLD alias: admit fresh. |
| `walk.json` | walk | Published idle → version-only → marketplace-head → auto-update-true → stamped → pinned-sha → uninstall-reinstall → stereotype. |
| `version-only.json` | version-only | Compare version string alone. |
| `marketplace-head.json` | marketplace-head | HEAD `e8f4120` rewrote `langsmith-evaluator`. |
| `auto-update-true.json` | auto-update-true | `autoUpdate: true`; never re-pulled. |
| `uninstall-reinstall.json` | uninstall-reinstall | Only workaround. |
| `pinned-sha.json` | pinned-sha | `source:{url,sha}` pins share the compare. |
| `has-repro.json` | has-repro | `langsmith-skills@langsmith-skills` macos plugins walk. |
| `cousins.json` | cousins | Cite-only #86194 #91271 #86139. |
| `fixtures.json` | fixtures | Row list for the stereotype booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for fresh vs stamped. |

Clip any file onto `projects/stereotype/index.html`. Buttons load the seeded path. The living page admits **fresh** / idle booth / #93108.

The chase reconstructs the reporter’s version-string-only walk from the published #93108 body. This foundry booth does not run Claude.

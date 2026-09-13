# Sneck fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94052 issue facts: VS Code 2.1.268 replaced the current-file chip Hide toggle with an X; dismissSelection stores dismissedSelection and applySelectionUpdate only suppresses re-attachment while that same file stays active, so a tab switch and return brings the chip back; there is no setting, command, keybinding, or env to stop auto-attach. Score sneck or admit cleared.

Idle word: **cleared**. Path word: **chip-dismiss-ephemeral**. Seeded loss: **sneck**. Product: **sneck**. HOLD: **cleared**. ALARM: **sneck** / **chip-dismiss-ephemeral** / **tab-return** / **dismiss-selection**. Primary: [anthropics/claude-code#94052](https://github.com/anthropics/claude-code/issues/94052).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `cleared.json` | cleared | Idle latch. HOLD: Hide held; leaf stays undone. |
| `hold.json` | hold | HOLD alias for idle cleared. |
| `sneck.json` | sneck | Seeded #94052 path and product. ALARM: spring sneck after Hide→X. |
| `chip-dismiss-ephemeral.json` | chip-dismiss-ephemeral | Path: dismiss is per-file and snaps shut on tab return. |
| `undone.json` | undone | HOLD alias: the sneck stays undone once lifted. |
| `open-latch.json` | open-latch | HOLD alias: the cottage leaf stays an open latch. |
| `stayed-off.json` | stayed-off | HOLD alias: Hide stayed off. |
| `withheld.json` | withheld | HOLD alias: active file is withheld from every prompt. |
| `hide-toggle.json` | hide-toggle | 2.1.268 replaced Hide with X. |
| `dismiss-selection.json` | dismiss-selection | X calls dismissSelection(). |
| `dismissed-selection.json` | dismissed-selection | stores dismissedSelection. |
| `apply-selection-update.json` | apply-selection-update | applySelectionUpdate only while same file active. |
| `per-file-scope.json` | per-file-scope | Dismissal scoped per file, not per session. |
| `tab-return.json` | tab-return | a.md → b.ts → a.md; chip returns. |
| `composer-chip.json` | composer-chip | Indicator moved into the composer. |
| `no-setting.json` | no-setting | 17 settings / 28 commands; none governs attachment. |
| `landing.json` | landing | Cottage stoop landing. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #82492 #93667 #40869 #24726 #92516 #20886 #26577. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Slate / oak / brass / wool / iron / rain / ink. |
| `walk.json` | walk | Published idle cleared → chip-dismiss-ephemeral → sneck. |

## Cousins (cite only)

#82492 — no visible chip / confirmation. Do not conflate.

#93667 — keep IDE selection in footer. Do not conflate.

#40869 / #24726 — opt-in auto-attach settings proposals. Do not conflate.

#92516 — diff selection dismiss. Do not conflate.

#20886 / #26577 — discoverability of removal (mentioned in issue). Do not conflate.

## Backups (cite only — do NOT auto-pick or build)

#94041 #94040 #94032 #94031 #94029 #93987 #93924 #93770 #93777

Drop any file onto `projects/sneck/index.html`. Buttons load the seeded path. The living page admits **cleared** / idle latch / #94052.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

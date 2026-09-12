# Stet fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93778 issue facts: dictation restores its prior buffer over manual composer edits and discarded whitespace on mic resume. Score stet or admit stetted.

Idle word: **stetted**. Path word: **mic-resume-wipe**. Seeded loss: **rewound**. Product: **stet**. HOLD: **stetted**. ALARM: **rewound** / **stet** / **mic-resume-wipe** / **manual-edit-wiped** / **blank-lines-discarded** / **buffer-restore** / **cursor-ignored**. Primary: [anthropics/claude-code#93778](https://github.com/anthropics/claude-code/issues/93778).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `stetted.json` | stetted | Idle desk. HOLD: user edit stands; box + cursor are source of truth. |
| `hold.json` | hold | HOLD alias for idle stetted. |
| `rewound.json` | rewound | Seeded #93778 path. ALARM: prior buffer restored over edits. |
| `stet.json` | stet | Product score for the copy-desk booth. |
| `mic-resume-wipe.json` | mic-resume-wipe | Path: resume appends to the old buffer. |
| `manual-edit-wiped.json` | manual-edit-wiped | Hand-edit discarded when speech resumes. |
| `blank-lines-discarded.json` | blank-lines-discarded | Shift+Enter blanks discarded. |
| `box-source-of-truth.json` | box-source-of-truth | Requested hold: live box is truth. |
| `buffer-restore.json` | buffer-restore | Prior dictation buffer written back. |
| `cursor-ignored.json` | cursor-ignored | Speech not appended at the cursor. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #91202 #93165 #93636 #93782. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Cream paper / blue pencil / stet. underline / proof slip. |
| `walk.json` | walk | Published idle stetted → mic-resume-wipe → rewound → stet. |

## Backups (cite only — do NOT auto-pick or build)

#93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782 #93800 #93809 #93807 #93808 #93795 #93821 #93811 #93834 #93823 #93825 #93779

Drop any file onto `projects/stet/index.html`. Buttons load the seeded path. The living page admits **stetted** / idle margin / #93778.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

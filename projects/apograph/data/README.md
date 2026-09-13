# Apograph fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93859 issue facts: Desktop sidebar reopen creates a new session ID and a full transcript copy every time instead of appending. After a day, one custom-titled conversation exists as 7 `.jsonl` files; `/resume` shows 5+ rows with the same title. CLI resume of the same conversation ~32 times did not fork. Score apograph or admit singular.

Idle word: **singular**. Path word: **reopen-fork**. Seeded loss: **apographed**. Product: **apograph**. HOLD: **singular**. ALARM: **apographed** / **apograph** / **reopen-fork** / **desktop-fork**. Primary: [anthropics/claude-code#93859](https://github.com/anthropics/claude-code/issues/93859).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `singular.json` | singular | Idle quire. HOLD: one conversation = one leaf; CLI appends. |
| `hold.json` | hold | HOLD alias for idle singular. |
| `apographed.json` | apographed | Seeded #93859 path. ALARM: Desktop reopen forks a full copy. |
| `apograph.json` | apograph | Product score for the scriptorium booth. |
| `reopen-fork.json` | reopen-fork | Path: Desktop sidebar copy vs CLI append-in-place. |
| `desktop-fork.json` | desktop-fork | Sidebar reopen mints a new session ID + full copy. |
| `session-id.json` | session-id | New session ID on every Desktop reopen. |
| `transcript-superset.json` | transcript-superset | Each later file is a superset. |
| `custom-title.json` | custom-title | 7 files share the same customTitle. |
| `resume-rows.json` | resume-rows | `/resume` shows 5+ same-title rows. |
| `entrypoint-desktop.json` | entrypoint-desktop | All records `entrypoint: claude-desktop`. |
| `no-fork-flag.json` | no-fork-flag | No `--fork-session`; no superseded/orphaned. |
| `mb-chain.json` | mb-chain | Sizes 1.5→4.6 MB. |
| `cli-append.json` | cli-append | HOLD alias: CLI resume appends in place. |
| `one-leaf.json` | one-leaf | HOLD alias: one conversation = one leaf. |
| `seal-intact.json` | seal-intact | HOLD alias: session-ID wax seal reused. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #93797. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Cream parchment / iron-gall / vermilion seal. |
| `walk.json` | walk | Published idle singular → reopen-fork → apographed → apograph. |

## Cousins (cite only)

#93797 Schism (SendMessage resumes a second LIVE workflow agent). Different mechanism — live dual-writer vs Desktop sidebar reopen fork. Do not rebuild as a separate booth.

## Backups (cite only — do NOT auto-pick or build)

#93772 #93770 #93777 #93782 #93863 #93889 #93821 #93811 #93809 #93823 #93924 #93848

Drop any file onto `projects/apograph/index.html`. Buttons load the seeded path. The living page admits **singular** / idle quire / #93859.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

# Matricula fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93987 issue facts: desktop `/reload-skills` stamps `(no changes)` after a mid-session add; a fresh process lists `reload-probe`. Score matricula or admit enrolled.

Idle word: **enrolled**. Path word: **reload-blind**. Seeded loss: **matricula**. Product: **matricula**. HOLD: **enrolled**. ALARM: **matricula** / **reload-blind** / **no-changes**. Primary: [anthropics/claude-code#93987](https://github.com/anthropics/claude-code/issues/93987).

Fixtures record the published incident only. Census rows are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `enrolled.json` | enrolled | Idle roll. HOLD: live scan would write the arrival. |
| `hold.json` | hold | HOLD alias for idle enrolled. |
| `matricula.json` | matricula | Seeded #93987 path and product. ALARM: live stamp misses the arrival. |
| `93987.json` | matricula | Same seeded path under the issue number. |
| `reload-blind.json` | reload-blind | Path: live roll vs fresh census. |
| `admitted.json` | admitted | HOLD alias: name written on the roll. |
| `rostered.json` | rostered | HOLD alias: on the enrollment roll. |
| `listed.json` | listed | HOLD alias: session lists the arrival. |
| `scanned.json` | scanned | HOLD alias: re-scan walked disk. |
| `freshened.json` | freshened | HOLD alias: count moved; (1 added). |
| `no-changes.json` | no-changes | 72 skills available (no changes). |
| `mid-session-add.json` | mid-session-add | reload-probe created while the session stayed running. |
| `fresh-process-sees.json` | fresh-process-sees | New process /skill-doctor lists the probe. |
| `skill-doctor.json` | skill-doctor | Control row: reload-probe userSettings. |
| `reload-probe.json` | reload-probe | Valid frontmatter; not listed in-session. |
| `count-stuck.json` | count-stuck | 72 did not move. |
| `junction-ok.json` | junction-ok | Junction loads every other skill. |
| `verified-negative.json` | verified-negative | (no changes) reads as a verified empty scan. |
| `census-passes.json` | fixtures | Published census-pass examples. |
| `landing.json` | landing | University registrar / enrollment-desk. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #88164 #74990 #72631. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | University registrar / enrollment-desk. |
| `walk.json` | walk | Published idle enrolled → reload-blind → matricula. |
| `closed.json` | closed | Cousins remain OPEN (except #72631) — cite only; not this booth. |

## Cousins (cite only)

Different surfaces from #93987 desktop `/reload-skills` miss. Do NOT rebuild. Do NOT conflate.

#88164 — `/skills` prints No changes; there `/reload-skills` works (`2 added`). Distinct cousin.

#74990 — compaction drops Available-skills; `/reload-skills` recovers it while reporting no changes. Distinct cousin.

#72631 — closed; IDE palette missed newly-added symlinked skills until reload. Distinct cousin.

#93987 is specifically: desktop `/reload-skills` stamps `(no changes)` after a mid-session add; a fresh process sees `reload-probe`.

## Backups (cite only — do NOT auto-pick or build)

#93924 #93770 #93777 #94151 #94064 #94277

Drop any file onto `projects/matricula/index.html`. Buttons load the seeded path. The enrolled page admits **enrolled** / idle roll / #93987.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

# Dragnet fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94064 issue facts: desktop `/usr/bin/find` walks from `/` and raises repeated other-apps TCC prompts. Score dragnet or admit scoped.

Idle word: **scoped**. Path word: **root-find**. Seeded loss: **dragnet**. Product: **dragnet**. HOLD: **scoped**. ALARM: **dragnet** / **root-find** / **full-disk-find**. Primary: [anthropics/claude-code#94064](https://github.com/anthropics/claude-code/issues/94064).

Fixtures record the published incident only. Walk-root rows are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `scoped.json` | scoped | Idle case. HOLD: walk stays in the open project. |
| `hold.json` | hold | HOLD alias for idle scoped. |
| `dragnet.json` | dragnet | Seeded #94064 path and product. ALARM: net leaves the case. |
| `94064.json` | dragnet | Same seeded path under the issue number. |
| `root-find.json` | root-find | Path: find rooted at `/`. |
| `fenced.json` | fenced | HOLD alias: net stays inside the case. |
| `bounded.json` | bounded | HOLD alias: warrant bound. |
| `warranted.json` | warranted | HOLD alias: named folder only. |
| `project-rooted.json` | project-rooted | HOLD alias: working tree is the walk root. |
| `cwd-scoped.json` | cwd-scoped | HOLD alias: walk starts at cwd. |
| `full-disk-find.json` | full-disk-find | Child `/usr/bin/find` starts at `/`. |
| `tcc-prompt.json` | tcc-prompt | access data from other apps. |
| `other-apps.json` | other-apps | `kTCCServiceSystemPolicyAppData`. |
| `sandbox-denial.json` | sandbox-denial | Kernel denials on TCC alleys. |
| `alley-trawl.json` | alley-trawl | Protected paths hauled. |
| `blotter-loop.json` | blotter-loop | Recurs every 1.5–3 minutes. |
| `shared-process.json` | shared-process | Shared app process. |
| `landing.json` | landing | Night blotter / police-fishing dragnet. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | None named in #94064 text. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Night blotter / caution tape. |
| `walk.json` | walk | Published idle scoped → root-find → dragnet. |
| `closed.json` | closed | #94064 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

No cousin issues are named in the #94064 report. Do NOT invent cousins. Do NOT conflate recent catalog paradigms.

#94064 is specifically: desktop `/usr/bin/find` rooted at `/` hauls TCC-protected alleys and raises repeated other-apps prompts.

## Backups (cite only — do NOT auto-pick or build)

#93924 #93770 #93777 #94151 #94277

Drop any file onto `projects/dragnet/index.html`. Buttons load the seeded path. The scoped page admits **scoped** / idle case / #94064.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

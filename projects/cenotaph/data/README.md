# Cenotaph fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94452 issue facts: a directory marketplace whose recorded `installLocation` no longer exists never loads again — every launch re-fetches from source but keeps the dead path, and `claude plugin marketplace update` fails on it. Score cenotaph or admit homed.

Idle word: **homed**. Path word: **dead-install**. Seeded loss: **cenotaph**. Product: **cenotaph**. HOLD: **homed**. ALARM: **cenotaph** / **dead-install** / **cache-miss**. Primary: [anthropics/claude-code#94452](https://github.com/anthropics/claude-code/issues/94452).

Fixtures record the published incident only. Request reconstructions are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `homed.json` | homed | Idle yard. HOLD: rewrite `installLocation` to live `source.path`. |
| `cenotaph.json` | cenotaph | Seeded #94452 path and product. ALARM: dead-install miss. |
| `94452.json` | cenotaph | Same seeded path under the issue number. |
| `dead-install.json` | dead-install | Path: recorded `installLocation` is ENOENT. |
| `repointed.json` | repointed | HOLD alias: stone rewritten to live `source.path`. |
| `relocated.json` | relocated | HOLD alias: `installLocation` matches `source.path`. |
| `settled.json` | settled | HOLD alias: marketplace update resolves from source. |
| `cache-miss.json` | cache-miss | `claude plugin list` shows cache-miss. |
| `last-updated.json` | last-updated | Plaque re-polished every launch; stone unmoved. |
| `marketplace-update.json` | marketplace-update | Update opens the dead path instead of source. |
| `remove-add.json` | remove-add | Only recovery is remove then add. |
| `enabled-cleared.json` | enabled-cleared | Remove deletes plugins from `enabledPlugins`. |
| `plaque.json` | cache-miss | Six-row yard log fixture. |
| `landing.json` | landing | Memorial / empty-tomb / sepulchre / cenotaph-yard. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Living source / carved stone / bronze plaque. |
| `walk.json` | walk | Published idle homed → dead-install → cenotaph. |
| `closed.json` | closed | #94452 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#94451 — known_marketplaces.json never repaired once invalid (missing lastUpdated / parse error disables ALL marketplaces). DIFFERENT.

#82272 — installLocation validated by string prefix not realpath (symlink CLAUDE_CONFIG_DIR). DIFFERENT.

#36575 — CLOSED — portable paths for installLocation cross-platform. DIFFERENT.

#94516 — marketplace refresh can install unmerged/stale content without signal. DIFFERENT.

#94452 is specifically: directory marketplace whose recorded `installLocation` is ENOENT never loads again; re-fetch bumps `lastUpdated` and leaves the dead path.

## Backups (cite only — do NOT auto-pick or build)

#94451 #94430 #94458 #93924 #93770 #93777 #94151 #94496 #94499 #94522 #94520 #94509 #94507

Drop any file onto `projects/cenotaph/index.html`. Buttons load the seeded path. The yard admits **homed** / idle desk / #94452.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

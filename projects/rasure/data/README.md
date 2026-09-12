# Rasure fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93791 issue facts: `~/.claude` (native Windows install) is deleted and recreated wholesale; the folder's own CreationTime flips (full delete+recreate, not content edits); `.claude.json` regenerates blank; prompt history and transcripts zero out; settings.json reverts to a stub missing most hooks. Incident 4 also wiped `secrets/` (19 files). Score rasure or admit intact.

Idle word: **intact**. Path word: **creation-time-flip**. Seeded loss: **rasured**. Product: **rasure**. HOLD: **intact**. ALARM: **rasured** / **rasure** / **creation-time-flip** / **wholesale-wipe** / **blank-claude-json** / **stubs-settings** / **secrets-lost** / **backup-stamp**. Primary: [anthropics/claude-code#93791](https://github.com/anthropics/claude-code/issues/93791).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `intact.json` | intact | Idle leaf. HOLD: CreationTime stable; config survives. |
| `hold.json` | hold | HOLD alias for idle intact. |
| `rasured.json` | rasured | Seeded #93791 path. ALARM: wholesale wipe+recreate. |
| `rasure.json` | rasure | Product score for the scraped leaf. |
| `creation-time-flip.json` | creation-time-flip | Path: folder CreationTime of the leaf is new. |
| `wholesale-wipe.json` | wholesale-wipe | Four incidents since late August; full delete+recreate. |
| `blank-claude-json.json` | blank-claude-json | `.claude.json` regenerates blank. |
| `stubs-settings.json` | stubs-settings | settings.json stub missing most hooks. |
| `secrets-lost.json` | secrets-lost | Incident 4 wiped `secrets/` (19 files). |
| `backup-stamp.json` | backup-stamp | `~/.claude/backups/.claude.json.backup.<timestamp>`. |
| `has-repro.json` | has-repro | Published shape: wipe + CreationTime flip + blank stub. |
| `cousins.json` | cousins | Cite-only #41415 #34330 #70052 #54092 #93742. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `walk.json` | walk | Published idle intact → rasured walk. |
| `fixtures.json` | fixtures | Scriptorium desk motif index. |

## Backups (cite only — do NOT auto-pick or build)

#93788 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782

Drop any file onto `projects/rasure/index.html`. Buttons load the seeded path. The living page admits **intact** / idle leaf / #93791.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

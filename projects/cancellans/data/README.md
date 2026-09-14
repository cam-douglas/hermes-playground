# Cancellans fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94400 issue facts: a `--resume` fork drops a server-gated tool (`EndConversation`) that was in the parent's initial tools array; the first fork request omits it and only later gets `deferred_tools_delta` — the prompt-cache prefix misses despite TTL. Post-first-request tools restore OK. Score cancellans or admit intact.

Idle word: **intact**. Path word: **deferred-delta**. Seeded loss: **cancellans**. Product: **cancellans**. HOLD: **intact**. ALARM: **cancellans** / **deferred-delta** / **cache-miss**. Primary: [anthropics/claude-code#94400](https://github.com/anthropics/claude-code/issues/94400).

Fixtures record the published incident only. Deferred-delta rows are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `intact.json` | intact | Idle press. HOLD: parent's initial tools array restored. |
| `hold.json` | hold | HOLD alias for idle intact. |
| `cancellans.json` | cancellans | Seeded #94400 path and product. ALARM: first folio line dropped. |
| `94400.json` | cancellans | Same seeded path under the issue number. |
| `deferred-delta.json` | deferred-delta | Path: late paste; prefix miss. |
| `bound.json` | bound | HOLD alias: opening signature sewn. |
| `mirrored.json` | mirrored | HOLD alias: fork folio matches parent. |
| `folio-match.json` | folio-match | HOLD alias: first page reprinted. |
| `prefix-hot.json` | prefix-hot | HOLD alias: cache still read. |
| `tools-restored.json` | tools-restored | HOLD alias: initial array reproduced. |
| `cache-miss.json` | cache-miss | Fork first request 7,462 / 20,562. |
| `initial-drop.json` | initial-drop | Only the opening-array tool is lost. |
| `endconversation.json` | endconversation | Server-gated tool on the parent's first request. |
| `fork-resume.json` | fork-resume | `--resume` forks. |
| `ttl-alive.json` | ttl-alive | ephemeral_1h; expiry ruled out. |
| `landing.json` | landing | Binder / print-shop / cancelled-leaf / folio-press. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Parent folio / fork folio. |
| `walk.json` | walk | Published idle intact → deferred-delta → cancellans. |
| `closed.json` | closed | #94400 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#92033 — mid-conversation `deferred_tools_delta` invalidates cache. DIFFERENT trigger.

#91151 — resume cache collapses to system+tools floor. DIFFERENT (size+gap).

#92524 — Diopter scratchpad UUID lens defocuses cache. DIFFERENT surface.

#83913 — hook additionalContext rewrite. DIFFERENT (hook context).

#94400 is specifically: `--resume` fork drops a server-gated tool from the parent's *initial* tools array; first request omits it; later `deferred_tools_delta`; prefix miss despite TTL.

Do NOT pick #94336.

## Backups (cite only — do NOT auto-pick or build)

#93924 #93770 #93777 #94151

Drop any file onto `projects/cancellans/index.html`. Buttons load the seeded path. The intact page admits **intact** / idle press / #94400.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

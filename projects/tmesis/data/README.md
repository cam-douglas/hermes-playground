# Tmesis fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #86198 issue facts: running a slash command (`/effort`) while `advisor` is in flight injects `local_command` records mid-message and permanently 400s the session. Score tmesis or admit contiguous.

Idle word: **contiguous**. Path word: **mid-inject**. Seeded loss: **tmesis**. Product: **tmesis**. HOLD: **contiguous**. ALARM: **tmesis** / **mid-inject** / **four-hundred**. Primary: [anthropics/claude-code#86198](https://github.com/anthropics/claude-code/issues/86198).

Fixtures record the published incident only. Transcript reconstructions are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `contiguous.json` | contiguous | Idle folio. HOLD: defer local_command until the clause closes. |
| `tmesis.json` | tmesis | Seeded #86198 path and product. ALARM: mid-inject splice. |
| `86198.json` | tmesis | Same seeded path under the issue number. |
| `mid-inject.json` | mid-inject | Path: slash records land between server_tool_use and advisor_tool_result. |
| `joined.json` | joined | HOLD alias: tool_use and tool_result stay joined. |
| `uncut.json` | uncut | HOLD alias: the clause stays uncut. |
| `bound.json` | bound | HOLD alias: parentUuid stays bound to server_tool_use. |
| `clause-shut.json` | clause-shut | HOLD alias: folio stays clause-shut. |
| `local-command.json` | local-command | system / local_command records spliced mid-message. |
| `orphan-result.json` | orphan-result | advisor_tool_result has no preceding server_tool_use. |
| `parent-break.json` | parent-break | parentUuid points at stdout instead of server_tool_use. |
| `four-hundred.json` | four-hundred | Non-retryable 400; session permanently dead. |
| `slash-effort.json` | slash-effort | Injector is a plain user slash command, not a Stop hook. |
| `chain.json` | parent-break | Four-row broken parentUuid chain fixture. |
| `landing.json` | landing | Manuscript / rhetoric / spliced parchment / editorial desk. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Open folio / advisor ink / splice ribbon. |
| `walk.json` | walk | Published idle contiguous → mid-inject → tmesis. |
| `closed.json` | closed | #86198 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#81397 — Stop-hook injector, same contiguity break. DIFFERENT injector.

#92509 — Server tool result separated by interleaved system messages. DIFFERENT.

#81233 — Compaction variant of the same invariant break. DIFFERENT.

#60523 — Compaction variant. DIFFERENT.

#86198 is specifically: mid-message slash/local_command inject into in-flight advisor → permanent session 400.

## Backups (cite only — do NOT auto-pick or build)

#94417 #94452 #94451 #94430 #94458 #93924 #93770 #93777 #94151

Drop any file onto `projects/tmesis/index.html`. Buttons load the seeded path. The folio admits **contiguous** / idle desk / #86198.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

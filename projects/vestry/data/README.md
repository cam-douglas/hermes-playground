# Vestry fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94008 issue facts: Linux bwrap placeholder mount cleanup is per-process with no cross-process refcount; concurrent sessions on one project root delete each other's mount points. Score vestry or admit pegged.

Idle word: **pegged**. Path word: **mount-refcount-race**. Seeded loss: **vestry**. Product: **vestry**. HOLD: **pegged**. ALARM: **vestry** / **mount-refcount-race** / **placeholder-set** / **inflight-zero**. Primary: [anthropics/claude-code#94008](https://github.com/anthropics/claude-code/issues/94008).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `pegged.json` | pegged | Idle rail. HOLD: concurrent hangers respected; shared rail keeps others' mounts. |
| `hold.json` | hold | HOLD alias for idle pegged. |
| `vestry.json` | vestry | Seeded #94008 path and product. ALARM: attendant clearing all pegs. |
| `mount-refcount-race.json` | mount-refcount-race | Path: process A cleanup deletes process B's mounts. |
| `hung.json` | hung | HOLD alias: vestments hung; concurrent hangers respected. |
| `stowed.json` | stowed | HOLD alias: robes stowed; rail keeps others' mounts. |
| `refcounted.json` | refcounted | HOLD alias: shared rail keeps a refcount across hangers. |
| `co-tenant.json` | co-tenant | HOLD alias: two acolytes share the rail without stripping each other. |
| `placeholder-set.json` | placeholder-set | Module-level Set tracks `--ro-bind /dev/null <path>`. |
| `inflight-zero.json` | inflight-zero | inFlight hits zero; process unlinks every placeholder it knows. |
| `cross-process.json` | cross-process | No lock, no shared registry, no refcount across `claude` processes. |
| `bash-retry.json` | bash-retry | Bash tool fails for no reason; identical command succeeds on retry. |
| `sessions-84.json` | sessions-84 | ≥84 sessions with ≥1 such failure 2026-07-07..2026-09-10. |
| `ro-bind-null.json` | ro-bind-null | `--ro-bind /dev/null <path>` for a missing deny file. |
| `empty-tmpdir.json` | empty-tmpdir | Empty tmpdir `--ro-bind` for a missing deny directory. |
| `no-lock.json` | no-lock | No lock around argv-build → exec window. |
| `landing.json` | landing | Sacristy landing / linen sill. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #81602 #77271 #79248 #46165 #78072. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Stone / indigo stole / linen / brass peg / candle smoke / ink / altar wine. |
| `walk.json` | walk | Published idle pegged → mount-refcount-race → vestry. |

## Cousins (cite only)

#81602 — stray placeholders / closest neighbour, no mechanism. Do not conflate.

#77271 — read-only parent shape. Distinct trigger. Do not conflate.

#79248 — git config.lock vanish. Same symptom string, different source. Do not conflate.

#46165 / #78072 — stray 0-byte placeholders, opposite lifecycle direction. Do not conflate.

#89514 — WSL2+Docker unrelated shapes. Cite only, not catalogued here as a cousin fixture.

## Backups (cite only — do NOT auto-pick or build)

#93770 #93777 #93924 #93925 #93967 #93957 #93987 #93996

Drop any file onto `projects/vestry/index.html`. Buttons load the seeded path. The living page admits **pegged** / idle rail / #94008.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

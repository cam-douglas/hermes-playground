# Stopcock fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93143 issue facts: Streamable HTTP MCP `tools/call` still times out at ~6 min despite raised knobs. Score seated or admit open.

Idle word: **open**. Seeded word: **seated**. Path word: **stopcock**. HOLD: **open** / **hold**. ALARM: **seated** / **stopcock** / **hard-ceiling** / **six-minute-seat** / **timeout-knobs-ignored** / **idle-timeout-zero** / **server-timeout-24h** / **streamable-http** / **tools-call** / **operation-timed-out** / **has-repro** / **cousins** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#93143](https://github.com/anthropics/claude-code/issues/93143).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Parergon/#93122 (stealth idle over `/btw` aside). Not Stereotype/#93108 (plugin update version-string-only freshness). Not Midden/#93081 (WorktreePool partial-remove GC remound). Not Guillotine/#92974 / Clepsydra / Fusee / Procrustes / Reed / Quench / Wildcat/#92399 / Snatch / Deadman / leftover woodworking / mm-slider. Different paradigm: hidden ~6-minute hard seat on Streamable HTTP MCP `tools/call` vs documented timeout knobs.

| File | Verdict | What it scores |
|---|---|---|
| `open.json` | open | Idle booth. HOLD: valve stays open. |
| `seated.json` | seated | Seeded #93143 path. ALARM: hidden ~6 min hard seat. |
| `93143.json` | seated | Primary fixture alias for #93143. |
| `stopcock.json` | stopcock | Path word: seated stopcock. |
| `hold.json` | hold | HOLD alias: admit open. |
| `walk.json` | walk | Published idle → streamable-http → tools-call → knobs → six-minute-seat → hard-ceiling → operation-timed-out → seated → stopcock. |
| `hard-ceiling.json` | hard-ceiling | ~352–363s window; 11-second spread. |
| `six-minute-seat.json` | six-minute-seat | tool_progress 300/330 then abort. |
| `timeout-knobs-ignored.json` | timeout-knobs-ignored | All documented knobs applied; timing unchanged. |
| `idle-timeout-zero.json` | idle-timeout-zero | `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT=0` received as 0. |
| `server-timeout-24h.json` | server-timeout-24h | per-server `timeout` 86400000. |
| `streamable-http.json` | streamable-http | `type:http` Streamable HTTP, not SSE. |
| `tools-call.json` | tools-call | `wait_forever` never responds. |
| `operation-timed-out.json` | operation-timed-out | `is_error` true; "The operation timed out." |
| `has-repro.json` | has-repro | Claude Code 2.1.266 linux Streamable HTTP walk. |
| `cousins.json` | cousins | Cite-only #50289 #16837. |
| `fixtures.json` | fixtures | Row list for the stopcock booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for open vs seated. |

Clip any file onto `projects/stopcock/index.html`. Buttons load the seeded path. The living page admits **open** / idle booth / #93143.

The bench reconstructs the reporter’s Streamable HTTP timeout walk from the published #93143 body. This plumbing booth does not run Claude.

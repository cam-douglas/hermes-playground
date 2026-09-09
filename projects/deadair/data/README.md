# Dead Air fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93155 issue facts: requests silently stall for 900s with no error or retry logged. Score deadair or admit carrier.

Idle word: **carrier**. Seeded word: **deadair**. Path word: **squelch**. HOLD: **carrier** / **timely-response** / **hold**. ALARM: **deadair** / **squelch** / **ewr-colo** / **keepalive-acked** / **zero-response-bytes** / **api-timeout-900s** / **no-log-entry** / **quantized-stalls** / **stream-idle-120s** / **clean-bos-control** / **has-repro** / **cousins** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#93155](https://github.com/anthropics/claude-code/issues/93155).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Scuttle/#93154 (remote SSH warm-up-failure `server.shutdown`). Not Stopcock/#93143 (Streamable HTTP MCP ~6min hard seat). Not Parergon/#93122 (stealth idle over `/btw` aside). Not Stereotype/#93108 (plugin update version-string-only freshness). Not Midden/#93081 (WorktreePool partial-remove GC remound). Not Guillotine/#92974 / Clepsydra / Fusee / Procrustes / Reed / Quench / Wildcat/#92399 / Snatch / Deadman / leftover woodworking / mm-slider. Different paradigm: Established TCP + keepalive ACK + 0 HTTP bytes + 900s silent wait with nothing logged.

| File | Verdict | What it scores |
|---|---|---|
| `carrier.json` | carrier | Idle booth. HOLD: timely response; timeout/retry would be logged. |
| `deadair.json` | deadair | Seeded #93155 path. ALARM: TCP alive, 0 bytes, 900s silence, no log. |
| `93155.json` | deadair | Primary fixture alias for #93155. |
| `squelch.json` | squelch | Path word: a live keepalive with zero bytes is a squelch. |
| `hold.json` | hold | HOLD alias: admit carrier. |
| `timely-response.json` | timely-response | HOLD: HTTP response arrives. |
| `walk.json` | walk | Published idle → ACK → zero bytes → keepalive → EWR → 900s → no log → deadair → squelch. |
| `ewr-colo.json` | ewr-colo | Spectrum IPv6 → Cloudflare EWR (Zayo AS6461). |
| `keepalive-acked.json` | keepalive-acked | Keepalive at 63.5s ACKed immediately. |
| `zero-response-bytes.json` | zero-response-bytes | 907,582 bytes uploaded; rx=0. |
| `api-timeout-900s.json` | api-timeout-900s | `API_TIMEOUT_MS=900000`. |
| `no-log-entry.json` | no-log-entry | connection retries : 0; api errors : 0. |
| `quantized-stalls.json` | quantized-stalls | 903–914s, 1807s, 2709s. |
| `stream-idle-120s.json` | stream-idle-120s | Separate ~120.0s timer. |
| `clean-bos-control.json` | clean-bos-control | T-Mobile → BOS; 0/4485 stalls. |
| `has-repro.json` | has-repro | 2.1.260 claude-desktop + Windows 11 Pro 26200 walk. |
| `cousins.json` | cousins | Cite-only #93120 #87424 #74544 #90764 #91970 #90964 #32982. |
| `fixtures.json` | fixtures | Row list for the deadair booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for carrier vs deadair. |

Clip any file onto `projects/deadair/index.html`. Buttons load the seeded path. The living page admits **carrier** / idle booth / #93155.

The booth reconstructs the reporter’s silent-stall walk from the published #93155 body. This broadcast booth does not run Claude.

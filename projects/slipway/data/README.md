# Slipway fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94458 issue facts: Windows Ethernet→Wi-Fi undock ends the mid-stream turn with no retry; background sessions silently idle. Score slipway or admit moored.

Idle word: **moored**. Path word: **iface-swap**. Seeded loss: **slipped**. Product: **slipway**. HOLD: **moored**. ALARM: **slipped** / **iface-swap** / **mid-stream-cut**. Primary: [anthropics/claude-code#94458](https://github.com/anthropics/claude-code/issues/94458).

Fixtures record the published incident only. Request reconstructions are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `moored.json` | moored | Idle cradle. HOLD: turn survives iface swap via retry. |
| `slipped.json` | slipped | Seeded #94458 path and product. ALARM: iface-swap miss. |
| `94458.json` | slipped | Same seeded path under the issue number. |
| `iface-swap.json` | iface-swap | Path: Ethernet→Wi-Fi NIC handoff treated as terminal. |
| `lashed.json` | lashed | HOLD alias: lines still hold the hull. |
| `warped.json` | warped | HOLD alias: hull still warped along the pier. |
| `fendered.json` | fendered | HOLD alias: fenders still between hull and dock. |
| `nic-handoff.json` | nic-handoff | USB-dock Ethernet goes away; Wi-Fi takes over. |
| `mid-stream-cut.json` | mid-stream-cut | Connection lost mid-response treated as terminal. |
| `no-retry.json` | no-retry | No Retrying (n/10); no system/api_error JSONL. |
| `bg-idle.json` | bg-idle | sessionKind bg silently idle. |
| `ethernet-drop.json` | ethernet-drop | Realtek USB 2.5GbE vanishes. |
| `wifi-reseize.json` | wifi-reseize | Intel Wi-Fi 7 BE211 Up in ~2s. |
| `connection-lost.json` | connection-lost | Assistant synthetic error then turn_duration. |
| `turn-abandoned.json` | turn-abandoned | Recovery never came from a retry. |
| `cradle.json` | mid-stream-cut | Six-row night log fixture. |
| `landing.json` | landing | Slipway / pier / undock / NIC-handoff. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Keel cradle / sodium lamp / eth dock. |
| `walk.json` | walk | Published idle moored → iface-swap → slipped. |
| `closed.json` | closed | #94458 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#87987 — subagent stream no-retry but parent logged api_error. DIFFERENT.

#89552 — macOS Wi-Fi drop sticky ECONNRESET. DIFFERENT.

#94458 is specifically: Windows Ethernet→Wi-Fi undock; missing mid-stream retry; silent bg death.

## Backups (cite only — do NOT auto-pick or build)

#93924 #93770 #93777 #94151

Drop any file onto `projects/slipway/index.html`. Buttons load the seeded path. The cradle admits **moored** / idle desk / #94458.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

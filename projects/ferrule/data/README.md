# Ferrule fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92968 issue facts: Claude Desktop hardcodes the MCP OAuth callback listener to TCP 53280; a Hyper-V winnat/hns excluded range containing 53280 refuses the bind with EACCES and the browser consent window never opens. CLI on the same machine requests OS-assigned port 0. Score ferruled or admit ephemeral.

Idle word: **ephemeral**. Path word: **ferruled**. Seeded recover: **rebound**. HOLD: **ephemeral**. ALARM: **ferruled** / **rebound** / **hardcoded-53280** / **excluded-range** / **eacces-bind** / **no-consent** / **no-fallback** / **no-retry** / **cli-port-0** / **cli-parity** / **winnat-hns** / **dynamic-range** / **workaround-range** / **eacces-not-eaddrinuse** / **redirect-from-assigned** / **cousins** / **before-after** / **fixtures**. Primary: [anthropics/claude-code#92968](https://github.com/anthropics/claude-code/issues/92968).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No Desktop automation. No patch to anthropics/claude-code. Not Mailslot/#92839 (Keychain persist). Not Shibboleth/#92966 (GrowthBook Invalid API Key). Not Interlock/#92976 (Dispatch exclusiveCwd). Not Speakpipe/#92646 (SendMessage). Not Homestead/#92932 (HOME rg TCC). Not #84795 (cite only).

| File | Verdict | What it scores |
|---|---|---|
| `ephemeral.json` | ephemeral | Idle booth. HOLD: OS-assigned port 0 / CLI-parity listening. |
| `ferruled.json` | ferruled | Seeded #92968 path. ALARM: 53280 in excluded range → EACCES. |
| `92968.json` | ferruled | Primary fixture alias for #92968. |
| `rebound.json` | rebound | Bind port 0; redirect from assigned; retry/fallback. |
| `walk.json` | ferruled | Published Desktop 53280 → EACCES → no consent; CLI port 0. |
| `hardcoded-53280.json` | hardcoded-53280 | Desktop hardcodes TCP 53280. |
| `excluded-range.json` | excluded-range | 53249–53348 contains 53280. |
| `eacces-bind.json` | eacces-bind | listen EACCES 127.0.0.1:53280. |
| `no-consent.json` | no-consent | Browser consent window never opens. |
| `no-fallback.json` | no-fallback | No fallback port. |
| `no-retry.json` | no-retry | Connector does not retry. |
| `cli-port-0.json` | cli-port-0 | CLI requests OS-assigned port 0. |
| `cli-parity.json` | cli-parity | Desktop must match CLI. |
| `winnat-hns.json` | winnat-hns | winnat/hns reserve dynamic blocks. |
| `dynamic-range.json` | dynamic-range | Start 53000 Number 1000. |
| `workaround-range.json` | workaround-range | start=54000 num=11536 then reboot. |
| `eacces-not-eaddrinuse.json` | eacces-not-eaddrinuse | EACCES, not EADDRINUSE. |
| `redirect-from-assigned.json` | redirect-from-assigned | Build redirect from assigned port. |
| `cousins.json` | cousins | Cite-only #84795 CLOSED. |
| `before-after.json` | before-after | Before ferruled; after expected ephemeral. |
| `fixtures.json` | fixtures | Row list for the ferrule booth. |

Drop any file onto `projects/ferrule/index.html`. Buttons load the seeded path. The living page admits **ephemeral** / idle booth / #92968.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

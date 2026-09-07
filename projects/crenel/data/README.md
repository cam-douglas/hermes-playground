# Crenel fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92729 issue facts: MCP server advertising `resources` capability as `{}` is treated as having none. Score bricked or admit crenelled.

Idle word: **bricked**. Seeded word: **crenelled**. HOLD: **crenelled**. ALARM: **bricked** / **empty-object-capability** / **list-no-resources** / **read-unsupported** / **tools-still-work** / **stdio-listChanged-works** / **wire-curl-ok** / **assertCapability-truthy** / **upstream-reject** / **instructions-truncated-proof** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92729](https://github.com/anthropics/claude-code/issues/92729).

Fixtures record the published incident (empty-object capability; List finds none; Read says unsupported; tools still work; stdio listChanged:false control works; wire curl 200; assertCapability truthy; upstream reject; instructions truncated 2221→2048). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `bricked.json` | bricked | Idle crenel. ALARM: empty resources:{} capability walled over. |
| `crenelled.json` | crenelled | Seeded hold. Empty-object capability acknowledged as support. |
| `92729.json` | bricked | Primary fixture alias for #92729. |
| `empty-object-capability.json` | empty-object-capability | initialize advertises `{"resources":{},"tools":{}}`. |
| `list-no-resources.json` | list-no-resources | ListMcpResourcesTool returns no resources. |
| `read-unsupported.json` | read-unsupported | ReadMcpResourceTool says the server does not support resources. |
| `tools-still-work.json` | tools-still-work | tools/* from the same server still work. |
| `stdio-listChanged-works.json` | stdio-listChanged-works | stdio neighbour with listChanged:false is listed correctly. |
| `wire-curl-ok.json` | wire-curl-ok | curl initialize / list / read / templates all HTTP 200. |
| `assertCapability-truthy.json` | assertCapability-truthy | SDK assertCapability treats {} as truthy; not the rejector. |
| `upstream-reject.json` | upstream-reject | Something upstream decides the server has no resources. |
| `instructions-truncated-proof.json` | instructions-truncated-proof | Instructions truncated 2221→2048 proves handshake parsed. |
| `cousins.json` | cousins | Cite-only #85230 / #80300 / #88128. Primary stays #92729. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the crenel bench. |

Drop any file onto `projects/crenel/index.html` or paste the JSON. The living page admits **bricked** / empty-object resources capability treated as absent / #92729.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

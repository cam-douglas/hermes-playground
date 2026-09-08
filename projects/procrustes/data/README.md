# Procrustes fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92900 issue facts: one legal boolean property schema anywhere in one tool's `inputSchema` (e.g. `"payload": true`, JSON Schema any-value) causes the Agent SDK CLI (0.1.77) converter to silently cull every tool from a connected stdio MCP server — bisect 0/53 vs 53/53 — with zero diagnostics. Score culled or admit intact.

Idle word: **intact**. Path word: **culled**. Seeded recovery: **relisted**. HOLD: **intact**. ALARM: **culled** / **relisted** / **bisect** / **connected-silent** / **boolean-trigger** / **object-form-workaround** / **cousins** / **sdk-0-1-77** / **before-after**. Primary: [anthropics/claude-code#92900](https://github.com/anthropics/claude-code/issues/92900).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `intact.json` | intact | Idle innkeeper. HOLD: 53/53 tools reach the API while the server reports connected. |
| `culled.json` | culled | Seeded #92900 path. ALARM: one boolean property schema silently drops 0/53. |
| `92900.json` | culled | Primary fixture alias for #92900. |
| `relisted.json` | relisted | Seeded recovery: object-form any-value restores 53/53. |
| `bisect.json` | bisect | Path without `payload:true` → 53/53; with it → 0/53; object-form → 53/53. |
| `connected-silent.json` | connected-silent | Server status connected; zero diagnostics. |
| `boolean-trigger.json` | boolean-trigger | `payload: true` inside `properties` — legal JSON Schema any-value. |
| `object-form-workaround.json` | object-form-workaround | `{ description: Any JSON value }` (no type) passes conversion. |
| `cousins.json` | cousins | Cite-only #88049 (OPEN) and #82949 (CLOSED not_planned). |
| `sdk-0-1-77.json` | sdk-0-1-77 | Agent SDK 0.1.77 bundled `cli.js` converter. |
| `before-after.json` | before-after | Boolean node → 0/53 culled; object-form → 53/53 relisted. |
| `fixtures.json` | index | Row list for the iron bed bench. |

Drop any file onto `projects/procrustes/index.html`. Buttons load the seeded path. The living page admits **intact** / idle innkeeper / #92900.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

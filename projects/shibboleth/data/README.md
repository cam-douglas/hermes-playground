# Shibboleth fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92966 issue facts: the bundled GrowthBook clientKey `sdk-zAZezfDKGoZuXXKe` is rejected by `cdn.growthbook.io` with HTTP 400 `Invalid API Key`; zero flags load; `claude doctor` reports the feature-flag service as unreachable so Remote Control fails closed. Score shibbolethed or admit admitted.

Idle word: **admitted**. Path word: **shibbolethed**. Seeded recover: **countersigned**. HOLD: **admitted**. ALARM: **shibbolethed** / **countersigned** / **invalid-api-key** / **zero-flags** / **doctor-unreachable** / **remote-control-closed** / **channels-dark** / **key-hardcoded** / **curl-400** / **cousins** / **before-after** / **fixtures** / **proxy-ruled-out** / **env-ruled-out**. Primary: [anthropics/claude-code#92966](https://github.com/anthropics/claude-code/issues/92966).

Fixtures record the published incident only. No live session. No secrets beyond the already-public clientKey. No exploit payloads. No network to Anthropic. No live Claude. No Desktop automation. No patch to anthropics/claude-code. Not Homestead/#92932 (HOME rg TCC hang). Not Procrustes/#92900 (MCP boolean schema culls tools). Not #64151 (cite only).

| File | Verdict | What it scores |
|---|---|---|
| `admitted.json` | admitted | Idle bench. HOLD: key accepted; flags load; Remote Control open. |
| `shibbolethed.json` | shibbolethed | Seeded #92966 path. ALARM: 400 Invalid API Key + doctor unreachable + RC closed. |
| `92966.json` | shibbolethed | Primary fixture alias for #92966. |
| `countersigned.json` | countersigned | Rotated/restored key accepted; honest Invalid-API-Key surface. |
| `walk.json` | shibbolethed | Published launch → 400 → zero flags → doctor → RC closed walk. |
| `invalid-api-key.json` | invalid-api-key | CDN 400 Invalid API Key body. |
| `zero-flags.json` | zero-flags | No flags load after rejection. |
| `doctor-unreachable.json` | doctor-unreachable | Doctor frames a key reject as offline/blocked. |
| `remote-control-closed.json` | remote-control-closed | Remote Control fails closed. |
| `channels-dark.json` | channels-dark | Channels unavailable per #64151 cite. |
| `key-hardcoded.json` | key-hardcoded | clientKey still in the 2.1.266 binary. |
| `curl-400.json` | curl-400 | Live curl 5/5 on 2026-09-09. |
| `proxy-ruled-out.json` | proxy-ruled-out | CDN reachable; not a local-network block. |
| `env-ruled-out.json` | env-ruled-out | GrowthBook kill-switches unset; Max auth valid. |
| `cousins.json` | cousins | Cite-only #64151 and Remote Control cousins. |
| `before-after.json` | before-after | Before shibbolethed; after expected admitted. |
| `fixtures.json` | fixtures | Row list for the watchword booth. |

Drop any file onto `projects/shibboleth/index.html`. Buttons load the seeded path. The living page admits **admitted** / idle bench / #92966.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

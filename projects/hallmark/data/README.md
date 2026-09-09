# Hallmark fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93021 issue facts: `--resume` loses the `[1m]` context window on a non-first-party `ANTHROPIC_BASE_URL` when the session model differs from the settings default. Score debased or admit sterling.

Idle word: **sterling**. Seeded word: **debased**. Path word: **rubbed**. HOLD: **sterling** / **hold**. ALARM: **debased** / **rubbed** / **bare-model-id** / **missing-1m-suffix** / **context-window-200k** / **beta-header-missing** / **non-first-party-base-url** / **settings-model-mismatch** / **transcript-modelId-ignored** / **api-echoed-bare-id** / **proxy-masked-on-first-party** / **matching-settings-keeps-1m** / **has-repro** / **cousins** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#93021](https://github.com/anthropics/claude-code/issues/93021).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Flashpan/#93015 (`lastRunAt` without session). Not Secateurs/#92979 (Read silent partial). Not Palinode/#92998 (MEMORY.md bottom truncation). Not Ferrule/#92968 (Desktop hardcoded 53280). Not Assay (tool-argument cupellation). Not leftover woodworking / mm-slider.

| File | Verdict | What it scores |
|---|---|---|
| `sterling.json` | sterling | Idle booth. HOLD: resume keeps `[1m]`, 1M window, beta header. |
| `debased.json` | debased | Seeded #93021 path. ALARM: resume restores bare id, 200k, no beta. |
| `93021.json` | debased | Primary fixture alias for #93021. |
| `rubbed.json` | rubbed | Path word: the `[1m]` purity mark was rubbed off. |
| `hold.json` | hold | HOLD alias: exact modelId with `[1m]` restored. |
| `walk.json` | walk | Published non-first-party → settings mismatch → transcript ignored → bare id → missing `[1m]` → API echo → 200k → beta missing. |
| `bare-model-id.json` | bare-model-id | Second record with bare `claude-fable-5-1`. |
| `missing-1m-suffix.json` | missing-1m-suffix | `modelUsage` key loses `[1m]`. |
| `context-window-200k.json` | context-window-200k | Resume `contextWindow` 200000. |
| `beta-header-missing.json` | beta-header-missing | `anthropic-beta` missing `context-1m-2025-08-07`. |
| `non-first-party-base-url.json` | non-first-party-base-url | Proxy `http://127.0.0.1:8798`. |
| `settings-model-mismatch.json` | settings-model-mismatch | Settings `opus[1m]` vs session `claude-fable-5-1[1m]`. |
| `transcript-modelId-ignored.json` | transcript-modelId-ignored | Fresh `modelId` with `[1m]` ignored on resume. |
| `api-echoed-bare-id.json` | api-echoed-bare-id | Assistant messages carry API-echoed bare id. |
| `proxy-masked-on-first-party.json` | proxy-masked-on-first-party | Control: without proxy both 1000000. |
| `matching-settings-keeps-1m.json` | matching-settings-keeps-1m | Control: matching settings through proxy keeps `[1m]`. |
| `has-repro.json` | has-repro | Proxy + mismatch + three session ids at 100%. |
| `cousins.json` | cousins | Cite-only #64771 #60548 #80272 #67806 #81142 #88345 #81068 #90325 #90324. |
| `fixtures.json` | fixtures | Row list for the hallmark booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for sterling vs debased. |

Drop any file onto `projects/hallmark/index.html`. Buttons load the seeded path. The living page admits **sterling** / idle booth / #93021.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

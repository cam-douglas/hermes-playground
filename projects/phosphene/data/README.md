# Phosphene fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94003 issue facts: while a response streams, WindowServer re-walks a ~50-level CoreAnimation tree at 120 Hz (~47% CPU; idle 3-6%). Score phosphene or admit quiescent.

Idle word: **quiescent**. Path word: **layer-tree-walk**. Seeded loss: **phosphene**. Product: **phosphene**. HOLD: **quiescent**. ALARM: **phosphene** / **layer-tree-walk** / **ca-prepare** / **prepare-layer0**. Primary: [anthropics/claude-code#94003](https://github.com/anthropics/claude-code/issues/94003).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `quiescent.json` | quiescent | Idle field. HOLD: WindowServer 3-6%; no CA re-walk. |
| `hold.json` | hold | HOLD alias for idle quiescent. |
| `phosphene.json` | phosphene | Seeded #94003 path and product. ALARM: CA tree re-walked. |
| `layer-tree-walk.json` | layer-tree-walk | Path: compositor does 120 Hz vsync work the user did not ask for. |
| `cooled.json` | cooled | HOLD alias: field cooled; no entoptic flash. |
| `steady-frame.json` | steady-frame | HOLD alias: vsync without a deep CA re-walk. |
| `idle-ws.json` | idle-ws | HOLD alias: WindowServer stays 3-6%. |
| `no-rewalk.json` | no-rewalk | HOLD alias: prepare_layer0 does not recurse ~50 levels. |
| `ca-prepare.json` | ca-prepare | `ca_prepare_begin_window_update` each vsync. |
| `prepare-layer0.json` | prepare-layer0 | `prepare_layer0` recursion of the Claude CA tree. |
| `windowserver-47.json` | windowserver-47 | Streaming ~47% of one core. |
| `layer-depth-50.json` | layer-depth-50 | ~50-level CoreAnimation tree. |
| `refresh-120.json` | refresh-120 | 120 Hz re-walk. |
| `streaming-cpu.json` | streaming-cpu | 2-minute trace 41-51%. |
| `idle-cpu.json` | idle-cpu | Idle same window 3-6%. |
| `liquid-xdr.json` | liquid-xdr | 1512x982 @ 3024x1964; 120 Hz. |
| `m3-pro.json` | m3-pro | MacBook Pro M3 Pro. |
| `landing.json` | landing | Clinic landing / vitreous sill. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #93811 Windows desktop CPU spikes. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Charcoal / vitreous lilac / phosphene flash / sclera / iris teal. |
| `walk.json` | walk | Published idle quiescent → layer-tree-walk → phosphene. |

## Cousins (cite only)

#93811 — Windows desktop CPU spikes. Different: Windows compositor path, not macOS WindowServer CA layer-tree thrash. Do not conflate.

## Backups (cite only — do NOT auto-pick or build)

#93770 #93777 #93924 #93925 #93967 #93957 #93987 #93996

Drop any file onto `projects/phosphene/index.html`. Buttons load the seeded path. The living page admits **quiescent** / idle field / #94003.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

# Lictor fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94053 issue facts: desktop Code-tab model picker does not dispatch PreModelSwitch or PostModelSwitch; CLI /model does. Score lictor or admit attested.

Idle word: **attested**. Path word: **picker-bypass**. Seeded loss: **lictor**. Product: **lictor**. HOLD: **attested**. ALARM: **lictor** / **picker-bypass** / **desktop-picker**. Primary: [anthropics/claude-code#94053](https://github.com/anthropics/claude-code/issues/94053).

Fixtures record the published incident only. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `attested.json` | attested | Idle aisle. HOLD: hooks fired in order; Pre then Post; policy gate held. |
| `hold.json` | hold | HOLD alias for idle attested. |
| `lictor.json` | lictor | Seeded #94053 path and product. ALARM: chair taken, tablet blank. |
| `picker-bypass.json` | picker-bypass | Path: desktop picker skips dispatch. |
| `heralded.json` | heralded | HOLD alias: fasces raised. |
| `preceded.json` | preceded | HOLD alias: lictor walked first. |
| `dispatched.json` | dispatched | HOLD alias: hooks dispatched. |
| `logged.json` | logged | HOLD alias: tablet wrote both rows. |
| `bound.json` | bound | HOLD alias: iron rods bound. |
| `pre-model-switch.json` | pre-model-switch | Fasces must rise before apply. |
| `post-model-switch.json` | post-model-switch | Fasces must attest after apply. |
| `desktop-picker.json` | desktop-picker | Code-tab picker takes the chair. |
| `cli-model.json` | cli-model | CLI `/model` still dispatches both. |
| `zero-rows.json` | zero-rows | Two picker changes; zero rows. |
| `silent-bypass.json` | silent-bypass | No error, no log row. |
| `policy-gate.json` | policy-gate | PreModelSwitch can block; picker never asks. |
| `landing.json` | landing | Forum aisle / fasces / curule chair. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #93742 #93757 #90817 #93919 #91767. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Forum aisle / fasces / curule chair. |
| `walk.json` | walk | Published idle attested → picker-bypass → lictor. |
| `closed.json` | closed | Closed chip. |

## Cousins (cite only)

Different surface from #94053 picker-bypass. Do NOT rebuild. Do NOT conflate.

CLI `/model` is the working control (same hooks, same machine). Not a cousin issue — the positive control.

#93742 — Rescript: /model save-as-default wipes settings.json. Distinct cousin.

#93757 — Changeling: remote reconnect reinjects default model. Distinct cousin.

#90817 — model-conditional plugins/hooks. Enhancement. Distinct cousin.

#93919 — export model id / PostModelSwitch sidecar. Enhancement. Distinct cousin.

#91767 — hook payloads missing model. Enhancement. Distinct cousin.

#94053 is specifically: desktop picker bypasses Pre/PostModelSwitch while CLI `/model` still dispatches both.

## Backups (cite only — do NOT auto-pick or build)

#94029 #93987 #93924 #93770 #93777 #94151 #94064 #94174

Drop any file onto `projects/lictor/index.html`. Buttons load the seeded path. The attested page admits **attested** / idle aisle / #94053.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

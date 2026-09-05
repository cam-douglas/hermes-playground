# Nixie fixtures

Diagnostic JSON only. No payloads. No live Claude sessions. Encoded from #92383 issue facts: on Claude Desktop for Windows **1.46388.3** (Code tab), a cross-session `send_message` (ccd_session_mgmt MCP) from a sender whose permission mode is `auto` is silently discarded. The same message from a `bypassPermissions` sender delivers. Sender tool result still reports "Message sent/queued"; recipient UI may show the message block optimistically; but no user turn is written to the recipient transcript and no model turn runs. Delivered sends show a Mapping line in `main.log` within seconds; dropped sends never get Mapping, then after ~45s (sometimes 90s): `peer input … drew no acknowledgement … settled as undelivered`. 14/14 dropped sends from auto-mode senders; every delivered send from bypassPermissions. 25 settled-as-undelivered events in one main.log across 6 days.

Idle word: **nixied**. Seeded word: **settled**. Primary: [anthropics/claude-code#92383](https://github.com/anthropics/claude-code/issues/92383). Seed primary as settled / no Mapping / 45s no-ack.

| File | Verdict | What it scores |
|---|---|---|
| `nixied.json` | nixied | Idle undeliverable-mail fence. Auto sender; no Mapping; settle after 45s. |
| `settled.json` | settled | Seeded #92383. Settled as undelivered; no Mapping; ownedCycle=true. |
| `92383.json` | settled | Primary fixture alias for #92383. Auto-drop / false-sent / no-ack. |
| `auto-drop.json` | nixied | Auto permission-mode sender. 14/14 dropped. Silent discard. |
| `bypass-deliver.json` | mapped | Contrast hold. bypassPermissions sender. Mapping line within seconds. |
| `repro.json` | settled | Published A/B: same session, same cwd; flip only permission mode. |
| `mapped.json` | mapped | Mapping frank present; user turn written; model turn ran. |
| `remediation-bypass.json` | mapped | Workaround: switch senders that must report back to bypassPermissions. |
| `remediation-verify.json` | mapped | Workaround: grep main.log settle signature + transcript fingerprint; resend. |
| `cousins.json` | stay-off | Cite-only cousins #86014 #86059 + stay-off catalog surfaces. |
| `fixtures.json` | index | Row list for the nixie sorting desk. |

Drop any file onto `projects/nixie/index.html` or paste the JSON. The living page seeds **settled** / no Mapping.

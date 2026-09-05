# Intake fixtures

Diagnostic JSON only. No credentials. No payloads. Encoded from #92305 issue facts: `claude -p` piped stdin counted ~1.78× toward the context limit (refusal attributes the surplus to "system prompt, tool definitions, and attachment content"). Fixed overhead ~16k. cwd Δ ~5 tokens. `--bare` avoids the ratio but drops OAuth. Same ratio for plain stdin and `--input-format stream-json`.

Idle word: **once**. Seeded word: **doubled**. Primary: [anthropics/claude-code#92305](https://github.com/anthropics/claude-code/issues/92305).

| File | Verdict | What it scores |
|---|---|---|
| `once.json` | once | Idle hold. Piped stdin composed once (prompt path only). |
| `doubled.json` | doubled | Seeded #92305. Same stream as prompt and attachment. 1,014,989 / 566,880. |
| `92305.json` | doubled | Primary fixture alias for #92305. |
| `hold.json` | hold | persistHold keeps the intake composed once. |
| `bare.json` | bare | `--bare` avoids the ratio but drops OAuth. |
| `stream-json.json` | stream-json | Same ratio via `--input-format stream-json`: 2,060,987 / 1,152,395. |
| `halved.json` | halved | Halve the file; it completes; reported usage shows the same ~1.78× ratio. Effective window already ~560k. |
| `cwd.json` | once | cwd is not the cause (~5 token delta). |
| `packet.json` | doubled | Doubled packet: 1,452,075 / 821,184. |
| `control.json` | doubled | 4.64 MB control: 2,057,985 / 1,153,965. |
| `cousins.json` | cite-only | #12312 CLOSED — same "Prompt is too long" below-limit symptom. Cite only. |
| `fixtures.json` | index | Row list for the scoring desk. |

Drop any file onto `projects/intake/index.html` or paste the JSON. The living page seeds **doubled**.

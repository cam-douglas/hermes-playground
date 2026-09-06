# Diopter fixtures

Diagnostic JSON only. No live Claude sessions. No real tokens. Encoded from #92524 issue facts: the per-session scratchpad UUID in the system prompt is the only cross-session prompt diff, invalidating the cached prefix on every new session. Score defocused or admit sharp.

Idle word: **defocused**. Seeded word: **sharp**. HOLD: **sharp**. ALARM: **defocused** / **uuid-diff** / **cache-miss** / **rewrite-16157** / **normalized-hit** / **cousins**. Primary: [anthropics/claude-code#92524](https://github.com/anthropics/claude-code/issues/92524).

Fixtures record measured wall times, `input_tokens`, block sizes, and the two published scratchpad UUIDs. No capture-server traffic. No secrets.

| File | Verdict | What it scores |
|---|---|---|
| `defocused.json` | defocused | Idle refraction bench. UUID lens in system. Prefix out of focus. |
| `sharp.json` | sharp | Seeded hold. UUID normalised. Cache hit 0.4 s / 5. |
| `92524.json` | defocused | Primary fixture alias for #92524. |
| `uuid-diff.json` | uuid-diff | Tools + messages identical; system differs at one UUID. |
| `cache-miss.json` | cache-miss | New session writes system+tools instead of reading them. |
| `rewrite-16157.json` | rewrite-16157 | 30.6 s / 16,157 when only the UUID differs. |
| `normalized-hit.json` | normalized-hit | UUID normalised 0.4 s / 5. MCP 131.7 → 17.3 → 8.3. |
| `cousins.json` | cousins | Cite-only #77306 #92033 #90953. |
| `fixtures.json` | index | Row list for the refraction bench. |

Drop any file onto `projects/diopter/index.html` or paste the JSON. The living page admits **defocused** / UUID lens / #92524.

Repro in the issue is two consecutive `claude -p "hi"` runs captured via `ANTHROPIC_BASE_URL`. This assay does not run that capture.

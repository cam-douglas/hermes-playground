# Touchstone fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92599 issue facts: built-in Write/Edit denied by permission-validation with 401 "API key is invalid", gated purely by file extension; also disables Auto mode; fires under bypassPermissions; precedes PreToolUse; Desktop child session only (headless `claude -p` succeeds). Score fouled or admit proved.

Idle word: **fouled**. Seeded word: **proved**. HOLD: **proved**. ALARM: **fouled** / **extension-gate** / **false-401** / **auto-disabled** / **precedes-pretooluse** / **desktop-session-only** / **bypass-permissions** / **auth-shape** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92599](https://github.com/anthropics/claude-code/issues/92599).

Fixtures record the published error, extension gate, auth-header shapes, and Desktop-vs-headless discriminator. No live session. No secrets.

| File | Verdict | What it scores |
|---|---|---|
| `fouled.json` | fouled | Idle bench. Script/extension-less Write/Edit denied with permission-rule 401. |
| `proved.json` | proved | Seeded hold. Validation authenticates for script extensions; Auto mode works. |
| `92599.json` | fouled | Primary fixture alias for #92599. |
| `extension-gate.json` | extension-gate | Script fail vs content pass; `.json` passes, `.jsonl` fails. |
| `false-401.json` | false-401 | Message matches invalid x-api-key class; `request_id` null; `permission-rule`. |
| `auto-disabled.json` | auto-disabled | Auto mode dead because approval uses the same failing validation. |
| `precedes-pretooluse.json` | precedes-pretooluse | Script 401 before PreToolUse; pass targets then stopped by the hook. |
| `desktop-session-only.json` | desktop-session-only | Desktop child fails; headless `claude -p` writes `.mjs`. |
| `bypass-permissions.json` | bypass-permissions | Fires under `bypassPermissions`. |
| `auth-shape.json` | auth-shape | Seven `/v1/messages` shapes; failing write matches non-empty invalid `x-api-key`. |
| `cousins.json` | cousins | Cite-only #92518 / #92582. Primary stays #92599. |
| `has-clear-repro.json` | has-clear-repro | Labeled has repro; 14-target one-turn gate; 36/16/36 census. |
| `fixtures.json` | index | Row list for the touchstone bench. |

Drop any file onto `projects/touchstone/index.html` or paste the JSON. The living page admits **fouled** / extension-gated permission-rule 401 / #92599.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

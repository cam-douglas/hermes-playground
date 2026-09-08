# Mailslot fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92839 issue facts: MCP OAuth via `claude mcp add` + `/mcp` login completes the full browser exchange (authorization code + PKCE, Cognito/OIDC) — the callback stamps **Login successful, close the window** — but Claude Code fails to persist credentials to macOS Keychain when the serialized credential blob exceeds `security -i`'s ~4096-byte stdin line-buffer. The argv fallback that was supposed to handle oversized payloads (fix for #30337 in 2.1.69) itself fails silently with a terse debug-only `Error during auth completion: pbt`. Normal UI still shows the server as unauthenticated. Payloads ~7.3KB are well under `ARG_MAX` (~1MB). Score spilled or admit vaulted.

Idle word: **vaulted**. Path word: **spilled**. Seeded unauthenticated: **voided**. HOLD: **vaulted**. ALARM: **spilled** / **voided** / **oversized-warn** / **argv-pbt** / **thin-payload** / **thick-payload** / **discovery-state** / **login-success** / **before-after**. Primary: [anthropics/claude-code#92839](https://github.com/anthropics/claude-code/issues/92839).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. Token and issuer fields are redacted placeholders.

| File | Verdict | What it scores |
|---|---|---|
| `vaulted.json` | vaulted | Idle night slot. HOLD: thick packet vaults into Keychain. |
| `spilled.json` | spilled | Seeded #92839 path. ALARM: oversized + argv fallback died. |
| `92839.json` | spilled | Primary fixture alias for #92839. |
| `voided.json` | voided | Seeded unauthenticated: UI still shows the server unsigned. |
| `oversized-warn.json` | oversized-warn | WARN: Keychain payload (N B JSON) exceeds security -i stdin. |
| `argv-pbt.json` | argv-pbt | Argv fallback dies with cryptic `pbt`. |
| `thin-payload.json` | thin-payload | Control: thin letter under 4096B takes stdin and vaults. |
| `thick-payload.json` | thick-payload | ~7333B / 7347B packet; argv fallback fails. |
| `discovery-state.json` | discovery-state | OIDC discovery + RFC 9728 + tokens bundled in one blob. |
| `login-success.json` | login-success | Browser OAuth succeeded; persist is the failing step. |
| `before-after.json` | before-after | #30337 / 2.1.69 stdin fix vs broken argv fallback. |
| `fixtures.json` | index | Row list for the night counter. |

Drop any file onto `projects/mailslot/index.html`. Buttons load the seeded path. The living page admits **vaulted** / idle flap / #92839.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

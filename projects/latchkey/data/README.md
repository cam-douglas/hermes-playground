# Latchkey fixtures

Diagnostic JSON only. No credentials. No OAuth tokens. No live API calls. Encoded from #92330 issue facts: with `remoteControlAtStartup: true`, the first session after overnight access-token expiry prints "Remote Control disconnected — Claude.ai login expired — run /login to restore Remote Control" while the refresh token is valid for weeks. `/remote-control` in the same session connects with the same credentials. The startup guard re-reads `expiresAt` via `E3t()` and never consults `FAn()` (`refreshToken != null`).

Idle word: **waiting**. Seeded word: **miskeyed**. Primary: [anthropics/claude-code#92330](https://github.com/anthropics/claude-code/issues/92330).

Timestamps in these files are the published `expiresAt` epoch values from the issue (credential clock faces, not secrets). This desk never ships token strings and never calls a token endpoint.

| File | Verdict | What it scores |
|---|---|---|
| `waiting.json` | waiting | Idle hold. Refresh path present; guard does not demand `/login`. |
| `miskeyed.json` | miskeyed | Seeded #92330. Access stale; refreshToken renewable; `/login` demanded. |
| `92330.json` | miskeyed | Primary fixture alias for #92330. |
| `renewable.json` | renewable | refreshToken expiresAt 1791042620089 → 2026-10-03 17:50:20 (~4 more weeks). |
| `contended.json` | contended | `OAuthRefreshLockContendedError` on `~/.claude/.oauth_refresh.lock` (stale window 60s). |
| `false-login.json` | false-login | Banner says re-login required; same credentials work seconds later. |
| `cheap-retry.json` | cheap-retry | `/remote-control` in the same session connects; no `/login` needed. |
| `overnight-stale.json` | overnight-stale | Access token ~8h TTL; always stale when Claude Code is not running overnight. |
| `refresh-path.json` | refresh-path | `FAn()` would be true (`refreshToken != null`); guard never consults it. |
| `timestamps.json` | clocks | Published dead / access / refresh expiresAt faces from the issue. |
| `guard.json` | guard | Startup guard shape: `ys` → `E3t` → `oauth_expired_unrefreshable`; no `FAn()`. |
| `cousins.json` | stay-off | Cite-only cousins + backups document only. |
| `fixtures.json` | index | Row list for the scoring desk. |

Drop any file onto `projects/latchkey/index.html` or paste the JSON. The living page seeds **miskeyed**.

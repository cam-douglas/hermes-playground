# Latchkey hook

Tiny night-porter latchkey-board classifier notes for the Claude Code defect where Remote Control auto-start reports "re-login required" when the OAuth refresh simply has not landed yet and the credential is still renewable. With `remoteControlAtStartup: true`, the first session after overnight access-token expiry prints the `/login` banner. The refresh token is valid for weeks. `/remote-control` in the same session connects with the same credentials. The startup guard (2.1.260) after `ys({credentials, storageV5})` only re-reads `expiresAt` via `E3t()` and never consults `FAn()` (`refreshToken != null`). OPEN. Labels: bug, has repro, platform:windows, area:auth.

IDLE_WORD=waiting. SEEDED_WORD=miskeyed. Seeded state is miskeyed / #92330 (access stale; refreshToken renewable; `/login` demanded). Never idle as standing / razed / once / doubled / stuck / missed / gated / spilled / lit / blanked.

This stub is documentation only. The living page at `projects/latchkey/index.html` scores probes in-browser. No npm. No secrets. No real hooks. No exploits. No live OAuth. Diagnostic shapes only (published `expiresAt` clock faces, guard names `ys` / `E3t` / `FAn`, lock path `~/.claude/.oauth_refresh.lock`, simulated `/login` vs `/remote-control` choice). No token strings. No token-endpoint calls.

Preferred fix / detection (document only — do not treat this stub as a live hook):

1. Before reporting an auth failure, check whether a refresh path exists (`FAn()` / non-expired `refreshToken`), or
2. If refreshToken is present and unexpired, treat the miss as transient (retry / same path as `/remote-control`) and do not record `bridgeOauthDead*`, and
3. Demand `/login` only when there is no refresh path, or the refresh token is expired.

Detection: if `remoteControlAtStartup` is true, the first session after overnight access expiry emits `oauth_expired_unrefreshable`, `FAn()` was not consulted, `refreshToken` is present and unexpired, and `/remote-control` in the same session connects without `/login`, the board is already miskeyed.

Given a probe-shaped payload `{ refreshTokenPresent, refreshPath, refreshExpired, accessExpiredAtGuard, lockContended, consultedFAn, demandsLogin, cheapRetryWorks, overnightStale, persistHold, waiting, miskeyed, log }`:

- **WAITING** if a refresh path is present and the guard does not demand `/login`
- **MISKEYED** if access is stale, refreshToken is renewable, and the guard demands `/login` (#92330)
- **RENEWABLE** if refreshToken `expiresAt` is still weeks out
- **CONTENDED** if `OAuthRefreshLockContendedError` hit `~/.claude/.oauth_refresh.lock` (stale window 60s)
- **FALSE-LOGIN** if the banner says re-login required while the login is not expired
- **CHEAP-RETRY** if `/remote-control` in the same session connects
- **OVERNIGHT-STALE** if the access token (~8h TTL) went stale while Claude Code was not running
- **REFRESH-PATH** if `FAn()` would be true and the guard never asked

This is a diagnostic scoring desk. Not an exploit. No secrets. No live OAuth. Score whether the board is waiting or already miskeyed.

Primary: [anthropics/claude-code#92330](https://github.com/anthropics/claude-code/issues/92330). Cousins cite-only: [#90688](https://github.com/anthropics/claude-code/issues/90688), [#91708](https://github.com/anthropics/claude-code/issues/91708), [#88951](https://github.com/anthropics/claude-code/issues/88951). Backups document only: [#92335](https://github.com/anthropics/claude-code/issues/92335), [#92317](https://github.com/anthropics/claude-code/issues/92317), [#92318](https://github.com/anthropics/claude-code/issues/92318).

Hypothesis only (NON-BINDING): the startup guard collapses transient refresh lag into `oauth_expired_unrefreshable` because it never checks `FAn()` / `refreshToken`. Discard if issue evidence disagrees.

NOT leftover Deadlight porthole / Stubble furrow / Intake gauge-house / Pasteboard kraft / Spillway dam / Blurt CRT / Macule letterpress. Product name stays Latchkey.

# Latchkey

A **night-porter / brass latchkey board / morning latch desk** — dark oak board, brass hooks, hanging latchkeys, cool dawn window light, amber brass, slate, linen paper — Cormorant Garamond + Outfit + IBM Plex Mono — for a real Claude Code defect: **REMOTE CONTROL AUTO-START REPORTS "RE-LOGIN REQUIRED" WHEN THE OAUTH REFRESH SIMPLY HAS NOT LANDED YET (CREDENTIAL STILL RENEWABLE).**

Primary:

- [anthropics/claude-code#92330](https://github.com/anthropics/claude-code/issues/92330) (OPEN, bug, has repro, platform:windows, area:auth). Title: `Remote Control auto-start reports "re-login required" when the OAuth refresh simply hasn't landed yet (credential still renewable)`. Filed 2026-09-05. Reporter: Musco46.

00:50 latchkey: a morning latch that hands the expensive master key while the cheap latch still opens is not an expired login — it is already miskeyed. Score the board or admit the refresh path was still waiting.

Idle word: **waiting**. Seeded state: **miskeyed** / #92330 — startup guard demands `/login` while `refreshToken` is still renewable. Never idle as standing, razed, once, doubled, stuck, missed, gated, spilled, lit, blanked, or any prior catalog idle.

**Latchkey** is the brass board the night porter reads at dawn. The expensive master key (`/login`) glows as if the house lock were dead. The cheap latch (`/remote-control`) is still hanging on its hook and still opens.

- **waiting** = HOLD: refresh path present; guard does not demand `/login`
- **miskeyed** = #92330: access stale; refreshToken renewable; `/login` demanded
- **renewable** = refreshToken expiresAt 1791042620089 → 2026-10-03 17:50:20 (valid ~4 more weeks)
- **contended** = `OAuthRefreshLockContendedError` on `~/.claude/.oauth_refresh.lock` (stale window 60s)
- **false-login** = banner says login expired; the login is not expired
- **cheap-retry** = `/remote-control` in the same session connects; no `/login` needed
- **overnight-stale** = access token ~8h TTL; always stale when Claude Code is not running overnight
- **refresh-path** = `FAn()` would return `refreshToken != null`; the guard never consults it

Verdicts: waiting, miskeyed, renewable, contended, false-login, cheap-retry, overnight-stale, refresh-path.

This is a diagnostic scoring desk. Not an exploit. No secrets. No real OAuth tokens. No live API calls. Score whether the board is waiting or already miskeyed. Fixtures use published `expiresAt` clock faces from the issue only. The desk never ships credential strings and never calls a token endpoint.

Hypothesis only (NON-BINDING): the startup guard collapses transient refresh lag into `oauth_expired_unrefreshable` because it never checks `FAn()` / `refreshToken`. Discard if issue evidence disagrees. Encoded from the issue body only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92330](https://github.com/anthropics/claude-code/issues/92330)

What happened (from the issue — do not invent):

- Environment: claude-code 2.1.260 (global npm install, `bin/claude.exe`); Windows 11 Home 10.0.26200; entrypoint VS Code extension (also reproduces from the terminal); Pro; scopes include `user:sessions:claude_code`.
- With `remoteControlAtStartup: true`, the first session started after the access token has expired (the first launch of the day) reliably prints: "Remote Control disconnected — Claude.ai login expired — run /login to restore Remote Control".
- The login is not expired. The refresh token is valid for weeks. Running `/remote-control` in the same session, seconds later, connects successfully with the very same credentials — no `/login` needed.
- Startup guard (2.1.260 minified) after `ys({credentials, storageV5})` only re-reads `expiresAt` via `E3t()`. If still `<= Date.now()` it emits `oauth_expired_unrefreshable` / `[bridge:repl] Skipping: OAuth token expired and refresh failed (re-login required)`, surfaces the `/login` banner via `G?.("failed", Hve, "auth")`, and records `bridgeOauthDeadExpiresAt` / `bridgeOauthDeadFailCount`.
- It never consults `FAn()` (`refreshToken != null`). Adjacent helpers: `E3t()` reads `expiresAt`; `pUe()` reads `subscriptionType`; `FAn()` reads refresh-path presence.
- `ys()` can return without refreshing for transient reasons: `OAuthRefreshLockContendedError` on `~/.claude/.oauth_refresh.lock` (stale window 60s) when multiple sessions start, or a slow/unavailable token endpoint at boot.
- Access token ~8h TTL; only refreshed while Claude Code is running; always goes stale overnight. Every morning the bridge races its own refresh, loses, and declares the login dead while the refresh token is nowhere near expiry.
- Concrete machine data from the issue:
  - `bridgeOauthDeadExpiresAt` = 1788573991415 → 2026-09-05 04:06:31 (recorded dead)
  - accessToken `expiresAt` = 1788642627089 → 2026-09-05 23:10:27
  - refreshToken `expiresAt` = 1791042620089 → 2026-10-03 17:50:20 (valid ~4 more weeks)
- Fail-count backoff (`bridgeOauthDeadFailCount >= 3` and the same `expiresAt`) resets each morning because a new stale `expiresAt` arrives, so the banner repeats indefinitely. It only reaches 3 if several sessions launch the same morning — then Remote Control is skipped with no banner.
- The proactive refresh cycle already classifies three ways (`oauth_rejected_after_refresh`, `oauth_rejected_refresh_failed`, `oauth_rejected_no_refresh_path`). The startup guard collapses all three into `oauth_expired_unrefreshable`.
- `/login` mints fresh tokens, so the wrong remedy appears to work. Users conclude Remote Control requires a daily interactive re-login.

Suggested fixes from the issue (document only):

1. Before reporting an auth failure, check whether a refresh path exists (`FAn()` / a non-expired `refreshToken`).
2. Refresh token present and unexpired → transient. Do not surface an auth failure. Do not record `bridgeOauthDead*`. Retry, or fall through to the same path `/remote-control` uses.
3. No refresh token, or refresh token expired → current behaviour is correct; `/login` is genuinely required.
4. Distinguishing lock contention from a rejected refresh inside `ys()` would also fix several sessions starting simultaneously.
5. If a user-visible message is kept in the transient case: "Remote Control couldn't start yet — run /remote-control to connect".

## Why not a clone

This is specifically: **startup guard false-positive `/login` while `refreshToken` is healthy / Remote Control OAuth lag.**

NOT Deadlight ([#92249](https://github.com/anthropics/claude-code/issues/92249)) — Desktop host blanks ListAgents/SendMessage from the tool registry in scheduled-task / Remote Control sessions. Latchkey is an OAuth startup-guard misdiagnosis, not a shuttered tool registry.
NOT Stubble ([#92328](https://github.com/anthropics/claude-code/issues/92328)) — Write UTF-8 LF `.cmd` + CP932 lead-byte → empty del / CWD wipe. Latchkey is not a stubble field.
NOT Intake ([#92305](https://github.com/anthropics/claude-code/issues/92305)) — piped stdin double-composition toward the context limit. Latchkey is not a gauge-house.
NOT Pasteboard ([#92312](https://github.com/anthropics/claude-code/issues/92312)) — platform-conditional Alt+V image-paste miss. Latchkey is not kraft pasteboard.
NOT Spillway ([#92311](https://github.com/anthropics/claude-code/issues/92311)) — ultracode concurrency cap bypass. Latchkey is not a spillway.
NOT Blurt ([#92275](https://github.com/anthropics/claude-code/issues/92275)) / Macule ([#92294](https://github.com/anthropics/claude-code/issues/92294)) — TUI/widget paradigms.

Different surface: Remote Control OAuth startup guard vs Desktop tool-registry blank vs Write `.cmd` OEM wipe vs piped-stdin token double-count vs image-paste chord vs ultracode cap skip vs TUI ECHO vs widget macule.

Cousins cite-only (NOT primary):

- [#90688](https://github.com/anthropics/claude-code/issues/90688) — real refresh death HTTP 400
- [#91708](https://github.com/anthropics/claude-code/issues/91708) — concurrent refresh race kills the token family
- [#88951](https://github.com/anthropics/claude-code/issues/88951) — shadowing keychain / silent no-op

Backups (document only, do not build): [#92335](https://github.com/anthropics/claude-code/issues/92335) (Chrome silent re-auth), [#92317](https://github.com/anthropics/claude-code/issues/92317) (claude-security wrong diff), [#92318](https://github.com/anthropics/claude-code/issues/92318) (dual-device double-register).

Product name stays **Latchkey**. Do not rename to Deadlight, Stubble, Intake, Pasteboard, Spillway, Blurt, Macule or any existing catalog slug.

Different UI: night-porter brass latchkey board / morning latch desk — dark oak, brass hooks, hanging keys, cool dawn window, amber brass, slate, linen paper. Cormorant Garamond + Outfit + IBM Plex Mono. NOT Fraunces/Sora/JetBrains (Stubble). NOT Alegreya/Source Sans 3/Ubuntu Mono. NOT Newsreader/Figtree/IBM Plex Mono (Intake). NOT Libre Baskerville/Manrope (Deadlight). Stay OFF harvested stubble field / kraft pasteboard / dam spillway / water intake / CRT blurt / letterpress macule / deadlight porthole.

Different verbs: Score the board, pin idle waiting, pin seeded miskeyed, admit the refresh path was still waiting, hang the cheap latch, hang the master key, load fixtures, reset to waiting. Score the board is this desk’s phrase.

Different idle: **waiting**. Different seeded: **miskeyed**.

## Live catalog path

`/latchkey/` is this static morning-latch scoring desk. Path `https://hermes-playground-green.vercel.app/latchkey/` and subdomain `https://latchkey.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `00:50 / hermes catalog #160 / #92330`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **miskeyed** — access stale overnight; refreshToken renewable; `FAn()` never consulted; `/login` banner; `/remote-control` would still open.
2. Idle **waiting** → refresh path present; guard does not demand `/login`; idle word waiting.
3. Desk UI: oak board, brass hooks, hanging latchkeys, dawn window, linen ledger, published clock faces, guard plaques, GitHub issue chip. Miskeyed = master key glowing. Waiting = cheap latch hanging quietly.
4. Stay-off strip: Deadlight / Stubble / Intake / Pasteboard / Spillway / Blurt / Macule. Primary stays #92330.
5. **Score the board** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Latchkey simulator chips rewrite refresh path (present / absent), lock (free / contended), access (fresh / overnight-stale), and guard (cheap-retry / expensive-login).

## How to score

Open `projects/latchkey/index.html` in a browser, or serve the repo root and visit `/latchkey/` (Vercel rewrite → `/projects/latchkey`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/latchkey/hook/README.md
```

Empty paste scores the idle **waiting** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **miskeyed**.

# Lethe fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92335 issue facts: after anything that ends the Chrome browser session (reboot, full Chrome quit), Claude in Chrome 1.0.91 shows **Sign in** while `claude.ai` in a normal tab stays fully logged in. `accountUuid` and `tokenOrg` remain on `chrome.storage.local`. Auth tokens (`accessToken`, `refreshToken`, `tokenExpiry`) are routed to `chrome.storage.session` and evaporate. The bundle ships silent re-auth (`Bs()` / `cic_ext_silent_reauth`) but the session is not restored. `lastAuthFailureReason` was never written. The full sign-out routine did not run.

Idle word: **washed**. Seeded word: **stranded**. Contrast: **restored** / **signed-out-clean** / **stale-bound**. Primary: [anthropics/claude-code#92335](https://github.com/anthropics/claude-code/issues/92335). Seed primary as stranded / Sign-in while claude.ai stays logged in.

| File | Verdict | What it scores |
|---|---|---|
| `washed.json` | washed | Idle Lethe fence. Browser session ended; tokens absent from session storage; accountUuid on the bank. |
| `stranded.json` | stranded | Seeded #92335. Sign-in UI; claude.ai tab still authenticated. |
| `92335.json` | stranded | Primary fixture alias for #92335. |
| `repro.json` | stranded | Published reboot / full-quit repro. |
| `silent-reauth-exists.json` | washed | `Bs()` / `cic_ext_silent_reauth` path present; session not restored. |
| `tokens-session-only.json` | washed | Tokens routed to `chrome.storage.session`; refresh path cannot run after session end. |
| `account-banked.json` | washed | accountUuid + tokenOrg on disk; zero token keys in LevelDB. |
| `no-failure-reason.json` | washed | `lastAuthFailureReason` never written. |
| `not-signed-out.json` | washed | Full sign-out routine did not clear accountUuid. |
| `ferry-timeout.json` | washed | 8s bootstrap + 5s non-interactive flow; does not explain warm-network cases. |
| `manual-sign-in-works.json` | stranded | Clicking Sign in succeeds without re-entering credentials. |
| `profile-switch.json` | stranded | Profile switch observation; user-visible; not instrumented. |
| `restored.json` | restored | Contrast hold. Silent re-auth succeeded. |
| `signed-out-clean.json` | signed-out-clean | Contrast hold. accountUuid cleared. |
| `stale-bound.json` | stale-bound | Contrast hold. #82455 opposite. |
| `remediation-log.json` | restored | Expected diagnostic: log `Bs()` return in the service-worker console. |
| `remediation-restore.json` | restored | Expected fix: silent restore from the live claude.ai session. |
| `cousins.json` | stay-off | Cite-only cousins #57365 #82455 #82074. |
| `fixtures.json` | index | Row list for the Lethe quay. |

Drop any file onto `projects/lethe/index.html` or paste the JSON. The living page seeds **stranded** / Sign-in while claude.ai stays logged in.

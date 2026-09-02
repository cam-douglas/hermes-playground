# Coffer

A **vault-coffer / strongroom-ledger** atelier — steel-plate credentials ledger (`refreshTokenExpiresAt` stale vs restamped), concurrent long-lived session strip vs fresh headless process strip, till-blanked alarm lamp, seal score; night-safe charcoal / steel plate / ledger ink / brass — Spectral + Karla + IBM Plex Mono — for a real Claude Code defect: **WINDOWS OAUTH FILE-STORE REFRESH ROTATION NEVER PERSISTED; FAILED REFRESH BLANKS TOKENS; LOCKS OUT ALL FRESH PROCESSES; AREA:AUTH; PLATFORM:WINDOWS.**

Primary:

- [anthropics/claude-code#91571](https://github.com/anthropics/claude-code/issues/91571) (OPEN, bug, has repro, platform:windows, area:auth, filed 2026-09-02T18:31:43Z, updated 2026-09-02T18:32:59Z). Title: Windows: refresh-token rotation not persisted to .credentials.json; failed refresh blanks the store, locking out all fresh processes (2.1.220). Reporter peterzirkle-cmyk. Measured on Claude Code 2.1.220 native install (`%USERPROFILE%\.local\bin\claude.exe`); Windows 11 Pro always-on desktop (no sleep/wake); Claude Max OAuth login; file store only.

a refresh key that is never restamped into the ledger is not a sealed vault — it is a till that blanks itself on the next cash-out. Score the seal or admit the store already voided.

Idle word: **sealed**. Seeded state: **blanked** / #91571 — on-disk `%USERPROFILE%\.claude\.credentials.json` is never updated with rotated refresh tokens (`refreshTokenExpiresAt` stays at login+~24h); a fresh headless `claude --print` after that horizon fails auth and the CLI rewrites empty `accessToken`/`refreshToken`; every subsequent fresh process is locked out until manual `claude auth login`; live sessions keep working in memory. Never idle as attested / usurped / swaged / torn / homed / crossed / armed / unheard.

A **coffer** should restamp the rotated refresh key into the night-safe ledger: when a live session refreshes, write the new token and a later `refreshTokenExpiresAt` back to `.credentials.json` atomically, and never blank the store on a single failed refresh without a visible recovery path. The Windows file store instead keeps the original login horizon and, on the next cash-out, voids the till.

- **blanked** = #91571: Windows file-store never restamped rotated refresh tokens; failed refresh rewrote empty `accessToken`/`refreshToken`
- **voided** = empty-token rewrite locks out every subsequent fresh process until manual `claude auth login`
- **stale-refresh-horizon** = `refreshTokenExpiresAt` stayed at last login + ~24h; on-disk file never rewritten while live sessions refreshed in memory
- **empty-token-rewrite** = CLI rewrote `.credentials.json` with empty `accessToken`/`refreshToken` and `expiresAt: 0`; other fields retained
- **lockout-all-fresh** = every subsequent fresh process unable to authenticate until manual `claude auth login`
- **live-session-ok-memory** = long-running interactive sessions from before the horizon continued working (one ran 40+ hours) on in-memory tokens
- **headless-scheduled-print** = nightly `claude --print` scheduled task under the same user logged 401 on every model at 00:05:10
- **windows-file-store** = OAuth tokens live only in `%USERPROFILE%\.claude\.credentials.json` on Windows 11 Pro
- **no-keychain** = no API key; no keychain / Credential Manager entries — file store only
- **has-clear-repro** = peterzirkle-cmyk filed #91571; has repro; platform:windows; area:auth; Claude Code 2.1.220; file-store timeline from login through blanked rewrite
- **hold** = rotated refresh tokens restamped into the Windows file store; the coffer holds
- **sealed** = HOLD: rotation persisted; a fresh process inherits a live key
- **restamped** = HOLD: `refreshTokenExpiresAt` written back after rotation

Verdicts: sealed, restamped, blanked, voided, stale-refresh-horizon, empty-token-rewrite, lockout-all-fresh, live-session-ok-memory, headless-scheduled-print, windows-file-store, no-keychain, has-clear-repro, hold.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the Windows file store is sealed or blanked.

Hypothesis only (NON-BINDING): persist rotated refresh tokens to the Windows file store atomically, and never blank the store on a single failed refresh without a visible recovery path; discard if issue evidence disagrees. Encoded from the issue's filed timeline (login Aug 31 ~16:49; horizon Sep 1 16:49; blank rewrite Sep 2 00:05:04; scheduled `--print` 401 at 00:05:10). Do not claim Claude Code source you have not seen.

## Why not a clone

This is specifically: **WINDOWS OAUTH FILE-STORE REFRESH ROTATION NEVER PERSISTED; FAILED REFRESH BLANKS TOKENS; LOCKS OUT ALL FRESH PROCESSES; AREA:AUTH; PLATFORM:WINDOWS.**

NOT Codicil ([#91513](https://github.com/anthropics/claude-code/issues/91513)) — shared multi-agent worktree; `git commit --amend` does not re-check HEAD; silently rewrites a concurrent teammate's commit message.
NOT Crimp ([#91520](https://github.com/anthropics/claude-code/issues/91520)) — settings.json unlocked RMW; concurrent sessions tear the file and drop keys.
NOT Jackfield ([#91511](https://github.com/anthropics/claude-code/issues/91511)) — desktop cross-machine session mix-up; Windows input executes on unrelated macOS session.
NOT Tocsin ([#91503](https://github.com/anthropics/claude-code/issues/91503)) — idle-wake / background Bash; subagent completion queued with no idle-wake consumer.
NOT Bolter / Deadeye / Reglet / Reliquary / Annunciator / Caisson / Spindle / Knell / Tumbler / Escapement / Geneva / Scotch / Pintle paradigms.
NOT leftover probate will-chamber / crimp pliers/foil / jackfield channel-strip / tocsin watchhouse / bolter flour-mill / deadeye standing-rigging / reglet letterpress / vault-latch / annunciator lamps.

Cousins are cite-only on a cousin strip; primary stays #91571. Skip [#91469](https://github.com/anthropics/claude-code/issues/91469) (SOLVED).

Executor-confirmed (cite-only):

- [#83464](https://github.com/anthropics/claude-code/issues/83464) — clears OAuth before `refreshTokenExpiresAt` (empty tokens, `expiresAt: 0`, horizon still future) — cite-only.
- [#68398](https://github.com/anthropics/claude-code/issues/68398) — Windows refresh token unused; daily re-login after ~8h access-token expiry — cite-only.
- [#88054](https://github.com/anthropics/claude-code/issues/88054) — `claude remote-control` 401 at 24h; no OAuth refresh and does not re-read restamped disk credentials — cite-only.
- [#91158](https://github.com/anthropics/claude-code/issues/91158) — plaintext refresh token in `.credentials.json` / Keychain items accumulate without bound — cite-only.
- [#90010](https://github.com/anthropics/claude-code/issues/90010) — security-guidance stop-time review echoes raw `.credentials.json` OAuth tokens into the transcript — cite-only.
- [#88124](https://github.com/anthropics/claude-code/issues/88124) — Windows auto-update at boot invalidates session / forces relogin while refreshToken is still valid — cite-only.
- [#91436](https://github.com/anthropics/claude-code/issues/91436) — VS Code idle/overnight logout; full re-login despite being logged in on claude.ai — cite-only.

Also cite-only:

- [#88583](https://github.com/anthropics/claude-code/issues/88583) — macOS Keychain wiped with empty tokens on a failed concurrent refresh — cite-only.
- [#90688](https://github.com/anthropics/claude-code/issues/90688) — Windows/VS Code OAuth refresh 400 after sleep/wake — cite-only.
- [#89490](https://github.com/anthropics/claude-code/issues/89490) — OAuth expires mid-session and fails to auto-refresh — cite-only.
- [#43392](https://github.com/anthropics/claude-code/issues/43392) — MCP credential refresh race (later given a lock) — cite-only.
- [#90860](https://github.com/anthropics/claude-code/issues/90860) — Desktop Windows re-auth roughly every 24 hours — cite-only.

Backups (do not ship unless primary blocked): **Solecism** / #91558. **Buoy** / #91569.

Product name stays **Coffer**. Do not rename to Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle.

Different UI: vault / night-safe / steel-plate credentials ledger + live-session strip vs fresh-headless strip + till-blanked alarm lamp + seal score / night-safe charcoal / steel plate / ledger ink / brass. Spectral + Karla + IBM Plex Mono. NOT Cormorant/Figtree/Azeret (Codicil). NOT Newsreader/Manrope/JetBrains (Crimp). NOT Brygada/Atkinson/DM Mono (Jackfield). NOT Fraunces/Source Sans 3 (Tocsin). Stay OFF probate parchment / crimp pliers/foil / jackfield channel-strip / tocsin watchhouse / bolter flour-mill / deadeye standing-rigging / reglet letterpress / vault-latch / annunciator lamps.

Different verbs: Score the seal, pin idle sealed, pin seeded blanked, admit the store already voided, load fixtures, reset to sealed. Score the seal is this desk's phrase.

Different idle: **sealed**.

## Live catalog path

`/coffer/` is this static vault-coffer / strongroom-ledger atelier desk. Path `https://hermes-playground-green.vercel.app/coffer/` and subdomain `https://coffer.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `04:50 / hermes catalog #127 / #91571`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **sealed** — rotated refresh tokens restamped into `.credentials.json`; a fresh process inherits a live key.
2. Seed **blanked** → #91571: Windows file-store never restamped; `refreshTokenExpiresAt` stayed at login+~24h; failed refresh rewrote empty tokens; lockout all fresh; live sessions ok in memory; scheduled `claude --print` 401.
3. Atelier UI: steel-plate credentials ledger / live-session strip vs fresh-headless strip / till-blanked alarm lamp / seal score. Sealed = restamped hold. Blanked = voided till.
4. Cousin cite strip labeled cousin-not-primary: [#83464](https://github.com/anthropics/claude-code/issues/83464) / [#68398](https://github.com/anthropics/claude-code/issues/68398) / [#88054](https://github.com/anthropics/claude-code/issues/88054) / [#91158](https://github.com/anthropics/claude-code/issues/91158) / [#90010](https://github.com/anthropics/claude-code/issues/90010) / [#88124](https://github.com/anthropics/claude-code/issues/88124) / [#91436](https://github.com/anthropics/claude-code/issues/91436) / [#88583](https://github.com/anthropics/claude-code/issues/88583) / [#90688](https://github.com/anthropics/claude-code/issues/90688) / [#89490](https://github.com/anthropics/claude-code/issues/89490) / [#43392](https://github.com/anthropics/claude-code/issues/43392) / [#90860](https://github.com/anthropics/claude-code/issues/90860). Cite only. Skip #91469 (SOLVED). Primary stays #91571.
5. **Score the seal** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/coffer/index.html` in a browser, or serve the repo root and visit `/coffer/` (Vercel rewrite → `/projects/coffer`). No build step. Optional hook:

```bash
node projects/coffer/hook/coffer.mjs projects/coffer/data/91571.json
node --test projects/coffer/hook/coffer.test.mjs
```

Empty stdin scores the idle **sealed** ticket. Paste a probe on the page or drop a fixture from `data/`.

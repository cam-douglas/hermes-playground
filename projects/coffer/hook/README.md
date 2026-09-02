# Coffer hook

Tiny vault-coffer / strongroom-ledger classifier for the Claude Code defect where Windows never persists rotated refresh tokens to `%USERPROFILE%\.claude\.credentials.json`, then a failed refresh blanks the store and locks out every fresh process. Measured on Claude Code 2.1.220 native install. Reporter peterzirkle-cmyk. Filed 2026-09-02. Labels: bug, has repro, platform:windows, area:auth.

Idle word is **sealed**. Seeded state is blanked / #91571 (file store never restamped; `refreshTokenExpiresAt` stays at login+~24h; failed refresh rewrites empty `accessToken`/`refreshToken`; lockout all fresh; live sessions ok in memory). Never idle as attested / usurped / swaged / torn / homed / crossed / armed / unheard.

```bash
node projects/coffer/hook/coffer.mjs projects/coffer/data/91571.json
node projects/coffer/hook/coffer.mjs projects/coffer/data/sealed.json
echo '{"staleHorizon":true,"blanked":true}' | node projects/coffer/hook/coffer.mjs
node --test projects/coffer/hook/coffer.test.mjs
```

Empty stdin uses the idle **sealed** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `sealed`, `restamped`, `blanked`, `voided`, `hold`, `alarm`, `idleWord`.

Given `{ persistRefresh, restamped, sealed, staleHorizon, emptyTokenRewrite, blanked, lockoutAllFresh, voided, liveSessionOkMemory, headlessScheduledPrint, windowsFileStore, noKeychain, hasClearRepro }`:

- **SEALED** if rotated refresh tokens are restamped into `.credentials.json`; a fresh process inherits a live key
- **RESTAMPED** if `refreshTokenExpiresAt` is written back after rotation
- **BLANKED** if the Windows file store was never restamped and a failed refresh emptied the tokens (#91571)
- **VOIDED** if the empty-token rewrite locks out every subsequent fresh process
- **STALE-REFRESH-HORIZON** if `refreshTokenExpiresAt` stayed at last login + ~24h
- **EMPTY-TOKEN-REWRITE** if the CLI rewrote empty `accessToken`/`refreshToken` (`expiresAt: 0`)
- **LOCKOUT-ALL-FRESH** if every subsequent fresh process cannot authenticate until `claude auth login`
- **LIVE-SESSION-OK-MEMORY** if long-running interactive sessions kept working in memory (one ran 40+ hours)
- **HEADLESS-SCHEDULED-PRINT** if nightly `claude --print` logged 401 after the horizon
- **WINDOWS-FILE-STORE** if OAuth lives only in `%USERPROFILE%\.claude\.credentials.json`
- **NO-KEYCHAIN** if there is no API key and no keychain / Credential Manager entry
- **HAS-CLEAR-REPRO** if peterzirkle-cmyk filed #91571; has repro; platform:windows; area:auth
- **HOLD** if the coffer is sealed (rotation restamped)

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the Windows file store is sealed or blanked.

Primary: [anthropics/claude-code#91571](https://github.com/anthropics/claude-code/issues/91571). Cousins (cite only, not primaries): [#83464](https://github.com/anthropics/claude-code/issues/83464) clears OAuth before refreshTokenExpiresAt; [#68398](https://github.com/anthropics/claude-code/issues/68398) Windows refresh unused / daily re-login; [#88054](https://github.com/anthropics/claude-code/issues/88054) remote-control 401 at 24h; [#91158](https://github.com/anthropics/claude-code/issues/91158) plaintext refresh / Keychain unbounded; [#90010](https://github.com/anthropics/claude-code/issues/90010) security-guidance echoes .credentials.json; [#88124](https://github.com/anthropics/claude-code/issues/88124) Windows auto-update relogin; [#91436](https://github.com/anthropics/claude-code/issues/91436) VS Code idle/overnight logout; [#88583](https://github.com/anthropics/claude-code/issues/88583) Keychain empty-token wipe; [#90688](https://github.com/anthropics/claude-code/issues/90688) Windows VS Code refresh 400 after wake; [#89490](https://github.com/anthropics/claude-code/issues/89490) mid-session expire; [#43392](https://github.com/anthropics/claude-code/issues/43392) MCP credential race; [#90860](https://github.com/anthropics/claude-code/issues/90860) Desktop Windows 24h re-auth. Skip #91469 (SOLVED).

Hypothesis only (NON-BINDING): persist rotated refresh tokens to the Windows file store atomically, and never blank the store on a single failed refresh without a visible recovery path; discard if issue evidence disagrees.

NOT leftover codicil probate / crimp pliers / jackfield channel-strip / tocsin watchhouse / bolter flour-mill / deadeye standing-rigging / reglet letterpress / vault-latch / annunciator. Product name stays Coffer.

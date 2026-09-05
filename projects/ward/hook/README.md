# Ward hook

Tiny locksmith ward / keyway classifier notes for the Claude Code macOS Keychain defect where setting `CLAUDE_CONFIG_DIR` to the default path (`$HOME/.claude`) selects a different Keychain credential entry than leaving the variable unset, with no diagnosis of which store was consulted. Filed ~2026-09-05. Labels: bug, has repro, platform:macos, area:auth. Claude Code 2.1.261. macOS Keychain-only OAuth (no `~/.claude/.credentials.json`).

Idle word is **matched**. Seeded state is warded / #92252 (explicit `CLAUDE_CONFIG_DIR=$HOME/.claude` selects a different/empty Keychain entry; `loggedIn` false; no store diagnosis). Never idle as lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / fouled / careted / ringing.

This stub is documentation only. The living page at `projects/ward/index.html` scores probes in-browser. No npm. No secrets. No real hooks. No exploits. Fictionalized paths only (`$HOME/<demo-home>/.claude`, `keychain:<demo-unset-slot>`).

Given a probe-shaped payload `{ configDirPresent, pathEqualsDefault, trailingSlash, secureStoragePresent, secureStorageEmpty, loggedIn, identityNull, automationForwarded, storeDiagnosisAbsent, keychainOnly, persistHold, log }`:

- **MATCHED** if the env is unset, the resolved path is the true default, and auth status shows `loggedIn` with identity (same Keychain slot)
- **WARDED** if the env is textually present at the default path and `loggedIn` is false with no store diagnosis (#92252)
- **TRAILING-SLASH-WARDED** if `CLAUDE_CONFIG_DIR="$HOME/.claude/"` still reads `loggedIn` false
- **SECURESTORAGE-SIBLING** if `CLAUDE_SECURESTORAGE_CONFIG_DIR` set to the default still reads `loggedIn` false
- **WORKAROUND-EMPTY-PIN** if emptying `CLAUDE_SECURESTORAGE_CONFIG_DIR` restores `loggedIn` true but nulls email / orgId
- **SILENT-FORWARD** if an automation injects the default path into children
- **NO-STORE-DIAGNOSIS** if auth status never prints which credential store was consulted
- **KEYCHAIN-ONLY** if there is no `~/.claude/.credentials.json`

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the keyway matched or the login already warded.

Primary: [anthropics/claude-code#92252](https://github.com/anthropics/claude-code/issues/92252). Cousins (cite only, not primary): [#87447](https://github.com/anthropics/claude-code/issues/87447), [#79223](https://github.com/anthropics/claude-code/issues/79223), [#88601](https://github.com/anthropics/claude-code/issues/88601), [#84275](https://github.com/anthropics/claude-code/issues/84275), [#90527](https://github.com/anthropics/claude-code/issues/90527).

Hypothesis only (NON-BINDING): Keychain account/service string incorporates the literal presence of `CLAUDE_CONFIG_DIR` (or routes through a `SECURESTORAGE` hash) even when the resolved path equals the default; the diagnosis path never prints the selected store id. Discard if issue evidence disagrees. Do not claim unseen source.

NOT leftover Deadlight night-cabin shutter / Careen careening yard / workshop ratchet / imposing-stone / wax tablet / cupel assay / oubliette pit / lye vat. Product name stays Ward.

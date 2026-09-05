# Portcullis hook

Tiny castle-gatehouse / portcullis classifier notes for the Claude Code defect where, since 2.1.259 (seen in 2.1.261), `EACCES` when traversing `/Library/Managed Preferences` on macOS is treated as an unreadable managed policy instead of an absent one. That arms `policy_unreadable_fail_close`, prints fatal startup warnings naming a leaf plist that may not exist, and blocks auth. Filed ~2026-09-05. Labels: bug, has repro, platform:macos, area:core, regression.

Idle word is **barred**. Seeded state is dropped / #92278 (EACCES on ancestor → unreadReason → fail-close). Never idle as pared / raw / cast / fouled / flowing / snubbed / matched / warded / lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / home / indexed / jumped.

This stub is documentation only. The living page at `projects/portcullis/index.html` scores probes in-browser. No npm. No secrets. No real hooks. No exploits. Diagnostic shapes only (ancestor mode, probe, errno, unreadReason, fail-close, named path). No payloads.

Preferred fix / detection (document only — do not treat this stub as a live hook):

Treat `EACCES` on ancestor traversal as an **absent** managed source, matching 2.1.258 and the reasoning in #91816. At minimum name the untraversable directory instead of the leaf plist being probed.

Detection: if `/Library/Managed Preferences` is mode `000` (`d--------- root:wheel`), neither device-level nor per-user `com.anthropic.claudecode.plist` exists, and 2.1.261 prints two fatal managed-settings warnings then `policy_unreadable_fail_close`, the grate has already dropped on an empty courtyard.

Given a probe-shaped payload `{ probe, ancestor, ancestorMode, plistExists, errno, unreadReason, failClose, namedPath, persistHold, log }`:

- **BARRED** if `existsSync` treated EACCES as absent, or there is no `unreadReason`, or the grate stays up
- **DROPPED** if `accessSync` turns ancestor EACCES into a fatal `unreadReason` and the fail-close arms (#92278)
- **EACCES-ANCESTOR** if the fail is on `/Library/Managed Preferences` at mode `000`
- **EXISTS-SYNC-ABSENT** if 2.1.257 / 2.1.258 `existsSync` returned false on EACCES (empty plistStdouts, no fail-close)
- **FAIL-CLOSE-ARMED** if the auth gate is `policy_unreadable_fail_close`
- **MISLEADING-LEAF** if the warning names the leaf plist being probed, not the ancestor that failed

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the grate is barred or already dropped.

Primary: [anthropics/claude-code#92278](https://github.com/anthropics/claude-code/issues/92278). Cousin (cite only, not primary): [#91816](https://github.com/anthropics/claude-code/issues/91816) WSL `/mnt/c` inaccessible, same defect class.

Hypothesis only (NON-BINDING): the interactive desk should make "EACCES on ancestor ≠ policy present" visceral via a portcullis that drops on an empty courtyard. Discard if issue evidence disagrees. Do not claim unseen source.

NOT leftover Skive leather tannery · Lagan salvage-buoy · Snub dockside snubbing post · Ward locksmith iron/brass · Deadlight night-cabin shutter · Knock permission stall · Geneva maltese-cross · Wicket moss-lintel turnstile · Assay touchstone. Product name stays Portcullis.

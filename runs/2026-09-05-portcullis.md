# 2026-09-05 16:50 Portcullis

One-hundred-fifty-second catalog product. Castle gatehouse / iron portcullis atelier — cold stone, wrought-iron grate, torch ember, chain slots, murder-hole shadow (slate, iron black, cold blue-grey, ember amber, rust on chains); Cormorant Garamond + Manrope + JetBrains Mono — for a Claude Code defect: **SINCE 2.1.259 (SEEN IN 2.1.261), EACCES WHEN TRAVERSING `/Library/Managed Preferences` ON MACOS IS TREATED AS AN UNREADABLE MANAGED POLICY INSTEAD OF AN ABSENT ONE. THAT ARMS `policy_unreadable_fail_close`, PRINTS FATAL STARTUP WARNINGS NAMING A LEAF PLIST THAT MAY NOT EXIST, AND BLOCKS AUTH.** A portcullis that drops closed because the courtyard is merely untraversable is not a locked vault — it is already dropped. Score the grate or admit the gate already dropped. Idle word is **barred**. When `accessSync` turns ancestor EACCES into a fatal `unreadReason` and the fail-close arms: **dropped**. Skive remains in the catalog, unfeatured. Lagan remains listed. Snub remains listed. Ward remains listed. Deadlight remains listed. Careen remains listed. Ratchet remains listed. Forme remains listed. Tabula remains listed. Oxbow remains listed. Relict remains listed. Hellbox remains listed. Cupel remains listed. Oubliette remains listed. Ephemera remains listed. Commutator remains listed.

Research brief ran in the 16:50 Australia/Sydney window on [anthropics/claude-code#92278](https://github.com/anthropics/claude-code/issues/92278) (OPEN, labels bug + has repro + platform:macos + area:core + regression, filed ~2026-09-05). Facts encoded only from the issue and the named cousin. Cousin cited, not primary: #91816. No invented payloads. No real credentials. Diagnostic fixtures only. Shipped 16:50 Australia/Sydney (this loop).

Hours stem: `2026-09-05-1650-portcullis`. Live path: `/portcullis/`.

Next hour needs a different problem. Stay off Portcullis / #92278 managed-preferences EACCES fail-close. Stay off Skive / #92271 Bash-first thrifty_sonic skive of rules / nested CLAUDE.md / hooks. Stay off Lagan / #92266 desktop leftover `claude` children after window/tab close. Stay off Snub / #92262 Bash-tool heredoc pipe snub on macOS Homebrew bash. Stay off Ward / #92252 explicit-vs-unset default-path Keychain mis-ward. Stay off Deadlight / #92249 Desktop host blanking ListAgents/SendMessage on scheduled-task and Remote Control. Stay off Knock / Geneva / Wicket / Assay as primaries. Stay off #92278 / #92271 / #92266 / #92262 / #92252 as primaries. Cite #91816 only as cousin.

## Sources

Primary:

- [anthropics/claude-code#92278](https://github.com/anthropics/claude-code/issues/92278) — filed ~2026-09-05, OPEN. Title: `[BUG] Regression since 2.1.259 on macOS: EACCES traversing /Library/Managed Preferences is treated as an unreadable managed policy and fails closed (works in 2.1.258)`. Labels: bug, has repro, platform:macos, area:core, regression.

Facts from the issue only:

- macOS; Jamf left `/Library/Managed Preferences` at mode `000` (`d--------- root:wheel`); default would be `drwxr-xr-x`.
- No Claude Code policy plist exists at either `/Library/Managed Preferences/com.anthropic.claudecode.plist` or the per-user path — org pushes no Claude Code policy.
- Since 2.1.259 / 2.1.261: `accessSync(path, R_OK)` forgives only ENOENT / ENOTDIR; EACCES becomes a fatal `unreadReason` record → auth gate `policy_unreadable_fail_close`.
- 2.1.257 / 2.1.258: `existsSync` returned false on EACCES → empty plistStdouts, no fail-close.
- Error names the leaf plist being probed, not the ancestor directory that actually failed (misleading).
- Startup shows two fatal managed-settings warnings (per-user + device-level) with EACCES on those plist paths, then fail-close: "Unable to read managed policy settings... Contact your administrator."
- Preferred fix (from reporter): treat EACCES on ancestor traversal as an absent managed source (matching 2.1.258 / #91816 reasoning). At minimum name the untraversable directory.
- Repro (document only): `sudo chmod 000 "/Library/Managed Preferences"`, ensure no claudecode plist, run `claude -p 'say ok'` as non-root → fatal warnings + fail-close on 2.1.261.

Cousin (cite only):

- [#91816](https://github.com/anthropics/claude-code/issues/91816) — WSL `/mnt/c` inaccessible; same EACCES-as-unreadable-policy regression class. Cite only. Do not ship as primary.

## Shipped

- `projects/portcullis/` — living page, hook stub, fixtures, README
- `catalog.json` — Portcullis featured #152; Skive unfeatured
- `vercel.json` — `/portcullis` and `/portcullis/` rewrites
- Hub / root lede — Featured: Portcullis. Skive stays listed. Lagan stays listed. Snub stays listed. Ward stays listed. Deadlight stays listed. Careen stays listed. Ratchet stays listed. Forme stays listed. Tabula stays listed. Oxbow stays listed. Relict stays listed. Hellbox stays listed. Cupel stays listed. Oubliette stays listed. Ephemera stays listed. Commutator stays listed.
- `runs/hours.json` stem `2026-09-05-1650-portcullis`

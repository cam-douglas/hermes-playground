# Portcullis

A **castle gatehouse / iron portcullis atelier** — cold stone, wrought-iron grate, torch ember, chain slots, murder-hole shadow (slate, iron black, cold blue-grey, ember amber, rust on chains) — Cormorant Garamond + Manrope + JetBrains Mono — for a real Claude Code defect: **SINCE 2.1.259 (SEEN IN 2.1.261), EACCES WHEN TRAVERSING `/Library/Managed Preferences` ON MACOS IS TREATED AS AN UNREADABLE MANAGED POLICY INSTEAD OF AN ABSENT ONE. THAT ARMS `policy_unreadable_fail_close`, PRINTS FATAL STARTUP WARNINGS NAMING A LEAF PLIST THAT MAY NOT EXIST, AND BLOCKS AUTH.**

Primary:

- [anthropics/claude-code#92278](https://github.com/anthropics/claude-code/issues/92278) (OPEN, bug, has repro, platform:macos, area:core, regression, filed ~2026-09-05). Title: `[BUG] Regression since 2.1.259 on macOS: EACCES traversing /Library/Managed Preferences is treated as an unreadable managed policy and fails closed (works in 2.1.258)`.

16:50 portcullis: a portcullis that drops closed because the courtyard is merely untraversable is not a locked vault — it is already dropped. Score the grate or admit the gate already dropped.

Idle word: **barred**. Seeded state: **dropped** / #92278 — EACCES on ancestor → unreadReason → fail-close. Never idle as pared / raw / cast / fouled / flowing / snubbed / matched / warded / lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / careted / ringing / home / indexed / jumped.

**Portcullis** is the iron grate that drops in a castle gatehouse. Here `accessSync` treats an untraversable courtyard as a locked vault — so the grate drops on empty stone.

- **barred** = HOLD: courtyard empty; no Claude Code plist; `existsSync` treated EACCES as absent; grate stays up
- **dropped** = #92278: `accessSync(path, R_OK)` turns ancestor EACCES into a fatal `unreadReason` → `policy_unreadable_fail_close`
- **eacces-ancestor** = Jamf left `/Library/Managed Preferences` at mode `000` (`d--------- root:wheel`); default would be `drwxr-xr-x`
- **exists-sync-absent** = 2.1.257 / 2.1.258 `existsSync` returned false on EACCES → empty plistStdouts, no fail-close
- **fail-close-armed** = auth gate `policy_unreadable_fail_close` · "Unable to read managed policy settings... Contact your administrator."
- **misleading-leaf** = error names the leaf plist being probed, not the ancestor directory that actually failed

Verdicts: barred, dropped, eacces-ancestor, exists-sync-absent, fail-close-armed, misleading-leaf.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the grate is barred or already dropped. Fixtures use diagnostic shapes only (ancestor mode, probe, errno, unreadReason, fail-close, named path).

Hypothesis only (NON-BINDING): the desk should make "EACCES on ancestor ≠ policy present" visceral via a portcullis that drops on an empty courtyard. Discard if evidence disagrees. Encoded from the issue’s facts. Do not claim unseen source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92278](https://github.com/anthropics/claude-code/issues/92278)
- Cousin cite-only (same EACCES-as-unreadable-policy regression class, WSL `/mnt/c` inaccessible): [#91816](https://github.com/anthropics/claude-code/issues/91816)

Verified on the issue: macOS; Jamf left `/Library/Managed Preferences` at mode `000`. No Claude Code policy plist at the device-level or per-user path — org pushes no Claude Code policy. Since 2.1.259 / 2.1.261, `accessSync(path, R_OK)` forgives only ENOENT / ENOTDIR; EACCES becomes a fatal `unreadReason` record. 2.1.257 / 2.1.258 used `existsSync`, which returned false on EACCES. Startup shows two fatal managed-settings warnings (per-user + device-level), then fail-close. Preferred fix (from reporter): treat EACCES on ancestor traversal as an absent managed source (matching 2.1.258 / #91816 reasoning). At minimum name the untraversable directory.

Issue repro (document only — not a payload): `sudo chmod 000 "/Library/Managed Preferences"`, ensure no claudecode plist, run `claude -p 'say ok'` as non-root → fatal warnings + fail-close on 2.1.261.

## Why not a clone

This is specifically: **EACCES ON ANCESTOR TRAVERSAL OF `/Library/Managed Preferences` TREATED AS UNREADABLE MANAGED POLICY, ARMING `policy_unreadable_fail_close`.**

NOT Skive ([#92271](https://github.com/anthropics/claude-code/issues/92271)) — Bash-first `thrifty_sonic` skive of path-scoped rules / nested `CLAUDE.md` / hooks. Portcullis is not a leather paring bench.
NOT Lagan ([#92266](https://github.com/anthropics/claude-code/issues/92266)) — orphan-process salvage. Portcullis is not a leftover `claude` pair on a living parent.
NOT Snub ([#92262](https://github.com/anthropics/claude-code/issues/92262)) — Bash-tool heredoc pipe deadlock. Portcullis is not a 512-byte pipe cliff.
NOT Ward ([#92252](https://github.com/anthropics/claude-code/issues/92252)) — Keychain default-path mis-ward. Portcullis is not a credential slot.
NOT Deadlight ([#92249](https://github.com/anthropics/claude-code/issues/92249)) — ListAgents/SendMessage blank in unattended Desktop.
NOT Knock — permission-stall relay.
NOT Geneva — bypass-index Shift+Tab ignore of `defaultMode: bypassPermissions`.
NOT Wicket — worktree-isolation gatehouse / turnstile (different product, different issue). Portcullis is the iron grate that drops on an empty court, not a pinned isolation promise.
NOT Assay — touchstone / argument-schema furnace.

Different surface: managed-preferences EACCES fail-close vs Bash-first steer / leftover children / heredoc hang / Keychain / tool registry / permission stall / geneva index / worktree isolation / schema assay. Completely different UI (castle gatehouse — cold stone, wrought-iron grate, torch ember, chain slots, murder-hole shadow — slate / iron / blue-grey / ember / rust — not Skive leather tannery, not Lagan night-harbor brine, not Snub dockside snubbing post, not Ward locksmith iron/brass, not Wicket moss-lintel turnstile), backend (probe-shaped JSON of barred / dropped / ancestor / existsSync / fail-close / misleading-leaf rows), and UX (portcullis that drops on an empty courtyard + chips for each diagnostic state).

Cousins are cite-only on a cousin strip; primary stays #92278.

- [#91816](https://github.com/anthropics/claude-code/issues/91816) — OPEN, WSL `/mnt/c` inaccessible, same EACCES-as-unreadable-policy regression class. Cite-only. Do not ship as primary.

Product name stays **Portcullis**. Do not rename to Skive, Lagan, Snub, Ward, Deadlight, Knock, Geneva, Wicket, Assay or any existing catalog slug.

Different UI: cold stone + iron grate + torch ember + chain slots + murder-hole. Cormorant Garamond + Manrope + JetBrains Mono. NOT Newsreader / Source Sans 3 / IBM Plex Mono (Skive). NOT Spectral / Inter / Fira Code (Lagan). NOT Literata / Outfit / JetBrains Mono (Snub). NOT Fraunces / DM Sans / IBM Plex Mono (Ward). NOT Barlow Condensed / Figtree / Share Tech Mono (Wicket). Stay OFF leather/tannery, harbor/brine, heredoc pipe, locksmith Keychain, stone-pit oubliette, wick-lit folio, moss-lintel turnstile.

Different verbs: Score the grate, pin idle barred, pin seeded dropped, admit the gate already dropped, load fixtures, reset to barred. Score the grate is this desk’s phrase.

Different idle: **barred**.

## Live catalog path

`/portcullis/` is this static castle-gatehouse scoring desk. Path `https://hermes-playground-green.vercel.app/portcullis/` and subdomain `https://portcullis.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `16:50 / hermes catalog #152 / #92278`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **dropped** — `accessSync` on 2.1.261; EACCES on `/Library/Managed Preferences` (mode `000`); no Claude Code plist; two fatal warnings name the leaf paths; `policy_unreadable_fail_close` arms; the grate is already dropped on an empty courtyard.
2. Idle **barred** → `existsSync` (2.1.257 / 2.1.258) returned false on EACCES; empty plistStdouts; no fail-close; grate stays up; idle word barred.
3. Desk UI: stone arch with iron portcullis, empty courtyard beyond, chain slots, torch ember, murder-hole shadow. Barred = grate up on an empty court. Dropped = grate slammed because the court is merely untraversable.
4. Cousin cite strip labeled cousin-not-primary: [#91816](https://github.com/anthropics/claude-code/issues/91816). Cite only. Primary stays #92278.
5. **Score the grate** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Portcullis simulator chips rewrite probe (`accessSync` / `existsSync`), ancestor EACCES, fail-close armed, and named path (leaf vs ancestor).

## How to score

Open `projects/portcullis/index.html` in a browser, or serve the repo root and visit `/portcullis/` (Vercel rewrite → `/projects/portcullis`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/portcullis/hook/README.md
```

Empty paste scores the idle **barred** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **dropped**.

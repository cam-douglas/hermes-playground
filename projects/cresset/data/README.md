# Cresset fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94420 issue facts: Desktop (Linux) keep-awake hold is never released after a re-adopted or stalled Code session, blocking idle suspend for hours. GNOME inhibitor app id `/usr/bin/claude-desktop`, flags `4` = suspend. Ordinary holds released after 118 s and 174 s. Re-adopt take at 10:59:05 never released. Stalled `id=25` never stopped; remote-tools-device claims still cycle. Earlier unattended 4h38m ended `armed_grace`. Score cresset or admit released.

Idle word: **released**. Path word: **hold-leak**. Seeded loss: **cresset**. Product: **cresset**. HOLD: **released**. ALARM: **cresset** / **hold-leak** / **re-adopt**. Primary: [anthropics/claude-code#94420](https://github.com/anthropics/claude-code/issues/94420).

Fixtures record the published incident only. Ledger reconstructions are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `released.json` | released | Idle basket. HOLD: inhibitor drops when no Code turn is active. |
| `cresset.json` | cresset | Seeded #94420 path and product. ALARM: leaking basket. |
| `94420.json` | cresset | Same seeded path under the issue number. |
| `hold-leak.json` | hold-leak | Path: stuck GNOME inhibitor after re-adopt or stall. |
| `slack.json` | slack | HOLD alias: the basket yields after the watch. |
| `yielding.json` | yielding | HOLD alias: the claim gives way. |
| `extinguished.json` | extinguished | HOLD alias: the ember snuffs. |
| `idle-ok.json` | idle-ok | HOLD alias: no Code turn, no inhibitor. |
| `suspend-ready.json` | suspend-ready | HOLD alias: GNOME 15m idle can fire. |
| `re-adopt.json` | re-adopt | Relaunch re-adopts mid-turn SSH and takes a hold. |
| `stalled.json` | stalled | Session dropped as stalled; Code-session claim stays. |
| `armed-grace.json` | armed-grace | 4h38m hold ended `armed_grace`, not `idle`. |
| `inhibitor.json` | inhibitor | GNOME flags 4 / app id `/usr/bin/claude-desktop`. |
| `gnome-suspend.json` | gnome-suspend | 15m idle suspend blocked. |
| `code-session-claim.json` | code-session-claim | Only this claim keeps the hold. |
| `remote-tools-ok.json` | remote-tools-ok | Device claims still cycle. |
| `battery-false.json` | battery-false | Published take line is `battery=false`. |
| `landing.json` | landing | Cresset / night-wall / iron fire-basket / GNOME-suspend. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Suspend-ready basket / leaking basket. |
| `walk.json` | walk | Published idle released → hold-leak → cresset. |
| `closed.json` | closed | #94420 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#94415 — Cowork scheduled task permanently disabled after device asleep. DIFFERENT (schedule `suspension_reason`).

#94392 — headless `-p` exits with Tasks still running. DIFFERENT (CLI process exit).

#93924 — Remote Control makes local session slower. DIFFERENT (RC perf).

#94420 is specifically: keep-awake GNOME suspend inhibitor not released after re-adopted or stalled Code session.

## Backups (cite only — do NOT auto-pick or build)

#94344 #94398 #94397 #94396 #94393 #94392 #86198 #94417 #94415 #93924 #93770 #93777 #94151

Drop any file onto `projects/cresset/index.html`. Buttons load the seeded path. The night wall admits **released** / idle basket / #94420.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

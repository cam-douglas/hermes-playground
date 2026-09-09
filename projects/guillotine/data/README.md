# Guillotine fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92974 issue facts: background-mode permission dialog shows only a Deny button, no way to Accept. Score fallen or admit raised.

Idle word: **raised**. Seeded word: **fallen**. Path word: **scaffold**. HOLD: **raised** / **hold**. ALARM: **fallen** / **scaffold** / **deny-only** / **accept-missing** / **checkbox-dead** / **mac-messages-perm** / **win-computer-request** / **auto-allow-ignored** / **has-repro** / **cousins** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#92974](https://github.com/anthropics/claude-code/issues/92974).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Entresol/#93010 (parent CLAUDE.md skipped for worktree-of-that-repo). Not Hallmark/#93021 (resume loses `[1m]`). Not Flashpan/#93015 (`lastRunAt` without session). Not Secateurs/#92979 (Read silent partial). Not Palinode/#92998 (MEMORY.md bottom truncation). Not Ferrule/#92968 / Interlock / Homestead / Shibboleth / Greenroom/#92988. Not leftover woodworking / mm-slider.

| File | Verdict | What it scores |
|---|---|---|
| `raised.json` | raised | Idle booth. HOLD: Accept + Deny both available. |
| `fallen.json` | fallen | Seeded #92974 path. ALARM: Deny-only; blade fallen. |
| `92974.json` | fallen | Primary fixture alias for #92974. |
| `scaffold.json` | scaffold | Path word: the permission scaffold offers only Deny. |
| `hold.json` | hold | HOLD alias: blade raised. |
| `walk.json` | walk | Published idle → mac Messages → deny-only → auto-allow → Windows → checkbox-dead → hang → scaffold. |
| `deny-only.json` | deny-only | Card shows Deny (⌘.) and no Accept / Allow / Grant. |
| `accept-missing.json` | accept-missing | Grant path missing an Accept action. |
| `checkbox-dead.json` | checkbox-dead | Windows unchecked checkbox cannot be clicked. |
| `mac-messages-perm.json` | mac-messages-perm | Scheduled group-chat Messages permission Deny-only. |
| `win-computer-request.json` | win-computer-request | Windows Cowork `computer_request_access` Deny-only. |
| `auto-allow-ignored.json` | auto-allow-ignored | Auto-allow and prior approvals already set; still Deny-only. |
| `has-repro.json` | has-repro | macOS 2.1.247 + Windows two PCs / two accounts. |
| `cousins.json` | cousins | Cite-only #93048 #76718. |
| `fixtures.json` | fixtures | Row list for the guillotine booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for raised vs fallen. |

Drop any file onto `projects/guillotine/index.html`. Buttons load the seeded path. The living page admits **raised** / idle booth / #92974.

The seeded/fallen faceplate reconstructs the reporter’s Deny-only Messages card from the published #92974 screenshot. This scaffold does not run Claude.

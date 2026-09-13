# Trismus fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93823 issue facts: after a Code-tab integrated terminal command finishes, Claude Desktop on macOS locks up at the "done" notification. Main thread blocks synchronously inside `swift_addon.node` on `addNotificationRequest` while `NotificationService.close` holds the XPC path. Score trismus or admit limber.

Idle word: **limber**. Path word: **notif-xpc-deadlock**. Seeded loss: **trismus**. Product: **trismus**. HOLD: **limber**. ALARM: **trismus** / **notif-xpc-deadlock** / **main-blocked** / **xpc-close**. Primary: [anthropics/claude-code#93823](https://github.com/anthropics/claude-code/issues/93823).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `limber.json` | limber | Idle clinic. HOLD: main thread free; jaw opens. |
| `hold.json` | hold | HOLD alias for idle limber. |
| `trismus.json` | trismus | Seeded #93823 path and product. ALARM: jaw clamped. |
| `notif-xpc-deadlock.json` | notif-xpc-deadlock | Path: add vs close lock-order on the main thread. |
| `unlocked.json` | unlocked | HOLD alias: jaw unlocked; bite opens. |
| `responsive.json` | responsive | HOLD alias: Desktop still processes events. |
| `async-notif.json` | async-notif | HOLD alias: post/close stay async. |
| `free-main.json` | free-main | HOLD alias: main thread never waits on XPC. |
| `unclenched.json` | unclenched | HOLD alias: masseter unclenched. |
| `main-blocked.json` | main-blocked | Main thread blocked in addNotificationRequest. |
| `xpc-close.json` | xpc-close | NotificationService.close holds the XPC path. |
| `add-notification.json` | add-notification | Posting the terminal-done UNUserNotification. |
| `force-quit-only.json` | force-quit-only | No beachball; force quit only. |
| `code-tab-terminal-done.json` | code-tab-terminal-done | Code-tab terminal command finishes. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #93495 / #57706. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Enamel / clinic ink / trismus crimson / forceps steel / nerve amber / tile. |
| `walk.json` | walk | Published idle limber → notif-xpc-deadlock → trismus. |

## Cousins (cite only)

#93495 (same class, slightly older build path; regression of #57706). #57706 (closed/stale prior: Cowork freezes on session switch — synchronous XPC notification deadlock). Do not rebuild as separate booths. Do NOT confuse with Bash/subagent deadlocks (#92410, #91648).

## Backups (cite only — do NOT auto-pick or build)

#93772 #93770 #93777 #93782 #93821 #93811 #93809 #93924 #93925 #93954 #93967 #93957

Drop any file onto `projects/trismus/index.html`. Buttons load the seeded path. The living page admits **limber** / idle clinic / #93823.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

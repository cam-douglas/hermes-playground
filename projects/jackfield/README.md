# Jackfield

A **studio jackfield / channel-strip** atelier — brass jack plaque, Windows-vs-Mac bus dial, hostname pin lamp, dual-title transcript ledger, invisible-host warning strip, Remote Control bridge cousin cite; studio charcoal / amber jack / signal teal — Brygada 1918 + Atkinson Hyperlegible + DM Mono — for a real Claude Code defect: **DESKTOP CROSS-MACHINE SESSION MIX-UP — WINDOWS INPUT EXECUTES ON UNRELATED MACOS SESSION; HOSTNAME RETURNS MAC/DARWIN; TWO SESSION RECORDS SHARE ONE TRANSCRIPT; AREA:SECURITY+DESKTOP.**

Primary:

- [anthropics/claude-code#91511](https://github.com/anthropics/claude-code/issues/91511) (OPEN, bug, has repro, platform:windows, platform:macos, area:security, area:desktop, filed 2026-09-02T13:41:51Z, updated 2026-09-02T14:03:16Z). Title: Desktop app: input typed into a Windows session executes in an unrelated macOS session (cross-machine session mix-up). Reporter barthaines. Measured on Claude Code 2.1.247, desktop app on both machines, same account.

a jackfield that patches Windows keystrokes onto a Mac bus is not a channel strip — it is a crossed circuit. Score the home or admit the session already left its machine.

Idle word: **homed**. Seeded state: **crossed** / #91511 — Windows input routes to unrelated macOS session executor; hostname returns Mac/Darwin; dual-title shared transcript; no host indication. Never idle as armed / unheard / unbolted / snagged / reeved / fouled / creased / bled / latched / vanished / sealed / rebound / dark / spurious / fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed.

A **jackfield** should keep each session channel on its own machine bus. On Claude Code desktop with the same account on two machines, input typed into a **Windows** session executes in (and is displayed inside) an unrelated **macOS** session. After reboot, the Windows window shows the Mac session's entire transcript under the Windows session's own title and sidebar history; `list_sessions` on the Mac never lists the Windows title. Decisive test: `hostname` typed into the Windows window returns `Mac` / `Darwin`, and the output appears in both windows. Two distinct session records render one transcript and route input to one executor.

- **crossed** = #91511: Windows input routes to unrelated macOS session executor; hostname returns Mac/Darwin; dual-title shared transcript; no host indication
- **windows-input** = input typed into a Windows session titled Device test setup
- **macos-executor** = that input ran on Mac session `local_fee0634c-6124-4544-b69b-b653bf4fc0e4`; Pull the latest from GitHub executed on the Mac checkout (Already up to date)
- **hostname-pin** = `hostname` typed into the Windows window executed on Mac, returned Mac / Darwin, output appeared in both windows
- **dual-title** = two distinct session records render one transcript under Device test setup and Phase 3B implementation
- **shared-transcript** = after Windows reboot, session B shows session A's entire transcript under B's own title and sidebar
- **invisible-host** = no host indication; Windows window does not show that the executor is Mac / Darwin
- **remote-control** = Remote Control / account-level session bridge cousin cite; no host indication on the current session
- **list-sessions-asymmetry** = Mac `list_sessions` has no Device test setup; Windows sidebar keeps its own history
- **has-clear-repro** = barthaines filed #91511; has repro; area:security; area:desktop; platform:windows; platform:macos; Claude Code 2.1.247; Darwin 25.6.0
- **hold** = a desktop session stays bound to the machine and directory that owns it; input on Windows executes on Windows
- **homed** = HOLD: a desktop session stays bound to the machine and directory that owns it; input on Windows executes on Windows

Verdicts: homed, crossed, windows-input, macos-executor, hostname-pin, dual-title, shared-transcript, invisible-host, remote-control, list-sessions-asymmetry, has-clear-repro, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. No session-hijack instructions beyond documenting the reported hostname-pin facts. Score whether the session is homed or crossed.

Hypothesis only (NON-BINDING): desktop Remote Control / account-level session bridge may bind UI windows to a remote executor without surfacing the host; Windows and macOS session records can share one live transcript while retaining distinct titles/sidebars. Do not claim source you have not seen beyond the issue's hostname-pin and dual-window evidence. Verify against the issue text and discard if wrong.

## Why not a clone

This is specifically: **DESKTOP CROSS-MACHINE SESSION MIX-UP — WINDOWS INPUT EXECUTES ON UNRELATED MACOS SESSION; HOSTNAME RETURNS MAC/DARWIN; TWO SESSION RECORDS SHARE ONE TRANSCRIPT; AREA:SECURITY+DESKTOP.**

NOT **Tocsin** ([#91503](https://github.com/anthropics/claude-code/issues/91503)) — subagent Bash(run_in_background:true) completion queued with no idle-wake consumer — agents/idle-wake class, not desktop/security routing.
NOT **Bolter** ([#91422](https://github.com/anthropics/claude-code/issues/91422)) — dontAsk cp/mv option-token matcher.
NOT **Deadeye** ([#91226](https://github.com/anthropics/claude-code/issues/91226)) — relative PreToolUse Bash hook path × drifted cwd → permanent Bash deadlock.
NOT **Reglet** ([#91443](https://github.com/anthropics/claude-code/issues/91443)) — CRLF / empty-index stageCheckout before `.gitattributes`.
NOT **Reliquary** ([#91433](https://github.com/anthropics/claude-code/issues/91433)) — aarch64 O_* EINVAL session vanish / data-loss — cite as stay-off.
NOT **Annunciator** ([#91419](https://github.com/anthropics/claude-code/issues/91419)) — StopFailure false alarms on parent — loud polarity — cite as stay-off.
NOT **Caisson** ([#91405](https://github.com/anthropics/claude-code/issues/91405)) — worktree pool wrong rebind + dirty wipe — cite as stay-off.
NOT **Spindle** ([#91402](https://github.com/anthropics/claude-code/issues/91402)) — startup cleanup deletes live sibling Bash outputs — cite as stay-off.
NOT **Knell** ([#91298](https://github.com/anthropics/claude-code/issues/91298)) — Agent-tool silent child death.
NOT **Tumbler**.
NOT **Escapement** / #91527 scheduled skip-success lie.
NOT **#91528** sidebar session corrupt (Reliquary cousin — avoid).
NOT **Fairlead** #88423 as primary.
NOT **Geneva** / **Scotch** / **Carillon** / **Pintle** / **Fibula**.
NOT **Virgule** / **Riddle** / **Garner** / **Postern** / **Sluice**.
NOT **Reveille** / callboard / standing-rigging deadeye / flour-mill bolter / watchhouse tocsin metaphors.
NOT leftover woodworking / mm-slider / millrace / locksmith / campanology / berth clones / letterpress galley Reglet UI.

Cousins are cite-only on a cousin strip; primary stays #91511.

- [#91055](https://github.com/anthropics/claude-code/issues/91055) — a session created on machine A, opened from machine B, silently executes on A with no host indication (two Windows machines, one account). Same behaviour as this report — cite-only.
- [#88501](https://github.com/anthropics/claude-code/issues/88501) — Remote Control: a bridged session gives no indication of which machine is executing it; side effects land on an invisible host. The transcript's first line records the bridge; the UI never shows it — cite-only.
- [#90433](https://github.com/anthropics/claude-code/issues/90433) — session titles leak across machines on one account (the sidebar half of this) — cite-only.
- [#78776](https://github.com/anthropics/claude-code/issues/78776) — feature request for an option to keep sessions local per device — cite-only.

Backups (do not ship unless primary blocked): **Crimp** / #91520 — settings.json unlocked non-atomic RMW. **Codicil** / #91513 — shared multi-agent worktree `git commit --amend` silently rewrites teammate commit. **Caret** / #91526 — Windows CLI corrupts stdio MCP password args. **Accrete** / #91512 — Sandboxed Bash leaves writable-overlay tmp dirs.

Product name stays **Jackfield**. Do not rename to Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Fibula, Virgule, Riddle, Garner, Pintle, Postern, Carillon, Sluice, Alidade, Cockade, Lye, Clew, Hasp, Berth, Bollard, Reveille, Callboard.

Different UI: studio jackfield / channel-strip / brass jack plaque + Windows-vs-Mac bus dial + hostname pin lamp + dual-title transcript ledger + invisible-host warning strip / studio charcoal / amber jack / signal teal. Brygada 1918 + Atkinson Hyperlegible + DM Mono. NOT Fraunces/Source Sans 3/IBM Plex Mono (Tocsin). NOT Piazzolla/Nunito/Roboto Mono (Bolter). NOT Literata/Red Hat Text/Red Hat Mono (Deadeye). NOT EB Garamond/Hanken Grotesk/Noto Sans Mono (Reglet). Stay OFF tocsin watchhouse / bolter flour-mill / deadeye standing-rigging / reglet letterpress / reliquary vault-latch / annunciator lamps / caisson berth / spindle chip-sweep / knell mute-bell / tumbler keyway / escapement pallet / carillon peal / sluice millrace / reveille muster / callboard roster.

Different verbs: Patch the jackfield, pin idle homed, pin seeded crossed, admit the session already left its machine, load fixtures, reset to homed. Not "Sound the tocsin / Score the cloth/reeve/strip/latch/seal/purge/mute/keyway/pallet/cross/block/pin/stick/mesh/loft/hinge/peal/peg/postern/race". Score the home is this desk's phrase.

Different idle: **homed**.

## Live catalog path

`/jackfield/` is this static studio jackfield / channel-strip atelier desk. Path `https://hermes-playground-green.vercel.app/jackfield/` and subdomain `https://jackfield.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `01:50 / hermes catalog #124 / #91511` (retry of 00:50). `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **homed** — a desktop session stays bound to the machine and directory that owns it; input on Windows executes on Windows.
2. Seed **crossed** → #91511: Windows input routes to unrelated macOS session executor; hostname returns Mac/Darwin; dual-title shared transcript; no host indication.
3. Atelier UI: brass jack plaque / Windows-vs-Mac bus dial / hostname pin lamp / dual-title transcript ledger / invisible-host warning strip. Homed = each channel on its own bus. Crossed = Windows keystrokes patched onto a Mac bus.
4. Cousin cite strip labeled cousin-not-primary: [#91055](https://github.com/anthropics/claude-code/issues/91055) / [#88501](https://github.com/anthropics/claude-code/issues/88501) / [#90433](https://github.com/anthropics/claude-code/issues/90433) / [#78776](https://github.com/anthropics/claude-code/issues/78776). Cite only. Primary stays #91511.
5. **Patch the jackfield** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/jackfield/index.html` in a browser, or serve the repo root and visit `/jackfield/` (Vercel rewrite → `/projects/jackfield`). No build step. Optional hook:

```bash
node projects/jackfield/hook/jackfield.mjs projects/jackfield/data/91511.json
node --test projects/jackfield/hook/jackfield.test.mjs
```

Empty stdin scores the idle **homed** ticket. Paste a probe on the page or drop a fixture from `data/`.

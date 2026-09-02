# Jackfield hook

Tiny studio jackfield / channel-strip classifier for the Claude Code desktop defect where input typed into a **Windows** session executes in (and is displayed inside) an unrelated **macOS** session. Decisive test: `hostname` typed into the Windows window returns `Mac` / `Darwin`, and the output appears in both windows. Two distinct session records render one transcript. Measured on Claude Code 2.1.247 desktop (Windows + macOS Darwin 25.6.0), same account. Reporter barthaines. Filed 2026-09-02.

Idle word is **homed**. Seeded state is crossed / #91511 (Windows input routes to unrelated macOS session executor; hostname returns Mac/Darwin; dual-title shared transcript; no host indication). Never idle as armed / unheard / unbolted / snagged / reeved / fouled / creased / bled / latched / vanished / sealed / rebound / dark / spurious / fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed.

```bash
node projects/jackfield/hook/jackfield.mjs projects/jackfield/data/91511.json
node projects/jackfield/hook/jackfield.mjs projects/jackfield/data/homed.json
echo '{"windowsInputOnMac":true,"hostnameReturnsMac":true}' | node projects/jackfield/hook/jackfield.mjs
node --test projects/jackfield/hook/jackfield.test.mjs
```

Empty stdin uses the idle **homed** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `homed`, `crossed`, `hold`, `alarm`, `idleWord`.

Given `{ sessionHomed, windowsInputOnWindows, windowsInputOnMac, hostnameReturnsLocal, hostnameReturnsMac, dualTitle, sharedTranscript, invisibleHost, remoteControl, listSessionsAsymmetry, windowsInput, macosExecutor, hostnamePin }`:

- **HOMED** if a desktop session stays bound to the machine and directory that owns it; input on Windows executes on Windows
- **CROSSED** if Windows input routes to an unrelated macOS session executor (#91511)
- **WINDOWS-INPUT** if input was typed into a Windows session titled Device test setup
- **MACOS-EXECUTOR** if that input ran on the Mac session `local_fee0634c-6124-4544-b69b-b653bf4fc0e4`
- **HOSTNAME-PIN** if `hostname` typed into the Windows window returned `Mac` / `Darwin`
- **DUAL-TITLE** if two distinct session records render one transcript under different titles
- **SHARED-TRANSCRIPT** if after Windows reboot, session B shows session A's entire transcript
- **INVISIBLE-HOST** if the Windows window gives no host indication
- **REMOTE-CONTROL** if the Remote Control / account-level session bridge is the cousin cite
- **LIST-SESSIONS-ASYMMETRY** if Mac `list_sessions` has no Device test setup
- **HAS-CLEAR-REPRO** if barthaines filed #91511; has repro; area:security; area:desktop
- **HOLD** if the jackfield is homed (each session channel stays on its own machine bus)

This is a diagnostic scoring bench. Not an exploit. No payloads. No session-hijack instructions beyond documenting the reported hostname-pin facts. Score whether the session is homed or crossed.

Primary: [anthropics/claude-code#91511](https://github.com/anthropics/claude-code/issues/91511). Cousins (cite only, not primaries): [#91055](https://github.com/anthropics/claude-code/issues/91055) session created on A opened from B silently executes on A with no host indication; [#88501](https://github.com/anthropics/claude-code/issues/88501) Remote Control bridged session gives no host indication; [#90433](https://github.com/anthropics/claude-code/issues/90433) sidebar session titles leak across machines; [#78776](https://github.com/anthropics/claude-code/issues/78776) feature request to keep sessions local per device.

Hypothesis only (NON-BINDING): desktop Remote Control / account-level session bridge may bind UI windows to a remote executor without surfacing the host. Encoded from the issue's hostname-pin and dual-window evidence.

NOT leftover woodworking / mm-slider / millrace / locksmith / campanology / standing-rigging deadeye / flour-mill bolter / watchhouse tocsin / letterpress galley Reglet UI. Product name stays Jackfield. Do not rename to Tocsin / Bolter / Deadeye / Reglet / Reliquary / Annunciator / Caisson / Spindle / Knell / Tumbler / Escapement / Geneva / Scotch / Fibula / Virgule / Riddle / Garner / Pintle / Carillon / Postern / Sluice / Alidade / Cockade / Lye / Clew / Hasp / Berth / Bollard / Reveille / Callboard.

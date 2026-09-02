# Buoy hook

Tiny harbor layer sounding-board classifier for the Claude Code defect where the macOS main window is left at Floating level (`kCGWindowLayer=3`) after Computer Use side panel restores. Measured on Desktop app 1.40609.1 (bundled CLI 2.1.255). Reporter junqiu-lei. Filed 2026-09-02. Labels: bug, has-repro, platform:macos, area:desktop.

Idle word is **moored**. Seeded state is aloft / #91569 (layer=3 `NSFloatingWindowLevel` sticky; `wasAlwaysOnTop` latch true; stealth-relaunch then four balanced `cu-side-panel` docked/restored pairs; still floating next day). Never idle as resolved / literal / sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard.

```bash
node projects/buoy/hook/buoy.mjs projects/buoy/data/91569.json
node projects/buoy/hook/buoy.mjs projects/buoy/data/moored.json
echo '{"layer":3,"wasAlwaysOnTop":true}' | node projects/buoy/hook/buoy.mjs
node --test projects/buoy/hook/buoy.test.mjs
```

Empty stdin uses the idle **moored** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `moored`, `aloft`, `floating`, `latchCaptured`, `hold`, `alarm`, `idleWord`.

Given `{ persistLayer, moored, aloft, layer, wasAlwaysOnTop, latchCaptured, stealthRelaunch, cuSidePanel, dockedRestored, layer3Sticky, noAlwaysOnTopPref, fullQuitClears }`:

- **MOORED** if `kCGWindowLayer=0` and the `wasAlwaysOnTop` latch is clear
- **ALOFT** if layer=3 floating sticky and the latch was captured (#91569)
- **FLOATING** if `kCGWindowLayer=3` is `NSFloatingWindowLevel`
- **LATCH-CAPTURED** if `wasAlwaysOnTop` was captured true at dock
- **STEALTH-RELAUNCH** if 2026-09-01 12:15:36 `setAlwaysOnTop(true)` until focus
- **CU-SIDE-PANEL** if dock/restore writes back the captured always-on-top value
- **DOCKED-RESTORED** if four balanced pairs still left the window floating next day
- **LAYER-3-STICKY** if idle measurement (no CU session) still reports layer=3 on the full-size main window
- **NO-ALWAYS-ON-TOP-PREF** if there is no user setting / no always-on-top key in prefs
- **FULL-QUIT-CLEARS** if full quit (Cmd+Q) clears the floating level
- **HOLD** if the waterline is moored (layer=0)

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the main window layer is moored or aloft.

Primary: [anthropics/claude-code#91569](https://github.com/anthropics/claude-code/issues/91569). Cousins (cite only, not primaries): [#89467](https://github.com/anthropics/claude-code/issues/89467) Windows `WS_EX_TOPMOST`; [#66516](https://github.com/anthropics/claude-code/issues/66516) closed-as-invalid same macOS symptom; [#91230](https://github.com/anthropics/claude-code/issues/91230) CU window move/maximize same subsystem.

Hypothesis only (NON-BINDING): stealth-relaunch `setAlwaysOnTop(true)` until focus; if CU docks before clear, `wasAlwaysOnTop` captured true and every restore re-applies `setAlwaysOnTop(true, 'floating')`; discard if issue evidence disagrees.

NOT leftover solecism usage-desk / coffer vault / codicil probate / crimp pliers / jackfield channel-strip / tocsin fire-bell / bolter flour-mill / deadeye standing-rigging / reglet letterpress. Product name stays Buoy.

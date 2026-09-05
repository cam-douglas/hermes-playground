# Pasteboard hook

Tiny compositor paste-up / kraft pasteboard classifier notes for the Claude Code defect where `chat:imagePaste` is bound to `Alt+V` only on Windows/WSL, so Linux and macOS get `Ctrl+V` only. When a VTE terminal owns `Ctrl+V`, Linux is left with no working image-paste key. OPEN. Labels: bug, has repro, platform:linux, area:tui, keybindings.

IDLE_WORD=stuck. SEEDED_WORD=missed. Seeded state is missed / #92312 (Alt+V no-op on Linux; pasteboard blank). Never idle as gated / spilled / hushed / blurted / single / maculed / stilled / rung / barred / dropped / pared / raw / cast / fouled / flowing / snubbed / matched / warded / lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten.

This stub is documentation only. The living page at `projects/pasteboard/index.html` scores probes in-browser. No npm. No secrets. No real hooks. No exploits. Diagnostic shapes only (`chat:imagePaste`, `Alt+V`, `Ctrl+V`, platform windows/wsl/linux/macos, `image/png`, ddterm/VTE, proposed additive bind). No payloads.

Preferred fix / detection (document only — do not treat this stub as a live hook):

1. Bind `Alt+V` to `chat:imagePaste` on every platform, additively, exactly as WSL already does, or
2. Keep platform-specific keys as additions, never substitutions, so Linux/macOS retain `Ctrl+V` and also receive `Alt+V`.

Detection: if platform is linux or macos, the default table binds only `Ctrl+V`, `Alt+V` is unbound, a VTE terminal (ddterm, GNOME Terminal, Tilix, Konsole) owns `Ctrl+V` for its own paste, and the operator presses `Alt+V` against an `image/png` clipboard with no chip, no hint, and no error, the pasteboard is already missed.

Given a probe-shaped payload `{ platform, altVBound, ctrlVBound, terminalStealsCtrlV, terminal, clipboardType, chipAffixed, altVPressed, additiveFix, missed, stuck, persistHold, hasRepro, log }`:

- **STUCK** if an image chip is affixed via a working `chat:imagePaste` chord
- **MISSED** if Alt+V is a no-op on Linux and the pasteboard stays blank (#92312)
- **WINDOWS-ALT** if Windows binds `Alt+V` only
- **WSL-BOTH** if WSL binds both `Alt+V` and `Ctrl+V`
- **LINUX-CTRL-ONLY** if Linux/macOS bind `Ctrl+V` only
- **TERMINAL-STEALS-CTRLV** if a VTE terminal owns `Ctrl+V` and Linux has zero working image-paste shortcut
- **ADDITIVE-FIX** if `Alt+V` is bound additively on every platform, as WSL already does
- **HAS-CLEAR-REPRO** if the issue has a clear repro (`image/png` on the clipboard; Alt+V does nothing)
- **HOLD** if persistHold keeps the chip affixed

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the chord affixed the chip or the image already never stuck.

Primary: [anthropics/claude-code#92312](https://github.com/anthropics/claude-code/issues/92312). Cousins (cite only, not primary): [#74424](https://github.com/anthropics/claude-code/issues/74424) stale same symptom; [#88898](https://github.com/anthropics/claude-code/issues/88898) / [#8324](https://github.com/anthropics/claude-code/issues/8324) clipboard tooling — different root cause.

Hypothesis only (NON-BINDING): default keybinding table substitutes rather than adds `Alt+V` off Windows/WSL. Do not claim source beyond the issue’s quoted binding snippet and measured repro. Discard if issue evidence disagrees.

NOT leftover Spillway dam teal / concrete · Blurt CRT phosphor green · Macule letterpress cream / vermilion · Alarum indigo night watchtower · Portcullis castle grate · Skive leather tannery · Lagan salvage-buoy · Snub dockside snubbing post · Ward locksmith iron/brass · Deadlight night-cabin shutter. Product name stays Pasteboard.

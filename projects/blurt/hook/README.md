# Blurt hook

Tiny CRT / phosphor-terminal classifier notes for the Claude Code defect where terminal identification queries (`CSI > 0 q` XTVERSION and `CSI c` Primary DA) are emitted inside a ~50ms cooked ECHO window after focus/bracketed-paste teardown, leaking VTE replies as caret-notation garbage above the banner. OPEN. Labels: bug, has repro, platform:linux, area:tui.

Idle word is **hushed**. Seeded state is blurted / #92275 (probes already fired inside the cooked ECHO window; VTE replies leaked as caret notation). Never idle as single / maculed / stilled / rung / barred / dropped / pared / raw / cast / fouled / flowing / snubbed / matched / warded / lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten.

This stub is documentation only. The living page at `projects/blurt/index.html` scores probes in-browser. No npm. No secrets. No real hooks. No exploits. Diagnostic shapes only (CSI sequences, ECHO on/off timestamps, VTE caret-notation fragments). No payloads.

Preferred fix / detection (document only — do not treat this stub as a live hook):

1. Never emit identification queries while ECHO is on.
2. Keep raw mode through the probe.
3. No caret-notation leak above the banner.

Detection: if startup restores cooked ECHO after focus/bracketed-paste teardown, emits `CSI > 0 q` and `CSI c` inside that ~47–51ms window, and VTE replies (`^[[I`, `^[P>|VTE(...)`, `…1;22;28c`) print above the banner, the hush is already blurted.

Given a probe-shaped payload `{ echoOn, rawHeld, cookedWindow, teardownFocusPaste, probesEmittedWhileEchoOn, xtversion, primaryDA, vteReplyMs, cookedWindowMs, caretLeak, fragments, bannerClean, retryWithEchoOff, persistHold, log }`:

- **HUSHED** if ECHO stays off and probes wait for raw mode
- **BLURTED** if probes fired inside the cooked ECHO window and VTE replies leaked (#92275)
- **COOKED** if ECHO was re-enabled after focus/bracketed-paste teardown
- **PROBED** if XTVERSION + Primary DA were emitted
- **LEAKED** if the kernel line discipline echoed replies above the banner
- **RETRIED** if the same probes were resent ~110ms later with ECHO off
- **CLEANED** if raw mode was held through identification and no caret garbage printed

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the hush held or the probes already blurted.

Primary: [anthropics/claude-code#92275](https://github.com/anthropics/claude-code/issues/92275). Cousins (cite only, not primary): [#91530](https://github.com/anthropics/claude-code/issues/91530) tmux resume probe-as-input; [#87459](https://github.com/anthropics/claude-code/issues/87459) Windows Terminal mouse-tracking echo.

Hypothesis only (NON-BINDING): the interactive desk should make “XTVERSION + Primary DA emitted inside a cooked ECHO window” visceral via caret garbage on a phosphor screen. Discard if issue evidence disagrees. Do not claim unseen source.

NOT leftover Macule letterpress cream / vermilion · Alarum indigo night watchtower · Portcullis castle grate · Skive leather tannery · Lagan salvage-buoy · Snub dockside snubbing post · Ward locksmith iron/brass · Deadlight night-cabin shutter · Oubliette stone-pit · Ephemera wick-lit folio. Product name stays Blurt.

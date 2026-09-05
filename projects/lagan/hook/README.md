# Lagan hook

Tiny salvage / lagan-buoy classifier notes for the Claude Code desktop defect where closing a session window or tab leaves the `claude` wrapper and entity child processes running. They are not detected as orphans while the parent app lives, and each remnant burns ~8–12% CPU. Filed ~2026-09-05. Labels: bug, has repro, platform:macos, regression, perf:cpu, area:desktop. Claude Code desktop on macOS (Darwin 25.2.0). Confirmed on desktop-bundled CLI 2.1.246.

Idle word is **cast**. Seeded state is fouled / #92266 (window/tab close leaves wrapper+entity alive, burning CPU on a living parent). Never idle as flowing / snubbed / matched / warded / lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / careted / ringing.

This stub is documentation only. The living page at `projects/lagan/index.html` scores probes in-browser. No npm. No secrets. No real hooks. No exploits. Diagnostic shapes only (live vs observed PIDs, close method, parent alive, CPU %, `kernel_task`). No process-kill scripts. No payloads.

Given a probe-shaped payload `{ liveSessions, openedSessions, processesPerSession, observedClaude, remnantProcesses, cpuPerRemnantPct, kernelTaskPct, typingLag, parentAlive, parentQuit, closeMethod, exitReleased, windowCloseLeftChildren, orphansDetected, persistHold, log }`:

- **CAST** if the session ended with `/exit` or Ctrl+D and the children released, or the whole Claude app was quit and the batch cleared
- **FOULED** if a window/tab close left the wrapper+entity pair alive and burning CPU while the parent lives (#92266)
- **PAIR-PER-SESSION** if each session starts 2 `claude` processes (wrapper + entity)
- **THERMAL-THROTTLE** if many remnants sit against few live sessions (`kernel_task` ~189%, typing lag)
- **CPU-8-12** if each remnant burns ~8–12% CPU continuously
- **PARENT-ALIVE** if remnants are not detected as orphans while Claude.app lives
- **EXIT-MITIGATION** if `/exit` or Ctrl+D released the pair, or quitting the app cleared the batch
- **REGRESSION-58915** if the probe cites the closed #58915/#61748 recurrence (cite-only)

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the lagan is cast or already fouled.

Primary: [anthropics/claude-code#92266](https://github.com/anthropics/claude-code/issues/92266). Cousins (cite only, not primary): [#58915](https://github.com/anthropics/claude-code/issues/58915), [#61748](https://github.com/anthropics/claude-code/issues/61748), [#45507](https://github.com/anthropics/claude-code/issues/45507), [#77459](https://github.com/anthropics/claude-code/issues/77459).

Hypothesis only (NON-BINDING): the interactive desk should make the still-attached remnant pair and the thermal pile visceral. Discard if issue evidence disagrees. Do not claim unseen source.

NOT leftover Snub dockside snubbing post · Ward locksmith iron/brass · Deadlight night-cabin shutter · Careen careening yard · Hawser pile · Buoy orange waterline. Product name stays Lagan.

# Forme hook

Tiny imposing-stone / locked-forme classifier notes for the Claude Code TUI defect where completed turns are repainted in place, so terminal scrollback loses the recent conversation. Reporter yiidtw. Filed 2026-09-04. Labels: bug, platform:linux, area:tui. Claude Code 2.1.260 · tmux 3.4 · TERM=tmux-256color · Linux 6.8.

Idle word is **locked**. Seeded state is wiped / #92203 (completed turns stay in the dynamic region; later frames erase them). Never idle as seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / fouled / careted.

This stub is documentation only. The living page at `projects/forme/index.html` scores probes in-browser. No npm. No secrets.

Given a probe-shaped payload `{ completedTurnsInLiveChase, staticCommit, repaintLiveOnly, scrollbackGap, jsonlIntact, jsonlPath, tmuxCopyMode, pipePaneCapturesRepaint, resumeSameTui, inkHint, liveRegion, completedTurn, claudeVersion, tmux, term, log }`:

- **LOCKED** if completed turns are committed to native scrollback and only the live region repaints
- **WIPED** if completed turns stay in the dynamic region and later frames erase them from scrollback (#92203)
- **REPAINT** if the TUI redraws the output region in place
- **STATIC-COMMIT** if finished turns are written once, permanently, above the live chase
- **SCROLLBACK-GAP** if older output remains and the recent conversation is missing
- **JSONL-INTACT** if session JSONL is complete and written live, but undiscoverable from the TUI
- **TMUX-COPY-MODE** if copy-mode scroll shows the gap rather than the last turns
- **LIVE-REGION** if only the bottom interactive region should reprint
- **COMPLETED-TURN** if a finished exchange will never change again
- **INK-HINT** if the bundled binary contains `measureElement` / `useStdout` / `useInput` and `<Static>` is suggested
- **PIPE-PANE** if `tmux pipe-pane` captures repaints, not a transcript
- **RESUME-SAME-TUI** if `/resume` renders through the same TUI

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the forme locked finished type onto the stone or the chase already wiped.

Primary: [anthropics/claude-code#92203](https://github.com/anthropics/claude-code/issues/92203). Cousins (cite only, not primary): [#87450](https://github.com/anthropics/claude-code/issues/87450), [#76692](https://github.com/anthropics/claude-code/issues/76692), [#84247](https://github.com/anthropics/claude-code/issues/84247), [#85508](https://github.com/anthropics/claude-code/issues/85508), [#79896](https://github.com/anthropics/claude-code/issues/79896), [#88040](https://github.com/anthropics/claude-code/issues/88040), [#85142](https://github.com/anthropics/claude-code/issues/85142), [#51828](https://github.com/anthropics/claude-code/issues/51828).

Hypothesis only (NON-BINDING): completed turns stay in the dynamic Ink region instead of `<Static>`, so later frames erase them from scrollback. Discard if issue evidence disagrees. Do not claim unseen source.

NOT leftover Tabula wax tablet / floodplain oxbow / glacial relict / letterpress hellbox melt / bone-ash cupel / stone-pit oubliette. Product name stays Forme.

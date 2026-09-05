# Snub hook

Tiny dockside snub / hawser-post classifier notes for the Claude Code Bash-tool defect where a heredoc file write on macOS with Homebrew bash 5.1+ first on PATH hangs for the full 120s timeout and leaves the target truncated to 0 bytes. Filed ~2026-09-05. Labels: bug, has repro, platform:macos, area:bash. Claude Code 2.1.260 (Claude Desktop, Code tab). macOS 26.5.2 arm64.

Idle word is **flowing**. Seeded state is snubbed / #92262 (PATH bash is Homebrew 5.1+; Bash-tool heredoc of mid-size body hangs then leaves the file at 0 bytes). Never idle as matched / warded / lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / fouled / careted / ringing.

This stub is documentation only. The living page at `projects/snub/index.html` scores probes in-browser. No npm. No secrets. No real hooks. No exploits. Fictionalized paths only (`/tmp/probe.txt`, `$HOME/<demo-home>/mix.exs`). Diagnostic shapes only (sizes, which bash, hang vs OK, truncated:true).

Given a probe-shaped payload `{ bashPath, bashVersion, bashFamily, homebrewPath, tool, heredoc, bodyBytes, hung, timeoutSeconds, targetTruncated, targetBytesAfter, completedEcho, compat44, persistHold, log }`:

- **FLOWING** if system `/bin/bash` would have completed, or the Write tool was used, or body ≤512, or body ≥64 KB, or `compat44` restored temp-file heredocs
- **SNUBBED** if PATH bash is Homebrew 5.1+ and a Bash-tool heredoc write of mid-size body (513–65535 B) hangs then leaves the file at 0 bytes (#92262)
- **EDGE-496-OK** if 496 B fits the 512 B pipe
- **EDGE-600-SNUB** if ~600 B hangs just past the cliff
- **LARGE-100KB-OK** if 100 KB takes the temp-file path
- **HOMEBREW-PATH** if PATH-resolved bash picks Homebrew instead of `/bin/bash`
- **SYSTEM-BASH-OK** if `/bin/bash` 3.2.57 is not affected
- **COMPAT44-MITIGATION** if `shopt -s compat44` restores pre-5.1 temp-file heredocs (undocumented side effect)

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the hawser is flowing or already snubbed.

Primary: [anthropics/claude-code#92262](https://github.com/anthropics/claude-code/issues/92262). Cousins (cite only, not primary): [#33768](https://github.com/anthropics/claude-code/issues/33768), [#44564](https://github.com/anthropics/claude-code/issues/44564), [#62813](https://github.com/anthropics/claude-code/issues/62813), [#92178](https://github.com/anthropics/claude-code/issues/92178), [#88041](https://github.com/anthropics/claude-code/issues/88041).

Hypothesis only (NON-BINDING): the interactive desk should make the 512-byte pipe cliff and truncate-before-body failure visceral. Discard if issue evidence disagrees. Do not claim unseen source.

NOT leftover Ward locksmith iron/brass · Deadlight night-cabin shutter · Careen careening yard · Hawser UI. Product name stays Snub.

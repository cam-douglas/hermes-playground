# Stroboscope fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92395 issue facts: in the Claude Code desktop app (Code tab) 1.46388.4 on Windows 11 Enterprise 10.0.26200, the Terminal panel flickers — opens then closes — on every Bash/PowerShell tool call and steals keyboard focus from the chat input. File read/write/search tool calls produce no flicker. Leaving the panel already docked open still flickers. `run_in_background: true` is worse (two flickers). No auto-open or auto-focus setting exists.

Idle word: **strobing**. Seeded word: **stolen**. Contrast: **held** / **in-place-update** / **file-tools-quiet** / **bg-double-strobe**. Primary: [anthropics/claude-code#92395](https://github.com/anthropics/claude-code/issues/92395). Seed primary as stolen / shell-path flicker / chat caret yanked.

| File | Verdict | What it scores |
|---|---|---|
| `strobing.json` | strobing | Idle stroboscope fence. Panel already strobes on every shell tool call. |
| `stolen.json` | stolen | Seeded #92395. Flicker + focus left the chat input. Keystrokes lost or misdirected. |
| `92395.json` | stolen | Primary fixture alias for #92395. |
| `repro.json` | stolen | Published Code-tab `echo test` repro. |
| `shell-strobe.json` | strobing | Bash/PowerShell tool-call path is the only trigger. |
| `file-tools-quiet.json` | file-tools-quiet | Contrast. File read/write/search produce no flicker. |
| `docked-open.json` | strobing | Prior panel state not respected; docked-open still flickers. |
| `bg-double-strobe.json` | bg-double-strobe | Contrast. `run_in_background: true` → two flickers (launch + completion). |
| `no-config-toggle.json` | strobing | No GUI toggle; config.json has no auto-open / auto-focus key. |
| `ruled-out.json` | strobing | Hooks none; keybindings absent; config only PowerShell path + layout. |
| `held.json` | held | Contrast hold. Panel stays in whatever state the user left it. |
| `in-place-update.json` | in-place-update | Contrast hold. Output writes without raising or focusing. |
| `remediation-held.json` | held | Expected fix: do not change visibility or focus on tool-call execution. |
| `remediation-inplace.json` | in-place-update | Expected fix: write output into the panel without raising it. |
| `remediation-setting.json` | setting-off | Expected fix: `autoOpenTerminalOnToolUse: false`. |
| `cousins.json` | stay-off | Cite-only cousins #89071 #89072 #39634 #35797 #7618 #32726 #1913 #10794 #82286 #84400. |
| `fixtures.json` | index | Row list for the optics-lab bench. |

Drop any file onto `projects/stroboscope/index.html` or paste the JSON. The living page seeds **stolen** / shell-path flicker / chat caret yanked.

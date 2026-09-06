# Thrash fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #88257 issue facts: first prompt of every new Claude Code process (even `--safe-mode`, Haiku, one-file git repo) freezes the TUI ~40–60s. Event-loop stall 40808ms, ~100% CPU, RSS 2646MB / heap 896MB. Silence between `Sending 12 skills via attachment (initial)` and API first byte after 40832ms. CPU≈wall so synchronous main-thread work, not I/O. Stall detector's `[likely sleep/wake]` tag is misleading. Every new process pays again. Score thrashing or admit responsive.

Idle word: **thrashing**. Seeded word: **responsive**. HOLD: **responsive**. ALARM: **thrashing** / **event-loop-stall** / **rss-balloon** / **cpu-bound-gap** / **safe-mode-still-stalls** / **sleep-wake-mislabelled** / **cousins**. Primary: [anthropics/claude-code#88257](https://github.com/anthropics/claude-code/issues/88257). Seed primary as thrashing / event-loop stall / RSS balloon.

Do not invent runtime source claims. Hypothesis (NON-BINDING): something between skills-attachment send and first API byte does heavy synchronous main-thread work. Encoded measurements only.

| File | Verdict | What it scores |
|---|---|---|
| `thrashing.json` | thrashing | Idle fence. First-prompt event-loop stall with ballooned RSS / frozen TUI. |
| `responsive.json` | responsive | Seeded hold. First prompt streams in a couple of seconds; terminal stays alive. |
| `88257.json` | thrashing | Primary fixture alias for #88257. |
| `settings.json` | safe-mode-still-stalls | Isolation table: user config / MCP / large cwd ruled out; `--safe-mode` still stalls. |
| `event-loop-stall.json` | event-loop-stall | Stall 40808ms (expected 200ms, actual 41008ms). Ctrl+C ignored until stall ends. |
| `rss-balloon.json` | rss-balloon | RSS 2646MB heap 896MB ext 270MB; range ~2.5–3.5 GB. Host 62 GB. |
| `cpu-bound-gap.json` | cpu-bound-gap | Skills-attachment → first-byte gap; cpu=40899ms ≈ wall. |
| `safe-mode-still-stalls.json` | safe-mode-still-stalls | `--safe-mode` + Haiku + one-file repo still freezes. |
| `sleep-wake-mislabelled.json` | sleep-wake-mislabelled | `[likely sleep/wake]` tag is misleading when CPU≈wall. |
| `cousins.json` | cousins | Cite-only #89772 #91633 #88072 #92325 #91941. |
| `fixtures.json` | index | Row list for the paging-storm lab. |

Drop any file onto `projects/thrash/index.html` or paste the JSON. The living page admits **thrashing** / event-loop stall / RSS balloon / #88257.

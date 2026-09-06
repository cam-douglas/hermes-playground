# Glowplug fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #85050 issue facts: on Windows, every `claude` start (interactive, `-p`, and `--resume`) spends ~75 seconds in two completely silent startup phases — nothing written to `--debug` while they run. The gaps end at `[skills] idle` and `[ScheduledTasks] scheduler start`. Full config 111–136s; empty `CLAUDE_CONFIG_DIR` in an empty directory is **6s**. Score preheating or admit lit.

Idle word: **preheating**. Seeded word: **lit**. HOLD: **lit**. ALARM: **preheating** / **gap-skills-idle** / **gap-scheduler** / **skills-removed-persists** / **nonessential-traffic-noop** / **cert-store-bundled-noop** / **cousins**. Control: **empty-config-fast**. Primary: [anthropics/claude-code#85050](https://github.com/anthropics/claude-code/issues/85050). Seed primary as preheating / two silent soaks / unlogged warm-up.

| File | Verdict | What it scores |
|---|---|---|
| `preheating.json` | preheating | Idle glow-plug fence. Two silent Windows startup gaps. |
| `lit.json` | lit | Seeded hold. Empty-config path already 6s. |
| `85050.json` | preheating | Primary fixture alias for #85050. |
| `gap-skills-idle.json` | gap-skills-idle | ~57–60s silent to `[skills] idle`. |
| `gap-scheduler.json` | gap-scheduler | ~17–38s silent to ScheduledTasks. |
| `skills-removed.json` | skills-removed-persists | Skills renamed away: 85.5s; gaps persist. |
| `empty-config.json` | empty-config-fast | Fresh empty `CLAUDE_CONFIG_DIR` + empty cwd: 6s. |
| `wall-times.json` | preheating | PowerShell Stopwatch table from the issue. |
| `nonessential-traffic.json` | nonessential-traffic-noop | `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`: 127.9s, no effect. |
| `cert-store-bundled.json` | cert-store-bundled-noop | `CLAUDE_CODE_CERT_STORE=bundled`: 115.3s, no effect. |
| `cousins.json` | cousins | Cite-only #84478 #83988. |
| `fixtures.json` | index | Row list for the glow-plug preheat bay. |

Drop any file onto `projects/glowplug/index.html` or paste the JSON. The living page admits **preheating** / two silent soaks / unlogged warm-up / #85050.

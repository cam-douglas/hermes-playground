# Blurt fixtures

Diagnostic JSON only. No credentials. No payloads. XTVERSION `CSI > 0 q`, Primary DA `CSI c`, cooked ECHO window, VTE caret-notation leak, pty timestamps only.

Idle word: **hushed**. Seeded word: **blurted**. Primary: [anthropics/claude-code#92275](https://github.com/anthropics/claude-code/issues/92275).

| File | Verdict | What it scores |
|---|---|---|
| `hushed.json` | hushed | Idle hold. ECHO stays off; probes only after raw mode; clean banner. |
| `blurted.json` | blurted | Seeded #92275. Probes fired inside cooked ECHO window; VTE replies leaked as caret notation. |
| `cooked.json` | cooked | ECHO re-enabled after focus/bracketed-paste teardown. |
| `probed.json` | probed | XTVERSION + Primary DA emitted. |
| `leaked.json` | leaked | Kernel line discipline echoed replies above the banner. |
| `retried.json` | retried | Same probes resent ~110ms later with ECHO off (works). |
| `cleaned.json` | cleaned | Expected: raw mode held through identification; no caret garbage. |
| `cousins.json` | cite-only | #91530 (tmux resume probe-as-input). #87459 (Windows Terminal mouse-tracking echo). Cite only. |
| `fixtures.json` | index | Row list for the scoring desk. |

Drop any file onto `projects/blurt/index.html` or paste the JSON. The living page seeds **blurted**.

# Heliostat fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92389 issue facts: `"theme": "auto"` resolves once at startup and never follows a live light/dark switch on Windows Terminal. Detection works. The trigger is missing: resample is gated solely on DECSET 2031 (`CSI ? 2031 h`), parsing `CSI ? 997 ; [12] n` off stdin, then re-querying OSC 11. Windows Terminal does not implement mode 2031 (`DECRQM ? 2031` → `0` NOT RECOGNIZED; `?2026` and `?2004` are supported). OSC 11 already holds the new sky (`rgb:fafa/fafa/fafa` → `rgb:2828/2c2c/3434`). Injecting `ESC [ ? 997 ; 2 n` makes Claude Code immediately re-query and switch.

Idle word: **dawnlocked**. Seeded word: **misaimed**. Contrast: **tracking** / **manual-theme** / **injected-997**. Primary: [anthropics/claude-code#92389](https://github.com/anthropics/claude-code/issues/92389). Seed primary as misaimed / OSC 11 fresh / Claude still light.

| File | Verdict | What it scores |
|---|---|---|
| `dawnlocked.json` | dawnlocked | Idle heliostat fence. Theme auto resolved at startup; 2031 never rings. |
| `misaimed.json` | misaimed | Seeded #92389. OS dark; WT sky 2828; Claude still light. |
| `92389.json` | misaimed | Primary fixture alias for #92389. |
| `repro.json` | misaimed | Published Win11 + WT `{dark,light}` colorScheme repro. |
| `unrecognized-2031.json` | dawnlocked | `DECRQM ?2031` → `0`; `?2026` / `?2004` supported. |
| `osc11-fresh.json` | misaimed | WT reports the new background immediately; Claude never asks again. |
| `stdin-silent.json` | dawnlocked | `?2031` enabled; 45s; several flips; nothing on stdin. |
| `controls-supported.json` | dawnlocked | `?2026` and `?2004` supported, so the `0` is real. |
| `focus-gated-daemon.json` | dawnlocked | Focus re-query exists; gated on `CLAUDE_BG_BACKEND === "daemon"`. |
| `injected-997.json` | injected-997 | Contrast hold. Inject `CSI ? 997 ; 2 n`; live switch. |
| `manual-theme.json` | manual-theme | Contrast hold. `/theme` or restart. |
| `tracking.json` | tracking | Contrast hold. Resample ran; beam on the live sky. |
| `remediation-focus.json` | tracking | Expected fix: OSC 11 on focus regain when 2031 unrecognized. |
| `remediation-interval.json` | tracking | Expected fix: OSC 11 on an interval when 2031 unrecognized. |
| `cousins.json` | stay-off | Cite-only cousins #63433 #86048 #75586 #92299. |
| `fixtures.json` | index | Row list for the heliostat mount. |

Drop any file onto `projects/heliostat/index.html` or paste the JSON. The living page seeds **misaimed** / OSC 11 fresh / Claude still light.

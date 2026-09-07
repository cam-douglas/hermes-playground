# Afterimage fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92596 issue facts: Windows assistant text deltas arrive and the token counter ticks, but the message field stays latent until `message_stop`, then one mega-frame. Score latent or admit flushed.

Idle word: **latent**. Seeded word: **flushed**. HOLD: **flushed**. ALARM: **latent** / **thinking-paints** / **text-zero-frames** / **mega-frame-stop** / **linux-progressive** / **nonstreaming-fallback-ruled-out** / **fine-grained-no-effect** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92596](https://github.com/anthropics/claude-code/issues/92596).

Fixtures record the published incident (thinking ~15fps, text zero frames, 2,482-patch stop frame, Linux progressive contrast, non-streaming fallback ruled out, fine-grained flag no effect). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `latent.json` | latent | Idle phosphor. Deltas held; message field blank until `message_stop`. |
| `flushed.json` | flushed | Seeded hold. Windows text paints per-delta like thinking. |
| `92596.json` | latent | Primary fixture alias for #92596. |
| `thinking-paints.json` | thinking-paints | Thinking deltas ~200 frames / 13s / ~15fps. |
| `text-zero-frames.json` | text-zero-frames | Text phase zero paint frames. |
| `mega-frame-stop.json` | mega-frame-stop | One 2,482-patch frame then 2,472-patch repaint. |
| `linux-progressive.json` | linux-progressive | Same CLI + gateway streams on Linux. |
| `nonstreaming-fallback-ruled-out.json` | nonstreaming-fallback-ruled-out | `DISABLE_NONSTREAMING_FALLBACK=1`. |
| `fine-grained-no-effect.json` | fine-grained-no-effect | Fine-grained tool streaming has no effect on prose. |
| `cousins.json` | cousins | Cite-only #92616 / #92531 / #92493. Primary stays #92596. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the afterimage card. |

Drop any file onto `projects/afterimage/index.html` or paste the JSON. The living page admits **latent** / thinking-paints + text-zero-frames / #92596.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

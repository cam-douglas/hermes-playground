# Hysteresis fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92444 issue facts: Anthropic prompt-caching docs say effort is "not part of the cache key... changing it mid-session has no effect on the cache." Empirically true only for Fable 5.1. On Sonnet 5 a mid-session `/effort` change is a partial rewrite; on Opus 5 it is a full rewrite (`read=0`). Score the remanence or admit the cache already rewritten.

Idle word: **remanent**. Seeded word: **rewritten**. Contrast: **remanent** / **fable-preserved** (free). Diagnostic chips: **sonnet-partial** / **opus-full** / **fable-preserved** / **docs-mismatch** / **dialog-false-alarm** / **mid-session-switch**. Primary: [anthropics/claude-code#92444](https://github.com/anthropics/claude-code/issues/92444). Seed primary as rewritten / Sonnet droops / Opus snaps open / docs mismatch.

| File | Verdict | What it scores |
|---|---|---|
| `remanent.json` | remanent | Idle remanence fence. Prompt-cache holds after mid-session `/effort`. |
| `rewritten.json` | rewritten | Seeded #92444. Sonnet partial / Opus full / docs say no effect. |
| `92444.json` | rewritten | Primary fixture alias for #92444. |
| `repro.json` | rewritten | Published transcript table: control then two switches per family. |
| `settings.json` | docs-mismatch | Docs promise remanent; live cache rewritten on Sonnet/Opus. |
| `sonnet-partial.json` | sonnet-partial | Sonnet 5 high→low 51.3K / 26.5K; low→medium 45.4K / 32.5K. |
| `opus-full.json` | opus-full | Opus 5 both switches read=0 / write≈ctx. |
| `fable-preserved.json` | fable-preserved | Contrast hold. Fable 5.1 all switches remanent / free. |
| `docs-mismatch.json` | docs-mismatch | Docs wrong for two of three families. |
| `dialog-false-alarm.json` | dialog-false-alarm | Unconditional cache-miss dialog; false alarm on Fable. |
| `mid-session-switch.json` | mid-session-switch | Control holds; switches rewrite Sonnet/Opus. |
| `cousins.json` | cousins | Cite-only #61984 CLOSED and #63962 CLOSED. |
| `fixtures.json` | index | Row list for the magnetic remanence lab. |

Drop any file onto `projects/hysteresis/index.html` or paste the JSON. The living page seeds **rewritten** / Sonnet partial / Opus read=0 / docs mismatch.

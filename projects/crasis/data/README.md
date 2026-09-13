# Crasis fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93960 issue facts: per-project storage under `~/.claude/projects/` is derived by replacing every non-alphanumeric character with a single `-`. That mapping is not injective, so two project paths fuse into one MEMORY/transcript drawer. Score crasis or admit injective.

Idle word: **injective**. Path word: **store-slug-collide**. Seeded loss: **crased**. Product: **crasis**. HOLD: **injective**. ALARM: **crased** / **crasis** / **store-slug-collide** / **memory-leak**. Primary: [anthropics/claude-code#93960](https://github.com/anthropics/claude-code/issues/93960).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `injective.json` | injective | Idle drawers. HOLD: one path, one store. |
| `hold.json` | hold | HOLD alias for idle injective. |
| `crased.json` | crased | Seeded #93960 path. ALARM: fused slug. |
| `crasis.json` | crasis | Product score for the manuscript crasis booth. |
| `store-slug-collide.json` | store-slug-collide | Path: fused slug vs one-path-one-store. |
| `non-ascii-collapse.json` | non-ascii-collapse | 가나다 vs 라마바 (length 3) share one store. |
| `separator-ambiguity.json` | separator-ambiguity | ab-cd vs ab/cd — #29471 still live. |
| `control-length.json` | control-length | 가나다라 (length 4) does not collide. |
| `memory-leak.json` | memory-leak | ALPHA-777 from 가나다 injected into 라마바. |
| `transcript-pool.json` | transcript-pool | Transcripts pool in the colliding store. |
| `auto-memory-workaround.json` | auto-memory-workaround | Cite: isolates memory only; transcripts still pool. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #29471 / #93743 / #7009 / #21085 / #35162. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Ink / vellum / cinnabar / verdigris. |
| `walk.json` | walk | Published idle injective → store-slug-collide → crased → crasis. |

## Cousins (cite only)

#29471 (CLOSED COMPLETED, still repros). #93743 (OPEN, non-ASCII case). #7009, #21085, #35162. Do not rebuild as separate booths.

## Backups (cite only — do NOT auto-pick or build)

#93772 #93770 #93777 #93782 #93889 #93821 #93811 #93809 #93823 #93924 #93925

Drop any file onto `projects/crasis/index.html`. Buttons load the seeded path. The living page admits **injective** / idle drawers / #93960.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

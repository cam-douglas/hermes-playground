# Rheostat fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92436 issue facts: `/code-review <target> --level low` does not actually run at low effort. `--level` is correctly echoed into the coordinator prompt's Review target line (e.g. `Review target: \`HEAD --level low\``), but the effort-scaling instructions underneath stay hardcoded to the high-effort configuration: `high effort → 3+5 angles × 6 candidates → 1-vote verify (recall-biased) → ≤10 findings`, framed as "You are reviewing for **recall** at high effort... Err on the side of surfacing." Phase 1 runs **8 independent finder angles** (3 correctness + 3 cleanup + 1 altitude + 1 conventions, up to 6 each) via 5 parallel Agent-tool batches — same as a higher-effort run. The skill tool description says effort level controls scope, so this is a wiring bug, not a docs gap. Score the dial or admit the pipeline already maxed.

Idle word: **maxed**. Seeded word: **hardwired**. Contrast: **attenuated** / **level-honored** / **angle-scaled** / **framing-matched** / **cost-honest**. Primary: [anthropics/claude-code#92436](https://github.com/anthropics/claude-code/issues/92436). Seed primary as hardwired / maxed pipeline / `--level low` echoed / scaling template high.

| File | Verdict | What it scores |
|---|---|---|
| `maxed.json` | maxed | Idle effort-dial fence. Requested low still launches the full high-effort pipeline. |
| `hardwired.json` | hardwired | Seeded #92436. Review target echoes `--level low`; scaling template stays high. |
| `92436.json` | hardwired | Primary fixture alias for #92436. |
| `repro.json` | hardwired | Published repro: `/code-review <target> --level low`; echo works; 8 angles / 5 batches. |
| `settings.json` | maxed | Skill tool description: low/medium = fewer high-confidence findings; high→max = broader. |
| `attenuated.json` | attenuated | Contrast hold. Low/medium actually runs fewer, high-confidence findings. |
| `level-honored.json` | level-honored | Contrast hold. Parsed `--level` drives the scaling map. |
| `angle-scaled.json` | angle-scaled | Contrast hold. Angle count differs per level. |
| `framing-matched.json` | framing-matched | Contrast hold. Framing matches requested level, not always recall-biased high. |
| `cost-honest.json` | cost-honest | Contrast hold. Token burn matches requested level. |
| `cousins.json` | stay-off | Cite-only cousins #90020 #88852 #87847 #88034 #79580 #90162 #92444. |
| `fixtures.json` | index | Row list for the effort-dial / rheostat lab. |

Drop any file onto `projects/rheostat/index.html` or paste the JSON. The living page seeds **hardwired** / `--level low` echoed / scaling template high / 8 angles / 5 batches.

# Epitome fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94032 issue facts: Desktop & mobile hardcoded summarizedThinking (3531779070) injects --thinking-display summarized so thinking blocks arrive with empty content; showThinkingSummaries only toggles summarized↔omitted — no full-chain opt-out. Score epitome or admit unabridged.

Idle word: **unabridged**. Path word: **summarized-thinking-force**. Seeded loss: **epitome**. Product: **epitome**. HOLD: **unabridged**. ALARM: **epitome** / **summarized-thinking-force** / **empty-thinking** / **flag-3531779070**. Primary: [anthropics/claude-code#94032](https://github.com/anthropics/claude-code/issues/94032).

Fixtures record the published incident only. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `unabridged.json` | unabridged | Idle desk. HOLD: folio open; knife sheathed. |
| `hold.json` | hold | HOLD alias for idle unabridged. |
| `epitome.json` | epitome | Seeded #94032 path and product. ALARM: empty folio body. |
| `summarized-thinking-force.json` | summarized-thinking-force | Path: hardcoded summarizedThinking injection. |
| `full-chain.json` | full-chain | HOLD alias: thinking chains stay intact. |
| `verbatim.json` | verbatim | HOLD alias: the folio body is kept. |
| `open-folio.json` | open-folio | HOLD alias: vellum stays open. |
| `intact-thinking.json` | intact-thinking | HOLD alias: thinking text is not stripped. |
| `chain-open.json` | chain-open | HOLD alias: the full-chain path stays open. |
| `empty-thinking.json` | empty-thinking | thinking blocks arrive with `"thinking": ""`. |
| `signature-only.json` | signature-only | Signature present; folio body gone. |
| `thinking-tokens-nonzero.json` | thinking-tokens-nonzero | Usage tokens non-zero; content stripped. |
| `show-summaries-toggle.json` | show-summaries-toggle | showThinkingSummaries only toggles summarized ↔ omitted. |
| `omitted-vs-summarized.json` | omitted-vs-summarized | Neither restores full chains. |
| `continuation-full.json` | continuation-full | CLI self-spawn returns full thinking. |
| `desktop-inject.json` | desktop-inject | `--thinking-display summarized` on every CLI spawn. |
| `flag-3531779070.json` | flag-3531779070 | summarizedThinking hardcoded WC(true). |
| `landing.json` | landing | Desk / vellum / gold-rule / knife / press. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #49268 #77460 #31326. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Desk / vellum / gold-rule / knife / press. |
| `walk.json` | walk | Published idle unabridged → summarized-thinking-force → epitome. |

## Cousins (cite only)

#49268 — Opus 4.7 display omitted default (different mechanism, same symptom). Do not conflate.

#77460 — Desktop ignores showThinkingSummaries on 4.7+/Fable 5 (closed, partial fix). Do not conflate.

#31326 — Terminal analog. Different surface. Do not rebuild.

## Backups (cite only — do NOT auto-pick or build)

#94031 #94029 #93987 #93924 #93770 #93777 #94059 #94053

Drop any file onto `projects/epitome/index.html`. Buttons load the seeded path. The unabridged page admits **unabridged** / idle desk / #94032.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

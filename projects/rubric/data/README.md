# Rubric fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92855 issue facts: a TUI echo should keep the user's own ordered-list numbers as penned; instead, when those numbers are not already sequential, every item after the first is rewritten to first+1, first+2, … so typed `3. / 2. / 1. / 4. / 5.` displays as `3. / 4. / 5. / 6. / 7.` and answers bind to the wrong questions. Regression in 2.1.234. Display-only on current versions — `message.content` keeps the typed digits. Score rewritten or admit as-penned.

Idle word: **as-penned**. Path word: **rewritten**. Seeded misbind: **misbound**. HOLD: **as-penned**. ALARM: **rewritten** / **misbound** / **paren-renumbered** / **blank-line-renumbered** / **display-only** / **before-after**. Primary: [anthropics/claude-code#92855](https://github.com/anthropics/claude-code/issues/92855).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. Redacted answer bodies stay redacted.

| File | Verdict | What it scores |
|---|---|---|
| `as-penned.json` | as-penned | Idle rubricator. HOLD: sequential numbers survive the echo. |
| `rewritten.json` | rewritten | Seeded #92855 path. ALARM: later items become first+1, first+2. |
| `92855.json` | rewritten | Primary fixture alias for #92855. |
| `misbound.json` | misbound | Seeded misbind: 3/2/1/4/5 displays as 3/4/5/6/7. |
| `start-honoured.json` | start-honoured | Control: lone `2.` stays `2.`; start index preserved. |
| `sequential-ok.json` | sequential-ok | Control: `1. 2. 3.` already sequential; preserved. |
| `paren-renumbered.json` | paren-renumbered | `3) 2) 1)` → `3) 4) 5)`; #75199 workaround dead. |
| `blank-line-renumbered.json` | blank-line-renumbered | Blank lines between `3. 2. 1.` still `3. 4. 5.` |
| `display-only.json` | display-only | Echo rewrites; `message.content` stays verbatim. |
| `before-after.json` | before-after | 2.1.233 as-penned; 2.1.234 rewritten. |
| `fixtures.json` | index | Row list for the scriptorium bench. |

Drop any file onto `projects/rubric/index.html`. Buttons load the seeded path. The living page admits **as-penned** / idle rubricator / #92855.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

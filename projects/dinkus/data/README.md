# Dinkus fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92798 issue facts: plugin-settings `parse-frontmatter.sh` / `validate-settings.sh` extract frontmatter with `sed -n '/^---$/,/^---$/{ /^---$/d; p; }'`. A sed range reopens on every body `---`, so a compositor's dinkus in the docs section leaks `enabled: false` into the chase. Score leaked or admit closed.

Idle word: **bound**. Seeded word: **leaked**. HOLD: **bound** / **closed**. ALARM: **leaked** / **sed-range-reopen** / **body-hr-bleed** / **enabled-true-false-concat** / **silent-disabled-path** / **false-as-missing** / **validate-hr-count** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92798](https://github.com/anthropics/claude-code/issues/92798).

Fixtures record the published incident (`.claude/my-plugin.local.md` with `enabled: true`, a body `---`, and docs `enabled: false`; parser returns `true\nfalse`; help-style compare fails silently). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `bound.json` | bound | Idle folio. HOLD: frontmatter stops at the first closing `---`. |
| `leaked.json` | leaked | Seeded #92798 path. ALARM: sed range reopens on body `---`. |
| `closed.json` | closed | Admit hold. Opening `---` on line 1; quit at first close. |
| `92798.json` | leaked | Primary fixture alias for #92798. |
| `sed-range-reopen.json` | sed-range-reopen | `sed -n '/^---$/,/^---$/{ /^---$/d; p; }'` reopens on every start match. |
| `body-hr-bleed.json` | body-hr-bleed | Body hairline makes whatever follows get treated as frontmatter. |
| `enabled-true-false-concat.json` | enabled-true-false-concat | Published repro returns `true\nfalse`. |
| `silent-disabled-path.json` | silent-disabled-path | `ENABLED=$(...)` vs `"true"` fails; no error printed. |
| `false-as-missing.json` | false-as-missing | `enabled: false` errors as field not found (`[ -z "$VALUE" ]`). |
| `validate-hr-count.json` | validate-hr-count | Check 3 counts any `---`; Check 7/8 leak side-effects. |
| `cousins.json` | cousins | Cite-only #52755 / #44901 / #19377. Primary stays #92798. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the chase. |

Drop any file onto `projects/dinkus/index.html` or paste the JSON. The living page admits **bound** / idle folio / #92798.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

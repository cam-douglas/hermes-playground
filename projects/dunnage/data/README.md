# Dunnage fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92746 issue facts: RemoteTrigger `action=list` returns `has_more`/`next_cursor` but ignores the cursor so routine lists beyond 20 cannot be paged. Score echoed or admit advanced.

Idle word: **berthed**. Seeded word: **echoed**. HOLD: **berthed** / **advanced**. ALARM: **echoed** / **same-page** / **has-more-lied** / **cursor-ignored** / **twenty-cap** / **pages-incomplete** / **cousins** / **has-clear-repro** / **list-vs-list-runs**. Primary: [anthropics/claude-code#92746](https://github.com/anthropics/claude-code/issues/92746).

Fixtures record the published incident (20 routines; `has_more: true`; `next_cursor` present; cursor reissues the same first page at HTTP 200, same ids / `created_at` / prompts, ~397 KB). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `berthed.json` | berthed | Idle crib. HOLD: list fits one page with `has_more` false, or cursor advances to a distinct next page. |
| `echoed.json` | echoed | Seeded #92746 path. ALARM: cursor ignored; identical first page reissued. |
| `advanced.json` | advanced | Admit hold. Cursor yields a distinct page 2+ or API stops advertising `has_more`/`next_cursor`. |
| `92746.json` | echoed | Primary fixture alias for #92746. |
| `same-page.json` | same-page | HTTP 200 with exactly the same first page (same ids, `created_at`, prompts, ~397 KB). |
| `has-more-lied.json` | has-more-lied | `has_more: true` and `next_cursor` advertised; next bay unreachable. |
| `cursor-ignored.json` | cursor-ignored | `cursor` argument is not applied to `action=list`. |
| `twenty-cap.json` | twenty-cap | 20 routines returned; routines 21+ unreachable. |
| `pages-incomplete.json` | pages-incomplete | AAINC-LAB/cc-usage-insights marks `pages_complete: false`. |
| `list-vs-list-runs.json` | list-vs-list-runs | `cursor` documented for `list_runs` / `get_run_log`; `list` still emits pagination metadata. |
| `cousins.json` | cousins | Cite-only #24785 CLOSED and #39586 CLOSED. Primary stays #92746. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the dunnage crib. |

Drop any file onto `projects/dunnage/index.html` or paste the JSON. The living page admits **berthed** / idle crib / #92746.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

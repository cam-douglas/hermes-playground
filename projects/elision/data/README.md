# Elision fixtures

Diagnostic JSON only. No payloads. No live Claude sessions. Encoded from #92347 issue facts: partial compaction **"Summarize up to here"** keeps everything after the anchor **except** prior compact summaries. Any earlier summary (e.g. from a previous "Summarize from here") that sits after the anchor is silently removed from the live context — it is neither summarized (outside the summarized range) nor preserved (filtered out of the kept suffix). Everything that existed only inside that summary is lost, with no warning. When rebuilding the preserved suffix, the client filters out compact boundaries **and** prior compact-summary messages (`type === "user" && isCompactSummary`). Excluding stale boundary markers is fine; applying the same filter to summary messages deletes irreplaceable content. Entries remain in the session `.jsonl` but live context loses them permanently.

Idle word: **intact**. Seeded word: **elided**. Primary: [anthropics/claude-code#92347](https://github.com/anthropics/claude-code/issues/92347).

| File | Verdict | What it scores |
|---|---|---|
| `intact.json` | intact | Idle hold. Prior summaries after the anchor stay in the kept suffix. |
| `elided.json` | elided | Seeded #92347. "up to here" filter drops standing summaries. |
| `92347.json` | elided | Primary fixture alias for #92347. |
| `case-a.json` | elided | Case A: four "from here" summaries dropped; 153 preservedMessages, none a summary. |
| `case-b.json` | elided | Case B: two "up to here" cuts discarded three of four summaries. |
| `case-c.json` | elided | Case C: from-here UUID kept; up-to-here UUID missing; session reported one. |
| `scenario-up-to-here.json` | elided | Shipped "up to here" rebuild with `isCompactSummary` filter. |
| `scenario-from-here.json` | from-here-safe | Workaround: "Summarize from here" keeps everything before its anchor. |
| `remediation-keep.json` | intact | Keep `isCompactSummary` in the preserved suffix; still filter boundaries. |
| `remediation-warn.json` | warn-discard | Expected alternative: warn that N earlier summaries will be discarded. |
| `repro.json` | elided | Published repro: from-here near end, then up-to-here older than S. |
| `file-refs.json` | file-refs-survived | Case A: re-attached file refs survived; summaries did not. |
| `compact-absorb.json` | absorb-compact | Workaround: `/compact` absorbs every summary in context. |
| `cousins.json` | stay-off | Cite-only cousins + stay-off catalog surfaces. |
| `fixtures.json` | index | Row list for the blue-pencil desk. |

Drop any file onto `projects/elision/index.html` or paste the JSON. The living page seeds **elided**.

# Plimsoll fixtures

Diagnostic JSON only. No live Claude sessions. No real tokens. Encoded from #92434 issue facts: auto-compact appears to decide from the previous turn's token count, so resume re-injected CLAUDE.md / `.claude/rules/*.md` overflow the window instead of compacting. Score overladen or admit trimmed.

Idle word: **overladen**. Seeded word: **trimmed**. HOLD: **trimmed**. ALARM: **overladen** / **stale-previous-count** / **reinject-jump** / **no-reactive-compact** / **manual-compact-ok** / **cousins**. Primary: [anthropics/claude-code#92434](https://github.com/anthropics/claude-code/issues/92434).

Fixtures record the published token counts, error string, 200k-window threshold, and pathless-rules repro. No live resume. No secrets.

| File | Verdict | What it scores |
|---|---|---|
| `overladen.json` | overladen | Idle dry-dock. Yesterday's chalk mark; fresh hold already aboard. |
| `trimmed.json` | trimmed | Seeded hold. Load line evaluated against the request as it will actually be sent. |
| `92434.json` | overladen | Primary fixture alias for #92434. |
| `stale-previous-count.json` | stale-previous-count | Auto-compact consults previous-turn reported tokens. |
| `reinject-jump.json` | reinject-jump | ~646k → 1043785 (> 1000000); jump ~398k. |
| `no-reactive-compact.json` | no-reactive-compact | 400 `prompt is too long`; no compaction attempted. |
| `manual-compact-ok.json` | manual-compact-ok | Manual `/compact` immediately afterwards succeeds. |
| `cousins.json` | cousins | Cite-only #91709 #85489. |
| `fixtures.json` | index | Row list for the draught board. |

Drop any file onto `projects/plimsoll/index.html` or paste the JSON. The living page admits **overladen** / stale previous-turn mark / #92434.

Repro in the issue is 40 pathless rules under `.claude/rules/`, work near the auto-compact threshold, exit, resume, short message. This assay does not run that resume.

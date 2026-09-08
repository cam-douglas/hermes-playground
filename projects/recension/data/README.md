# Recension fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92949 issue facts: after an auto-compaction, the CLAUDE.md / MEMORY.md content re-injected into context is the copy captured at the last user prompt, not the on-disk file. Disk is consulted only when the next user prompt arrives. Score stereotyped or admit collated.

Idle word: **collated**. Path word: **stereotyped**. Seeded late-correct: **emended**. HOLD: **collated**. ALARM: **stereotyped** / **emended** / **compact-boundary** / **last-prompt-witness** / **disk-exemplar** / **late-refresh** / **user-level** / **auto-memory** / **cousins** / **before-after** / **fixtures**. Primary: [anthropics/claude-code#92949](https://github.com/anthropics/claude-code/issues/92949).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No Desktop hooks. No patch to anthropics/claude-code. Not Mirage/#92920 (renderer-ack oasis). Not Palimpsest (scraped undertext — different bug). Not Setoff/#92750 (MEMORY on subagent first request). Not Rubric/#92855 (TUI list renumber).

| File | Verdict | What it scores |
|---|---|---|
| `collated.json` | collated | Idle desk. HOLD: auto-compact re-reads disk; witness matches exemplar. |
| `stereotyped.json` | stereotyped | Seeded #92949 path. ALARM: 22:49 compact reprints last-prompt D; disk is F. |
| `92949.json` | stereotyped | Primary fixture alias for #92949. |
| `emended.json` | emended | 22:52 user prompt `changed:true reason:compaction`; F from disk; correct but late. |
| `timeline.json` | stereotyped | Published A–F table; compact vs prompt hash rows. |
| `compact-boundary.json` | compact-boundary | `instructions` attachment at `compact_boundary`; `changed` absent. |
| `last-prompt-witness.json` | last-prompt-witness | In-memory snapshot from the last user prompt. |
| `disk-exemplar.json` | disk-exemplar | On-disk F; docs say "Re-injected from disk". |
| `late-refresh.json` | late-refresh | Refresh works; deferred to the next user prompt. |
| `user-level.json` | user-level | `~/.claude/CLAUDE.md` 3060-char 21:37 copy at 21:55 compact. |
| `auto-memory.json` | auto-memory | `MEMORY.md` same last-prompt witness pattern. |
| `cousins.json` | cousins | Cite-only #91243 #88886 #87937 #88023 — do not clone. |
| `before-after.json` | before-after | Before stereotyped D/F; after expected collated F/F. |
| `fixtures.json` | fixtures | Row list for the collation desk. |

Drop any file onto `projects/recension/index.html`. Buttons load the seeded path. The living page admits **collated** / idle desk / #92949.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

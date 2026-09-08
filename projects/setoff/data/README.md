# Setoff fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92750 issue facts: subagent first requests carry MEMORY.md + skill_listing attachments contrary to docs. Score laden or admit shed.

Idle word: **lean**. Seeded word: **laden**. HOLD: **lean** / **shed**. ALARM: **laden** / **memory-attached** / **skill-listing** / **custom-agent-unchanged** / **allowlist-residual** / **token-table** / **docs-vs-measured** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92750](https://github.com/anthropics/claude-code/issues/92750).

Fixtures record the published incident (MEMORY.md as `instructions`; `skill_listing` ~49 skills; custom agents and tool allowlists still transfer the pair). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `lean.json` | lean | Idle tympan. HOLD: neither memory instructions nor skill_listing on the first request. |
| `laden.json` | laden | Seeded #92750 path. ALARM: MEMORY.md + skill_listing transferred onto the facing sheet. |
| `shed.json` | shed | Admit hold. Hypothetical strip of auto-memory + skill_listing; halo wiped. |
| `92750.json` | laden | Primary fixture alias for #92750. |
| `memory-attached.json` | memory-attached | MEMORY.md (~19,850 chars) as `instructions` attachment. |
| `skill-listing.json` | skill-listing | `skill_listing` (~24–26k chars, ~49 skills). |
| `custom-agent-unchanged.json` | custom-agent-unchanged | Custom agent replaces system prompt; memory+skills+CLAUDE.md unchanged. |
| `allowlist-residual.json` | allowlist-residual | 8-tool allowlist still 27,832; residual ~24k. |
| `token-table.json` | token-table | 45,907 / 33,244 / 27,832 cold tokens. |
| `docs-vs-measured.json` | docs-vs-measured | Docs say not loaded; measured first request carries both. |
| `cousins.json` | cousins | Prefer none. No verified cite-only cousins about subagent context. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the set-off bench. |

Drop any file onto `projects/setoff/index.html` or paste the JSON. The living page admits **lean** / idle tympan / #92750.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

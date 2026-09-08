# Mirage fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92920 issue facts: renderer ack without a session, then `Cleared stale pending dispatch`, with `lastRunAt` stamped anyway. Score miraged or admit confirmed.

Idle word: **confirmed**. Path word: **miraged**. HOLD: **confirmed**. ALARM: **miraged** / **late-confirm** / **stale-clear** / **lastrun-lie** / **overnight-loss** / **cousins** / **before-after** / **jitter-delay** / **global-limit** / **fixtures**. Primary: [anthropics/claude-code#92920](https://github.com/anthropics/claude-code/issues/92920).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No Desktop hooks. No patch to anthropics/claude-code. Not Remora/#92934 (PostToolUse child cling). Not Oubliette. Not Ukase/#92833.

| File | Verdict | What it scores |
|---|---|---|
| `confirmed.json` | confirmed | Idle observatory. HOLD: spawn → ack → confirmed within ~1s. |
| `miraged.json` | miraged | Seeded #92920 path. ALARM: renderer ack, no session, stale clear, lastRunAt lie. |
| `92920.json` | miraged | Primary fixture alias for #92920 (`voc-weekly-incremental`). |
| `late-confirm.json` | late-confirm | `morning-checkin-daily` confirmed 72 min late after stale clear. |
| `stale-clear.json` | stale-clear | `Cleared stale pending dispatch` for `daily-reading`; never ran. |
| `lastrun-lie.json` | lastrun-lie | lastRunAt `2026-09-08T09:21:00Z` with no session. |
| `overnight-loss.json` | overnight-loss | 3 of 18 lost; 14 healthy triples; 1 late. |
| `cousins.json` | cousins | Cite-only #74432 #73927 #76304 #77596 #60144 — do not clone. |
| `before-after.json` | before-after | Before miraged; after expected confirmed triple. |
| `jitter-delay.json` | jitter-delay | 265s jitter confounder — not the defect. |
| `global-limit.json` | global-limit | Concurrency cap confounder — lost tasks were acknowledged. |
| `fixtures.json` | fixtures | Row list for the desert observatory bench. |

Drop any file onto `projects/mirage/index.html`. Buttons load the seeded path. The living page admits **confirmed** / idle observatory / #92920.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

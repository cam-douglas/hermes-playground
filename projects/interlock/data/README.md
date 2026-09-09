# Interlock fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92976 issue facts: Desktop 1.49585.0 (Linux) refuses Dispatch `start_code_task` after the UI warms a finished session; stale records with no live query no longer block; a warmed idle `query` plus hardcoded `exclusiveCwd` interlocks the cwd. Score interlocked or admit passable.

Idle word: **passable**. Path word: **interlocked**. Seeded recover: **detached**. HOLD: **passable**. ALARM: **interlocked** / **detached** / **stale-records-fixed** / **ui-warm-relock** / **query-present-idle** / **warm-lifecycle-when-hidden** / **exclusivecwd-hardcoded** / **concurrent-local-ok** / **dispatch-only-block** / **timeline** / **cifs-non-git** / **no-archive-tool** / **error-already-active** / **cousins** / **before-after** / **fixtures**. Primary: [anthropics/claude-code#92976](https://github.com/anthropics/claude-code/issues/92976).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No Desktop automation. No patch to anthropics/claude-code. Not Shibboleth/#92966 (GrowthBook Invalid API Key). Not Homestead/#92932 (HOME rg TCC hang). Not #91745 / #92452 / #92462 (cite only).

| File | Verdict | What it scores |
|---|---|---|
| `passable.json` | passable | Idle booth. HOLD: folder open for Dispatch; no live query. |
| `interlocked.json` | interlocked | Seeded #92976 path. ALARM: UI-warm idle query + exclusiveCwd. |
| `92976.json` | interlocked | Primary fixture alias for #92976. |
| `detached.json` | detached | Query released; busy-check only; exclusiveCwd off. |
| `walk.json` | interlocked | Published 10:28 → 10:43 success → 10:55 warm → 11:15 fail walk. |
| `stale-records-fixed.json` | stale-records-fixed | No-query records skipped; 200 non-archived no longer block. |
| `ui-warm-relock.json` | ui-warm-relock | Code tab warm re-attaches CLI. |
| `query-present-idle.json` | query-present-idle | Query truthy, no turn in flight. |
| `warm-lifecycle-when-hidden.json` | warm-lifecycle-when-hidden | 900s/1800s timers only while hidden. |
| `exclusivecwd-hardcoded.json` | exclusivecwd-hardcoded | exclusiveCwd:!0 on Dispatch only. |
| `concurrent-local-ok.json` | concurrent-local-ok | Four sessions share the folder. |
| `dispatch-only-block.json` | dispatch-only-block | Exclusivity is Dispatch-only. |
| `timeline.json` | timeline | 10:43 success then 10:55 warm then fail. |
| `cifs-non-git.json` | cifs-non-git | CIFS-mounted, not a git repo. |
| `no-archive-tool.json` | no-archive-tool | Dispatch toolset has no archive. |
| `error-already-active.json` | error-already-active | Already active; no close/archive hint. |
| `cousins.json` | cousins | Cite-only #91745 #92452 #92462. |
| `before-after.json` | before-after | Before interlocked; after expected passable. |
| `fixtures.json` | fixtures | Row list for the interlock booth. |

Drop any file onto `projects/interlock/index.html`. Buttons load the seeded path. The living page admits **passable** / idle booth / #92976.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

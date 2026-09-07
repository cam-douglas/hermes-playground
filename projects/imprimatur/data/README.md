# Imprimatur fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92740 issue facts: first Artifact publish under Skip all approvals refuses immediately, demanding an approval card that never renders. Score refused or admit imprinted.

Idle word: **waived**. Seeded word: **refused**. HOLD: **waived** / **imprinted**. ALARM: **refused** / **skip-refuses** / **auto-succeeds** / **no-card-rendered** / **first-publish-gate** / **noninteractive-self-report** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92740](https://github.com/anthropics/claude-code/issues/92740).

Fixtures record the published incident (Skip all approvals first-publish refusal; no card rendered; Automatically approve succeeds; session self-reports non-interactive; live-artifacts regression after 19 August 2026). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `waived.json` | waived | Idle folio. HOLD: Skip would cover Artifact; no first-publish refusal. |
| `refused.json` | refused | Seeded #92740 path. ALARM: Skip first-publish demands a card that never arrives. |
| `imprinted.json` | imprinted | Admit hold. Skip treated like Auto, or gate documented/routed. |
| `92740.json` | refused | Primary fixture alias for #92740. |
| `skip-refuses.json` | skip-refuses | Skip all approvals; first publish fails immediately. |
| `auto-succeeds.json` | auto-succeeds | Automatically approve publishes normally. |
| `no-card-rendered.json` | no-card-rendered | No approval card is ever rendered; refuses at once. |
| `first-publish-gate.json` | first-publish-gate | First publish needs the approval card; live-artifacts regression. |
| `noninteractive-self-report.json` | noninteractive-self-report | Session reported non-interactive; OAuth cannot run. |
| `cousins.json` | cousins | Cite-only #88997, #89967, #91883. Primary stays #92740. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the stamp desk. |

Drop any file onto `projects/imprimatur/index.html` or paste the JSON. The living page admits **waived** / idle Skip would cover Artifact / #92740.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

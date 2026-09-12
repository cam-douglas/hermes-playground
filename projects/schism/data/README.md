# Schism fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93797 issue facts: SendMessage to a LIVE Workflow agent resumes a second copy from its transcript ("Resuming agent") while the original keeps running inside the workflow. Score schism or admit live.

Idle word: **live**. Path word: **resume-while-live**. Seeded loss: **schismed**. Product: **schism**. HOLD: **live**. ALARM: **schismed** / **schism** / **resume-while-live** / **dual-writer** / **resuming-banner** / **local-agent-copy** / **workflow-progress-only** / **four-lane-dup** / **conflicting-edits**. Primary: [anthropics/claude-code#93797](https://github.com/anthropics/claude-code/issues/93797).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code.

| File | Verdict | What it scores |
|---|---|---|
| `live.json` | live | Idle nave. HOLD: one in-process workflow agent; singular writer; addressable. |
| `hold.json` | hold | HOLD alias for idle live. |
| `schismed.json` | schismed | Seeded #93797 path. ALARM: dual-writer resume while the original still runs. |
| `schism.json` | schism | Product score for the twin-authority nave. |
| `resume-while-live.json` | resume-while-live | Path: resume path does not see the in-process workflow agent as live. |
| `dual-writer.json` | dual-writer | Two writers on the same task and files. |
| `resuming-banner.json` | resuming-banner | Tool result says Resuming agent a55b701. |
| `local-agent-copy.json` | local-agent-copy | Second local_agent copy from persisted transcript. |
| `workflow-progress-only.json` | workflow-progress-only | No own task_started; only workflow_agent in task_progress. |
| `four-lane-dup.json` | four-lane-dup | Four parallel lane agents each got a duplicate writer. |
| `conflicting-edits.json` | conflicting-edits | Conflicting Kotlin/Rust/TS edits after the phase finished. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #91353. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Twin glass / chips / banner fixtures. |
| `walk.json` | walk | Published idle live → schismed walk. |

## Backups (cite only — do NOT auto-pick or build)

#93794 #93788 #93766 #93764 #93754 #93751 #93744 #93772 #93770 #93777 #93782

Drop any file onto `projects/schism/index.html`. Buttons load the seeded path. The living page admits **live** / idle nave / #93797.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

# Clepsydra fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92776 issue facts: OTel `token.usage` / `cost.usage` / `active_time.total` silently stop recording main-loop turns mid-session while the exporter stays healthy and other instruments keep advancing. Score arrested or admit credited.

Idle word: **dripping**. Seeded word: **arrested**. HOLD: **dripping** / **credited**. ALARM: **arrested** / **partial-credit** / **exporter-healthy** / **other-instruments-advance** / **onset-sharp** / **process-age-guess** / **ruled-out-matrix** / **transcript-ground-truth** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92776](https://github.com/anthropics/claude-code/issues/92776).

Fixtures record the published incident (session `53dd124d`; 4/7/8 Sep capture table; sharp onset; five further credits; exporter 15/15m; other instruments advancing; ruled-out matrix). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `dripping.json` | dripping | Idle cistern. HOLD: token and cost drips credited for the whole session. |
| `arrested.json` | arrested | Seeded #92776 path. ALARM: OTel spout arrests mid-session. |
| `credited.json` | credited | Admit hold. Every turn credited for the life of the session. |
| `92776.json` | arrested | Primary fixture alias for #92776. |
| `partial-credit.json` | partial-credit | Five further credits in 2.5h; 50/207 credited; 157 dropped. |
| `exporter-healthy.json` | exporter-healthy | 15 samples / 15m; exporter stays healthy. |
| `other-instruments-advance.json` | other-instruments-advance | LOC / edit / commit keep advancing. |
| `onset-sharp.json` | onset-sharp | Tracks then stops; one request's worth after onset. |
| `process-age-guess.json` | process-age-guess | NON-BINDING process age / cumulative turn count. |
| `ruled-out-matrix.json` | ruled-out-matrix | Restart, sleep, idle, compaction, update, auth, relabel eliminated. |
| `transcript-ground-truth.json` | transcript-ground-truth | Session `53dd124d` vs `message.usage` deduped by `message.id`. |
| `cousins.json` | cousins | Cite-only #33904 CLOSED. Primary stays #92776. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the cistern. |

Drop any file onto `projects/clepsydra/index.html` or paste the JSON. The living page admits **dripping** / idle cistern / #92776.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

# Espagnolette fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92694 issue facts: AskUserQuestion still paints the caret after terminal blur/refocus but selection keys are dead. Score deaf or admit remounted.

Idle word: **attentive**. Seeded word: **deaf**. HOLD: **attentive** / **remounted**. ALARM: **deaf** / **blur-deaf** / **ancestor-live** / **single-deadend** / **remount-recovers** / **isDisabled-signature** / **focus-lost** / **cousins** / **has-clear-repro**. Primary: [anthropics/claude-code#92694](https://github.com/anthropics/claude-code/issues/92694).

Fixtures record the published incident (blur/refocus or idle trigger; subtree keys dead; ancestor Tab/←/→ live; single-question dead-end; remount recovers on multi). No live session. No secrets. No exploit payloads.

| File | Verdict | What it scores |
|---|---|---|
| `attentive.json` | attentive | Idle folio. HOLD: selection keys stay live; caret matches a live prompt. |
| `deaf.json` | deaf | Seeded #92694 path. ALARM: caret still paints; selection keys dead. |
| `remounted.json` | remounted | Admit hold. Remount restores autoFocus; chat-row isDisabled resets. |
| `92694.json` | deaf | Primary fixture alias for #92694. |
| `blur-deaf.json` | blur-deaf | Terminal loses focus and regains it, or prompt sits idle. |
| `ancestor-live.json` | ancestor-live | Tab / ← / → still work; subtree keys dead. |
| `single-deadend.json` | single-deadend | Single-question unanswerable except Ctrl+C. |
| `remount-recovers.json` | remount-recovers | Tab to Submit then back remounts; multi only. |
| `isDisabled-signature.json` | isDisabled-signature | Select isDisabled kills both input paths. From issue analysis. |
| `focus-lost.json` | focus-lost | Root Box lost ink focus. From issue analysis. |
| `cousins.json` | cousins | Cite-only #84489, #86918. Primary stays #92694. |
| `has-clear-repro.json` | has-clear-repro | Issue labeled has repro. |
| `fixtures.json` | index | Row list for the fastener bench. |

Drop any file onto `projects/espagnolette/index.html` or paste the JSON. The living page admits **attentive** / idle keys live / #92694.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

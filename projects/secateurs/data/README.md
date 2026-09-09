# Secateurs fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92979 issue facts: Read of large instruction/rule files (`CLAUDE.md` companions, `.claude/rules`, `--append-system-prompt` targets) can return a silent partial so guardrails in the unread tail are shed. Documented 2,000-line default is not enforced (evidence: a 65,800-character / 1,400-line file reads full with no offset/limit). Score sheared or admit unshorn.

Idle word: **unshorn**. Seeded word: **sheared**. Path word: **secateured**. HOLD: **unshorn** / **hold**. ALARM: **sheared** / **secateured** / **silent-partial** / **unread-tail** / **guardrail-loss** / **no-operator-notice** / **documented-2000-not-enforced** / **full-read-1400** / **lines-x-y-of-z** / **offset-limit** / **has-repro** / **cousins** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#92979](https://github.com/anthropics/claude-code/issues/92979).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Palinode/#92998 (MEMORY.md bottom truncation). Not Ferrule/#92968 (Desktop hardcoded 53280). Not Interlock/#92976. Not leftover woodworking / mm-slider.

| File | Verdict | What it scores |
|---|---|---|
| `unshorn.json` | unshorn | Idle booth. HOLD: whole file, or showing lines X–Y of Z. |
| `sheared.json` | sheared | Seeded #92979 path. ALARM: silent tip-cut sheds unread tail. |
| `92979.json` | sheared | Primary fixture alias for #92979. |
| `secateured.json` | secateured | Path word: a secateurs snip without an audible mark. |
| `hold.json` | hold | HOLD alias: whole cane, or marked cut. |
| `walk.json` | walk | Published full-read-1400 → silent-partial → unread-tail → guardrail-loss → no-operator-notice. |
| `silent-partial.json` | silent-partial | Larger files return partial content with no marker. |
| `unread-tail.json` | unread-tail | Model treats partial as whole; drops unread rules. |
| `guardrail-loss.json` | guardrail-loss | Safety-relevant; unread instructions silently absent. |
| `no-operator-notice.json` | no-operator-notice | Operator has no indication guardrails never loaded. |
| `documented-2000-not-enforced.json` | documented-2000-not-enforced | Documented 2,000-line default is not applied. |
| `full-read-1400.json` | full-read-1400 | 65,800-char / 1,400-line file reads full. |
| `lines-x-y-of-z.json` | lines-x-y-of-z | Ranked ask: structured truncation marker. |
| `offset-limit.json` | offset-limit | Use offset/limit; optional raise ceiling. |
| `has-repro.json` | has-repro | Concrete 2.1.x 1,400-line full read. |
| `cousins.json` | cousins | Cite-only #6910 #28783 #22699 CLOSED. |
| `fixtures.json` | fixtures | Row list for the secateurs booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for unshorn vs sheared. |

Drop any file onto `projects/secateurs/index.html`. Buttons load the seeded path. The living page admits **unshorn** / idle booth / #92979.

Probes are diagnostic reconstructions of the issue's published facts. This assay does not run Claude.

# Nameplate fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94349 issue facts: VS Code header rename shows the new session title for one frame then reverts because `query.renameSession` is missing on the SDK query class (sync TypeError escapes before `.catch`; `renameBaseline` rolls back) while the title is already persisted and list-rename works. Score nameplate or admit affixed.

Idle word: **affixed**. Path word: **header-rename**. Seeded loss: **nameplate**. Product: **nameplate**. HOLD: **affixed**. ALARM: **nameplate** / **header-rename** / **typeerror-escape**. Primary: [anthropics/claude-code#94349](https://github.com/anthropics/claude-code/issues/94349).

Fixtures record the published incident only. Header-rename rows are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `affixed.json` | affixed | Idle plate. HOLD: header rename sticks. |
| `hold.json` | hold | HOLD alias for idle affixed. |
| `nameplate.json` | nameplate | Seeded #94349 path and product. ALARM: plate snaps back. |
| `94349.json` | nameplate | Same seeded path under the issue number. |
| `header-rename.json` | header-rename | Path: header-only snap-back. |
| `engraved.json` | engraved | HOLD alias: new cut holds. |
| `hung.json` | hung | HOLD alias: plate stays hung. |
| `plated.json` | plated | HOLD alias: brass holds. |
| `labeled.json` | labeled | HOLD alias: card labeled. |
| `titled.json` | titled | HOLD alias: title sticks. |
| `typeerror-escape.json` | typeerror-escape | Sync TypeError; `.catch` never attaches. |
| `rename-baseline-rollback.json` | rename-baseline-rollback | Store restores the old title. |
| `list-rename-ok.json` | list-rename-ok | Activity-bar list keeps the new name. |
| `persisted-on-reload.json` | persisted-on-reload | Reload shows the new name. |
| `header-one-frame.json` | header-one-frame | New name for one frame, then revert. |
| `landing.json` | landing | Brass nameplate / hotel door-plate. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | None named in #94349; cite-only related. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Brass plate / mahogany door. |
| `walk.json` | walk | Published idle affixed → header-rename → nameplate. |
| `closed.json` | closed | #94349 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

No close cousins named in the #94349 issue text. Related rename/session-title issues found by search — do NOT rebuild. Do NOT conflate.

#94017 — renamed sessions revert to the auto-generated title (ai-title rewritten). DIFFERENT mechanism.

#94257 — renaming a session tab reverts to old name on Enter. Similar snap-back, less detail.

#94285 — live session tabs ignore the saved custom title and show the AI title. DIFFERENT.

#88992 — sidebar pencil rename doesn't sync with /rename. DIFFERENT.

#94349 is specifically: header rename one-frame revert; `query.renameSession` missing; sync TypeError; `renameBaseline` rollback; title persisted; list-rename works.

## Backups (cite only — do NOT auto-pick or build)

#93924 #93770 #93777 #94151 #94348 #94336 (Agraphia cousin — do not ship)

Drop any file onto `projects/nameplate/index.html`. Buttons load the seeded path. The affixed page admits **affixed** / idle plate / #94349.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

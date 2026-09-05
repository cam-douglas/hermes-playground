# Macule hook

Tiny letterpress / proofing-press classifier notes for the Claude Code defect where a validation-failed `mcp__visualize__show_widget` call still renders, then a same-title retry accumulates a persistent duplicate widget card. Schema lists `required: ["loading_messages"]` only (title optional); backend requires title and throws MCP `-32602`. OPEN. Labels: bug, has repro, platform:macos, area:mcp, area:ui.

Idle word is **single**. Seeded state is maculed / #92294 (failed call already printed a ghost card; retry printed a second; two cards remain). Never idle as stilled / rung / barred / dropped / pared / raw / cast / fouled / flowing / snubbed / matched / warded / lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / careted / ringing / home / indexed / jumped.

This stub is documentation only. The living page at `projects/macule/index.html` scores probes in-browser. No npm. No secrets. No real hooks. No exploits. Diagnostic shapes only (show_widget args, -32602 validation error, title omit/include, duplicate cards, schema required list). No payloads.

Preferred fix / detection (document only — do not treat this stub as a live hook):

1. Schema should mark `title` required OR backend accept missing title.
2. Validation failure must never render UI.
3. Retry with the same title must not accumulate a second card.

Detection: if `mcp__visualize__show_widget` is called with widget_code + loading_messages and title omitted, the backend returns `-32602` invalid_type path title, a widget card still renders, a retry with the same title succeeds, and two "Widget from visualize show_widget" cards remain, the sheet is already maculed.

Given a probe-shaped payload `{ tool, schemaRequired, schemaTitleOptional, backendTitleRequired, titleOmitted, titleIncluded, validationError, errorCode, errorPath, failedCallRendered, retrySameTitle, cardCount, ghostPersisted, duplicate, persistHold, log }`:

- **SINGLE** if one card and the validation failure never printed
- **MACULED** if the failed call printed a ghost and the same-title retry printed a second (#92294)
- **GHOSTED** if failed validation still rendered a widget card
- **VALIDATED** if the retry with title included succeeded
- **MISMATCHED** if schema lists title optional and backend requires title
- **RETRIED** if the same title was pulled again after the failed pull
- **PERSISTED** if the ghost remains alongside the success card
- **CLEARED** if validation failure never rendered UI
- **SCHEMA** if the declared required list is `["loading_messages"]` only
- **BACKEND** if the backend threw MCP `-32602` when title was missing

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the sheet is single or already maculed.

Primary: [anthropics/claude-code#92294](https://github.com/anthropics/claude-code/issues/92294). Cousins (cite only, not primary): [#53030](https://github.com/anthropics/claude-code/issues/53030) widget-then-disappear on HTTP 400 (transient); [#60052](https://github.com/anthropics/claude-code/issues/60052) deferred MCP first-call validation / ToolSearch.

Hypothesis only (NON-BINDING): the interactive desk should make "validation-failed show_widget still prints, then same-title retry doubles the sheet" visceral via two overlapping impressions. Discard if issue evidence disagrees. Do not claim unseen source.

NOT leftover Alarum indigo night watchtower · Portcullis castle grate · Skive leather tannery · Lagan salvage-buoy · Snub dockside snubbing post · Ward locksmith iron/brass · Deadlight night-cabin shutter · Oubliette stone-pit · Ephemera wick-lit folio. Product name stays Macule.

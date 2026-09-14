# Thimblerig fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94174 / #85439 issue facts: hiding skills makes `/context` Skills go down and System tools go up 1:1; total stuck at 27.1k. Score thimblerig or admit additive.

Idle word: **additive**. Path word: **skill-row-carve**. Seeded loss: **thimblerig**. Product: **thimblerig**. HOLD: **additive**. ALARM: **thimblerig** / **skill-row-carve** / **row-trade** / **frozen-total**. Primary: [anthropics/claude-code#94174](https://github.com/anthropics/claude-code/issues/94174).

Fixtures record the published incident only. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `additive.json` | additive | Idle board. HOLD: Skills on top; tally a true sum. |
| `hold.json` | hold | HOLD alias for idle additive. |
| `thimblerig.json` | thimblerig | Seeded #94174 path and product. ALARM: cups trade. |
| `skill-row-carve.json` | skill-row-carve | Path: `/context` carves Skills from tools. |
| `honest-total.json` | honest-total | HOLD alias: chalk total is a true sum. |
| `settled.json` | settled | HOLD alias: cups stay still; pea counted on top. |
| `true-sum.json` | true-sum | HOLD alias: total moves when you trim skills. |
| `skills-additive.json` | skills-additive | HOLD alias: Skills row counted on top of System tools. |
| `account-true.json` | account-true | HOLD alias: System tools show the real tool-definition size. |
| `frozen-total.json` | frozen-total | A/B/C totals all 27.1k. |
| `row-trade.json` | row-trade | Skills↓ System tools↑ 1:1. |
| `carved-listing.json` | carved-listing | tools − skill listing; listing never in tools. |
| `baseline-a.json` | baseline-a | Skills 3.9k (49); tools 18k; total 27.1k. |
| `disable-invocation-b.json` | disable-invocation-b | Skills 2.8k (22); tools 19.1k; total 27.1k. |
| `disable-bundled-c.json` | disable-bundled-c | Skills 800 (7); tools 21.1k; total 27.1k. |
| `reporting-lie.json` | reporting-lie | `/context` display lies; payload really shrinks. |
| `payload-shrinks.json` | payload-shrinks | hiding skills shrinks what is sent. |
| `landing.json` | landing | Canvas tent / walnut board / three cups / chalk tally. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #85439 #92255 #92877 #92881 #87281. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Canvas tent / walnut board / three cups / chalk tally. |
| `walk.json` | walk | Published idle additive → skill-row-carve → thimblerig. |

## Cousins (cite only)

Different surfaces/mechanisms from #94174 /context skill-row-carve (except #85439, the same bug, closed stale). Do NOT rebuild. Do NOT conflate.

#85439 — original closed-stale report (same bug). Auto-closed 2026-09-13 despite `reproduced` + maintainer confirmation.

#92255 — MCP schemas still consuming after disable. Different.

#92877 — /context dollar cost feature. Different.

#92881 — /context min-token threshold feature. Different.

#87281 — background job missing skills listing reminder. Different.

#94174 is specifically: /context carves Skills from a tools row that never contained the listing; total frozen at 27.1k.

## Backups (cite only — do NOT auto-pick or build)

#94029 #93987 #93924 #93770 #93777 #94059 #94053 #94151 #94064

Drop any file onto `projects/thimblerig/index.html`. Buttons load the seeded path. The additive page admits **additive** / idle board / #94174.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

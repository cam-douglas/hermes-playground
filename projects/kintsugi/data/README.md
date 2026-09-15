# Kintsugi fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94451 issue facts: `known_marketplaces.json` is never repaired once invalid — one entry missing `lastUpdated` (or a parse error) disables plugins from every marketplace, and the reconciler, marketplace add and marketplace remove all fail re-reading it. Score kintsugi or admit mended.

Idle word: **mended**. Path word: **heal-abort**. Seeded loss: **kintsugi**. Product: **kintsugi**. HOLD: **mended**. ALARM: **kintsugi** / **heal-abort** / **treat-as-empty**. Primary: [anthropics/claude-code#94451](https://github.com/anthropics/claude-code/issues/94451).

Fixtures record the published incident only. Request reconstructions are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `mended.json` | mended | Idle bench. HOLD: quarantine+rebuild or per-entry validate. |
| `kintsugi.json` | kintsugi | Seeded #94451 path and product. ALARM: heal-abort miss. |
| `94451.json` | kintsugi | Same seeded path under the issue number. |
| `heal-abort.json` | heal-abort | Path: rebuild is attempted; the writer aborts. |
| `healed.json` | healed | HOLD alias: per-entry validate keeps the rest. |
| `gilded.json` | gilded | HOLD alias: gold set on the crack. |
| `fused.json` | fused | HOLD alias: corrupt vessel moved aside and rebuilt. |
| `lastUpdated-missing.json` | lastUpdated-missing | One entry missing `lastUpdated` rejects the whole file. |
| `parse-error.json` | parse-error | Truncated file; JSON Parse error: Unterminated string. |
| `treat-as-empty.json` | treat-as-empty | Reconciler treats as empty; rebuild never lands. |
| `rewrite-abort.json` | rewrite-abort | Writer re-reads the same invalid file and aborts. |
| `marketplace-remove.json` | marketplace-remove | Remove fails re-reading the invalid file. |
| `marketplace-add.json` | marketplace-add | Add fails re-reading the invalid file. |
| `plugin-list-lie.json` | plugin-list-lie | List reports ✔ enabled while launch loads zero. |
| `kiln.json` | treat-as-empty | Six-row kiln log fixture. |
| `landing.json` | landing | Urushi / gold seam / broken ceramic / kiln / repair-bench. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousins. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Cracked vessel / gold seam / kiln bench. |
| `walk.json` | walk | Published idle mended → heal-abort → kintsugi. |
| `closed.json` | closed | #94451 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#84501 — UTF-8 BOM trigger. DIFFERENT.

#19065 — zero-byte hang. DIFFERENT.

#56967 — trailing comma writer. DIFFERENT.

#94516 — marketplace refresh stale content. DIFFERENT.

#94452 — directory marketplace dead `installLocation`. DIFFERENT.

#94451 is specifically: `known_marketplaces.json` never repaired once invalid; one bad entry poisons all; reconciler heal-abort on rewrite.

## Backups (cite only — do NOT auto-pick or build)

#94430 #94458 #93924 #93770 #93777 #94151 #94496 #94499 #94522 #94520 #94509 #94507 #94547 #94546 #94530

Drop any file onto `projects/kintsugi/index.html`. Buttons load the seeded path. The bench admits **mended** / idle desk / #94451.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

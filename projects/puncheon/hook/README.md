# Puncheon hook

Tiny goldsmith / pewterer puncheon-rack assay for BOM-less UTF-8 `.ps1` on Windows PowerShell 5.1. The Write tool emits `.ps1` as UTF-8 **without** a BOM. `powershell.exe` 5.1 reads BOM-less as machine ANSI (CP1252). Em dash U+2014 is UTF-8 `E2 80 94`; byte `0x94` in CP1252 is U+201D, a right double quotation mark. PowerShell accepts smart quotes as string delimiters → `The string is missing the terminator: "`.

This hook **does not require Windows PowerShell 5.1**. It builds fixtures as raw bytes, decodes BOM-less files as CP1252, and with-BOM files as UTF-8 after stripping `EF BB BF`. A tiny PS-like scanner applies the string-delimiter rule.

Idle word is **hallmarked**. Seeded state is misstruck / #90962. Never idle as "puncheon" / "misstruck" / "bom" / "utf" / "quote" / "powershell" / "gnomon" / "pointed" / "collapsed" / "spoiled" / "banked" / "traced" / "struck" / "torn".

```bash
node projects/puncheon/hook/puncheon.mjs --table
node projects/puncheon/hook/puncheon.mjs projects/puncheon/data/90962.json
node projects/puncheon/hook/puncheon.mjs projects/puncheon/data/hallmarked.json
echo '{"seed":"misstruck"}' | node projects/puncheon/hook/puncheon.mjs
node --test projects/puncheon/hook/puncheon.test.mjs
```

Empty stdin uses the idle **hallmarked** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `hold`, `alarm`, `idleWord`. `--table` prints the twelve-row assay.

- **HALLMARKED** if BOM `EF BB BF` is present, or the file is ASCII-only — punches sit, scripts parse
- **MISSTRUCK** if the em-dash puncheon struck a quote into the gold (#90962)
- **NO-BOM** if first bytes are not `EF BB BF`
- **MOJIBAKE-QUOTE** if CP1252 `0x94` became U+201D
- **EM-DASH** if U+2014 / `E2 80 94` is on the sheet
- **CP1252** if PS 5.1 assayed the metal as ANSI
- **PARSER-ERROR** if the tokenizer reports a missing terminator
- **SILENT-SCHEDULE** if a BROKEN tile is scheduled: `0x80070001`, `logExists=false`, `history=completed`
- **0x80070001** if Task Scheduler reports incorrect function
- **PER-EXTENSION** if the fix is keyed on file type, not a blanket BOM
- **OPPOSITE-BOM** if `agent.md` starting `EF BB BF` is silently skipped (#73158)
- **PS51-ANSI** if BOM-less non-ASCII is decoded as ANSI (RISK when comments / emoji only)
- **STRING-TERMINATOR** if smart quotes close a string early
- **TASK-SUCCESS** if history shows action completed while the script never ran

Assay grades on raw bytes: **BROKEN** / **RISK** / **OK** / **SKIPPED** / **REGISTERED** / **silent-schedule**.

Primary: [anthropics/claude-code#90962](https://github.com/anthropics/claude-code/issues/90962). Same-class (not primary): [#73158](https://github.com/anthropics/claude-code/issues/73158) opposite-bom, [#58545](https://github.com/anthropics/claude-code/issues/58545) CLOSED dup, [#28316](https://github.com/anthropics/claude-code/issues/28316) CLOSED dup, [yiliangs/agent-usage-stat#116](https://github.com/yiliangs/agent-usage-stat/issues/116), [#13363](https://github.com/anthropics/claude-code/issues/13363), [npm/cmd-shim#177](https://github.com/npm/cmd-shim/issues/177), [#43024](https://github.com/anthropics/claude-code/issues/43024) (prior understated). Contrast: per-extension BOM on scripts, strip BOM on agent defs.

NOT Gnomon / Spoil / Trammel / Soundpost / Flong / Bulla. 16/67 and four-day numbers are narrative, not fixture counts.

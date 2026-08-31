# Puncheon

A **goldsmith / pewterer's puncheon rack** — steel hallmark punches over a gold sheet; Cinzel + Outfit + Spline Sans Mono; walnut bench, leaf gold, pewter rail, oxblood dent — for a real Claude Code defect: **the Write tool emits `.ps1` as UTF-8 without a BOM**. Windows PowerShell 5.1 (`powershell.exe`, not `pwsh` 7) reads BOM-less as machine ANSI. Measured Win11 26200, `powershell.exe` 5.1.22621.6133, ANSI CP 1252. Em dash U+2014 is UTF-8 `E2 80 94`. Byte `0x94` in CP1252 is U+201D right double quotation mark. PowerShell accepts smart quotes as string delimiters → `The string is missing the terminator: "`. Under Task Scheduler: result `0x80070001`, no transcript, no log, task history shows action completed. Two repair scripts sat scheduled four days; every status surface said armed; ran zero times.

Primary:

- [anthropics/claude-code#90962](https://github.com/anthropics/claude-code/issues/90962) (OPEN, bug + has-repro, platform:windows, area:tools, filed 2026-08-31T11:01:52Z by tonydzi / Anton Dziatkovskii; AI agent mycroft filing). Title: [BUG] Windows: Write tool emits .ps1 without a BOM; PowerShell 5.1 parses it as ANSI and a mojibake quote kills the script - silently when scheduled (0x80070001, no log).

An unstruck mark is not a hold. Score the gold or admit **hallmarked**.

Idle word: **hallmarked**. Seeded state: **misstruck** / #90962 — `Write-Host "report — nightly"` UTF-8 no BOM; first bytes are not `EF BB BF`; CP1252 `0x94` = U+201D. Never idle as "puncheon" / "misstruck" / "bom" / "utf" / "quote" / "powershell" / "gnomon" / "pointed" / "collapsed" / "spoiled" / "banked" / "traced" / "struck" / "torn".

A puncheon is the punch that strikes the mark; the UTF-8 BOM is the mark that tells the reader this is UTF-8. Without it, PowerShell 5.1 assays the metal as ANSI and the em-dash strike comes out a quotation mark.

- **hallmarked** = hold: BOM `EF BB BF` present, or ASCII-only; punches sit; scripts parse
- **misstruck** = #90962 primary — em-dash puncheon struck a quote into the gold
- **no-bom** = first bytes are not `EF BB BF`
- **mojibake-quote** = CP1252 `0x94` became U+201D
- **em-dash** = U+2014 / `E2 80 94` on the sheet
- **cp1252** = PS 5.1 assayed the metal as ANSI
- **parser-error** = missing string terminator
- **silent-schedule** = scheduled BROKEN tile: `0x80070001`, no log, history completed
- **0x80070001** = Task Scheduler incorrect function
- **per-extension** = BOM on scripts; strip BOM on agent defs — not a blanket
- **opposite-bom** = `agent.md` starting `EF BB BF` is silently skipped (#73158)
- **ps51-ansi** = BOM-less non-ASCII decoded as ANSI (RISK when comments / emoji only)
- **string-terminator** = smart quotes close a string early
- **task-success** = history shows action completed; the script never ran

Verdicts: misstruck, hallmarked, no-bom, mojibake-quote, em-dash, cp1252, parser-error, silent-schedule, 0x80070001, per-extension, opposite-bom, ps51-ansi, string-terminator, task-success.

Fix must be **per file type**: `.ps1` / `.psm1` / `.bat` / `.cmd` on Windows → emit UTF-8 BOM or restrict to ASCII; `.md` / `.json` / agent / skill defs → strip a leading BOM. Blanket always-BOM would break #73158. Their tree: 16 of 67 `.ps1` files are non-ASCII with no BOM (narrative, not a fixture count).

## Why not a clone

This is specifically: **WRITE TOOL UTF-8 NO BOM `.ps1` → PS 5.1 ANSI / CP1252 MOJIBAKE QUOTE / SILENT SCHEDULER `0x80070001`**.

NOT **Gnomon** ([#90954](https://github.com/anthropics/claude-code/issues/90954)) — shared mtime closed transcripts.
NOT **Spoil** ([#90943](https://github.com/anthropics/claude-code/issues/90943)) — stale private `GIT_INDEX_FILE`.
NOT **Trammel** ([#90936](https://github.com/anthropics/claude-code/issues/90936)) — VS Code focus ping-pong.
NOT **Soundpost** ([#90926](https://github.com/anthropics/claude-code/issues/90926)) — CLI-resolved LSP vs Desktop-deaf.
NOT **Flong** ([#90916](https://github.com/anthropics/claude-code/issues/90916)) — torn Git Bash snapshot.
NOT **Bulla** ([#90891](https://github.com/anthropics/claude-code/issues/90891)) — papal lead / MSIX integrity.

Different UI: goldsmith puncheon rack over a gold sheet. Walnut, leaf gold, pewter, oxblood. Cinzel + Outfit + Spline Sans Mono. NOT Gnomon Libre Baskerville / IBM Plex Sans / Space Mono slate/brass. NOT Spoil Instrument Serif / Source Serif 4 / JetBrains Mono slag/ochre. NOT Trammel Newsreader / Sora / Red Hat Mono mahogany. NOT Soundpost Fraunces / Source Sans 3 / IBM Plex Mono amber/maple. NOT Flong foundry. NOT Bulla papal seal.

Different verbs: score the gold, pin idle hallmarked, pin seeded misstruck, admit hallmarked. Not "Score the gnomon" / "Pin idle pointed" / "Score the spoil" / "Score the grooves".

Different idle: **hallmarked**.

## Live catalog path

`/puncheon/` is this static goldsmith desk. Demo works with no secrets and no npm. Mark: `21:50 / hermes catalog #95 / #90962`.

1. Idle demo loads **hallmarked** — BOM present or ASCII-only; punches sit.
2. Seed **misstruck** → #90962 ticket: em dash in a double-quoted string, no BOM; CP1252 `0x94` = U+201D; scheduler `0x80070001`.
3. Click a puncheon on the steel rack. Each punch is a fixture (BROKEN / RISK / OK / SKIPPED / REGISTERED / silent-schedule).
4. Hex strip: `E2 80 94` vs CP1252 `0x94` = U+201D.
5. Scheduler plaque: `0x80070001`, no log, "action completed," four-day armed-but-never-ran.
6. Opposite drawer: `agent.md` with BOM is an invisible punch (#73158).
7. **Score the gold** walks the ticket and lights chips on the bench.

## How to score

Open `projects/puncheon/index.html` in a browser, or serve the repo root and visit `/puncheon/` (Vercel rewrite → `/projects/puncheon`). No build step. Optional hook:

```bash
node projects/puncheon/hook/puncheon.mjs --table
node projects/puncheon/hook/puncheon.mjs projects/puncheon/data/90962.json
node projects/puncheon/hook/puncheon.mjs projects/puncheon/data/hallmarked.json
node --test projects/puncheon/hook/puncheon.test.mjs
```

Misstruck seed → misstruck/alarm. Hallmarked seed → hallmarked/hold.

`projects/puncheon/hook/puncheon.mjs` assays raw bytes and classifies a ticket. See `hook/README.md`.

Local fingerprints: `data/90962.json`, `data/misstruck.json`, `data/hallmarked.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/contrast.json`, `data/fixtures.json`. Evidence only from issue facts. Bytes are built in the hook; JSON describes them.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#90962](https://github.com/anthropics/claude-code/issues/90962). Unauthenticated. See `.env.example`.
2. Click puncheons on the steel rack (twelve fixtures).
3. Pin idle hallmarked / pin seeded misstruck / score the gold / admit hallmarked.
4. Hex strip and scheduler plaque.
5. Opposite pewter drawer for #73158.
6. Per-extension contrast plate.

## Sources

- [anthropics/claude-code#90962](https://github.com/anthropics/claude-code/issues/90962) OPEN
- Same-class (BOM mark family, different direction or prior): [#73158](https://github.com/anthropics/claude-code/issues/73158) OPEN — UTF-8 BOM in `~/.claude/agents/*.md` silently prevents registration; [#58545](https://github.com/anthropics/claude-code/issues/58545) CLOSED dup — Write tool UTF-8 no BOM `.ps1` → PS 5.1 UnexpectedToken; [#28316](https://github.com/anthropics/claude-code/issues/28316) CLOSED dup — Write tool UTF-8 no BOM corrupts Windows tools; [yiliangs/agent-usage-stat#116](https://github.com/yiliangs/agent-usage-stat/issues/116) OPEN — PowerShell profile BOM-less UTF-8; [#13363](https://github.com/anthropics/claude-code/issues/13363); [npm/cmd-shim#177](https://github.com/npm/cmd-shim/issues/177); [#43024](https://github.com/anthropics/claude-code/issues/43024) (prior understated).
- Contrast: per-extension BOM on scripts OR strip BOM on agent defs. Blanket always-BOM would break #73158.

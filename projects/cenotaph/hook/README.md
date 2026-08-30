# Cenotaph hook

Tiny empty-monument scorer for Claude Code's away/return assembler widow. Pipe a probe (`diskUseCount` / `diskResultCount` / `diskDangling` + assembled `server_tool_use` / `advisor_tool_result` + away-summary / teammate / compaction / 400 / resume flags) and get **stood** or **widowed** (or a named nearby class).

Idle word is **stood**. NEVER use stood for a failure.

```bash
node projects/cenotaph/hook/index.mjs < transcript.txt
node --test projects/cenotaph/hook/cenotaph.test.mjs
```

Empty stdin uses the seeded #90771 widowed board. Stdout is JSON: `verdict`, `reasons[]`, `stood`, `alarm`.

Probe shape: `{ diskUseCount, diskResultCount, diskDangling, assembledHasServerToolUse, assembledHasAdvisorResult, assembledResultAtMessageIndex, awaySummaryBetweenOkAnd400, teammateInjection, compactionRecord, subsequentTurn400, coldResumeRecovers, advisorDisabled, specimens }` → `{ verdict, reasons[], stood, alarm }`.

Primary: [anthropics/claude-code#90771](https://github.com/anthropics/claude-code/issues/90771). Contrast class (on-disk JSONL interleave — cite, do not treat as this product): [#50527](https://github.com/anthropics/claude-code/issues/50527) / [#63375](https://github.com/anthropics/claude-code/issues/63375) / [#65938](https://github.com/anthropics/claude-code/issues/65938) / [#86198](https://github.com/anthropics/claude-code/issues/86198) / [#63553](https://github.com/anthropics/claude-code/issues/63553). Those corrupt the file. #90771 disk is consistent; the CLIENT ASSEMBLER after away/return widows the result.

NOT Sigil / Suture / Coda / Husk / Palimpsest / Waif / Fetch / Livery / Pinfold / Assay / Blot.

Slack alarm on widowed / bricked / vacant / use-dropped / pair-split / away-summary / teammate-injected. Linear ticket on widowed / bricked / vacant.

Ask: re-assembly should drop an `advisor_tool_result` together with its `server_tool_use` (or keep both) so a condensed prefix can never carry an orphaned result.

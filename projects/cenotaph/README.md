# Cenotaph

A Portland-stone **empty monument** — granite rain, bronze wreath, vacant sarcophagus, poppy crimson, carved names that fall off the wall when history is condensed — for a real Claude Code defect: after away/return (or teammate-message injection) **re-assembly**, the client keeps `advisor_tool_result` as a vacant monument and drops its `server_tool_use`. The transcript JSONL on disk is consistent. The orphan exists only in the request the client assembles. Every subsequent turn 400s. The session is bricked until a cold `claude --resume`.

Primary: [anthropics/claude-code#90771](https://github.com/anthropics/claude-code/issues/90771) (OPEN, filed 2026-08-30T14:45:14Z). Title: Orphaned advisor_tool_result after away/return re-assembly bricks the session with a 400 (4 specimens, Claude Code 2.1.251). Labels: bug, has repro, platform:linux, area:core. Env: Claude Code 2.1.251 on Linux; experimental advisor tool enabled (`CLAUDE_CODE_ENABLE_EXPERIMENTAL_ADVISOR_TOOL`; settings `advisorModel = "opus"`); long-running interactive sessions (~870+ transcript lines).

A vacant monument is not a pair. Score the stone or admit **stood**.

Idle word: **stood** (honest control: assembled request keeps `server_tool_use` and `advisor_tool_result` co-located in one assistant message; condensed prefix never carries a result without its use).
NEVER use stood for a failure. NEVER use the product name or these prior idle words: muted, liveried, penned, underwrit, plated, collated, unheard, passed, squared, bound, girt, sheltered, alongside, seated, credited, level, verbatim, fronted, locked, yanked, caught, posted, bunged, belayed, rove, keyed, housed, beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, heard, clear, paired, empty, mute, idle, silent, flat, kernel, valid, sealed, dry, intact, open, still, loose, even, quiet, cool, latched, upheld, sterling, home.

Verdicts: **stood**, **widowed**, **bricked**, **away-summary**, **teammate-injected**, **on-disk-ok**, **recovered**, **vacant**, **advisor-kept**, **use-dropped**, **pair-split**, **disabled-clears**.

- **stood** = idle / honest pair in assembled request
- **widowed** = #90771 primary: assembled condensed history kept advisor_tool_result and dropped server_tool_use
- **bricked** = every subsequent turn 400s (session unusable from UI)
- **away-summary** = away_summary (+ stop_hook_summary / turn_duration) sits between last OK turn and first 400; no compaction record
- **teammate-injected** = teammate-message injection re-assembly path
- **on-disk-ok** = JSONL on disk consistent (use/result counts match; dangling 0); orphan exists only in assembled request
- **recovered** = cold `claude --resume` recovers the session
- **vacant** = result sits at condensed message index 3 with no preceding server_tool_use
- **advisor-kept** = advisor_tool_result survived condensation
- **use-dropped** = server_tool_use missing from assembled prefix
- **pair-split** = the two blocks are not co-located in one assistant content array
- **disabled-clears** = disabling the advisor tool removes the class

The seeded #90771 board (disk 119/119/0 + assembled result at message index 3 + server_tool_use dropped + away_summary + subsequent 400) is **widowed** (and bricked), never **stood**. Unique nearby flags win their own seeds. Admit does not lie: a widowed probe stays widowed.

## Why not a clone

Different problem: assembled-history widow after away/return (or teammate injection) — disk pair intact, condensed request drops use and keeps result → permanent 400 until cold resume.

NOT **Sigil** (thinking-block signature 400 on resume — hollow thinking + kept signature).
NOT **Suture** (SSE/stream tear / partial turn).
NOT **Coda** (silently dropped assistant text after the model DID run).
NOT **Husk** (hollow headless SUCCESS envelopes, model never ran).
NOT **Palimpsest** (PreToolUse updatedInput whole-replace dropping sibling fields).
NOT **Waif** (orphan Bash process tree after timeout).
NOT **Fetch** (TUI ghost prompt suggestions).
NOT **Livery** (TCC path churn).
NOT **Pinfold** (Defender FileFix EPERM).
NOT **Assay** (tool-arg corruption).
NOT **Blot** (image poison 400).

Different UI: empty war-memorial / Portland-stone cenotaph / vacant sarcophagus / wreath / carved names that fall off the wall when history is condensed. Rain, granite, bronze wreath, poppy crimson, empty-tomb shadow. NOT looking-glass parlor, NOT signature clinic, NOT suture tray, NOT splice desk, NOT threshing floor, NOT foundling home.
Different fonts from Fetch (do NOT use Cormorant Garamond + Manrope + JetBrains Mono). Use Cinzel + Fraunces + IBM Plex Mono.
Different idle: **stood**.

## Contrast class (nearby, not this product)

On-DISK JSONL interleave of local slash-command / system records BETWEEN `server_tool_use` and `advisor_tool_result` (parentUuid chain broken on disk):

- [anthropics/claude-code#50527](https://github.com/anthropics/claude-code/issues/50527) (slash `/color` mid-advisor)
- [anthropics/claude-code#63375](https://github.com/anthropics/claude-code/issues/63375) (`/usage` mid-advisor, repro of stale-closed 50527)
- [anthropics/claude-code#65938](https://github.com/anthropics/claude-code/issues/65938) (`/goal` Stop-hook notice mid-advisor)
- [anthropics/claude-code#86198](https://github.com/anthropics/claude-code/issues/86198) (`/effort` mid-advisor)
- [anthropics/claude-code#63553](https://github.com/anthropics/claude-code/issues/63553) (advisor pair split across messages on resume)

Those corrupt the file. #90771 disk is consistent; the CLIENT ASSEMBLER after away/return widows the result.

## Live catalog path

`/cenotaph/` is this static living memorial. Demo works with no secrets and no npm. Mark: `00:50 Sydney · cenotaph`.

1. Seeded `#90771` **widowed** is already on the stone: disk 119/119/0 + assembled result at message index 3 + `server_tool_use` dropped → **widowed**. Never stood.
2. File **bricked** — every subsequent turn 400s.
3. File **away-summary** — `away_summary` (+ stop_hook_summary / turn_duration) between last OK and first 400; no compaction.
4. File **teammate-injected** — teammate-message injection re-assembly path.
5. File **on-disk-ok** — JSONL consistent; orphan only in the assembled request.
6. File **recovered** — cold `claude --resume` recovers.
7. File **vacant** — result at condensed message index 3 with no preceding `server_tool_use`.
8. File **advisor-kept** — `advisor_tool_result` survived condensation.
9. File **use-dropped** — `server_tool_use` missing from assembled prefix.
10. File **pair-split** — the two blocks are not co-located in one assistant content array.
11. File **disabled-clears** — disabling the advisor tool removes the class.
12. **Stamp** the matching class. Wrong stamps bind the stone. **Admit stood** unlocks only on the honest pair. **Restore · #90771** shows the widowed board.

## Hook

`projects/cenotaph/hook/` scores a probe `{ diskUseCount, diskResultCount, diskDangling, assembledHasServerToolUse, assembledHasAdvisorResult, assembledResultAtMessageIndex, awaySummaryBetweenOkAnd400, teammateInjection, compactionRecord, subsequentTurn400, coldResumeRecovers, advisorDisabled, specimens }` and returns `{ verdict, reasons[], stood, alarm }`. See `hook/README.md`.

```bash
node projects/cenotaph/hook/index.mjs < transcript.txt
node --test projects/cenotaph/hook/cenotaph.test.mjs
```

`stood` is true ONLY when the verdict is stood (idle, or honest control: assembled request keeps `server_tool_use` and `advisor_tool_result` co-located). Seeded 90771 numbers must produce widowed / bricked / `stood=false` / alarm true.

Slack alarm on widowed / bricked / vacant / use-dropped / pair-split / away-summary / teammate-injected. Linear ticket on widowed / bricked / vacant.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90771](https://github.com/anthropics/claude-code/issues/90771) — OPEN, filed 2026-08-30T14:45:14Z. Orphaned `advisor_tool_result` after away/return re-assembly; 4 specimens; Claude Code 2.1.251 on Linux; experimental advisor tool; disk 119/119/0; failing block at assembled message index 3; away_summary between last OK and first 400 (no compaction); earlier specimen after teammate-message injection. Cold `--resume` recovers (validated 2026-08-30). Disabling the advisor tool removes the class.

Contrast (on-disk interleave; cite, do not treat as primary):

- [anthropics/claude-code#50527](https://github.com/anthropics/claude-code/issues/50527)
- [anthropics/claude-code#63375](https://github.com/anthropics/claude-code/issues/63375)
- [anthropics/claude-code#65938](https://github.com/anthropics/claude-code/issues/65938)
- [anthropics/claude-code#86198](https://github.com/anthropics/claude-code/issues/86198)
- [anthropics/claude-code#63553](https://github.com/anthropics/claude-code/issues/63553)

Ask: re-assembly should drop an `advisor_tool_result` together with its `server_tool_use` (or keep both) so a condensed prefix can never carry an orphaned result.

## Env

| Variable | Meaning |
| --- | --- |
| `CENOTAPH_SLACK_WEBHOOK` / `SLACK_WEBHOOK` | Unused at page runtime. Absent → honest demo. |
| `CENOTAPH_GITHUB_TOKEN` / `GITHUB_TOKEN` | Unused at page runtime. |
| `CENOTAPH_LINEAR_KEY` / `LINEAR_API_KEY` | Unused at page runtime. |

Missing secrets stay in honest demo mode. The static page does not need them.

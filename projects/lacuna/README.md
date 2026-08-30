# Lacuna

A scriptorium **collation desk** — stacked vellum quires, ghost rectangles where leaves are wanting, a brass type-high watermark rule engraved with the last issued id, a TaskList slip that reads "No tasks found", iron-gall ink, oxidized verdigris, lampblack, raw vellum, oak — for a real Claude Code defect: every `<id>.json` under `~/.claude/tasks/<session-id>/` is silently unlinked mid-session, `.highwatermark` is written with the last id issued, TaskList then reports "No tasks found" (indistinguishable from a session that never created a task), and TaskCreate allocates from `.highwatermark + 1` so new ids resume past the vanished ones. Across 473 session dirs, 7 show this truncated shape; in every one the lowest surviving id equals `.highwatermark + 1`. Intact sessions have `1.json` and NO `.highwatermark` at all — the counter file is the fingerprint of the wipe. No error is emitted.

Primary: [anthropics/claude-code#90709](https://github.com/anthropics/claude-code/issues/90709) (OPEN, filed 2026-08-30). Title: [TaskList] Task store silently cleared mid-session; new ids resume past the gap. Labels: bug / has-repro / platform:macos / area:core. Observed on 2.1.245; CLI now 2.1.251.

A watermark is not a gathering. Score the desk or admit **collated**.

Idle word: **collated** (honest control: store complete, TaskList truthful, no orphan `.highwatermark`).
NEVER use collated for a failure. NEVER use the product name lacuna / palimpsest / quoin / ambo / pulpit / lectern / nave / slype / tally / pale / chatelaine / byline / cubby / ullage / veto / husk / empty / silent / mute / idle / unheard / passed / squared / bound / girt / sheltered / alongside / seated / credited as the idle/state word.

Verdicts: **collated**, **scraped**, **gapped**, **watermarked**, **resumed-past**, **vanished**, **intact**, **counterfeit-empty**, **skipped**, **delayed-wipe**. Slack chip + Linear ticket on scraped / gapped / watermarked / resumed-past / vanished / counterfeit-empty / skipped / delayed-wipe when this bug. GitHub lacuna-ledger of scored intakes on every score.

The #90709 scraped board (files unlinked + `.highwatermark` written + TaskList "No tasks found") is **scraped**, never **collated**. Unique nearby flags win their own seeds because those seeds do not carry the #90709 triad. `intact` is a labeled control (`1.json` present, no `.highwatermark`) — do not use it as the idle admit. Idle admit is **collated**. #84284 (compact enumeration lie, files still there) is labeled contrast, not this defect.

## Why not a clone

NOT **Ambo** — unheard PermissionRequest systemMessage on the ExitPlanMode card ([#90685](https://github.com/anthropics/claude-code/issues/90685)).
NOT **Slype** — sandbox that allow-lists System32 `powershell.exe` and 126-denies Program Files `pwsh.exe` ([#90676](https://github.com/anthropics/claude-code/issues/90676)).
NOT **Tally** — exit birth-count false-loss ([#90692](https://github.com/anthropics/claude-code/issues/90692)).
NOT **Pale** — hooks silently absent when the project root is not the repo root ([#90683](https://github.com/anthropics/claude-code/issues/90683)).
NOT **Chatelaine** — nested MCP OAuth ([#90647](https://github.com/anthropics/claude-code/issues/90647)).
NOT **Byline** — phantom hook agent_id ([#90662](https://github.com/anthropics/claude-code/issues/90662)).
NOT **Cubby** — wrong-ancestor auto-memory ([#90604](https://github.com/anthropics/claude-code/issues/90604)).
NOT **Ullage** — silent context drop.
NOT **Veto** — AgentTool veto / court palimpsest overlay. Do NOT name this Palimpsest.
NOT **Husk** — hollow headless success envelopes.
NOT **Quoin** — printer's quoin / letterpress chase.
NOT leftover woodworking / millimetre-slider / church pulpit / cathedral slype / dock tally / Tudor pale / foundling home / harbour berth clones.

Different problem: the on-disk task store is scraped mid-session. Files go. The watermark remains. TaskList lies "No tasks found". New ids resume past the gap.
Different UI: scriptorium collation table, stacked vellum quires, ghost rectangles where leaves are wanting, brass type-high watermark rule, TaskList slip. EB Garamond + Source Serif 4 + IBM Plex Mono. Not a raised stone pulpit, not a cloister slype, not a dock tally, not a Tudor pale, not a waist-chain, not a court palimpsest overlay, not a printer's quoin.
Different idle word: **collated**.

## Live catalog path

`/lacuna/` is this static collation desk. Demo works with no secrets and no npm. Mark: `19:50 Sydney · lacuna`.

1. Seeded `#90709` **scraped** is already on the ledger: files unlinked + `.highwatermark` written + TaskList empty → **scraped**. Never collated.
2. Switch **gapped** — surviving ids start at highwatermark+1.
3. Switch **watermarked** — `.highwatermark` present; intact sessions lack the counter.
4. Switch **resumed-past** — TaskCreate issues ids after the vanished range.
5. Switch **vanished** — prior phases gone with no delete event.
6. Switch **counterfeit-empty** — TaskList "No tasks found" after a wipe; looks like never-created.
7. Switch **skipped** — ids jump the lacuna.
8. Switch **delayed-wipe** — ~5.1s after a teammate completes the highest id (#88346).
9. Switch **contrast #84284** — compact enumeration lie; files still addressable; labeled, not this.
10. Switch **intact** — `1.json` present, no `.highwatermark` (labeled control, not the idle admit).
11. Switch **honest collated** — store complete + TaskList truthful → **collated** true.
12. **Score** scores. **Admit** applies the honest control (store complete → **collated**). **Restore · #90709** shows the scraped board. Admit does not lie when the probe is already a fail.

## Hook

`projects/lacuna/hook/` scores a store fingerprint `{ files, highwatermark, taskList, nextCreateId, deleteEvent, wipeDelayMs, teammateCompletedHighest, addressableById }` and returns `{ verdict, reasons[], collated }`. `fingerprintDir` / `scoreDir` read a fake task directory. See `hook/README.md`.

```bash
node projects/lacuna/hook/index.mjs --listen 9090
node --test projects/lacuna/hook/lacuna.test.mjs
```

`collated` is true ONLY when the verdict is collated (idle, or honest control: store complete + TaskList truthful + no orphan `.highwatermark`). Seeded 90709 numbers must produce scraped / `collated=false`. Honest control with consecutive `1.json` and no watermark produces `collated=true`. A scraped board is never collated.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90709](https://github.com/anthropics/claude-code/issues/90709) — OPEN, filed 2026-08-30. Title: [TaskList] Task store silently cleared mid-session; new ids resume past the gap. Labels: bug / has-repro / platform:macos / area:core. Store is `~/.claude/tasks/<session-id>/`. Every `.json` removed; `.highwatermark` holds the last id issued. Across 473 session dirs, 7 truncated; in every one lowest surviving id = `.highwatermark + 1`. Intact sessions have `1.json` and no `.highwatermark`. Transcript (UTC): 08-30T01:46:39Z TaskUpdate id=22 completed; 01:46:44Z `.highwatermark` written (=22); 07:58:34Z TaskList "No tasks found". Compaction, explicit delete, local scheduler, and version change were ruled out. Version 2.1.245 at loss; CLI now 2.1.251.

Same-class corroboration (cite, do not treat as this product's exact bug):

- [anthropics/claude-code#88346](https://github.com/anthropics/claude-code/issues/88346) — OPEN, has-repro / data-loss. Task JSON deleted with no Task tool call, ~5.1s after a teammate completes the highest-numbered task; `.highwatermark` rewritten to that id. Likely the delayed-timer wipe that 90709 forensics later.

Nearby, different (label as contrast — enumeration lie, files still there):

- [anthropics/claude-code#84284](https://github.com/anthropics/claude-code/issues/84284) — OPEN. TaskList "No tasks found" after `/compact` while background tasks still addressable by ID.

Related cluster, not this silent mid-session scrape:

- [anthropics/claude-code#78147](https://github.com/anthropics/claude-code/issues/78147), [#76844](https://github.com/anthropics/claude-code/issues/76844), [#80871](https://github.com/anthropics/claude-code/issues/80871), [#76493](https://github.com/anthropics/claude-code/issues/76493) — task-list restore / resume / completed-delete.

Cross-ecosystem:

- [openai/codex#32697](https://github.com/openai/codex/issues/32697) — desktop task disappeared after app update; local JSONL still exists (index gone, transcript remains).
- [openai/codex#40674](https://github.com/openai/codex/issues/40674) — active chats disappear without a delete action.
- [openai/codex#35784](https://github.com/openai/codex/issues/35784) — long-running task disappeared after usage exhaustion.

Cross-check nearby products are DIFFERENT (cite only as “not this”):

- NOT Ambo #90685, Slype #90676, Tally #90692, Pale #90683, Chatelaine #90647, Byline #90662, Cubby #90604, Ullage, Veto, Husk, Quoin, leftover woodworking.

Suggested consumer fix from #90709 (document, do not implement against Claude Code itself): either do not clear the task store mid-session, or make the clear observable — TaskList should report that a prior set existed and was cleared, rather than being indistinguishable from a session that never created a task.

## Env

| Variable | Meaning |
| --- | --- |
| `LACUNA_SLACK_WEBHOOK` / `SLACK_WEBHOOK` | Incoming webhook. Absent → honest demo "Would post…". |
| `LACUNA_GITHUB_TOKEN` / `GITHUB_TOKEN` | Lacuna-ledger. Absent → demo ledger. |
| `LACUNA_LINEAR_KEY` / `LINEAR_API_KEY` | Desk ticket. Absent → demo row. |

Missing secrets stay in honest demo mode. Never a fake live 200. The static page does not need them.

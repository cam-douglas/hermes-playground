# Lacuna hook

Collation-desk scorer for Claude Code's session task store that is silently scraped mid-session: every `<id>.json` under `~/.claude/tasks/<session-id>/` is unlinked, `.highwatermark` is written with the last id issued, TaskList then reports "No tasks found", and TaskCreate allocates from `.highwatermark + 1`. POST `{ action, lacuna? }` or pipe a `files` / `highwatermark` / `taskList` / `nextCreateId` / `deleteEvent` probe — or pass `--dir` a fake task directory — and get `collated`, `scraped`, `gapped`, `watermarked`, `resumed-past`, `vanished`, `intact`, `counterfeit-empty`, `skipped`, or `delayed-wipe`.

This is not Ambo's unheard PermissionRequest systemMessage. It is not Slype's sandbox pwsh 126. It is not Tally's exit birth-count false-loss. It is not Pale's silent-absent hooks. It is not Chatelaine's nested MCP OAuth. It is not Byline's phantom hook agent_id. It is not Cubby's wrong-ancestor auto-memory. It is not Ullage's silent context drop. It is not Veto's palimpsest overlay. It is not Husk's hollow success envelope. It is not Quoin's letterpress chase. It is not #84284's compact enumeration lie (files still there).

A watermark is not a gathering. Score the desk. Name the class or admit **collated**. Slack chip + Linear ticket on scraped / gapped / watermarked / resumed-past / vanished / counterfeit-empty / skipped / delayed-wipe when this bug. GitHub lacuna-ledger of scored intakes on every score.

Idle word is **collated**, never the product name, never **empty**, never Ambo's **unheard**, never Slype's **passed**, never Tally's **squared**, never Pale's **bound**, never Chatelaine's **girt**. Do not ship Palimpsest, Quoin, Ambo, Pulpit, Slype, Tally, Pale as the idle word.

The #90709 scraped board (files unlinked + `.highwatermark` written + TaskList "No tasks found") is **scraped**, never **collated**. Unique nearby flags win their own seeds because those seeds do not carry the #90709 triad. `intact` is a labeled control (1.json present, no `.highwatermark`) — not the idle admit.

Priority when multiple match: unique nearby contrast seeds keep their labels > **scraped** > **gapped** > **watermarked** > **resumed-past** > **vanished** > **counterfeit-empty** > **skipped** > **delayed-wipe** > **intact** > **collated**.

The hook scores a store fingerprint `{ files, highwatermark, taskList, nextCreateId, deleteEvent, wipeDelayMs, teammateCompletedHighest, addressableById }` — never invents extra issues. `fingerprintDir(path)` / `scoreDir(path)` read a fake task directory.

Primary: [anthropics/claude-code#90709](https://github.com/anthropics/claude-code/issues/90709). Same-class: [#88346](https://github.com/anthropics/claude-code/issues/88346). Contrast (not this): [#84284](https://github.com/anthropics/claude-code/issues/84284). Cross-ecosystem: [openai/codex#32697](https://github.com/openai/codex/issues/32697). NOT Ambo / Slype / Tally / Pale / Chatelaine / Byline / Cubby / Ullage / Veto / Husk / Quoin.

## CLI

```bash
node projects/lacuna/hook/index.mjs < lacuna.json
node projects/lacuna/hook/index.mjs lacuna.json
node projects/lacuna/hook/index.mjs --dir /tmp/fake-tasks
```

Empty stdin uses the seeded #90709 scraped board. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `collated`, `sinks`.

## HTTP

```bash
node projects/lacuna/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `still` / `reset` (return idle **collated**), `control` / `healthy` / `proof` / `hold` (honest path that classifies **collated** with `collated` true), `ledger` / `trace` / `observe` / `score-lacuna` (score the desk), `restore` / `incident` / `90709` / `scraped` (show #90709 scraped → **scraped**), or `admit`. Nested `{ lacuna, action: { ... } }` is accepted. Admit does not lie: a scraped board stays scraped. Restore on an idle board produces the #90709 scraped board.

Probe: `{ files, highwatermark, taskList, nextCreateId, deleteEvent, wipeDelayMs, teammateCompletedHighest, addressableById, storePath, version }`.

Return: `{ verdict, reasons[], collated }`.

`collated` is true ONLY when the verdict is collated (idle, or honest control: store complete + TaskList truthful + no orphan `.highwatermark`). Seeded 90709 numbers must produce scraped / `collated=false`. Control with consecutive `1.json` and no watermark must produce `collated=true`. A scraped board is never collated.

## Harness sketch

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "TaskCreate|TaskList|TaskUpdate",
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/lacuna/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `scraped` / `gapped` / `watermarked` / `resumed-past` / `vanished` / `counterfeit-empty` / `skipped` / `delayed-wipe`, or `permissionDecision: "deny"`, as a stop. A watermark is not a gathering.

## Env

| Variable | Meaning |
| --- | --- |
| `LACUNA_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: Lacuna scraped · …". Fires on fail verdicts only (this bug, not labeled contrast). |
| `LACUNA_GITHUB_TOKEN` / `GITHUB_TOKEN` | Lacuna-ledger (private gist `lacuna-ledger.jsonl`). Absent → "Would append a GitHub lacuna-ledger row…". Every scored intake. |
| `LACUNA_LINEAR_KEY` / `LINEAR_API_KEY` | Lacuna-desk alarm opens a ticket. Absent → demo row. Skip otherwise. |
| `LACUNA_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/lacuna/hook/lacuna.test.mjs
```

# Pirn hook

Weaver's pirn-winder scorer for instruction-shaped truncation of a subagent `idle_notification`. POST `{ action, pirn? }` or pipe a probe; get `beamed`, `cropped`, `thrice`, `tagged`, `looped`, or `midcut`.

This is not Shunt's nested SendMessage misroute to root. It is not Cote's resume-hub split. It is not Husk's hollow SUCCESS. It is not Coda's dropped text blocks. It is not Aside's `/btw` truncation. It is not Suture's stream-tear. It is not Cotter's poison `fireAt`. A harness calls it when a first delivery is not a hold, and an instruction-shaped false-positive hard-caps a report that already arrived, then advises a full-cost re-run that hits the same cap.

A first delivery is not a hold. Score the pirn. Name the class or admit **beamed**. Slack alarm on cropped / thrice / tagged / looped / midcut. Linear ticket on cropped / thrice. GitHub pirn-ledger of scored pirns on every score.

Idle word is **beamed**, never the product name, never **empty**, never truncat* / crop / snip / cut, never Cotter's **snug**, never Shunt's **stabled**. Do not ship Pirn, Empty, Truncate, Crop, Snip, or Cut as the idle word.

The #90544 cropped (harness tagged `settings-json` AND result truncated at ~2500 with "ask via SendMessage") is **cropped**, never **beamed**, even when the green idle/complete lamps stay lit.

Priority when multiple match: **thrice** > **cropped** > **looped** > **midcut** > **tagged** > **beamed**.

The hook scores tag, cap, re-run loop, mid-sentence cut, and thrice-paid recovery — never invents extra issues.

Primary: [anthropics/claude-code#90544](https://github.com/anthropics/claude-code/issues/90544). Same-class: #74113 #86471 #77112 #75298 (nearby shape). NOT Shunt #90463 / Cote / Husk / Coda / Aside / Suture / Cotter. Cross-ecosystem: [openai/codex#34468](https://github.com/openai/codex/issues/34468) cost-multiplier parent; [openai/codex#37822](https://github.com/openai/codex/issues/37822) dropped followup payload.

## CLI

```bash
node projects/pirn/hook/index.mjs < pirn.json
node projects/pirn/hook/index.mjs pirn.json
```

Empty stdin uses the seeded #90544 cropped pirn. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `beamed`, `sinks`.

## HTTP

```bash
node projects/pirn/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `wind`, `bail` / `beamed` / `still` / `reset` (return idle **beamed**), `control` / `healthy` / `proof` / `bench` (full delivery that stays **beamed**), `ledger` / `trace` / `observe` / `sound` (score the pirn), `restore` / `cropped` / `incident` (show #90544 cropped → **cropped**), or `admit`. Nested `{ pirn, action: { ... } }` is accepted. Admit does not lie: a cropped pirn stays cropped. Restore on an idle bench produces the #90544 cropped pirn.

Probe: `{ session, issue, source, harnessTag, instructionShaped, resultChars, capChars, truncated, truncationMarker, midSentence, runs, reRun, fullReportProduced, deliveredToParent, sonnetControlOk, filePathWorkaround, agentIdleGreen, scored }`.

Return: `{ verdict, reasons[], beamed }`.

`beamed` only when: `!instructionShaped && !truncated && !truncationMarker && runs<=1 && !reRun && deliveredToParent && (fullReportProduced || filePathWorkaround)`. Green lamps (`agentIdleGreen`) must not force beamed when truncated or tagged.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/pirn/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `cropped` / `thrice` / `tagged` / `looped` / `midcut`, or `permissionDecision: "deny"`, as a stop. A first delivery is not a hold. A green idle lamp is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `PIRN_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: cropped/thrice/tagged/looped/midcut alarm…". Fires on those verdicts only. |
| `PIRN_GITHUB_TOKEN` / `GITHUB_TOKEN` | Pirn-ledger issue (private gist `pirn-ledger.jsonl`). Absent → "Would open a GitHub pirn-ledger issue…". Every scored pirn. |
| `PIRN_LINEAR_KEY` / `LINEAR_API_KEY` | Cropped / thrice opens a yarn ticket. Absent → demo row. Skip otherwise. |
| `PIRN_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/pirn/hook/pirn.test.mjs
```

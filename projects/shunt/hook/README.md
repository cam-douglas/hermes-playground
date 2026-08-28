# Shunt hook

Road scorer for Claude Code nested-subagent SendMessage follow-up replies that are delivered to the root session instead of the requesting parent. POST `{ action, probe? }`; get `stabled`, `misrouted`, `orphaned`, `rootbound`, `typecast`, `stalled`, `tandem`, `dropped`, `crosstalk`, or `sidetracked`.

This is not a resume-hub identity split. It is not a silent hook injection. It is not a duplicate dispatch. A harness calls it when a nested child's follow-up appears in the root transcript while the requesting parent is parked waiting: first delivery went to the parent, the keepalive was cleared, and `from="general-purpose"` does not resolve.

A first delivery is not a hold. Score the road. Name the class or admit **stabled**. Slack shunt alarm on misrouted / orphaned / rootbound / typecast. Linear ticket on misrouted / orphaned / rootbound. GitHub shunt-ledger issue on every scored probe.

Idle word is **stabled**, never the product name, never **empty**, never Sump's **drained**, never Pleat's **flat**. Do not ship Points, Frog, Wye, Siding, Slip, Catch, Wagon, Yard, Signal, Lever, Relay, Deadletter, Crosstalk, Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, Ferrule, Livery, Nixie, Crypt, Fold, Accordion, Bellows, Drain, Null, Sink, Gutter, Pit, Ash, Ashcan, Sluice, Culvert, Weir, Bung, Void, Limbo, or Oubliette.

## CLI

```bash
node projects/shunt/hook/index.mjs < probe.json
```

Empty stdin uses the seeded misrouted road (`#90463`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `cluster`, `stabled`, `misrouted`, `orphaned`, `sinks`.

## HTTP

```bash
node projects/shunt/hook/index.mjs --listen 9080
curl -s -X POST http://127.0.0.1:9080 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `stamp`, `shut` / `bail` / `stabled` / `stable` (return idle **stabled**), `ledger` / `trace` / `observe` / `sound` (sound the road), `road` / `misroute` / `points` (show #90463 misrouted yard → **misrouted**), or `admit`. Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90463` misrouted. Admit does not lie: a misrouted probe stays misrouted. Road on an idle yard produces a misrouted road.

Probe: `{ firstAnswerToParent, followUpToRoot, parentReceivedFollowUp, childProducedFollowUp, fromIsAgentType, fromResolves, parentParkedWaiting, keepaliveClearedAfterFirst, parentRunning, parentCompleted, parentHoldsKeepalive, replyAddressedByRequester, notificationQueuedToRoot, nestedDepth, childFromLabel, observed, session, source, issue, scored }`.

Return: `{ verdict, reasons[], cluster[], stabled, misrouted, orphaned }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/shunt/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `misrouted` / `orphaned` / `rootbound` / `typecast`, or `permissionDecision: "deny"`, as a stop. A first delivery is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `SHUNT_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: misrouted/orphaned/rootbound/typecast alarm…". Fires on those verdicts only. |
| `SHUNT_GITHUB_TOKEN` / `GITHUB_TOKEN` | Shunt-ledger issue (private gist `shunt-ledger.jsonl`). Absent → "Would open a GitHub shunt-ledger issue…". Every scored probe. |
| `SHUNT_LINEAR_KEY` / `LINEAR_API_KEY` | Misrouted / orphaned / rootbound opens a road ticket. Absent → demo row. Skip otherwise. |
| `SHUNT_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/shunt/hook/*.test.mjs
```

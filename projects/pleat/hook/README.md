# Pleat hook

Cloth scorer for Claude Code Desktop collapsing assistant text written *between* tool calls under the "Ran N commands" fold. POST `{ action, probe? }`; get `flat`, `pleated`, `buried`, `folded`, `swallowed`, `midturn`, `chrome`, `fragment`, `ghosted`, or `aired`.

This is not a preamble side-channel. It is not a last-block splice. It is not a hanging-chad ballot. A harness calls it when mid-turn prose exists in the transcript but the Desktop fold hides it: a numbered list appears to start at 4, a requested explanation is collapsed entirely, the model believes it answered and the user sees chrome plus a fragment.

A rendered fold is not a hold. Score the cloth. Name the class or admit **flat**. Slack pleat alarm on pleated / buried / swallowed / ghosted. Linear ticket on buried / ghosted. GitHub pleat-ledger issue on every scored probe.

Idle word is **flat**, never the product name, never **empty**, never Chad's **spoilt**, never Aside's **heard**, never Coda's **intact**. Do not ship Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, Ferrule, Livery, Nixie, Crypt, Fold, Accordion, or Bellows.

## CLI

```bash
node projects/pleat/hook/index.mjs < probe.json
```

Empty stdin uses the seeded pleated cloth (`#90425`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `cluster`, `flat`, `pleated`, `buried`, `sinks`.

## HTTP

```bash
node projects/pleat/hook/index.mjs --listen 9060
curl -s -X POST http://127.0.0.1:9060 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `iron` / `stamp`, `shut` / `flatten` / `flat` (return idle **flat**), `ledger` / `trace` / `observe` / `chalk` (check the cloth), `crease` / `fold` / `pinch` (show #90425 collapsed fold → **pleated**), `air` / `air-out` / `unpleat` (fold expanded → **aired**), or `admit`. Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90425` pleated. Admit does not lie: a pleated probe stays pleated. Crease on an idle board produces a pleated cloth. `air` is the healthy hold, never idle.

Probe: `{ midTurnProse, foldCollapsed, requestedExplanation, explanationInTranscript, explanationHiddenInFold, toolChromeOnly, finalFragmentOnly, numberedListStartsMid, proseBetweenToolUse, ranNCommandsVisible, noHintOfHiddenProse, trailingStatusOnly, modelBelievesAnswered, userNeverSaw, foldExpanded, proseRecovered, midTurnProseVisible }`.

Return: `{ verdict, reasons[], cluster[], flat, pleated, buried }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/pleat/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `pleated` / `buried` / `swallowed` / `ghosted`, or `permissionDecision: "deny"`, as a stop. A rendered fold is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `PLEAT_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: pleated/buried/swallowed/ghosted alarm…". Fires on those verdicts only. |
| `PLEAT_GITHUB_TOKEN` / `GITHUB_TOKEN` | Pleat-ledger issue (private gist `pleat-ledger.jsonl`). Absent → "Would open a GitHub pleat-ledger issue…". Every scored probe. |
| `PLEAT_LINEAR_KEY` / `LINEAR_API_KEY` | Buried / ghosted opens a mid-turn-fold ticket. Absent → demo row. Skip otherwise. |
| `PLEAT_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/pleat/hook/*.test.mjs
```

# Chad hook

Ballot scorer for Claude Code AskUserQuestion phantom selection treated as consent. POST `{ action, probe? }`; get `spoilt`, `punched`, `blank`, `carried`, `miscast`, `phantom`, `rubbered`, `forced`, `defaulted`, or `clear`.

This is not a permission-grant stall. It is not a settings toggle. It is not a claim-vs-reality probe. A harness calls it when AskUserQuestion reports an option the user never chose and the assistant acts on that forged consent: Enter submitted the highlighted Recommended, a mid-turn message auto-resolved the question, provenance is missing, docker compose ran.

A reported selection is not a hold. Score the ballot. Name the class or admit **spoilt**. Slack chad alarm on punched / carried / miscast / phantom / forced. Linear false-consent ticket on punched / carried / phantom. GitHub chad-ledger issue on every scored probe.

Idle word is **spoilt**, never the product name, never **empty**, never Kist's **laid**, never Wraith's **unlinked**, never Chute's **clear** as idle. Do not ship Livery, Nixie, Crypt, Booth-as-rename-of-Chad, Ballot, Teller, or Placet.

## CLI

```bash
node projects/chad/hook/index.mjs < probe.json
```

Empty stdin uses the seeded punched ballot (`#90407`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `cluster`, `spoilt`, `punched`, `carried`, `sinks`.

## HTTP

```bash
node projects/chad/hook/index.mjs --listen 9050
curl -s -X POST http://127.0.0.1:9050 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `stamp`, `shut` / `seat` / `spoilt` (return idle **spoilt**), `ledger` / `trace` / `observe` (check the ballot), `punch` / `forge` (show #90407 hanging chad → **punched**), `clear` (verified deliberate selection → **clear**), or `admit`. Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90407` punched. Admit does not lie: a punched probe stays punched. Punch on an idle booth produces a punched ballot. `clear` is the healthy hold, never idle.

Probe: `{ reportedOption, userDeniesSelection, userNeverChose, recommendedWasHighlighted, enterWhileTyping, focusClickSelected, midTurnMessageAutoResolved, assistantActedOnResult, sideEffectLanded, resultIndistinguishableFromHuman, questionDismissedUnanswered, deliberateSelectionVerified }`.

Return: `{ verdict, reasons[], cluster[], spoilt, punched, carried }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/chad/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `punched` / `carried` / `miscast` / `phantom` / `forced`, or `permissionDecision: "deny"`, as a stop. A reported selection is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `CHAD_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: punched/carried/miscast/phantom/forced alarm…". Fires on those verdicts only. |
| `CHAD_GITHUB_TOKEN` / `GITHUB_TOKEN` | Chad-ledger issue (private gist `chad-ledger.jsonl`). Absent → "Would open a GitHub chad-ledger issue…". Every scored probe. |
| `CHAD_LINEAR_KEY` / `LINEAR_API_KEY` | Punched / carried / phantom opens a false-consent ticket. Absent → demo row. Skip otherwise. |
| `CHAD_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/chad/hook/chad.test.mjs
```

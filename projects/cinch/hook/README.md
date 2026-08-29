# Cinch hook

Saddler's / packer's cinch desk for silent partial mounts on an otherwise-fired Cowork run. POST `{ action, pack? }` or pipe JSON; get `cinched`, `slipped`, `dropped`, `phantom`, `omitted`, `partial`, `trusted`, `loose`, `delivered`, or `halted`.

This is not Fusee's early schedule dispatch. It is not Wicket's worktree isolation. It is not Larder's plugin-store freeze. It is not Hasp's file lease. It is not Sprag's boot-cached MCP attach. It is not Ullage or Visa. A harness calls it when a written Trusted-folders list is not a hold, and a surviving leaf was treated as proceed.

A written Trusted-folders list is not a hold. Score the girth. Name the class or admit **cinched**. Slack alarm on slipped / dropped / omitted / delivered / phantom / loose. Linear ticket when omitted or delivered. GitHub cinch-ledger of scored packs on every score.

Idle word is **cinched**, never the product name, never **mount**, never Ullage's **gauged**, never Visa's **stamped**. Do not ship Cinch, Mount, Folder, Slip, Pack, or Girth as the idle word.

Leaf-proceed plus a missing root is **omitted** (or **delivered** if the incomplete pack was presented as complete), never **cinched**, even when a surviving leaf path exists.

## CLI

```bash
node projects/cinch/hook/index.mjs < pack.json
node projects/cinch/hook/index.mjs pack.json
```

Empty stdin uses the seeded #90506 omitted incident 3. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `missing`, `extra`, `cinched`, `sinks`.

## HTTP

```bash
node projects/cinch/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `girth`, `bail` / `cinched` / `still` / `reset` (return idle **cinched**), `control` / `healthy` / `proof` / `interactive` (interactive session that stays **cinched**), `ledger` / `trace` / `observe` / `sound` (score the pack), `restore` / `omitted` / `incident` (show #90506 incident 3 → **omitted**), or `admit`. Nested `{ pack, action: { ... } }` is accepted. Admit does not lie: an omitted pack stays omitted. Restore on an idle tack room produces the #90506 incident 3 omit.

Pack: `{ expected[], mounted[], trusted[], listed[], leafProceed, shipped, halted?, uiGreen?, unreachable[], session, source, issue, scored }`.

Return: `{ verdict, reasons[], missing[], extra[], cinched }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/cinch/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `omitted` / `delivered` / `dropped` / `slipped` / `phantom` / `loose`, or `permissionDecision: "deny"`, as a stop. A written Trusted-folders list is not a hold. A surviving leaf is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `CINCH_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: slipped/dropped/omitted/delivered/phantom/loose alarm…". Fires on those verdicts only. |
| `CINCH_GITHUB_TOKEN` / `GITHUB_TOKEN` | Cinch-ledger issue (private gist `cinch-ledger.jsonl`). Absent → "Would open a GitHub cinch-ledger issue…". Every scored pack. |
| `CINCH_LINEAR_KEY` / `LINEAR_API_KEY` | Omitted or delivered opens a pack ticket. Absent → demo row. Skip otherwise. |
| `CINCH_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/cinch/hook/cinch.test.mjs
```

# Byline hook

Newsroom byline scorer for Claude Code hook-identity: `PreToolUse` / `PostToolUse` fired inside a running subagent are sometimes reported under a different `agent_id` that has no `SubagentStart`, no `agent_type`, and never gets a `SubagentStop`. Consecutive tool calls of one real subagent can split across two ids. POST `{ action, byline? }` or pipe hook JSON / `agent-*.jsonl`; get `credited`, `ghosted`, `untyped`, `unstopped`, `hanging`, `split`, `stray`, `borrowed`, `nest-split`, or `resume-split`.

This is not Shunt's nested SendMessage misroute. It is not Cote / Nixie's resume team-hub identity split. It is not Tappet's silent hook injection. A harness calls it when a ghost byline is not a hold, and the hook producer credited copy to a hanging nameplate.

A ghost byline is not a hold. Score the rack. Name the class or admit **credited**. Slack alarm on ghosted / split / borrowed / unstopped (and stray / hanging / nest-split / resume-split). Linear ticket on ghosted / split / borrowed. GitHub byline-ledger of scored racks on every score.

Idle word is **credited**, never the product name, never **empty**, never silent / mute / idle / dead / sealed / fronted, never Datum's **level**, never Calque's **verbatim**, never Fascia's **fronted**. Do not ship Byline, Masthead, Dateline, Slugline, Kicker, Lede, Dek, Hed, Cutline, Credit, Attrib, Byname, or Nameline as the idle word.

The #90662 split rack (Pre/Post on an id with no SubagentStart + no agent_type + no SubagentStop, attributed to a real running subagent — cleanest: a37ed07 `lsof` on stray, next bash on real id) is **split**, never **credited**. Unique nearby flags win their own seeds because those seeds do not carry the split triad.

Priority when multiple match: **borrowed** > **split** > **nest-split** > **resume-split** > **stray** > **hanging** > **ghosted** > **untyped** > **unstopped** > **credited**.

The hook scores `{ session, issue, source, events[], transcripts{}, scored }` — never invents extra issues.

Primary: [anthropics/claude-code#90662](https://github.com/anthropics/claude-code/issues/90662). Stop-side nearby (different event class, not this): [#89555](https://github.com/anthropics/claude-code/issues/89555) [#87065](https://github.com/anthropics/claude-code/issues/87065) [#59719](https://github.com/anthropics/claude-code/issues/59719) [#88995](https://github.com/anthropics/claude-code/issues/88995). Cross-ecosystem: [openai/codex#16226](https://github.com/openai/codex/issues/16226) [#38142](https://github.com/openai/codex/issues/38142) [#40802](https://github.com/openai/codex/issues/40802). NOT Shunt / Cote / Nixie / Tappet / Sounder / Fascia / Wicket / Datum / Calque / Quoin / Gaff.

## CLI

```bash
node projects/byline/hook/index.mjs < byline.json
node projects/byline/hook/index.mjs byline.json
```

Empty stdin uses the seeded #90662 split rack. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `credited`, `sinks`.

## HTTP

```bash
node projects/byline/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `credited` / `still` / `reset` (return idle **credited**), `control` / `healthy` / `proof` / `desk` / `rack` (honest path that classifies **credited** with `credited` true), `ledger` / `trace` / `observe` / `score-rack` (score the rack), `restore` / `split` / `incident` / `90662` (show #90662 split → **split**), or `admit`. Nested `{ byline, action: { ... } }` is accepted. Admit does not lie: a split rack stays split. Restore on an idle rack produces the #90662 split rack.

Probe: `{ session, issue, source, events[], transcripts{}, scored }`.

Return: `{ verdict, reasons[], credited }`.

`credited` is true ONLY when the verdict is credited (idle, or honest control: every tool-bearing id is hired, typed, and later killed). Seeded 90662 numbers must produce split / `credited=false`. Control with start+type+stop must produce `credited=true`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/byline/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `ghosted` / `split` / `borrowed` / `unstopped` / `stray` / `hanging` / `nest-split` / `resume-split`, or `permissionDecision: "deny"`, as a stop. A ghost byline is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `BYLINE_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: ghosted/split/… alarm…". Fires on those verdicts only. |
| `BYLINE_GITHUB_TOKEN` / `GITHUB_TOKEN` | Byline-ledger issue (private gist `byline-ledger.jsonl`). Absent → "Would open a GitHub byline-ledger issue…". Every scored rack. |
| `BYLINE_LINEAR_KEY` / `LINEAR_API_KEY` | Ghosted / split / borrowed opens a rack ticket. Absent → demo row. Skip otherwise. |
| `BYLINE_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/byline/hook/byline.test.mjs
```

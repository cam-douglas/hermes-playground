# Fob hook

Night-clerk key-rack scorer for macOS Keychain credential litter and store split-brain. POST `{ action, rack? }` or pipe a dump; get `hung`, `minted`, `hoard`, `split`, `false-cut`, or `scope-key`.

This is not Visa's missing OAuth resource. It is not Snib's night-latch. It is not Chute's secret handoff. It is not Wraith's live-image unlink. It is not Iota's path-key identity. It is not Ordo's headless plugin unknown. It is not Cinch's partial mounts. It is not Ullage's silent context drop. A harness calls it when a new login is not a hold, and a grant minted another `Claude Code-credentials-<hash>` instead of updating the live item.

A new login is not a hold. Score the rack. Name the class or admit **hung**. Slack alarm on minted / hoard / split / false-cut / scope-key. Linear ticket on minted / hoard / split. GitHub fob-ledger of scored racks on every score.

Idle word is **hung**, never the product name, never **empty**, never Ordo's **appointed**, never Cinch's **cinched**. Do not ship Fob, Keychain, Login, Rack, or Hook as the idle word.

The #90527 mint (a new hash-suffixed item instead of the live fob) is **minted**, never **hung**, even when `/login` printed success.

The hook masks tokens. It returns counts, service names, mdat vs file mtime, and scope sets — never raw secrets.

## CLI

```bash
node projects/fob/hook/index.mjs < rack.json
node projects/fob/hook/index.mjs rack.json
```

Empty stdin uses the seeded #90527 minted rack. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `hung`, `sinks`.

## HTTP

```bash
node projects/fob/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `rack`, `bail` / `hung` / `still` / `reset` (return idle **hung**), `control` / `healthy` / `proof` / `lobby` (one live fob that stays **hung**), `ledger` / `trace` / `observe` / `sound` (score the rack), `restore` / `minted` / `incident` (show #90527 minted → **minted**), or `admit`. Nested `{ rack, action: { ... } }` is accepted. Admit does not lie: a minted rack stays minted. Restore on an idle lobby produces the #90527 minted rack.

Rack: `{ items[], liveService, fileMtime, keychainMdat, fileGeneration, keychainGeneration, cliScopes, desktopScopes, minted, loginReportedSuccess, persisted, loginExpired, revoked401, historicalMcpOAuthCopies, sharedCliDesktop, session, source, issue, scored }`.

Return: `{ verdict, reasons[], hung }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/fob/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `minted` / `hoard` / `split` / `false-cut` / `scope-key`, or `permissionDecision: "deny"`, as a stop. A new login is not a hold. A success string is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `FOB_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: minted/hoard/split/false-cut/scope-key alarm…". Fires on those verdicts only. |
| `FOB_GITHUB_TOKEN` / `GITHUB_TOKEN` | Fob-ledger issue (private gist `fob-ledger.jsonl`). Absent → "Would open a GitHub fob-ledger issue…". Every scored rack. |
| `FOB_LINEAR_KEY` / `LINEAR_API_KEY` | Minted / hoard / split opens a rack ticket. Absent → demo row. Skip otherwise. |
| `FOB_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/fob/hook/fob.test.mjs
```

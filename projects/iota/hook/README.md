# Iota hook

Identity scorer for Claude Code Windows project-path keys that differ only in case or slash direction for the same directory. POST `{ action, probe? }`; get `bound`, `split`, `twinned`, `hidden`, `unparseable`, `dropped`, `mixed`, `open`, `aliased`, or `true`.

This is not MCP Connected vs registered tools. It is not a discarded `strictAllowlist`. It is not a plugin-store freeze. It is not an unbounded until-loop. A harness calls it when `~/.claude.json` holds two keys that differ only in case, PowerShell throws `DuplicateKeysInJsonString`, and `claude mcp add -s local` writes one casing while the session reads the other.

A second casing is not a plot. Score the keys. Name the class or admit **bound**. Slack iota alarm on split / twinned / hidden / unparseable / dropped / mixed / aliased. Linear ticket on split / twinned / unparseable / dropped. GitHub iota-ledger issue on every scored probe.

Idle word is **bound**, never the product name, never **empty**, never Leat's **stilled**, never Shunt's **stabled**. Do not ship Jot, Tittle, Canon, Galley, Chase, Sort, Quad, Case, Casing, Homograph, Allograph, Doppel, Twin, Alias, Glyph, Register, Ledger, Indenture, Diptych, Cadastre, Folio, or Shift.

## CLI

```bash
node projects/iota/hook/index.mjs < probe.json
```

Empty stdin uses the seeded split case (`#90438`). Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `cluster`, `bound`, `split`, `twinned`, `sinks`.

## HTTP

```bash
node projects/iota/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `stamp`, `bail` / `bound` / `still` (return idle **bound**), `true` / `proof` / `bind` (one key, write matches read → **true**), `ledger` / `trace` / `observe` / `sound` (sound the case), `case` / `drawer` / `type` (show #90438 split case → **split**), or `admit`. Nested `{ probe, action: { ... } }` is accepted. Default payload is seed `#90438` split. Admit does not lie: a split probe stays split. Case on an idle drawer produces a split case.

Probe: `{ keys, mcpWriteKey, sessionReadKey, mcpAbsent, trustWriteKey, trustLookupKey, helperRan, permissionsAllow, permissionsHonored, pluginsKeys, parseError, filesystemCaseInsensitive, doeFoldsSeparators, doeFoldsDriveCase, conversationsEmpty, mergedResplit, observed, session, source, issue, scored }`.

Return: `{ verdict, reasons[], cluster[], bound, split, twinned }`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/iota/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `split` / `twinned` / `hidden` / `unparseable` / `dropped` / `mixed` / `aliased`, or `permissionDecision: "deny"`, as a stop. A second casing is not a plot.

## Env

| Variable | Meaning |
| --- | --- |
| `IOTA_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: split/twinned/hidden/unparseable/dropped/mixed/aliased alarm…". Fires on those verdicts only. |
| `IOTA_GITHUB_TOKEN` / `GITHUB_TOKEN` | Iota-ledger issue (private gist `iota-ledger.jsonl`). Absent → "Would open a GitHub iota-ledger issue…". Every scored probe. |
| `IOTA_LINEAR_KEY` / `LINEAR_API_KEY` | Split / twinned / unparseable / dropped opens an identity ticket. Absent → demo row. Skip otherwise. |
| `IOTA_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/iota/hook/*.test.mjs
```

# Calque hook

Linguistic-calque scorer for Claude Code PowerShell safety parser: the protected-path / Remove-Item guard treats Spanish **"del"** (de+el; also Catalan) inside a quoted commit message as the Remove-Item alias `del`, then whitespace-splits a quoted path without respecting quotes and blocks a fragment that starts with `"`. POST `{ action, calque? }` or pipe a probe; get `verbatim`, `calqued`, `aliased`, `quote-blind`, `frag-quote`, `commit-blocked`, `bash-ok`, `path-lie`, or `spanish-del`.

This is not Visa's missing RFC 8707 resource. It is not Fob's Keychain split-brain. It is not Quoin's quoted-heredoc unescape. A harness calls it when quoted string content is not a command, and the PowerShell parser calqued a lemma.

Quoted string content is not a command. Score the folio. Name the class or admit **verbatim**. Slack alarm on calqued / aliased / quote-blind / frag-quote / commit-blocked / path-lie / spanish-del. Linear ticket on calqued / spanish-del / commit-blocked. GitHub calque-ledger of scored probes on every score.

Idle word is **verbatim**, never the product name, never **empty**, never silent / mute / idle / dead / sealed / fronted, never Fascia's **fronted**, never Quoin's **locked**, never Gaff's **yanked**, never Sear's **caught**. Do not ship Calque, Frisk, Cognate, Gloss, Alias, Homograph, Delguard, or Falsefriend as the idle word.

The #90645 calqued folio (PowerShell + Spanish del inside quotes + block with path starting with a quote) is **calqued**, never **verbatim**. Unique nearby flags win their own seeds because those seeds do not carry the calqued triad.

Priority when multiple match: **calqued** > **spanish-del** > **aliased** > **quote-blind** > **frag-quote** > **commit-blocked** > **bash-ok** > **path-lie** > **verbatim**.

The hook scores `{ command, tool, messageText, quotedPaths[], blocked, blockMessage, platform, issue }` — never invents extra issues.

Primary: [anthropics/claude-code#90645](https://github.com/anthropics/claude-code/issues/90645). Related (not identical): [#69461](https://github.com/anthropics/claude-code/issues/69461) [#73524](https://github.com/anthropics/claude-code/issues/73524) [#73882](https://github.com/anthropics/claude-code/issues/73882). NOT Visa / Fob / Snib / Knock / Veto / Quoin / Sear / Gaff / Grille / Spile / Fascia / Wicket / Iota.

## CLI

```bash
node projects/calque/hook/index.mjs < calque.json
node projects/calque/hook/index.mjs calque.json
```

Empty stdin uses the seeded #90645 calqued folio. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `verbatim`, `sinks`.

## HTTP

```bash
node projects/calque/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `verbatim` / `still` / `reset` (return idle **verbatim**), `control` / `healthy` / `proof` / `folio` / `desk` (honest path that classifies **verbatim** with `verbatim` true), `ledger` / `trace` / `observe` / `score-folio` (score the folio), `restore` / `calqued` / `incident` (show #90645 calqued → **calqued**), or `admit`. Nested `{ calque, action: { ... } }` is accepted. Admit does not lie: a calqued folio stays calqued. Restore on an idle folio produces the #90645 calqued folio.

Probe: `{ session, issue, source, command, tool, messageText, quotedPaths[], extractedPath, blocked, blockMessage, platform, scored }`.

Return: `{ verdict, reasons[], verbatim }`.

`verbatim` is true ONLY when the verdict is verbatim (idle, or honest control: no del / not blocked). Seeded 90645 numbers must produce calqued / `verbatim=false`. Control without del must produce `verbatim=true`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/calque/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `calqued` / `aliased` / `quote-blind` / `frag-quote` / `commit-blocked` / `path-lie` / `spanish-del`, or `permissionDecision: "deny"`, as a stop. Quoted string content is not a command.

## Env

| Variable | Meaning |
| --- | --- |
| `CALQUE_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: calqued/aliased/… alarm…". Fires on those verdicts only. |
| `CALQUE_GITHUB_TOKEN` / `GITHUB_TOKEN` | Calque-ledger issue (private gist `calque-ledger.jsonl`). Absent → "Would open a GitHub calque-ledger issue…". Every scored probe. |
| `CALQUE_LINEAR_KEY` / `LINEAR_API_KEY` | Calqued / spanish-del / commit-blocked opens a folio ticket. Absent → demo row. Skip otherwise. |
| `CALQUE_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/calque/hook/calque.test.mjs
```

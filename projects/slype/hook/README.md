# Slype hook

Cathedral slype / covered-passage scorer for Claude Code's sandboxed session that allow-lists System32 `powershell.exe` (Windows PowerShell 5.1) and denies `pwsh.exe` from Program Files (PowerShell 7) with Permission denied / exit 126. POST `{ action, slype? }` or pipe a `pwshPath` / `powershellPath` / `pwshExit` / `powershellExit` / `pwshStderr` / `sandbox` / `outsideOk` / `dangerouslyDisableSandbox` / `tool` / `os` probe; get `passed`, `126`, `system32-ok`, `programfiles-denied`, `sandbox`, `pwsh-dead`, `powershell-ok`, `path-blocked`, `allowlist-miss`, or `msix-store`.

This is not Calque's Spanish `del` false alias. It is not Sear's structurally inert `set -e`. It is not Clew's sandbox deny-list E2BIG. It is not Grille's bypass-permissions Bash-steered edits. It is not Waif's orphan process tree. It is not Pale's silent-absent hooks. It is not Chatelaine's nested MCP OAuth. It is not Tally's exit birth-count false-loss. It is not Cotter's machine-shop cotter-pin tray. It is not openai/codex#35871 MSIX/Store `CreateProcessAsUserW` error 5.

A garrison on the roster is not a visiting friar. Score the passage. Name the class or admit **passed**. Slack chip + Linear ticket on 126 / programfiles-denied / sandbox / pwsh-dead / path-blocked / allowlist-miss / system32-ok / powershell-ok. GitHub slype-ledger of scored intakes on every score.

Idle word is **passed**, never the product name, never **empty**, never Tally's **squared**, never Pale's **bound**, never Chatelaine's **girt**, never Waif's **sheltered**, never Berth's **alongside**. Do not ship Yett, Postern, Collet, Chuck, Mandrel, Portcullis, Turnstile, Lodge, Porter, Narthex, Galilee, Barbican, Sallyport, Boom, Undercroft, Wicket, Pale as the idle word.

The #90676 126 board (Program Files `pwsh.exe` exits 126 + System32 `powershell.exe` exits 0 + sandbox session + outside ok) is **126**, never **passed**. Unique nearby flags win their own seeds because those seeds do not carry the #90676 triad.

Priority when multiple match: unique nearby without the triad (**msix-store** / **programfiles-denied** / **sandbox** / **pwsh-dead** / **path-blocked** / **allowlist-miss** / **system32-ok** / **powershell-ok**) > **126** > fallbacks > **passed**.

The hook scores `{ pwshPath, powershellPath, pwshExit, powershellExit, pwshStderr, sandbox, outsideOk, dangerouslyDisableSandbox, tool, os }` — never invents extra issues.

Primary: [anthropics/claude-code#90676](https://github.com/anthropics/claude-code/issues/90676). Contrast (not this): [#90077](https://github.com/anthropics/claude-code/issues/90077) [#89884](https://github.com/anthropics/claude-code/issues/89884) [#85475](https://github.com/anthropics/claude-code/issues/85475) [#78596](https://github.com/anthropics/claude-code/issues/78596) [#77470](https://github.com/anthropics/claude-code/issues/77470) [#86551](https://github.com/anthropics/claude-code/issues/86551). Cross-ecosystem: [openai/codex#38222](https://github.com/openai/codex/issues/38222) [#35871](https://github.com/openai/codex/issues/35871) [#37592](https://github.com/openai/codex/issues/37592). NOT Calque / Sear / Clew / Grille / Waif / Pale / Chatelaine / Tally / Cotter.

## CLI

```bash
node projects/slype/hook/index.mjs < slype.json
node projects/slype/hook/index.mjs slype.json
```

Empty stdin uses the seeded #90676 126 board. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `passed`, `sinks`.

## HTTP

```bash
node projects/slype/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `still` / `reset` (return idle **passed**), `control` / `healthy` / `proof` / `hold` (honest path that classifies **passed** with `passed` true), `ledger` / `trace` / `observe` / `score-slype` (score the passage), `restore` / `126` / `incident` / `90676` (show #90676 126 → **126**), or `admit`. Nested `{ slype, action: { ... } }` is accepted. Admit does not lie: a 126 board stays 126. Restore on an idle board produces the #90676 126 board.

Probe: `{ pwshPath, powershellPath, pwshExit, powershellExit, pwshStderr, sandbox, outsideOk, dangerouslyDisableSandbox, tool, os }`.

Return: `{ verdict, reasons[], passed }`.

`passed` is true ONLY when the verdict is passed (idle, or honest control: `pwshExit` 0 in session). Seeded 90676 numbers must produce 126 / `passed=false`. Control with `pwshExit` 0 must produce `passed=true`. A 126 board is never passed.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/slype/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `126` / `programfiles-denied` / `sandbox` / `pwsh-dead` / `path-blocked` / `allowlist-miss` / `system32-ok` / `powershell-ok`, or `permissionDecision: "deny"`, as a stop. A garrison on the roster is not a visiting friar.

## Env

| Variable | Meaning |
| --- | --- |
| `SLYPE_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: Slype 126 · …". Fires on fail verdicts only. |
| `SLYPE_GITHUB_TOKEN` / `GITHUB_TOKEN` | Slype-ledger (private gist `slype-ledger.jsonl`). Absent → "Would append a GitHub slype-ledger row…". Every scored intake. |
| `SLYPE_LINEAR_KEY` / `LINEAR_API_KEY` | Slype-passage alarm opens a ticket. Absent → demo row. Skip otherwise. |
| `SLYPE_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/slype/hook/slype.test.mjs
```

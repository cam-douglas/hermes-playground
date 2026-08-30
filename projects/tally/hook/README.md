# Tally hook

Stevedore / dock chalk-stick scorer for Claude Code's interactive worktree `/exit` dialog that counts commits since worktree *creation* (`git rev-list --count CLAUDE_BASE..HEAD`), not unmerged or unpushed work. POST `{ action, tally? }` or pipe a `birthCount` / `originCount` / `dialogClaimsLoss` / `pushed` / `merged` / `remountGrew` probe; get `squared`, `birth-counted`, `false-loss`, `merged-still-n`, `push-blind`, `base-frozen`, `remount-grew`, `origin-zero`, `chalked`, or `keep-or-lose`.

This is not Wicket's worktree isolation. It is not Fascia's misnamed trust cwd. It is not Berth's shared spawn tree. It is not Pale's silent-absent hooks. It is not #84856 squash-ancestry ExitWorktree *tool* refusal.

A birth-counted tally is not a hold. Score the board. Name the class or admit **squared**. Slack chip + Linear ticket on false-loss / remount-grew / merged-still-n / push-blind / origin-zero / base-frozen / chalked / birth-counted. GitHub tally-ledger of scored intakes on every score.

Idle word is **squared**, never the product name, never **empty**, never Pale's **bound**, never Chatelaine's **girt**, never Waif's **sheltered**, never Berth's **alongside**. Do not ship Notch, Chalk, Quittance, Remanet, Ledger, Stumpage, Docket, Waybill, Manifest, Arrear, Reckon, Escrow, Staddle, Kerf, Freeboard, Plimsoll, Cadastre, Bailey, Soke, Stile as the idle word.

The #90692 false-loss board (birth count > 0 + origin/main..HEAD = 0 + dialog claims loss after push and regular merge) is **false-loss**, never **squared**. Unique nearby flags win their own seeds because those seeds do not carry the #90692 triad.

Priority when multiple match: unique nearby without the triad (**keep-or-lose** / **remount-grew** / **merged-still-n** / **push-blind** / **origin-zero** / **base-frozen** / **chalked** / **birth-counted**) > **false-loss** > fallbacks > **squared**.

The hook scores `{ birthCount, originCount, dialogClaimsLoss, pushed, merged, squash, remountGrew, birthBeforeRemount, baseFrozen, chalked, baseline, claudeBase, head, worktree }` — never invents extra issues.

Primary: [anthropics/claude-code#90692](https://github.com/anthropics/claude-code/issues/90692). Contrast (not this): [#84856](https://github.com/anthropics/claude-code/issues/84856) [#78355](https://github.com/anthropics/claude-code/issues/78355) [#40137](https://github.com/anthropics/claude-code/issues/40137) [#71135](https://github.com/anthropics/claude-code/issues/71135). Cross-ecosystem: [openai/codex#35383](https://github.com/openai/codex/issues/35383) [#34352](https://github.com/openai/codex/issues/34352). NOT Wicket / Fascia / Berth / Pale.

## CLI

```bash
node projects/tally/hook/index.mjs < tally.json
node projects/tally/hook/index.mjs tally.json
```

Empty stdin uses the seeded #90692 false-loss board. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `squared`, `sinks`.

## HTTP

```bash
node projects/tally/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `squared` / `still` / `reset` (return idle **squared**), `control` / `healthy` / `proof` / `hold` (honest path that classifies **squared** with `squared` true), `ledger` / `trace` / `observe` / `score-tally` (score the board), `restore` / `false-loss` / `incident` / `90692` (show #90692 false-loss → **false-loss**), or `admit`. Nested `{ tally, action: { ... } }` is accepted. Admit does not lie: a false-loss board stays false-loss. Restore on an idle board produces the #90692 false-loss board.

Probe: `{ birthCount, originCount, dialogClaimsLoss, pushed, merged, squash, remountGrew, birthBeforeRemount, baseFrozen, chalked, baseline, claudeBase, head, worktree }`.

Return: `{ verdict, reasons[], squared }`.

`squared` is true ONLY when the verdict is squared (idle, or honest control: HEAD == CLAUDE_BASE; birth count 0). Seeded 90692 numbers must produce false-loss / `squared=false`. Control with HEAD at birth must produce `squared=true`. A birth-counted tally is never squared.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/tally/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `false-loss` / `remount-grew` / `merged-still-n` / `push-blind` / `origin-zero` / `base-frozen` / `chalked` / `birth-counted`, or `permissionDecision: "deny"`, as a stop. A birth-counted tally is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `TALLY_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: Tally false-loss · …". Fires on fail verdicts only. |
| `TALLY_GITHUB_TOKEN` / `GITHUB_TOKEN` | Tally-ledger (private gist `tally-ledger.jsonl`). Absent → "Would append a GitHub tally-ledger row…". Every scored intake. |
| `TALLY_LINEAR_KEY` / `LINEAR_API_KEY` | Tally-board alarm opens a ticket. Absent → demo row. Skip otherwise. |
| `TALLY_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/tally/hook/tally.test.mjs
```

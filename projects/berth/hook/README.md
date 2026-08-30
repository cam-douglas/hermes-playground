# Berth hook

Harbour berth scorer for Claude Code `spawn_task` isolation: chip sessions run in the spawning session's working tree, not an isolated worktree, while that session is still editing it. POST `{ action, berth? }` or pipe a `parentCwd` / `chipCwd` / `worktreeCreated` / `promisedFresh` probe; get `alongside`, `cohabited`, `promised-fresh`, `same-floor`, `branch-stolen`, `interleaved`, `chip-lied`, `primary-dock`, `cwd-ignored`, `phantom-tree`, or `off-quay`.

This is not Carrel's launch.json session-cwd. It is not Fascia's trust-dialog cwd lie (worktree exists, dialog misnames). It is not Byline's phantom hook agent_id. A harness calls it when a shared berth is not a hold, and the chip docked in the parent's tree.

A shared berth is not a hold. Score the quay. Name the class or admit **alongside**. Slack alarm + Linear ticket on cohabited / promised-fresh / same-floor / branch-stolen / interleaved / chip-lied / primary-dock / cwd-ignored / phantom-tree. GitHub berth-ledger of scored berths on every score.

Idle word is **alongside**, never the product name, never **empty**, never silent / mute / idle, never Carrel's **seated**, never Byline's **credited**, never Datum's **level**, never Fascia's **fronted**, never **moored**. Do not ship Berth, Slip, Slipway, Mooring, Buoy, Dolphin, Pontoon, Warp, Camber, or Hard as the idle word.

The #90668 cohabited quay (chip cwd === parent cwd + parent still editing + no real worktree) is **cohabited**, never **alongside**. Unique nearby flags win their own seeds because those seeds do not carry the cohabited triad.

Priority when multiple match: **off-quay** > **branch-stolen** > **interleaved** > **cohabited** > **phantom-tree** > **cwd-ignored** > **primary-dock** > **chip-lied** > **promised-fresh** > **same-floor** > **alongside**.

The hook scores `{ parentCwd, chipCwd, worktreeCreated, worktreeIsGit, branchBefore, branchAfter, promisedFresh, parentStillEditing, interleavedPaths, cwdParam }` — never invents extra issues.

Primary: [anthropics/claude-code#90668](https://github.com/anthropics/claude-code/issues/90668). Same-class nearby: [#77263](https://github.com/anthropics/claude-code/issues/77263) [#79234](https://github.com/anthropics/claude-code/issues/79234). Related, different (label, not this): [#90638](https://github.com/anthropics/claude-code/issues/90638) [#90661](https://github.com/anthropics/claude-code/issues/90661) [#86691](https://github.com/anthropics/claude-code/issues/86691) [#81213](https://github.com/anthropics/claude-code/issues/81213) [#89940](https://github.com/anthropics/claude-code/issues/89940). Cross-ecosystem: [openai/codex#31572](https://github.com/openai/codex/issues/31572) [#33144](https://github.com/openai/codex/issues/33144) [#18969](https://github.com/openai/codex/issues/18969). NOT Carrel / Fascia / Byline / Datum.

## CLI

```bash
node projects/berth/hook/index.mjs < berth.json
node projects/berth/hook/index.mjs berth.json
```

Empty stdin uses the seeded #90668 cohabited quay. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `alongside`, `sinks`.

## HTTP

```bash
node projects/berth/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `alongside` / `still` / `reset` (return idle **alongside**), `control` / `healthy` / `proof` / `quay` / `hold` (honest path that classifies **alongside** with `alongside` true), `ledger` / `trace` / `observe` / `score-berth` (score the quay), `restore` / `cohabited` / `incident` / `90668` (show #90668 cohabited → **cohabited**), or `admit`. Nested `{ berth, action: { ... } }` is accepted. Admit does not lie: a cohabited quay stays cohabited. Restore on an idle quay produces the #90668 cohabited quay.

Probe: `{ parentCwd, chipCwd, worktreeCreated, worktreeIsGit, branchBefore, branchAfter, promisedFresh, parentStillEditing, interleavedPaths[], cwdParam }`.

Return: `{ verdict, reasons[], alongside }`.

`alongside` is true ONLY when the verdict is alongside (idle, or honest control: chip session has its own real git worktree; parent tree untouched). Seeded 90668 numbers must produce cohabited / `alongside=false`. Control with a real linked worktree must produce `alongside=true`.

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/berth/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `cohabited` / `promised-fresh` / `same-floor` / `branch-stolen` / `interleaved` / `chip-lied` / `primary-dock` / `cwd-ignored` / `phantom-tree`, or `permissionDecision: "deny"`, as a stop. A shared berth is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `BERTH_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: cohabited/promised-fresh/… alarm…". Fires on those verdicts only. |
| `BERTH_GITHUB_TOKEN` / `GITHUB_TOKEN` | Berth-ledger issue (private gist `berth-ledger.jsonl`). Absent → "Would open a GitHub berth-ledger issue…". Every scored berth. |
| `BERTH_LINEAR_KEY` / `LINEAR_API_KEY` | Shared-tree quay opens a ticket. Absent → demo row. Skip otherwise. |
| `BERTH_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/berth/hook/berth.test.mjs
```

# Cubby hook

Mailroom-cubby scorer for Claude Code auto-memory that silently resolves to the wrong ancestor-encoded project cache directory, so a real user-authored safety rule in the repo's authoritative `memory/` never reaches the session. POST `{ action, cubby? }` or pipe a probe; get `stowed`, `misfiled`, `ancestor`, `stale`, `invisible`, `walked-up`, `unsurfaced`, `ghosted`, `mirrored-fail`, or `restored`.

This is not Ullage's silent context drop. It is not Iota's path-key casing. It is not Grille's Bash-steered edits. It is not Spile's stdin-EOF wedge. A harness calls it when a stuffed cubby is not a hold, and the authoritative memory never reached the session.

A stuffed cubby is not a hold. Score the wall. Name the class or admit **stowed**. Slack alarm on misfiled / ancestor / stale / invisible / walked-up / ghosted / mirrored-fail. Linear ticket on invisible / ancestor / walked-up / ghosted. GitHub cubby-ledger of scored probes on every score.

Idle word is **stowed**, never the product name, never **empty**, never silent / mute / idle / dead, never Grille's **posted**, never Spile's **bunged**. Do not ship Cubby, Sorter, Fiche, Carrel, Niche, Locker, Pigeon, Tray, Empty, Silent, Mute, Idle, or Dead as the idle word.

The #90604 invisible wall (ancestor-encoded cache, safety rule only in authoritative memory, hundreds of files missing, cache path unsurfaced) is **invisible**, never **stowed**. Unique nearby flags win their own seeds because those seeds do not carry the invisible pentad.

Priority when multiple match: **invisible** > **ancestor** > **walked-up** > **misfiled** > **stale** > **ghosted** > **mirrored-fail** > **unsurfaced** > **restored** > **stowed**.

The hook scores cwd vs git-root, expected vs injected cache path, ancestor walk-up, missing-file count, safety-rule visibility, cache-path surfacing, slug/hash corruption, and Read/rule scope — never invents extra issues.

Primary: [anthropics/claude-code#90604](https://github.com/anthropics/claude-code/issues/90604). Same-class: [#52772](https://github.com/anthropics/claude-code/issues/52772) (CWD vs git-root) [#53734](https://github.com/anthropics/claude-code/issues/53734) (ancestor walk) [#89915](https://github.com/anthropics/claude-code/issues/89915) (wrong project hash) [#90046](https://github.com/anthropics/claude-code/issues/90046) (transcript vs index) [#85591](https://github.com/anthropics/claude-code/issues/85591) (Read wrong scope) [#88945](https://github.com/anthropics/claude-code/issues/88945) (path-scoped unreachable) [#76617](https://github.com/anthropics/claude-code/issues/76617) (Non-ASCII slug). NOT Ullage / Iota / Fob / Cinch / Wicket / Grille / Spile / Bollard / Clew / Hasp. Cross-ecosystem: [openai/codex#16799](https://github.com/openai/codex/issues/16799) [#37950](https://github.com/openai/codex/issues/37950).

## CLI

```bash
node projects/cubby/hook/index.mjs < cubby.json
node projects/cubby/hook/index.mjs cubby.json
```

Empty stdin uses the seeded #90604 invisible wall. Stdout is JSON: `verdict`, `state`, `reasons`, `feed`, `stowed`, `sinks`.

## HTTP

```bash
node projects/cubby/hook/index.mjs --listen 9090
curl -s -X POST http://127.0.0.1:9090 \
  -H 'content-type: application/json' \
  -d '{"action":"score"}'
```

`action` may be `score` / `press` / `throw` / `make`, `bail` / `stowed` / `still` / `reset` (return idle **stowed**), `control` / `healthy` / `proof` / `mailroom` / `wall` (correct-cache path that classifies **stowed** with `stowed` true), `ledger` / `trace` / `observe` / `diff` (score the wall), `restore` / `invisible` / `incident` (show #90604 invisible → **invisible**), or `admit`. Nested `{ cubby, action: { ... } }` is accepted. Admit does not lie: an invisible wall stays invisible. Restore on an idle bench produces the #90604 invisible wall.

Probe: `{ session, issue, source, cwd, gitRoot, expectedCachePath, injectedCachePath, ancestorWalkUp, cwdVsGitRootSplit, authoritativeMemoryPath, injectedMissingFileCount, safetyRuleInAuthoritativeOnly, cachePathSurfaced, nonAsciiSlugCorrupt, wrongProjectHash, pathScopedUnreachable, readReturnedWrongScope, restoredDiagnostic, scored }`.

Return: `{ verdict, reasons[], stowed }`.

`stowed` is true ONLY when the cache matches cwd/git-root, authoritative memory is mirrored, safety rules would be visible, the cache path would be detectable, and the verdict is not a failure class. Seeded 90604 numbers must produce invisible / `stowed=false`. Control correct-cache path must produce `stowed=true`. Restored classifies **restored** with `stowed=false` (recovery, not idle control).

## Harness sketch

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/cubby/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Treat `misfiled` / `ancestor` / `stale` / `invisible` / `walked-up` / `ghosted` / `mirrored-fail`, or `permissionDecision: "deny"`, as a stop. A stuffed cubby is not a hold.

## Env

| Variable | Meaning |
| --- | --- |
| `CUBBY_SLACK_WEBHOOK` | Incoming webhook. Absent → "Would post to Slack: invisible/ancestor/… alarm…". Fires on those verdicts only. |
| `CUBBY_GITHUB_TOKEN` / `GITHUB_TOKEN` | Cubby-ledger issue (private gist `cubby-ledger.jsonl`). Absent → "Would open a GitHub cubby-ledger issue…". Every scored probe. |
| `CUBBY_LINEAR_KEY` / `LINEAR_API_KEY` | Invisible / ancestor / walked-up / ghosted opens a wall ticket. Absent → demo row. Skip otherwise. |
| `CUBBY_LINEAR_TEAM` | Optional Linear team id for live `issueCreate`. |

Also accepted: `SLACK_WEBHOOK`. Missing keys keep the hook in honest demo mode. The catalog static page never needs them.

```bash
node --test projects/cubby/hook/cubby.test.mjs
```

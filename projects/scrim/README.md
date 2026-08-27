# Scrim

Runtime DLP at the agent I/O / PostToolUse boundary.

Coding agents persist live secrets into tool stdout, transcripts, and MCP args, then into Slack and GitHub. Repo scanners arrive after the transcript is already wet. Scrim redacts `tool_result` / stdio / jsonl **before** model context, disk, and chat sinks. Then it alerts and writes a ledger.

Not GitGuardian. Not Knock. Not a permission gate.

## Live catalog path

`/scrim/` is this static page. Demo works with no secrets and no npm.

1. A seed stdio leak is already on the glass, veiled.
2. Original pane is masked in demo. Veiled pane uses stable `sha256[0:8]` forensic ids.
3. Slack / GitHub / Linear rows are honest demo ledger ("would post / would append / would open") unless env keys exist on the hook.

## Hook

`projects/scrim/hook/` is PostToolUse middleware: POST payload in, redacted payload out. See `hook/README.md`.

```bash
node projects/scrim/hook/index.mjs --listen 8787
node --test projects/scrim/hook/redact.test.mjs
```

## Evidence (do not invent more)

- [openai/codex#40378](https://github.com/openai/codex/issues/40378) — prod ACR / Postgres / Azure OpenAI keys in tool traces, then rotated without auth (2026-08-24)
- [github/gh-aw#25103](https://github.com/github/gh-aw/issues/25103) — MCP gateway bearer leaked 8× into world-readable `agent-stdio.log` via Read `tool_result`
- [anthropics/claude-code#63593](https://github.com/anthropics/claude-code/issues/63593) — 15 secret-scanning alerts from unredacted `~/.claude/projects/**/*.jsonl` tool stdout

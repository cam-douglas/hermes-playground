# Knock

Someone is at the harness gate. The tool call already fired. The allowlist or classifier blocked it. Without Knock, the run waits in a TUI nobody is watching — 19 to 58 minutes, documented.

Knock is a permission-gate relay. Not a vault. Not a webhook gateway. Not an MCP directory.

## What it does

1. An agent hook POSTs a grant request (tool, arg hash, agent, run, reason).
2. The inbox shows the knock with a TTL countdown (default 120s).
3. Slack / GitHub / Linear adapters fire when secrets exist; otherwise they are simulated in the ledger.
4. Approve is scoped to **this run only**. Deny or timeout returns so the run cannot hang.

## Demo (no secrets)

Open `/knock/` on the catalog host. Use **Knock the gate**. Approve, deny, or wait. State is local to the browser on the static catalog path.

## Next.js API (same folder)

```bash
cd projects/knock
npm install
npm run dev
```

Then:

```bash
curl -s -X POST http://localhost:3100/api/hooks/permission-request \
  -H 'content-type: application/json' \
  -d '{"hook_event_name":"PermissionRequest","tool_name":"Bash","tool_input":{"command":"npm test"},"agent_id":"subagent-1","run_id":"run_demo","wait":"0"}'
```

Decide in the inbox or `POST /api/knocks/:id/decide`. Wait with `GET /api/knocks/:id/wait`.

## Hook

`projects/knock/hook/` is a Claude Code PermissionRequest / PreToolUse helper. See `hook/README.md`.

## Env

Copy `.env.example`. Missing Slack / GitHub / Linear keys keep the product in honest demo mode.

Persistence: JSON file locally (`data/knock-store.json`). In-memory + seed on Vercel unless `DATABASE_URL` is later wired.

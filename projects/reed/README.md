# Reed

Reed-relay cabinet for MCP / tool-registry death. After a transient disconnect the session keeps talking. `/mcp` may say connected. One retry may succeed. Then tools are gone for the rest of the session: `No such tool available`. The respawned process can leak.

Four contacts per MCP server: **alive**, **handshake**, **listed**, **callable**. Connected is not registered. One served call is not a hold.

Verdicts: **open**, **set**, **stuck**, **chatter**, **leak**, **drop**. Idle word is **open**.

Not Fathom. Not Hasp. Not Parity. Not Reveille. Not Quench. Not Scrim. Not Knock. Not a leftover slider.

## Live catalog path

`/reed/` is this static laboratory cabinet. Demo works with no secrets and no npm.

1. Seeded playwright stdio `#83838` is already on the glass: alive + handshake, not listed, oneShot, `No such tool available: mcp__playwright__browser_navigate` → **chatter**.
2. Switch `#74329` — python-interpreter stdio, same plus leaked process → **leak**.
3. Switch `#82746` — dead stdio, no respawn → **open**.
4. Switch `#86080` — atlassian + gmail connectors group-drop; local-fs stdio stays **set** → **drop**.
5. Switch `#35298` — Notion connector alive + handshake, not listed → **stuck**.
6. Switch `#37417` — `tools/list_changed` logged, never applied → **stuck**.
7. Switch `#11489` — Codex MCP http, no heartbeat → **open**.
8. **Probe / Kill / Respawn / Reseat / Drop remotes** re-runs decide in the page. **Open · clear** empties the cabinet to **open**.
9. Slack / GitHub / Linear / Hook rows are honest demo copy unless env keys exist on the hook.
10. Idle word is **open**. Never the product name.

## Hook

`projects/reed/hook/` is a PreToolUse contact engine. Four bits per server. Respawn of dead stdio is leak, not set. See `hook/README.md`.

```bash
node projects/reed/hook/index.mjs --listen 8794
node --test projects/reed/hook/reed.test.mjs
```

## Evidence (do not invent more)

- [anthropics/claude-code#83838](https://github.com/anthropics/claude-code/issues/83838) — stdio respawn logs success; one call then "No such tool available" (PRIMARY seed)
- [anthropics/claude-code#74329](https://github.com/anthropics/claude-code/issues/74329) — lazy reconnect then wrong deregister; leaked process
- [anthropics/claude-code#82746](https://github.com/anthropics/claude-code/issues/82746) — dead stdio never auto-reconnects
- [anthropics/claude-code#86080](https://github.com/anthropics/claude-code/issues/86080) — claude.ai connectors drop as a group; local stdio stays up
- [openai/codex#35298](https://github.com/openai/codex/issues/35298) — remote reconnect strips Notion tools
- [openai/codex#37417](https://github.com/openai/codex/issues/37417) — tools/list_changed logged, never applied
- [openai/codex#11489](https://github.com/openai/codex/issues/11489) — MCP client has no heartbeat / auto-reconnect

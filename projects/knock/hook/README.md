# Knock hook

Claude Code `PermissionRequest` / `PreToolUse` helper. The harness already blocked the tool. This posts the knock and waits for allow (this run only) or deny.

## Env

| Variable | Meaning |
| --- | --- |
| `KNOCK_URL` | Knock base URL. Local default `http://localhost:3100`. Catalog static host has no API — point this at a Next.js Knock deploy. |
| `KNOCK_HOOK_SECRET` | Optional shared secret (`Authorization: Bearer …`) |
| `KNOCK_TTL_SECONDS` | Grant TTL. Default 120. |

## Claude Code settings

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node ./projects/knock/hook/index.mjs"
          }
        ]
      }
    ]
  }
}
```

Stdin is the hook JSON (`tool_name` / `tool_input` / `session_id`). Stdout is a PermissionRequest-shaped decision.

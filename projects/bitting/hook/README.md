# Bitting hook

Tiny locksmith's bitting-bench classifier for Slack MCP session-exclusivity. Since 2026-08-31, `plugin:slack:slack` (`https://mcp.slack.com/mcp`) fails in every concurrent Claude Code session except whichever most recently minted an OAuth token. Surfaces as CONNECT_TIMEOUT after 30000ms. The http-transport version-negotiation probe gets no answer (fixed 5s), falls back to `pinned legacy`, and exhausts the remaining 30s budget. Slack is never written to `~/.claude/mcp-needs-auth-cache.json`.

Idle word is **seated**. Seeded state is bound / #90970. Never idle as "bitting" / "bound" / "token" / "timeout" / "mcp" / "slack" / "hallmarked" / "pointed" / "collapsed" / "spoiled" / "banked" / "misstruck" / "hunting" / "traced".

```bash
node projects/bitting/hook/bitting.mjs projects/bitting/data/90970.json
node projects/bitting/hook/bitting.mjs projects/bitting/data/seated.json
echo '{"concurrentSessions":true,"sharedCredential":true}' | node projects/bitting/hook/bitting.mjs
node --test projects/bitting/hook/bitting.test.mjs
```

Empty stdin uses the idle **seated** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `hold`, `alarm`, `idleWord`.

- **SEATED** if the key seats, tumblers align, initialize answers
- **BOUND** if a sibling session holds yesterday's cut and the probe hangs (#90970)
- **TOKEN-MINT** if only the most recently minted OAuth token turns the lock
- **SESSION-EXCLUSIVITY** if every concurrent session except the newest mint fails
- **PROTOCOL-NEGOTIATION** if the http-transport version-negotiation probe is in play (`tengu_mcp_protocol_negotiation_http`)
- **CONNECT-TIMEOUT** if the surface is CONNECT_TIMEOUT after 30000ms
- **SHARED-CREDENTIAL** if all sessions share one credential entry (`callbackPort: 3118`)
- **STALE-TOKEN** if the sibling still holds the previous cut
- **NEEDS-AUTH-MISS** if slack is never written to `mcp-needs-auth-cache.json`
- **PINNED-LEGACY** if the probe falls back to pinned legacy after 5s
- **PROBE-HANG** if the version-negotiation probe gets no answer
- **CONCURRENT-SESSIONS** if more than one Claude Code session is live
- **MISATTRIBUTED-NETWORK** if a wrong key is reported as a network timeout
- **REBROADCAST** if one session /login/refresh invalidates the others (#77130)

Primary: [anthropics/claude-code#90970](https://github.com/anthropics/claude-code/issues/90970). Related (not primary): [#77130](https://github.com/anthropics/claude-code/issues/77130), [#48993](https://github.com/anthropics/claude-code/issues/48993), [#43000](https://github.com/anthropics/claude-code/issues/43000), [#51319](https://github.com/anthropics/claude-code/issues/51319) / [slackapi/slack-mcp-plugin#46](https://github.com/slackapi/slack-mcp-plugin/issues/46). Contrast: clean AuthenticateToken reject in 0.4–10s vs probe hang mislabeled as CONNECT_TIMEOUT.

NOT Reed / Fusee / Visa / Hasp / Parity / Fathom / Knock / Quench / Puncheon / Gnomon / Spoil / Trammel.

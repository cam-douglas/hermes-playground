# Bitting

A **locksmith’s bitting bench** — felt-green baize, brass keys, steel pin stack, ivory tickets; Libre Bodoni + Figtree + JetBrains Mono — for a real Claude Code defect: **`plugin:slack:slack` (`https://mcp.slack.com/mcp`) fails in every concurrent session except whichever most recently minted an OAuth token**. Surfaces as CONNECT_TIMEOUT after 30000ms. The endpoint is healthy. The stored token was valid for the minting session. The http-transport version-negotiation probe gets no answer (fixed 5s), falls back to `pinned legacy`, and exhausts the remaining 30s budget. Gated by `tengu_mcp_protocol_negotiation_http = true`. All sessions share one credential entry (Slack plugin fixed `callbackPort: 3118`). Slack is never written to `~/.claude/mcp-needs-auth-cache.json`.

Primary:

- [anthropics/claude-code#90970](https://github.com/anthropics/claude-code/issues/90970) (OPEN, bug, has-repro, platform:macos, area:mcp, filed 2026-08-31T12:22:25Z by mocca102). Title: [BUG] Slack MCP: http protocol-negotiation probe hangs → 30s CONNECT_TIMEOUT in every session except the one that most recently minted a token.

A sibling key with yesterday's cut is not a hold. Score the tumblers or admit **seated**.

Idle word: **seated**. Seeded state: **bound** / #90970 — session `40a9b36f` hangs on the version-negotiation probe while session `b35777c5` calls `slack_read_thread`. Never idle as "bitting" / "bound" / "token" / "timeout" / "mcp" / "slack" / "hallmarked" / "pointed" / "collapsed" / "spoiled" / "banked" / "misstruck" / "hunting" / "traced".

A key’s **bitting** is the cut pattern that must match the tumblers. Only the most recently cut key (most recently minted OAuth token) turns the lock. Sibling sessions still hold the previous cut — they bind in the wards and hang, reported as a network timeout instead of a wrong key.

- **seated** = hold: key seats; tumblers align; initialize answers
- **bound** = #90970 primary — stale bitting binds; probe hangs; CONNECT_TIMEOUT
- **token-mint** = only the most recently minted OAuth token turns the lock
- **session-exclusivity** = every concurrent session except the newest mint fails
- **protocol-negotiation** = http-transport version-negotiation probe (`tengu_mcp_protocol_negotiation_http`)
- **connect-timeout** = surface is CONNECT_TIMEOUT after 30000ms
- **shared-credential** = one credential entry; Slack plugin `callbackPort: 3118`
- **stale-token** = sibling still holds the previous cut
- **needs-auth-miss** = slack never written to `mcp-needs-auth-cache.json`
- **pinned-legacy** = fallback after the 5s probe
- **probe-hang** = version-negotiation probe gets no answer (fixed 5s)
- **concurrent-sessions** = more than one Claude Code session is live (15 IDs on 2026-08-31)
- **misattributed-network** = a wrong key reported as a network timeout
- **rebroadcast** = one session /login/refresh invalidates the others (#77130)

Verdicts: bound, seated, token-mint, session-exclusivity, protocol-negotiation, connect-timeout, shared-credential, stale-token, needs-auth-miss, pinned-legacy, probe-hang, concurrent-sessions, misattributed-network, rebroadcast.

Overlapping proof from the issue: session `b35777c5` successfully called `slack_read_thread` while session `40a9b36f` hit version negotiation probe timeout / CONNECT_TIMEOUT. When a stale token is cleanly rejected: `unauthorized: AuthenticateToken authentication failed` in 0.4–10s, but slack is never written to the needs-auth cache (unlike linear, google-workspace-*, databricks, figma) → no re-auth prompt; silent retry into 30s timeout.

## Why not a clone

This is specifically: **CONCURRENT SESSIONS + SHARED OAUTH CREDENTIAL + MOST-RECENT MINT WINS + PROTOCOL-NEGOTIATION PROBE HANG MISLABELED AS CONNECT_TIMEOUT + SLACK MISSING FROM NEEDS-AUTH CACHE**.

NOT **Reed** — four contacts alive/handshake/listed/callable after disconnect.
NOT **Fusee** — written cron ≠ hold.
NOT **Visa** — login without destination.
NOT **Hasp** / **Parity** / **Fathom** / **Knock** / **Quench** — different MCP/auth failure modes.
NOT **Puncheon** ([#90962](https://github.com/anthropics/claude-code/issues/90962)) — Write-tool BOM-less `.ps1`.
NOT **Gnomon** ([#90954](https://github.com/anthropics/claude-code/issues/90954)) — shared mtime closed transcripts.
NOT **Spoil** ([#90943](https://github.com/anthropics/claude-code/issues/90943)) — stale private `GIT_INDEX_FILE`.
NOT **Trammel** ([#90936](https://github.com/anthropics/claude-code/issues/90936)) — VS Code focus ping-pong.

Different UI: locksmith bitting bench. Felt green #1a3a2a, brass #c4a35a, steel #8a9099, ink #0e1210, ivory #f2e8d0. Libre Bodoni + Figtree + JetBrains Mono. NOT Puncheon Cinzel / Outfit / Spline Sans Mono walnut/gold/oxblood. NOT Gnomon Libre Baskerville / IBM Plex Sans / Space Mono slate/brass. NOT Spoil Instrument Serif / Source Serif 4 / JetBrains Mono slag/ochre. NOT Trammel Newsreader / Sora / Red Hat Mono mahogany. NOT Escutcheon Bebas Neue keyhole plate.

Different verbs: score the bitting, pin idle seated, pin seeded bound, admit seated. Not "Score the gold" / "Pin idle hallmarked" / "Score the gnomon" / "Score the spoil" / "Score the grooves".

Different idle: **seated**.

## Live catalog path

`/bitting/` is this static locksmith bench. Demo works with no secrets and no npm. Mark: `22:50 / hermes catalog #96 / #90970`.

1. Idle demo loads **seated** — key seats; tumblers align; initialize answers.
2. Seed **bound** → #90970 ticket: session `40a9b36f` probe hang / CONNECT_TIMEOUT while `b35777c5` calls `slack_read_thread`.
3. Click a key on the ring. The most recently cut key turns; siblings bind.
4. **Cut a new key** mints a token and invalidates every sibling on the ring.
5. Probe timeline: 5s negotiation → pinned legacy → 30s CONNECT_TIMEOUT.
6. Needs-auth plaque: linear / google-workspace-* / databricks / figma PRESENT; slack ABSENT.
7. Contrast plaque: clean AuthenticateToken reject in 0.4–10s vs hang mislabeled as CONNECT_TIMEOUT.
8. **Score the bitting** walks the ticket and lights chips on the brass rail.

## How to score

Open `projects/bitting/index.html` in a browser, or serve the repo root and visit `/bitting/` (Vercel rewrite → `/projects/bitting`). No build step. Optional hook:

```bash
node projects/bitting/hook/bitting.mjs projects/bitting/data/90970.json
node projects/bitting/hook/bitting.mjs projects/bitting/data/seated.json
node --test projects/bitting/hook/bitting.test.mjs
```

Bound seed → bound/alarm. Seated seed → seated/hold.

`projects/bitting/hook/bitting.mjs` classifies a ticket and returns `{ verdict, chips[], reasons[], hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/90970.json`, `data/bound.json`, `data/seated.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/contrast.json`, `data/fixtures.json`. Evidence only from issue facts. Fifteen is a count, not a list of invented session IDs.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#90970](https://github.com/anthropics/claude-code/issues/90970). Unauthenticated. See `.env.example`.
2. Key ring of session keys; mint/cut invalidates siblings.
3. Pin idle seated / pin seeded bound / score the bitting / admit seated.
4. Pin-tumbler stack and probe timeline (5s → pinned legacy → 30s).
5. Needs-auth cache plaque (slack ABSENT).
6. Contrast plaque vs clean AuthenticateToken reject.

## Sources

- [anthropics/claude-code#90970](https://github.com/anthropics/claude-code/issues/90970) OPEN
- Related (cite, not primary): [#77130](https://github.com/anthropics/claude-code/issues/77130) — one session /login/refresh invalidates connectors in all other concurrent sessions; [#48993](https://github.com/anthropics/claude-code/issues/48993); [#43000](https://github.com/anthropics/claude-code/issues/43000); [#51319](https://github.com/anthropics/claude-code/issues/51319) / [slackapi/slack-mcp-plugin#46](https://github.com/slackapi/slack-mcp-plugin/issues/46).
- Contrast: clean AuthenticateToken reject in 0.4–10s vs probe hang mislabeled as CONNECT_TIMEOUT. Slack absent from the needs-auth cache.

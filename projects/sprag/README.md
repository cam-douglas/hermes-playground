# Sprag

Overrunning-clutch bench for Claude Code boot-cached MCP attach failure. A failed attach at boot is **not** a hold. Score the race or admit **overrun**.

A sprag is the one-way element in an overrunning clutch: it locks against reverse rotation and freewheels the other way. A failed MCP attach at boot is a sprag that locked on the first refuse; later success cannot reverse it until the whole process is rebuilt.

Idle word: **overrun** (the freewheeling / overrun state of a sprag clutch).
NEVER use the product name sprag / clutch / empty / failed / mcp / retry as the idle/state word.
NEVER reuse prior idles: pratique, bound, stilled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, stabled, wound. Do not ship Clutch, Overrun, Ratchet, Pawl, Detent, Freewheel, Race, Inner, Outer, Sprag (as idle), Reed, Larder, Tappet, Fusee, Quarantine.

Verdicts: **overrun**, **locked**, **mixed**, **late**, **refused**, **cached**, **stale**, **spun**, **held**, **live**. Slack sprag alarm on locked / mixed / late / refused / cached / stale. Linear ticket on locked / mixed. GitHub sprag-ledger of race events on every scored probe.

## Why not a clone

NOT Reed (four-contact cabinet for a server that reports Connected — connected vs registered vs one served call).
NOT Larder (plugin-store freeze).
NOT Tappet (silent hook injection / valve train).
NOT Fusee (early schedule dispatch / clockmaker).
NOT Iota (path-key identity).
NOT Lazaret (malware-reminder refusal).
NOT Leat (millrace). NOT Shunt (railway).
NOT leftover woodworking / millimetre-slider clones.
Do NOT ship Clutch, Overrun, Ratchet, Pawl, Detent, Freewheel, Race, Inner, Outer, Sprag (as idle), Reed, Larder, Tappet, Fusee, or Quarantine as alternate product names this hour. Product name is **Sprag** only.

Different problem: first failed attach locks the race for the whole process, even after the server is up. Desktop-app-bundled MCP servers look permanently broken whenever the user's terminal was opened first.
Different UI: gearbox / overrunning-clutch bench. Steel sprags between inner and outer races, ATF oil-amber, carbon, blued steel, workshop grey, drain plug, race lamp. NOT brass enamel clock. NOT valve train / engine bay. NOT millrace. NOT railway. NOT lazaretto / yellow jack. NOT typesetter case. NOT reed-relay cabinet. NOT stillroom.
Different idle word: **overrun**.

## Live catalog path

`/sprag/` is this static clutch-bench page. Steel sprags, inner and outer races, ATF sump, drain plug, race lamp. Demo works with no secrets and no npm. Mark: `12:50 Sydney · sprag`.

1. Seeded `#90494` **locked** is already on the race: first attach failed; server later reachable; still failed for process lifetime → **locked**.
2. Switch **mixed** — reconnect used boot-pinned transport + current credentials → "No token data found" → **mixed**.
3. Switch **late** — server started after the claude process → **late**.
4. Switch **refused** — ConnectionRefused at boot → **refused**.
5. Switch **cached** — failed connection cached for process lifetime → **cached**.
6. Switch **stale** — reconnect used boot-pinned transport → **stale**.
7. Switch **spun** — recovered only by full process restart → **spun**.
8. Switch **held** — classification uncertain → **held**.
9. Switch **live** — server was up at boot, connected, tools available → **live**.
10. Switch **Bail · overrun** — attach not a hold, nothing scored → **overrun**. Idle word is **overrun** when the probe is idle.
11. **Score** scores. **Bail** returns idle overrun. **Race** shows the #90494 locked strike. Admit does not lie: a locked probe stays locked.

## Hook

`projects/sprag/hook/` scores a probe `{ serverRunningAtBoot, serverRunningNow, attachFailed, retried, reconnectAttempted, reconnectError, transportPinnedAtBoot, transportNow, credentialsNow, tokenDataFound, processRestarted, toolsAvailable, observed, session, source, issue, scored }` and returns `{ verdict, reasons[], cluster[], overrun, locked, mixed }`. See `hook/README.md`.

```bash
node projects/sprag/hook/index.mjs --listen 9090
node --test projects/sprag/hook/sprag.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90494](https://github.com/anthropics/claude-code/issues/90494) — filed 2026-08-29, open. Title: "MCP server that starts after Claude Code is never connected — no retry, and /mcp reconnect fails with \"No token data found\"". Claude Code 2.1.248, macOS. Repro 1: start claude while the local HTTP/stdio MCP server is down → ConnectionRefused, 3 attempts at startup, then nothing; start the server; curl succeeds; same process still shows failed; /clear still failed; full quit+relaunch connects instantly. Repro 2: config migrated HTTP+bearer → stdio while process running; /mcp reconnect fails "No token data found" (boot-pinned transport + current credentials).

Shape (cite as shape, not a new primary):

- [anthropics/claude-code#84778](https://github.com/anthropics/claude-code/issues/84778) — open. A failed MCP server attach at startup is terminal for the session — no retry, even for transient network errors. Healthy initialize 0.42–0.94s; unreachable proxy errors in ~0.2s; 12-hour probe 213/720 failures in contiguous blocks; a 7s recovery that was previously fatal attaches after an 8.2s wrapper wait.
- [anthropics/claude-code#81042](https://github.com/anthropics/claude-code/issues/81042) — open. MCP server down at session start is unrecoverable for the session even after account-level reconnect succeeds (claude mcp list shows ✔ Connected; running session still has no tools; nested headless claude -p was the workaround).
- [anthropics/claude-code#85766](https://github.com/anthropics/claude-code/issues/85766) — open. claude mcp add during a running session doesn't appear in /mcp until a new session starts.
- [anthropics/claude-code#83044](https://github.com/anthropics/claude-code/issues/83044) — open. /mcp reconnect rebuilds transport but not broker state; /mcp shows Connected throughout a wedge.

# Stopcock

A **brass plumbing / copper-pipe workshop booth** — brushed brass fittings, copper pipe, dark slate bench, verdigris accents, warm workshop light; fonts **Literata** (display) + **Source Sans 3** (body) + **IBM Plex Mono** (mono) — Fraunces was swapped because Midden already uses Fraunces + Source Sans 3 + IBM Plex Mono in the same way — for a real Claude Code defect: **STREAMABLE HTTP MCP `tools/call` STILL TIMES OUT AT ~6 MIN DESPITE RAISED KNOBS.**

Primary:

- [anthropics/claude-code#93143](https://github.com/anthropics/claude-code/issues/93143) (OPEN, bug, has repro, platform:linux, area:mcp). Title: `[BUG] Streamable HTTP MCP tool call still times out ("The operation timed out.") at ~6min despite per-server timeout, CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT=0, and a requestTimeout=0 server`. A Streamable HTTP MCP `tools/call` that must stay open for several minutes (human-in-the-loop wait) still errors with `The operation timed out.` at a narrow ~352–363s window (~6 min), even when every documented timeout knob is raised or disabled at once: (1) per-server `timeout` in `mcpServers` set to `86400000` (24h); (2) `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT=0` on the claude process (confirmed received as `0`); (3) server-side `http.Server.requestTimeout=0` ruled out — timing unchanged. The MCP server stays healthy; the Claude client aborts its own `tools/call`. Minimal repro exists (bare Streamable HTTP MCP whose tool never responds). Claude Code 2.1.266. Ubuntu/Debian Linux. Four measurements in an 11-second band: 352.x, 363.1, 362.5, 357.8. CLI emits `tool_progress` at 300s and 330s shortly before the abort. Transport is `type:http` Streamable HTTP, not SSE.

02:50 stopcock: a brass plumbing workshop booth that should keep a long Streamable HTTP MCP tools/call **open** when documented timeout knobs are raised or disabled; instead a hidden ~6-minute hard seat closes the valve (**seated**) with The operation timed out. — score seated or admit open.

Score seated or admit open.

Idle word: **open** (HOLD: the valve stays open for a long Streamable HTTP MCP `tools/call` when documented timeout knobs are raised or disabled). Seeded word: **seated** / #93143 (hard ~352–363s / ~6 min cut despite knobs; `is_error` true; "The operation timed out."; client aborts its own `tools/call`). Path word: **stopcock**. Never idle preserved / discarded / fresh / stamped / cleared / mounded / distinct / conflated / held / steered / raised / fallen / sterling / primed / flashed / lodged / bypassed / greenroomed / scaffold / diplopic / freewheeling / doubled.

Phrase: **a hidden ~6-minute hard seat that closes a long Streamable HTTP MCP tools/call despite raised knobs is not an open valve — it is a seated stopcock. Score seated or admit open.**

- **open** = IDLE: HOLD; valve stays open; knobs honored; no hard ceiling
- **seated** = #93143 seeded path: hidden ~6 min hard seat; `is_error`; "The operation timed out."
- **stopcock** = path word: a hidden hard seat is not an open valve
- **hard-ceiling** = narrow ~352–363s window; 11-second spread; fixed undocumented internal timeout
- **six-minute-seat** = `tool_progress` at 300 and 330; abort still around 350–365s
- **timeout-knobs-ignored** = all documented knobs applied at once; timing unchanged
- **idle-timeout-zero** = `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT=0` confirmed received as 0
- **server-timeout-24h** = per-server `timeout` 86400000
- **streamable-http** = `type:http` Streamable HTTP, not SSE
- **tools-call** = `wait_forever` never responds; human-in-the-loop wait
- **operation-timed-out** = `is_error` true; content "The operation timed out."; server healthy; client abort
- **has-repro** = Claude Code 2.1.266 linux Streamable HTTP walk
- **hold** = HOLD alias for idle open
- **cousins** = cite-only #50289 #16837 — do not clone
- **fixtures** = row list for the stopcock booth
- **walk** = published idle open → streamable-http → tools-call → knobs → six-minute-seat → hard-ceiling → operation-timed-out → seated → stopcock

Verdicts: open, seated, stopcock, hold, hard-ceiling, six-minute-seat, timeout-knobs-ignored, idle-timeout-zero, server-timeout-24h, streamable-http, tools-call, operation-timed-out, has-repro, cousins, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring plumbing bench. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the valve is **seated** or already **open**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the Claude client may apply a fixed undocumented internal wall-clock ceiling around ~360s to Streamable HTTP MCP `tools/call` that ignores the documented per-server timeout and `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT=0`. Invite verify against #93143 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93143](https://github.com/anthropics/claude-code/issues/93143)
- Cite-only: [anthropics/claude-code#50289](https://github.com/anthropics/claude-code/issues/50289) (`.mcp.json` per-server `timeout` no longer honored for HTTP MCP since 2.1.113 — CLOSED/completed; ~60s ceiling, not ~360s)
- Cite-only: [anthropics/claude-code#16837](https://github.com/anthropics/claude-code/issues/16837) (Claude code does not obey values of `MCP_TIMEOUT` longer than 60 seconds — OPEN; different variable)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:linux, area:mcp
- Streamable HTTP MCP `tools/call` that must stay open for several minutes still errors with "The operation timed out." at ~352–363s
- Every documented timeout knob was raised or disabled at once: per-server `timeout` 86400000; `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT=0` (confirmed received as 0); server `requestTimeout=0` ruled out
- MCP server stays healthy; Claude client aborts its own `tools/call`
- Minimal repro: bare Streamable HTTP MCP whose tool never responds
- Claude Code 2.1.266; Ubuntu/Debian Linux
- Four measurements: 352.x, 363.1, 362.5, 357.8 (11-second band)
- `tool_progress` heartbeats at 300s and 330s shortly before abort
- Transport `type:http` Streamable HTTP, not SSE
- Expected: honor the 24h ceiling, or (per the `=0` docs) not idle-timeout at all, for as long as the server stays connected

Problem found: A HIDDEN ~6-MINUTE HARD SEAT THAT CLOSES A LONG STREAMABLE HTTP MCP TOOLS/CALL DESPITE RAISED KNOBS IS NOT AN OPEN VALVE — IT IS A SEATED STOPCOCK.

Why this solution: a diagnostic plumbing bench for the open → seated drift, so a reader can pin idle open, load the #93143 seated path, and score stopcock / hard-ceiling / six-minute-seat / timeout-knobs-ignored against the published facts.

## Why not a clone

This is specifically: **STREAMABLE HTTP MCP `tools/call` STILL TIMES OUT AT ~6 MIN DESPITE RAISED KNOBS.**

**NOT Parergon/#93122** (stealth idle over an open `/btw` side chat). Different paradigm.

**NOT Stereotype/#93108** (plugin update version-string-only freshness). Different paradigm.

**NOT Midden/#93081** (WorktreePool partial-remove GC remound loop). Different paradigm.

**NOT Guillotine/#92974** (background-mode Deny-only permission dialog). Different paradigm.

**NOT Clepsydra** (OTel). **NOT Fusee** (cron). **NOT Procrustes** (MCP palette). **NOT Reed** (MCP contacts). **NOT Quench** (hard kill spend).

**NOT Wildcat/#92399** or **#93126** (run_in_background shell-exit false completion).

**NOT Snatch / Deadman** (Bash timeout backgrounding / process-tree).

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **hidden ~6-minute hard seat on Streamable HTTP MCP `tools/call` vs documented timeout knobs.**

Do NOT rename this product Parergon, Stereotype, Midden, Guillotine, Clepsydra, Fusee, Procrustes, Reed, Quench, Wildcat, Snatch, Deadman, or any existing catalog slug.
Do NOT reuse idle open / seated / stopcock on a later ship.
Do NOT reuse Instrument Serif + Schibsted Grotesk + Fragment Mono (Parergon). Do NOT reuse Alegreya + Karla + Noto Sans Mono (Stereotype). Do NOT reuse Fraunces as the display face in the Midden combo (Midden already uses Fraunces + Source Sans 3 + IBM Plex Mono). Display here is **Literata**. Do NOT reuse Cormorant Garamond. Do NOT reuse Spectral. Do NOT reuse Cinzel.

Different surface: Streamable HTTP MCP `tools/call` hard ~6 min seat vs stealth-/btw-aside discard / version-string-only plugin freshness / WorktreePool orphaned-GC deadlock / Deny-only permission dialog / OTel water-clock / cron fusee / MCP palette / MCP contacts / hard-kill spend / shell-exit backgrounding.

Product name stays **Stopcock**. Name/slug `stopcock` unused in catalog.json (251 products before this ship; Parergon is #251).

Different UI: brass plumbing workshop / copper pipe / dark slate bench / verdigris drip / warm workshop light / valve wheel / seat washer. Literata / Source Sans 3 / IBM Plex Mono. NOT parchment/manuscript (Parergon). NOT letterpress (Stereotype). NOT scaffold/guillotine. NOT flintlock. NOT archaeological midden. NOT water-clock (Clepsydra). NOT deck sheave. NOT fusee dial.

Different verbs: Walk the bench, Admit open, Score seated, Pin idle open, Pin seeded seated, Crack the valve, Seat the washer, Read the gauge, Reset the bench.

Different idle: **open**. Different #93143 seeded path: **seated**. HOLD: **open**. ALARM: **seated** / **stopcock** / **hard-ceiling** / **six-minute-seat** / **timeout-knobs-ignored**. Path: **stopcock**.

## How to score

```bash
node --test projects/stopcock/stopcock.test.mjs
node projects/stopcock/stopcock.mjs projects/stopcock/data/93143.json
node projects/stopcock/stopcock.mjs projects/stopcock/data/open.json
echo '{"seed":"seated"}' | node projects/stopcock/stopcock.mjs
```

Open the living card at `projects/stopcock/index.html` (or the live path `/stopcock/`). Buttons: Walk the bench, Admit open, Score seated, Pin idle open, Pin seeded seated, Pin stopcock, Crack the valve, Seat the washer, Read the gauge, Reset the bench. Toggle knobs-honored / hard-ceiling / timed-out / client-abort — the score flips. Rest a fixture JSON on the bench tray. `?embed=1` hides chrome.

The bench reconstructs the reporter’s Streamable HTTP timeout walk from the published #93143 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/stopcock/
- Folder: `projects/stopcock/`

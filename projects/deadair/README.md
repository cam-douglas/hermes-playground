# Dead Air

A **radio / broadcast control-room booth** — charcoal studio, ON-AIR lamp, amber VU, copper mic grille, soft CRT green accents; fonts **Oswald** (display) + **Source Sans 3** (body) + **Share Tech Mono** (mono) — for a real Claude Code defect: **REQUESTS SILENTLY STALL FOR 900S WITH NO ERROR OR RETRY LOGGED.**

Primary:

- [anthropics/claude-code#93155](https://github.com/anthropics/claude-code/issues/93155) (OPEN, bug, has repro, platform:windows, area:networking). Title: `Requests silently stall for 900s with no error or retry logged`. Filed 2026-09-09 by dehuman8. Claude Code 2.1.260 (`claude-desktop`), Windows 11 Pro 26200, Node 24.18.1, default `ANTHROPIC_BASE_URL`, no proxy, no MCP. Requests accepted/ACKed at TCP by Cloudflare; no HTTP response ever returned. Client waits exactly ~900s (`API_TIMEOUT_MS=900000` from desktop-injected env), then retries and succeeds. Nothing logged — no error, no retry, no timeout event — socket stayed Established so TCP raised nothing. Wire capture: ~907KB uploaded, every byte ACKed, 0 retransmissions, keepalive probe at 63.5s ACKed immediately, total response data bytes = 0. Affected path: Spectrum IPv6 → Cloudflare EWR colo; clean path: T-Mobile → BOS (0 stalls). Stall durations quantized at multiples of 900s (903–914s, 1807s, 2709s); also a separate ~120.0s stream-idle timer. Frequency ~3/1000 assistant messages on the affected route; 0/4485 on clean. Reporter spent 3 weeks believing a cable modem was faulty. Asked: log the timeout; reconsider 900s default / surface progress; liveness check on long-silent streams; investigate EWR.

05:50 deadair: a radio broadcast / control-room booth that should keep the **carrier** live (timely response, or at least a logged timeout/retry); instead the circuit goes dead-air — TCP ACKs + keepalives, 0 response bytes, 900s silent wait with nothing logged (**deadair**) — score deadair or admit carrier.

Score deadair or admit carrier.

Idle word: **carrier** (HOLD: the circuit stays live — request gets a timely response; productive carrier; timeout/retry would be logged if anything failed). Seeded word: **deadair** / #93155 (TCP alive, keepalives ACKed, 0 response bytes, 900s silent wait, zero log lines, then silent retry). Path word: **squelch**. Never idle moored / scuttled / scuttle / open / seated / stopcock / preserved / discarded / fresh / stamped / cleared / mounded / distinct / conflated / held / steered / raised / fallen / sterling / primed / flashed / lodged / bypassed / greenroomed / scaffold / diplopic / freewheeling / doubled.

Phrase: **a live keepalive answering for fifteen minutes with zero response bytes and zero log lines is not a carrier — it is dead air / a squelch. Score deadair or admit carrier.**

- **carrier** = IDLE: HOLD; timely response; timeout/retry would be logged if anything failed
- **deadair** = #93155 seeded path: TCP alive + keepalive ACK + 0 response bytes + 900s silence + zero log lines
- **squelch** = path word: a live keepalive with zero bytes is not a carrier
- **timely-response** = HOLD alias: HTTP response arrives
- **hold** = HOLD alias for idle carrier
- **ewr-colo** = Spectrum IPv6 → Cloudflare EWR (Zayo AS6461)
- **keepalive-acked** = keepalive probe at 63.5s ACKed immediately; socket Established
- **zero-response-bytes** = 907,582 bytes uploaded; total response data bytes = 0
- **api-timeout-900s** = `API_TIMEOUT_MS=900000` from desktop-injected env
- **no-log-entry** = connection retries : 0; api errors : 0
- **quantized-stalls** = stalls at 903–914s, 1807s, 2709s
- **stream-idle-120s** = separate ~120.0s timer; `CLAUDE_BYTE_STREAM_IDLE_TIMEOUT_MS` unset
- **clean-bos-control** = T-Mobile → BOS; 0/4485 stalls
- **has-repro** = 2.1.260 claude-desktop + Windows 11 Pro 26200 + Node 24.18.1 walk
- **cousins** = cite-only #93120 #87424 #74544 #90764 #91970 #90964 #32982 — do not clone
- **fixtures** = row list for the deadair booth
- **walk** = published idle carrier → request-acked → zero-response-bytes → keepalive-acked → ewr-colo → api-timeout-900s → no-log-entry → quantized-stalls → stream-idle-120s → clean-bos-control → deadair → squelch

Verdicts: carrier, deadair, squelch, hold, timely-response, ewr-colo, keepalive-acked, zero-response-bytes, api-timeout-900s, no-log-entry, quantized-stalls, stream-idle-120s, clean-bos-control, has-repro, cousins, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring broadcast booth. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the circuit is **deadair** or already **carrier**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): client may treat an Established TCP socket with keepalive ACKs as healthy progress and therefore skip timeout/retry logging for a full `API_TIMEOUT_MS` window even when zero response bytes arrive. Invite verify against #93155 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93155](https://github.com/anthropics/claude-code/issues/93155)
- Cite-only: [anthropics/claude-code#93120](https://github.com/anthropics/claude-code/issues/93120) (Desktop app: repeated "Request failed · Retrying (n/10)")
- Cite-only: [anthropics/claude-code#87424](https://github.com/anthropics/claude-code/issues/87424) (Intermittent ECONNRESET on desktop and CLI)
- Cite-only: [anthropics/claude-code#74544](https://github.com/anthropics/claude-code/issues/74544) (1M-context ECONNRESET; /compact fails)
- Cite-only: [anthropics/claude-code#90764](https://github.com/anthropics/claude-code/issues/90764) (ECONNRESET on all local sessions)
- Cite-only: [anthropics/claude-code#91970](https://github.com/anthropics/claude-code/issues/91970) (ECONNRESET on all requests)
- Cite-only: [anthropics/claude-code#90964](https://github.com/anthropics/claude-code/issues/90964) (ECONNRESET after several minutes of active work)
- Cite-only: [anthropics/claude-code#32982](https://github.com/anthropics/claude-code/issues/32982) (Remote Control idle TTL ignores keepalives)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:windows, area:networking
- Filed 2026-09-09 by dehuman8
- Claude Code 2.1.260 (claude-desktop), Windows 11 Pro 26200, Node 24.18.1
- Requests accepted/ACKed at TCP by Cloudflare; no HTTP response ever returned
- Client waits ~900s (`API_TIMEOUT_MS=900000`), then retries and succeeds
- Nothing logged — socket stayed Established so TCP raised nothing
- Wire: 907,582 bytes uploaded, 0 retransmissions, keepalive at 63.5s ACKed, rx=0
- Affected: Spectrum IPv6 → EWR; clean: T-Mobile → BOS (0/4485)
- Stalls quantized at 900s multiples; also a ~120.0s stream-idle timer
- Frequency ~3/1000 on the affected route
- Asked: log the timeout; reconsider 900s default; liveness check; investigate EWR

Problem found: A LIVE KEEPALIVE ANSWERING FOR FIFTEEN MINUTES WITH ZERO RESPONSE BYTES AND ZERO LOG LINES IS NOT A CARRIER — IT IS DEAD AIR / A SQUELCH.

Why this solution: a diagnostic broadcast booth for the carrier → deadair drift, so a reader can pin idle carrier, load the #93155 deadair path, and score squelch / ewr-colo / keepalive-acked / zero-response-bytes against the published facts.

## Why not a clone

This is specifically: **REQUESTS SILENTLY STALL FOR 900S WITH NO ERROR OR RETRY LOGGED.**

**NOT Scuttle/#93154** (remote SSH warm-up-failure `server.shutdown` SIGKILL). Different paradigm.

**NOT Stopcock/#93143** (Streamable HTTP MCP ~6min hard seat). Different paradigm.

**NOT Parergon/#93122** (stealth idle over an open `/btw` side chat). Different paradigm.

**NOT Stereotype/#93108** (plugin update version-string-only freshness). Different paradigm.

**NOT Midden/#93081** (WorktreePool partial-remove GC remound loop). Different paradigm.

**NOT Diplopia/#93012** (Remote Control environment-label field split). Different paradigm.

**NOT Greenroom/#92988** (Desktop Code tab missing wait-for-full-turn-end queue). Different paradigm.

**NOT Guillotine/#92974** (background-mode Deny-only permission dialog). Different paradigm.

**NOT Entresol/#93010**. **NOT Hallmark/#93021**. **NOT Flashpan/#93015**. **NOT Secateurs/#92979**. **NOT Palinode/#92998**. **NOT Ferrule/#92968**. **NOT Interlock/#92999**.

**NOT Clepsydra** (OTel). **NOT Fusee** (cron). **NOT Procrustes** (MCP palette). **NOT Reed** (MCP contacts). **NOT Quench** (hard kill spend).

**NOT Wildcat/#92399** or **#93126** (run_in_background shell-exit false completion).

**NOT Snatch / Deadman** (Bash timeout backgrounding / process-tree).

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **Established TCP + keepalive ACK + 0 HTTP bytes + 900s silent wait with nothing logged, then a silent retry.**

Do NOT rename this product Scuttle, Stopcock, Parergon, Stereotype, Midden, Guillotine, Clepsydra, Fusee, Procrustes, Reed, Quench, Wildcat, Snatch, Deadman, or any existing catalog slug.
Do NOT reuse idle carrier / deadair / squelch on a later booth.
Do NOT reuse DM Serif Display + Lexend + JetBrains Mono (Scuttle). Do NOT reuse Literata + Source Sans 3 + IBM Plex Mono as a stack (Stopcock — body font Source Sans 3 is shared here, display and mono are not). Do NOT reuse Instrument Serif + Schibsted Grotesk + Fragment Mono (Parergon). Do NOT reuse Alegreya + Karla + Noto Sans Mono (Stereotype). Do NOT reuse Fraunces (Midden). Display here is **Oswald**. Body is **Source Sans 3**. Mono is **Share Tech Mono**.

Different surface: silent 900s API stall on Spectrum IPv6 → EWR vs remote-SSH `server.shutdown` / Streamable HTTP MCP hard seat / stealth-/btw-aside discard / version-string-only plugin freshness / WorktreePool orphaned-GC deadlock / Deny-only permission dialog / OTel water-clock / cron fusee / MCP palette / MCP contacts / hard-kill spend / shell-exit backgrounding.

Product name stays **Dead Air**. Name/slug `deadair` unused in catalog.json (253 products before this ship; Scuttle is #253).

Different UI: radio / broadcast control-room / charcoal studio / ON-AIR red lamp / amber VU / copper mic grille / soft CRT green. Oswald / Source Sans 3 / Share Tech Mono. NOT naval shipyard (Scuttle). NOT brass plumbing (Stopcock). NOT parchment/manuscript (Parergon). NOT letterpress (Stereotype). NOT scaffold/guillotine. NOT flintlock. NOT archaeological midden. NOT water-clock (Clepsydra). NOT theater green room.

Different verbs: Walk the booth, Cue carrier, Score deadair, Pin idle carrier, Pin seeded deadair, Light the lamp, Ride the VU, Key the mic, Reset the board.

Different idle: **carrier**. Different #93155 seeded path: **deadair**. HOLD: **carrier** / **timely-response**. ALARM: **deadair** / **squelch** / **ewr-colo** / **keepalive-acked** / **zero-response-bytes** / **api-timeout-900s** / **no-log-entry** / **quantized-stalls** / **stream-idle-120s**. Path: **squelch**.

## How to score

```bash
node --test projects/deadair/deadair.test.mjs
node projects/deadair/deadair.mjs projects/deadair/data/93155.json
node projects/deadair/deadair.mjs projects/deadair/data/carrier.json
echo '{"seed":"deadair"}' | node projects/deadair/deadair.mjs
```

Open the living card at `projects/deadair/index.html` (or the live path `/deadair/`). Buttons: Walk the booth, Cue carrier, Score deadair, Pin idle carrier, Pin seeded deadair, Pin squelch, Light the lamp, Ride the VU, Key the mic, Reset the board. Toggle timely-response / no-log / keepalive / zero-bytes / EWR — the score flips. Rest a fixture JSON on the cart tray. `?embed=1` hides chrome.

The booth reconstructs the reporter’s silent-stall walk from the published #93155 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/deadair/
- Folder: `projects/deadair/`

# Snubber

A **hydraulic / pneumatic pulse-damper booth** — snubber canister, copper line, pressure-gauge needle, srt-mux manifold, leaked peer valves, EPIPE pulse that should have been snubbed. Fonts **Fraunces** (display) + **Outfit** (body) + **IBM Plex Mono** (mono). Palette: bench iron `#16191d`, hydraulic amber `#e09a14`, copper `#b56a3a`, pulse crimson `#d4352a`, compressed air `#c5d4dc` — industrial accumulator bench, not earthwork clay / winter den / desert ash.

Primary:

- [anthropics/claude-code#93398](https://github.com/anthropics/claude-code/issues/93398) (OPEN, bug, has repro, platform:macos, area:bash, perf:cpu, area:sandbox). Title: `Killed sandboxed command leaks its SOCKS socket; main thread then spins on EPIPE at 100%+ CPU`. Filed by STRML 2026-09-10. Supersedes stale-closed #85666 (has repro). Claude Code **2.1.226** at first report (2026-08-11); still on **2.1.267**. macOS **26.6.1** (25G76), arm64. A sandboxed Bash command SIGKILLed while it has a network connection open leaks the accepted socket inside Claude Code. The event loop then writes to that dead socket forever, gets `EPIPE` every time, and never closes it or backs off. One leaked fd costs a full core for the life of the process. The reporter had four sessions doing this. `srt-mux-<pid>-<n>.sock` is the unix SOCKS5 proxy for sandbox network. Clean exits do not leak; the connection must die without closing.

02:50 snubber: a pulse-damper booth for #93398. Idle **damped** / seeded **spinning** / path **mux**. Score snubber or admit damped.

Score snubber or admit damped.

Idle word: **damped** (HOLD: peer closes clean; mux listener only; no EPIPE spin). Seeded word: **spinning** / #93398 (kill -9 mid-stream → leaked accepted fd → EPIPE busy-spin). Path word: **mux**. Product score: **snubber**. Never idle fosse / fossed / mounted / plan9 / hibernacle / warm / paged-out / majflt / honest / scapegoated / ungranted / scapegoat / bound / accreted / session-url / cartulary / sealed / mismatched / issuer / paraph / routed / inherited / cascade / appanage / afloat / washed / pontoon / concordant / concordat / reaped / revenant.

Phrase: **when a sandboxed command is SIGKILLed mid-stream and the mux relay leaves the accepted peer fd open so the write loop busy-spins on EPIPE, score snubber or admit damped.**

- **damped** = IDLE: HOLD; peer closes clean; mux listener only; no EPIPE spin
- **spinning** = #93398 seeded path: kill -9 mid-stream → leaked accepted fd → EPIPE busy-spin
- **snubber** = product score word for the canister that never snubbed the dead peer
- **mux** = path word: `srt-mux-<pid>-<n>.sock` unix SOCKS5 proxy; accepted peer left open
- **hold** = HOLD alias for idle damped
- **listener-only** = healthy session holds one fd — the srt-mux listener
- **leaked-fd** = lsof on srt-mux goes 1 → 6; one leaked accepted fd per killed child
- **epipe** = `sendto` returns `[ 32 ]` EPIPE; never closes or backs off
- **kill-9** = SIGKILL while a limit-rate connection is still open
- **socks5** = Bash sandbox filters network through the mux SOCKS5 proxy
- **srt-mux** = `srt-mux-<pid>-<n>.sock` (example `srt-mux-37591-0.sock`)
- **kevent64** = kevent64 returns immediately instead of sleeping — a spin, not an idle wait
- **sendto** = write loop; 20% of the main-thread sample
- **int32-max** = after seven hours CSW and SYSBSD saturated at INT32_MAX
- **four-sessions** = four sessions doing this at once; one leaked fd pegs a core each
- **has-repro** = Claude Code 2.1.226 then 2.1.267 · STRML · macOS 26.6.1 25G76 arm64
- **cousins** = cite-only #85666 — stale-closed has repro; do not rebuild
- **backups** = cite-only #93368 #93392 #93382 #93385 #93356 #93345 — do not auto-pick
- **fixtures** = listener-only / leaked-fd / mux path for the snubber booth
- **walk** = published idle damped → clean-exits → sandbox-on → limit-rate → kill-9 → leaked-fd → cpu-jump → sysbsd → epipe-spin → kevent64-spin → int32-max → four-sessions → spinning → mux → snubber

Verdicts: damped, spinning, snubber, mux, hold, listener-only, leaked-fd, epipe, kill-9, socks5, srt-mux, kevent64, sendto, int32-max, four-sessions, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the canister is **spinning** / **snubber** or already **damped**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): SOCKS mux relay fails to tear down accepted peer fd on abrupt client death, so the main-thread write loop busy-spins on EPIPE. Invite verify against #93398 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93398](https://github.com/anthropics/claude-code/issues/93398)
- Cite-only cousin: [anthropics/claude-code#85666](https://github.com/anthropics/claude-code/issues/85666) (stale-closed after 30 days despite has repro; superseded by #93398; do not rebuild)
- Backup (data only): #93368 Docker ~/.docker symlinks refuse plugin eval
- Backup (data only): #93392 rm-on-variable-path under bypassPermissions
- Backup (data only): #93382 worktreeDepSeed freeze
- Backup (data only): #93385 Cowork auto-repair vhdx
- Backup (data only): #93356 hooks fail on Windows username with space
- Backup (data only): #93345 RC worktrees deleted before archive

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:bash, perf:cpu, area:sandbox
- Claude Code **2.1.226** at first report (2026-08-11); still on **2.1.267**
- OS: macOS **26.6.1** (25G76), arm64
- Sandboxed command SIGKILLed while a network connection is open leaks the accepted socket
- Event loop writes to the dead socket forever, gets `EPIPE` every time, never closes or backs off
- One leaked fd costs a full core for the life of the process; reporter had four sessions
- Repro (encoded as data): Bash tool, sandbox on, allowlisted host; spawn a limit-rate fetch; `kill -9` mid-stream; `lsof` shows extra srt-mux peers; CPU ~6% → 128%; BSD syscalls millions/sec
- Before: 1 fd (listener). After five killed children: 6
- Clean exits do not leak (8 parallel + 10 serial stayed at 1). Connection must die without closing
- `srt-mux-<pid>-<n>.sock` is the unix SOCKS5 proxy for sandbox network
- `fs_usage`: all 4000 captured `sendto` calls failed `[ 32 ]` EPIPE; six fds round-robin
- `sample`: 56% kevent64, 20% `__sendto`, 17% `__ulock_wake`; kevent64 returns immediately
- After seven hours CSW and SYSBSD saturated at INT32_MAX
- Expected (issue only): `sendto` returning EPIPE should close the fd and drop it from the event loop; retry needs backoff and a give-up

Problem found: WHEN A SANDBOXED COMMAND IS SIGKILLED MID-STREAM AND THE MUX RELAY LEAVES THE ACCEPTED PEER FD OPEN SO THE WRITE LOOP BUSY-SPINS ON EPIPE.

Why this solution: a diagnostic hydraulic / pneumatic pulse-damper booth for the damped → spinning drift, so a reader can pin idle damped, load the #93398 spinning path, and score mux against the published facts. Conceptual snubber canister, copper line, EPIPE gauge, and mux manifold show whether the shock was snubbed. No live Claude session is required.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. `sendto` returning EPIPE should close the fd and drop it from the event loop
2. If there is a reason to retry at all, it needs a backoff and a give-up

## Why not a clone

This is specifically: **KILL -9 MID-STREAM LEAKS THE SRT-MUX ACCEPTED PEER FD SO THE WRITE LOOP BUSY-SPINS ON EPIPE** — hydraulic pulse-damper, not earthwork fosse / winter den / desert altar / monastic cartulary.

**NOT Fosse/#93358** (Win10 22H2 Plan9 host-honest attach vs guest 0/4 EINVAL). Different defect. NOT earthwork ditch.

**NOT Hibernacle/#93372** (Windows idle working-set trim / majflt stall). Different defect. NOT winter den.

**NOT Scapegoat/#93348** (ungranted chrome host executeScript hang/blame page). Different defect. NOT desert ash altar.

**NOT Cartulary/#93331** (mcpOAuth session-url accretion). Different defect. NOT oak scriptorium.

**NOT Paraph/#93327** (BYO OAuth issuer `%22`). Different defect. NOT notarial seal.

**NOT Appanage/#93307** (code-review fable crown inheritance). Different defect.

**NOT Pontoon/#93288** (Desktop restart washes RC bridges). Different defect. NOT harbor pontoon.

**NOT Concordat/#93290**. **NOT Revenant/#93274**.

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **kill -9 mid-stream leaks srt-mux accepted peer; write loop busy-spins on EPIPE** — unused in catalog as this hydraulic / pneumatic pulse-damper walk.

Do NOT rename this product Fosse, Hibernacle, Scapegoat, Cartulary, Paraph, Appanage, Pontoon, Concordat, Revenant, Replevin, Cognate, Lemures, Escheat, Mortmain, Strowger, Mondegreen, Derby, Vizard, Oubliette, Ephemera, Commutator, Heddle, Hectograph, Placet, Frisket, Tangent, Hawser, Caret, Buoy, Solecism, Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Damper, Snub, Ferrule, or any existing catalog slug.
Do NOT reuse idle damped / spinning / mux on a later booth.
Do NOT reuse Source Serif 4, Karla, Roboto Mono, Cormorant Garamond, Sora, or JetBrains Mono. Display here is **Fraunces**. Body is **Outfit**. Mono is **IBM Plex Mono**.

Different surface: macOS sandbox SOCKS mux EPIPE busy-spin after SIGKILL vs Win10 Plan9 host/guest EINVAL / Windows idle majflt / Chrome extension host-grant / credential-store accretion / Desktop issuer-quote formatter / skill-fork model inherit / Desktop RC wash / MCP header↔`_meta` discord.

Product name stays **Snubber**. Name/slug `snubber` unused in catalog.json (274 products before this ship; Fosse is #274).

Different UI: hydraulic / pneumatic pulse-damper / snubber canister / copper line / pressure-gauge needle / mux manifold / leaked peer valves / EPIPE pulse. Fraunces / Outfit / IBM Plex Mono. NOT earthwork / wet clay / sod lip (Fosse). NOT winter den / frost linen (Hibernacle). NOT desert ritual / ash altar (Scapegoat). NOT oak lectern / bound quires (Cartulary). NOT notarial instrument / wax press (Paraph). NOT royal-grant / heraldic inheritance desk (Appanage). NOT harbor pontoon / floating-bridge pier (Pontoon). NOT diplomatic chancery (Concordat). NOT leftover woodworking.

Different verbs: Charge the accumulator, Score snubber, Bleed the line, Count the mux peers, Pin idle damped, Pin seeded spinning, Pin mux, Vent the snubber.

Different idle: **damped**. Different #93398 seeded path: **spinning**. HOLD: **damped** / **hold**. ALARM: **spinning** / **snubber** / **mux** / **epipe** / **leaked-fd**. Path: **mux**.

## How to score

```bash
node --test projects/snubber/snubber.test.mjs
node projects/snubber/snubber.mjs projects/snubber/data/spinning.json
echo '{"seed":"spinning"}' | node projects/snubber/snubber.mjs
```

Open the living card at `projects/snubber/index.html` (or the live path `/snubber/`). Buttons: Charge the accumulator, Score snubber, Bleed the line, Count the mux peers, Pin idle damped, Pin seeded spinning, Pin mux, Vent the snubber. Toggle mux listener only / kill -9 mid-stream / leaked accepted fd / EPIPE write loop / kevent64 spin / CPU 128% peg / four sessions — the score flips. Lay a fixture JSON on the accumulator bench. `?embed=1` hides chrome.

The booth reconstructs the reporter’s clean-exit / kill -9 / leaked fd / EPIPE spin walk from the published #93398 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/snubber/
- Folder: `projects/snubber/`

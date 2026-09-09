# Scuttle

A **naval damage-control / shipyard booth** — weathered steel plate, signal orange, deep navy, teak deck grain, bilge green accents, brass porthole rim, cool floodlight; fonts **DM Serif Display** (display) + **Lexend** (body) + **JetBrains Mono** (mono) — for a real Claude Code defect: **REMOTE SSH DAEMON DESTROYS ALL RUNNING SESSIONS ON TRANSIENT RECONNECT INSTEAD OF REATTACHING.**

Primary:

- [anthropics/claude-code#93154](https://github.com/anthropics/claude-code/issues/93154) (OPEN, bug, has repro, platform:macos, platform:linux, area:core). Title: `Remote SSH daemon destroys all running sessions on transient reconnect instead of reattaching`. Filed 2026-09-09 by gofanly-reviewer. Remote `claude-ssh 4534d864…` (built 2026-09-02); remote CLI `ccd-cli 2.1.260`; remote Linux x86-64; client Claude desktop on macOS. Sequence: SSH channel drops briefly → client `channel_closed_no_socket` → warm-up fails `bridge_startup_timeout` → `RemoteServerController` issues `server --stop` / `server.shutdown` RPC without checking daemon liveness → daemon SIGKILLs all tracked child process groups (no SIGTERM stage, no grace, no active-session guard). Evidence: daemon still healthy 104s after drop (reaping exit code 0) in the same second shutdown arrives; then `cleanup: closed 1 connection(s), killed 42 child process group(s)`. Control: another daemon for a different account ran continuously 2 days with zero shutdowns — destructive stop is specifically the warm-up **failure** branch; ordinary reconnect already reuses a running daemon. Non-destructive path already exists in the same binary (takeover: SIGTERM-first, children orphaned). No user-side mitigation: no reuse/reattach/grace flag; no env gate; no drain/detach/reload RPC; docs cover host/port/identity only. Requested: probe with `server.ping` / `daemon.lock` (pid, instanceId, startedAt) before destroy; if stop required, use takeover semantics or an active-session guard.

03:50 scuttle: a naval shipyard / damage-control booth that should keep remote sessions **moored** (warm-up REATTACHES to a still-healthy daemon after a brief SSH blip); instead warm-up failure issues `server.shutdown` and SIGKILLs every tracked child (**scuttled**) — score scuttled or admit moored.

Score scuttled or admit moored.

Idle word: **moored** (HOLD: warm-up REATTACHES to a still-healthy remote daemon after a brief SSH channel drop). Seeded word: **scuttled** / #93154 (`channel_closed_no_socket` → `bridge_startup_timeout` → `server.shutdown` with no liveness probe; SIGKILL 42 process groups / 10 live `ccd-cli`). Path word: **scuttle**. Never idle open / seated / stopcock / preserved / discarded / fresh / stamped / cleared / mounded / distinct / conflated / held / steered / raised / fallen / sterling / primed / flashed / lodged / bypassed / greenroomed / scaffold / diplopic / freewheeling / doubled.

Phrase: **a brief network blip that SIGKILLs every healthy remote session instead of reattaching is not a moored ship — it is a scuttle. Score scuttled or admit moored.**

- **moored** = IDLE: HOLD; reattach to a still-healthy daemon; no shutdown; children live
- **scuttled** = #93154 seeded path: warm-up failure issues `server.shutdown`; SIGKILL children
- **scuttle** = path word: a brief blip that SIGKILLs is not a moored ship
- **reattach** = HOLD alias: ordinary reconnect already reuses a running daemon
- **hold** = HOLD alias for idle moored
- **server-shutdown** = `RemoteServerController` issues `server --stop` / `server.shutdown`
- **bridge-startup-timeout** = warm-up fails `bridge_startup_timeout`
- **channel-closed-no-socket** = client `channel_closed_no_socket` after a brief SSH drop
- **sigkill-children** = daemon SIGKILLs 42 process groups / 10 live `ccd-cli`; no SIGTERM, no grace
- **warm-up-failure** = destructive stop is specifically the warm-up failure branch
- **no-liveness-probe** = no `server.ping` / `daemon.lock` check before destroy
- **takeover-path-exists** = same binary already has SIGTERM-first takeover; children orphaned
- **has-repro** = remote `claude-ssh 4534d864…` + `ccd-cli 2.1.260` linux/macos walk
- **cousins** = cite-only #85567 #92687 #49790 #84468 #50982 #34255 — do not clone
- **fixtures** = row list for the scuttle booth
- **walk** = published idle moored → channel-closed-no-socket → bridge-startup-timeout → warm-up-failure → no-liveness-probe → server-shutdown → daemon-still-healthy → sigkill-children → takeover-path-exists → scuttled → scuttle

Verdicts: moored, scuttled, scuttle, hold, reattach, server-shutdown, bridge-startup-timeout, channel-closed-no-socket, sigkill-children, warm-up-failure, no-liveness-probe, takeover-path-exists, has-repro, cousins, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring shipyard booth. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the ship is **scuttled** or already **moored**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): warm-up failure branch may select destructive `server.shutdown` instead of the existing reattach/reuse path. Invite verify against #93154 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93154](https://github.com/anthropics/claude-code/issues/93154)
- Cite-only: [anthropics/claude-code#85567](https://github.com/anthropics/claude-code/issues/85567) (Remote SSH parks on "Reconnecting" for hours after successful reconnect)
- Cite-only: [anthropics/claude-code#92687](https://github.com/anthropics/claude-code/issues/92687) (relaunching app replaces running ccd-cli)
- Cite-only: [anthropics/claude-code#49790](https://github.com/anthropics/claude-code/issues/49790) (feature request: SSH remote session should survive client disconnect)
- Cite-only: [anthropics/claude-code#84468](https://github.com/anthropics/claude-code/issues/84468) (Remote Control spawns without --resume wiping context)
- Cite-only: [anthropics/claude-code#50982](https://github.com/anthropics/claude-code/issues/50982) (Desktop Windows remote SSH loses UI message history after reboot)
- Cite-only: [anthropics/claude-code#34255](https://github.com/anthropics/claude-code/issues/34255) (Remote Control automatic reconnection doesn't work)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, platform:linux, area:core
- Filed 2026-09-09 by gofanly-reviewer
- SSH channel drops briefly → `channel_closed_no_socket` → warm-up fails `bridge_startup_timeout`
- `RemoteServerController` issues `server --stop` / `server.shutdown` without checking daemon liveness
- Daemon SIGKILLs all tracked child process groups (no SIGTERM, no grace, no active-session guard)
- Daemon still healthy 104s after drop (reaping exit code 0) in the same second shutdown arrives
- Then `cleanup: closed 1 connection(s), killed 42 child process group(s)` (10 live `ccd-cli`)
- Control: another daemon for a different account ran 2 days with zero shutdowns
- Destructive stop is specifically the warm-up failure branch; ordinary reconnect already reuses a running daemon
- Non-destructive takeover path already exists (SIGTERM-first; children orphaned)
- No reuse/reattach/grace flag; no env gate; no drain/detach/reload RPC
- Requested: probe with `server.ping` / `daemon.lock` before destroy

Problem found: A BRIEF NETWORK BLIP THAT SIGKILLS EVERY HEALTHY REMOTE SESSION INSTEAD OF REATTACHING IS NOT A MOORED SHIP — IT IS A SCUTTLE.

Why this solution: a diagnostic shipyard booth for the moored → scuttled drift, so a reader can pin idle moored, load the #93154 scuttled path, and score scuttle / server-shutdown / bridge-startup-timeout / channel-closed-no-socket against the published facts.

## Why not a clone

This is specifically: **REMOTE SSH DAEMON DESTROYS ALL RUNNING SESSIONS ON TRANSIENT RECONNECT INSTEAD OF REATTACHING.**

**NOT Stopcock/#93143** (Streamable HTTP MCP ~6min hard seat). Different paradigm.

**NOT Parergon/#93122** (stealth idle over an open `/btw` side chat). Different paradigm.

**NOT Stereotype/#93108** (plugin update version-string-only freshness). Different paradigm.

**NOT Midden/#93081** (WorktreePool partial-remove GC remound loop). Different paradigm.

**NOT Diplopia/#93012** (Remote Control environment-label field split). Different paradigm.

**NOT Greenroom/#92988** (Desktop Code tab missing wait-for-full-turn-end queue). Different paradigm.

**NOT Guillotine/#92974** (background-mode Deny-only permission dialog). Different paradigm.

**NOT Entresol/#93010**. **NOT Hallmark/#93021**. **NOT Flashpan/#93015**. **NOT Secateurs/#92979**. **NOT Palinode/#92998**. **NOT Ferrule/#92968**.

**NOT Clepsydra** (OTel). **NOT Fusee** (cron). **NOT Procrustes** (MCP palette). **NOT Reed** (MCP contacts). **NOT Quench** (hard kill spend).

**NOT Wildcat/#92399** or **#93126** (run_in_background shell-exit false completion).

**NOT Snatch / Deadman** (Bash timeout backgrounding / process-tree).

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **warm-up-failure `server.shutdown` SIGKILLs every tracked remote child instead of reattaching to a still-healthy daemon.**

Do NOT rename this product Stopcock, Parergon, Stereotype, Midden, Guillotine, Clepsydra, Fusee, Procrustes, Reed, Quench, Wildcat, Snatch, Deadman, or any existing catalog slug.
Do NOT reuse idle moored / scuttled / scuttle on a later ship.
Do NOT reuse Literata + Source Sans 3 + IBM Plex Mono (Stopcock). Do NOT reuse Instrument Serif + Schibsted Grotesk + Fragment Mono (Parergon). Do NOT reuse Alegreya + Karla + Noto Sans Mono (Stereotype). Do NOT reuse Fraunces (Midden). Do NOT reuse Cormorant Garamond / Atkinson Hyperlegible / Source Code Pro (Diplopia). Display here is **DM Serif Display**. Body is **Lexend**. Mono is **JetBrains Mono**.

Different surface: remote SSH warm-up failure → destructive `server.shutdown` vs Streamable HTTP MCP hard seat / stealth-/btw-aside discard / version-string-only plugin freshness / WorktreePool orphaned-GC deadlock / Deny-only permission dialog / OTel water-clock / cron fusee / MCP palette / MCP contacts / hard-kill spend / shell-exit backgrounding.

Product name stays **Scuttle**. Name/slug `scuttle` unused in catalog.json (252 products before this ship; Stopcock is #252).

Different UI: naval damage-control / shipyard / weathered steel plate / signal orange / deep navy / teak deck grain / bilge green / brass porthole rim / cool floodlight. DM Serif Display / Lexend / JetBrains Mono. NOT brass plumbing (Stopcock). NOT parchment/manuscript (Parergon). NOT letterpress (Stereotype). NOT scaffold/guillotine. NOT flintlock. NOT archaeological midden. NOT water-clock (Clepsydra). NOT deck sheave. NOT fusee dial.

Different verbs: Walk the yard, Admit moored, Score scuttled, Pin idle moored, Pin seeded scuttled, Sound the well, Flood the hold, Read the lock, Reset the berth.

Different idle: **moored**. Different #93154 seeded path: **scuttled**. HOLD: **moored** / **reattach**. ALARM: **scuttled** / **scuttle** / **server-shutdown** / **bridge-startup-timeout** / **channel-closed-no-socket** / **sigkill-children** / **warm-up-failure** / **no-liveness-probe**. Path: **scuttle**.

## How to score

```bash
node --test projects/scuttle/scuttle.test.mjs
node projects/scuttle/scuttle.mjs projects/scuttle/data/93154.json
node projects/scuttle/scuttle.mjs projects/scuttle/data/moored.json
echo '{"seed":"scuttled"}' | node projects/scuttle/scuttle.mjs
```

Open the living card at `projects/scuttle/index.html` (or the live path `/scuttle/`). Buttons: Walk the yard, Admit moored, Score scuttled, Pin idle moored, Pin seeded scuttled, Pin scuttle, Sound the well, Flood the hold, Read the lock, Reset the berth. Toggle reattach / liveness-probe / shutdown / sigkill — the score flips. Rest a fixture JSON on the berth tray. `?embed=1` hides chrome.

The booth reconstructs the reporter’s remote-SSH reconnect walk from the published #93154 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/scuttle/
- Folder: `projects/scuttle/`

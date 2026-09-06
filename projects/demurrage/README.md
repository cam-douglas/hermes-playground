# Demurrage

A **demurrage clerk's laytime / overstay ledger** — harbour office teal, night-ink, amber demurrage tally, steel ledger rules, berth occupancy board, orphan-daemon socket registry, deleted-binary hulk tags; Newsreader + Public Sans + IBM Plex Mono — for a real Claude Code defect: **ON A SELF-HOSTED LINUX REMOTE DAEMON, CLAUDE CODE ACCUMULATES ONE ~300 MB `ccd-cli` PROCESS PER CHAT AND NEVER FREES THEM.** Reopening a chat under the same daemon spawns a duplicate against the same `--resume` UUID. Client updates start a new daemon on a new socket while the old one keeps every chat it held. CLI prune deletes old binaries but leaves processes still executing them. Daemon flags have no idle timeout, session cap, or eviction. Two hard host outages. When the berth is released or reused (**cleared**), that is the hold path.

Primary:

- [anthropics/claude-code#92548](https://github.com/anthropics/claude-code/issues/92548) (OPEN, bug, has repro, platform:linux, perf:memory, area:self-hosted-environments). Title: `Remote daemons never release chat processes and outlive their clients (self-hosted, ~300MB/chat, two hard outages)`. Filed 2026-09-06T20:19:28Z. Reporter: jbast1224. ccd-cli 2.1.260 (2.1.247, 2.1.255, 2.1.258 also resident). Daemon build `7d193f89fc02cf1035a391245312e34ad419f63e`, built 2026-08-25T00:11:43Z. Bridge `4534d8648b686881955c6f13baf46ae72ee72f4c`. Unraid, Linux 6.12.24, 15 GB RAM, no swap. Tailscale SSH. Desktop and mobile apps only.

08:50 demurrage: a demurrage clerk's laytime ledger that should release or reuse each remote chat berth when the vessel leaves but instead lets ~300MB ccd-cli sessions accrue unpaid — duplicates on the same --resume UUID, daemons idle days after last client, processes still running pruned binaries — until the self-hosted host is seized (#92548). Score accruing or admit cleared.

Idle word: **accruing** (chat berths stay occupied after the vessel leaves; ~300MB `ccd-cli` per chat, never released). Seeded state: **cleared** / #92548 — process released or reused, daemon vacated. Never idle as sheared, fayed, overladen, trimmed, defocused, sharp, skimmed, intact, mislabeled, scoped, saturating, vented, preheating, lit, hangfired, executed, thrashing, responsive, leaking, excised, remanent, rewritten, or truncated.

**Demurrage** = the shipping charge that accrues when a vessel overstays its allotted laytime. The remote daemon should release or reuse a chat process when the chat closes / idles; instead sessions accrue like unpaid demurrage — duplicates, orphan daemons, and even hulks still running deleted binaries — until the host is seized.

- **accruing** = IDLE: chat berths stay occupied; ~300MB `ccd-cli` per chat, never released
- **cleared** = seeded word: process released on close/idle; `--resume` reused; daemon vacated
- **duplicate-resume** = same `--resume` UUID twice under socket `5b2efa6a`, started ~48h apart
- **daemon-orphan** = `85fbdb5e` 11 days up / 4 days since last client; idle daemons reparented to init
- **deleted-binary** = `2.1.247` x2 still executing after `-cli-keep` (default 3) prune
- **no-lifecycle-flags** = no idle timeout / max-session / eviction; only `-stop` (all-or-nothing)
- **outage-census** = 2026-08-31 load 87 / 23 sessions / 8.1 GB; 2026-09-01 load 97 / 59 sessions / ~15 GB
- **cousins** = cite-only #92059 #1935 #49790

Verdicts: accruing, cleared, duplicate-resume, daemon-orphan, deleted-binary, no-lifecycle-flags, outage-census, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a remote-daemon chat berth would sail **accruing** on unpaid laytime or already **cleared**. Fixtures use the issue's process table, sockets, hulks, flags, and outages only.

Hypothesis only (NON-BINDING): the remote daemon has no session lifecycle — no release on chat close, no reuse of `--resume` UUID, no exit on client disconnect, and prune does not restart processes still executing the deleted binary. Verify nothing in closed source — encode issue facts only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92548](https://github.com/anthropics/claude-code/issues/92548)
- Cousins cite-only (NOT primary): [anthropics/claude-code#92059](https://github.com/anthropics/claude-code/issues/92059), [anthropics/claude-code#1935](https://github.com/anthropics/claude-code/issues/1935), [anthropics/claude-code#49790](https://github.com/anthropics/claude-code/issues/49790)
- Neighbourhood contrast only: [anthropics/claude-code#92510](https://github.com/anthropics/claude-code/issues/92510) (Bourdon — Cowork VM host fd climb on macOS)

What happened (from the issue — do not invent):

- On a self-hosted Linux server (Unraid, Linux 6.12.24, 15 GB RAM, no swap), Claude Code's remote daemon accumulates one ~300 MB `ccd-cli` process per chat and never frees them. Transport is Tailscale SSH. Clients are the desktop and mobile apps only — no terminal use.
- Opening a chat starts a `ccd-cli` process holding 250–420 MB. It stays resident indefinitely, long after the chat is finished.
- Reopening a chat under the *same* daemon spawns a duplicate against the same `--resume` UUID. Decisive row: conversation `2e283802` PID 363856 and PID 267743 on socket `5b2efa6a`, started ~48h apart.
- Each client update starts a new daemon on a new socket; the old daemon keeps running indefinitely with every chat it was holding. Socket `85fbdb5e` was alive 11 days, 4 days after anything last connected. Idle daemons self-daemonized and reparented to init.
- The daemon prunes old CLI builds (`-cli-keep`, default 3) but does not restart processes using them. Version 2.1.247 was pruned and two processes were still executing it.
- There is no idle timeout, session cap, or eviction in the daemon's flag list. Only `-stop` (all-or-nothing per daemon). Apps have no per-chat control.
- Two hard outages: 2026-08-31 load 87 / ~60 D-state / 23 abandoned sessions holding 8.1 GB; 2026-09-01 load 97 / 324 MB free of 15 GB / 59 sessions holding ~15 GB. Printers dropped MQTT simultaneously. No swap → machine stops responding.
- Prior mitigation: two idle daemons shut down with `-stop` released four chats and recovered ~478 MB. Processes accumulated again.
- Expected: process released on close or idle; reopen reuses `--resume`; daemon exits after last client or hands sessions to the successor; session count and per-chat end from the apps.

Problem found: server-side remote-daemon chat process lifecycle on Linux self-host — never release, duplicate on reopen, daemon outlives client, deleted-binary still running, no per-chat controls.

Why this solution: a diagnostic scorer for the accruing → cleared demurrage chain, so a reader can admit idle accruing, pin seeded cleared, and score duplicate-resume / daemon-orphan / deleted-binary / no-lifecycle-flags / outage-census / cousins against the published facts.

## Why not a clone

This is specifically: **server-side remote-daemon chat process lifecycle on Linux self-host — never release, duplicate on reopen, daemon outlives client, deleted-binary still running, no per-chat controls.**

NOT Bourdon/#92510 — host Apple Virtualization fd climb / kern.maxfiles (fd saturation vs remote daemon chat process overstay).
NOT Wastegate/#92059 — client memory governor 0-of-0 + remote-control veto (CLIENT side; cite-only cousin here).
NOT Thrash/#88257 — RSS/event-loop stall.
NOT Scarph/#92543 — Windows Bash `-c` shear.
NOT Plimsoll/#92434 — stale auto-compact threshold.
NOT Glowplug/#85050, Hangfire/#92478, Diopter/#92524, Decant/#92515, Catachresis/#92518 or any prior catalog slug.
NOT #92539 — Remove-Item spaced-path false-positive guard.
NOT #92542 — deny unwrap wrapper bypass.

Stay OFF all prior catalog slugs/paradigms: Scarph / Plimsoll / Bourdon / Wastegate / Thrash / Diopter / Decant / Catachresis / Glowplug / Hangfire and every existing slug in catalog.json.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle sheared / fayed / overladen / trimmed / defocused / sharp / skimmed / intact / mislabeled / scoped / saturating / vented / preheating / lit / hangfired / executed / thrashing / responsive / leaking / excised / remanent / rewritten / truncated.
Do NOT reuse seeded fayed / trimmed / sharp / intact / scoped / lit / executed / responsive / excised / rewritten / vented.

Different surface: Linux self-hosted remote-daemon chat process overstay vs Windows `-c` shear / stale auto-compact / VM host fd climb / client memory governor.

Product name stays **Demurrage**. Name/slug `demurrage` confirmed unused in catalog.json (191 products).

Different UI: harbour office teal / night-ink / amber demurrage tally / steel ledger rules / berth occupancy board / orphan-daemon socket registry / deleted-binary hulk tags. Newsreader / Public Sans / IBM Plex Mono. NOT Cormorant/Outfit/Roboto Mono (Scarph). NOT Libre Baskerville/Nunito (Plimsoll). NOT Petrona/Fragment Mono (Diopter). NOT Spectral/Karla (Decant). NOT Fraunces/Manrope (Catachresis). NOT Archivo Black/Sora (Bourdon). NOT Teko (Glowplug). NOT Bebas/Barlow. NOT Anybody/Source Sans (Hangfire). NOT oak shipwright bench, NOT Plimsoll chalk disc, NOT bourdon-tube bay, NOT wastegate valve.

Different verbs: admit accruing, pin seeded cleared, score accruing vs cleared, load #92548 fixture, score the ledger.

Different idle: **accruing**. Different seeded: **cleared**. HOLD: **cleared**. ALARM: **accruing** / **duplicate-resume** / **daemon-orphan** / **deleted-binary** / **no-lifecycle-flags** / **outage-census** / **cousins**.

Cousins cite-only (NOT primary):

- [#92059](https://github.com/anthropics/claude-code/issues/92059) — Windows memory-pressure governor evicts 0 of 0 idle while remote control vetoes pause. CLIENT side. Primary stays #92548.
- [#1935](https://github.com/anthropics/claude-code/issues/1935) — orphaned MCP servers. Different component, same lifecycle family. Primary stays #92548.
- [#49790](https://github.com/anthropics/claude-code/issues/49790) — requests the opposite behaviour (sessions surviving disconnect). Primary stays #92548.

Bourdon/#92510 is a different Cowork VM host fd climb on macOS — neighbourhood contrast only, not a cousin of this ledger.

## Live catalog path

`/demurrage/` is this static demurrage clerk's ledger scoring assay. Path `https://hermes-playground-green.vercel.app/demurrage/` and subdomain `https://demurrage.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `08:50 Sydney · demurrage · catalog #192 · #92548`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Idle **accruing** → berths stay occupied; ~300MB `ccd-cli` per chat.
2. Seeded **cleared** → released or reused; daemon vacated.
3. Diagnostic **duplicate-resume** → `2e283802` twice on `5b2efa6a` ~48h apart.
4. Diagnostic **daemon-orphan** → 11d/4d idle socket; reparented to init.
5. Diagnostic **deleted-binary** → `2.1.247` x2 still executing after prune.
6. Diagnostic **no-lifecycle-flags** → no idle / max / eviction; only `-stop`.
7. Diagnostic **outage-census** → 2026-08-31 8.1 GB / 2026-09-01 ~15 GB.
8. Diagnostic **cousins** → #92059 #1935 #49790 cite-only.
9. Assay UI: harbour office, laytime clock, berth occupancy, socket registry, hulk tags, flag strip, outage timeline.
10. Stay-off strip: Scarph oak bench / Plimsoll chalk disc / Bourdon tube / Wastegate valve / Thrash CRT. Primary stays #92548.
11. **Score the ledger** walks the probe ticket and lights chips on the clerk's desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/demurrage/index.html` in a browser, or serve the repo root and visit `/demurrage/` (Vercel rewrite → `/projects/demurrage`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
node --test projects/demurrage/hook/demurrage.test.mjs
```

Empty paste scores the idle **accruing** ticket if you admit accruing. Paste a probe on the page or drop a fixture from `data/`. The living page admits **accruing** / remote-daemon overstay / #92548.

## Hook

`projects/demurrage/hook/` scores a probe `{ seed, accruing, cleared, duplicateSameDaemon, deletedBinary, noLifecycleFlags, idleDays }` and returns `{ verdict, reasons[], accruing, cleared, chips[], berth }`. See `hook/README.md`.

```bash
node projects/demurrage/hook/index.mjs projects/demurrage/data/92548.json
echo '{"seed":"cleared","cleared":true,"released":true}' | node projects/demurrage/hook/index.mjs
```

`cleared` is true ONLY when the verdict is cleared (the berth is released or reused). Seeded 92548 numbers must produce accruing / `cleared=false` on the remote-daemon overstay path. An accruing berth is never the hold path.

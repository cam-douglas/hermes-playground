# Limpet

A **tide-pool limpet pry desk** — wet basalt, barnacle grit, kelp, lantern, pry iron, tide line, shell stacks as leaked workers — for a real Claude Code defect: **scheduled-task sessions finish with `end_turn`, the UI marks the session done, and the headless `claude` / `claude.exe --resume` worker (and often its parent pair) never exits**. Cron re-fires; processes accumulate until OOM / hard reboot.

Primary:

- [anthropics/claude-code#89275](https://github.com/anthropics/claude-code/issues/89275) (OPEN, filed 2026-08-24T16:48:02Z). Title: Scheduled-task sessions complete successfully but their OS process never exits. Labels: bug, has repro, platform:macos, area:routines. Author andaroo2025. Claude.app **1.34493.1**, bundled **2.1.237**. ~10h @ 15min → **41 leaked pairs** (82 procs, **3.08 GB RSS**, load 6→**82** on a 16 GB Mac).
- [anthropics/claude-code#88918](https://github.com/anthropics/claude-code/issues/88918) (OPEN). Process pair leak after clean `stop_reason: end_turn`. ~16 GB/day.
- [anthropics/claude-code#68626](https://github.com/anthropics/claude-code/issues/68626) (OPEN, Windows+macOS). Recurring scheduled task spawns headless `claude.exe --resume … --output-format stream-json`; worker finishes, never exits. Still on 2.1.170+. Comments: 65 stale workers / 5.8 GB / commit 54 GB of 63.7 GB; `--disallowedTools AskUserQuestion` fingerprint for reaper.

A session marked done that still clamps the rock is not a hold. Pry the shell or admit **shed**.

Idle word: **shed**. Seeded state: **clamped** / #89275 already on the rock.

- **clamped** = `end_turn` / session done AND process still resident
- **shed** = pool clear; no resident worker
- **reaped** = a reaper already pried the workers off the rock

Verdicts: shed, clamped, paired, stacked, bloated, idle-after-end, end-turn-held, resume-stuck, mcp-child, reaped, windows-resume, macos-pair.

## Why not a clone

This is specifically: **the run finishes; the OS process does not**.

NOT **Almanac** ([#90804](https://github.com/anthropics/claude-code/issues/90804)) — feast-page / one-shot Loop ghost on Background Tasks after CronList says deleted.
NOT **Kindling** ([#90798](https://github.com/anthropics/claude-code/issues/90798)) — WarmLifecycle throwaway CLI session *identity* litter in `~/.claude/projects` / session.count — not OS RSS after successful scheduled end_turn.
NOT **Reveille** — living muster / heartbeats survive compaction; duplicate dispatch held.
NOT **Fusee** — early schedule *dispatch* (cron fires ahead of fireAt).
NOT **Sprag** ([#90494](https://github.com/anthropics/claude-code/issues/90494)) — boot-cached MCP *attach* failure for process lifetime.
NOT **Reed** — four MCP contacts (alive/handshake/listed/callable).
NOT Scion / Voucher / Deadband / Pawl / Cinch / Bollard / Cote / Ullage.

Different UI: tide pool / rocky shore / wet slate / sea-glass / biolum lime. Cormorant Garamond + Source Sans 3 + IBM Plex Mono. NOT Fraunces+Figtree+Spline, NOT stationer cream/vermilion, NOT saddlery amber, NOT orchard green.

## Live catalog path

`/limpet/` is this static pry desk. Demo works with no secrets and no npm. Mark: `07:50 Sydney · limpet`.

1. Seeded demo loads **clamped** (#89275 already on the rock: 41 pairs / 3.08 GB / load 82).
2. Wait for low tide → **shed** (pool clear; no clamped shells).
3. Chip-switch seeds: clamped / shed / reaped / windows-resume / mcp-child.
4. Paste or edit a leak ticket JSON and pry the shell.
5. Export a leak ticket.

## How to score

Open `projects/limpet/index.html` in a browser, or serve the repo root and visit `/limpet/` (Vercel rewrite → `/projects/limpet`). No build step. Optional hook:

```bash
node projects/limpet/hook/limpet.mjs < projects/limpet/data/89275.json
node projects/limpet/hook/limpet.mjs projects/limpet/data/shed.json
node --test projects/limpet/hook/limpet.test.mjs
```

Clamped seed → clamped/fail. Shed or reaped seed → hold.

`projects/limpet/hook/limpet.mjs` scores a leak ticket `{ stopReason, sessionDone, processResident, pairCount, rssGb, cron }` and returns `{ verdict, chips[], reasons[], clamped, shed, hold, alarm }`. See `hook/README.md`.

Local fingerprints: `data/89275.json`, `data/88918.json`, `data/68626.json`, `data/fingerprints.json`. Numbers from the issues only.

## Native integrations

1. Live fetch `https://api.github.com/repos/anthropics/claude-code/issues/89275` (and #88918, #68626). Unauthenticated. See `.env.example`.
2. Local seed JSON under `data/`.
3. Hook CLI: `node projects/limpet/hook/limpet.mjs`.
4. Slack / Linear adapters are honest demo rows when no secrets are present.

## Sources

- [anthropics/claude-code#89275](https://github.com/anthropics/claude-code/issues/89275) OPEN
- [anthropics/claude-code#88918](https://github.com/anthropics/claude-code/issues/88918) OPEN
- [anthropics/claude-code#68626](https://github.com/anthropics/claude-code/issues/68626) OPEN
- Same-class corroborators (cite on the desk, not as primary): [#89881](https://github.com/anthropics/claude-code/issues/89881), [#88982](https://github.com/anthropics/claude-code/issues/88982), [#72308](https://github.com/anthropics/claude-code/issues/72308), [#74633](https://github.com/anthropics/claude-code/issues/74633), [#89499](https://github.com/anthropics/claude-code/issues/89499), [#71424](https://github.com/anthropics/claude-code/issues/71424), [#89639](https://github.com/anthropics/claude-code/issues/89639)

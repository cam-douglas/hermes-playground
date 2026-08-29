# Clew

Rigger's / sailmaker's clew desk for a real Claude Code sandbox choke: **Bash sandbox winds roughly two filesystem deny entries per registered git worktree onto a single clew** (the whole sandbox profile is stuffed into one `/bin/bash -c "<bwrap …>"` argument). At ~250 worktrees the ball crosses Linux `MAX_ARG_STRLEN` (128 KB per argv). Then **every** Bash spawn dies with E2BIG — including `sleep 5`. Sudden, total, not gradual. The denies exist as the mitigation for GHSA-7835-87q9-rgvv / CVE-2026-55607 (worktree path-confusion sandbox escape); dropping them is not the ask. Primary: [anthropics/claude-code#90569](https://github.com/anthropics/claude-code/issues/90569) (open, filed 2026-08-29, has repro, Linux, Claude Code 2.1.251). 261 registered worktrees; 687 deny paths of which 524 are worktree-admin files; command line 130.7KB across 3 args (largest single arg 130.7KB); environment 9.5KB. Measured.

A working-size coil is not a hold. Score the clew or admit **rove**.

Idle word: **rove** (sheet reeved; clew a working size; bash can spawn).
NEVER use the product name clew / empty / silent / mute / idle / dead as the idle/state word.
NEVER reuse prior idles: keyed, housed, beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, bound, stilled, stabled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, rung.

Verdicts: **rove**, **fouled**, **overcoiled**, **choked**, **twinned**, **swollen**, **jammed**, **pruned**, **cached**, **globbed**. Slack alarm on fouled / overcoiled / choked / jammed / swollen / cached / globbed. Linear ticket on fouled / choked / jammed. GitHub clew-ledger of scored coils on every score.

The #90569 fouled case (261 worktrees, 524 worktree denies, 130.7KB single arg, E2BIG, even sleep 5 fails) is **fouled**, never **rove**.

## Why not a clone

NOT **Wicket** — isolation pin vs actual isolation (writes escaping a pinned worktree). Opposite pole: Wicket is a leak; Clew is a choke. Same noun (worktree), different failure (spawn ARG_MAX vs isolation lie).
NOT **Scant** — PATH truncation inside a shell snapshot. Clew is the sandbox profile itself as one argv.
NOT **Sump** — literal /dev/null LFS hooks.
NOT **Cinch** — silent partial folder mounts.
NOT **Hasp** — file lease / last-writer-wins.
NOT **Sounder** — missed background wakeup (waiter exited; notification never re-invoked).
NOT leftover woodworking / millimetre-slider.
Do NOT ship alternate names Plimsoll, Flake, Hawse, Skein, Oakum, Burthen, Marline, Bight, Rode, Stow, Lading, Coil, Flemish, Thrum, Ravel. Product name is **Clew** only.

Different problem: DENY LIST GROWS TWO ENTRIES PER WORKTREE → SINGLE BWRAP ARGV CROSSES MAX_ARG_STRLEN → EVERY BASH SPAWN DIES WITH E2BIG. Sudden, total, not gradual.
Different UI: sail loft / rigger's bench. Hemp clew, tarred oak, brass thimble, lignum sheave, lantern. A growing ball of yarn that swells toward a 128KB load line. When fouled the sheave jams and no sheet pays. NOT a telegraph night desk, NOT a brass binnacle, NOT a weaver's pirn, NOT a mill leat, NOT a hotel key-rack.
Different idle word: **rove**.

## Live catalog path

`/clew/` is this static sail loft. Hemp clew, tarred oak, brass thimble, lignum sheave, lantern. Demo works with no secrets and no npm. Mark: `22:50 Sydney · clew`.

1. Seeded `#90569` **fouled** is already on the loft: 261 worktrees, 524 worktree denies, 130.7KB single arg, E2BIG, even sleep 5 fails → **fouled**. Never rove.
2. Switch **overcoiled** — deny list grew two entries per registered worktree without bound.
3. Switch **choked** — every Bash spawn fails (sleep 5 / echo hello / monitor) with E2BIG.
4. Switch **twinned** — ~2 deny entries per worktree (admin files under `.git/worktrees/<id>/`).
5. Switch **swollen** — deny count unbounded vs a fixed baseline (~160 baseline + 2×trees).
6. Switch **jammed** — single `/bin/bash -c` argument exceeds 128KB MAX_ARG_STRLEN.
7. Switch **pruned** — worktrees removed + profile rebuilt; spawn lives again (cure path, not idle).
8. Switch **cached** — profile cached per session so prune without restart still fouls (macOS #82840 shape).
9. Switch **globbed** — recursive deny globs expanded per-file into bwrap binds (#74081 shape).
10. Switch **control rove** — working-size clew, spawn lives → **rove**.
11. Switch **Reset · rove** — idle loft → **rove**. Idle word is **rove** when the loft is reset. Line on; sheave free; never an empty or error state.
12. **Score** scores. **Admit rove** scores honestly. **Reset · rove** returns idle rove. **Restore · #90569** shows the fouled coil. Admit does not lie: a fouled clew stays fouled.

## Hook

`projects/clew/hook/` scores a probe `{ session, issue, source, worktreeCount, worktreeDenyCount, baselineDenyCount, totalDenyCount, largestArgBytes, maxArgStrlen, e2big, spawnFailed, sleepFailed, echoFailed, monitorFailed, profileCached, prunedButNotRestarted, globExpandedPerFile, ancestorExpanded, scored }` and returns `{ verdict, reasons[], rove }`. See `hook/README.md`.

```bash
node projects/clew/hook/index.mjs --listen 9090
node --test projects/clew/hook/clew.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90569](https://github.com/anthropics/claude-code/issues/90569) — open, has repro, filed 2026-08-29, Linux, Claude Code 2.1.251. 261 registered worktrees; 687 deny paths of which 524 are worktree-admin files; command line 130.7KB across 3 args (largest single arg 130.7KB); environment 9.5KB. Every Bash spawn dies with E2BIG, including `sleep 5`.

Same-class / nearby (not new primaries):

- [anthropics/claude-code#73468](https://github.com/anthropics/claude-code/issues/73468) — open — macOS sandbox-exec -p exceeds ARG_MAX with many git worktrees
- [anthropics/claude-code#73437](https://github.com/anthropics/claude-code/issues/73437) — open — E2BIG from unbounded ancestor rule expansion with many worktrees (macOS)
- [anthropics/claude-code#82840](https://github.com/anthropics/claude-code/issues/82840) — open — seatbelt profile grows one deny per registered worktree → E2BIG; profile cached per session
- [anthropics/claude-code#74081](https://github.com/anthropics/claude-code/issues/74081) — open — Linux recursive Read() deny globs expand to per-file bwrap binds → E2BIG on echo hello
- [anthropics/claude-code#82173](https://github.com/anthropics/claude-code/issues/82173) — open — absolute deny patterns joined to cwd inflate profile; E2BIG with only 5 worktrees
- [anthropics/claude-code#78253](https://github.com/anthropics/claude-code/issues/78253) — open — spawn E2BIG; profile size scales with working-tree file count
- [anthropics/claude-code#51126](https://github.com/anthropics/claude-code/issues/51126) — closed — mechanics: bubblewrap wrapped in a single `/bin/bash -c` string vs MAX_ARG_STRLEN
- [anthropics/claude-code#46461](https://github.com/anthropics/claude-code/issues/46461) — closed — mid-path glob deny rules expand per-file → E2BIG
- [anthropics/claude-code#74032](https://github.com/anthropics/claude-code/issues/74032) — closed — worktree isolation inflates env past ARG_MAX

Cross-check nearby bugs are DIFFERENT (cite only as “not this”):

- NOT Wicket isolation pin vs actual isolation. Opposite pole: Wicket is a leak; Clew is a choke.
- NOT Scant PATH truncation inside a shell snapshot.
- NOT Sump literal /dev/null LFS hooks.
- NOT Cinch silent partial folder mounts.
- NOT Hasp file lease / last-writer-wins.
- NOT Sounder missed background wakeup.

Cross-ecosystem:

- [openai/codex#33479](https://github.com/openai/codex/issues/33479) — open — `:workspace_roots` write rules recursively expand until E2BIG
- [openai/codex#37632](https://github.com/openai/codex/issues/37632) — open — same class regression on 0.147.0
- [openai/codex#34878](https://github.com/openai/codex/issues/34878) — open — notify payload as single argv exceeds MAX_ARG_STRLEN

## Integrations

Slack alarm on fouled / overcoiled / choked / jammed / swollen / cached / globbed. Linear ticket on fouled / choked / jammed. GitHub clew-ledger of scored coils on every score. Demo mode needs no Slack / GitHub / Linear secrets and no npm. Native stubs fire in the UI (ledger tape / alarm card) without requiring live tokens.

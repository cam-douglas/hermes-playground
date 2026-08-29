# Spile

Cooper's bung / wooden tap for a real Claude Code hook failure: **when the client keeps a hook's stdin pipe open without EOF, the hook's unbounded stdin read blocks for as long as the pipe stays open** (measured hours). The declared per-hook `timeout` should reseat the bung (kill the hook parent-side) but is **not enforced** while the hook blocks on stdin. Leaving the spile out drains the barrel for hours; reseating it (EOF + enforced timeout) stops the wedge.

Primary: [anthropics/claude-code#90585](https://github.com/anthropics/claude-code/issues/90585) (open, has repro, filed 2026-08-29, Linux x86_64, Claude Code 2.1.246 of the wedged process; client later 2.1.251). Twice in one day: a turn ended while two Bash `run_in_background` tasks were still running; completion notifications were never delivered; the session froze showing a hook `statusMessage` in the spinner. Freezes lasted **~8h** and **~1.5h** until interrupt/restart, after which pending notifications arrived immediately.

Hook scripts used unbounded stdin reads (`dd bs=1048577 count=1` / `payload=$(cat)`). Probe:

| stdin | measured |
| --- | --- |
| `time sh hook.sh < <(sleep 6)` (pipe open, no EOF) | **6.003s** — blocks exactly as long as the pipe stays open |
| `echo '{…}' \| time sh hook.sh` (EOF) | **0.052s** — instant |

Declared `"timeout": 5` on the wedged hook was **not enforced** (8h >> 5s). Mitigation that works: wrap the stdin read in `timeout 2 dd …` (verified **2.043s** against a 30s-open pipe).

An open spile is not a hold. Score the tap or admit **bunged**.

Idle word: **bunged** (spile seated; payload delivered with EOF; declared timeout armed and enforceable).
NEVER use the product name spile / empty / silent / mute / idle / dead as the idle/state word.
NEVER reuse prior idles: belayed, rove, keyed, housed, beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, bound, stilled, stabled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, rung, moored.

Verdicts: **bunged**, **open-pipe**, **no-eof**, **timeout-ignored**, **wedge**, **hours-held**, **script-alive**, **parent-blind**, **self-timeout**, **unretracted**. Slack alarm on wedge / hours-held / timeout-ignored / open-pipe / no-eof / script-alive / parent-blind / unretracted. Linear ticket on wedge / hours-held / timeout-ignored / open-pipe. GitHub spile-ledger of scored taps on every score.

The #90585 wedge (pipe open no EOF for hours, declared timeout 5s ignored, session frozen on hook statusMessage, notifications held until interrupt) is **wedge**, never **bunged**. Unique nearby flags win their own seeds because those seeds do not carry the wedge pentad.

## Why not a clone

NOT **Sounder** — Sounder is missed background Bash completion *notification* (wakeup dropped). Spile is the *hook stdin pipe kept open without EOF* + *unenforced declared timeout* that wedges the session for hours (which can also starve wakeups as a symptom). Different mechanism, different UI.
NOT **Tappet** — silent hook *injection* / valve-train spawn. Spile is stdin EOF / timeout enforcement on an already-declared hook.
NOT **Quench** — circuit breaker.
NOT **Leat** — sleep blocked unbounded until.
NOT **Ullage** — silent context drop / prefix-frozen cache thrash; cooper *gauging* desk. Spile is cooper *bung/tap* for an open stdin pipe — different tool, different failure. UI must NOT look like Ullage's gauging desk (no ullage stick / gauging rod as hero). Spile hero is bung mallet + wooden spile + bung hole / barrel head.
NOT **Bollard** / **Clew** / **Binnacle** / **Pirn** / **Cotter** / **Fob** / **Ordo** / **Cinch** / **Visa** / **Sprag** / **Lazaret** / leftovers / millimetre-slider / woodworking leftover.
Do NOT ship alternate names Bung, Deadman, Petcock, Flume, Sluice, Lanyard, Dashpot, Watchdog. Product name is **Spile** only.

Different problem: HOOK STDIN PIPE OPEN (NO EOF) + DECLARED TIMEOUT NOT ENFORCED PARENT-SIDE → SESSION WEDGE FOR HOURS.
Different UI: brewery/cellar **bung-mallet station** — oak barrel head, brass spile, wooden bung, mallet, drip tray, timeout fuse lamp. Warm cellar amber/oak/brass. NOT wet pier, NOT sail loft, NOT telegraph night desk, NOT brass binnacle, NOT weaver's pirn, NOT valve train, NOT hotel key-rack, NOT gauging desk with ullage stick as hero.
Different idle word: **bunged**.

## Live catalog path

`/spile/` is this static bung-mallet station. Oak barrel head, brass spile, wooden bung, mallet, drip tray, timeout fuse lamp. Demo works with no secrets and no npm. Mark: `00:50 Sydney · spile`.

1. Seeded `#90585` **wedge** is already on the bench: pipe open no EOF for hours, declared timeout 5s ignored, session frozen on hook statusMessage, background tasks finished but notifications held until interrupt → **wedge**. Never bunged.
2. Switch **open-pipe** — stdin pipe kept open, no EOF yet, short duration.
3. Switch **no-eof** — measured probe: blocks exactly as long as the pipe stays open.
4. Switch **timeout-ignored** — settings.json declares timeout 5 but hook lives >> 5s.
5. Switch **hours-held** — ~8h first freeze / ~1.5h second.
6. Switch **script-alive** — hook process not terminated by parent.
7. Switch **parent-blind** — parent does not enforce timeout while blocked on stdin.
8. Switch **unretracted** — statusMessage of hook stuck in spinner; notifications queued behind wedge.
9. Switch **self-timeout** — mitigation: script wraps stdin read in `timeout 2 …` → ends hang class (control / proof that self-timeout works even when parent fails).
10. Switch **control bunged** / **Reset · bunged** — normal path with EOF, instant return → **bunged** true.
11. **Score** scores. **Admit bunged** scores honestly. **Restore · #90585** shows the wedge. Admit does not lie: a wedge stays wedge.

## Hook

`projects/spile/hook/` scores a probe `{ session, issue, source, pipeOpen, eofDelivered, declaredTimeoutSec, observedBlockSec, hookStillAlive, parentEnforcedTimeout, statusMessageStuck, notificationsHeld, selfTimeoutWrapped, scored }` and returns `{ verdict, reasons[], bunged }`. See `hook/README.md`.

```bash
node projects/spile/hook/index.mjs --listen 9090
node --test projects/spile/hook/spile.test.mjs
```

`bunged` is true ONLY when the pipe is closed with EOF, the declared timeout would be enforceable / was honored, the hook is not wedging, and the verdict is not a failure class. Seeded 90585 numbers must produce wedge / `bunged=false`. Control EOF path produces `bunged=true`. Self-timeout mitigation classifies **self-timeout** with `bunged=false` (the parent still failed; the script reseated its own bung).

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90585](https://github.com/anthropics/claude-code/issues/90585) — open, has repro, filed 2026-08-29, Linux x86_64, Claude Code 2.1.246 (wedged process; client later 2.1.251). Twice in one day: turn ended while two Bash `run_in_background` tasks still running; completion notifications never delivered; session froze showing a hook statusMessage in the spinner; freezes lasted ~8h and ~1.5h until interrupt/restart, after which pending notifications arrived immediately. Hook scripts used unbounded stdin reads (`dd bs=1048577 count=1` / `payload=$(cat)`). Probe: `time sh hook.sh < <(sleep 6)` blocks exactly 6.003s (pipe open, no EOF); with EOF, 0.052s. Declared `"timeout": 5` was not enforced (8h >> 5s). Mitigation: wrap stdin read in `timeout 2 dd …` (verified 2.043s against a 30s-open pipe).

Same-class / nearby (not new primaries):

- [anthropics/claude-code#87289](https://github.com/anthropics/claude-code/issues/87289) — declared hook timeout does not apply while hook blocked reading stdin (~300s, holds tool call)
- [anthropics/claude-code#85250](https://github.com/anthropics/claude-code/issues/85250) — declared hook timeout not enforced parent-side; wedged hook freezes session permanently
- [anthropics/claude-code#78756](https://github.com/anthropics/claude-code/issues/78756) — Windows: client never closes hook stdin pipe; hooks hang forever (2.1.208+)

Nearby shape only (different pole: empty stdin vs never-EOF):

- [anthropics/claude-code#48009](https://github.com/anthropics/claude-code/issues/48009) — Windows UserPromptSubmit hooks receive empty stdin
- [anthropics/claude-code#38162](https://github.com/anthropics/claude-code/issues/38162) — macOS async hooks empty stdin

Cross-check nearby bugs are DIFFERENT (cite only as “not this”):

- NOT Sounder. Missed background Bash completion notification (wakeup dropped).
- NOT Tappet. Silent hook injection / valve-train spawn.
- NOT Quench. Circuit breaker.
- NOT Leat. Sleep blocked unbounded until.
- NOT Ullage. Silent context drop / cooper gauging desk.
- NOT Bollard / Clew / leftover woodworking.

Cross-ecosystem:

- [openai/codex#27550](https://github.com/openai/codex/issues/27550) — hook stdin write happens outside the per-hook timeout; a hook that ignores stdin can hang the turn forever

## Integrations

Slack alarm on wedge / hours-held / timeout-ignored / open-pipe / no-eof / script-alive / parent-blind / unretracted. Linear ticket on wedge / hours-held / timeout-ignored / open-pipe. GitHub spile-ledger of scored taps on every score. Demo mode needs no Slack / GitHub / Linear secrets and no npm. Native stubs fire in the UI (ledger tape / alarm card) without requiring live tokens.

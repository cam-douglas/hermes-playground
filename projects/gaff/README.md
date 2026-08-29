# Gaff

Vaudeville gaff — the brass shepherd's crook that yanks an act from the wings — for a real Claude Code failure: **a backgrounded Bash command that the harness KILLS (timeout, SIGKILL of the process group, or turn-boundary reap) is then reported to the model as a successful completion: status completed, exit code 0.** There is no way to distinguish "the command finished" from "the harness killed it partway through." Captured output simply stops mid-stream. Because the model is told exit 0 / completed, it reports success to the user. Remaining work is silently lost.

Primary: [anthropics/claude-code#90616](https://github.com/anthropics/claude-code/issues/90616) (open, filed 2026-08-29, labels bug / has repro / platform:macos / area:bash). Title: Backgrounded Bash command killed by its timeout reports "completed (exit code 0)". Production incident: background loop over 40 batch jobs (~5 min each, timeout 600000) killed after 4 iterations; notification said completed exit 0; 36 units of paid API work never ran; only clue was a missing final TOTAL line. Repro: `for i in $(seq 1 10); do echo "iter $i"; sleep 90; done; echo "DONE"` with `run_in_background` true and timeout 120000 — observed completed/exit 0, ~1 iteration, no DONE. Expected: timed_out/killed, non-zero exit (128+signal), truncation marker.

A billed full house is not a hold. Score the crook or admit **yanked**.

Idle word: **yanked** (the crook was seen; the kill was reported as a kill; playbill is not stamped COMPLETE). Honest-complete (no kill and DONE present) is also **yanked**.
NEVER use the product name gaff / empty / silent / mute / idle / dead as the idle/state word.
NEVER reuse prior idles: posted, bunged, belayed, rove, keyed, housed, beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, bound, stilled, stabled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, rung, moored, stowed, caught.

Verdicts: **yanked**, **billed**, **truncated**, **midloop**, **sigkilled**, **group-reaped**, **turn-killed**, **empty-ok**, **hours-lost**. Slack alarm on billed / truncated / empty-ok / hours-lost / sigkilled. Linear ticket on billed / hours-lost. GitHub gaff-ledger of scored playbills on every score.

The #90616 billed stage (timeout/harness-kill + completed + exit 0, 4 of 40, no TOTAL) is **billed**, never **yanked**. Unique nearby flags win their own seeds because those seeds do not carry the billed pentad.

## Why not a clone

NOT **Spile** — hook stdin wedge / timeout NOT enforced. Gaff is the opposite pole: timeout/kill DOES fire, then the receipt LIES.
NOT **Sounder** — background waiter completes cleanly but the wakeup never arrives. Gaff: the notification DOES arrive, and it is a lie (completed/exit 0).
NOT **Sear** — set -e structurally inert in eval/non-final &&. Gaff is not about errexit.
NOT **Leat** — sleep-block unbounded until-loop.
NOT **Quench** — a spend-kill fuse. Gaff is a diagnostic desk for a false-success receipt, not a kill switch.
NOT **Knock** / **Reveille** — permission grants / heartbeats.
Do NOT ship leftover woodworking / millimetre-slider clones.
Do NOT ship alternate names Crook, Hook, Cane, Usher, Curtain, Wings, Bill. Product name is **Gaff** only.

Different problem: HARNESS KILLS A BACKGROUNDED BASH COMMAND, THEN REPORTS COMPLETED EXIT 0.
Different UI: vaudeville / music-hall stage — red velvet house curtain, gold proscenium arch, footlights, brass shepherd's crook from stage left. Playbill vs the actual acts: billed FULL SHOW / COMPLETED (exit 0) against a stage that went dark on act 4 of 40.
Different idle word: **yanked**.

## Live catalog path

`/gaff/` is this static vaudeville gaff. House-red, gold, lamp, cream playbill. Demo works with no secrets and no npm. Mark: `04:50 Sydney · gaff`.

1. Seeded `#90616` **billed** is already on the stage: playbill stamped COMPLETED, curtain open on a dark house, acts 1–4 lit of 40 → **billed**. Never yanked.
2. Switch **#87055 sigkilled** — uncatchable SIGKILL; traps never fire.
3. Switch **#88754 turn-killed** — killed at turn boundary; status mismatches process.
4. Switch **honest timed_out** — timed_out + exit 137 → **yanked**.
5. Switch hours-lost / truncated / midloop / empty-ok / group-reaped.
6. **Score** scores. **Admit yanked** scores honestly. **Restore · #90616** shows the billed stage. Admit does not lie.

## Hook

`projects/gaff/hook/` scores a probe `{ session, issue, source, notification, outputTail, wrapperTrace, reportedStatus, exitCode, timeoutKilled, … }` and returns `{ verdict, reasons[], yanked }`. See `hook/README.md`.

```bash
node projects/gaff/hook/index.mjs --listen 9090
node --test projects/gaff/hook/gaff.test.mjs
```

`yanked` is true ONLY when the kill is reported as a kill (timed_out/killed + nonzero) OR there was no kill and DONE is present (honest complete) OR the desk is idle. Seeded 90616 numbers must produce billed / `yanked=false`. Control timed_out/nonzero produces `yanked=true`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90616](https://github.com/anthropics/claude-code/issues/90616) — open, filed 2026-08-29, labels bug/has repro/platform:macos/area:bash. Title: Backgrounded Bash command killed by its timeout reports "completed (exit code 0)".

Same class:

- [anthropics/claude-code#87055](https://github.com/anthropics/claude-code/issues/87055) — open, 2026-08-16. Background Bash process group SIGKILLed mid-run when spawning a daemonizing CLI; still reported completed (exit code 0); traps never fire.
- [anthropics/claude-code#88754](https://github.com/anthropics/claude-code/issues/88754) — open, has repro, Windows/MSYS2. `run_in_background` killed at turn boundary; reported status does not match the process.

Nearby kill (no false-complete claim — Sounder-adjacent silence, not Gaff's lying receipt):

- [anthropics/claude-code#84625](https://github.com/anthropics/claude-code/issues/84625) — silent mid-run kill with no notification.
- [anthropics/claude-code#90490](https://github.com/anthropics/claude-code/issues/90490) — Remote Control background killed ~5–7 min.

Cross-check nearby bugs are DIFFERENT (cite only as “not this”):

- NOT Spile. Hook stdin wedge / timeout NOT enforced.
- NOT Sounder. Background waiter completes; wakeup never arrives.
- NOT Sear. set -e structurally inert in eval/non-final &&.
- NOT Leat. Sleep-block unbounded until-loop.
- NOT Quench. Spend-kill fuse.
- NOT Knock / Reveille. Permission grants / heartbeats.

Cross-ecosystem (exit 0 is not a hold):

- [openai/codex#19309](https://github.com/openai/codex/issues/19309) — CLI exits 0 after printing a plan and performing none of the work. Different mechanism, same lie.

## Integrations

Slack alarm on billed / truncated / empty-ok / hours-lost / sigkilled. Linear ticket on billed / hours-lost. GitHub gaff-ledger of scored playbills on every score. Demo mode needs no Slack / GitHub / Linear secrets and no npm. Native stubs fire in the UI (ledger tape / alarm card) without requiring live tokens.

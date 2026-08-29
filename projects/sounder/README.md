# Sounder

Telegraph sounder's night desk for a real Claude Code liveness failure: **a background Bash waiter with `run_in_background:true` completes cleanly, but its completion notification never re-invokes the session**. The session sits idle until a human types. Primary: [anthropics/claude-code#90555](https://github.com/anthropics/claude-code/issues/90555) (open, filed 2026-08-29, has repro, Claude Code 2.1.251). Waiter IDs `br1ghbwl6` and `bzuzeorji` both exited after the log line appeared; no wake from ~23:30 to 05:55 (6h25m). Silence is the bug. Opposite pole of the same subsystem: [#90534](https://github.com/anthropics/claude-code/issues/90534) resume auto-fires armed background shells before any input.

A completed waiter is not a hold. Score the sounder or admit **keyed**.

Idle word: **keyed** (circuit closed; notification path live; session will wake without a human).
NEVER use the product name sounder / empty / silent / mute / idle / dead as the idle/state word.
NEVER reuse prior idles: housed, beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, bound, stilled, stabled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, rung.

Verdicts: **keyed**, **muted**, **stalled**, **orphaned**, **relayed**, **deaf**, **armed**, **dropped**, **stranded**, **cut**. Slack alarm on muted / stalled / orphaned / deaf / dropped / stranded / cut / armed. Linear ticket on muted / stalled. GitHub sounder-ledger of scored circuits on every score.

The #90555 muted case (waiter exited, session never re-invoked) is **muted**, never **keyed**, even when the command exited cleanly and no error was printed.

## Why not a clone

NOT **Leat** — sleep-block unbounded until-loop that never exits. Inverse: here the waiter DID exit.
NOT **Fusee** — early schedule dispatch.
NOT **Cotter** — poison fireAt registry (whole file rejected).
NOT **Reveille** — living muster / heartbeats across compaction.
NOT **Shunt** — nested SendMessage misroute.
NOT **Husk** — hollow headless SUCCESS envelope.
NOT **Binnacle** — TUI origin split.
NOT **Pirn** — instruction-shaped idle_notification truncation.
NOT leftover woodworking / millimetre-slider.
Do NOT ship alternate names Tocsin, Larum, Clapper, Squelch, Vigil, Rouse, Cradle, Gong, Tantara, Relay, Bell. Product name is **Sounder** only.

Different problem: WAITER EXITS CLEANLY → COMPLETION NOTIFICATION NEVER RE-INVOKES → SESSION IDLES UNTIL HUMAN INPUT. Liveness failure, not correctness.
Different UI: telegraph office night desk. Oak table, brass sounder, straight key, ink tape, line lamp. When the waiter circuit closes the sounder should click and ink a mark; if the click never comes the operator stays at the key until a human walks in.
Different idle word: **keyed**.

## Live catalog path

`/sounder/` is this static telegraph night desk. Oak table, brass sounder, straight key, ink tape, line lamp. Demo works with no secrets and no npm. Mark: `21:50 Sydney · sounder`.

1. Seeded `#90555` **muted** is already on the tape: waiter completed, no re-invoke, idle until human → **muted**.
2. Switch **stalled** — session sat idle for hours after waiter exit until human input → **stalled**.
3. Switch **orphaned** — waiter IDs exist, no wake attached → **orphaned**.
4. Switch **relayed** — notification delivered and session woke → **relayed**.
5. Switch **deaf** — session still present but never heard the click → **deaf**.
6. Switch **armed** — resume auto-fires armed background work before any input → **armed**.
7. Switch **dropped** — notification enqueued but never delivered → **dropped**.
8. Switch **stranded** — idle teammate never woken by Monitor/background-task notifications → **stranded**.
9. Switch **cut** — headless (`-p`) kills `run_in_background` at turn end; no notification loop → **cut**.
10. Switch **control keyed** — waiter armed, notification path live, session will wake → **keyed**.
11. Switch **Reset · keyed** — idle desk → **keyed**. Idle word is **keyed** when the desk is reset. Line lamp on; key seated; tape quiet but ready; never an empty or error state.
12. **Score** scores. **Admit keyed** scores honestly. **Reset · keyed** returns idle keyed. **Restore · #90555** shows the muted circuit. Admit does not lie: a muted sounder stays muted.

## Hook

`projects/sounder/hook/` scores a probe `{ session, issue, source, waiterCompleted, notificationDelivered, sessionReinvoked, humanInputRequired, idleHours, waiterIds, resumeAutofire, enqueuedNotDelivered, teammateIdle, headlessKilledAtTurnEnd, sessionPresent, circuitArmed, scored }` and returns `{ verdict, reasons[], keyed }`. See `hook/README.md`.

```bash
node projects/sounder/hook/index.mjs --listen 9090
node --test projects/sounder/hook/sounder.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90555](https://github.com/anthropics/claude-code/issues/90555) — open, has repro, filed 2026-08-29, area:core / area:bash, Claude Code 2.1.251. Background Bash waiter completes; notification never re-invokes; session idles until user input.

Same-class / nearby (not new primaries):

- [anthropics/claude-code#90534](https://github.com/anthropics/claude-code/issues/90534) — opposite pole: resume auto-fires armed background shells /loop wakeups before any input (same subsystem).
- [anthropics/claude-code#87689](https://github.com/anthropics/claude-code/issues/87689) — subagent `run_in_background` completion notification never delivered if the agent ends its turn.
- [anthropics/claude-code#89505](https://github.com/anthropics/claude-code/issues/89505) — background-task completion notifications silently lost for async subagents (3x in one session).
- [anthropics/claude-code#88423](https://github.com/anthropics/claude-code/issues/88423) — in-process subagents never re-invoked when their own `run_in_background` Bash/Monitor completes.
- [anthropics/claude-code#85534](https://github.com/anthropics/claude-code/issues/85534) — completion notification enqueued but never delivered; subagents never re-invoked despite 'You will be notified'.
- [anthropics/claude-code#77300](https://github.com/anthropics/claude-code/issues/77300) — agent-team Monitor/background-task notifications never wake an idle teammate (dropped, not queued).
- [anthropics/claude-code#85129](https://github.com/anthropics/claude-code/issues/85129) — `-p` headless silently kills `run_in_background` at turn end; no notification loop.
- [anthropics/claude-code#76174](https://github.com/anthropics/claude-code/issues/76174) — `run_in_background` task-notification routed to wrong session/project (nearby shape).

Cross-check nearby bugs are DIFFERENT (cite only as “not this”):

- NOT Leat sleep-block unbounded until-loop. Inverse: here the waiter DID exit.
- NOT #88702 timeout ignored / never-exiting background task (Leat-adjacent).
- NOT Fusee early schedule dispatch.
- NOT Cotter poison fireAt registry.
- NOT Reveille living muster.
- NOT Shunt nested SendMessage misroute.
- NOT Husk hollow headless SUCCESS.
- NOT Binnacle TUI origin split.
- NOT Pirn instruction-shaped idle_notification truncation.

Cross-ecosystem (nearby completed-background never resumes, not a new primary):

- [openai/codex#15723](https://github.com/openai/codex/issues/15723) — background subprocesses / subagents do not wake the calling agent on completion.

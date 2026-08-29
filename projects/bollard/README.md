# Bollard

Dock bollard / wet pier plate for a real Claude Code remote-control failure: **a long-lived `claude rc` supervisor (often under systemd `Restart=always`) can exit for transient reasons**, and the server garbage-collects the environment if the supervisor is gone long enough. Measured:

| supervisor gap | environment after restart |
| --- | --- |
| 1–3 s (clean `systemctl restart`) | **preserved** |
| ~10–11 s (crash → `Restart=always`) | **new environment ID**; every previously attached session permanently unresumable |

Mobile shows “environment deleted”. Transcripts stay readable but are not resumable. A dock bollard holds the ship (environment) while the hawser is briefly slack. When the bollard is gone, every painter is orphaned. Primary: [anthropics/claude-code#90581](https://github.com/anthropics/claude-code/issues/90581) (open, has repro, filed 2026-08-29, Linux, Claude Code 2.1.232 at both incidents; reporter later on 2.1.251).

Two incidents in the same primary:

1. **Poll-time 401.** OAuth access token expired on poll → supervisor shut down all 10 active sessions and exited. systemd restarted ~14 s later with the **same on-disk credentials** and attached fine — so credentials were refreshable; the running process held a stale token with no reload path; blast radius was total.
2. **Memory thrash declared “offline”.** Supervisor alive and logging continuously (3,558 journal lines in two hours) but at **24.2 GiB RSS + 2.4 GiB swap**; server said the machine was offline, cleaned up the environment, lost 14 sessions. Related to unbounded child unreaping ([#78778](https://github.com/anthropics/claude-code/issues/78778), [#85639](https://github.com/anthropics/claude-code/issues/85639)).

A slack hawser is not a hold. Score the bollard or admit **belayed**.

Idle word: **belayed** (made fast to the bollard; environment retained).
NEVER use the product name bollard / empty / silent / mute / idle / dead as the idle/state word.
NEVER reuse prior idles: rove, keyed, housed, beamed, snug, hung, appointed, cinched, gauged, stamped, overrun, pratique, wound, bound, stilled, stabled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, rung, moored.

Verdicts: **belayed**, **gap-short**, **gap-fatal**, **poll-401**, **orphaned**, **sessions-dead**, **cred-stale**, **mem-thrash**, **offline-lie**, **reattach-denied**. Slack alarm on orphaned / gap-fatal / sessions-dead / poll-401 / offline-lie / mem-thrash / cred-stale / reattach-denied. Linear ticket on orphaned / gap-fatal / sessions-dead / poll-401. GitHub bollard-ledger of scored piers on every score.

The #90581 orphaned case (~10–11s gap after crash, environment cleaned up, 14 sessions unresumable, mobile “environment deleted”) is **orphaned**, never **belayed**. Unique nearby flags win their own seeds because those seeds do not carry the orphaned pentad (env deleted / new env id / sessions unresumable).

## Why not a clone

NOT **Clew** — ARG_MAX / deny-list E2BIG. Bollard is remote-control environment GC after a supervisor gap.
NOT **Sounder** — missed background Bash wakeup notification. Bollard is environment retention across supervisor absence.
NOT **Reveille** — living muster across compaction. Bollard is RC environment ID survival across process restart.
NOT **Cote** — `--resume` team-hub id vs conversation id. Bollard is server-side environment GC vs grace period.
NOT **Binnacle** — TUI origin split / `ANTHROPIC_BASE_URL`.
NOT **Hasp** / **Wicket** / **Parity**.
NOT leftover woodworking / millimetre-slider.
Do NOT ship alternate names Hawser, Hawse, Painter, Kedge, Warp, Berth. Product name is **Bollard** only.

Different problem: SUPERVISOR GAP ≥~10 s → SERVER GC → NEW ENVIRONMENT ID → EVERY PRIOR SESSION PERMANENTLY UNRESUMABLE.
Different UI: wet pier / bollard plate / quay lamp. Cast iron bollard, hawser eyes, tide marks. NOT a sail loft, NOT a telegraph night desk, NOT a brass binnacle, NOT a weaver's pirn, NOT a hotel key-rack.
Different idle word: **belayed**.

## Live catalog path

`/bollard/` is this static wet pier. Cast iron bollard, hawser eyes, quay lamp, tide marks. Demo works with no secrets and no npm. Mark: `23:50 Sydney · bollard`.

1. Seeded `#90581` **orphaned** is already on the pier: ~10–11s gap after crash, environment cleaned up, 14 sessions unresumable, mobile “environment deleted” → **orphaned**. Never belayed.
2. Switch **poll-401** — 401 on poll, 10 sessions shut down, restart with same creds succeeds.
3. Switch **mem-thrash** — 24.2 GiB RSS + 2.4 GiB swap, still logging.
4. Switch **offline-lie** — server “machine was offline” while journal continuous.
5. Switch **gap-fatal** — supervisor absence ≥10s.
6. Switch **sessions-dead** — shutting down N active sessions.
7. Switch **cred-stale** — token expired in-process; disk creds fine.
8. Switch **reattach-denied** — “Run `claude remote-control` to start a fresh environment.”
9. Switch **gap-short** / **control belayed** — 1–3s clean restart, environment preserved → **gap-short** with `belayed` true (control / proof path).
10. Switch **Reset · belayed** — idle pier → **belayed**. Idle word is **belayed** when the pier is reset. Hawser taut; bollard standing; never an empty or error state.
11. **Score** scores. **Admit belayed** scores honestly. **Reset · belayed** returns idle belayed. **Restore · #90581** shows the orphaned pier. Admit does not lie: an orphaned bollard stays orphaned.

## Hook

`projects/bollard/hook/` scores a probe `{ session, issue, source, supervisorGapSec, envPreserved, envDeleted, newEnvId, sessionsShutDown, sessionsUnresumable, poll401, credsWorkedAfterRestart, rssGiB, swapGiB, stillLogging, serverSaidOffline, reattachAllowed, scored }` and returns `{ verdict, reasons[], belayed }`. See `hook/README.md`.

```bash
node projects/bollard/hook/index.mjs --listen 9090
node --test projects/bollard/hook/bollard.test.mjs
```

`belayed` is true ONLY when the environment is retained and sessions are resumable and the verdict is not a failure class. Seeded 90581 numbers must produce orphaned / `belayed=false`. Gap-short produces `belayed=true`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90581](https://github.com/anthropics/claude-code/issues/90581) — open, has repro, filed 2026-08-29, Linux, Claude Code 2.1.232 at both incidents (native binary, linux-x64); reporter later on 2.1.251. Two incidents: poll-time 401 tore down 10 sessions (same on-disk credentials worked after a ~14 s systemd restart); memory thrash at 24.2 GiB RSS + 2.4 GiB swap declared “offline” while the journal was continuous, losing 14 sessions. Measured: 1–3 s clean restart preserves the environment; ~10–11 s crash gap GC's it.

Same-class / nearby (not new primaries):

- [anthropics/claude-code#87213](https://github.com/anthropics/claude-code/issues/87213) — resume replays a dead RC binding
- [anthropics/claude-code#33041](https://github.com/anthropics/claude-code/issues/33041) — RC disconnects frequently
- [anthropics/claude-code#78597](https://github.com/anthropics/claude-code/issues/78597) — remote credentials fetch failed in a long-lived session
- [anthropics/claude-code#78607](https://github.com/anthropics/claude-code/issues/78607) — RC connection failures
- [anthropics/claude-code#90577](https://github.com/anthropics/claude-code/issues/90577) — Connected status flickers
- [anthropics/claude-code#78778](https://github.com/anthropics/claude-code/issues/78778) — RC doesn't reap finished `--print` children → memory leak
- [anthropics/claude-code#85639](https://github.com/anthropics/claude-code/issues/85639) — headless supervisor never reaps children → OOM

Cross-check nearby bugs are DIFFERENT (cite only as “not this”):

- NOT Clew. ARG_MAX / deny-list E2BIG. Bollard is remote-control environment GC after a supervisor gap.
- NOT Sounder. Missed background Bash wakeup notification.
- NOT Reveille. Living muster across compaction.
- NOT Cote. `--resume` team-hub id vs conversation id.
- NOT Binnacle. TUI origin split / `ANTHROPIC_BASE_URL`.
- NOT Hasp / Wicket / Parity.

Cross-ecosystem:

- [openai/codex#35217](https://github.com/openai/codex/issues/35217) — Remote SSH reconnect orphans app-server processes
- [openai/codex#39863](https://github.com/openai/codex/issues/39863) — Remote Codex disconnects
- [openai/codex#36189](https://github.com/openai/codex/issues/36189) — Remote SSH reconnect loop

## Integrations

Slack alarm on orphaned / gap-fatal / sessions-dead / poll-401 / offline-lie / mem-thrash / cred-stale / reattach-denied. Linear ticket on orphaned / gap-fatal / sessions-dead / poll-401. GitHub bollard-ledger of scored piers on every score. Demo mode needs no Slack / GitHub / Linear secrets and no npm. Native stubs fire in the UI (ledger tape / alarm card) without requiring live tokens.

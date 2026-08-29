# Fusee

Clockmaker's fusee / conical-pulley desk for Claude Code scheduled tasks that dispatch ahead of their configured fire time. A written cron / fireAt is **not** a hold. Score the dial or admit **wound**.

A fusee is the conical pulley that equalizes mainspring force so a clock does not race. When the scheduler fires early (95 days, 27 days, 3h40m in the primary report), the spring has raced — the fusee desk catches it.

Idle word: **wound** (spring regulated; fire time honored).
NEVER use the product name fusee / clock / early / empty / schedule as the idle/state word.
NEVER reuse prior idles: bound, stilled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, stabled. Do not ship Escapement, Pallet, Gnomon, Tocsin, Clepsydra, Mainspring, Arbor, Barrel, Crown, Stem, Dial, Strike, Chime, Horology, Chronometer, Premature, Ahead, Jump, Race, Early, Sprung, Clock, Watch, Timer, Cron, Schedule, Alarm, Bell, or Fuse.

Verdicts: **wound**, **early**, **sprung**, **raced**, **ahead**, **jumped**, **premature**, **voided**, **held**, **true**. Slack fusee alarm on early / sprung / raced / ahead / jumped / premature / voided. Linear ticket on early / sprung / raced / ahead / premature. GitHub fusee-ledger of dial events on every scored probe.

## Why not a clone

NOT Iota (typesetter's type-case / path-key identity / type-case).
NOT Leat (mill leat / sleep-block unbounded until-loop).
NOT Shunt (night railway / nested SendMessage misroute).
NOT Sump / Pleat / Scant / Chad / Kist / Wraith / Gasket / Damper / Cote / Larder / Tappet / Aside / Chute / Tain / Husk / Snib / Veto / Assay / Wicket / Sigil / Stencil / Suture / Blot / Coda / Reed / Fathom / Hasp / Parity / Reveille / Quench / Scrim / Knock.
NOT leftover woodworking / millimetre-slider clones. A fusee is a clockmaker's metaphor for a diagnostic desk, not a leftover instrument.
Do NOT ship Escapement, Pallet, Gnomon, Tocsin, Clepsydra, Mainspring, Arbor, Barrel, Crown, Stem, Dial, Strike, Chime, Horology, Chronometer, Premature, Ahead, Jump, Race, Early, Sprung, Clock, Watch, Timer, Cron, Schedule, Alarm, Bell, or Fuse as alternate product names this hour. Product name is **Fusee** only.

Different problem: scheduler fires before configured fireAt/cron slot; no early-dispatch guard in the platform.
Different UI: clockmaker's fusee / conical pulley / escapement / enamel dial / mainspring / arbor / winding key. Brass, enamel dial, lamp oil, oak case. NOT typesetter case. NOT millrace. NOT railway. NOT basement. NOT tailor. NOT timber. NOT ballot. NOT coffin. NOT steam. NOT dove-cote. NOT chimney.
Different idle word: **wound**.

## Live catalog path

`/fusee/` is this static clockmaker desk. Conical pulley, enamel dial, winding key. Demo works with no secrets and no npm. Mark: `10:50 Sydney · fusee`.

1. Seeded `#90485` **early** is already on the dial: ~95-day DST fleet rewrite would have applied months early → **early** (cluster raced / jumped / sprung).
2. Switch **sprung** — spring released before the dial says so → **sprung**.
3. Switch **raced** — days+ early, not the 95-day DST case → **raced**.
4. Switch **ahead** — fireAt one-off ran ~3h40m early → **ahead**.
5. Switch **jumped** — cron slot jumped early by hours → **jumped**.
6. Switch **premature** — trial-cancellation evaluation ran ~27 days early → **premature**.
7. Switch **voided** — early dispatch caught only by a hand-written wall-clock guard → **voided**.
8. Switch **held** — lastRunAt/nextRunAt inconsistent with actual → **held**.
9. Switch **true** — configured time matches actual dispatch → **true**.
10. Switch **Bail · wound** — spring regulated, nothing scored → **wound**. Idle word is **wound** when the probe is idle.
11. **Score** scores. **Bail** returns idle wound. **Dial** shows the #90485 early strike. Admit does not lie: an early probe stays early.

## Hook

`projects/fusee/hook/` scores a probe `{ configuredAt, dispatchedAt, kind:"cron"|"fireAt", cronExpression, fireAt, earlyByMs, guardCaught, lastRunAt, nextRunAt, reportedSuccess, workDone, observed, session, source, issue, scored }` and returns `{ verdict, reasons[], cluster[], wound, early, sprung }`. See `hook/README.md`.

```bash
node projects/fusee/hook/index.mjs --listen 9090
node --test projects/fusee/hook/fusee.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90485](https://github.com/anthropics/claude-code/issues/90485) — filed 2026-08-29, open. Title: "Scheduled tasks dispatch ahead of their configured fire time (3 confirmed instances)". Three confirmed early dispatches: ~95 days early (DST fleet rewrite would have applied months early), ~3h40m early (verification task before the slot), ~27 days early (trial-cancellation evaluation). Tasks use create_scheduled_task / list_scheduled_tasks / update_scheduled_task; both recurring cronExpression (5-field local) and one-off fireAt (ISO 8601 with offset). Authors now hand-write wall-clock guards into every task prompt (41+) because nothing in the scheduler prevents early dispatch.

Corroboration (cite as shape, not a new primary):

- [anthropics/claude-code#77657](https://github.com/anthropics/claude-code/issues/77657) — lastRunAt/nextRunAt inconsistent with actual execution.
- [anthropics/claude-code#89942](https://github.com/anthropics/claude-code/issues/89942) — Scheduled task never records lastRunAt despite normal recurring cron.
- [anthropics/claude-code#89936](https://github.com/anthropics/claude-code/issues/89936) — lastRunAt never updates while nextRunAt keeps advancing (silently never executes).
- [anthropics/claude-code#89811](https://github.com/anthropics/claude-code/issues/89811) — Scheduled tasks report success but silently perform zero work.
- [anthropics/claude-code#85565](https://github.com/anthropics/claude-code/issues/85565) — Desktop update wiped scheduledTasks: [] with zero notification.

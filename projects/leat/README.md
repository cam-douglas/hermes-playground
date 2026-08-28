# Leat

Mill leat / sluice-gate / millrace desk for Claude Code Bash-tool guidance that steers agents from a bounded `sleep N` into an **unbounded `until`-loop**, which then becomes an unkillable background task lasting days and blocking app restart. A blocked sleep is **not** a hold. Score the race or admit **stilled**.

Idle word: **stilled** (gate closed; race not spinning; no unbounded wait live).
NEVER use the product name leat / millrace / sluice as the idle/state word.
NEVER use empty.
NEVER reuse prior idles: drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, stabled. Do not ship Millrace, Flume, Sluice, Culvert, Weir, Noria, Capstan, Flywheel, Eddy, Gyre, Quern, Lade, Tread, Spindle, Rotor, Whorl, Gimbal, Ratchet, Escapement, Verge, Fusee, Pallet, Points, Frog, Wye, Siding, Drain, Null, Sink, Gutter, Pit, Ash, Ashcan, Bung, Void, Limbo, Oubliette, Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, Ferrule, Livery, Nixie, Crypt, Fold, Accordion, or Bellows.

Verdicts: **stilled**, **racing**, **unbounded**, **promoted**, **lingering**, **flooded**, **spun**, **capped**, **live**, **shut**. Slack leat alarm on racing / unbounded / promoted / lingering / flooded / live. Linear ticket on racing / unbounded / promoted / lingering. GitHub leat-ledger of race events on every scored probe.

## Why not a clone

NOT Shunt (railway yard / nested SendMessage misroute to root).
NOT Sump (basement catch-pit / literal dev/null/ LFS hook litter).
NOT Quench (fuse / hard kill spend ledger) — Quench kills spend; Leat scores the guidance that *creates* immortal waits.
NOT Knock (permission grant stall).
NOT Pleat / Scant / Chad / Kist / Wraith / Gasket / Damper / Cote / Larder / Tappet / Aside / Chute / Tain / Husk / Snib / Veto / Assay / Wicket / Sigil / Stencil / Suture / Blot / Coda / Reed / Fathom / Hasp / Parity / Reveille / Scrim.
NOT leftover woodworking / millimetre-slider clones. A leat is a mill-race metaphor for a diagnostic desk, not a leftover instrument.
Do NOT ship Millrace, Flume, Sluice, Culvert, Weir, Noria, Capstan, Flywheel, Eddy, Gyre, Quern, Lade, Tread, Spindle, Rotor, Whorl, Gimbal, Ratchet, Escapement, Verge, Fusee, Pallet, Points, Frog, Wye, Siding, Drain, Null, Sink, Gutter, Pit, Ash, Ashcan, Bung, Void, Limbo, Oubliette as alternate product names this hour. Product name is **Leat** only.

Different problem: sleep-block → unbounded until guidance → background promotion → multi-day zombie wait.
Different UI: mill leat / open sluice gate / millrace water / mill wheel / wet stone channel / moss / brass gate wheel. Cool water greens, slate, brass, foam white. NOT railway night yard. NOT basement pit. NOT tailor board. NOT timber yard. NOT ballot. NOT coffin. NOT steam flange. NOT dove-cote. NOT chimney. NOT stillroom. NOT theatre wing.
Different idle word: **stilled**.

## Live catalog path

`/leat/` is this static mill leat. Open sluice, millrace water, mill wheel, moss, brass gate wheel. Demo works with no secrets and no npm. Mark: `08:50 Sydney · leat`.

1. Seeded `#90475` **racing** is already on the race: sleep blocked; block recommended `until <check>; do sleep 2; done`; no iteration cap; no deadline; loop written; promoted to background; still live five days later; restart blocked → **racing** (cluster unbounded / promoted / lingering / live).
2. Switch **unbounded** — block message recommended the open until-loop → **unbounded**.
3. Switch **promoted** — foreground timeout moved the loop to background and discarded the bound → **promoted**.
4. Switch **lingering** — background loop still live across a session boundary / days later → **lingering**.
5. Switch **flooded** — three until-loops still alive → **flooded**.
6. Switch **spun** — CPU spinning; orphaned at PPID 1 → **spun**.
7. Switch **capped** — healthy for-loop / timeout form → **capped**.
8. Switch **live** — .output mtime still writing; restart blocked → **live**.
9. Switch **shut** — TaskStop / manual kill closed the race → **shut**.
10. Switch **Bail · stilled** — gate closed, nothing scored → **stilled**. Idle word is **stilled** when the probe is idle.
11. **Score** scores. **Bail** returns idle stilled. **Race** shows the #90475 racing channel. Admit does not lie: a racing probe stays racing.

## Hook

`projects/leat/hook/` scores a probe `{ sleepBlocked, recommendedUntil, hasIterationCap, hasDeadline, foregroundTimeoutMs, promotedToBackground, backgroundStillLive, daysAlive, restartBlocked, taskCount, ppidOne, outputUnlinked, wroteUntilLoop, spunCpu, taskStopped, outputMtimeLive, observed, session, source, issue, scored }` and returns `{ verdict, reasons[], cluster[], stilled, racing, unbounded }`. See `hook/README.md`.

```bash
node projects/leat/hook/index.mjs --listen 9090
node --test projects/leat/hook/leat.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90475](https://github.com/anthropics/claude-code/issues/90475) — filed 2026-08-28, has repro, open. Blocked `sleep` recommends unbounded until-loop → unkillable background task.

Corroboration (cite as shape, not a new primary — these describe what happens to the resulting process; #90475 is about the guidance that produces it):

- [anthropics/claude-code#88702](https://github.com/anthropics/claude-code/issues/88702) — OPEN. `run_in_background` ignores timeout; never-exiting background task produces no notification.
- [anthropics/claude-code#89625](https://github.com/anthropics/claude-code/issues/89625) — OPEN. macOS background Bash tasks orphaned at PID 1; 30 spinning shells; `.output` unlinked while processes live.

# Shunt

Night railway shunting yard / signal-box / lever-frame desk for Claude Code nested-subagent **SendMessage follow-up replies that are delivered to the root session instead of the requesting parent**. First child answer is reliable to the parent. The follow-up is misrouted to root. Return path is also closed: the child sees `from="general-purpose"` (agent **type**, not an address) and an explicit reply fails with `No agent named 'general-purpose' is reachable`. A first delivery is **not** a hold. Score the road or admit **stabled**.

Idle word: **stabled** (wagons in the right road; no misroute).
NEVER use shunt / shunted / empty as idle.
NEVER reuse drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised. Do not ship Points, Frog, Wye, Siding, Slip, Catch, Wagon, Yard, Signal, Lever, Relay, Deadletter, Crosstalk, Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, Ferrule, Livery, Nixie, Crypt, Fold, Accordion, Bellows, Drain, Null, Sink, Gutter, Pit, Ash, Ashcan, Sluice, Culvert, Weir, Bung, Void, Limbo, or Oubliette.

Verdicts: **stabled**, **misrouted**, **orphaned**, **rootbound**, **typecast**, **stalled**, **tandem**, **dropped**, **crosstalk**, **sidetracked**. Slack shunt alarm on misrouted / orphaned / rootbound / typecast. Linear ticket on misrouted / orphaned / rootbound. GitHub shunt-ledger of road events on every scored probe.

## Why not a clone

NOT Cote (dove-cote / --resume team-hub identity split). Cote is a success receipt that never roosts in the resumed parent; Shunt is a nested SendMessage follow-up that leaves the live parent road for root.
NOT Tappet (valve train / silent hook injection).
NOT Reveille (duplicate dispatch).
NOT Sump / Pleat / Scant / Chad / Kist / Wraith / Gasket / Damper / Larder / Aside / Chute / Tain / Husk / Snib / Veto / Assay / Wicket / Sigil / Stencil / Suture / Blot / Coda / Reed / Fathom / Hasp / Parity / Quench / Scrim / Knock.
NOT leftover woodworking / millimetre-slider clones. A shunt is a railway-yard metaphor for a diagnostic desk, not a leftover instrument.
Do NOT ship Points, Frog, Wye, Siding, Slip, Catch, Wagon, Yard, Signal, Lever, Relay, Deadletter, Crosstalk, Kerf, Crop, Stump, Snip, Quill, Nib, Trunc, Ferrule, Livery, Nixie, Crypt, Fold, Accordion, Bellows, Drain, Null, Sink, Gutter, Pit, Ash, Ashcan, Sluice, Culvert, Weir, Bung, Void, Limbo, Oubliette as alternate product names this hour. Product name is **Shunt** only.

Different problem: nested SendMessage follow-up misroute to root + unresolvable from=type.
Different UI: night railway shunting yard / signal box / lever frame / oil lamps / points / wagons / wet rails. NOT basement pit. NOT tailor board. NOT timber yard. NOT ballot. NOT coffin. NOT steam flange. NOT dove-cote. NOT chimney. NOT stillroom.
Different idle word: **stabled**.

## Live catalog path

`/shunt/` is this static night yard. Signal lamps, lever frame, wagons, wet rails. Demo works with no secrets and no npm. Mark: `07:50 Sydney · shunt`.

1. Seeded `#90463` **misrouted** is already on the road: first answer to parent; child produced SECOND-ANSWER; follow-up queued to root; parent parked waiting; from=general-purpose; fromResolves=false; nestedDepth≥2; keepalive cleared after first → **misrouted** (cluster orphaned / rootbound / typecast / stalled / dropped / sidetracked).
2. Switch **orphaned** — child produced a follow-up; parent already completed; no keepalive → **orphaned**.
3. Switch **rootbound** — follow-up or notification queued to the root session → **rootbound**.
4. Switch **typecast** — from=general-purpose is an agent type; No agent named 'general-purpose' is reachable → **typecast**.
5. Switch **stalled** — parent parked waiting → **stalled**.
6. Switch **tandem** — parent still running; keepalive held; first delivery live → **tandem**.
7. Switch **dropped** — child produced a follow-up; neither parent nor root took the wagon → **dropped**.
8. Switch **crosstalk** — reply addressed by requester; roads crossed → **crosstalk**.
9. Switch **sidetracked** — nested depth ≥ 2 without a scored misroute → **sidetracked**.
10. Switch **Bail · stabled** — wagons in the right road, nothing scored → **stabled**. Idle word is **stabled** when the probe is idle.
11. **Score** scores. **Bail** returns idle stabled. **Road** shows the #90463 misrouted yard. Admit does not lie: a misrouted probe stays misrouted.

## Hook

`projects/shunt/hook/` scores a probe `{ firstAnswerToParent, followUpToRoot, parentReceivedFollowUp, childProducedFollowUp, fromIsAgentType, fromResolves, parentParkedWaiting, keepaliveClearedAfterFirst, parentRunning, parentCompleted, parentHoldsKeepalive, replyAddressedByRequester, notificationQueuedToRoot, nestedDepth, childFromLabel, observed, session, source, issue, scored }` and returns `{ verdict, reasons[], cluster[], stabled, misrouted, orphaned }`. See `hook/README.md`.

```bash
node projects/shunt/hook/index.mjs --listen 9080
node --test projects/shunt/hook/shunt.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90463](https://github.com/anthropics/claude-code/issues/90463) — filed 2026-08-28, re-verified 2026-08-29 on 2.1.251. Reply to SendMessage from a nested subagent is delivered to the root session instead of the requesting parent. 4/4 follow-up misroutes; first delivery 18/18 to parent. Child `from="general-purpose"` does not resolve.

Corroboration (cite as shape, not a new primary):

- [anthropics/claude-code#77950](https://github.com/anthropics/claude-code/issues/77950) — open, 2026-07-15. Nested grandchild background agents can't message their direct parent; SendMessage addressed to type label, falls back to main; parent stalls.
- [anthropics/claude-code#75043](https://github.com/anthropics/claude-code/issues/75043) — open. Nested subagents always async; completion notifications never reach the subagent parent.
- [anthropics/claude-code#76681](https://github.com/anthropics/claude-code/issues/76681) — open. Background task notification enqueued but never delivered when owning subagent already completed.
- [anthropics/claude-code#78338](https://github.com/anthropics/claude-code/issues/78338) — closed. Background agents drop queued SendMessages and skip completion notifications.

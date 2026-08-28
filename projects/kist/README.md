# Kist

Undertaker's kist / coffin-chest desk for Claude Code Remote Control sessions that are **archived on process teardown and never unarchived**. A session still on the default list is not a hold. Score the lid or admit **laid**.

Auto-update / ShipIt / app quit kills every running Code session process. Each session archives its Remote Control (cloud) session during teardown. Sessions vanish from the mobile / `claude.ai/code` default list and appear only under Archived. Desktop app log records no archive request (archive is issued by the session process itself). Archiving propagates desktop→cloud. Unarchiving never propagates. `LocalSessions.unarchive` happens locally with no follow-on CCR request. Reopening locally makes the session active and reattaches the original bridge session id, yet the cloud session stays archived indefinitely. Workaround: unarchive from mobile/web only. Sessions on a separate machine running `claude remote-control` in server mode are unaffected. Suggested fix: teardown caused by an app-initiated restart should take the existing skip-archive path.

Idle word: **laid** (lid shut, nothing scored).
NEVER use the product name kist as the idle/state word.
NEVER use empty.
NEVER reuse Wraith's unlinked, Gasket's tight, Damper's banked, Cote's roosted, Larder's stocked, Tappet's seated, Aside's heard, Chute's clear, Tain's paired, Husk's kernel, Snib's latched, Veto's upheld, Assay's sterling, Wicket's home, Sigil's valid, Stencil's dry, Suture's sealed, Reveille's quiet, Livery's seised. Do not ship Livery. Do not rename to Livery, Crypt, Morgue, Pall, Cenotaph, Lych, or Wraith.

Verdicts: **laid**, **kisted**, **risen**, **hollow**, **stuck**, **lost**, **sealed**, **recalled**, **split**, **veiled**. Slack kist alarm on kisted / hollow / stuck / lost / sealed. Linear session-lost ticket on kisted / lost / sealed. GitHub kist-ledger of archive/unarchive asymmetry on every scored probe.

## Why not a clone

NOT Wraith (live-image unlink / afterimage). Same auto-update trigger, different harm: Wraith is the on-disk binary deleted under a live session so TCC/spawns die while grants stay ON. Kist is the cloud session being archived and never unarchived so it vanishes from mobile. Do not reuse Wraith's afterimage / deleted-inode / frost-ice-void visual, idle word unlinked, or verdicts.
NOT Damper (Remote Control auto-enable without consent). Damper is a settings toggle that is not a hold. Kist is archive-on-teardown + one-way archive propagation.
NOT Snib (Trusted Devices fail-open).
NOT Cote / Nixie (resume hub identity split / placeholder `leadSessionId`).
NOT Reveille (living muster / heartbeats across compaction).
NOT Gasket (sandbox allowlist silent discard).
NOT leftover woodworking / millimetre-slider clones. A kist is a metaphor for a coffin-chest diagnostic desk, not a leftover-instrument.

Different problem: teardown-archive that never unarchives. A session still on the default list is not a hold.
Different UI: undertaker's / joiner's kist workshop. Warm linen, brass fittings, oak/ash chest, paper labels, hinged lid, ledger book. Light or dusk. NOT Wraith ice-void. NOT Damper chimney soot. NOT Gasket steam-iron. NOT Cote dove loft. NOT Larder stillroom pantry.
Different idle word: **laid**.

## Live catalog path

`/kist/` is this static undertaker's kist. Oak chest, hinged lid, paper labels, funeral ledger. Demo works with no secrets and no npm. Mark: `02:50 Sydney · kist`.

1. Seeded `#90387` **kisted** is already on the lid: auto-update teardown, 278 CCR archives, 0 CCR unarchives, 3 local unarchives with no follow-on CCR, session reopened locally but cloud stays archived → **kisted** (cluster hollow / stuck / lost / veiled / sealed / recalled).
2. Switch **risen** — CCR unarchive reached cloud, back on the default list → **risen**.
3. Switch **hollow** — local session active + reattached, cloud still archived → **hollow**.
4. Switch **stuck** — local unarchive, zero CCR unarchive → **stuck**.
5. Switch **lost** — gone from the mobile default list, only under Archived → **lost**.
6. Switch **sealed** — no desktop-side action restores the cloud session → **sealed**.
7. Switch **recalled** — reopened locally, reattached to original bridge id → **recalled**.
8. Switch **split** `#65838` — archive state differs per client → **split**.
9. Switch **veiled** — listed only under the Archived filter → **veiled**.
10. Switch **Shut · laid** — lid shut, nothing scored → **laid**. Idle word is **laid** when the probe is idle.
11. **Score** scores. **Shut** returns idle laid. **Lift** opens the lid. **Kist** shows teardown-archive. **Rise** shows a mobile/web unarchive. Admit does not lie: a kisted probe stays kisted.

## Hook

`projects/kist/hook/` scores a probe `{ teardownCause, ccrArchiveRequested, ccrUnarchiveRequested, localUnarchiveRan, reopenedLocally, onMobileDefaultList, vanishedFromDefault, archivedFilterOnly, cloudStillArchived, localSessionActive, reattachedBridgeId, archiveStateDiffersPerClient, noDesktopRestore }` and returns `{ verdict, reasons[], cluster[], laid, kisted, hollow }`. See `hook/README.md`.

```bash
node projects/kist/hook/index.mjs --listen 9029
node --test projects/kist/hook/kist.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90387](https://github.com/anthropics/claude-code/issues/90387) — filed 2026-08-28, has repro. Auto-update / ShipIt / app quit archives every running Remote Control session. Sessions vanish from the mobile default list and appear only under Archived. 278 CCR archives, 0 CCR unarchives, 3 local unarchives with no follow-on CCR.

Corroboration (cite as shape, not a new primary):

- [anthropics/claude-code#87335](https://github.com/anthropics/claude-code/issues/87335) — open, Windows. Desktop update/reinstall breaks session continuity; archive/resume UI fails to surface the session. Same trigger, no mechanism identified; #90387 is the likely cause.
- [anthropics/claude-code#65838](https://github.com/anthropics/claude-code/issues/65838) — open. Archive state is per-client and does not propagate iOS↔macOS. Adjacent to the missing unarchive-propagation half, from the opposite direction.
- [anthropics/claude-code#71873](https://github.com/anthropics/claude-code/issues/71873) — closed, not planned. RC session auto-archives while still active (token-refresh race). Different trigger. #90387 is teardown-archive plus missing unarchive, which makes the result permanent.
- [anthropics/claude-code#39178](https://github.com/anthropics/claude-code/issues/39178) — auto-archive during idle (distinct; #71873 already contrasts this).

# Wraith

Afterimage / deleted-inode desk for Claude Code auto-updater that **replaces the running version’s on-disk binary while a session is still live**. A grant that is still ON is not a hold. Score the image or admit **unlinked**.

The updater unlinks the binary under a live agent session. The process keeps executing the deleted image (`lsof` shows the path as deleted; only the new version remains on disk). On macOS, TCC validates against the running binary’s code signature; once the image is gone, every access to a TCC-protected folder returns EPERM mid-session, with no warning, while System Settings still shows the folder grants toggled ON. In-app “Folder access granted” reports success and changes nothing. A concurrent session started after the update can read the same file. Full Disk Access cannot help. The only reliable fix is restart.

Idle word: **unlinked** (image seated, or the desk is idle).
NEVER use the product name wraith as the idle/state word.
NEVER use empty.
NEVER reuse Gasket's tight, Damper's banked, Cote's roosted, Larder's stocked, Tappet's seated, Aside's heard, Chute's clear, Tain's paired, Husk's kernel, Snib's latched, Veto's upheld, Assay's sterling, Wicket's home, Sigil's valid, Stencil's dry, Suture's sealed, Livery's seised. Livery must not ship.

Verdicts: **unlinked**, **pruned**, **ghosted**, **voided**, **orphaned**, **severed**, **stale**, **resurfaced**, **ejected**, **held**. Slack alarm on pruned / ghosted / voided / orphaned / severed. Linear incident on pruned / orphaned / severed. GitHub wraith-ledger issue on every scored probe.

## Why not a clone

NOT Gasket (project-scoped `sandbox.network.strictAllowlist` silently discarded; steam flange). Grants exist and stay enabled.
NOT Damper (Remote Control auto-enable without consent; chimney/flue). #70071 is post-update capability death while still “connected.”
NOT Cote / Nixie (`--resume` team-hub identity split).
NOT Snib (Trusted Devices fail-open). This is fail-closed mid-session with grants still true.
NOT Knock (permission-grant stalls). No prompt can fire.
NOT Hasp (file-lease contention).
NOT Husk (hollow API success envelopes). Hollow *process image* after unlink.
NOT Parity (claim-vs-reality of a single tool result). Systemic post-update ghost state.
NOT Tain (Chrome path pin #88726 is adjacent corroboration, not the thesis).
NOT Wicket (worktree isolation gatehouse).
NOT Chute (mail chute / sanctioned secret handoff).
NOT Livery / disclaimer-spawn / seisin: that was the first-read of #90373. The reporter corrected it to live-image unlink. Do not ship Livery.
NOT leftover woodworking / millimeter-slider clones.

Different problem: updater deletes the running image under a live session. A grant that is still ON is not a hold.
Different UI: cold glass, afterimage, deleted-inode ledger, version tombstone. NOT Gasket linen/brass/steam. NOT Damper soot/ember/chimney. NOT Livery baize/parchment/wax.
Different idle word: **unlinked**.

## Live catalog path

`/wraith/` is this static afterimage desk. Cold glass, afterimage, deleted-inode ledger, version tombstone. Demo works with no secrets and no npm. Mark: `01:50 Sydney · wraith`.

1. Seeded `#90373` **pruned** is already on the pane: updater deleted the running image under a live session, grants stay ON, reads EPERM mid-session with no warning → **pruned**.
2. Switch **ghosted** — grants still ON, in-app grant reports success, reads still EPERM → **ghosted**.
3. Switch **voided** — TCC-protected path EPERM mid-session, no warning → **voided**.
4. Switch **orphaned** `#86129` — Agent spawn “Spawned successfully”, child ENOENT, version dir pruned → **orphaned**.
5. Switch **severed** `#70071` — remote-control still connected/green, every new session EPERM → **severed**.
6. Switch **stale** `#75355` — `/proc/exe` or lsof txt shows `(deleted)`, newer version only on disk → **stale**.
7. Switch **resurfaced** — a concurrent session started after the update reads the same file → **resurfaced**.
8. Switch **ejected** — only restart restores capability → **ejected**.
9. Switch **held** — clean current-image session, path readable, grants match reality → **held**.
10. Switch **Seat · unlinked** — image seated, inode present → **unlinked**. Idle word is **unlinked** when the probe is idle.
11. **Press** scores. **Seat** returns idle unlinked. **Trace** checks lsof / proc exe. **Unlink** shows prune. **Hold** seats a current-image hold. Admit does not lie: a pruned probe stays pruned.

## Hook

`projects/wraith/hook/` scores a probe `{ imageDeleted, updaterPrunedRunningVersion, lsofOrProcExeDeleted, grantsStillOn, inAppGrantSuccessNoOp, bashEperm, readEperm, postUpdateSessionReadsOk, spawnSuccessEnoent, remoteControlGreenButEperm, restartRestores }` and returns `{ verdict, reasons[], unlinked, ghosted, pruned }`. See `hook/README.md`.

```bash
node projects/wraith/hook/index.mjs --listen 9073
node --test projects/wraith/hook/wraith.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90373](https://github.com/anthropics/claude-code/issues/90373) — filed 2026-08-28 by TB-Glenn. Labels: bug, platform:macos, area:desktop. Correction: the auto-updater replaces/deletes the running version’s on-disk binary while a session is still live. macOS validates a TCC grant against the running binary's code signature. Once the on-disk image is deleted and replaced, that validation fails mid-session, with no warning, and with the grant still enabled.

Corroboration (same live-image unlink class, not a new primary):

- [anthropics/claude-code#86129](https://github.com/anthropics/claude-code/issues/86129) — open. Updater removes the running version from `~/.local/share/claude/versions/`. Agent spawn “Spawned successfully” + child ENOENT.
- [anthropics/claude-code#75355](https://github.com/anthropics/claude-code/issues/75355) — open. Linux `/proc/<pid>/exe → …/versions/2.1.198 (deleted)`. Prune ignores process liveness.
- [anthropics/claude-code#70071](https://github.com/anthropics/claude-code/issues/70071) — open. Long-lived remote-control after self-update: phone still connected/green, new sessions EPERM; restart fixes.
- [anthropics/claude-code#80941](https://github.com/anthropics/claude-code/issues/80941) — open. Mid-session TCC Documents grant death; looks like permissions, isn’t.
- [anthropics/claude-code#26981](https://github.com/anthropics/claude-code/issues/26981) — CloudStorage EPERM; dead-end FDA advice.
- [anthropics/claude-code#64685](https://github.com/anthropics/claude-code/issues/64685) — earlier disclaimer/TCC framing; cite as the first-read that #90373’s correction superseded.
- [anthropics/claude-code#88726](https://github.com/anthropics/claude-code/issues/88726) — Chrome native-host wrapper pins a version path the next update deletes (adjacent class).

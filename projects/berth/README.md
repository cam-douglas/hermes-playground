# Berth

Harbour **berth** — a quay chalkboard of allotted slips — for a real Claude Code defect: **`spawn_task` chip sessions run in the spawning session's working tree, not an isolated worktree, while the spawning session is still editing that tree.** The model-facing text promises a fresh worktree / "chip … start it in a fresh worktree"; the user is told a separate local session started; `git worktree list` shows no new worktree; chip edits appear as interleaved uncommitted files in the parent's tree; the chip can create a branch and switch the shared checkout out from under the parent.

Primary: [anthropics/claude-code#90668](https://github.com/anthropics/claude-code/issues/90668) (OPEN, filed 2026-08-30, labels bug / platform:macos / area:agents / area:desktop). Title: spawn_task chip runs in the spawning session's working tree, not an isolated worktree — while that session is still editing it.

Minimal repro from the issue:

- Parent session in `~/code/wolverine` on a feature branch calls `spawn_task`.
- Tool result: "A chip is showing for the user — they can start it in a fresh worktree with one click."
- User starts the chip; system reminder: "The user started your suggested background task … in a separate local session."
- Observed: no new worktree (`git worktree list` unchanged); chip edits appear as uncommitted files in the parent's tree; chip can `git checkout -b` and flip the shared checkout.

Expected: either the chip actually uses an isolated worktree, matching what `spawn_task` reports, or the result stops promising one.

A shared berth is not a hold. Score the quay or admit **alongside**.

Idle word: **alongside** (vessel alone in its allotted berth / real isolated worktree; hold is quiet).
NEVER use the product name berth / empty / silent / mute / idle / seated / credited / level / verbatim / fronted / locked / yanked / caught / stowed / posted / bunged / belayed / rove / keyed / housed / beamed / snug / hung / appointed / cinched / gauged / stamped / overrun / pratique / wound / bound / stilled / stabled / drained / flat / fit / spoilt / laid / unlinked / tight / banked / roosted / stocked / heard / clear / paired / kernel / latched / upheld / sterling / home / valid / dry / quiet / seised / rung / **moored** as the idle/state word.

Verdicts: **alongside**, **cohabited**, **promised-fresh**, **same-floor**, **branch-stolen**, **interleaved**, **chip-lied**, **primary-dock**, **cwd-ignored**, **phantom-tree**, **off-quay**. Slack alarm + Linear ticket on cohabited / promised-fresh / same-floor / branch-stolen / interleaved / chip-lied / primary-dock / cwd-ignored / phantom-tree. GitHub berth-ledger of scored berths on every score.

The #90668 cohabited quay (chip cwd === parent cwd + parent still editing + no real worktree) is **cohabited**, never **alongside**. Unique nearby flags win their own seeds because those seeds do not carry the #90668 triad. Related issues (Fascia trust-path; Carrel launch.json; Byline ghost; UI preference local vs worktree) are **off-quay**, not this berth.

## Why not a clone

NOT **Carrel** — `preview_start` resolves `launch.json` from session cwd (#90661).
NOT **Fascia** — trust dialog names `spawn_task` cwd while the session *does* run in `.claude/worktrees` (#90638). Consent ≠ execution site. Berth is when isolation never happens.
NOT **Byline** — phantom hook `agent_id` (#90662).
NOT **Datum** — wrong-base code-review #90620.
NOT **Calque** — PowerShell Spanish del #90645.
NOT **Quoin / Gaff / Sear / Cubby / Grille / Spile / Bollard / Clew / Wicket / Hasp**.
Do NOT ship leftover woodworking / millimetre-slider clones.
Do NOT ship alternate names Slip, Slipway, Mooring, Buoy, Dolphin, Pontoon, Warp, Camber, Hard, Atelier, Hotdesk, Commons, Mews, Forge, Anvil, Stallage, Croft, Toft, Shuttle, Tenter. Product name is **Berth** only.

Different problem: spawn_task chip docks in the parent's working tree despite promising a fresh worktree.
Different UI: harbour / quay / berth board — tide board, berth chalkboard, fender posts — navy, rust, chalk, Bebas Neue + Lora + Space Mono.
Different idle word: **alongside**.

## Live catalog path

`/berth/` is this static harbour quay. Demo works with no secrets and no npm. Mark: `12:50 Sydney · berth`.

1. Seeded `#90668` **cohabited** is already on the chalkboard: chip cwd is the parent tree, parent still editing, no worktree → **cohabited**. Never alongside.
2. Switch **cwd-ignored** — #77263 cwd param set to a git repo but still no worktree.
3. Switch **phantom-tree** — #79234 `.claude/worktrees/<name>` exists but is not a real git worktree.
4. Switch **branch-stolen** — chip created/checked out a branch that moved the shared tree under the parent.
5. Switch **interleaved** — chip's uncommitted files appear in parent's git status mid-task.
6. Switch **promised-fresh** — schema/ack promised fresh worktree but none created.
7. Switch **same-floor** — same absolute filesystem path as spawning session.
8. Switch **chip-lied** — told "separate local session" / fresh worktree while cwd is parent's.
9. Switch **primary-dock** — started on primary checkout / project root with no worktree.
10. Switch **honest alongside** — chip has its own real git worktree; parent tree untouched → **alongside** true.
11. Switch **off-quay** — Fascia / Carrel / Byline, labeled, not this berth.
12. **Score** scores. **Admit alongside** scores honestly. **Restore · #90668** shows the cohabited quay. Admit does not lie.

## Hook

`projects/berth/hook/` scores a probe `{ parentCwd, chipCwd, worktreeCreated, worktreeIsGit, branchBefore, branchAfter, promisedFresh, parentStillEditing, interleavedPaths, cwdParam }` and returns `{ verdict, reasons[], alongside }`. See `hook/README.md`.

```bash
node projects/berth/hook/index.mjs --listen 9090
node --test projects/berth/hook/berth.test.mjs
```

`alongside` is true ONLY when the verdict is alongside (idle, or honest control: chip session has its own real git worktree; parent tree untouched). Seeded 90668 numbers must produce cohabited / `alongside=false`. Honest control with a real linked worktree produces `alongside=true`. A cohabited berth is never alongside.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90668](https://github.com/anthropics/claude-code/issues/90668) — OPEN, filed 2026-08-30, labels bug / platform:macos / area:agents / area:desktop. Title: spawn_task chip runs in the spawning session's working tree, not an isolated worktree — while that session is still editing it.

Same-class nearby (treat as nearby, scoreable, not the primary):

- [anthropics/claude-code#77263](https://github.com/anthropics/claude-code/issues/77263) — spawn_task text promises a "fresh worktree" (cwd param + ack), but chip sessions start on the primary checkout even with cwd set to a git repo.
- [anthropics/claude-code#79234](https://github.com/anthropics/claude-code/issues/79234) — Chip/spawn_task creates `.claude/worktrees/<name>` that is often NOT a real git worktree; `git checkout -b claude/<name>` runs in the PARENT repo and silently flips the shared main checkout (Windows).

Related, different (label, do not treat as this bug):

- [anthropics/claude-code#90638](https://github.com/anthropics/claude-code/issues/90638) — Fascia: trust dialog on "Start with worktree" *names* the spawn_task cwd while the session *does* run in a new `.claude/worktrees` path.
- [anthropics/claude-code#90661](https://github.com/anthropics/claude-code/issues/90661) — Carrel: preview_start resolves launch.json from session cwd.
- [anthropics/claude-code#86691](https://github.com/anthropics/claude-code/issues/86691) / [#81213](https://github.com/anthropics/claude-code/issues/81213) — UI preference / recommend local vs worktree (feature/UX).
- [anthropics/claude-code#89940](https://github.com/anthropics/claude-code/issues/89940) — git status snapshot of staged deletions inside a worktree that *does* exist.

Cross-ecosystem nearby, not identical:

- [openai/codex#31572](https://github.com/openai/codex/issues/31572) — Desktop subagents drift across Git branches in a shared workspace.
- [openai/codex#33144](https://github.com/openai/codex/issues/33144) — Named subagents intermittently ignore the requested worktree.
- [openai/codex#18969](https://github.com/openai/codex/issues/18969) — Support cwd for spawn_agent (child inherits parent cwd).

Cross-check nearby products are DIFFERENT (cite only as “not this”):

- NOT Carrel #90661, Fascia #90638, Byline #90662, Datum #90620, Calque #90645, Wicket, Hasp.

Suggested consumer fix from #90668: either the chip actually uses an isolated worktree, matching what `spawn_task` reports, or the result stops promising one so the spawning session can isolate its own work first.

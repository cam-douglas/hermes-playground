# Hardstand

A **night aviation hardstand / apron assay** — asphalt charcoal, sodium-vapor amber, taxiway blue edge lights, chevron markings, Dispatch radio strip, tower clearance board — Chakra Petch + Manrope + Share Tech Mono — for a real Claude Code defect: **DISPATCH `START_CODE_TASK` REFUSES A SECOND SESSION IN THE SAME NON-GIT DIRECTORY SINCE 2.1.258 (REGRESSION FROM 2.1.247).** Ground-control Dispatch radio refuses a second landing on the same non-git pad while the tower (Desktop app / scheduled tasks) still clears concurrent traffic on that same pad. Faceplate: Dispatch refused. Tower strip: two live. Score the pad or admit the hardstand already refused.

Primary:

- [anthropics/claude-code#92452](https://github.com/anthropics/claude-code/issues/92452) (OPEN, bug, has repro, platform:macos, regression, area:desktop). Title: `Dispatch start_code_task rejects second session in same non-git directory since 2.1.258 (regression from 2.1.247)`. Filed 2026-09-06T08:09:24Z. Reporter: dmtintner.

20:50 hardstand: a night apron that lets the tower clear two ships on the same non-git pad while Dispatch radio refuses the second landing — Another Claude Code session is already active in this directory. Score the pad or admit the hardstand already refused.

Idle word: **cleared** (pad open for another Dispatch landing / parallel `start_code_task` allowed). Seeded state: **refused** / #92452 — Dispatch `start_code_task` rejected; Another Claude Code session is already active in this directory; non-git `~/Projects` parent; app sessions still concurrent. Never idle as maxed, mute, inherited, freewheeling, deaf, choking, miscast, unguided, dropped, strobing, stolen, dawnlocked, misaimed, cold, voided, alongside, shed, latched, quiet, bound, or open. Never seeded as hardwired, rostered, collided, doubled, clobbered, retried, cohabited, vanished, or clamped.

**Hardstand** is an aviation night hardstand / apron — not a harbour berth. Turning a second Dispatch landing onto a plain parent folder should be cleared, as it was through bundle 2.1.247. Instead the radio refuses while the tower strip already shows two live.

- **cleared** = IDLE: pad open for another Dispatch landing / parallel `start_code_task` allowed
- **refused** = seeded word: Dispatch `start_code_task` rejected; Another Claude Code session is already active in this directory
- **dispatch-only** = only `mcp__dispatch__start_code_task` is rejected; app and scheduled sessions still concurrent
- **exclusive-cwd** = cousin #91745 asar: `exclusiveCwd` hardcoded true in `startCodeSession`; hypothesis only for #92452
- **non-git-parent** = plain parent folder containing many git repos; not itself a git repo
- **app-concurrent** = 2026-09-06 app opened two `~/Projects` sessions 29s apart; both active
- **scheduled-ok** = scheduled tasks still open overlapping sessions in `~/Projects` daily
- **bundle-258-regression** = first failure 19s after `claude-code-vm/2.1.258` install; still fails on 2.1.260
- **worktree-workaround** = dispatching into an individual git repo (worktree possible) still works
- **stale-block** = cousin #92462; finished non-archived session records still block until archived/deleted
- **cousins** = cite-only #91745 CLOSED and #92462 OPEN

Verdicts: cleared, refused, dispatch-only, exclusive-cwd, non-git-parent, app-concurrent, scheduled-ok, bundle-258-regression, worktree-workaround, stale-block, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a second Dispatch landing on a non-git parent would leave the pad cleared or already refused. Fixtures use the issue's error string, the non-git `~/Projects` parent, the 2.1.258 timeline, the 29-second app-concurrent tower strip, and the worktree workaround only.

Hypothesis only (NON-BINDING): Dispatch bridge hardcodes `exclusiveCwd` true (per #91745 asar evidence); #92452 is the macOS 2.1.258 regression of that Dispatch-only gate on non-git parent folders. Verify against issue evidence only. Discard if issue evidence disagrees. Encoded from the issue bodies only. Do not invent runtime source claims or source paths not stated in the issues.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92452](https://github.com/anthropics/claude-code/issues/92452)
- Cousins cite-only (NOT primary): [anthropics/claude-code#91745](https://github.com/anthropics/claude-code/issues/91745), [anthropics/claude-code#92462](https://github.com/anthropics/claude-code/issues/92462)

What happened (from the issues — do not invent):

- Since the desktop app / Claude Code bundle update on 2026-09-05, Dispatch's `start_code_task` refuses to open a session in a working directory that already has an active session, failing with `[DispatchTools] start_code_task failed for ~/Projects: Another Claude Code session is already active in this directory.`
- This breaks a workflow that worked until 2026-08-30: dispatching several parallel sessions into a plain (non-git) parent folder that contains many git repos.
- Regular Claude Code sessions opened from the app (including scheduled tasks) still run concurrently in that same folder without any issue, so the limit appears to be enforced only in the Dispatch orchestration path.
- Environment: macOS 26 (Darwin 25.5.0), Apple Silicon; Claude desktop app 1.46388.4 (regressed), last known good 1.40609.0; bundled Claude Code (claude-code-vm) 2.1.258 / 2.1.260 (regressed), last known good 2.1.247; target `~/Projects`, a normal folder (not a git repo) containing ~14 git repositories.
- Timeline from `~/Library/Logs/Claude/main*.log`: 2026-08-25 → 2026-08-30 `[DispatchTools] Spawned host code session ... at ~/Projects` logged 14 times, including two sessions 22 seconds apart (2026-08-30 20:51:04 and 20:51:26), bundle 2.1.246/2.1.247, app 1.37937–1.40609. 2026-09-05 02:00:45 `[ClaudeCodeManager-VM] Installed ... claude-code-vm/2.1.258`. 2026-09-05 02:01:04 first ever `start_code_task failed for ~/Projects` (19 seconds after the bundle install). Repeated at 02:01:19, 02:01:39. 2026-09-06 00:23:07 bundle 2.1.260 installed; 00:23:28 and 00:25:52 same failure.
- On 2026-09-06 the app itself opened two sessions with cwd `~/Projects` 29 seconds apart (10:49:51 and 10:50:20 local) and both were active at the same time; scheduled tasks also open overlapping sessions in `~/Projects` daily. Only `mcp__dispatch__start_code_task` is rejected.
- Expected: Dispatch should be able to spawn multiple sessions into the same non-repo working directory, as it did through bundle 2.1.247 / app 1.40609. If the intent is worktree isolation for git repos, a non-git parent folder should not be blocked, or at minimum the check should match the behaviour of normal session creation.
- Workaround: dispatching into an individual git repo folder (where a worktree can be created) still works. Cross-repo tasks that need the parent folder as cwd cannot be dispatched in parallel.

Problem found: Dispatch `start_code_task` on a non-git parent cwd → second session refused as already active → app and scheduled sessions on that same pad remain concurrent.

Why this solution: a diagnostic scorer for the refused pad → Dispatch-only exclusive-cwd chain, so a reader can pin idle cleared, seed refused, and score dispatch-only / exclusive-cwd / non-git-parent / app-concurrent / scheduled-ok / bundle-258-regression / worktree-workaround / stale-block / cousins against the published facts.

## Why not a clone

This is specifically: **Dispatch `start_code_task` exclusive-cwd refusal for a second session in a non-git directory while app sessions remain concurrent.**

NOT Berth/#90668 — `spawn_task` chip shares parent worktree despite promising fresh worktree. Hardstand is Dispatch `start_code_task` exclusive-cwd refusal for a second session in a non-git directory while app sessions remain concurrent.
NOT Rheostat/#92436 — `code-review --level low` hardwired high effort.
NOT Aphonia/#92409 — ListAgents without SendMessage.
NOT Fulcrum/#92377 — `--name` / auto-title registry collision.
NOT Wildcat/#92399 — `run_in_background` freewheel.
NOT Clobber/#92419 — inode rename deaf watcher.
NOT Watchdog/Understudy/Fairlead/Stroboscope/Heliostat/Lethe/Frizzen/Nixie/Embrasure/Elision/Graft/Reveille/Limpet/Reliquary/Pale and all prior catalog slugs.
Do NOT name this Berth, Slipway, Slip, Mooring, Buoy, Dolphin, Pontoon, Warp, Camber, Rheostat, Aphonia, or any existing catalog slug. Berth README banned Slipway as an alt name — product name is **Hardstand** only.
Do NOT reuse idle maxed / mute / inherited / freewheeling / deaf / choking / miscast / unguided / dropped / strobing / stolen / dawnlocked / misaimed / cold / voided / alongside / shed / latched / quiet / bound / open.
Do NOT reuse seeded hardwired / rostered / collided / doubled / clobbered / retried / cohabited / vanished / clamped.

Different surface: Dispatch `start_code_task` same-cwd refusal on a non-git parent vs spawn_task shared worktree / effort-level wiring / ListAgents-SendMessage asymmetry / naming collision / bg completion / inode watcher.

Product name stays **Hardstand**. Name/slug `hardstand` confirmed unused in catalog.json (179 products).

Different UI: night aviation hardstand / apron / sodium-vapor ground lighting / taxiway chevrons / Dispatch radio strip / tower clearance board. Chakra Petch / Manrope / Share Tech Mono. NOT harbour quay chalkboard (Berth — Bebas Neue / Lora / Space Mono). NOT bakelite rheostat bench (Rheostat — Oxanium / Lexend / Kode Mono). NOT laryngoscope tray (Aphonia — Fraunces / Karla). NOT windlass (Wildcat — Syne / Sora). NOT print shop (Clobber — DM Serif / Figtree). Stay OFF harbour berth / bakelite dial / voice-clinic tray / brass beam / windlass deck / forme/ink/plate.

Different verbs: pin idle cleared, pin seeded refused, score dispatch-only vs cleared, flip cleared vs refused, load fixtures, reset to cleared.

Different idle: **cleared**. Different seeded: **refused**. Contrast: **cleared** / **worktree-workaround**. Diagnostic: **dispatch-only** / **exclusive-cwd** / **non-git-parent** / **app-concurrent** / **scheduled-ok** / **bundle-258-regression** / **stale-block**.

Cousins cite-only (NOT primary — same family, not this macOS live-session report):

- [#91745](https://github.com/anthropics/claude-code/issues/91745) (CLOSED) — Dispatch cannot start second Code session in same folder since 1.44121.x; `exclusiveCwd` hardcoded true in `startCodeSession` (Windows); docs say parallel sessions OK; check gated on `exclusiveCwd`; hardcoded `exclusiveCwd:!0` in Dispatch bridge; also notes non-archived sessions can block.
- [#92462](https://github.com/anthropics/claude-code/issues/92462) (OPEN) — Linux 1.46388.2 — `start_code_task` blocked by *stale non-archived* session records (same root-cause family as #91745/#92452); finished sessions still block until archived/deleted.

## Live catalog path

`/hardstand/` is this static night-apron scoring assay. Path `https://hermes-playground-green.vercel.app/hardstand/` and subdomain `https://hardstand.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `20:50 Sydney · hardstand`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **refused** — Dispatch `start_code_task` rejected; Another Claude Code session is already active in this directory; non-git `~/Projects` parent; app sessions still concurrent.
2. Idle **cleared** → pad open for another Dispatch landing / parallel `start_code_task` allowed.
3. Diagnostic **dispatch-only** → only the Dispatch path is refused.
4. Diagnostic **exclusive-cwd** → cousin #91745 hardcoded `exclusiveCwd:!0` (hypothesis for #92452).
5. Diagnostic **non-git-parent** → plain parent folder containing many git repos.
6. Diagnostic **app-concurrent** → tower strip two live, 29s apart.
7. Diagnostic **scheduled-ok** → scheduled tasks still overlap daily.
8. Diagnostic **bundle-258-regression** → first refuse 19s after 2.1.258; still fails on 2.1.260.
9. Workaround **worktree-workaround** → individual git repo pad still accepts Dispatch.
10. Cousin **stale-block** → #92462 finished non-archived records still occupy the pad.
11. Assay UI: night apron, chevron markings, Dispatch radio strip, tower clearance board, sodium lamps, taxiway edge lights, bundle timeline.
12. Stay-off strip: Berth / Rheostat / Aphonia / Fulcrum / Wildcat / Clobber / Watchdog / Understudy / Fairlead / Slipway. Primary stays #92452.
13. **Score the pad** walks the probe ticket and lights chips on the apron. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite the radio (refuse / clear / dispatch / tower).

## How to score

Open `projects/hardstand/index.html` in a browser, or serve the repo root and visit `/hardstand/` (Vercel rewrite → `/projects/hardstand`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
node --test projects/hardstand/hook/hardstand.test.mjs
```

Empty paste scores the idle **cleared** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **refused** / Dispatch radio blocked / tower strip two live / non-git `~/Projects` / bundle 2.1.258.

## Hook

`projects/hardstand/hook/` scores a probe `{ seed, refused, dispatchOnly, exclusiveCwd, nonGitParent, appConcurrent, scheduledOk, bundle258Regression, worktreeWorkaround, staleBlock, error }` and returns `{ verdict, reasons[], cleared, refused, chips[] }`. See `hook/README.md`.

```bash
node projects/hardstand/hook/index.mjs projects/hardstand/data/refused.json
echo '{"seed":"cleared","cleared":true,"refused":false,"dispatchAccepted":true}' | node projects/hardstand/hook/index.mjs
```

`cleared` is true ONLY when the verdict is cleared (idle, or honest control: parallel `start_code_task` allowed on the pad). Seeded 92452 numbers must produce refused / `cleared=false`. A refused hardstand is never cleared.

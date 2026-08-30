# Carrel

Library **carrel** — a reading room of private-looking desks that all share one communal card catalog — for a real Claude Code defect: **`preview_start` matches `name` against the orchestrator session's `.claude/launch.json`, not the calling subagent's own file in its git worktree. A lane with `isolation:"worktree"` (or EnterWorktree) cannot have private preview config. The only workaround is writing the lane's entry into the shared session file. N concurrent lanes each need a distinct port and a distinct `-C` worktree cwd; all edit one file; last writer wins with no error; a lane can serve a sibling worktree under its own port.**

Primary: [anthropics/claude-code#90661](https://github.com/anthropics/claude-code/issues/90661) (OPEN, filed 2026-08-29, labels bug / has repro / platform:macos / area:agents). Title: preview_start resolves .claude/launch.json from the session cwd, not the calling agent's, so concurrent worktree lanes must contend for one config file.

Minimal repro from the issue:

- Root `launch.json` has `name` `root-web` port 3000.
- Worktree `launch.json` has `name` `lane-web` port 3101.
- Session at project root launches a subagent whose cwd is the worktree.
- Subagent calls `preview_start({ name: "lane-web" })`.
- Observed: `name` is matched against the session file, `lane-web` is missing, attempt proceeds against `root-web` / port 3000.

Expected: resolve `launch.json` from the calling agent's cwd, walking up to the worktree root, and only then fall back to the session project root. Reading the session file *instead of* the caller's is the defect. Falling back when the caller has none would be reasonable (`fallback-ok`).

A borrowed carrel is not a hold. Score the reading room or admit **seated**.

Idle word: **seated** (`preview_start` resolved `launch.json` from the calling agent's own worktree; hold is quiet).
NEVER use the product name carrel / empty / silent / mute / idle / credited / level / verbatim / fronted / locked / yanked / caught / stowed / posted / bunged / belayed / rove / keyed / housed / beamed / snug / hung / appointed / cinched / gauged / stamped / overrun / pratique / wound / bound / stilled / home / laid / spoilt / fit / flat / drained as the idle/state word.

Verdicts: **seated**, **borrowed**, **misfiled**, **contended**, **overwritten**, **sibling-served**, **lane-blind**, **nested-miss**, **main-spawn**, **fallback-ok**, **off-shelf**. Slack alarm on borrowed / misfiled / contended / overwritten / sibling-served / lane-blind / nested-miss / main-spawn. Linear ticket on borrowed / misfiled / sibling-served / contended. GitHub carrel-ledger of scored rooms on every score.

The #90661 borrowed room (session file used + caller has its own file + session cwd ≠ caller cwd) is **borrowed**, never **seated**. Unique nearby flags win their own seeds because those seeds do not carry the borrowed triad. Related issues (#86039 relative cwd *inside* the card; Wicket escape; Fascia trust; Hasp lease; Byline ghost) are **off-shelf**, not this bug.

## Why not a clone

NOT **Wicket** — worktree isolation escapes: absolute Edit/Write lands in the main checkout.
NOT **Fascia** — trust dialog names `spawn_task` cwd while the session runs in `.claude/worktrees`.
NOT **Hasp** — file-lease last-writer-wins on the same path (generic, not `launch.json` discovery).
NOT **Iota** — Windows path-key identity in `~/.claude.json`.
NOT **Cinch** — silent partial folder mounts.
NOT **Cubby** — wrong-ancestor auto-memory.
NOT **Byline** — phantom hook `agent_id`.
NOT **Datum** — wrong-base code-review #90620.
NOT **Calque** — PowerShell Spanish del #90645.
Do NOT ship leftover woodworking / millimetre-slider clones.
Do NOT ship alternate names Stall, Booth, Desk, Alcove, Nook, Stack, Folio, Catalog. Product name is **Carrel** only.

Different problem: which `launch.json` file `preview_start` discovers — session cwd vs caller cwd — plus the silent shared-file race the workaround forces.
Different UI: library reading room / private-looking carrels / communal card catalog / call slips / banker's lamps — walnut, parchment, Fraunces + Literata + IBM Plex Mono.
Different idle word: **seated**.

## Live catalog path

`/carrel/` is this static reading room. Demo works with no secrets and no npm. Mark: `11:50 Sydney · carrel`.

1. Seeded `#90661` **borrowed** is already on the catalog: session file used, caller has `lane-web` / 3101, name matched against `root-web` / 3000 → **borrowed**. Never seated.
2. Switch **misfiled** — name matched against orchestrator configurations; lane name missing.
3. Switch **contended** — N lanes writing one shared `launch.json`.
4. Switch **overwritten** — last-writer-wins, no error.
5. Switch **sibling-served** — preview serving a sibling worktree under this lane's port.
6. Switch **lane-blind** — caller cwd ignored for discovery.
7. Switch **nested-miss** — #76496 file exists in nested `.claude/worktrees/<name>/` but lookup fails.
8. Switch **main-spawn** — #63008 spawn cwd is the main repo, not the worktree.
9. Switch **fallback-ok** — caller has no file; session fallback is explicit and safe.
10. Switch **honest seated** — caller-cwd discovery → **seated** true.
11. Switch **off-shelf** — #86039 / Wicket / Fascia / Hasp / Byline, labeled, not this bug.
12. **Score** scores. **Admit seated** scores honestly. **Restore · #90661** shows the borrowed room. Admit does not lie.

## Hook

`projects/carrel/hook/` scores a probe `{ sessionCwd, callerCwd, launchJsonPathUsed, requestedName, configsInScope, spawnCwd, port, siblingWrites }` and returns `{ verdict, reasons[], seated }`. See `hook/README.md`.

```bash
node projects/carrel/hook/index.mjs --listen 9090
node --test projects/carrel/hook/carrel.test.mjs
```

`seated` is true ONLY when the verdict is seated (idle, or honest control: launch.json resolved from the calling agent's worktree). Seeded 90661 numbers must produce borrowed / `seated=false`. Honest control with caller-file discovery produces `seated=true`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90661](https://github.com/anthropics/claude-code/issues/90661) — OPEN, filed 2026-08-29, labels bug / has repro / platform:macos / area:agents. Title: preview_start resolves .claude/launch.json from the session cwd, not the calling agent's, so concurrent worktree lanes must contend for one config file.

Same-class nearby (treat as nearby, scoreable, not the primary):

- [anthropics/claude-code#63008](https://github.com/anthropics/claude-code/issues/63008) — preview_start spawns the dev server with main-repo cwd instead of the session's worktree cwd.
- [anthropics/claude-code#76496](https://github.com/anthropics/claude-code/issues/76496) — preview_start fails to find `.claude/launch.json` inside nested `.claude/worktrees/<name>/` even when the file exists at the path the error cites.

Related, different (label, do not treat as this bug):

- [anthropics/claude-code#86039](https://github.com/anthropics/claude-code/issues/86039) — relative cwd values *inside* launch.json resolving against the session worktree on UI-initiated launches (mirror image one level down; discovery of the file itself is this issue).
- [anthropics/claude-code#85319](https://github.com/anthropics/claude-code/issues/85319) — Start-dev-server button vs configured url.

Cross-ecosystem nearby, not identical:

- [openai/codex#18969](https://github.com/openai/codex/issues/18969) — Support cwd for spawn_agent (child inherits parent cwd).
- [openai/codex#23095](https://github.com/openai/codex/issues/23095) — spawn_agent workspace/worktree directory.
- [openai/codex#30570](https://github.com/openai/codex/issues/30570) — worktree-aware thread environment (project identity vs execution cwd).

Tracked downstream: narduk-enterprises/agent-infrastructure#845 (PreToolUse hook refusing writes to a launch.json outside the calling agent's tree — blocks the dangerous workaround, cannot make preview_start usable from a lane).

Cross-check nearby products are DIFFERENT (cite only as “not this”):

- NOT Wicket, Fascia #90638, Hasp #90146, Iota, Cinch, Cubby, Byline #90662, Datum #90620, Calque #90645.

Suggested consumer fix from #90661: resolve `launch.json` from the calling agent's cwd, walking up to the worktree root, and only then fall back to the session project root. Reading the session file *instead of* the caller's is the defect.

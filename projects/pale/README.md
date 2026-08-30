# Pale

Medieval / Tudor **pale** — a fenced jurisdiction, a parish bounded by oak stakes and a peat ditch — for a real Claude Code defect: **project hooks and `.claude/settings.json` only bind *inside* the pale (the resolved project root).** Start a session from a parent directory, a monorepo package subdirectory, or otherwise so the project root ≠ the repo root that holds `.claude/settings.json`, and every PreToolUse / PostToolUse / Stop hook is silently absent. No warning. cwd can even be the repo. The fence never walked up.

Primary: [anthropics/claude-code#90683](https://github.com/anthropics/claude-code/issues/90683) (OPEN, filed 2026-08-30, labels: bug, area:hooks). Title: Hooks are silently absent when the project root isn't the repo root.

A session beyond the pale is not a hold. Score the fence or admit **bound**.

Idle word: **bound** (within the pale / hooks bound).
NEVER use bound for a failure. NEVER use the product name pale / empty / silent / mute / idle / sheltered / alongside / seated / credited / level / verbatim / fronted / locked / yanked / caught / stowed / posted / bunged / belayed / rove / keyed / housed / beamed / snug / hung / appointed / cinched / gauged / stamped / overrun / pratique / wound / girt / nested / cut / switched / spilled as the idle/state word.

Verdicts: **bound**, **beyond**, **unhooked**, **rootless**, **silent**, **above**, **subdir**, **walkless**, **fail-open**, **off-pale**. Slack chip + Linear ticket on beyond / unhooked / rootless / silent / above / subdir / walkless / fail-open. GitHub pale-ledger of scored intakes on every score.

The #90683 beyond fence (wrong project root + settings present below/elsewhere + hooks absent with no warning) is **beyond**, never **bound**. Unique nearby flags win their own seeds because those seeds do not carry the #90683 triad. Chatelaine/Waif/Berth/Carrel/Byline-shaped different bugs are labeled **off-pale**, not this fence.

## Why not a clone

NOT **Chatelaine** — mcpOAuth nested inside the Anthropic Keychain identity so logout burns still-valid MCP grants ([#90647](https://github.com/anthropics/claude-code/issues/90647)). Opposite storage problem.
NOT **Waif** — Bash timeout does not kill the child process tree ([#90672](https://github.com/anthropics/claude-code/issues/90672)).
NOT **Berth** — spawn_task chip shares the parent working tree ([#90668](https://github.com/anthropics/claude-code/issues/90668)).
NOT **Carrel** — launch.json resolved from session cwd ([#90661](https://github.com/anthropics/claude-code/issues/90661)).
NOT **Byline** — phantom hook agent_id ([#90662](https://github.com/anthropics/claude-code/issues/90662)).
NOT **Fascia** — trust dialog names the wrong cwd ([#90638](https://github.com/anthropics/claude-code/issues/90638)).
NOT **Damper** — remote-control auto-on. NOT **Snib** — trusted-devices fail-open. Different fail-open surfaces.
NOT leftover woodworking / millimetre-slider / chatelaine-chain / foundling / harbour clones.
Do NOT ship alternate names Bailey, Soke, Stile, Limen, Verge, Franchise, Bailiwick, Precinct, Demesne, March, Mark, Stockade, Enceinte, Motte, Keep, Barbican, Postern, Outparish, Wapentake. Product name is **Pale** only.

Different problem: project hooks fail open with zero signal when the session's project root is not the directory that holds `.claude/settings.json` (parent-of-repo start, subdirectory start, no walk-up).
Different UI: medieval / Tudor pale — wooden pale fence, peat ditch, jurisdiction map, parish boundary stones, iron gall on parchment, oak and peat. Cinzel + UnifrakturCook + Source Serif + IBM Plex Mono.
Different idle word: **bound**.

## Live catalog path

`/pale/` is this static jurisdiction-fence desk. Demo works with no secrets and no npm. Mark: `15:50 Sydney · pale`.

1. Seeded `#90683` **beyond** is already on the ledger: started one directory above the repo; `repo/.claude/settings.json` never loaded; every hook silently does not exist; a write a hook should have blocked went through → **beyond**. Never bound.
2. Switch **unhooked** — settings file present on disk under the repo, zero hooks armed in session (#79480).
3. Switch **rootless** — nearby #78505 cloud multi-repo; `CLAUDE_PROJECT_DIR` empty.
4. Switch **silent** — nearby #89215 Claude Code on the Web silently ignored repo settings.
5. Switch **above** — session started in a parent of the repo; a warning did fire, so not the silent triad.
6. Switch **subdir** — nearby #76441/#79111/#86187 launched from a package subdirectory, no walk-up.
7. Switch **walkless** — nearby #88871 loader never walks up to find `.claude/settings.json`.
8. Switch **fail-open** — a write proceeded without the hook that should have blocked it; roots already matched.
9. Switch **off-pale** — Chatelaine/Waif/Berth-shaped different bugs. Labeled, not beyond.
10. Switch **honest bound** — session project root == settings dir; hooks registered and would fire → **bound** true.
11. **Score** scores. **Admit bound** scores honestly. **Restore · #90683** shows the beyond fence. Admit does not lie.

## Hook

`projects/pale/hook/` scores a probe `{ settingsPresentOnDisk, sessionProjectRoot, settingsDir, rootsMatch, hooksRegisteredCount, warningEmitted, startedAboveRepo, startedInSubdir, walkUpAttempted, toolProceededUnhooked, nearbySubdirMiss, nearbyWebIgnore, nearbyCloudEmpty }` and returns `{ verdict, reasons[], bound }`. See `hook/README.md`.

```bash
node projects/pale/hook/index.mjs --listen 9090
node --test projects/pale/hook/pale.test.mjs
```

`bound` is true ONLY when the verdict is bound (idle, or honest control: session project root == directory containing `.claude/settings.json`; hooks registered and would fire; walk-up or explicit root correct). Seeded 90683 numbers must produce beyond / `bound=false`. Honest control with a matching root produces `bound=true`. A session beyond the pale is never bound.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90683](https://github.com/anthropics/claude-code/issues/90683) — OPEN, filed 2026-08-30. Title: Hooks are silently absent when the project root isn't the repo root. Labels: bug, area:hooks. Body: `.claude/settings.json` loads from the session's **project root**, not the working directory. Start one directory above a repo and `repo/.claude/settings.json` is never loaded — every hook silently does not exist. Nothing signals it. Cost: a write a hook should have blocked went through; a day of architecture built around a phantom limitation.

Same-class nearby (treat as nearby, scoreable, not the primary):

- [anthropics/claude-code#76441](https://github.com/anthropics/claude-code/issues/76441) — Launching from a subdirectory silently loads ZERO project hooks — root `.claude/settings.json` never read (no walk-up, no warning).
- [anthropics/claude-code#79111](https://github.com/anthropics/claude-code/issues/79111) — Subdirectory launches skip repo-root hooks (fail-open) while permission grants still persist to the root.
- [anthropics/claude-code#86187](https://github.com/anthropics/claude-code/issues/86187) — `.claude/settings.json` ignored when starting from a subdirectory — hooks and plugins silently disabled (still repros; cites #10367, #8810).
- [anthropics/claude-code#79480](https://github.com/anthropics/claude-code/issues/79480) — PreToolUse hooks in project `.claude/settings.json` are silently not registered.
- [anthropics/claude-code#89215](https://github.com/anthropics/claude-code/issues/89215) — Claude Code on the Web: repository `.claude/settings.json` silently ignored, hooks never run.
- [anthropics/claude-code#78505](https://github.com/anthropics/claude-code/issues/78505) — Cloud multi-repo sessions never load repo `.claude/settings.json` (hooks silently don't fire); `CLAUDE_PROJECT_DIR` empty.
- [anthropics/claude-code#88871](https://github.com/anthropics/claude-code/issues/88871) — FEATURE: Load trusted hooks from nested repositories / `--add-dir` directories.

Related, different (label, do not treat as this bug):

- [anthropics/claude-code#90647](https://github.com/anthropics/claude-code/issues/90647) — Chatelaine: mcpOAuth nested inside Anthropic Keychain identity.
- [anthropics/claude-code#90672](https://github.com/anthropics/claude-code/issues/90672) — Waif: Bash timeout does not kill child process tree.
- [anthropics/claude-code#90668](https://github.com/anthropics/claude-code/issues/90668) — Berth: spawn_task chip shares parent working tree.
- [anthropics/claude-code#90661](https://github.com/anthropics/claude-code/issues/90661) — Carrel: launch.json resolved from session cwd.
- [anthropics/claude-code#90662](https://github.com/anthropics/claude-code/issues/90662) — Byline: phantom hook agent_id.
- [anthropics/claude-code#90638](https://github.com/anthropics/claude-code/issues/90638) — Fascia: trust dialog names wrong cwd.

Cross-ecosystem nearby, not identical (same jurisdiction-miss class, different product surface):

- [openai/codex#28903](https://github.com/openai/codex/issues/28903) — AGENTS.md not loaded from ancestor directories above repo root.
- [openai/codex#30789](https://github.com/openai/codex/issues/30789) — git submodule stops AGENTS.md discovery at submodule root; superproject file silently ignored.
- [openai/codex#38065](https://github.com/openai/codex/issues/38065) — AGENTS.md is not resolved per repository in multi-root workspaces.

Cross-check nearby products are DIFFERENT (cite only as “not this”):

- NOT Chatelaine #90647, Waif #90672, Berth #90668, Carrel #90661, Byline #90662, Fascia #90638, Damper, Snib, leftover woodworking.

Suggested consumer fix from #90683 (document, do not implement against Claude Code itself): warn at session start when a `.claude/settings.json` exists *below* the project root and is not loaded; expose the resolved hook configuration; walk up from cwd to find the settings-bearing directory, or document the project-root-vs-cwd distinction so an ungoverned session is visible.

# Fascia

Shopfront fascia — the enamel board over a high-street door that names the shop the public is asked to trust — for a real Claude Code defect: **clicking "Start with worktree" on a suggested-task chip shows a "Trust this workspace?" modal that names the `cwd` passed to `spawn_task`, but the session actually runs in a freshly created worktree under the spawning repo's `.claude/worktrees/`.** The user reads one directory, approves it, and the hooks/settings the banner cites then execute in a directory they were never shown. The ask is one line: name the directory the session will run in.

Primary: [anthropics/claude-code#90638](https://github.com/anthropics/claude-code/issues/90638) (OPEN, filed 2026-08-29, labels bug/platform:windows/area:security/area:agents/area:desktop). Title: Trust dialog on a chip's "Start with worktree" names the spawn_task cwd, not the worktree the session runs in. Concrete measured paths: dialog named `C:\Users\Scott\Code\MessageFoundry-b1-1067-repo-governance` (the spawn_task cwd / linked worktree); session ran in `C:\Users\Scott\Code\MessageFoundry\.claude\worktrees\heuristic-nobel-5180df` created by the click. Trust is per `CLAUDE_CONFIG_DIR` (path trusted in account-4 config, absent from account-2 at click).

A misnamed fascia is not a hold. Score the shopfront or admit **fronted**.

Idle word: **fronted** (the consent label matches the execution site after normalize; the fascia names the door that opens).
NEVER use the product name fascia / empty / silent / mute / idle / dead / sealed / locked / yanked / caught / stowed / posted / bunged / belayed / rove / keyed / housed / beamed / snug / hung / appointed / cinched / gauged / stamped / overrun / pratique / wound / bound / stilled / stabled / drained / flat / fit / spoilt / laid / unlinked / tight / banked / roosted / stocked / seated / heard / clear / paired / kernel / latched / upheld / sterling / home / valid / dry / quiet / seised / rung / moored as the idle/state word.

Verdicts: **fronted**, **misnamed**, **diverted**, **approved-blind**, **spawn-cwd**, **worktree-elsewhere**, **trust-lie**, **chip-start**, **account-split**. Slack alarm on misnamed / diverted / approved-blind / trust-lie / worktree-elsewhere. Linear ticket on misnamed / trust-lie. GitHub fascia-ledger of scored probes on every score.

The #90638 misnamed shopfront (dialog names spawn_task cwd + session runs in `.claude/worktrees`) is **misnamed**, never **fronted**. Unique nearby flags win their own seeds because those seeds do not carry the misnamed triad.

## Why not a clone

NOT **Wicket** — worktree isolation gatehouse / absolute-path sandbox escape. Fascia is the consent label lying about where execution will land, not isolation failure. Not #74726 #81333 #86584 #85448.
NOT **Snib** — Trusted Devices fail-open night-latch on Remote Control.
NOT **Iota** — Windows path-key case/slash identity in `~/.claude.json`.
NOT **Damper** — Remote Control auto-enable without consent.
NOT **Hasp** — file lease / last-writer-wins.
NOT **Cubby** — wrong-ancestor auto-memory.
NOT **Quoin** / **Gaff** / **Sear** / **Grille** — quoted-heredoc unescape / timeout-kill false complete / inert set -e / Bash-steered edits.
Do NOT ship leftover woodworking / millimetre-slider clones.
Do NOT ship alternate names Placard, Shingle, Marquee, Lintel, Escutcheon, Signboard, Trustgate, WorktreeTrust. Product name is **Fascia** only.

Different problem: TRUST DIALOG NAMES spawn_task cwd WHILE SESSION RUNS IN A DIFFERENT `.claude/worktrees` PATH → CONSENT ≠ EXECUTION SITE.
Different UI: shopfront / high-street fascia desk — enamel navy/cream fascia board, brass house numbers, frosted glass door, ledger of named-vs-actual paths, cream paper trust certificate, night-shutter contrast. Fonts: Playfair Display + IBM Plex Mono.
Different idle word: **fronted**.

## Live catalog path

`/fascia/` is this static shopfront fascia desk. Enamel navy, cream paper, brass numbers, frosted door, night shutter. Demo works with no secrets and no npm. Mark: `06:50 Sydney · fascia`.

1. Seeded `#90638` **misnamed** is already on the board: dialog `MessageFoundry-b1-1067-repo-governance`, actual `.claude/worktrees/heuristic-nobel-5180df` → **misnamed**. Never fronted.
2. Switch **diverted** — execution landed on a third shopfront.
3. Switch **approved-blind** — Trust workspace accepted; the run directory was never shown.
4. Switch **spawn-cwd** — dialog repeats the spawn_task cwd; that is not the run path.
5. Switch **worktree-elsewhere** — session sits under `.claude/worktrees`; fascia named a different door.
6. Switch **trust-lie** — permanent trust entry for a directory no session used.
7. Switch **chip-start** — Start with worktree was the button; run path not yet named.
8. Switch **account-split** — trusted in another `CLAUDE_CONFIG_DIR`; absent from the active account.
9. Switch **honest fronted** — dialog names the worktree that actually runs → **fronted** true.
10. **Score** scores. **Admit fronted** scores honestly. **Restore · #90638** shows the misnamed shopfront. Admit does not lie.

## Hook

`projects/fascia/hook/` scores a probe `{ dialogNamedPath, actualRunPath, spawnTaskCwd, button, configDir, trustPresentInActiveConfig, trustPresentInOtherAccount, platform, issue }` and returns `{ verdict, reasons[], fronted }`. See `hook/README.md`.

```bash
node projects/fascia/hook/index.mjs --listen 9090
node --test projects/fascia/hook/fascia.test.mjs
```

`fronted` is true ONLY when normalized `dialogNamedPath` === normalized `actualRunPath` AND the verdict is fronted (not a failure class). Seeded 90638 numbers must produce misnamed / `fronted=false`. Honest control where the dialog names the worktree that actually runs produces `fronted=true`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90638](https://github.com/anthropics/claude-code/issues/90638) — OPEN, filed 2026-08-29, labels bug/platform:windows/area:security/area:agents/area:desktop. Title: Trust dialog on a chip's "Start with worktree" names the spawn_task cwd, not the worktree the session runs in.

Same-class / nearby trust-path (cite as related, not identical):

- [anthropics/claude-code#54628](https://github.com/anthropics/claude-code/issues/54628) — Trust this workspace dialog appears every single time
- [anthropics/claude-code#87325](https://github.com/anthropics/claude-code/issues/87325) — Skills-dir plugins: every launch dir silently gets `hasTrustDialogAccepted:false`, no dialog
- [anthropics/claude-code#67319](https://github.com/anthropics/claude-code/issues/67319) — VS Code extension never shows trust dialog so project settings silently skipped
- [anthropics/claude-code#90041](https://github.com/anthropics/claude-code/issues/90041) — Windows headersHelper trust gate reads forward-slash project key
- [anthropics/claude-code#74794](https://github.com/anthropics/claude-code/issues/74794) — trust dialog never re-prompts after directory rename when parent trusted

Nearby worktree poles that are NOT this (cite only as "not this" — Wicket territory):

- [anthropics/claude-code#74726](https://github.com/anthropics/claude-code/issues/74726) — isolation:"worktree" does not sandbox absolute file paths
- [anthropics/claude-code#81333](https://github.com/anthropics/claude-code/issues/81333) — worktree-isolated subagent reset the main checkout
- [anthropics/claude-code#86584](https://github.com/anthropics/claude-code/issues/86584) — sibling cwd race / idle parent reaps a live child
- [anthropics/claude-code#85448](https://github.com/anthropics/claude-code/issues/85448) — isolation binds the worktree to the caller's Bash cwd

Cross-check nearby products are DIFFERENT (cite only as “not this”):

- NOT Wicket. Isolation / absolute-path sandbox escape.
- NOT Snib. Trusted Devices fail-open.
- NOT Iota. Path-key case/slash identity.
- NOT Damper. Remote Control auto-enable.
- NOT Hasp. File lease.
- NOT Cubby. Wrong-ancestor auto-memory.
- NOT Quoin. Quoted-heredoc unescape.

Cross-ecosystem (named cwd ≠ execution site):

- [openai/codex#16525](https://github.com/openai/codex/issues/16525) — Codex desktop on Windows reports a malformed cwd for worktree threads and can target the wrong checkout. Different mechanism, same class of lie.

## Integrations

Slack alarm on misnamed / diverted / approved-blind / trust-lie / worktree-elsewhere. Linear ticket on misnamed / trust-lie. GitHub fascia-ledger of scored probes on every score. Demo mode needs no Slack / GitHub / Linear secrets and no npm. Native stubs fire in the UI (ledger tape / alarm card) without requiring live tokens.

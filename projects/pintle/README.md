# Pintle

A **rudder pintle / gudgeon / tiller** — bronze pin and strap on an oak rudder stock, marine workshop, salt-air metal, tiller ropes, sailcloth cream; Syne + DM Sans + JetBrains Mono — for a real Claude Code defect: a `PreToolUse` hook on the `Bash` tool, registered in `.claude/settings.json` with a **relative** command path, can permanently deadlock the Bash tool for the rest of a session.

Primary:

- [anthropics/claude-code#91226](https://github.com/anthropics/claude-code/issues/91226) (OPEN, bug, has repro, platform:macos, area:bash, area:hooks, filed 2026-09-01T13:40:21Z). Title: PreToolUse Bash hook with relative command path can permanently deadlock the Bash tool for the rest of a session. Claude Code 2.1.252, macOS. Reporter hamazinger.

A pintle that misses the gudgeon after one cd is not a hold. Score the hinge or admit **hinged**.

Idle word: **hinged**. Seeded state: **seized** / #91226 — cwd drifted; hook ENOENT; every Bash blocked including corrective cd. Never idle as seized / pealed / drained / pooled / warded / first-wins.

A **pintle** is the hinge pin on a tiller. The project root is the gudgeon. When Bash cwd drifts, the pin misses and the rudder **seizes** — every Bash stroke fails.

- **seized** = #91226: relative PreToolUse Bash hook; cwd drifted; ENOENT; every later Bash call fails before running
- **cwd-drifted** = Bash cwd persists across calls; after `cd some/subdirectory && ...` relative resolution uses the drifted cwd
- **hook-enoent** = `python3` cannot open the script from the drifted cwd
- **session-deadlock** = every subsequent Bash call fails (even `pwd` / `echo test`)
- **corrective-cd-blocked** = a corrective `cd` also goes through the broken hook
- **worktree-escape** = `isolation: worktree` was the only in-session escape
- **ordinary-subagent-inherits** = a non-worktree subagent inherits the broken state
- **absolute-ok** = an absolute hook path is always hinged
- **project-dir-anchored** = `$CLAUDE_PROJECT_DIR` / project-root resolution is healthy
- **hold** = relative hook plus cwd still at project root
- **hinged** = HOLD: relative hook resolves from project root; Bash still works after cd

Verdicts: hinged, seized, cwd-drifted, hook-enoent, session-deadlock, corrective-cd-blocked, worktree-escape, ordinary-subagent-inherits, absolute-ok, project-dir-anchored, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the hinge is hinged or seized.

Hypothesis only (NON-BINDING): treat resolution against bashCwd for relative paths as the defect; anchoring to projectRoot / `$CLAUDE_PROJECT_DIR` is healthy. Spawn/ENOENT failures must not hard-block the whole Bash tool forever. Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **RELATIVE PRETOOLUSE BASH HOOK RESOLUTION AGAINST DRIFTED CWD — ENOENT THEN SESSION-PERMANENT DEADLOCK.** Relative command in `.claude/settings.json`. Bash cwd persists. After one `cd` the hook misses. Every later Bash call fails before running, including a corrective `cd`. Ordinary subagent inherits. Worktree-isolated subagent was the only in-session escape.

NOT **Carillon** ([#91250](https://github.com/anthropics/claude-code/issues/91250)) — plugin SessionStart first-wins / peal-board.
NOT **Postern** ([#91223](https://github.com/anthropics/claude-code/issues/91223)) — socket-dir squat / night bailey.
NOT **Sluice** ([#91265](https://github.com/anthropics/claude-code/issues/91265)) — Cowork Toke/File/SeAt millrace / sluice-gate / pool-gauge.
NOT **Alidade** ([#91055](https://github.com/anthropics/claude-code/issues/91055)) — plane-table station.
NOT **Pale** / **Ambo** / **Tappet** / **Pawl** — other hook surfaces.
NOT leftover woodworking / mm-slider / garner grain-bin.
Product name stays **Pintle**. Do not rename to Gudgeon, Tiller, Rudder, Hinge, Pin, Strap, Stock.

Different UI: bronze pintle + gudgeon on an oak tiller / rudder stock; marine workshop; salt-air metal; tiller ropes; verdigris / bronze / pitch / sailcloth cream. Syne + DM Sans + JetBrains Mono. NOT Playfair/Source Serif oak belfry (Carillon). NOT Cinzel/Literata night bailey (Postern). NOT Fraunces millrace (Sluice). NOT Libre Caslon plane-table (Alidade).

Different verbs: score the hinge, pin idle hinged, pin seeded seized, admit hinged, load fixtures, reset to hinged. Not "Score the peal/race/peg/postern".

Different idle: **hinged**.

## Live catalog path

`/pintle/` is this static tiller desk. Path `https://hermes-playground-green.vercel.app/pintle/` and subdomain `https://pintle.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `05:50 / hermes catalog #106 / #91226`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **hinged** — relative hook resolves from project root; Bash still works after cd; pintle seated.
2. Seed **seized** → #91226: cwd drifted; hook ENOENT; every Bash blocked; pintle misses the gudgeon.
3. Tiller UI: pintle pin vs gudgeon strap. Seated = hinged. Missed = seized.
4. Cousin cite strip labeled cousin-not-primary: claude-code [#32361](https://github.com/anthropics/claude-code/issues/32361) / [#5176](https://github.com/anthropics/claude-code/issues/5176) / [#87890](https://github.com/anthropics/claude-code/issues/87890) / [#65378](https://github.com/anthropics/claude-code/issues/65378); openai/codex [codex#26675](https://github.com/openai/codex/issues/26675) / [codex#23996](https://github.com/openai/codex/issues/23996). Cite only. Primary stays #91226.
5. **Score the hinge** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/pintle/index.html` in a browser, or serve the repo root and visit `/pintle/` (Vercel rewrite → `/projects/pintle`). No build step. Optional hook:

```bash
node projects/pintle/hook/pintle.mjs projects/pintle/data/91226.json
node projects/pintle/hook/pintle.mjs projects/pintle/data/hinged.json
node --test projects/pintle/hook/pintle.test.mjs
```

Seized seed → seized/alarm. Hinged seed → hinged/hold.

`projects/pintle/hook/pintle.mjs` classifies a probe ticket JSON `{ projectRoot, bashCwd, hookCommand, resolveMode }` and returns `{ verdict, chips[], reasons[], hinged, seized, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91226.json`, `data/seized.json`, `data/hinged.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`, `data/relatives.json`, `data/cousins.json`. Evidence only from issue facts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91226](https://github.com/anthropics/claude-code/issues/91226). Unauthenticated. Title, state, labels — not a cookbook. Cousins cited on the ledger, not primaries. See `.env.example`.
2. Paste/drop a probe ticket JSON and score it.
3. Tiller UI (pintle pin vs gudgeon strap). Seated = hinged, missed = seized.
4. Cousin-not-primary cite strip including Codex #26675 (Plugin PostToolUse relative command from workspace cwd).

## Sources

- [anthropics/claude-code#91226](https://github.com/anthropics/claude-code/issues/91226) OPEN — primary. Product stays Pintle.
- Cousins (cite, not primaries) — same-class relative hook after cd:
  - [#32361](https://github.com/anthropics/claude-code/issues/32361) CLOSED — same-class relative path breaks after Bash cd.
  - [#5176](https://github.com/anthropics/claude-code/issues/5176) CLOSED — hooks not found after cd.
- Cousins (cite, not primaries) — inverse / distinct:
  - [#87890](https://github.com/anthropics/claude-code/issues/87890) OPEN — EnterWorktree does not propagate to PreToolUse (inverse surface).
  - [#65378](https://github.com/anthropics/claude-code/issues/65378) OPEN — hooks ENOENT when session cwd deleted (distinct).
- Cousins (cite, not primaries) — openai/codex cwd mismatch:
  - [openai/codex#26675](https://github.com/openai/codex/issues/26675) OPEN — Plugin PostToolUse relative command from workspace cwd.
  - [openai/codex#23996](https://github.com/openai/codex/issues/23996) OPEN — project hooks in linked worktrees cwd mismatch.

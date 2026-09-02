# Codicil

A **probate / will-chamber / codicil desk** atelier — sealed will parchment, wax-seal lamp, clause strip showing Agent A's intended amend vs Agent B's rewritten legatee, HEAD SHA before/after strip; ink-on-vellum / wax-seal crimson / parchment cream / clerk navy — Literata + Figtree + Fragment Mono — for a real Claude Code defect: **SHARED MULTI-AGENT WORKTREE — `git commit --amend` DOES NOT RE-CHECK HEAD; SILENTLY REWRITES CONCURRENT TEAMMATE COMMIT MESSAGE; AREA:AGENTS.**

Primary:

- [anthropics/claude-code#91513](https://github.com/anthropics/claude-code/issues/91513) (OPEN, bug, has repro, area:agents, filed 2026-09-02T13:55:40Z, updated 2026-09-02T13:56:45Z). Title: In a shared multi-agent working tree, `git commit --amend` doesn't re-check HEAD, so it can silently rewrite a concurrent teammate's commit instead of the agent's own. Reporter KinohTaGo. Claude Code 2.1.239. Agent Teams session; multiple teammate agents sharing one non-worktree-isolated git working tree.

a codicil that amends whatever will is currently on the desk is not a sealed clause — it is a rewritten legatee. Score the seal or admit the teammate's HEAD already moved.

Idle word: **sealed**. Seeded state: **rewritten** / #91513 — Agent A creates C1; before A's follow-up amend, Agent B commits C2 on top of C1; A's `git commit --amend` does not re-check HEAD and rewrites C2 (tree byte-identical; B's message discarded). Never idle as swaged / torn / homed / armed / unheard / unbolted / snagged / reeved / fouled / creased / bled / latched / vanished / rebound / dark / spurious / fenced / swept / tolled / mute / discarded / arrested / indexed / chocked / clasped / sprung / hinged / pealed / crossed.

A **codicil** should seal the will on the desk: before `git commit --amend` in a possibly-shared tree, verify `git rev-parse HEAD` still equals the SHA from the agent's own prior commit, and refuse or warn if HEAD moved. `--amend` instead operates on whatever the current HEAD is, not on "the commit I personally just made."

- **rewritten** = #91513: shared multi-agent worktree; `git commit --amend` does not re-check HEAD; silently rewrites concurrent teammate C2
- **head-moved** = `git rev-parse HEAD` is Agent B's C2, not Agent A's C1 SHA from the prior commit
- **message-usurp** = Agent B's C2 commit message discarded and replaced with Agent A's intended amend
- **tree-identical** = amended commit's tree is byte-identical to C2; no working-tree file loss; history/metadata only (message + parent linkage)
- **shared-tree** = Agent Teams teammates share one plain git working tree; no worktree isolation
- **has-clear-repro** = KinohTaGo filed #91513; has repro; area:agents; Claude Code 2.1.239; deterministic given A-C1 then B-C2 then A-amend interleaving
- **hold** = HEAD still Agent A's own SHA; the seal holds
- **sealed** = HOLD: HEAD still agent's own SHA; amend safe

Verdicts: sealed, rewritten, head-moved, message-usurp, tree-identical, shared-tree, has-clear-repro, hold.

This is a diagnostic scoring desk. Not an exploit. No payloads. Score whether the shared-tree amend is sealed or rewritten.

Hypothesis only (NON-BINDING): product-level guardrail should refuse amend when HEAD ≠ agent's last commit SHA in shared trees; discard if issue evidence disagrees. Encoded from the issue's filed claim (A-C1 then B-C2 then A-amend; tree kept; message usurped). Do not claim Claude Code source you have not seen.

## Why not a clone

This is specifically: **SHARED MULTI-AGENT WORKTREE — `git commit --amend` DOES NOT RE-CHECK HEAD; SILENTLY REWRITES CONCURRENT TEAMMATE COMMIT MESSAGE; AREA:AGENTS.**

NOT Crimp ([#91520](https://github.com/anthropics/claude-code/issues/91520)) — settings.json unlocked RMW; concurrent sessions tear the file and drop keys.
NOT Jackfield ([#91511](https://github.com/anthropics/claude-code/issues/91511)) — desktop cross-machine session mix-up; Windows input executes on unrelated macOS session.
NOT Tocsin ([#91503](https://github.com/anthropics/claude-code/issues/91503)) — idle-wake / background Bash; subagent completion queued with no idle-wake consumer.
NOT Bolter ([#91422](https://github.com/anthropics/claude-code/issues/91422)) — dontAsk option-token matcher.
NOT Deadeye ([#91226](https://github.com/anthropics/claude-code/issues/91226)) — hook path × cwd deadlock.
NOT Reglet ([#91443](https://github.com/anthropics/claude-code/issues/91443)) — CRLF before `.gitattributes`.
NOT **Reliquary** / **Annunciator** / **Caisson** / **Spindle** / **Knell** / **Tumbler** / **Escapement** / **Geneva** / **Scotch** / **Pintle** paradigms.
NOT leftover crimp pliers/foil / jackfield channel-strip / tocsin watchhouse / bolter flour-mill / deadeye standing-rigging / reglet letterpress / vault-latch / annunciator lamps.

Cousins are cite-only on a cousin strip; primary stays #91513.

- [#90943](https://github.com/anthropics/claude-code/issues/90943) — concurrent sessions in one working tree: stale git index silently deletes and reverts another session's committed work — cite-only.
- [#91349](https://github.com/anthropics/claude-code/issues/91349) — declared worktree path sometimes not populated by `git worktree add`; falls through to shared main checkout — cite-only.
- [#90146](https://github.com/anthropics/claude-code/issues/90146) — two sessions share the same worktree path and silently clobber each other's uncommitted work — cite-only.
- [#83311](https://github.com/anthropics/claude-code/issues/83311) — isolation:"worktree" agents commit to each other's branches — cite-only.
- [#88967](https://github.com/anthropics/claude-code/issues/88967) — isolation:"worktree" branches from a stale commit, not session HEAD — cite-only.

Backups (do not ship unless primary blocked): **Caret** / #91526. **Accrete** / #91512. **SessionTrailer** / #91546.

Product name stays **Codicil**. Do not rename to Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle.

Different UI: probate / will-chamber / sealed will parchment + wax-seal lamp + Agent A vs Agent B clause strip + HEAD SHA before/after strip / ink-on-vellum / wax-seal crimson / parchment cream / clerk navy. Literata + Figtree + Fragment Mono. NOT Spectral/Public Sans/JetBrains Mono (Crimp). NOT Brygada/Atkinson/DM Mono (Jackfield). NOT Fraunces/Source Sans 3/IBM Plex (Tocsin). Stay OFF crimp pliers/foil / jackfield channel-strip / tocsin watchhouse / bolter flour-mill / deadeye standing-rigging / reglet letterpress / vault-latch / annunciator lamps.

Different verbs: Seal the clause, pin idle sealed, pin seeded rewritten, admit the teammate's HEAD already moved, load fixtures, reset to sealed. Score the seal is this desk's phrase.

Different idle: **sealed**.

## Live catalog path

`/codicil/` is this static probate / will-chamber atelier desk. Path `https://hermes-playground-green.vercel.app/codicil/` and subdomain `https://codicil.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `03:50 / hermes catalog #126 / #91513`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **sealed** — `git rev-parse HEAD` still equals Agent A's own C1 SHA; amend is safe.
2. Seed **rewritten** → #91513: shared multi-agent worktree; `git commit --amend` does not re-check HEAD; Agent A C1 then Agent B C2 then A amends C2; C2 tree byte-identical; B's message discarded and replaced with A's.
3. Atelier UI: sealed will parchment / wax-seal lamp / Agent A vs Agent B clause strip / HEAD SHA before/after strip. Sealed = amend safe. Rewritten = usurped legatee. Wax-seal lamp lit on alarm.
4. Cousin cite strip labeled cousin-not-primary: [#90943](https://github.com/anthropics/claude-code/issues/90943) / [#91349](https://github.com/anthropics/claude-code/issues/91349) / [#90146](https://github.com/anthropics/claude-code/issues/90146) / [#83311](https://github.com/anthropics/claude-code/issues/83311) / [#88967](https://github.com/anthropics/claude-code/issues/88967). Cite only. Primary stays #91513.
5. **Seal the clause** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/codicil/index.html` in a browser, or serve the repo root and visit `/codicil/` (Vercel rewrite → `/projects/codicil`). No build step. Optional hook:

```bash
node projects/codicil/hook/codicil.mjs projects/codicil/data/91513.json
node --test projects/codicil/hook/codicil.test.mjs
```

Empty stdin scores the idle **sealed** ticket. Paste a probe on the page or drop a fixture from `data/`.

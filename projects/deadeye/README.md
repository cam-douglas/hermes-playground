# Deadeye

A **standing-rigging / lignum-vitae deadeye** atelier — three-hole lignum-vitae deadeye plaque, project-root mast vs Bash-cwd moving-block dial, relative-path lanyard foul lamp, ENOENT seize ratchet, worktree-isolation escape hatch, `$CLAUDE_PROJECT_DIR` absolute-reeve callout, PreToolUse-before-command paradox; sea indigo / weathered rope tan / copper oxide — Literata + Red Hat Text + Red Hat Mono — for a real Claude Code defect: **RELATIVE PRETOOLUSE BASH HOOK PATH RESOLVES AGAINST DRIFTED BASH CWD → PERMANENT BASH DEADLOCK; WORKTREE ISOLATION ESCAPES; RECURRENCE OF #32361/#5176/#50960; AREA:BASH+HOOKS.**

Primary:

- [anthropics/claude-code#91226](https://github.com/anthropics/claude-code/issues/91226) (OPEN, bug, has repro, platform:macos, area:bash, area:hooks, filed 2026-09-01T13:40:21Z, updated 2026-09-01T13:41:29Z). Title: PreToolUse Bash hook with relative command path can permanently deadlock the Bash tool for the rest of a session. Reporter hamazinger.

a deadeye that reeves the hook lanyard against the moving block is not standing rigging — it is foul. Score the reeve or admit the Bash already seized.

Idle word: **reeved**. Seeded state: **fouled** / #91226 — relative hook path fouled against drifted Bash cwd → ENOENT seize → permanent deadlock. Never idle as creased / bled / latched / vanished / sealed / rebound / dark / spurious / fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed.

A **deadeye** is the three-hole lignum-vitae block that should reeve the PreToolUse hook lanyard against the **mast** (stable project root / `$CLAUDE_PROJECT_DIR`). A relative hook `command` (e.g. `python3 scripts/harness_health_dashboard/guard-deploy-commands.py`) is resolved against the Bash tool's **mutable, cd-able working directory**. After `cd some/subdirectory && ...`, hook spawn fails `ENOENT` on `<drifted_cwd>/scripts/...` — the hook script still exists at `<repo_root>/scripts/...`. Because PreToolUse runs before the user command, every subsequent Bash call (including `pwd`, `echo`, corrective `cd`) fails the same way. Session Bash is permanently deadlocked. Fresh non-worktree subagent inherits the broken cwd; `isolation: "worktree"` resets cwd and escapes. `$CLAUDE_PROJECT_DIR` is documented mitigation but bare relative paths still ship.

- **fouled** = #91226: relative PreToolUse Bash hook path fouled against drifted Bash cwd → ENOENT seize → permanent deadlock
- **relative-path** = PreToolUse Bash matcher, `type: command`, relative `command` e.g. `python3 scripts/harness_health_dashboard/guard-deploy-commands.py`
- **drifted-cwd** = after `cd some/subdirectory && ...`, resolution is against the subdirectory, not project root
- **enoent-seize** = PreToolUse:Bash hook error ENOENT; hook script still exists at `<repo_root>/scripts/...`; `pwd` and `echo` fail
- **pretooluse-before-command** = PreToolUse runs before the user command so every subsequent Bash call fails the same way
- **persistent-bash-cwd** = Bash tool cwd persists across tool calls (documented behavior)
- **corrective-cd-fails** = a corrective `cd` also goes through the broken hook and is rejected — no in-session recovery
- **subagent-inherit** = fresh non-worktree subagent inherits the broken cwd state
- **isolation-worktree-escape** = `isolation: "worktree"` subagent gets working Bash (fresh cwd)
- **claude-project-dir-fix** = `$CLAUDE_PROJECT_DIR` is documented mitigation; expected: relative hook paths resolve against a stable root
- **recurrence** = closed #32361 / #5176 / #50960 — same relative PreToolUse × cd CWD class; bare relative paths still ship
- **has-clear-repro** = hamazinger filed #91226; has repro; platform:macos; area:bash; area:hooks; Claude Code 2.1.252; Darwin 25.6.0
- **hold** = lanyard reeved against mast / `$CLAUDE_PROJECT_DIR`; Bash free
- **reeved** = HOLD: lanyard reeved against mast / `$CLAUDE_PROJECT_DIR`; Bash free

Verdicts: reeved, fouled, relative-path, drifted-cwd, enoent-seize, pretooluse-before-command, persistent-bash-cwd, corrective-cd-fails, subagent-inherit, isolation-worktree-escape, claude-project-dir-fix, recurrence, has-clear-repro, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the lanyard is reeved or fouled.

Hypothesis only (NON-BINDING): hook spawn may resolve relative commands against the Bash tool's current process cwd rather than project root. Do not claim source you have not seen beyond the issue's measured repro.

## Why not a clone

This is specifically: **RELATIVE PRETOOLUSE BASH HOOK PATH RESOLVES AGAINST DRIFTED BASH CWD → PERMANENT BASH DEADLOCK; WORKTREE ISOLATION ESCAPES; RECURRENCE OF #32361/#5176/#50960; AREA:BASH+HOOKS.**

NOT **Reglet** ([#91443](https://github.com/anthropics/claude-code/issues/91443)) — CRLF / empty-index stageCheckout before `.gitattributes`.
NOT **Reliquary** ([#91433](https://github.com/anthropics/claude-code/issues/91433)) — aarch64 O_* EINVAL session vanish / data-loss — cite as stay-off.
NOT **Annunciator** ([#91419](https://github.com/anthropics/claude-code/issues/91419)) — StopFailure false alarms on parent — loud polarity — cite as stay-off.
NOT **Caisson** ([#91405](https://github.com/anthropics/claude-code/issues/91405)) — worktree pool wrong rebind + dirty wipe — cite as stay-off.
NOT **Spindle** ([#91402](https://github.com/anthropics/claude-code/issues/91402)) — startup cleanup deletes live sibling Bash outputs — related Bash surface, different failure: cleanup race ≠ relative-hook cwd deadlock — cite as stay-off.
NOT **Knell** ([#91298](https://github.com/anthropics/claude-code/issues/91298)) — Agent-tool silent child death.
NOT **Fairlead** ([#88423](https://github.com/anthropics/claude-code/issues/88423)) as primary — bg Bash/Monitor wake misrouted to lead — different agent-wake class.
NOT **Tumbler**.
NOT **Escapement**.
NOT **Geneva** / **Scotch** / **Carillon** / **Pintle** / **Fibula**.
NOT **Reveille** / **callboard** / slype muster-roster ink metaphors.
NOT leftover woodworking / mm-slider / millrace / locksmith / campanology / berth clones / letterpress galley Reglet UI.
NOT **Berth** catalog entries (different product — do not clone their UI).
NOT **Bollard** catalog entries (different product — do not clone their UI).
NOT **Toggle** (prior deferred name for #91422 — this hour's #91422 backup is **Bolter**, not Toggle).

Cousins are cite-only on a cousin strip; primary stays #91226.

- [#32361](https://github.com/anthropics/claude-code/issues/32361) — closed — same relative PreToolUse × cd CWD class.
- [#5176](https://github.com/anthropics/claude-code/issues/5176) — closed — hooks not found after cd.
- [#50960](https://github.com/anthropics/claude-code/issues/50960) — closed — process CWD drifts; bare-relative hooks.
- [#88830](https://github.com/anthropics/claude-code/issues/88830) — open — hook failures invisible in desktop; acknowledges same mechanism.
- [#87890](https://github.com/anthropics/claude-code/issues/87890) — open — EnterWorktree does not propagate to PreToolUse subprocesses — opposite polarity cousin.
- [openai/codex#26675](https://github.com/openai/codex/issues/26675) — cite — Codex plugin PostToolUse relative command resolves from workspace cwd.

Backups (do not ship unless primary blocked): **Bolter** / #91422 — dontAsk: cp/mv refuse any option token incl. bare `--` while rm -rf runs. **Clepsydra** / #91414 — MCP HTTP awaits subscriptions/listen before first turn; silent MCP_TIMEOUT-5000ms freeze. **Platen** / #91438 — Detached window file/preview link click does nothing.

Product name stays **Deadeye**. Do not rename to Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Fibula, Virgule, Riddle, Garner, Pintle, Postern, Carillon, Sluice, Alidade, Cockade, Lye, Clew, Hasp, Berth, Bollard, Reveille, Callboard.

Different UI: standing-rigging deadeye / three-hole lignum-vitae plaque + project-root mast vs Bash-cwd moving-block dial + relative-path lanyard foul lamp + ENOENT seize ratchet + worktree-isolation escape hatch + `$CLAUDE_PROJECT_DIR` absolute-reeve callout + PreToolUse-before-command paradox / sea indigo / weathered rope tan / copper oxide. Literata + Red Hat Text + Red Hat Mono. NOT EB Garamond/Hanken Grotesk/Noto Sans Mono (Reglet). NOT Crimson Pro/Plus Jakarta Sans/Ubuntu Mono (Reliquary). NOT Chakra Petch/Barlow/Share Tech Mono (Annunciator). NOT Zilla Slab/Epilogue/Overpass Mono (Caisson). NOT Cardo/Hind/Cousine (Spindle). NOT Bitter/Karla/Inconsolata (Knell). NOT Young Serif/Figtree/Fragment Mono (Tumbler). NOT Instrument Serif/Manrope/Azeret Mono (Escapement). NOT Bodoni/Jost/Space Mono (Geneva). NOT Spectral/Sora/IBM Plex Mono (Scotch). NOT Cormorant/Outfit/Fira (Fibula). NOT Libre Baskerville/Work Sans/JetBrains (Virgule). NOT Newsreader/Public Sans/Source Code Pro (Riddle). NOT Atkinson (Garner). NOT Fraunces (Sluice). NOT Syne/DM Sans (Pintle). NOT Playfair/Source Serif 4 (Carillon). NOT Cinzel (Postern). Stay OFF reglet letterpress / reliquary vault-latch / annunciator lamps / caisson berth / spindle chip-sweep / knell mute-bell / tumbler keyway / escapement pallet / carillon peal / sluice millrace / reveille muster / callboard roster / berth-card clone / bollard clone.

Different verbs: Reeve the deadeye, pin idle reeved, pin seeded fouled, admit the Bash already seized, load fixtures, reset to reeved. Not "Score the strip/latch/seal/purge/mute/keyway/pallet/cross/block/pin/stick/mesh/loft/hinge/peal/peg/postern/race". Score the reeve is this desk's phrase.

Different idle: **reeved**.

## Live catalog path

`/deadeye/` is this static standing-rigging deadeye atelier desk. Path `https://hermes-playground-green.vercel.app/deadeye/` and subdomain `https://deadeye.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `20:50 / hermes catalog #121 / #91226`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **reeved** — lanyard reeved against mast / `$CLAUDE_PROJECT_DIR`; Bash free.
2. Seed **fouled** → #91226: relative PreToolUse Bash hook path fouled against drifted Bash cwd → ENOENT seize → permanent deadlock; corrective `cd` rejected; subagent inherit; `isolation: "worktree"` escapes.
3. Atelier UI: three-hole lignum-vitae plaque / mast vs moving-block dial / relative-path lanyard foul lamp / ENOENT seize ratchet / worktree-isolation escape hatch. Reeved = lanyard against mast, Bash free. Fouled = relative path against drifted cwd, ENOENT seize, session Bash deadlocked.
4. Cousin cite strip labeled cousin-not-primary: [#32361](https://github.com/anthropics/claude-code/issues/32361) / [#5176](https://github.com/anthropics/claude-code/issues/5176) / [#50960](https://github.com/anthropics/claude-code/issues/50960) / [#88830](https://github.com/anthropics/claude-code/issues/88830) / [#87890](https://github.com/anthropics/claude-code/issues/87890) / [openai/codex#26675](https://github.com/openai/codex/issues/26675). Cite only. Primary stays #91226.
5. **Reeve the deadeye** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/deadeye/index.html` in a browser, or serve the repo root and visit `/deadeye/` (Vercel rewrite → `/projects/deadeye`). No build step. Optional hook:

```bash
node projects/deadeye/hook/deadeye.mjs projects/deadeye/data/91226.json
node --test projects/deadeye/hook/deadeye.test.mjs
```

Empty stdin scores the idle **reeved** ticket. Paste a probe on the page or drop a fixture from `data/`.

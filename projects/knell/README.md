# Knell

A **campanology death-knell / funeral-bell atelier** desk — bronze bell hanging mute, still clapper, untolled rope, empty chamber, toll ledger with blank rows, mourning ribbon; cool bronze-and-charcoal on a dark slate ground; hairline rope graduations; Bitter + Karla + Inconsolata — for a real Claude Code defect: **Agent tool returns "Spawned successfully" for custom `.claude/agents` types but the child dies silently at startup — no transcript, no error, no log, no failure signal; ListAgents still lists the dead; SendMessage queues forever; parent discovers only via `ps`; 4/4 on 2.1.246 Linux.**

Primary:

- [anthropics/claude-code#91298](https://github.com/anthropics/claude-code/issues/91298) (OPEN, bug, has repro, platform:linux, area:agents, filed 2026-09-01T19:18:18Z, updated 2026-09-01T19:19:36Z, 0 comments). Title: Subagents (Agent tool, custom types) die silently at startup: no transcript, no error, no log; parent never notified. Reporter cciordas.

a knell that never tolls is not a hold. Score the mute or admit **mute**.

Idle word: **tolled**. Seeded state: **mute** / #91298 — Spawned successfully; child dead; no transcript/error/log; ListAgents ghost; SendMessage queued forever; ps-only discovery. Never idle as honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked.

A **knell** is a funeral bell that should **toll** when a spawned custom Agent-tool child dies before its first turn. Instead the Agent tool returns **"Spawned successfully"**, the child exits within seconds-to-minutes with **no transcript**, **no output**, **no failure signal**, **no log**, `ListAgents` still lists the dead as teammates, `SendMessage` queues forever ("Message sent to inbox" never drains), and the parent discovers the **mute** only by shelling out to `ps`.

- **mute** = #91298: Spawned successfully; child dead; no transcript/error/log; ListAgents ghost; SendMessage queued forever; ps-only discovery
- **spawned-ok-dead** = Agent tool returned Spawned successfully; child process exited within seconds-to-minutes
- **no-transcript** = wrote no transcript; no transcripts under `~/.claude/projects/<project>/`; first-action output file never appeared
- **listagents-ghost** = ListAgents still lists the dead as teammates; dead indistinguishable from busy without `ps`
- **sendmessage-queued** = SendMessage accepted (Message sent to inbox) but never drains; messages queue forever
- **no-failure-signal** = sent no failure signal; left no log artifact; parent never notified
- **ps-only-discovery** = parent discovered deaths only by noticing absence of results and checking `ps`
- **has-clear-repro** = cciordas filed #91298; 4 out of 4 on 2.1.246 Linux; beads-change-reviewer / write-safety-reviewer; Agent tool; `.claude/agents`; has repro
- **hold** = child death surfaced; stderr/exit persisted; parent notified; ListAgents does not list dead as alive; the knell is tolled
- **tolled** = HOLD: child death surfaced — stderr/exit persisted; parent notified; ListAgents does not list dead as alive

Verdicts: tolled, mute, spawned-ok-dead, no-transcript, listagents-ghost, sendmessage-queued, no-failure-signal, ps-only-discovery, has-clear-repro, hold.

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the knell is tolled or mute.

Hypothesis only (NON-BINDING): long-running compacted sessions may leave Agent-tool spawn paths that report success while the child never reaches first API turn, with no parent-side liveness channel. Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **AGENT TOOL RETURNS "SPAWNED SUCCESSFULLY" FOR CUSTOM `.claude/agents` TYPES BUT THE CHILD DIES SILENTLY AT STARTUP — NO TRANSCRIPT, NO ERROR, NO LOG, NO FAILURE SIGNAL; LISTAGENTS STILL LISTS THE DEAD; SENDMESSAGE QUEUES FOREVER; PARENT DISCOVERS ONLY VIA `ps`; 4/4 ON 2.1.246 LINUX.**

NOT **Tumbler** ([#74256](https://github.com/anthropics/claude-code/issues/74256)) — PermissionRequest ExitPlanMode allow discarded / chooser blocks — cite as stay-off.
NOT **Escapement** ([#91371](https://github.com/anthropics/claude-code/issues/91371)) — local scheduled mid-run isRunning stall → Skipped.
NOT **Geneva** ([#91296](https://github.com/anthropics/claude-code/issues/91296)) — settings.local.json bypassPermissions / Shift+Tab.
NOT **Carillon** ([#91250](https://github.com/anthropics/claude-code/issues/91250)) — plugin SessionStart first-wins peal board — campanology-adjacent craft language ONLY; UI must stay OFF oak belfry / peal board / registers-three-strikes-one; Sheaf/#91250 is a clone — do not ship.
NOT **Scotch** ([#91324](https://github.com/anthropics/claude-code/issues/91324)) — SCM recovery Access denied.
NOT **Pintle** ([#91226](https://github.com/anthropics/claude-code/issues/91226)) — PreToolUse Bash relative-path cwd deadlock.
NOT **Fibula** ([#91306](https://github.com/anthropics/claude-code/issues/91306)) — mute DISPLAY clipboard hang.
NOT **Virgule** ([#91337](https://github.com/anthropics/claude-code/issues/91337)) — slash/skills menu trigger bound to message index 0.
NOT **Riddle** ([#91327](https://github.com/anthropics/claude-code/issues/91327)) — Devcontainer ipset duplicate + set -e firewall abort.
NOT **Garner** ([#91246](https://github.com/anthropics/claude-code/issues/91246)) — Desktop archive-to-pool no TTL.
NOT **Postern** ([#91223](https://github.com/anthropics/claude-code/issues/91223)) — anyone can bar a postern / who-can-lock.
NOT **Sluice** ([#91265](https://github.com/anthropics/claude-code/issues/91265)) — Cowork Toke/File/SeAt leak.
NOT **Quire** ([#91284](https://github.com/anthropics/claude-code/issues/91284)) — silent session-transcript writer death / data-loss — this hour's backup, not primary.
NOT [#87203](https://github.com/anthropics/claude-code/issues/87203) — cloud ultrareview agents terminated — cite-only cousin.
NOT [#71723](https://github.com/anthropics/claude-code/issues/71723) — Agent tool name→teammate protocol — cite-only.
NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick / geneva-drive / maltese-cross / escapement pallet-fork / locksmith pin-tumbler.

Cousins are cite-only on a cousin strip; primary stays #91298.

Product name stays **Knell**. Do not rename to Bell, Toll, Funeral, Mute, Spawn, Tumbler, Escapement, Geneva, Scotch, Fibula, Virgule, Riddle, Garner, Pintle, Postern, Carillon, Sheaf, Quire.

Different UI: funeral-bell chamber / bronze knell hanging mute + still clapper + untolled rope + empty chamber / toll ledger with blank rows / mourning ribbon / cool bronze-and-charcoal / dark slate / hairline rope graduations. Bitter + Karla + Inconsolata. NOT Young Serif/Figtree/Fragment Mono (Tumbler). NOT Instrument Serif/Manrope/Azeret Mono (Escapement). NOT Bodoni/Jost/Space Mono (Geneva). NOT Spectral/Sora/IBM Plex Mono (Scotch). NOT Cormorant/Outfit/Fira (Fibula). NOT Libre Baskerville/Work Sans/JetBrains (Virgule). NOT Newsreader/Public Sans/Source Code Pro (Riddle). NOT Literata/Atkinson (Garner). NOT Fraunces (Sluice). NOT Syne/DM Sans (Pintle). NOT Playfair/Source Serif 4 (Carillon). NOT Cinzel (Postern). NOT Libre Caslon (Alidade). Stay OFF Carillon visual language.

Different verbs: score the mute, pin idle tolled, pin seeded mute, admit mute, load fixtures, reset to tolled. Not "Score the keyway/pallet/cross/block/pin/stick/mesh/loft/hinge/peal/peg/postern/race".

Different idle: **tolled**.

## Live catalog path

`/knell/` is this static campanology death-knell atelier desk. Path `https://hermes-playground-green.vercel.app/knell/` and subdomain `https://knell.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `14:50 / hermes catalog #115 / #91298`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **tolled** — child death surfaced; stderr/exit persisted; parent notified; ListAgents does not list dead as alive.
2. Seed **mute** → #91298: Spawned successfully; child dead; no transcript/error/log; ListAgents ghost; SendMessage queued forever; ps-only discovery.
3. Atelier UI: bronze knell hanging mute / still clapper / untolled rope / empty chamber / toll ledger / mourning ribbon. Tolled = rope drawn, clapper swings, chamber records the death. Mute = bell hangs still, rope slack, ledger blank.
4. Cousin cite strip labeled cousin-not-primary: [#87203](https://github.com/anthropics/claude-code/issues/87203) / [#71723](https://github.com/anthropics/claude-code/issues/71723) / [#88849](https://github.com/anthropics/claude-code/issues/88849) / [#83366](https://github.com/anthropics/claude-code/issues/83366) / [#86129](https://github.com/anthropics/claude-code/issues/86129). Cite only. Primary stays #91298.
5. **Score the mute** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/knell/index.html` in a browser, or serve the repo root and visit `/knell/` (Vercel rewrite → `/projects/knell`). No build step. Optional hook:

```bash
node projects/knell/hook/knell.mjs projects/knell/data/91298.json
node projects/knell/hook/knell.mjs projects/knell/data/tolled.json
node --test projects/knell/hook/knell.test.mjs
```

Mute seed → mute/alarm. Tolled seed → tolled/hold.

`projects/knell/hook/knell.mjs` classifies a probe ticket JSON `{ toolName, spawnedSuccessfully, childDead, noTranscript, noFailureSignal, listAgentsGhost, sendMessageQueued, deathSurfaced }` and returns `{ verdict, chips[], reasons[], tolled, mute, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91298.json`, `data/mute.json`, `data/tolled.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`, `data/relatives.json`, `data/cousins.json`. Evidence only from issue facts. Use Spawned successfully, Agent tool, `.claude/agents`, no transcript, no failure signal, ListAgents, SendMessage, TaskStop, `ps`, 2.1.246, beads-change-reviewer / write-safety-reviewer, 4 out of 4, cciordas. Never invent counts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91298](https://github.com/anthropics/claude-code/issues/91298). Unauthenticated. Title, state, labels — not a cookbook. Cousins cited on the ledger, not primaries. See `.env.example`.
2. Slack `#hermes-catalog` mention as the ship notice surface (text only; do not post).
3. Claude Code Agent tool / ListAgents / SendMessage / TaskStop as the third native surface. Paste or drop a probe ticket JSON and score it.
4. Atelier UI (funeral-bell chamber / bronze knell hanging mute / still clapper / untolled rope / empty chamber / toll ledger / mourning ribbon). Tolled = rope drawn and the death recorded, mute = Spawned successfully and the child already gone.
5. Cousin-not-primary cite strip: #87203, #71723, #88849, #83366, #86129.

## Sources

- [anthropics/claude-code#91298](https://github.com/anthropics/claude-code/issues/91298) OPEN — primary. Product stays Knell.
- Agent tool (custom types from `.claude/agents/*.md`) returned "Spawned successfully".
- Child process exited within seconds-to-minutes; wrote no transcript; produced no output; sent no failure signal; left no log artifact.
- Parent discovered deaths only by noticing absence of results and checking `ps`.
- 4 out of 4 times over ~5 hours; earlier spawns of same agent types in same session worked.
- Environment: Claude Code 2.1.246, Linux; long-running interactive session (days old, compacted once, large context).
- Agents: `beads-change-reviewer`, `write-safety-reviewer` (opus override), named background subagents.
- Timeline: ~10:19 spawn → ListAgents teammates → ~4.5h silence → SendMessage accepted but never drains → ~14:51 ps shows no process; no transcripts under `~/.claude/projects/<project>/`.
- TaskStop + respawn → same outcome faster; first-action output file never appeared.
- Ruled out: OOM (101 GiB free; no OOM-killer; load ~1.4/32-core); agent definitions; crash artifacts (no logs under ~/.claude, ~/.cache, ~/.local/share/claude; nothing journalctl --user; no cores).
- Expected: subagent runs OR orchestrator told it died (tool result, task notification, or log with child stderr).
- Actual: permanent silence; ListAgents lists dead; messages queue forever; dead indistinguishable from busy without `ps`.
- Asks: (1) persist stderr/exit when child dies before first API turn (2) surface death to parent (3) document log location.
- Cousins (cite, not primaries):
  - [#87203](https://github.com/anthropics/claude-code/issues/87203) — cloud ultrareview agents terminated (cite-only).
  - [#71723](https://github.com/anthropics/claude-code/issues/71723) — Agent tool name→teammate protocol (cite-only).
  - [#88849](https://github.com/anthropics/claude-code/issues/88849) — Agent tool name: teammate that never runs its prompt (cite-only).
  - [#83366](https://github.com/anthropics/claude-code/issues/83366) — named/teammate spawn never starts when pane creation fails (cite-only).
  - [#86129](https://github.com/anthropics/claude-code/issues/86129) — auto-updater prunes running version binary (cite-only).

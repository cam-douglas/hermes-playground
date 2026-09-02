# Knell hook

Tiny campanology death-knell / funeral-bell classifier for the Agent-tool silent child death at startup. The Agent tool (custom types from `.claude/agents/*.md`) returned "Spawned successfully", but the child exited within seconds-to-minutes, wrote no transcript, produced no output, sent no failure signal, and left no log. `ListAgents` still lists the dead. `SendMessage` queues forever. Parent discovers only via `ps`. 4 out of 4 on 2.1.246 Linux.

Idle word is **tolled**. Seeded state is mute / #91298 (Spawned successfully; child dead; no transcript/error/log; ListAgents ghost; SendMessage queued forever; ps-only discovery). Never idle as honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked.

```bash
node projects/knell/hook/knell.mjs projects/knell/data/91298.json
node projects/knell/hook/knell.mjs projects/knell/data/tolled.json
echo '{"toolName":"Agent","spawnedSuccessfully":true,"childDead":true}' | node projects/knell/hook/knell.mjs
node --test projects/knell/hook/knell.test.mjs
```

Empty stdin uses the idle **tolled** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `tolled`, `mute`, `hold`, `alarm`, `idleWord`.

Given `{ toolName, spawnedSuccessfully, childDead, noTranscript, noFailureSignal, listAgentsGhost, sendMessageQueued, deathSurfaced }`:

- **TOLLED** if child death surfaced; stderr/exit persisted; parent notified; ListAgents does not list dead as alive
- **MUTE** if Spawned successfully; child dead; no transcript/error/log; ListAgents ghost; SendMessage queued forever; ps-only discovery (#91298)
- **SPAWNED-OK-DEAD** if Agent tool returned Spawned successfully; child exited within seconds-to-minutes
- **NO-TRANSCRIPT** if wrote no transcript; first-action output file never appeared
- **LISTAGENTS-GHOST** if ListAgents still lists the dead as teammates
- **SENDMESSAGE-QUEUED** if SendMessage accepted (Message sent to inbox) but never drains
- **NO-FAILURE-SIGNAL** if sent no failure signal; left no log; parent never notified
- **PS-ONLY-DISCOVERY** if parent discovered deaths only by checking `ps`
- **HAS-CLEAR-REPRO** if cciordas filed #91298; 4 out of 4 on 2.1.246 Linux; beads-change-reviewer / write-safety-reviewer
- **HOLD** if the knell is tolled (child death surfaced; parent notified)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the knell is tolled or mute.

Primary: [anthropics/claude-code#91298](https://github.com/anthropics/claude-code/issues/91298). Cousins (cite only, not primaries): [#87203](https://github.com/anthropics/claude-code/issues/87203) cloud ultrareview agents terminated; [#71723](https://github.com/anthropics/claude-code/issues/71723) Agent tool name→teammate protocol; [#88849](https://github.com/anthropics/claude-code/issues/88849); [#83366](https://github.com/anthropics/claude-code/issues/83366); [#86129](https://github.com/anthropics/claude-code/issues/86129).

Hypothesis only (NON-BINDING): long-running compacted sessions may leave Agent-tool spawn paths that report success while the child never reaches first API turn, with no parent-side liveness channel. Do not claim a root cause in Claude Code source you have not seen.

NOT leftover woodworking / mm-slider / millrace / wagon-scotch / cloak-pin / composing-stick / geneva-drive / maltese-cross / escapement pallet-fork / locksmith pin-tumbler. Product name stays Knell. Do not rename to Bell / Toll / Funeral / Spawn / Tumbler / Escapement / Geneva / Scotch / Fibula / Virgule / Riddle / Garner / Pintle / Carillon / Postern / Sheaf / Quire.

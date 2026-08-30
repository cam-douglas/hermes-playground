# Waif

Victorian parish **foundling home** intake board — a ledger of abandoned child processes — for a real Claude Code defect: **when a Bash tool call hits its timeout, the tool returns a timeout error to the model, but child processes spawned by the command (find, grep, pipelines, etc.) are NOT killed — only abandoned.** Orphans keep crawling/scanning with a dead parent PID. On Windows this has left 21+ find.exe/grep.exe orphans holding ~50% of a 16-core machine via Defender; on POSIX the process group is not killed either. Impact is invisible to the model (it only sees the timeout) and lands as machine-wide CPU/AV load.

Primary: [anthropics/claude-code#90672](https://github.com/anthropics/claude-code/issues/90672) (OPEN, filed 2026-08-30). Title: Bash tool timeout does not terminate the child process tree — orphaned processes keep running indefinitely.

An abandoned child is not a hold. Score the ward or admit **sheltered**.

Idle word: **sheltered** (child taken in / tree reaped; hold is quiet).
NEVER use the product name waif / empty / silent / mute / idle / alongside / seated / credited / level / verbatim / fronted / locked / yanked / caught / stowed / posted / bunged / belayed / rove / keyed / housed / beamed / snug / hung / appointed / cinched / gauged / stamped / overrun / pratique / wound / bound / stilled / stabled / drained / flat / fit / spoilt / laid / unlinked / tight / banked / roosted / stocked / heard / clear / paired / kernel / latched / upheld / sterling / home / valid / dry / quiet / seised / rung / moored / claimed / adopted / warded / reaped / **orphaned** as the idle/state word.

Verdicts: **sheltered**, **abandoned**, **orphaned**, **tree-alive**, **parent-dead**, **timeout-seen**, **group-unkilled**, **job-missing**, **taskkill-skipped**, **defender-load**, **off-ward**. Slack alarm + Linear ticket on abandoned / orphaned / tree-alive / parent-dead / timeout-seen / group-unkilled / job-missing / taskkill-skipped / defender-load. GitHub waif-ledger of scored intakes on every score.

The #90672 abandoned ward (timedOut + children still running with a dead/missing parent + model already saw timeout) is **abandoned**, never **sheltered**. Unique nearby flags win their own seeds because those seeds do not carry the #90672 triad. Related issues (Gaff false-complete; Berth shared spawn_task tree; Carrel launch.json; Byline ghost) are **off-ward**, not this foundling case.

## Why not a clone

NOT **Gaff** — timeout-kill *did* happen but was reported as "completed (exit 0)". Gaff = false completion billing. **Waif = the tree was never killed; orphans keep running after the model already saw timeout.** [#90616](https://github.com/anthropics/claude-code/issues/90616).
NOT **Berth** — `spawn_task` chip shares the spawning session's working tree (#90668).
NOT **Carrel** — `preview_start` resolves `launch.json` from session cwd (#90661).
NOT **Byline** — phantom hook `agent_id` (#90662).
NOT **Datum** — wrong-base code-review #90620.
NOT **Calque** — PowerShell Spanish del #90645.
NOT **Fascia / Quoin / Sear / Cubby / Grille / Spile / Bollard / Clew / Wicket / Hasp**.
Do NOT ship leftover woodworking / millimetre-slider clones.
Do NOT ship alternate names Foundling, Derelict, Orphan, Urchin, Stray, Remora, Jetsam, Flotsam, Latchkey, Zombie, Reaper, Squatter, Holdover, Ember, Cinder, Drift, Castaway, Skiff, Pram, Dory, Tender, Tether, Warp, Painter, Hulk, Waifs, Sprog, Whelp. Product name is **Waif** only.

Different problem: Bash timeout returns an error to the model but does not kill the child process tree.
Different UI: Victorian / parish foundling-home intake board — parchment ledger, iron-gall ink, brass plates, soot charcoal, muted oxblood. Fraunces + Source Serif + IBM Plex Mono.
Different idle word: **sheltered**.

## Live catalog path

`/waif/` is this static foundling-home intake board. Demo works with no secrets and no npm. Mark: `13:50 Sydney · waif`.

1. Seeded `#90672` **abandoned** is already on the ledger: Bash timed out, model saw timeout, 21 find.exe/grep.exe still crawling with a dead parent → **abandoned**. Never sheltered.
2. Switch **taskkill-skipped** — #78030 Windows/Git Bash never used `taskkill /T`.
3. Switch **job-missing** — #76353 Windows Job Object was never attached.
4. Switch **group-unkilled** — #82433 POSIX process group not killed.
5. Switch **parent-dead** — #79727 tracked shell reaped; child tree survives.
6. Switch **tree-alive** — #85200 TaskStop left the process tree running.
7. Switch **defender-load** — #84647 orphaned grep / Defender load, high CPU/RSS.
8. Switch **timeout-seen** — #84464 model got timeout while children still run.
9. Switch **orphaned** — #76056 grep→ugrep shim children not killed.
10. Switch **honest sheltered** — timeout killed the whole tree via Job Object / process group → **sheltered** true.
11. Switch **off-ward** — Gaff-shaped false exit-0 after kill, labeled, not this ward.
12. **Score** scores. **Admit sheltered** scores honestly. **Restore · #90672** shows the abandoned ledger. Admit does not lie.

## Hook

`projects/waif/hook/` scores a probe `{ timedOut, parentAlive, childCount, childrenWithDeadParent, processGroupKilled, jobObjectAttached, taskkillTreeUsed, platform, rssMb, cpuPct, modelSaw }` and returns `{ verdict, reasons[], sheltered }`. See `hook/README.md`.

```bash
node projects/waif/hook/index.mjs --listen 9090
node --test projects/waif/hook/waif.test.mjs
```

`sheltered` is true ONLY when the verdict is sheltered (idle, or honest control: timeout killed the whole tree via Job Object / process group). Seeded 90672 numbers must produce abandoned / `sheltered=false`. Honest control with a reaped tree produces `sheltered=true`. An abandoned child is never sheltered.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90672](https://github.com/anthropics/claude-code/issues/90672) — OPEN, filed 2026-08-30. Title: Bash tool timeout does not terminate the child process tree — orphaned processes keep running indefinitely.

Same-class nearby (treat as nearby, scoreable, not the primary):

- [anthropics/claude-code#78030](https://github.com/anthropics/claude-code/issues/78030) — Windows/Git Bash: Bash tool does not reap its child on timeout.
- [anthropics/claude-code#76353](https://github.com/anthropics/claude-code/issues/76353) — Bash tool leaks orphaned child processes on Windows timeout.
- [anthropics/claude-code#85200](https://github.com/anthropics/claude-code/issues/85200) — TaskStop does not kill the process tree (orphaned rm -rf).
- [anthropics/claude-code#84464](https://github.com/anthropics/claude-code/issues/84464) — Background Bash falsely "was stopped" while process tree orphaned.
- [anthropics/claude-code#82433](https://github.com/anthropics/claude-code/issues/82433) — Backgrounded (&) shell children survive Bash-tool timeout as PID-1 orphans.
- [anthropics/claude-code#76056](https://github.com/anthropics/claude-code/issues/76056) — grep→ugrep shim children not killed on timeout.
- [anthropics/claude-code#84647](https://github.com/anthropics/claude-code/issues/84647) — orphaned grep reached 20 GB RSS after timeout.
- [anthropics/claude-code#79727](https://github.com/anthropics/claude-code/issues/79727) — memory-pressure reap kills only tracked shell; child tree survives.

Related, different (label, do not treat as this bug):

- [anthropics/claude-code#90616](https://github.com/anthropics/claude-code/issues/90616) — Gaff: timeout-kill DID happen but was reported as completed (exit 0).
- [anthropics/claude-code#90668](https://github.com/anthropics/claude-code/issues/90668) — Berth: spawn_task chip shares the spawning session's working tree.
- [anthropics/claude-code#90661](https://github.com/anthropics/claude-code/issues/90661) — Carrel: preview_start resolves launch.json from session cwd.
- [anthropics/claude-code#90662](https://github.com/anthropics/claude-code/issues/90662) — Byline: phantom hook agent_id.

Cross-ecosystem nearby, not identical:

- [openai/codex#35393](https://github.com/openai/codex/issues/35393) — Windows shell timeout/cancellation can orphan descendants.
- [openai/codex#30802](https://github.com/openai/codex/issues/30802) — WSL child processes survive Codex shell timeout/cancellation.
- [openai/codex#37770](https://github.com/openai/codex/issues/37770) — search/grep processes run indefinitely with no timeout (orphaned rg).
- [openai/codex#25388](https://github.com/openai/codex/issues/25388) — orphaned zsh shell-snapshot processes burning ~100% CPU.

Cross-check nearby products are DIFFERENT (cite only as “not this”):

- NOT Gaff #90616, Berth #90668, Carrel #90661, Byline #90662, Datum #90620, Calque #90645, Wicket, Hasp.

Suggested consumer fix from #90672: kill the process group (POSIX) or attach a Windows Job Object / `taskkill /T` on Bash-tool timeout so descendants cannot outlive the timed-out parent.

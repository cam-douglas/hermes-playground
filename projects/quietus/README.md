# Quietus

A **registrar's quietus / death-knell ledger bench** — dark ink, parchment, muted bronze bell, ledger ruling, quiet courtroom/registry air; Cardo + Public Sans + Fragment Mono — for a real Claude Code defect: **`SubagentStop` DOES NOT FIRE WHEN A BACKGROUND SUBAGENT IS KILLED VIA `TaskStop` OR BY "EXIT AND STOP TASKS".** When every kill path rings `SubagentStop`, the quietus is **quieted**.

Primary:

- [anthropics/claude-code#92716](https://github.com/anthropics/claude-code/issues/92716) (OPEN, bug, has repro, platform:macos, area:hooks, area:agents). Title: `SubagentStop does not fire when a background subagent is killed via TaskStop or by "Exit and stop tasks"`. Filed 2026-09-07T18:55:26Z. Updated 2026-09-07T18:56:30Z. Reporter: pszypowicz. 0 comments.

05:50 quietus: a registrar's quietus / death-knell ledger that should ring SubagentStop when a background subagent is killed via TaskStop or Exit-and-stop but instead stays unrung — registry clears, hook silent, normal completion still tolls (#92716). Score unrung or admit quieted.

Idle word: **unrung** (ALARM: TaskStop and Exit-and-stop clear the registry and never ring SubagentStop). Seeded state: **quieted** / HOLD (every kill path rings SubagentStop). Never idle as porous, slipped, severed, misrouted, adrift, corked, latent, silted, barred, runaway, haunted, fouled, razed, culled, unanswered, stripped. Never seeded as cribbed, sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted, latched, staged, proved, belayed, sole, packed, roused, sighted, argbound, cleared.

**Quietus** = a registrar's discharge / death-knell (the ledger line that should close an account). A `SubagentStart` should always be followed by exactly one `SubagentStop`, including when the parent kills the agent. Instead the kill path stays **unrung**.

- **unrung** = IDLE: ALARM; TaskStop / Exit-and-stop never ring SubagentStop
- **quieted** = seeded word: every kill path rings SubagentStop
- **start-without-stop** = SubagentStart a7e17cab67db81d3b and aeb8c19d42bf9982c never receive a matching SubagentStop
- **taskstop-silent** = after TaskStop, next Stop shows `bg:[]`; no SubagentStop (checked again 75 s later)
- **exit-stop-silent** = `/exit` → "Exit and stop tasks" ends the session with no SubagentStop
- **control-completion-tolls** = normal background completion still fires SubagentStop with `last_assistant_message` done
- **debug-file-missing** = `--debug-file` has no SubagentStop line for the killed agent
- **registry-cleared** = killed agent removed from the task registry; only the hook is missing
- **pairing-drift** = hooks pairing SubagentStart/SubagentStop drift after every kill
- **cousins** = cite-only #78463 / #44971 / #82249
- **has-clear-repro** = issue labeled has repro

Verdicts: unrung, quieted, start-without-stop, taskstop-silent, exit-stop-silent, control-completion-tolls, debug-file-missing, registry-cleared, pairing-drift, cousins, has-clear-repro.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. No instructions to bypass hooks or sandbox. Score whether TaskStop / exit-kill would leave the quietus **unrung** or already **quieted**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): kill paths remove the agent from the task registry without invoking the SubagentStop hook dispatcher that normal completion uses. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92716](https://github.com/anthropics/claude-code/issues/92716)
- Cousins cite-only (NOT primary):
  - [anthropics/claude-code#78463](https://github.com/anthropics/claude-code/issues/78463) — missing SubagentStop when subagents die during an API-error burst
  - [anthropics/claude-code#44971](https://github.com/anthropics/claude-code/issues/44971) — same class for team agents shut down via the shutdown protocol
  - [anthropics/claude-code#82249](https://github.com/anthropics/claude-code/issues/82249) — DIFFERENT: on 2.1.261 SubagentStop DOES fire for normal background completion (control)

What happened (from the issue body — do not invent):

- Claude Code 2.1.261; macOS 26.6; Haiku 4.5 (`claude-haiku-4-5-20251001`) for both the parent and the subagent
- Reporter: pszypowicz; filed 2026-09-07T18:55:26Z; updated 2026-09-07T18:56:30Z; 0 comments
- Reproduced in headless (`claude -p`) and interactive REPL (tmux / zsh)
- Overlay settings log `SubagentStart`, `SubagentStop`, and `Stop` via `jq` to `/tmp/subagent-stop/hooks.log`
- Published interactive hook log:
  - `+0` SubagentStart `a7e17cab67db81d3b` general-purpose
  - `+18` / `+21` Stop with `bg:[]` after TaskStop — agent already gone; no SubagentStop (checked again 75 s later)
  - `+147` SubagentStart `a407d56a2f914aea2`
  - `+240` SubagentStop `a407d56a2f914aea2` `last:done` — control: normal completion fires the hook
  - `+267` SubagentStart `aeb8c19d42bf9982c`
  - `+268` Stop lists the agent running; `/exit` → "Exit and stop tasks" ends the session with no SubagentStop
- Two headless `claude -p` runs gave the same TaskStop result, process kept alive 20 s after the kill
- `--debug-file` has no SubagentStop line for the killed agent
- Expected: every SubagentStart is followed by exactly one SubagentStop, including kill; `last_assistant_message` empty if there is none
- Impact: pairing hooks drift after every kill; `background_tasks` on Stop is not a substitute for the per-agent stop event

Problem found: TASKSTOP AND EXIT-AND-STOP CLEAR THE AGENT FROM THE REGISTRY AND NEVER RING SUBAGENTSTOP — CONTROL COMPLETION STILL TOLLS.

Why this solution: a diagnostic scorer for the unrung → quieted quietus chain, so a reader can admit idle unrung, pin seeded quieted, and score start-without-stop / taskstop-silent / exit-stop-silent / control-completion-tolls / debug-file-missing / registry-cleared / pairing-drift / cousins against the published facts.

## Why not a clone

This is specifically: **`SUBAGENTSTOP` DOES NOT FIRE WHEN A BACKGROUND SUBAGENT IS KILLED VIA `TASKSTOP` OR "EXIT AND STOP TASKS".**

**NOT Cribble #92684** (mid-path denyWrite porous sieve).

**NOT Springe #92675** (plugin-native PreToolUse deny not enforced interactively).

**NOT Gangway #92662** (Chrome relaunch never re-dials native-host socket).

**NOT Waybill #92624** (named spawn foreign session id).

**NOT Oubliette #92095** (cold-parent child-completion void).

**NOT Larum #92563** (background-task notification never starts a turn).

**NOT Deadman #92593 / Watchdog / Knell / Tocsin / Aphonia.**

Cousins cite-only (NOT primary): #78463, #44971, #82249. Different surfaces. Do not auto-pick as thesis. Backups do not auto-pick: #92699 (worktree heredoc brace asymmetry), #92692 (NTFS junction rmdir deletes plans link), #92694 (AskUserQuestion keys dead after refocus), #92696 (computer-use helper version mismatch).

Do NOT rename this product Cribble, Springe, Gangway, Waybill, Oubliette, Larum, Deadman, Watchdog, Knell, Tocsin, or Aphonia.
Do NOT reuse idle porous / slipped / severed / misrouted / adrift / corked / latent / silted / barred / runaway / haunted / fouled / razed / culled / unanswered / stripped.
Do NOT reuse seeded cribbed / sprung / remoored / addressed / reaped / relayed / flushed / drained / admitted / latched / staged / proved / belayed / sole / packed / roused / sighted / argbound / cleared.

Different surface: KILL-PATH SUBAGENTSTOP MISS vs mid-path denyWrite fail-open / plugin-native PreToolUse interactive slip / Chrome relaunch never-redial / named-spawn foreign session id / cold-parent child-completion void / background-task notification never starts a turn.

Product name stays **Quietus**. Name/slug `quietus` confirmed unused in catalog.json (210 products before this ship; Cribble is #210).

Different UI: registrar's quietus / death-knell ledger / dark ink / parchment / muted bronze bell / ledger ruling / quiet courtroom registry. Cardo / Public Sans / Fragment Mono. NOT Young Serif/Karla/IBM Plex Mono (Cribble). NOT Bodoni Moda/Nunito Sans (Springe). NOT Big Shoulders Display/Public Sans/Roboto Mono (Gangway). NOT Oswald/Source Sans 3 (Waybill).

Different verbs: Score the quietus, Pin idle unrung, Pin seeded quieted, Admit quieted, Load fixtures, Reset to quieted, Toll the knell, Leave the ledger unrung.

Different idle: **unrung**. Different seeded: **quieted**. HOLD: **quieted**. ALARM: **unrung** / **start-without-stop** / **taskstop-silent** / **exit-stop-silent** / **control-completion-tolls** / **debug-file-missing** / **registry-cleared** / **pairing-drift** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/quietus/hook/quietus.test.mjs
node projects/quietus/hook/index.mjs projects/quietus/data/92716.json
echo '{"seed":"quieted","quieted":true}' | node projects/quietus/hook/index.mjs
```

Open the living card at `projects/quietus/index.html` (or the live path). Buttons: Score the quietus, Pin idle unrung, Pin seeded quieted, Admit quieted, Load fixtures, Reset to quieted. Toll the knell. Leave the ledger unrung. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/quietus/
- Subdomain: https://quietus.hermes-playground-green.vercel.app
- Folder: `projects/quietus/`

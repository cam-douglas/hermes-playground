# Byline

Newsroom **byline** desk — a night copy-desk where a reporter's copy is credited to a nameplate that was never hired — for a real Claude Code defect: **PreToolUse / PostToolUse fired inside a running subagent are sometimes reported under a different `agent_id` that has no SubagentStart, no `agent_type`, and never gets a SubagentStop. Consecutive tool calls of one real subagent can split across two ids. The ghost id is a hanging byline: never hired, never killed, still collecting copy.**

Primary: [anthropics/claude-code#90662](https://github.com/anthropics/claude-code/issues/90662) (OPEN, filed 2026-08-29, v2.1.251, labels bug/platform:macos/area:hooks/area:agents). Title: PreToolUse/PostToolUse inside a running subagent are sometimes reported under a different agent_id that has no SubagentStart, no agent_type, and never gets a SubagentStop. Five reconciled UTC cases on 2026-08-29 in one long-lived session (same `session_id` since 2026-08-06; 50+ background Agent-tool subagents that day).

Cleanest case (all times UTC, 2026-08-29, ids truncated):

- Subagent `a37ed07` (`agent_type: claude`, `spawnDepth: 1`, background) runs from 15:58:30. It has its own entry (created by its `SubagentStart`).
- 16:09:19 it spawns a child with the Agent tool (`ad36795`); 16:12:45 another (`afad1ed`).
- A new entry with an unknown `agent_id` and no `agent_type` appears at 16:09:43.
- 16:14:51 `a37ed07` runs `Bash: lsof -nP -iTCP -sTCP:LISTEN …` (present in `agent-a37ed07.jsonl` as its own `tool_use`). The hook payload for that call is recorded on the stray entry, not on `a37ed07`.
- 16:15:06 `a37ed07` runs `Bash: cd ~/projects/ && …`. That payload is recorded on `a37ed07`'s own entry again (`agent_type: claude` present).
- The stray entry never receives another payload and never receives `SubagentStop`.

The other four cases: 07:20 short burst on a ghost while `aecdca5` ran (**stray**); 08:35 ghost born during `a74c422` later received `cat >` from later agents (**borrowed**); 09:20 ghost kept collecting `npx tsc` for 45+ minutes (**hanging**); 13:32 stray appeared right after `af2b998` `SendMessage` resume of a completed child (**resume-split**).

A ghost byline is not a hold. Score the rack or admit **credited**.

Idle word: **credited** (PreToolUse/PostToolUse under the same agent_id as SubagentStart, agent_type present, later SubagentStop; hold is quiet).
NEVER use the product name byline / empty / silent / mute / idle / dead / sealed / fronted / locked / yanked / caught / stowed / posted / bunged / belayed / rove / keyed / housed / beamed / snug / hung / appointed / cinched / gauged / stamped / overrun / pratique / wound / bound / stilled / stabled / drained / flat / fit / spoilt / laid / unlinked / tight / banked / roosted / stocked / seated / heard / clear / paired / kernel / latched / upheld / sterling / home / valid / dry / quiet / seised / rung / moored / verbatim / level as the idle/state word.

Verdicts: **credited**, **ghosted**, **untyped**, **unstopped**, **hanging**, **split**, **stray**, **borrowed**, **nest-split**, **resume-split**. Slack alarm on ghosted / split / borrowed / unstopped (and stray / hanging / nest-split / resume-split). Linear ticket on ghosted / split / borrowed. GitHub byline-ledger of scored racks on every score.

The #90662 split rack (Pre/Post on an id with no start + no type + no stop, attributed to a real running subagent) is **split**, never **credited**. Unique nearby flags win their own seeds because those seeds do not carry the split triad. Stop-side nearby issues are a different event class and are labeled as such, not treated as this bug.

## Why not a clone

NOT **Shunt** — nested SendMessage misroute #90463.
NOT **Cote** / **Nixie** — resume team-hub identity split #90332.
NOT **Tappet** — silent hook injection #90296.
NOT **Sounder** — missed background wakeup #90555.
NOT **Fascia** — trust-dialog names spawn_task cwd #90638.
NOT **Wicket** — worktree isolation.
NOT **Datum** — wrong-base code-review #90620.
NOT **Calque** — PowerShell Spanish del #90645.
NOT **Quoin** — quoted-heredoc unescape.
NOT **Gaff** — timeout-kill reported exit 0.
Do NOT ship leftover woodworking / millimetre-slider clones.
Do NOT ship alternate names Masthead, Dateline, Slugline, Kicker, Lede, Dek, Hed, Cutline, Credit, Attrib, Byname, Nameline. Product name is **Byline** only.

Different problem: hook **identity** split on Pre/Post inside a running subagent — a ghost `agent_id` that was never hired and never killed still collects copy, and consecutive tools of one real subagent can land under two ids.
Different UI: newsroom byline desk / brass nameplate rack / ghost byline cards / attribution ledger — dark newsprint, Oswald masthead, Newsreader copy, Azeret Mono wire.
Different idle word: **credited**.

## Live catalog path

`/byline/` is this static newsroom copy-desk. Brass nameplates, ghost cards, attribution ledger. Demo works with no secrets and no npm. Mark: `10:50 Sydney · byline`.

1. Seeded `#90662` **split** is already on the rack: `a37ed07` `lsof` at 16:14:51 on stray `f0a16e9`; next bash at 16:15:06 on the real id → **split**. Never credited.
2. Switch **stray** — 07:20 short burst on a ghost then silence.
3. Switch **borrowed** — 08:35 ghost later receives `cat >` from later agents.
4. Switch **hanging** — 09:20 ghost keeps collecting `npx tsc` for 45+ minutes.
5. Switch **resume-split** — 13:32 stray after SendMessage resume.
6. Switch **nest-split** — stray id appears right after an Agent-tool child spawn, without the lsof/bash pair.
7. Switch **ghosted** — Pre/Post under an id that never had SubagentStart.
8. Switch **untyped** — hired id, payloads missing `agent_type`.
9. Switch **unstopped** — hired typed entry never receives SubagentStop.
10. Switch **honest credited** — start + type + tools + stop on one id → **credited** true.
11. **Score** scores. **Admit credited** scores honestly. **Restore · #90662** shows the split rack. Admit does not lie.

## Hook

`projects/byline/hook/` scores a probe `{ session, issue, source, events[], transcripts{}, scored }` and returns `{ verdict, reasons[], credited }`. See `hook/README.md`.

```bash
node projects/byline/hook/index.mjs --listen 9090
node --test projects/byline/hook/byline.test.mjs
```

`credited` is true ONLY when the verdict is credited (idle, or honest control: every tool-bearing id is hired, typed, and later killed). Seeded 90662 numbers must produce split / `credited=false`. Honest control with start+type+stop produces `credited=true`.

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90662](https://github.com/anthropics/claude-code/issues/90662) — OPEN, filed 2026-08-29, v2.1.251, labels bug/platform:macos/area:hooks/area:agents. Title: PreToolUse/PostToolUse inside a running subagent are sometimes reported under a different agent_id that has no SubagentStart, no agent_type, and never gets a SubagentStop. Five reconciled UTC cases.

Stop-side nearby (different event class — label, do not treat as this bug):

- [anthropics/claude-code#89555](https://github.com/anthropics/claude-code/issues/89555) — SubagentStop with a fresh agent_id
- [anthropics/claude-code#87065](https://github.com/anthropics/claude-code/issues/87065) — empty agent_type bypasses matcher
- [anthropics/claude-code#59719](https://github.com/anthropics/claude-code/issues/59719) — orphan Stop without Start
- [anthropics/claude-code#88995](https://github.com/anthropics/claude-code/issues/88995) — SubagentStop for never-dispatched subagents

Cross-ecosystem (not identical):

- [openai/codex#16226](https://github.com/openai/codex/issues/16226) — hooks have no agent_id at all
- [openai/codex#38142](https://github.com/openai/codex/issues/38142) — interrupt_agent skips SubagentStop
- [openai/codex#40802](https://github.com/openai/codex/issues/40802) — auto-review UserPromptSubmit without lifecycle hooks

Cross-check nearby products are DIFFERENT (cite only as “not this”):

- NOT Shunt #90463, Cote/Nixie #90332, Tappet #90296, Sounder #90555, Fascia #90638, Wicket, Datum #90620, Calque #90645, Quoin, Gaff.

Suggested consumer fix from #90662: every `agent_id` that appears in hook payloads should be bracketed by a `SubagentStart` before and a `SubagentStop` after; `PreToolUse`/`PostToolUse` fired inside a subagent should carry that subagent's `agent_id` and `agent_type`. An id that gets neither leaves every `agent_id`-keyed consumer with an entry it can never close.

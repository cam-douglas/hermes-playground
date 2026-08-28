# Cote

Dove-cote / pigeon loft for resume hub identity split. A success receipt is not a roost. Score the loft or admit **roosted**.

Claude Code `--resume` registers the agent-team hub under a throwaway startup placeholder session id. Teammate `SendMessage` replies then report `success:true`, get consumed from the inbox, and never appear in the resumed parent transcript. Named agents park idle forever. Fresh sessions on the same machine/version are fine.

Observed on 2.1.250 Linux/Bedrock with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`. Filed 2026-08-28.

Idle word: **roosted** (the bird is in the correct cote; hold is current).
NEVER use the product name cote as the idle/state word. NEVER use empty.

Verdicts: **roosted**, **lofted**, **flown**, **drained**, **parked**, **stray**, **banded**, **crossed**, **consumed**, **late**. Slack alarm on drained / parked / stray / crossed / consumed / late. Linear ticket on drained / parked / consumed. GitHub cote-ledger issue on every scored probe.

## Why not a clone

NOT Reveille (living muster / compaction orphans / heartbeats — this is resume identity + inbox routing, not compaction).
NOT Husk (hollow headless SUCCESS envelopes with empty result / num_turns 0 — Cote is success+consumed, delivered to the wrong cote).
NOT Coda (silently dropped assistant text blocks).
NOT Suture (stream-tear / partial turn).
NOT Aside (/btw silent truncation).
NOT Chute (sanctioned secret handoff / mail chute — different problem; Cote is a loft, not a mail chute).
NOT Tain (Chrome pairing one-way glass).
NOT Larder (plugin-store freeze / sync stamp vs content).
NOT Tappet (silent hook injection).
NOT Snib, Veto, Assay, Wicket, Sigil, Stencil, Blot, Reed, Fathom, Hasp, Parity, Quench, Scrim, Knock.
NOT leftover woodworking.

Different problem: team-hub session id vs resumed conversation id. A success receipt is not a roost.
Different UI: dove-cote / pigeon loft. Numbered nest holes, brass leg bands, a trap/hopper that can take a bird without handing it to the keeper, loft clock, slate score. Whitewash, weathered oak, pigeon-blue, loft-dust gold, brass bands, rust for drained/stray. NOT Larder's zinc/ice/butcher-paper, NOT oil-black/brass engine-bay, NOT theatre crimson, NOT mail-chute brass/marble.
Different idle word: **roosted**.

## Live catalog path

`/cote/` is this static dove-cote. Whitewash timber, pigeon-blue sky, numbered nest holes, hopper trap, slate board. Demo works with no secrets and no npm.

1. Seeded `#90332` **drained** is already on the loft: placeholder hub, `success:true`, inbox `[]`, `msg_id` absent from parent → **drained**.
2. Switch **roosted** — live session id == leadSessionId, inbox delivered into the parent → **roosted** (idle).
3. Switch **lofted** — team hub registered; a cote exists; not yet a hold → **lofted**.
4. Switch **flown** — SendMessage returned `success:true`; the bird left → **flown**.
5. Switch **parked** — named agent stays alive and idle after a consumed-but-undelivered SendMessage → **parked**.
6. Switch **stray** — team-name / leadSessionId is the placeholder; parent-session-id is the resumed id → **stray**.
7. Switch **banded** — bird band does not match the hole it was scored against → **banded**.
8. Switch **crossed** — completion or reply routed to the wrong parent (#83599 / #81438 shape) → **crossed**.
9. Switch **consumed** — watcher took the inbox item; the parent never saw it → **consumed**.
10. Switch **late** — team was stamped before resume finished replacing the placeholder → **late**.
11. **Score** names the class. **Admit roosted** does not lie. **Clear** empties the loft to the idle word.

## Hook

`projects/cote/hook/` scores a probe `{ placeholderId, resumedId, leadSessionId, parentSessionId, teamName, sendSuccess, inboxEmptied, msgIdInParent, … }` and returns `{ verdict, reasons[], feed, slack, linear, github }`. See `hook/README.md`.

```bash
node projects/cote/hook/index.mjs --listen 9332
node --test projects/cote/hook/cote.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90332](https://github.com/anthropics/claude-code/issues/90332) — `--resume` sessions register the agent-team hub under a stale placeholder session id — teammate replies are consumed but never delivered (filed 2026-08-28, labels: bug, has repro, area:core, area:agents). Observed on 2.1.250 Linux/Bedrock with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`.

Evidence chain from #90332:

- Placeholder id `PPPPPPPP-…` is minted at process start. Team hub is created as `~/.claude/teams/session-PPPPPPPP/` with `leadSessionId` = `PPPPPPPP` one second after launch, before resume finishes. No transcript `PPPPPPPP*.jsonl` exists.
- Live transcript is `RRRRRRRR-….jsonl`. Spawned agents get `--parent-session-id RRRRRRRR` but `--team-name session-PPPPPPPP`.
- Task outputs split: `/tmp/.../PPPPPPPP-…/tasks/*.output` → `~/.claude/projects/.../RRRRRRRR-…/subagents/agent-*.jsonl`
- `SendMessage(to: team-lead)` returns `{success:true, message:"Message sent to team-lead's inbox", msg_id}`.
- `~/.claude/teams/session-PPPPPPPP/inboxes/team-lead.json` is emptied to `[]` (watcher consumed it) while parent is mid-turn.
- That `msg_id` appears ZERO times in the parent transcript. Consumed and silently dropped.
- Control: identical probe from a fresh session round-trips in 1.3 s; that session's `leadSessionId` matches its real transcript.
- Root cause (bundled source): team creation snapshots `sessionId()` at creation time, before `--resume` replaces the placeholder. Nothing re-stamps `leadSessionId` or adds an alias for the post-resume id.

Corroboration (same identity/routing-on-resume class, not the same bug — cite as shape, not as #90332 itself):

- [anthropics/claude-code#76844](https://github.com/anthropics/claude-code/issues/76844) — Task list not restored on `--resume`/`--continue`; task-list id resolves to a new runtime id (has repro)
- [anthropics/claude-code#80315](https://github.com/anthropics/claude-code/issues/80315) — Post-crash `--resume` dead-ACK new Agent/Task spawns: "now running" but nothing runs, no failure signal
- [anthropics/claude-code#83599](https://github.com/anthropics/claude-code/issues/83599) — SendMessage-resumed subagent reports completion to the main conversation, not the subagent that resumed it
- [anthropics/claude-code#81438](https://github.com/anthropics/claude-code/issues/81438) — SendMessage-resumed nested child's completion routes to the top-level session, not the depth-1 parent; depth-1 left idle forever
- [anthropics/claude-code#84819](https://github.com/anthropics/claude-code/issues/84819) — Cannot resume subagent with background tasks disabled / agent teams off
- [anthropics/claude-code#85047](https://github.com/anthropics/claude-code/issues/85047) — Agent-teams idle-notification ping-pong (teammate stays resident)
- [anthropics/claude-code#90247](https://github.com/anthropics/claude-code/issues/90247) — FR: graceful restart for agent teams without losing connections (filed 2026-08-28)
- [anthropics/claude-code#90338](https://github.com/anthropics/claude-code/issues/90338) — No shared identifier between ListAgents/SendMessage identity and the UI title (filed 2026-08-28; identity split, not routing)
- [anthropics/claude-code#85949](https://github.com/anthropics/claude-code/issues/85949) — forked-skill finders: SendMessage to team-lead false-succeeds into an orphaned inbox; parent deadlocks waiting
- [anthropics/claude-code#86174](https://github.com/anthropics/claude-code/issues/86174) — ListAgents empty while team alive: leadSessionId not re-bound after resume/clear
- [anthropics/claude-code#88849](https://github.com/anthropics/claude-code/issues/88849) — Agent + name: creates teammate that never runs prompt / never reports; spawn still succeeds
- [anthropics/claude-code#84527](https://github.com/anthropics/claude-code/issues/84527) — named teammate final text discarded; coordinator gets payload-less idle_notification
- [anthropics/claude-code#74113](https://github.com/anthropics/claude-code/issues/74113) — background agents idle with work done but final SendMessage undelivered
- [anthropics/claude-code#76500](https://github.com/anthropics/claude-code/issues/76500) — Agent Teams mailbox: long turn-boundary delays + lost final reports
- [anthropics/claude-code#71723](https://github.com/anthropics/claude-code/issues/71723) — name silently switches to teammate protocol; results never return via task-notification
- [anthropics/claude-code#86070](https://github.com/anthropics/claude-code/issues/86070) — teammate system prompt contradicts itself on result delivery; reports silently lost
- [anthropics/claude-code#89101](https://github.com/anthropics/claude-code/issues/89101) — forked subagents message main under wrong identity

# Tappet

Valve-train / engine-bay desk for silent hook injection. A fired hook is not a seated injection. Score the spawn or admit **seated**.

UserPromptSubmit (and sibling hook events) are the user's primary steering channel. Two silent failure modes: (A) mid-turn / queued messages never spawn the hook process; (B) the hook runs and returns `additionalContext`, but it never reaches the model transcript. Zero hook-execution telemetry, so users cannot self-diagnose.

Idle word: **seated** (injection landed in the transcript; valve seated).
NEVER use the product name tappet as the idle/state word.

Verdicts: **seated**, **missed**, **slipped**, **folded**, **mute**, **oversize**, **misfiled**, **inert**, **blind**, **wave**. Slack alarm on missed / slipped / folded / mute / oversize / misfiled / inert / wave. Linear ticket on missed / slipped / inert. GitHub tappet-ledger issue on every scored probe.

## Why not a clone

NOT Fathom (standing rules dropped after compaction / windowing).
NOT Reed (MCP connected vs registered / tool-registry death).
NOT Coda (silently dropped assistant TEXT in the main turn).
NOT Aside (/btw side-channel silent truncation).
NOT Suture (SSE stream tear).
NOT Knock (permission-grant stall).
NOT Husk (hollow headless SUCCESS envelopes from tools).
NOT Chute (sanctioned secret handoff inbound).
NOT Scrim (outbound DLP).
NOT Tain, Snib, Veto, Assay, Wicket, Sigil, Stencil, Blot, Hasp, Parity, Reveille, Quench.
NOT any leftover woodworking product.

Different problem: hook-injection path — process spawn vs additionalContext seating vs telemetry vs UI render.
Different UI: valve-train / engine-bay desk. Oil black, brass tappet, cam-lobe steel, inspection-lamp amber, oil-film green. A camshaft with one tappet that either strikes the valve or misses. Not a theatre wing, mail chute, one-way glass, threshing floor, night-latch, palimpsest, furnace, gatehouse, seal desk, blueprint fence, suture tray, or darkroom.
Different idle word: **seated**.

## Live catalog path

`/tappet/` is this static valve-train desk. Oil black, brass tappet, cam-lobe steel, inspection-lamp amber, oil-film green. Demo works with no secrets and no npm.

1. Seeded `#90296` **missed** is already in the bay: mid-turn send, hook process never spawned → **missed**.
2. Switch **seated** — hook spawned and `additionalContext` landed in the transcript → **seated** (idle).
3. Switch **slipped** — hook ran (side-effect file exists) but `additionalContext` missing from the raw transcript → **slipped**.
4. Switch **folded** — message merged into the still-running previous turn; no `turn.started` → **folded**.
5. Switch **mute** — client log has zero hook-execution telemetry → **mute**.
6. Switch **oversize** — hook output over 10K silently dropped from context → **oversize**.
7. Switch **misfiled** — SessionStart `additionalContext` redelivered later as `origin:human` → **misfiled**.
8. Switch **inert** — hook logged as succeeded but never injected → **inert**.
9. Switch **blind** — `systemMessage` returned but never rendered in Desktop / VS Code → **blind**.
10. Switch **wave** — contiguous multi-message loss window (~30 min) that then self-recovers → **wave**.
11. **Score** names the class. **Admit seated** does not lie. **Clear** empties the bay to the idle word.

## Hook

`projects/tappet/hook/` scores a probe `{ event, midTurn, hookSpawned, sideEffectFile, additionalContextReturned, additionalContextInTranscript, turnStarted, hookTelemetryPresent, outputBytes, originHumanRedelivery, loggedSucceeded, systemMessageReturned, systemMessageRendered, lossWindowMinutes, recovered, … }` and returns `{ verdict, reasons[], feed, slack, linear, github }`. See `hook/README.md`.

```bash
node projects/tappet/hook/index.mjs --listen 9296
node --test projects/tappet/hook/tappet.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90296](https://github.com/anthropics/claude-code/issues/90296) — UserPromptSubmit hooks: two silent failure modes — mid-turn submissions never fire the hook, and additionalContext intermittently never reaches the context (filed 2026-08-28)

Corroboration:

- [anthropics/claude-code#31114](https://github.com/anthropics/claude-code/issues/31114) — UserPromptSubmit hooks not fired when user sends message mid-turn (regression; closed, still happening)
- [anthropics/claude-code#40647](https://github.com/anthropics/claude-code/issues/40647) — UserPromptSubmit type: command sometimes skipped
- [anthropics/claude-code#19643](https://github.com/anthropics/claude-code/issues/19643) — UserPromptSubmit hook systemMessage not injected into context
- [anthropics/claude-code#88086](https://github.com/anthropics/claude-code/issues/88086) — SessionStart plugin hook additionalContext logged as succeeded but never injected
- [anthropics/claude-code#84021](https://github.com/anthropics/claude-code/issues/84021) — Hook output over 10K silently dropped from context with zero signal
- [anthropics/claude-code#85917](https://github.com/anthropics/claude-code/issues/85917) — SubagentStop additionalContext continues the turn but never reaches the subagent
- [anthropics/claude-code#78266](https://github.com/anthropics/claude-code/issues/78266) — UserPromptSubmit systemMessage does not render in Desktop / VS Code
- [anthropics/claude-code#75378](https://github.com/anthropics/claude-code/issues/75378) — SessionStart additionalContext redelivered later as mislabeled origin:human queued prompt
- [anthropics/claude-code#79616](https://github.com/anthropics/claude-code/issues/79616) — PostToolUse hook additionalContext not reaching Claude in VSCode extension

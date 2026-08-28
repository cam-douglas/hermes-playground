# Veto

Palimpsest / two-layer vellum / court overlay for the Opus-5-only `heron_brook` system-prompt injection that silently vetoes user-configured Agent-tool delegation. A standing CLAUDE.md is not a hold. An ack is not a hold. The vendor edict sits as a translucent overlay on the user's own rule. Lift the overlay. Name the class or admit **upheld**.

Verdicts: **upheld**, **shadowed**, **vetoed**, **misattributed**, **ghost**, **deadlock**, **silent**, **restored**. Idle word is **upheld**. Fail-closed on vetoed / misattributed / deadlock. Slack alarm on vetoed / misattributed / deadlock. Linear silent-override incident on vetoed / misattributed. GitHub ledger row on every scored probe.

NOT Fathom (compaction *evicts* standing rules from the window). Veto is *injection*: a server-gated section (`tengu_heron_brook`, gated on `opus_5_prompt_bundle`) is concatenated into the system prompt with no author label, outranks user CLAUDE.md, and the model often attributes the edict to the user. Different failure, different UI, different backend, different idle word.

NOT Knock (permission-grant stalls). NOT Reveille (muster / duplicate dispatch). NOT Assay (tool-arg wire-format). NOT Wicket (worktree isolation). NOT Stencil (plan-mode bleed). NOT Sigil / Suture / Blot / Coda / Reed / Hasp / Parity / Quench / Scrim. Not leftover woodworking sliders. Not #67606 (confabulated *fake* injection).

## Live catalog path

`/veto/` is this static palimpsest. Two stacked sheets: the user's CLAUDE.md on the lower leaf, the injected edict as a translucent overlay you can lift or drop. A court stamp names the verdict. Demo works with no secrets and no npm.

1. Seeded `#80988` is already on the palimpsest: Opus 5, heron_brook present, CLAUDE.md mandates a critic subagent, zero Agent dispatches, model cites "your standing instruction" → **vetoed**.
2. Switch `#87635` — model blames *your CLAUDE.md* for an Anthropic-authored line → **misattributed**.
3. Switch `#81263` — clamp names `AgentTool`; the surface tool is `Agent` → **ghost**.
4. Switch deadlock — parent cannot write and cannot dispatch → **deadlock**.
5. Switch shadowed — injection present, critic actually dispatched → **shadowed**.
6. Switch silent — conflict resolved with no operator signal → **silent**.
7. Switch restored — UserPromptSubmit standing-request satisfies "unless the user requested it" → **restored**.
8. Switch sonnet / **Clear · upheld** — no overlay down → **upheld**.
9. **Lift** raises the edict. **Drop** lays it back. Idle word is **upheld** when no overlay is down.
10. Slack / GitHub / Linear rows are honest demo copy unless env keys exist on the hook.

## Hook

`projects/veto/hook/` scores a probe `{ model, systemPromptText, claudeMdText, skillText, observedAgentDispatches, modelAttribution, parentWriteBlocked }` and returns `{ verdict, reasons[], overlayPresent, namesGhostTool, restored }`. See `hook/README.md`.

```bash
node projects/veto/hook/index.mjs --listen 9088
node --test projects/veto/hook/veto.test.mjs
```

## Evidence (do not invent more)

- [anthropics/claude-code#80988](https://github.com/anthropics/claude-code/issues/80988) — `heron_brook` injects "Do not call the AgentTool unless the user requested it" / "Do not use workflows or deep-research unless the user requested it" for Opus 5 only. Canonical. PRIMARY seed.
- [anthropics/claude-code#88778](https://github.com/anthropics/claude-code/issues/88778) — Opus 5 returns both lines; sonnet/fable/opus-4-8 return NONE. Mandated validation subagent silently skipped.
- [anthropics/claude-code#82371](https://github.com/anthropics/claude-code/issues/82371) — GrowthBook payload `tengu_heron_brook` / `claude_code_canal_plateau_experiment`. Full batch ran single-threaded against a CLAUDE.md that says use subagents liberally.
- [anthropics/claude-code#87635](https://github.com/anthropics/claude-code/issues/87635) — provenance: model tells the user the line is in *their* CLAUDE.md.
- [anthropics/claude-code#80998](https://github.com/anthropics/claude-code/issues/80998) — no precedence rule, no observability, no author signal.
- [anthropics/claude-code#82456](https://github.com/anthropics/claude-code/issues/82456) / [#81263](https://github.com/anthropics/claude-code/issues/81263) — AgentTool names no tool; sibling section interpolates the real Agent name.
- [anthropics/claude-code#84070](https://github.com/anthropics/claude-code/issues/84070) / [#82250](https://github.com/anthropics/claude-code/issues/82250) / [#88867](https://github.com/anthropics/claude-code/issues/88867) / [#80600](https://github.com/anthropics/claude-code/issues/80600) / [#81935](https://github.com/anthropics/claude-code/issues/81935) — injection overrides CLAUDE.md / skills; cached experiment payload; org opt-out FR.

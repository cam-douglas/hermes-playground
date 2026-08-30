# Pawl hook

Tiny machine-shop ratchet scorer for Claude Code's UserPromptSubmit stall after a duplicate `generate_session_title`. Pipe a probe (`doubledTitleRequest` / `titleRequestCount` + hook script / log / transcript flags + other-hook counts) and get **engaged** or **doubled-title** (or a named nearby class).

Idle word is **engaged**. NEVER use engaged for a failure.

```bash
node projects/pawl/hook/index.mjs < transcript.txt
node --test projects/pawl/hook/pawl.test.mjs
```

Empty stdin uses the seeded #90784 doubled-title board. Stdout is JSON: `verdict`, `reasons[]`, `engaged`, `alarm`.

Probe shape: `{ doubledTitleRequest, titleRequestCount, userPromptSubmitFired, userPromptSubmitCount, hookScriptRan, logSaidAdditionalContext, hookSpecificOutputInTranscript, otherHooksFine, preToolUseCount, stopCount, firstTurnRace, stickyDelivered, nearbyAttachmentSkip, nearbyPaleRoot }` → `{ verdict, reasons[], engaged, alarm }`.

Primary: [anthropics/claude-code#90784](https://github.com/anthropics/claude-code/issues/90784). Nearby-but-different: [#85669](https://github.com/anthropics/claude-code/issues/85669) UserPromptSubmit skipped on attachment, [#55951](https://github.com/anthropics/claude-code/issues/55951) sidebar ignores sessionTitle, [#86413](https://github.com/anthropics/claude-code/issues/86413) hook systemMessage leaks into chat UI. Cross-ecosystem: [openai/codex#35863](https://github.com/openai/codex/issues/35863), [openai/codex#34694](https://github.com/openai/codex/issues/34694).

NOT Pale / Ambo / Cotter / Fetch / Cenotaph.

Slack alarm on doubled-title / first-turn-race / sticky-delivered / context-orphaned / transcript-blank / session-lifetime. Linear ticket on doubled-title / first-turn-race / sticky-delivered.

Ask: serialize hook-context attachment against concurrent `generate_session_title` requests, or retry UserPromptSubmit delivery on the next turn if it was not confirmed delivered.

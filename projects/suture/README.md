# Suture

Surgical suture tray for torn SSE / streaming turns. A partial turn is not a hold. Last complete tool boundary is the only safe suture point.

Agent coding sessions die mid-turn when the SSE / stream stalls or closes. Detect tears (idle timeout / mid-response close / stall with no `message_stop`). Snapshot events up to the last complete `tool_use`↔`tool_result` pair. Offer **Suture** (resume from checkpoint), **Discard** (drop the torn turn), **Hold** (alarm only).

Verdicts: **sealed**, **torn**, **stalled**, **partial**, **resumed**, **discarded**. Idle word is **sealed**.

Not Blot. Not Coda. Not Reed. Not Fathom. Not Hasp. Not Parity. Not Reveille. Not Quench. Not Scrim. Not Knock. Not a leftover slider.

## Live catalog path

`/suture/` is this static OR-theatre suture tray. Demo works with no secrets and no npm.

1. Seeded stream idle timeout `#46987` is already on the tray: tool_use started, partial text + incomplete tool_result → **partial**.
2. Switch `#54434` — events stop, no `message_stop`, connection still open → **stalled**.
3. Switch `#70217` — connection closed mid-response after content blocks streamed → **torn**.
4. Switch `#47252` — ultraplan refine timeout; approval UI never appears → **partial**.
5. Switch `#33949` — hang with no client-side timeout → **stalled**.
6. **Suture** resumes from the last complete tool boundary → **resumed**. **Discard** drops the torn turn → **discarded**. **Hold** keeps the tear and alarms. **Clear · sealed** empties the tray to **sealed**.
7. Slack / GitHub / Linear rows are honest demo copy unless env keys exist on the hook.
8. Idle word is **sealed**. Never the product name.

## Hook

`projects/suture/hook/` is a PostToolUse suture engine. Detect the tear. Snapshot to the last complete tool boundary. See `hook/README.md`.

```bash
node projects/suture/hook/index.mjs --listen 8950
node --test projects/suture/hook/suture.test.mjs
```

## Evidence (do not invent more)

- [anthropics/claude-code#46987](https://github.com/anthropics/claude-code/issues/46987) — Stream idle timeout - partial response received (184 comments, PRIMARY seed)
- [anthropics/claude-code#47698](https://github.com/anthropics/claude-code/issues/47698) — Stream idle timeout - partial response received
- [anthropics/claude-code#54434](https://github.com/anthropics/claude-code/issues/54434) — SSE stream stalls without message_stop
- [anthropics/claude-code#33949](https://github.com/anthropics/claude-code/issues/33949) — SSE hangs indefinitely; no client-side timeout; ESC cannot fully cancel
- [anthropics/claude-code#47252](https://github.com/anthropics/claude-code/issues/47252) — Ultraplan: Stream idle timeout; approval UI never appears
- [anthropics/claude-code#70217](https://github.com/anthropics/claude-code/issues/70217) — Connection closed mid-response (open)
- [openai/codex#3835](https://github.com/openai/codex/issues/3835) — Stream disconnected before completion (class sibling)

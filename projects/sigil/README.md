# Sigil

Signature clinic / seal desk for thinking-block poison. Hollow or unsigned thinking is not a hold. Scan the blocks. Classify the poison. Strip or quarantine so resume is safe.

Extended-thinking sessions brick on resume because the transcript persists `thinking` / `redacted_thinking` blocks with empty text + a retained signature (or empty unsigned thinking). Replay to the API returns 400 "cannot be modified" / "thinking.signature: Field required" and every later turn fails forever.

Verdicts: **valid**, **hollow**, **unsigned**, **wedged**, **stripped**, **resume-safe**. Idle word is **valid**.

NOT Stencil (plan bleed). NOT Suture (stream tear). NOT Blot (image poison). NOT Coda (silent text drop). NOT Reed (MCP registry). NOT Fathom (standing rules after compact). NOT Hasp (file lease). NOT Parity (claim vs reality). NOT Reveille (muster). NOT Quench (token fuse). NOT Scrim (DLP). NOT Knock (permission grants). Not a leftover woodworking slider. Not compaction-vault transcript wipe (Ark) — this is signature poison on thinking / reasoning blocks.

## Live catalog path

`/sigil/` is this static wax-seal desk. Demo works with no secrets and no npm.

1. Seeded hollow signature `#63147` is already on the desk: thinking text emptied to `""`, signature retained → **hollow**.
2. Switch `#68768` — empty unsigned thinking; signature Field required → **unsigned**.
3. Switch `#63463` — interleaved thinking + subagents; unrecoverable 400 → **wedged**.
4. Switch `#63335` — signed thinking replayed modified; session permanently wedged → **wedged**.
5. Switch `#10199` — invalid / modified thinking signature; long-session 400 loop → **wedged**.
6. Switch `#25290` / `#36551` — Codex cousins: persisted encrypted / incompatible reasoning.
7. **Strip** drops hollow / unsigned thinking and keeps `text` / `tool_use` / `tool_result` → **stripped**. **Quarantine** verifies replay would not send poison → **resume-safe**. **Hold** keeps the poison and alarms. **Clear · valid** empties the desk to **valid**.
8. Slack / GitHub / Linear rows are honest demo copy unless env keys exist on the hook.
9. Idle word is **valid**. Never the product name.

## Hook

`projects/sigil/hook/` is a PostToolUse signature clinic. Scan blocks. Score verdicts. Strip or quarantine. See `hook/README.md`.

```bash
node projects/sigil/hook/index.mjs --listen 9050
node --test projects/sigil/hook/sigil.test.mjs
```

## Evidence (do not invent more)

- [anthropics/claude-code#63147](https://github.com/anthropics/claude-code/issues/63147) — resume 400; thinking text emptied to `""` but signature kept (open, PRIMARY seed)
- [anthropics/claude-code#63463](https://github.com/anthropics/claude-code/issues/63463) — unrecoverable 400 thinking cannot be modified; interleaved thinking + subagents
- [anthropics/claude-code#63335](https://github.com/anthropics/claude-code/issues/63335) — signed thinking replayed modified; session permanently wedged
- [anthropics/claude-code#68768](https://github.com/anthropics/claude-code/issues/68768) — empty unsigned thinking block; signature Field required
- [anthropics/claude-code#10199](https://github.com/anthropics/claude-code/issues/10199) — Invalid signature in thinking block / 400 thinking cannot be modified
- [openai/codex#25290](https://github.com/openai/codex/issues/25290) — resume fails `invalid_encrypted_content` on persisted encrypted reasoning
- [openai/codex#36551](https://github.com/openai/codex/issues/36551) — resume fails on incompatible reasoning items in rollout JSONL

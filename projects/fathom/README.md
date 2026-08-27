# Fathom

Hydrographic sounding plate for standing rules after compaction. Pin the rule outside the window. Compact drops it. Bind re-injects `MUST:` lines. Score is a mechanical check. Verdicts: **still**, **bound**, **drift**, **lost**, **ack**. Idle word is **still**.

Not Reveille. Not Parity. Not Hasp. Not Quench. Not Scrim. Not Knock. Not a leftover slider.

Acknowledgment does not predict future behavior. That is the #89733 signature: the model names CLAUDE.md / AGENTS.md / memory, then violates the same rule. Ack is checked before lost.

## Live catalog path

`/fathom/` is this static sounding plate. Demo works with no secrets and no npm.

1. Seeded compaction `#89733` is already on the glass: compacted, not bound, acknowledged no-total + plain, draft reports an average and a total → **ack**.
2. Switch `#82184` — compact drops governance, a commit lands without review → **lost**.
3. Switch `#59309` — spawn without inheritance, draft writes CLAUDE.md → **lost**.
4. Switch `#25792` — compact forgets AGENTS progress (97% → 42%) → **lost**.
5. Switch `#25884` — rule was bound; draft uses `as unknown` and `@ts-ignore` → **drift**.
6. **Compact / Bind / Score / Acknowledge / Spawn** re-runs decide in the page. **Clear · still** empties the board.
7. Slack / GitHub / Linear / Hook rows are honest demo copy unless env keys exist on the hook.
8. Idle word is **still**. Never the product name.

## Hook

`projects/fathom/hook/` pins standing checks outside the context window, re-binds after compact, and scores the draft. See `hook/README.md`.

```bash
node projects/fathom/hook/index.mjs --listen 8793
node --test projects/fathom/hook/fathom.test.mjs
```

## Evidence (do not invent more)

- [anthropics/claude-code#89733](https://github.com/anthropics/claude-code/issues/89733) — CLAUDE.md and memory rules stop applying after compaction; same rule broken 3× after explicit acknowledgment
- [anthropics/claude-code#82184](https://github.com/anthropics/claude-code/issues/82184) — compaction drops governance while preserving narrative
- [anthropics/claude-code#59309](https://github.com/anthropics/claude-code/issues/59309) — CLAUDE.md not propagated to subagents
- [openai/codex#25792](https://github.com/openai/codex/issues/25792) — compaction forgets AGENTS rules; progress 97% → 42%
- [openai/codex#25884](https://github.com/openai/codex/issues/25884) — AGENTS.md read correctly, then applied inconsistently

# Coda

Splice desk for silently dropped assistant / subagent text. The work was generated. The parent received a fragment, or nothing. The loss looks like success.

A last text block is not a hold. max_tokens is not a truncation marker. Swallowed mid-turn text cannot be spliced from the JSONL — it was never persisted.

Verdicts: **intact**, **snip**, **split**, **void**, **swallow**, **raw**. Idle word is **intact**.

Not Reed. Not Fathom. Not Hasp. Not Parity. Not Reveille. Not Quench. Not Scrim. Not Knock. Not a leftover slider.

## Live catalog path

`/coda/` is this static letterpress splice desk. Demo works with no secrets and no npm.

1. Seeded max_tokens split `#81838` is already on the desk: numbered lines 954–1200 delivered; 1–953 vanished with no marker → **split**.
2. Switch `#58109` — last text before tool_use; earlier `## Verdict` block dropped → **snip**.
3. Switch `#20190` — terminal tool_use; all text lost → **void**.
4. Switch `#74260` — mid-turn text never persisted; splice cannot recover → **swallow**.
5. Switch `#17591` — TaskOutput returned JSONL instead of the summary → **raw**.
6. Switch `#24849` — middle line `S-0391` missing from a numbered list → **snip**.
7. **Splice · recover** restores delivered from the whole when it was persisted. **Mark** re-scores. **Clear · intact** empties the desk to **intact**.
8. Slack / GitHub / Linear rows are honest demo copy unless env keys exist on the hook.
9. Idle word is **intact**. Never the product name.

## Hook

`projects/coda/hook/` is a PostToolUse splice engine. Concatenate every text block. Compare delivered vs whole. See `hook/README.md`.

```bash
node projects/coda/hook/index.mjs --listen 8795
node --test projects/coda/hook/coda.test.mjs
```

## Evidence (do not invent more)

- [anthropics/claude-code#81838](https://github.com/anthropics/claude-code/issues/81838) — max_tokens split; only the last assistant message reached the parent; ~84% vanished with no marker (PRIMARY seed)
- [anthropics/claude-code#58109](https://github.com/anthropics/claude-code/issues/58109) — last text before tool_use delivered; earlier "## Verdict" block dropped
- [anthropics/claude-code#20190](https://github.com/anthropics/claude-code/issues/20190) — terminal tool_use; all text lost (void)
- [anthropics/claude-code#74260](https://github.com/anthropics/claude-code/issues/74260) — mid-turn text never persisted; model asks if you saw the list; cannot splice from JSONL (swallow)
- [anthropics/claude-code#17591](https://github.com/anthropics/claude-code/issues/17591) — TaskOutput returned JSONL instead of the summary (raw)
- [openai/codex#24849](https://github.com/openai/codex/issues/24849) — middle line missing from a numbered list (snip)

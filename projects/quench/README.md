# Quench

Runtime fuse for agent sessions. UI warnings do not stop in-flight work. Quench trips a hard kill, fires Slack, and writes a GitHub spend ledger.

Not Knock. Not Scrim. Not context pruning.

## Live catalog path

`/quench/` is this static panel. Demo works with no secrets and no npm.

1. A seeded 82-agent runaway is already on the copper. The meter is not empty.
2. Attribution bars tick in the browser (parent / subagents / hooks / workflows).
3. **Throw the breaker** cuts the sim and writes a ledger row. **Raise the fuse** lifts the limit.
4. Slack / GitHub / Linear rows are honest demo copy unless env keys exist on the hook.
5. Idle word is **cool**. Live word is **armed**. Never the product name.

## Hook

`projects/quench/hook/` accepts a usage snapshot and answers `continue` or `kill`. See `hook/README.md`.

```bash
node projects/quench/hook/index.mjs --listen 8788
node --test projects/quench/hook/fuse.test.mjs
```

## Evidence (do not invent more)

- [anthropics/claude-code#85422](https://github.com/anthropics/claude-code/issues/85422) — open FR: runtime token-burn circuit breaker
- [anthropics/claude-code#68619](https://github.com/anthropics/claude-code/issues/68619) — recursive spawn; ~$1700 emptied an account
- [anthropics/claude-code#72566](https://github.com/anthropics/claude-code/issues/72566) — 5 planned → 361+ agents; a 5h quota gone in minutes
- [anthropics/claude-code#77582](https://github.com/anthropics/claude-code/issues/77582) — 99% banner is UI-only; background workflows keep burning
- [anthropics/claude-code#83025](https://github.com/anthropics/claude-code/issues/83025) — ~5.2M tokens / 82-agent fan-out destroyed a Max window

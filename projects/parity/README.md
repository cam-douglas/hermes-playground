# Parity

Claim-vs-reality board. Paste what an agent asserted. Check GitHub, Vercel, Linear, and a functional probe. Verdicts: **match**, **drift**, **unverified**, **fabricated**. Idle word is **even**.

Not Reveille. Not Quench. Not Scrim. Not Knock. Not a leftover slider.

## Live catalog path

`/parity/` is this static survey plate. Demo works with no secrets and no npm.

1. Seeded false completion `#40861` is already on the glass: cosmetic GitHub / Vercel green, `functional.messagesSent=0` → **drift**.
2. Switch `#19520` — cited SHA `9f3e2a1b` / PR `#88` with `github.shaExists=false` → **fabricated**.
3. Switch `#74427` — commits / PR / issue / 10/10 PASS with `toolUses:0` → **fabricated**.
4. **Check claim** re-runs decide + rollup in the page. **Clear · even** empties the board.
5. Slack / GitHub / Linear rows are honest demo copy unless env keys exist on the hook.
6. Idle word is **even**. Never the product name.

## Hook

`projects/parity/hook/` accepts a claim plus probes and answers `match`, `drift`, `unverified`, `fabricated`, or idle `even`. Unchecked channels do not downgrade a decided board. See `hook/README.md`.

```bash
node projects/parity/hook/index.mjs --listen 8791
node --test projects/parity/hook/parity.test.mjs
```

## Evidence (do not invent more)

- [anthropics/claude-code#40861](https://github.com/anthropics/claude-code/issues/40861) — reports broken deployments as working
- [anthropics/claude-code#56870](https://github.com/anthropics/claude-code/issues/56870) — declares OK without verification
- [anthropics/claude-code#43387](https://github.com/anthropics/claude-code/issues/43387) — done/deployed without real checks
- [anthropics/claude-code#74427](https://github.com/anthropics/claude-code/issues/74427) — workflows reported done but never happened
- [anthropics/claude-code#67730](https://github.com/anthropics/claude-code/issues/67730) — confident reports with zero tool calls
- [openai/codex#19520](https://github.com/openai/codex/issues/19520) — fabricates non-existent commit SHAs

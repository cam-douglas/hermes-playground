# Hasp

File-lease / compare-and-swap plate. Seize a path before Write. Verdicts: **loose**, **seized**, **yield**, **stale**, **clobber**. Idle word is **loose**.

Not Reveille. Not Parity. Not Quench. Not Scrim. Not Knock. Not a leftover slider.

## Live catalog path

`/hasp/` is this static locksmith plate. Demo works with no secrets and no npm.

1. Seeded worktree race `#90146` is already on the glass: holder `session-a` on `.claude/worktrees/.../src/wip.ts`, `session-b` Write → **clobber**.
2. Switch `#85597` — `~/.claude/rules/catchup.md` memory/rule overwrite → **clobber**.
3. Switch `#38541` — shared worktree `checkout.ts` → **clobber**.
4. Switch `#33741` — two CLIs race `cap_sid` → **clobber**.
5. **Seize / Write / Release** re-runs decide in the page. **Clear · loose** empties the board.
6. Slack / GitHub / Linear / Hook rows are honest demo copy unless env keys exist on the hook.
7. Idle word is **loose**. Never the product name.

## Hook

`projects/hasp/hook/` is a PreToolUse lease engine. Seize a path; a stranger Write is clobber; a drifted hash is stale; an expired lease (default 15 minutes) can be taken. See `hook/README.md`.

```bash
node projects/hasp/hook/index.mjs --listen 8792
node --test projects/hasp/hook/hasp.test.mjs
```

## Evidence (do not invent more)

- [anthropics/claude-code#90146](https://github.com/anthropics/claude-code/issues/90146) — two sessions share a worktree path and silently clobber uncommitted work
- [anthropics/claude-code#85597](https://github.com/anthropics/claude-code/issues/85597) — two sessions share `~/.claude`; Write silently overwrites memory and rule files
- [openai/codex#38541](https://github.com/openai/codex/issues/38541) — uncommitted changes silently overwritten when sessions share a worktree
- [openai/codex#33741](https://github.com/openai/codex/issues/33741) — two CLI instances race `cap_sid`; last writer wins; workspaces become unwriteable

# Wicket

Gatehouse / turnstile for worktree isolation escapes. Isolation is a pin, not a promise. `isolation:"worktree"` / EnterWorktree sets a default cwd and sometimes a session-wide latch, but Edit/Write with an absolute `file_path` still lands in the main checkout. Score the probe against the pinned worktree root. Admit the write (**home**) or name the failure class.

Verdicts: **home**, **escape**, **latch**, **reap**, **swap**, **misbind**. Idle word is **home**. Path check is component-containment (`is_relative_to` / parents walk), never a string prefix.

NOT Hasp (file lease / last-writer-wins on the same path). NOT Stencil (plan-mode mutation fence). NOT Reveille (muster / duplicate dispatch). NOT Sigil / Suture / Blot / Coda / Reed / Fathom / Parity / Quench / Scrim / Knock. Not a leftover woodworking slider. Not a wax-seal desk, suture tray, darkroom, splice desk, reed cabinet, sounding plate, lease plate, claim board, muster board, fuse console, DLP veil, or grant inbox.

## Live catalog path

`/wicket/` is this static gatehouse. Demo works with no secrets and no npm.

1. Seeded escape `#74726` is already on the gate: `isolation:"worktree"` Edit/Write to the main checkout succeeds → **escape**.
2. Switch `#81333` — worktree-isolated subagent ran `git reset --hard` in the main checkout; guard silent → **escape** (data-loss).
3. Switch `#86584` swap — sibling cwd race → **swap**. Switch `#86584` reap — idle parent reaps a live child's unchanged worktree → **reap**.
4. Switch `#89102` — EnterWorktree mid-batch flips a session-wide latch; even `pwd` refused → **latch**.
5. Switch `#85448` — isolation binds the worktree to the caller's Bash cwd, not the target repo → **misbind**.
6. Switch `#59628` / `#56137` — worktree session edits the parent checkout → **escape**.
7. Switch `#64322` — sibling `/tmp/wt-other` vs pin `/tmp/wt`; string prefix is a false friend → **escape**.
8. **Admit** lets a home write through. **Refuse** keeps the named class. **Rebound** rewrites the path into the pin → **home**. **Hold** keeps the class. **Clear · home** empties the gate to **home**.
9. Slack / GitHub / Linear rows are honest demo copy unless env keys exist on the hook.
10. Idle word is **home**. Never the product name.

## Hook

`projects/wicket/hook/` is a PreToolUse isolation scorer. Score probes. Name the class. Rebound or refuse. See `hook/README.md`.

```bash
node projects/wicket/hook/index.mjs --listen 9060
node --test projects/wicket/hook/wicket.test.mjs
```

## Evidence (do not invent more)

- [anthropics/claude-code#74726](https://github.com/anthropics/claude-code/issues/74726) — isolation:"worktree" does not sandbox absolute file paths; Edit/Write to main checkout succeeds (open, PRIMARY seed)
- [anthropics/claude-code#81333](https://github.com/anthropics/claude-code/issues/81333) — worktree-isolated subagent ran `git reset --hard` in the main checkout; guard did not fire
- [anthropics/claude-code#86584](https://github.com/anthropics/claude-code/issues/86584) — sibling cwd races + idle auto-reap of a live child's worktree
- [anthropics/claude-code#89102](https://github.com/anthropics/claude-code/issues/89102) — EnterWorktree while subagents run flips a session-wide isolation latch; even `pwd` refused
- [anthropics/claude-code#85448](https://github.com/anthropics/claude-code/issues/85448) — isolation binds the worktree's base repo to the caller's Bash cwd at dispatch, not the target repo
- [anthropics/claude-code#59628](https://github.com/anthropics/claude-code/issues/59628) — worktree sessions can edit files in the parent main checkout with no guardrail
- [anthropics/claude-code#56137](https://github.com/anthropics/claude-code/issues/56137) — isolation:"worktree" does not actually isolate subagent file writes
- [anthropics/claude-code#64322](https://github.com/anthropics/claude-code/issues/64322) — Edit-tool path validation must be component-containment; string-prefix matching is insufficient (`/tmp/wt-other` vs `/tmp/wt`)

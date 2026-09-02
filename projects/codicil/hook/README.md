# Codicil hook

Tiny probate / will-chamber classifier for the Claude Code defect where `git commit --amend` in a shared multi-agent working tree does not re-check HEAD, so it can silently rewrite a concurrent teammate's commit instead of the agent's own. Measured on Claude Code 2.1.239. Reporter KinohTaGo. Filed 2026-09-02. Labels: bug, has repro, area:agents.

Idle word is **attested**. Seeded state is usurped / #91513 (shared non-worktree-isolated tree; Agent A C1 then Agent B C2 then A amends C2; C2 tree kept byte-identical; B's message discarded). Never idle as sealed / rewritten / swaged / torn / homed / crossed / armed / unheard.

```bash
node projects/codicil/hook/codicil.mjs projects/codicil/data/91513.json
node projects/codicil/hook/codicil.mjs projects/codicil/data/attested.json
echo '{"amendBlind":true,"usurped":true}' | node projects/codicil/hook/codicil.mjs
node --test projects/codicil/hook/codicil.test.mjs
```

Empty stdin uses the idle **attested** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `attested`, `usurped`, `hold`, `alarm`, `idleWord`.

Given `{ recheckHead, headMoved, amendBlind, noRevParseGuard, usurped, teammateRewrite, messageDiscard, treeIdentical, sharedWorktree, hasClearRepro }`:

- **ATTESTED** if `git rev-parse HEAD` still equals Agent A's own C1 SHA; amend is safe
- **USURPED** if blind `--amend` rewrites teammate C2 (#91513)
- **HEAD-MOVED** if HEAD is Agent B's C2, not Agent A's C1
- **TEAMMATE-REWRITE** if A's `--amend` rewrites B's C2 instead of A's C1
- **MESSAGE-DISCARD** if B's commit message is discarded and replaced with A's
- **TREE-IDENTICAL** if the amended commit's tree is byte-identical to C2
- **NO-REV-PARSE-GUARD** if `--amend` does not re-check `git rev-parse HEAD`
- **SHARED-WORKTREE** if Agent Teams teammates share one plain git working tree
- **HAS-CLEAR-REPRO** if KinohTaGo filed #91513; has repro; area:agents
- **HOLD** if the attestation holds (HEAD still agent's own SHA)

This is a diagnostic scoring desk. Not an exploit. No payloads. Score whether the shared-tree amend is attested or usurped.

Primary: [anthropics/claude-code#91513](https://github.com/anthropics/claude-code/issues/91513). Cousins (cite only, not primaries): [#90943](https://github.com/anthropics/claude-code/issues/90943) concurrent sessions stale git index; [#91349](https://github.com/anthropics/claude-code/issues/91349) worktree add falls through to shared main; [#90146](https://github.com/anthropics/claude-code/issues/90146) shared worktree path clobber; [#83311](https://github.com/anthropics/claude-code/issues/83311) isolation agents commit across branches; [#88967](https://github.com/anthropics/claude-code/issues/88967) worktree from stale commit.

Hypothesis only (NON-BINDING): product-level guardrail should refuse amend when HEAD ≠ agent's last commit SHA in shared trees; discard if issue evidence disagrees.

NOT leftover crimp / jackfield / tocsin / bolter / deadeye / reglet / vault-latch / annunciator / caisson / spindle / knell / tumbler / escapement. Product name stays Codicil.

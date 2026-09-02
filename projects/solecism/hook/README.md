# Solecism hook

Tiny grammar / usage desk / manuscript-margin classifier for the Claude Code defect where worktree provisioning writes the git exclude entry to a literal `--git-common-dir/` directory in the MAIN checkout instead of `.git/info/exclude`. Measured on Claude Code 2.0.42. Reporter karlgroves. Filed 2026-09-02. Labels: bug, platform:macos, area:core.

Idle word is **resolved**. Seeded state is literal / #91558 (intended write never executed `rev-parse`; the flag string itself became `./--git-common-dir/info/exclude` with contents `.claude/worktrees/`; `.git/info/exclude` still has no active entries; MAIN checkout polluted). Never idle as sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard.

```bash
node projects/solecism/hook/solecism.mjs projects/solecism/data/91558.json
node projects/solecism/hook/solecism.mjs projects/solecism/data/resolved.json
echo '{"flagAsPath":true,"literal":true}' | node projects/solecism/hook/solecism.mjs
node --test projects/solecism/hook/solecism.test.mjs
```

Empty stdin uses the idle **resolved** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `resolved`, `parsed`, `literal`, `flagAsPath`, `hold`, `alarm`, `idleWord`.

Given `{ persistParse, parsed, resolved, literal, flagAsPath, mainCheckoutPollution, excludeNeverReached, recurringRecreation, nearMissGitAdd, siblingDevNullClass, belowBashLayer, gitignoreMasksMiss, hasClearEvidence }`:

- **RESOLVED** if `git rev-parse --git-common-dir` is executed and its OUTPUT is the write path; exclude lands in `.git/info/exclude`
- **PARSED** if the flag was parsed, not copied as a path
- **LITERAL** if the flag string became `./--git-common-dir/info/exclude` in the MAIN checkout (#91558)
- **FLAG-AS-PATH** if the intended `$(git rev-parse --git-common-dir)/info/exclude` never executed the rev-parse
- **MAIN-CHECKOUT-POLLUTION** if the MAIN repository checkout is polluted (not the worktree)
- **EXCLUDE-NEVER-REACHED** if `.git/info/exclude` still has no active entries
- **RECURRING-RECREATION** if the directory was recreated more than once (earlier ~16:50, observed 18:01:13 Sep 1 2026)
- **NEAR-MISS-GIT-ADD** if there was a near-miss `git add` of `A --git-common-dir/info/exclude`
- **SIBLING-DEV-NULL-CLASS** if this is the same class as #90456 (path literal without resolution)
- **BELOW-BASH-LAYER** if the write was not created by any logged tool call
- **GITIGNORE-MASKS-MISS** if impact is low because `.gitignore` already has `.claude/`
- **HAS-CLEAR-EVIDENCE** if karlgroves filed #91558; platform:macos; area:core
- **HOLD** if the usage is resolved (rev-parse OUTPUT used)

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the exclude path is resolved or literal.

Primary: [anthropics/claude-code#91558](https://github.com/anthropics/claude-code/issues/91558). Cousin (cite only, not a primary): [#90456](https://github.com/anthropics/claude-code/issues/90456) worktree provisioning writes Git LFS hooks to a literal `dev/null/` directory instead of `.git/hooks/`.

Hypothesis only (NON-BINDING): execute `git rev-parse --git-common-dir` and use its OUTPUT; fail loudly rather than falling back to the flag string; discard if issue evidence disagrees.

NOT leftover coffer vault / codicil probate / crimp pliers / jackfield channel-strip / tocsin watchhouse / bolter flour-mill / deadeye standing-rigging / reglet letterpress / vault-latch / annunciator. Product name stays Solecism.

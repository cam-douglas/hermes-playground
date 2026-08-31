# Lye hook

Tiny fuller's-vat classifier for the 2.1.251 `CLAUDE_CONFIG_DIR` scrub regression. With `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1`, version 2.1.251 removes `CLAUDE_CONFIG_DIR` from the environment of subprocesses Claude Code spawns (verified for hooks and the Bash tool). The parent still writes its own state into the relocated `CLAUDE_CONFIG_DIR`. 2.1.250 passes the variable through with scrub enabled. Nothing is printed about the removal; `--debug` is silent. Fresh empty config can exit "Not logged in" after the hook.

Idle word is **rinsed**. Seeded state is scrubbed / #91020. Never idle as "scrubbed" / "stripped" / "lye" / "advowson" / "reserved" / "vacant" / "smutch" / "plain" / "seated" / "bound" / "hallmarked" / "pointed" / "collapsed" / "spoiled" / "banked" / "misstruck" / "hunting" / "traced".

```bash
node projects/lye/hook/lye.mjs projects/lye/data/91020.json
node projects/lye/hook/lye.mjs projects/lye/data/rinsed.json
echo '{"childHasConfigDir":false,"parentWritesRelocated":true}' | node projects/lye/hook/lye.mjs
node --test projects/lye/hook/lye.test.mjs
```

Empty stdin uses the idle **rinsed** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `hold`, `alarm`, `idleWord`.

- **RINSED** if scrub is on and `CLAUDE_CONFIG_DIR` still reaches children (2.1.250 pass-through)
- **SCRUBBED** if children lost `CLAUDE_CONFIG_DIR` while the parent still writes the relocated vat (#91020)
- **STRIPPED** if the variable was removed from subprocess env
- **RELOCATED-PARENT** if the parent still writes the relocated directory
- **DEFAULT-HOME** if children resolve `~/.claude`
- **HOOK-BLIND** if SessionStart hook grep is 0
- **BASH-BLIND** if Bash tool grep is 0
- **SILENT-DROP** if nothing was printed about the removal
- **REGRESSION-251** if the strip is on 2.1.251
- **SCRUB-FLAG** if `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` is the instrument
- **CONFIG-DIR-LIE** if session and children disagree about where config lives
- **DUAL-HOME** if parent relocated and children default-home
- **UNLOGGED** if `--debug` contains no message
- **PASS-THROUGH-250** if 2.1.250 kept the variable (hold)
- **NOT-LOGGED-IN** if a fresh empty config exits "Not logged in" after the hook

Primary: [anthropics/claude-code#91020](https://github.com/anthropics/claude-code/issues/91020). Same-class (not primary): Pale [#90683](https://github.com/anthropics/claude-code/issues/90683), Pawl [#90784](https://github.com/anthropics/claude-code/issues/90784), Ambo [#90685](https://github.com/anthropics/claude-code/issues/90685), Chatelaine [#90647](https://github.com/anthropics/claude-code/issues/90647), Advowson [#91005](https://github.com/anthropics/claude-code/issues/91005).

NOT Advowson / Smutch / Bitting / Puncheon / Pale / Pawl / Ambo / Chatelaine as a clone.

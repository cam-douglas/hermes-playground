# Skive hook

Tiny leatherworker / skiving-bench classifier notes for the Claude Code defect where `bypassPermissions` (and auto mode) injects a Bash-first meta instruction gated by `tengu_thrifty_sonic` / `CLAUDE_CODE_THRIFTY_SONIC`. Following that instruction silently skips path-scoped rules, nested `CLAUDE.md`, and Read|Edit|Write hooks. Filed ~2026-09-05. Labels: bug, has repro, platform:macos, area:hooks, area:permissions. Claude Code 2.1.260 (nixpkgs) on macOS (Darwin 25.5.0). Model-gated: active on fable[1m] by default; sonnet/haiku need the flag.

Idle word is **pared**. Seeded state is raw / #92271 (Bash-first steer active → enforcement skived). Never idle as cast / fouled / flowing / snubbed / matched / warded / lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / careted / ringing.

This stub is documentation only. The living page at `projects/skive/index.html` scores probes in-browser. No npm. No secrets. No real hooks. No exploits. Diagnostic shapes only (tool path, flag, model, tokens, strap state). No payloads.

Kill switch / detection (document only — do not treat this stub as a live hook):

```json
{
  "env": {
    "CLAUDE_CODE_THRIFTY_SONIC": "0"
  }
}
```

Setting `CLAUDE_CODE_THRIFTY_SONIC=0` in settings env restores dedicated Read/Edit/Write (verified on #92271 with `claude -p --settings ...`). Detection: if a dedicated Read of a path-scoped / nested file yields RULE-LOADED / NESTED-LOADED tokens, and a Bash `cat` of the same file yields NO-TOKENS, the steer is active.

Given a probe-shaped payload `{ tool, thriftySonic, model, permissionMode, ruleLoaded, nestedLoaded, hookFired, tokens, noTokens, persistHold, log }`:

- **PARED** if dedicated Read/Edit/Write fired and tokens are present, or the kill switch is off
- **RAW** if Bash-first steer is active and Bash `cat`/`sed`/heredoc returns NO-TOKENS (#92271)
- **READ-TOOL-TOKENS** if dedicated Read loads RULE-LOADED-7731 and NESTED-LOADED-4402
- **BASH-CAT-NO-TOKENS** if Bash `cat` of the same path returns NO-TOKENS
- **THRIFTY-SONIC-ON** if `tengu_thrifty_sonic` / unset env injects the Bash-first steer
- **THRIFTY-SONIC-OFF** if `CLAUDE_CODE_THRIFTY_SONIC=0` restores dedicated tools
- **HOOKS-MATCHER-MISS** if PreToolUse/PostToolUse `Read|Edit|Write` never fires on `sed`/heredoc
- **NESTED-CLAUDE-SKIP** if subdirectory `CLAUDE.md` is not included on Bash file access
- **PATH-SCOPED-SKIP** if `.claude/rules/*.md` with `paths:` does not trigger on Bash `cat`

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the hide is pared or already raw.

Primary: [anthropics/claude-code#92271](https://github.com/anthropics/claude-code/issues/92271). Cousins (cite only, not primary): [#92178](https://github.com/anthropics/claude-code/issues/92178), [#92074](https://github.com/anthropics/claude-code/issues/92074). Public write-up: https://kawasin73.hatenablog.com/entry/2026/09/05/092056

Hypothesis only (NON-BINDING): the interactive bench should make the three unbuckled straps and the Bash-under-grain cut visceral. Discard if issue evidence disagrees. Do not claim unseen source.

NOT leftover Lagan salvage-buoy · Waif foundling intake · Snub dockside snubbing post · Ward locksmith iron/brass · Deadlight night-cabin shutter · Knock permission stall · Geneva maltese-cross · Deadeye hook-lanyard · Tappet silent injection. Product name stays Skive.

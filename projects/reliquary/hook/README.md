# Reliquary hook

Tiny vault-latch / relic-case classifier for the Claude Desktop Linux ARM64 session-registry write path that opens `claude-code-sessions` with hardcoded x86-64 `O_DIRECTORY|O_NOFOLLOW` bits. On aarch64 those bits mean `O_DIRECT`, so `open()` returns EINVAL (-22). Every sidebar persist fails silently. Sessions vanish from the sidebar after restart while CLI transcripts still resume. Last successful `local_*.json` 2026-09-01 08:26; failures from 09:07; runtime 2.1.237→2.1.247; 73 EINVAL lines. Reporter usman1501.

Idle word is **latched**. Seeded state is vanished / #91433 (`EINVAL` latch on aarch64; overnight session missing from sidebar plaque while CLI transcript body still exists). Never idle as sealed / rebound / dark / spurious / fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed.

```bash
node projects/reliquary/hook/reliquary.mjs projects/reliquary/data/91433.json
node projects/reliquary/hook/reliquary.mjs projects/reliquary/data/latched.json
echo '{"einvalOpen":true,"hardcodedX86Flags":true}' | node projects/reliquary/hook/reliquary.mjs
node --test projects/reliquary/hook/reliquary.test.mjs
```

Empty stdin uses the idle **latched** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `latched`, `vanished`, `hold`, `alarm`, `idleWord`.

Given `{ vaultLatched, relicSeated, einvalOpen, odirectPoison, hardcodedX86Flags, aarch64NativeOk, sidebarVanish, cliResumeSurvives, seventyThreeEinval, runtimeRegression, overnightSessionLost, ensureStorageDir }`:

- **LATCHED** if the vault latches each Desktop sidebar session and the overnight relic stays seated
- **VANISHED** if EINVAL latch on aarch64 empties the sidebar plaque while the CLI transcript body still exists (#91433)
- **EINVAL-OPEN** if `open()` on `claude-code-sessions` returns EINVAL (-22)
- **ODIRECT-POISON** if x86-64 `O_DIRECTORY` (0o200000) is `O_DIRECT` on aarch64
- **HARDCODED-X86-FLAGS** if the bundle uses hardcoded x86-64 `O_DIRECTORY|O_NOFOLLOW` instead of runtime `fs.constants`
- **AARCH64-NATIVE-OK** if native aarch64 flags succeed and `0o200000|0o400000` reproduce EINVAL
- **SIDEBAR-VANISH** if the session is gone from the sidebar and Archived after restart
- **CLI-RESUME-SURVIVES** if `claude --resume` still works from `~/.claude/projects/`
- **SEVENTY-THREE-EINVAL** if main.log holds 73 EINVAL lines since the update
- **RUNTIME-REGRESSION** if last successful `local_*.json` is 2026-09-01 08:26 and failures start 09:07 (2.1.237→2.1.247)
- **OVERNIGHT-SESSION-LOST** if a full overnight working session vanished from the sidebar
- **ENSURE-STORAGE-DIR** if `mkdirPrivate` → `ensureStorageDir` → `writeSessionToDisk` is the open path
- **HAS-CLEAR-REPRO** if usman1501 filed #91433; has repro; Linux ARM64; data-loss; area:desktop
- **HOLD** if the reliquary is latched (vault closed; relic seated)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the vault is latched or vanished.

Primary: [anthropics/claude-code#91433](https://github.com/anthropics/claude-code/issues/91433). Cousins (cite only, not primaries): [#91409](https://github.com/anthropics/claude-code/issues/91409) Windows junction AppData; [#88747](https://github.com/anthropics/claude-code/issues/88747) absolute core.hooksPath; [#91400](https://github.com/anthropics/claude-code/issues/91400) scheduled-task process leak; [#91392](https://github.com/anthropics/claude-code/issues/91392) three independently-generated names.

Hypothesis only (NON-BINDING): bundler may have inlined x86-64 O_* numeric literals into the Desktop embed path. Do not claim a root cause in Claude Code source you have not seen beyond the issue's measured repro.

NOT leftover woodworking / mm-slider / millrace / locksmith / campanology / berth clones. Product name stays Reliquary. Do not rename to Annunciator / Caisson / Spindle / Knell / Tumbler / Escapement / Geneva / Scotch / Fibula / Virgule / Riddle / Garner / Pintle / Carillon / Postern / Sluice / Alidade / Cockade / Lye / Clew / Hasp / Berth / Bollard / Reveille / Callboard.

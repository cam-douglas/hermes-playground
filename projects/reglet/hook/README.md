# Reglet hook

Tiny letterpress line-spacing strip / galley classifier for the Claude Desktop Windows staged worktree checkout that runs `createWorktree` → `stageCheckout` before `.gitattributes` is in the index. With `core.autocrlf=true`, `.claude/**` and `CLAUDE.md` are written CRLF. The later full checkout uses `:(exclude).claude` and leaves the bleed. `prettier --check .` (`endOfLine: lf`) fails on untouched `.claude/launch.json` while `git status` is clean. CLI `EnterWorktree` / Agent `isolation:"worktree"` stay LF. Plain-git repro: `ls-files --eol` shows `w/crlf` attr/. Reporter mortenklungland-ai. Claude Desktop 1.40609.1.0 (MSIX), Windows 11, CLI 2.1.255, git 2.55.0. Observed 2026-08-31 and 2026-09-02.

Idle word is **creased**. Seeded state is bled / #91443 (CRLF bleed into `.claude/**` + `CLAUDE.md` from empty-index stageCheckout under autocrlf). Never idle as latched / vanished / sealed / dark / spurious / fenced / swept / tolled / mute / honored / discarded / arrested / skipped / indexed / jumped / chocked / rolled / clasped / sprung / drained / hinged / pealed / warded / pooled / cased / aired / sifted / stocked / stationed / marvered / unpinned / rinsed / literal / choked / opened / stalled / fused / forged / attributed.

```bash
node projects/reglet/hook/reglet.mjs projects/reglet/data/91443.json
node projects/reglet/hook/reglet.mjs projects/reglet/data/creased.json
echo '{"crlfBleed":true,"emptyIndex":true}' | node projects/reglet/hook/reglet.mjs
node --test projects/reglet/hook/reglet.test.mjs
```

Empty stdin uses the idle **creased** ticket. Stdout is JSON: `verdict`, `chips[]`, `reasons[]`, `creased`, `bled`, `hold`, `alarm`, `idleWord`.

Given `{ regletSeated, lfFlush, crlfBleed, emptyIndex, stageCheckout, autocrlfTrue, gitattributesMissing, prettierFails, gitStatusClean, cliWorktreeLf, excludeClaude, plainGitRepro }`:

- **CREASED** if the reglet seats `.gitattributes` before type and the galley stays LF
- **BLED** if empty-index stageCheckout under `core.autocrlf=true` writes CRLF into `.claude/**` + `CLAUDE.md` (#91443)
- **CRLF-BLEED** if `.claude/**` and `CLAUDE.md` are CRLF while the rest of the tree is LF
- **EMPTY-INDEX** if `git worktree add --no-checkout` leaves the worktree index empty
- **STAGE-CHECKOUT** if `createWorktree` → `stageCheckout` selective checkout includes `.claude/**` and `CLAUDE.md` but not `.gitattributes`
- **AUTOCRLF-TRUE** if Windows default `core.autocrlf=true` writes CRLF with no attributes
- **GITATTRIBUTES-MISSING** if `.gitattributes` is absent from the stage-1 path list
- **PRETTIER-FAILS** if `prettier --check .` (`endOfLine: lf`) fails on `.claude/launch.json`
- **GIT-STATUS-CLEAN** if `git status` reports the tree clean
- **CLI-WORKTREE-LF** if `EnterWorktree` / `isolation:"worktree"` stay LF
- **EXCLUDE-CLAUDE** if the full checkout uses `:(exclude).claude` and does not rewrite already-checked-out files
- **PLAIN-GIT-REPRO** if `ls-files --eol` shows `w/crlf` after selective checkout of `.claude/launch.json` and `CLAUDE.md`
- **ATTRIBUTES-IN-STAGE1-FIX** if including `.gitattributes` in stage-1 makes step 2 LF
- **AUTOCRLF-FALSE-FIX** if `-c core.autocrlf=false` makes step 2 LF
- **HAS-CLEAR-REPRO** if mortenklungland-ai filed #91443; has repro; Windows; area:desktop
- **HOLD** if the reglet is seated (LF flush; agent files uncreased)

This is a diagnostic scoring bench. Not an exploit. No payloads. Score whether the strip is creased or bled.

Primary: [anthropics/claude-code#91443](https://github.com/anthropics/claude-code/issues/91443). Cousins (cite only, not primaries): [#91405](https://github.com/anthropics/claude-code/issues/91405) Caisson worktree pool wrong rebind; [#88747](https://github.com/anthropics/claude-code/issues/88747) absolute core.hooksPath; [#86010](https://github.com/anthropics/claude-code/issues/86010) detached window image viewer; [#91438](https://github.com/anthropics/claude-code/issues/91438) detached preview dead-click.

Hypothesis only (NON-BINDING): Desktop may optimize spawn latency with stage-1 selective checkout before attributes land. Do not claim source you have not seen beyond the issue's measured repro.

NOT leftover woodworking / mm-slider / millrace / locksmith / campanology / berth clones. Product name stays Reglet. Do not rename to Reliquary / Annunciator / Caisson / Spindle / Knell / Tumbler / Escapement / Geneva / Scotch / Fibula / Virgule / Riddle / Garner / Pintle / Carillon / Postern / Sluice / Alidade / Cockade / Lye / Clew / Hasp / Berth / Bollard / Reveille / Callboard.

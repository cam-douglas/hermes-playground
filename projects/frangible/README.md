# Frangible

A **wax-seal atelier / frangible glass ampule / shear-pin bench booth** — a *frangible* is a deliberately breakable seal. Wax, glass ampule, or shear-pin snaps so the gate opens. Ironic for an unintended fail-open: the deny-guard should stay **armed**; instead the pin shears and the tool proceeds. Fonts **Cinzel** (display) + **Manrope** (body) + **IBM Plex Mono** (mono). Palette: deep indigo seal-ink `#1E1740`, warm wax amber `#E09A3A`, cream parchment `#F6EFD8`, cracked-glass cyan `#3DD6D0`, bench `#120E28`. Fresh trio. Completely different UI/UX/metaphor — wax press / glass ampule / shear-pin vise / warning slip. NOT a hotel door-plate. NOT a lacquer nesting doll. NOT a night blotter. NOT an enrollment desk. NOT a type-foundry. NOT a neurology desk. NOT a gauntlet/lictor/lychgate/ouster/proscription booth.

The seal should stay **armed** (HOLD: hook file is executable; deny guard fires; tool does not proceed). Instead the booth was **frangible** after a **chmod-failopen**.

Primary:

- [anthropics/claude-code#94362](https://github.com/anthropics/claude-code/issues/94362) (OPEN). Title: `[BUG] PreToolUse hook without the executable bit fails open: deny guards silently stop guarding, one Permission denied warning per tool call`. Labels: bug, has repro, platform:macos, area:security, area:hooks. Environment: Claude Code 2.1.270; macOS 26.6.2 (Darwin 25.6.0), arm64, zsh. A PreToolUse hook whose command file is not executable (chmod 644) cannot be spawned. Claude Code treats that as a **non-blocking** failure, so the tool call proceeds — including when the hook's job is `permissionDecision: "deny"`. Guard is off. Only signal is a two-line "Permission denied" warning once per tool call forever (never names chmod +x). stream-json emits no PreToolUse hook_started/hook_response. Same settings + prompt with chmod 755 correctly denies. Stay off Nameplate/Matryoshka/Dragnet/Matricula/Allograph/Agraphia/Gauntlet/Lictor/Lychgate/Ouster/Proscription/Frisket/Scant paradigms.

07:50 frangible: a wax-seal atelier / frangible glass ampule / shear-pin bench booth for #94362. PreToolUse deny-guard fails open when the hook file lacks +x (chmod 644); Claude Code treats spawn failure as non-blocking so the tool proceeds, including when the hook's job is permissionDecision: "deny"; warning is a two-line Permission denied that never names chmod +x; stream-json emits no PreToolUse hook_started/hook_response. Idle **armed** / seeded **frangible** / path **chmod-failopen**. Score frangible or admit armed.

Score frangible or admit armed.

Idle word: **armed** (HOLD: hook file is executable; deny guard fires; tool does not proceed). HOLD aliases: sealed, latched, guarded, executable, bit-set, +x. Seeded word: **frangible** / #94362 (the chmod-failopen path). Path word: **chmod-failopen**. Product score: **frangible**. Never idle affixed / unpacked / scoped / enrolled or seeded Nameplate / Matryoshka / Dragnet or path header-rename / subst-nest / root-find / reload-blind / win-posix-mismatch.

Phrase: **Score frangible or admit armed.**

- **armed** = IDLE HOLD: hook file is executable; deny guard fires; tool does not proceed
- **frangible** = seeded path / product score: wax seal snaps so the deny-guard fails open
- **chmod-failopen** = path word
- **hold** = HOLD alias for idle armed
- **sealed** = HOLD alias: wax stamp holds
- **latched** = HOLD alias: pin stays latched
- **guarded** = HOLD alias: deny-guard still on
- **executable** = HOLD alias: +x set
- **bit-set** = HOLD alias: executable bit set
- **+x** = HOLD alias: chmod +x
- **spawn-denied** = `/bin/sh: /path/to/guard.py: Permission denied`; hook never starts
- **warning-only** = two-line Permission denied once per tool call forever; never names chmod +x
- **stream-silent** = stream-json emits no PreToolUse hook_started/hook_response
- **fail-open** = tool proceeds; REPRO_MARKER; deny never happens
- **chmod-644** = file exists and is readable but lacks +x
- **chmod-755** = positive control mode; DENIED BY GUARD
- **permission-deny** = hook job is permissionDecision: deny
- **landing** = wax-seal atelier / glass ampule / shear-pin bench
- **has-repro** = published shape: 2.1.270 macOS
- **cousins** = same fail-open family, different trigger — cite-only #67147 #65378 #76808 #88578 — do not rebuild; do not conflate
- **backups** = cite-only #93924 #93770 #93777 #94151 #94348 #94349 — do not auto-pick
- **fixtures** = wax press / glass ampule
- **walk** = published idle armed → chmod-failopen → frangible
- **closed** = #94362 remains OPEN — cite only; not this booth

Verdicts: armed, frangible, chmod-failopen, hold, sealed, latched, guarded, executable, bit-set, +x, spawn-denied, warning-only, stream-silent, fail-open, chmod-644, chmod-755, permission-deny, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **frangible** or already **armed**. Fixtures use the issue's published incident only. Chmod-failopen rows are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): A PreToolUse hook whose command file is not executable cannot be spawned. Claude Code reports that as a non-blocking failure, so the tool call proceeds — including when the hook's entire job is `permissionDecision: "deny"`. The warning names `/bin/sh` and Permission denied but never the cause (chmod +x). A safety control that cannot be executed should not fail open. Invite verify against #94362 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94362](https://github.com/anthropics/claude-code/issues/94362)
- Cousins: same fail-open family, different trigger (search — do NOT rebuild / do NOT conflate): #67147 (deleted session cwd → posix_spawn ENOENT), #65378 (same family, ENOENT), #76808 (same family, different trigger), #88578 (Windows backslash paths → hook never executes, silently). None of them covers a hook file that exists and is readable but lacks `+x`.
- Backups (data only; next focus only — do not auto-pick): #93924, #93770, #93777, #94151, #94348, #94349 (Nameplate — do not rebuild)

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:security, area:hooks
- Environment: Claude Code 2.1.270; macOS 26.6.2 (Darwin 25.6.0), arm64, zsh
- PreToolUse hook command file chmod 644 cannot be spawned
- Claude Code treats that as a non-blocking failure
- Tool call proceeds, including when the hook's job is `permissionDecision: "deny"`
- Only signal: two-line Permission denied warning once per tool call forever
- Warning never names chmod +x
- stream-json emits no PreToolUse hook_started/hook_response
- Same settings + prompt with chmod 755 correctly denies (DENIED BY GUARD)
- Losing +x is ordinary: committed 100644, cp, editor rewrite, unzip, rsync without -p

Problem found: CHMOD-FAILOPEN — deny-guard fails open when the hook file lacks +x.

Why Frangible: A *frangible* is a deliberately breakable seal / shear-pin / wax stamp that snaps so the gate opens. The deny-guard should stay armed. Instead the pin shears and the tool walks through. Nameplate/#94349 was a hotel door-plate / header-rename — DIFFERENT. Matryoshka/#94350 was a lacquer nesting-doll / subst-nest — DIFFERENT. Dragnet/#94064 was a night blotter / root-find — DIFFERENT. This booth is specifically chmod-failopen on a PreToolUse deny-guard that cannot execute — different problem, UI, UX, metaphor. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: interactive educational booth that scores idle **armed** / seeded **frangible** / path **chmod-failopen** so the failure mode is legible. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A PreToolUse hook that can return deny is a safety control; if it cannot be executed the tool must not proceed
2. chmod 644 / missing +x must not fail open when the hook's job is permissionDecision: deny
3. Same settings + prompt with chmod 755 is the published positive control
4. The warning must name the actual cause: hook command is not executable — chmod +x <path>
5. Warn once per session per hook, not once per tool call forever
6. stream-json must emit hook_started / hook_response for PreToolUse

## Why not a clone

This is specifically: **PRETOOLUSE DENY-GUARD FAILS OPEN WHEN THE HOOK FILE LACKS +X (CHMOD 644); CLAUDE CODE TREATS SPAWN FAILURE AS NON-BLOCKING SO THE TOOL PROCEEDS, INCLUDING WHEN THE HOOK'S JOB IS `permissionDecision: "deny"`; WARNING NEVER NAMES CHMOD +X; STREAM-JSON SILENT ON PRETOOLUSE.**

Novel paradigm: wax-seal atelier / frangible glass ampule / shear-pin bench — indigo, wax amber, parchment, cracked-glass cyan. New issue, new paradigm (chmod-failopen), new UI/UX/fonts/colors, new scoring vocabulary. A breakable seal, not a hotel door-plate, nesting-doll workshop, night blotter, enrollment desk, type-foundry ledger, neurology clinic, tilting-yard glove, purple fasces aisle, parish porch, bailiff desk, or Roman tablet.

**NOT Nameplate/#94349** (header-rename). Different defect. NOT hotel door-plate. Do not reuse affixed / Nameplate / header-rename.

**NOT Matryoshka/#94350** (subst-nest). Different defect. NOT lacquer nesting-doll. Do not reuse unpacked / Matryoshka / subst-nest.

**NOT Dragnet/#94064** (root-find). Different defect. NOT night blotter. Do not reuse scoped / Dragnet / root-find.

**NOT Matricula/#93987** (reload-blind). Different defect. NOT enrollment desk. Do not reuse enrolled / Matricula / reload-blind.

**NOT Allograph/#94256** (win-posix-mismatch). Different defect. NOT type-foundry / punchcutter. Do not reuse equated / Allograph / win-posix-mismatch.

**NOT Agraphia/#94251** (pre-tool-omit). Different defect. NOT clinical writing-desk. Do not reuse penned / Agraphia / pre-tool-omit.

**NOT Gauntlet/#94029** (attach-mouse). Different defect. NOT tilting-yard / iron glove. Do not reuse ungloved / Gauntlet / attach-mouse.

**NOT Lictor/#94053** (picker-bypass). Different defect. NOT purple fasces aisle. Do not reuse attested / Lictor / picker-bypass.

**NOT Lychgate/#94059** (bg-task-stale). Different defect. NOT parish porch. Do not reuse reaped / Lychgate / bg-task-stale.

**NOT Ouster/#94221** (inherited-worktree-yank). Different defect. NOT Georgian bailiff desk. Do not reuse tenanted / Ouster / inherited-worktree-yank.

**NOT Proscription/#94202** (deny-list-hollow). Different defect. NOT Roman wax-tablet forum. Do not reuse barred / Proscription / deny-list-hollow.

**NOT Frisket.** Different catalog paradigm. Do not reuse Frisket.

**NOT Scant.** Different catalog paradigm. Do not reuse Scant.

Live: https://hermes-playground-green.vercel.app/frangible/

```
node --test projects/frangible/frangible.test.mjs
node projects/frangible/frangible.mjs projects/frangible/data/frangible.json
```

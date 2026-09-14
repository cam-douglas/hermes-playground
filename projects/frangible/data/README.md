# Frangible fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94362 issue facts: a PreToolUse hook whose command file is not executable (chmod 644) cannot be spawned; Claude Code treats that as a non-blocking failure so the tool proceeds — including when the hook's job is `permissionDecision: "deny"`. Only signal is a two-line Permission denied warning that never names chmod +x. stream-json emits no PreToolUse hook_started/hook_response. Same settings + prompt with chmod 755 correctly denies. Score frangible or admit armed.

Idle word: **armed**. Path word: **chmod-failopen**. Seeded loss: **frangible**. Product: **frangible**. HOLD: **armed**. ALARM: **frangible** / **chmod-failopen** / **spawn-denied**. Primary: [anthropics/claude-code#94362](https://github.com/anthropics/claude-code/issues/94362).

Fixtures record the published incident only. Chmod-failopen rows are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `armed.json` | armed | Idle seal. HOLD: hook file is executable; deny fires. |
| `hold.json` | hold | HOLD alias for idle armed. |
| `frangible.json` | frangible | Seeded #94362 path and product. ALARM: seal snaps; fail-open. |
| `94362.json` | frangible | Same seeded path under the issue number. |
| `chmod-failopen.json` | chmod-failopen | Path: +x missing; spawn non-blocking; gate opens. |
| `sealed.json` | sealed | HOLD alias: wax stamp holds. |
| `latched.json` | latched | HOLD alias: pin stays latched. |
| `guarded.json` | guarded | HOLD alias: deny-guard still on. |
| `executable.json` | executable | HOLD alias: +x set. |
| `bit-set.json` | bit-set | HOLD alias: executable bit set. |
| `plus-x.json` | +x | HOLD alias: chmod +x. |
| `spawn-denied.json` | spawn-denied | /bin/sh Permission denied; hook never starts. |
| `warning-only.json` | warning-only | Two-line warning once per tool call forever. |
| `stream-silent.json` | stream-silent | No PreToolUse hook_started/hook_response. |
| `fail-open.json` | fail-open | Tool proceeds; REPRO_MARKER. |
| `chmod-644.json` | chmod-644 | File mode lacks +x. |
| `chmod-755.json` | chmod-755 | Positive control mode. |
| `permission-deny.json` | permission-deny | Hook job is permissionDecision deny. |
| `landing.json` | landing | Wax-seal atelier / glass ampule / shear-pin bench. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only same fail-open family. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Wax press / glass ampule. |
| `walk.json` | walk | Published idle armed → chmod-failopen → frangible. |
| `closed.json` | closed | #94362 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Same fail-open family, different trigger — do NOT rebuild. Do NOT conflate. None of them covers a hook file that exists and is readable but lacks `+x`.

#67147 — fail-open when session cwd is deleted (`posix_spawn` ENOENT). DIFFERENT trigger.

#65378 — same fail-open family, deleted-cwd / ENOENT. DIFFERENT trigger.

#76808 — same fail-open family, different trigger. DIFFERENT.

#88578 — Windows backslash paths → hook never executes, silently. DIFFERENT trigger.

#94362 is specifically: PreToolUse deny-guard fails open when the hook file lacks `+x` (chmod 644); warning never names chmod +x; stream-json silent on PreToolUse.

## Backups (cite only — do NOT auto-pick or build)

#93924 #93770 #93777 #94151 #94348 #94349 (Nameplate — do not rebuild)

Drop any file onto `projects/frangible/index.html`. Buttons load the seeded path. The armed page admits **armed** / idle seal / #94362.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

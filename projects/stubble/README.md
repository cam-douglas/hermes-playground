# Stubble

A **harvested stubble field / scorched chaff furrow** — cut wheat stubs, charcoal ash soil, amber chaff motes, dusk sky — Fraunces + Sora + JetBrains Mono — for a real Claude Code defect: **WRITE EMITS A `.CMD` AS UTF-8 + LF-ONLY ON WINDOWS; CMD.EXE (CP932) SWALLOWS THE LF AFTER A MULTIBYTE CHAR; `del /F /Q "%VAR%"` DEGENERATES TO `del /F /Q ""` AND DELETES EVERY FILE IN THE CWD.**

Primary:

- [anthropics/claude-code#92328](https://github.com/anthropics/claude-code/issues/92328) (OPEN, bug, has repro, platform:windows, area:tools, high-priority, data-loss). Title: `[BUG] Write emits .cmd as UTF-8 + LF-only on Windows; cmd.exe (CP932) swallows the LF after a multibyte char, del /F /Q "%VAR%" degenerates to del /F /Q "" and deletes every file in the CWD`. Filed 2026-09-05. Reporter: ringo79.

23:50 stubble: a stubble field that lets Write sow a UTF-8 LF .cmd under CP932 is not a standing crop — it is already razed. Score the furrow or admit the CWD already stubbled.

Idle word: **standing**. Seeded state: **razed** / #92328 — Write UTF-8 LF `.cmd`; rem `。` (U+3002 = E3 80 82); 0x82 swallows 0x0A; `set` absorbed; empty del; 1,068 FILE_DELETE|CLOSE. Never idle as once, doubled, stuck, missed, spilled, hushed, blurted, single, maculed, or any prior catalog idle.

**Stubble** is the cut field that should still be a standing crop after Write sows a helper `.cmd`. Here cmd.exe reads the generated UTF-8 LF file as OEM CP932, so a trailing ideographic full stop on a rem line eats the line feed. The variables never set. The delete expands empty. The CWD is already razed.

- **standing** = HOLD: CRLF (or no swallow) keeps rem closed; WORK is set; files remain
- **razed** = #92328: UTF-8 LF `.cmd` under CP932; empty del; CWD wiped
- **swallowed** = 0x82 consumed 0x0A; next `set` stays inside rem
- **empty-del** = `%WORK%` unset; expansion is `del /F /Q ""`
- **crlf-healed** = only line endings changed; isolated 3/3 files remain
- **stubbled** = 1,068 FILE_DELETE|CLOSE; 0 RENAME; folders remain as stubs
- **lead-byte** = decisive rem tail E3 80 82; last byte 0x82 is a CP932 lead

Verdicts: standing, razed, swallowed, empty-del, crlf-healed, stubbled, lead-byte.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real deletes. Score whether the furrow is standing or already razed. Fixtures use diagnostic shapes only (UTF-8 hex of the published 5-line repro, CP932 lead-byte annotation, OEMCP=932 hive shape, USN counts). The desk simulates `del /F /Q ""` expansion. It never runs cmd.exe and never deletes files.

Hypothesis only (NON-BINDING): cmd.exe OEM DBCS parsing + LF-only generated `.cmd` is the wipe path. The issue's control (CRLF only) makes the bug disappear. Do not claim source beyond the issue body. Discard if evidence disagrees.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92328](https://github.com/anthropics/claude-code/issues/92328)

What happened (from the issue — do not invent):

- Environment: Claude Code 2.1.224; Windows 11 Pro 25H2, build 26200.9168, OSLanguage 1041; locale ja-JP; registry ACP=932, OEMCP=932; "Beta: Use Unicode UTF-8" disabled; Node v26.7.0; permission mode `normal`; launched from Cursor's integrated terminal. Console codepage at incident inferred 932 (reproduction under `chcp 932` matches recorded stdout; live `chcp` was not obtained).
- On 2026-09-05 the Write tool created and later rewrote a `.cmd` helper as UTF-8, LF-only, no BOM (generated file CR=0, LF=40). Claude Code's `.claude/file-history` pre-edit backup is also LF-only. A pre-existing hand-written `.cmd` in the same directory is CRLF + pure ASCII. This is "generated batch files don't follow the platform convention", not "Write corrupted an existing CRLF file".
- cmd.exe parses batch files using the OEM codepage. Read as CP932, the generated file has 11 offsets where a lead byte (0x81–0x9F / 0xE0–0xFC) is immediately followed by 0x0A. The decisive one is a `rem` line ending in E3 80 82 (U+3002 ideographic full stop `。`); its final byte 0x82 swallows the LF.
- The next line — `set "IDA=..."` in the original, `set "WORK=..."` in the published 5-line minimal repro — is absorbed into the rem and never executes.
- With the variables unset, `del /F /Q "%WORK%"` expands to `del /F /Q ""`. Verified in the issue with a byte-length-preserving edit (`@echo off` → `@echo on `) that printed the expanded commands: `del /F /Q ""  2>nul`.
- `del /F /Q ""` deletes every file in the current working directory (`/Q` suppresses the prompt, `/F` forces read-only files, `2>nul` hides errors). Isolated test: 3 files + 1 subdirectory → LF-only leaves 0/3 files and 1/1 subdir; CRLF leaves 3/3 files and 1/1 subdir. `del` is non-recursive, so subdirectories survive.
- The agent's CWD was the repository root (`cwd` field in the transcript). NTFS USN journal: 1,068 FILE_DELETE|CLOSE records (`reason 0x80000200`) in the same second; parent FRN = repo root; RENAME records: 0 (not moved, not recycled). 123 files were unrecoverable.
- Recorded stdout of the incident run (249 B): `'""' is not recognized as an internal or external command, operable program or batch file.` then `idat exit=9009`.
- Changing **only** the line endings to CRLF makes the bug disappear. Full original (2,294 B) LF → 0/3; same bytes CRLF → 3/3.
- Tail hexdump of the rem line (line 3 of the minimal repro), as published:

  ```
  ... E5 87 BA E3 81 99 EF BC 89 E3 80 82 | 0A
                                       ^^   ^^
                                CP932 lead   swallowed LF
  ```

- The published 5-line minimal repro must be saved UTF-8, LF-only, no BOM, line 3 ending in `。`. The issue warns the CP932 mis-read is byte-position dependent: rewriting from scratch can hide the failure; instrumenting with a length-changing edit (e.g. replacing `del /F /Q` with `echo`) also hides it.
- Any DBCS OEM codepage (949, 936, 950) should behave the same; 932 is what was tested.
- Expected: Write emits `.cmd` / `.bat` on Windows with CRLF (or preserves existing line endings); given the generated file, `set "WORK=..."` executes and `del /F /Q "%WORK%"` expands to a single specific path. Ideally Write (or Bash before executing a same-turn generated `.cmd`) warns when a `.cmd`/`.bat` contains non-ASCII while OEMCP is not UTF-8.

Suggested fixes from the issue (document only):

1. Write `.cmd` / `.bat` with CRLF on Windows, or preserve the existing file's line endings.
2. Warn when a `.cmd` / `.bat` contains non-ASCII while the OEM codepage is not UTF-8.
3. Check line endings and charset before executing a batch file generated in the same turn.

## Why not a clone

This is specifically: **Write → `.cmd` UTF-8 LF + CP932 lead-byte swallow → empty `del` wipes the CWD.**

NOT Intake ([#92305](https://github.com/anthropics/claude-code/issues/92305)) — piped stdin double-count (prompt + attachment). Stubble is not a gauge-house.
NOT Pasteboard ([#92312](https://github.com/anthropics/claude-code/issues/92312)) — Alt+V image-paste chord. Stubble is not kraft pasteboard.
NOT Spillway ([#92311](https://github.com/anthropics/claude-code/issues/92311)) — ultracode concurrency dam bypass. Stubble is not a spillway.
NOT Blurt ([#92275](https://github.com/anthropics/claude-code/issues/92275)) — TUI ECHO leak. Stubble is not CRT phosphor.
NOT Macule ([#92294](https://github.com/anthropics/claude-code/issues/92294)) — show_widget duplicate card. Stubble is not letterpress.
NOT Alarum / Portcullis / any existing catalog slug.

Different surface: Write-tool `.cmd` emission + cmd.exe OEM DBCS parse vs CLI token double-composition vs image-paste chord vs ultracode cap skip vs TUI ECHO race vs widget macule.

No cousin primary. Stay off those slugs.

Backups (document only, do not build): [#92286](https://github.com/anthropics/claude-code/issues/92286) (Cresset), [#92292](https://github.com/anthropics/claude-code/issues/92292) (Symlink), [#92321](https://github.com/anthropics/claude-code/issues/92321) (Remote Control stealth-relaunch), [#92325](https://github.com/anthropics/claude-code/issues/92325).

Product name stays **Stubble**. Do not rename to Intake, Pasteboard, Spillway, Blurt, Macule, Alarum, Portcullis or any existing catalog slug.

Different UI: harvested stubble field / scorched chaff furrow — cut wheat stubs, charcoal ash soil, amber chaff motes, dusk sky, ember-red razed, pale-stub-green standing. Fraunces + Sora + JetBrains Mono. NOT Newsreader/Figtree/IBM Plex Mono (Intake). NOT Alegreya/Source Sans/Ubuntu Mono (Pasteboard). NOT Teko/Hind/Fira Code (Spillway). NOT Syne/IBM Plex Sans (Blurt). NOT Bodoni Moda/Barlow (Macule). Stay OFF industrial gauge-house / dam spillway / CRT phosphor / letterpress / kraft pasteboard / watchtower.

Different verbs: Score the furrow, pin idle standing, pin seeded razed, admit the CWD already stubbled, load fixtures, reset to standing, heal with CRLF. Score the furrow is this desk’s phrase.

Different idle: **standing**. Different seeded: **razed**.

## Live catalog path

`/stubble/` is this static stubble-field scoring desk. Path `https://hermes-playground-green.vercel.app/stubble/` and subdomain `https://stubble.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `23:50 / hermes catalog #159 / #92328`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **razed** — Write UTF-8 LF `.cmd`; OEMCP=932; rem tail E3 80 82 | 0A; `set` absorbed; `del /F /Q ""`; USN 1,068 FILE_DELETE|CLOSE; 0 RENAME; 123 unrecoverable; agent CWD = repo root.
2. Idle **standing** → CRLF control; rem closes; WORK is set; isolated 3/3 files remain; idle word standing.
3. Desk UI: dusk field, cut stubs, chaff motes, scorched furrow hex dump, Write emission log, cmd.exe OEM decoder, USN journal tape, OEMCP registry panel, GitHub issue chip. Razed = files ember-fade, folders remain as stubs. Standing / crlf-healed = crop holds.
4. Stay-off strip: Intake / Pasteboard / Spillway / Blurt / Macule / Alarum / Portcullis. Primary stays #92328.
5. **Score the furrow** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON. Stubble simulator chips rewrite crop (standing / razed), line endings (LF / CRLF), and OEMCP (932 / UTF-8).

## How to score

Open `projects/stubble/index.html` in a browser, or serve the repo root and visit `/stubble/` (Vercel rewrite → `/projects/stubble`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/stubble/hook/README.md
```

Empty paste scores the idle **standing** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **razed**.

# Iota

Typesetter's upper/lower type-case desk for Claude Code Windows project-path identity. Two JSON keys that differ only in case (or slash direction) for the same directory. A second casing is **not** a plot. Score the keys or admit **bound**.

Idle word: **bound** (one sort, one drawer; no second casing).
NEVER use the product name iota / type-case / casing / fold / folded as the idle/state word.
NEVER use empty.
NEVER reuse prior idles: stilled, drained, flat, fit, spoilt, laid, unlinked, tight, banked, roosted, stocked, seated, heard, clear, paired, kernel, latched, upheld, sterling, home, valid, dry, sealed, quiet, seised, stabled. Do not ship Jot, Tittle, Canon, Galley, Chase, Sort, Quad, Case, Casing, Homograph, Allograph, Doppel, Twin, Alias, Glyph, Register, Ledger, Indenture, Diptych, Cadastre, Folio, or Shift.

Verdicts: **bound**, **split**, **twinned**, **hidden**, **unparseable**, **dropped**, **mixed**, **open**, **aliased**, **true**. Slack iota alarm on split / twinned / hidden / unparseable / dropped / mixed / aliased. Linear ticket on split / twinned / unparseable / dropped. GitHub iota-ledger of identity events on every scored probe.

## Why not a clone

NOT Reed (reed-relay cabinet / MCP Connected vs registered tools / four contacts).
NOT Gasket (steam flange / project-scoped `strictAllowlist` silently discarded).
NOT Larder (stillroom / plugin-store content-clock freeze).
NOT Leat (mill leat / sleep-block unbounded until-loop).
NOT Husk (threshing desk / hollow headless success envelope).
NOT Shunt / Sump / Pleat / Scant / Chad / Kist / Wraith / Damper / Cote / Tappet / Aside / Chute / Tain / Snib / Veto / Assay / Wicket / Sigil / Stencil / Suture / Blot / Coda / Fathom / Hasp / Parity / Reveille / Quench / Scrim / Knock.
NOT leftover woodworking / millimetre-slider clones. A type-case is a compositor's metaphor for a diagnostic desk, not a leftover instrument.
Do NOT ship Jot, Tittle, Canon, Galley, Chase, Sort, Quad, Case, Casing, Homograph, Allograph, Doppel, Twin, Alias, Glyph, Register, Ledger, Indenture, Diptych, Cadastre, Folio, or Shift as alternate product names this hour. Product name is **Iota** only.

Different problem: one physical directory, many case/slash spellings used as case-sensitive JSON keys.
Different UI: typesetter's upper/lower type-case desk / two drawers for one sort / composing stick / proof sheet / ink / lead / oak. Warm paper, lamp-black ink, type-metal, vermilion proof marks. NOT millrace water. NOT railway night yard. NOT basement pit. NOT tailor board. NOT timber yard. NOT ballot. NOT coffin. NOT steam flange. NOT dove-cote. NOT chimney. NOT stillroom. NOT theatre wing. NOT reed cabinet.
Different idle word: **bound**.

## Live catalog path

`/iota/` is this static type-case. Upper drawer, lower drawer, composing stick, proof sheet. Demo works with no secrets and no npm. Mark: `09:50 Sydney · iota`.

1. Seeded `#90438` **split** is already on the case: `.claude` vs `.Claude`; DuplicateKeysInJsonString; mcp add landed on Project1 while the session read project1 → **split** (cluster twinned / hidden / unparseable).
2. Switch **twinned** — two spellings of one directory (`qoreai` vs `QoreAI`) → **twinned**.
3. Switch **hidden** — mcp add wrote Project1; session read project1; server silently absent → **hidden**.
4. Switch **unparseable** — ConvertFrom-Json throws DuplicateKeysInJsonString → **unparseable**.
5. Switch **dropped** — 32 permissions.allow ignored; drive letter C: vs c: → **dropped**.
6. Switch **mixed** — installed_plugins.json mixed-case duplicates → **mixed**.
7. Switch **open** — headersHelper looks up a forward-slash key; trust dialog wrote a backslash → **open**.
8. Switch **aliased** — same path, only slash direction changes the gate → **aliased**.
9. Switch **true** — one directory, one key, write matches read → **true**.
10. Switch **Bail · bound** — one sort, one drawer, nothing scored → **bound**. Idle word is **bound** when the probe is idle.
11. **Score** scores. **Bail** returns idle bound. **Case** shows the #90438 split drawer. Admit does not lie: a split probe stays split.

## Hook

`projects/iota/hook/` scores a probe `{ keys, mcpWriteKey, sessionReadKey, mcpAbsent, trustWriteKey, trustLookupKey, helperRan, permissionsAllow, permissionsHonored, pluginsKeys, parseError, filesystemCaseInsensitive, doeFoldsSeparators, doeFoldsDriveCase, conversationsEmpty, mergedResplit, observed, session, source, issue, scored }` and returns `{ verdict, reasons[], cluster[], bound, split, twinned }`. See `hook/README.md`.

```bash
node projects/iota/hook/index.mjs --listen 9090
node --test projects/iota/hook/iota.test.mjs
```

## Evidence (do not invent more)

Primary:

- [anthropics/claude-code#90438](https://github.com/anthropics/claude-code/issues/90438) — filed 2026-08-28, open. Version 2.1.251. Windows `~/.claude.json` accumulates project keys that differ only in case. Exact keys: `C:/Users//.claude/projects/Project1` vs `C:/Users//.Claude/projects/Project1`. DuplicateKeysInJsonString. mcp add landed on Project1 while the session read project1. Five keys for two real directories.

Corroboration (cite as shape, not a new primary):

- [anthropics/claude-code#75855](https://github.com/anthropics/claude-code/issues/75855) — open. Drive-letter case not canonicalized (C: vs c:). doe() folds separators but not drive case. Trust silently dropped; 32 permissions.allow ignored.
- [anthropics/claude-code#90041](https://github.com/anthropics/claude-code/issues/90041) — open, has repro. headersHelper looks up a forward-slash key; trust dialog writes a backslash. Helper never runs.
- [anthropics/claude-code#85344](https://github.com/anthropics/claude-code/issues/85344) — open. `D:\repos\qoreai\jupyter` vs `D:\repos\QoreAI\jupyter`. Merged entries re-split on shutdown.
- [anthropics/claude-code#88418](https://github.com/anthropics/claude-code/issues/88418) — open. One directory stored under up to three path spellings.
- [anthropics/claude-code#76994](https://github.com/anthropics/claude-code/issues/76994) — open. CLI and VS Code sessions silently see different config for the same folder.
- [anthropics/claude-code#80264](https://github.com/anthropics/claude-code/issues/80264) — open. Case-insensitive filesystems: differently-cased launch paths create duplicate project entries.
- [anthropics/claude-code#84354](https://github.com/anthropics/claude-code/issues/84354) — open. Past Conversations appears empty due to case-sensitive project-path hashing on Windows.

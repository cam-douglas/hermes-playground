# Dinkus

A **compositor's dinkus / hairline-rule bench** — cool slate desk, zinc chase, vermilion dinkus mark, cream galley slip; Zilla Slab + Atkinson Hyperlegible + JetBrains Mono — for a real Claude Code defect: **PLUGIN SETTINGS FRONTMATTER PARSER TREATS EVERY `---` AS A SED RANGE DELIMITER SO BODY HORIZONTAL RULES LEAK INTO FRONTMATTER AND SILENTLY DISABLE PLUGINS.** When a hypothetical closed folio requires opening `---` on line 1 and quits at the first close, the chase is **closed**.

Primary:

- [anthropics/claude-code#92798](https://github.com/anthropics/claude-code/issues/92798) (OPEN, bug, has repro, area:plugins). Title: `[BUG] parse-frontmatter.sh returns body content as frontmatter when the markdown body contains ---`. Filed 2026-09-08T07:25:28Z.

17:50 dinkus: a compositor's hairline-rule bench that should keep plugin-settings frontmatter closed at the first ---; instead sed ranges reopen on body horizontal rules so enabled:false leaks and plugins take the silent disabled path; score leaked or admit closed.

Score leaked or admit closed.

Idle word: **bound** (HOLD: frontmatter stops at the first closing `---`; body hairlines stay in the body). #92798 path: **leaked**. Admit word: **closed**. Never idle as matched, orphaned, keyed, dripping, arrested, credited, chorded, flattened, meshed, piped, swallowed, unbound, berthed, lean, attentive, waived, bricked, unrung, echoed, laden, deaf, shed, remounted, refused, imprinted, scored, voided, banked, rewritten, cold, seeded, drained. Never use those as the #92798-path word either.

**Dinkus** = the compositor's section-break ornament (`***` / markdown `---`) that should stay in the *body*, not reopen the folio's frontmatter chase.

- **bound** = IDLE: HOLD; frontmatter stops at the first closing `---`; body hairlines stay in the body
- **leaked** = #92798 path: sed range reopens on body `---`; body keys bleed into frontmatter
- **closed** = admit hold: parser requires opening `---` on line 1 and quits at first close; body rules cannot reopen
- **sed-range-reopen** = `sed -n '/^---$/,/^---$/{ /^---$/d; p; }'` reopens every time the start pattern matches again
- **body-hr-bleed** = a horizontal rule in the body makes whatever follows get treated as frontmatter
- **enabled-true-false-concat** = published repro returns `true\nfalse` for `enabled`
- **silent-disabled-path** = help-style `ENABLED=$(... enabled)` compare against `"true"` fails; disabled path with nothing printed
- **false-as-missing** = `enabled: false` errors as field not found (`[ -z "$VALUE" ]`)
- **validate-hr-count** = Check 3 counts any `---` (2+ passes with no frontmatter); Check 7 warns boolean on leaked multi-line; Check 8 drops body rules from the body line count
- **cousins** = cite-only #52755 CLOSED, #44901 CLOSED, #19377 CLOSED; primary stays #92798
- **has-clear-repro** = issue labeled has repro

Verdicts: bound, leaked, closed, sed-range-reopen, body-hr-bleed, enabled-true-false-concat, silent-disabled-path, false-as-missing, validate-hr-count, has-clear-repro, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. No network to Anthropic. Score whether a settings file with a body hairline would leave the chase **leaked** or already **closed**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): sed address ranges restart on every `/^---$/` match so body horizontal rules reopen frontmatter extraction. Verify against issue text only; do not claim unread source. The Sagexd08 fix branch is cited on the issue — do NOT implement that fix in anthropics/claude-code; this catalog product only reconstructs the published diagnostic.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92798](https://github.com/anthropics/claude-code/issues/92798)
- Cousins cite-only (NOT primary): [anthropics/claude-code#52755](https://github.com/anthropics/claude-code/issues/52755) CLOSED — Markdown horizontal rule (`---`) renders like a user interruption divider (TUI, different shape). [anthropics/claude-code#44901](https://github.com/anthropics/claude-code/issues/44901) CLOSED — Plugin output styles docs omit `keep-coding-instructions` frontmatter support (docs, different shape). [anthropics/claude-code#19377](https://github.com/anthropics/claude-code/issues/19377) CLOSED — `paths:` frontmatter syntax in rules files is incorrect (docs, different shape).

What happened (from the issue body — do not invent):

- Scripts in `plugins/plugin-dev/skills/plugin-settings/scripts/` extract frontmatter with `sed -n '/^---$/,/^---$/{ /^---$/d; p; }'`
- A sed range reopens every time the start pattern matches again, so any `---` further down the file starts a second range
- A horizontal rule in the body makes whatever follows get treated as frontmatter
- Reporter hit this because a settings file had a `---` separator in the docs section; the plugin kept coming up disabled even though `enabled: true` was at the top
- Repro file `.claude/my-plugin.local.md`: frontmatter `enabled: true`, then body docs with `---` and `enabled: false`
- `./parse-frontmatter.sh .claude/my-plugin.local.md enabled` returns `true\nfalse`
- Expected: `true`. Frontmatter is the block between the first two `---` markers
- Help-style `ENABLED=$(... enabled)` compare against `"true"` fails → plugin takes the disabled path with nothing printed
- Also in `parse-frontmatter.sh`: `enabled: false` errors as field not found (`[ -z "$VALUE" ]`); field name goes into grep as a regex (dotted keys match similarly-named keys); missing closing `---` runs to EOF with no error
- Also in `validate-settings.sh`: Check 3 counts `---` anywhere and passes if there are 2+ (no-frontmatter file with two body rules validates); Check 7 warns boolean on a leaked multi-line value; Check 8 skips every `---` when finding the body so the "body present (N lines)" count comes out short
- Environment: repo at `main` (ab9b2cf); in the scripts themselves, not tied to a particular CLI version
- Filed 2026-09-08T07:25:28Z; labels bug, has repro, area:plugins; OPEN
- Reporter: Sagexd08
- Cited fix branch (do not implement here): https://github.com/Sagexd08/claude-code/tree/fix/parse-frontmatter-range — requires opening `---` on line 1 and quits at the first closing

Problem found: PLUGIN SETTINGS FRONTMATTER PARSER TREATS EVERY `---` AS A SED RANGE DELIMITER SO BODY HORIZONTAL RULES LEAK INTO FRONTMATTER AND SILENTLY DISABLE PLUGINS.

Why this solution: a diagnostic scorer for the bound → leaked / closed chase chain, so a reader can pin idle bound, load the #92798 leaked path, and score sed-range-reopen / body-hr-bleed / enabled-true-false-concat / silent-disabled-path / false-as-missing / validate-hr-count / cousins against the published facts.

## Why not a clone

This is specifically: **PLUGIN SETTINGS FRONTMATTER PARSER TREATS EVERY `---` AS A SED RANGE DELIMITER SO BODY HORIZONTAL RULES LEAK INTO FRONTMATTER AND SILENTLY DISABLE PLUGINS**.

**NOT Homonym/#92787** (Desktop UUID connector mounts — already shipped). Do not touch Homonym.

**NOT Clepsydra/#92776** (OTel token.usage mid-session arrest — already shipped). Do not touch Clepsydra.

**NOT Rushlight/#92784** (session-scoped TCC AppData — already shipped). Do not touch Rushlight.

**NOT Letoff/#92771** (libuv Shift+Enter flatten — already shipped). Do not touch Letoff.

**NOT Espagnolette/#92694** (AskUserQuestion keys). **NOT Cribble/#92684**. **NOT Springe/#92675**.

NOT a generic markdown linter. NOT a live Claude session. NOT an exploit against parse-frontmatter.sh.

Different paradigm: **every body `---` reopens the sed frontmatter range; `enabled: false` in the docs concatenates; the plugin goes disabled with no error**.

Cousins cite-only (NOT primary): #52755 CLOSED, #44901 CLOSED, #19377 CLOSED. Do not auto-pick as thesis.

Backups cite in this README only — do NOT auto-pick as primary: [anthropics/claude-code#92788](https://github.com/anthropics/claude-code/issues/92788) (AskUserQuestion free-text discard), [anthropics/claude-code#92761](https://github.com/anthropics/claude-code/issues/92761) (worktree plugin row order), [anthropics/claude-code#92801](https://github.com/anthropics/claude-code/issues/92801) (workspace trust not persisted).

Do NOT rename this product Homonym, Clepsydra, Rushlight, Letoff, Espagnolette, Cribble, or Springe.
Do NOT reuse idle matched / orphaned / keyed / dripping / arrested / credited / chorded / flattened / meshed / piped / swallowed / unbound / berthed / lean / attentive / waived / bricked / unrung / echoed / laden / deaf / shed / remounted / refused / imprinted / scored / voided / banked / rewritten / cold / seeded / drained.

Different surface: plugin-settings sed frontmatter range vs Desktop UUID connector mounts / OTel meter arrest / session-scoped TCC / libuv Shift+Enter flatten / AskUserQuestion dead keys.

Product name stays **Dinkus**. Name/slug `dinkus` confirmed unused in catalog.json (222 products before this ship; Homonym is #222).

Different UI: compositor ink-shop / hairline-rule bench / zinc chase / vermilion dinkus / cream galley slip / cool slate desk. Zilla Slab / Atkinson Hyperlegible / JetBrains Mono. NOT Fraunces / Outfit / JetBrains (Homonym trio). NOT EB Garamond / Barlow / Source Code Pro (Clepsydra). NOT Petrona / Manrope / IBM Plex Mono (Rushlight). NOT Lora / Plus Jakarta / Cousine (Letoff). NOT brass/parchment twin-nameplate. NOT marble/water. NOT soot/ember sconce.

Different verbs: Score leaked, Admit closed, Pin idle bound, Load the #92798 path, Reset to bound, Load fixtures, Reopen the chase, Close the folio.

Different idle: **bound**. Different #92798 path: **leaked**. HOLD: **bound** / **closed**. ALARM: **leaked** / **sed-range-reopen** / **body-hr-bleed** / **enabled-true-false-concat** / **silent-disabled-path** / **false-as-missing** / **validate-hr-count** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/dinkus/hook/dinkus.test.mjs
node projects/dinkus/hook/dinkus.mjs projects/dinkus/data/92798.json
node projects/dinkus/hook/dinkus.mjs projects/dinkus/data/bound.json
echo '{"seed":"leaked","leaked":true}' | node projects/dinkus/hook/index.mjs
```

Open the living card at `projects/dinkus/index.html` (or the live path `/dinkus/`). Buttons: Score leaked, Admit closed, Pin idle bound, Load leaked, Load fixtures, Reset to bound. Reopen the chase. Close the folio. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/dinkus/
- Folder: `projects/dinkus/`

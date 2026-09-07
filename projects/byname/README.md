# Byname

A **herald's byname / epithet registration desk** — parchment folio, amber warning wax seal vs clear green seal, indigo ink ruling, secondary-name column vs primary namespaced column; Newsreader + Sora + IBM Plex Mono — for a real Claude Code defect: **A PLUGIN SKILL INVOKED BY ITS BARE NAME SHOWS A FALSE "ISN'T A RECOGNIZED COMMAND HERE" WARNING, THEN RESOLVES AND RUNS ANYWAY.** When the bare epithet is registered as an alias, or the warning is suppressed once resolution succeeds, the folio is **bynamed**.

Primary:

- [anthropics/claude-code#92738](https://github.com/anthropics/claude-code/issues/92738) (OPEN, bug, has repro, platform:linux, area:plugins, area:desktop). Title: `plugin skill invoked by its bare name shows a false "isn't a recognized command here" warning`. Filed 2026-09-07T21:33:00Z. Updated 2026-09-07T21:44:51Z. Reporter: artificialorctelligence. 0 comments.

07:50 byname: a herald's byname / epithet desk that should keep the folio clear when a plugin skill's bare name is submitted after autocomplete is dismissed, but instead stamps amber wax — `/orc-version isn't a recognized command here` / `only work in the Claude Code terminal` — then the command resolves and runs anyway (#92738). Score ambered or admit bynamed.

Idle word: **clear** (HOLD: no false warning; namespaced path or no bare submit). Seeded state: **ambered** / #92738. Admit word: **bynamed**. Never idle as bricked, unrung, porous, slipped, severed, misrouted, adrift, corked, latent, silted, barred, runaway, haunted, fouled, razed, culled, unanswered, stripped, quieted, cribbed, sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted. Never seeded as crenelled, quieted, cribbed, sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted, latched, staged, proved, belayed, sole, packed, roused, sighted, argbound.

**Byname** = a herald's spoken epithet — the secondary name offered beside the registered style. Autocomplete already writes the byname in parentheses. The desk stamps amber wax when that same byname is submitted without the namespaced rewrite.

- **clear** = IDLE: HOLD; no false warning; namespaced path or no bare submit
- **ambered** = seeded word / #92738 path: bare `/orc-version` after dismissing autocomplete stamps orange wax, then the command resolves and runs
- **bynamed** = admit hold: bare epithet registered as an alias, or the warning is suppressed when resolution succeeds
- **bare-submit-warns** = Code tab; type bare `/orc-version`; Escape dismiss autocomplete; Enter → orange warning then successful run
- **namespaced-clean** = accept autocomplete rewrite to `/orclab:orc-version` → no warning, same success
- **resolves-anyway** = warning is false; command resolves and runs; client-side only; nothing in logs
- **autocomplete-offers-bare** = menu displays `orclab:orc-version (orc-version)`
- **alias-missing** = exact lowercase name/alias match; warning on `!p(name)`; plugin skill entries carry only the namespaced `name`
- **misleading-terminal-copy** = i18n id `+9dhXtDFu6`; copy says some commands only work in the Claude Code terminal
- **cousins** = cite-only Advowson/#91005, Springe/#92675, Speakpipe/#92646, Muzzle/#92459, Hangfire, Aphonia, Catachresis/#92518
- **has-clear-repro** = issue labeled has repro

Verdicts: clear, ambered, bynamed, bare-submit-warns, namespaced-clean, resolves-anyway, autocomplete-offers-bare, alias-missing, misleading-terminal-copy, has-clear-repro, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a bare plugin-skill byname would leave the folio **ambered** or already **bynamed**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): Desktop slash registry validates against plugin entry `name`/`aliases` before the skill resolver that accepts bare skill names; autocomplete rewrite is the only path that inserts the namespaced name the registry knows. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92738](https://github.com/anthropics/claude-code/issues/92738)
- Cousins cite-only (NOT primary): Advowson/#91005, Springe/#92675, Speakpipe/#92646, Muzzle/#92459, Hangfire, Aphonia, Catachresis/#92518

What happened (from the issue body — do not invent):

- Claude Desktop 1.46388.2 (deb), Linux Mint 22.3, claude-code 2.1.241, local-path marketplace plugin; reporter artificialorctelligence; filed 2026-09-07T21:33:00Z; updated 2026-09-07T21:44:51Z; 0 comments
- In the Claude Desktop Code tab, invoking a plugin skill by its bare name shows an orange warning saying the command isn't recognized and that "some commands only work in the Claude Code terminal." The command then resolves and runs correctly. The warning is false, and its wording points users somewhere they don't need to go — the command works in exactly the place it claims it doesn't.
- The trigger is solely whether the submitted text is the namespaced form. Accepting the autocomplete rewrites the input to `/orclab:orc-version` and no warning appears; dismissing the menu submits the bare `/orc-version` and the warning fires. It is not timing-dependent, and it is unrelated to how the plugin is structured or named.
- The autocomplete menu itself displays the bare form as a secondary label — `orclab:orc-version (orc-version)`. The UI offers the bare name, then rejects it when it's submitted without the menu's rewrite.
- Warning text: `/orc-version isn't a recognized command here. Some commands only work in the Claude Code terminal.` i18n id `+9dhXtDFu6`. Client-side only; nothing in logs.
- Apparent check (from reporter paraphrase of minified bundle): exact lowercase name/alias match; warning on `!p(name)`. Plugin skill entries appear to carry only the namespaced `name`, so a bare-name submission fails the check even though resolution afterwards succeeds.
- Asks: either put unambiguous bare form in `aliases`, or suppress warning when resolution succeeds; also fix misleading "Claude Code terminal" copy.
- Repro: install plugin skill; Code tab; type bare `/orc-version`; Escape dismiss autocomplete; Enter → orange warning then successful run. Contrast: accept autocomplete rewrite to `/orclab:orc-version` → no warning, same success.
- Expected: no warning should appear for a command that resolves and runs.

Problem found: DESKTOP SLASH FALSE-NEGATIVE RECOGNITION ON BARE PLUGIN-SKILL BYNAME VS NAMESPACED FORM — WARNING THEN SUCCESS.

Why this solution: a diagnostic scorer for the clear → ambered / bynamed folio chain, so a reader can pin idle clear, seed ambered (#92738 path), and score bare-submit-warns / namespaced-clean / resolves-anyway / autocomplete-offers-bare / alias-missing / misleading-terminal-copy / cousins against the published facts.

## Why not a clone

This is specifically: **DESKTOP SLASH false-negative recognition on bare plugin-skill byname vs namespaced form, warning-then-success**.

**NOT Advowson/#91005** (Workflow name silently collates built-in; local workflows ignored).

**NOT Springe/#92675** (plugin PreToolUse hooks not enforced interactively).

**NOT Speakpipe/#92646** (Desktop blocks SendMessage entirely).

**NOT Muzzle/#92459** (safe-mode mutes skill log but leaks attachments).

**NOT Hangfire** (queued /compact demoted to plain prompt).

**NOT Aphonia** (roster shows names without speaking reed).

**NOT Catachresis/#92518** (MCP insufficient_scope mislabeled expired).

**NOT Crenel/#92729** (already shipped — empty-object `resources:{}` capability treated as absent). Do not touch Crenel.

Different paradigm: **DESKTOP SLASH false-negative recognition on bare plugin-skill byname vs namespaced form, warning-then-success**.

Cousins cite-only (NOT primary): Advowson/#91005, Springe/#92675, Speakpipe/#92646, Muzzle/#92459, Hangfire, Aphonia, Catachresis/#92518. Different surfaces. Do not auto-pick as thesis.

Do NOT rename this product Advowson, Springe, Speakpipe, Muzzle, Hangfire, Aphonia, Catachresis, or Crenel.
Do NOT reuse idle bricked / unrung / porous / slipped / severed / misrouted / adrift / corked / latent / silted / barred / runaway / haunted / fouled / razed / culled / unanswered / stripped / quieted.
Do NOT reuse seeded crenelled / quieted / cribbed / sprung / remoored / addressed / reaped / relayed / flushed / drained / admitted / latched / staged / proved / belayed / sole / packed / roused / sighted / argbound.

Different surface: DESKTOP SLASH false-negative on bare plugin-skill byname vs silent workflow collation / plugin-native PreToolUse interactive slip / Desktop SendMessage ban / safe-mode attachment leak / queued compact demotion / roster-without-reed / MCP insufficient_scope mislabel / empty-object resources capability treated as absent.

Product name stays **Byname**. Name/slug `byname` confirmed unused in catalog.json (212 products before this ship; Crenel is #212).

Different UI: herald's byname / epithet registration desk / parchment folio / amber warning wax seal vs clear green seal / indigo ink ruling / secondary-name column vs primary namespaced column. Newsreader / Sora / IBM Plex Mono. NOT Ibarra Real Nova / Plus Jakarta / Geist Mono (Crenel). NOT Cardo / Public Sans / Fragment Mono (Quietus). NOT Young Serif / Karla (Cribble). NOT Bodoni Moda / Nunito Sans (Springe). NOT Cormorant / Karla violet-wax (Advowson). NOT dusk battlement. NOT death-knell ledger. NOT mill sieve. NOT trapper springe.

Different verbs: Score ambered, Admit bynamed, Pin idle clear, Seed ambered, Reset to clear, Load fixtures, Dismiss the byname, Accept the style.

Different idle: **clear**. Different seeded: **ambered**. HOLD: **clear** / **bynamed**. ALARM: **ambered** / **bare-submit-warns** / **namespaced-clean** / **resolves-anyway** / **autocomplete-offers-bare** / **alias-missing** / **misleading-terminal-copy** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/byname/hook/byname.test.mjs
node projects/byname/hook/index.mjs projects/byname/data/92738.json
echo '{"seed":"ambered","ambered":true}' | node projects/byname/hook/index.mjs
```

Open the living card at `projects/byname/index.html` (or the live path `/byname/`). Buttons: Score ambered, Admit bynamed, Pin idle clear, Seed ambered, Load fixtures, Reset to clear. Dismiss the byname. Accept the style. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/byname/
- Subdomain: https://byname.hermes-playground-green.vercel.app
- Folder: `projects/byname/`

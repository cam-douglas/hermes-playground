# Demesne

A **medieval demesne / manor-charter / manorial-roll booth** — oak posts, heraldic green field, parchment charter, iron ink, brass clasp, a private holding that should bind only `$HOME` and instead overbinds the whole `/home` manor. Fonts **UnifrakturMaguntia** (display) + **Epilogue** (body) + **Inconsolata** (chips). Palette: parchment `#E4D5B5`, oak `#4A3018`, heraldic green `#1A4A36`, iron ink `#161410`, moss `#3A6848`, rust iron `#7A4030`, brass `#8B7340`. Fresh trio — not the last-ten catalog faces, not Cartouche's temple trio, not Attaint's court-roll trio. NOT Cartouche/#93772. NOT Attaint/#93821. NOT Oriel/#93809. NOT Anarthria/#93782. NOT Trismus/#93823. NOT Foundling/#93889. NOT Crasis, Tessera, Mojibake, Scissel, Feoffee, Apograph, Airlock, Scotoma. Completely different UI/UX/metaphor. This is specifically: **HOME-BIND OVERREACH — BWRAP BINDS ENTIRE `/home` INSTEAD OF `$HOME`.**

The holding should stay **demesned** (HOLD: properly scoped to `$HOME`). Instead the booth was **demesne** after a **home-bind-overreach**.

Primary:

- [anthropics/claude-code#93989](https://github.com/anthropics/claude-code/issues/93989) (OPEN). Title: `bwrap sandbox for the Bash tool binds the entire /home directory, causing Permission denied on writes outside the invoking user's own home (e.g. /home/.mcp.json)`. Labels: bug, has-repro, platform:linux, area:sandbox. Created 2026-09-13. When Bash sandbox (bwrap) is active, mount setup uses `--bind /home /home` (whole directory) instead of scoping to `$HOME` (`/home/<user>`). Bind does not change ownership; `/home` is typically root:root 755. Any path that lands on bare `/home/...` (e.g. `/home/.mcp.json`) fails with `bwrap: Can't create file at /home/.mcp.json: Permission denied` even when `$HOME` is correctly `/home/<user>` in the invoking environ. Observed under `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` and `--safe-mode`. Suggested fix in the issue text only (NOT implemented here): `--bind $HOME $HOME`. Cousin cite-only: #91122 (read-only ~/.claude bind — RO mount of config dir, not overbroad /home parent). Backups cite-only (next focus only — do not auto-pick): #93770 #93777 #93811 #93924 #93925 #93954 #93967 #93957 #93987. Stay off Demesne/Cartouche/Attaint/Oriel/Anarthria/Trismus/Foundling/Crasis/Tessera/Mojibake/Scissel/Feoffee/Apograph/Airlock paradigms.

22:50 demesne: a medieval demesne / manor-charter booth for #93989. bwrap Bash sandbox binds entire /home instead of $HOME, so bare /home/.mcp.json writes Permission denied. Idle **demesned** / seeded **demesne** / path **home-bind-overreach**. Score demesne or admit demesned.

Score demesne or admit demesned.

Idle word: **demesned** (HOLD: properly scoped to `$HOME`). HOLD aliases: demesned, home-scoped, private-holding, bind-home, user-home. Seeded word: **demesne** / #93989 (the overbound /home failure). Path word: **home-bind-overreach**. Product score: **demesne**. Never idle diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary or seeded cartouche / attaint / oriel / anarthria / trismus / foundling / crased / tessellated / mojibaked / scisselled / unseised / apographed.

Phrase: **Score demesne or admit demesned.**

- **demesned** = IDLE: HOLD; bind scoped to `$HOME`; private holding stays the lord's own land
- **demesne** = #93989 seeded path and product score: `--bind /home /home` overbinds the manor
- **home-bind-overreach** = path word: charter strap slams across `/home`; private demesne is lost in the commons
- **hold** = HOLD alias for idle demesned
- **home-scoped** = HOLD alias: mount scoped to `$HOME`
- **private-holding** = HOLD alias: the lord's own land, not the commons
- **bind-home** = HOLD alias: `--bind $HOME $HOME`
- **user-home** = HOLD alias: `/home/<user>` only
- **whole-home-bind** = `--bind /home /home` wholesale
- **bare-home-write** = path lands on `/home/.mcp.json`
- **mcp-denied** = `bwrap: Can't create file at /home/.mcp.json: Permission denied`
- **root-owned-commons** = `/home` is typically root:root 755; bind does not change ownership
- **env-scrub** = observed under `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1`
- **safe-mode** = observed with `--safe-mode`
- **overbound-manor** = whole manor bound, not the private demesne
- **landing** = manor-charter landing / holding sill
- **has-repro** = published shape: Linux / CLI 2.1.224 / `--bind /home /home` / `/home/.mcp.json` denied
- **cousins** = cite-only #91122 RO `~/.claude` bind — do not conflate
- **backups** = cite-only #93770 #93777 #93811 #93924 #93925 #93954 #93967 #93957 #93987 — do not auto-pick
- **fixtures** = parchment / oak / heraldic green / iron ink / moss / rust iron / brass clasp
- **walk** = published idle demesned → home-bind-overreach → demesne

Verdicts: demesned, demesne, home-bind-overreach, hold, home-scoped, private-holding, bind-home, user-home, whole-home-bind, bare-home-write, mcp-denied, root-owned-commons, env-scrub, safe-mode, overbound-manor, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **demesne** or already **demesned**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): mount setup uses `--bind /home /home` instead of `--bind $HOME $HOME`. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93989](https://github.com/anthropics/claude-code/issues/93989)
- Cousins: #91122 cite-only (read-only `~/.claude` bind — RO mount of config dir, not overbroad `/home` parent). Do not conflate.
- Backups (data only; next focus only — do not auto-pick): #93770, #93777, #93811, #93924, #93925, #93954, #93967, #93957, #93987

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has-repro, platform:linux, area:sandbox
- Created 2026-09-13
- Claude Code CLI v2.1.224, native install, Linux (Debian/Ubuntu-based)
- Triggered with `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` and `--safe-mode`
- `$HOME` correctly set to `/home/<user>` for the whole invocation
- bwrap argv includes `--bind /home /home` — the whole directory, not `--bind $HOME $HOME`
- Result: `bwrap: Can't create file at /home/.mcp.json: Permission denied`
- Expected (issue text only): scope the home-related bind to `$HOME`

Problem found: HOME-BIND OVERREACH — BWRAP BINDS ENTIRE `/home` INSTEAD OF `$HOME`.

Why Demesne: medieval demesne is the lord's own land held for personal use, distinct from the common manor lands. The sandbox should bind the user's private demesne (`$HOME`) but instead overbinds the whole manor (`/home`), so writes that fall on the commons fail.

Why this solution: living catalog page + node diagnostic encoding idle **demesned** / seeded **demesne** / path **home-bind-overreach** so operators can score whether the booth is **demesne** or already **demesned**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Scope the sandbox's home-related bind mount to the actual `$HOME` (e.g. `--bind $HOME $HOME`)
2. Do not bind the entire `/home` parent directory wholesale
3. Writes that resolve under the invoking user's home should succeed when `$HOME` is correct
4. A path that lands on bare `/home/.mcp.json` should not be reachable via an overbroad `/home` bind
5. Bind must not expose the root-owned `/home` commons as a writable manor

## Why not a clone

This is specifically: **HOME-BIND OVERREACH — BWRAP BINDS ENTIRE `/home` INSTEAD OF `$HOME`.**

Novel paradigm: medieval demesne / manor charter / manorial roll — oak posts, heraldic green, parchment, iron ink, private holding vs commons. New issue, new paradigm (home-bind overreach), new UI/UX/fonts/colors, new scoring vocabulary.

**NOT Airlock/#93862** (sandbox socat listener race before first network call). Different defect. Do not reuse equalized / blown / socat-race.

**NOT Feoffee/#93863** (preview_start getcwd EPERM / FDA inheritance). Different defect. Do not reuse vested / unseised / preview-eperm.

**NOT Tessera/#93776-family** (macOS version-named binary path → TCC). Different defect. Do not reuse unitary / tessellated / version-path-tcc.

**NOT Cartouche/#93772** (ask-for-diagram defaults to a section-summary poster). Different defect. NOT Egyptian name-oval. Do not reuse diagrammed / cartouche / section-poster.

**NOT Attaint/#93821** (cyber-safeguard false-positive; one flag stains the session). Different defect. NOT court-roll attainder. Do not reuse unattainted / attaint / session-attainder.

**NOT Oriel/#93809** (macOS Desktop pop-out/maximised plan window does not reflow). Different defect. Do not reuse reflowed / oriel / plan-no-reflow.

**NOT Anarthria/#93782** (Wispr Flow clipboard+Ctrl+V silently dropped). Different defect. Do not reuse articulate / anarthria / dictation-paste-drop.

**NOT Trismus/#93823** (macOS UNUserNotification / XPC lock-order deadlock). Different defect. Do not reuse limber / trismus / notif-xpc-deadlock.

**NOT Foundling/#93889** (subagent lifecycle does not reap `run_in_background` Bash). Different defect. Do not reuse filiated / foundling / subagent-bash-outlive.

**NOT Crasis/#93960** (non-injective store slug). Different defect. Do not reuse injective / crased / store-slug-collide.

**NOT Mojibake/#93848** (Windows embedded CLAUDE.md UTF-8 → three U+FFFD). Different defect. Do not reuse verbatim / mojibaked / fffd-spall.

**NOT Scissel/#93915** (Windows Bash argv `-c` 8203 truncation). Different defect. Do not reuse plenary / scisselled / argv-trunc.

**NOT Apograph/#93859** (Desktop reopen forks a full transcript copy). Different defect. Do not reuse singular / apographed / reopen-fork.

**NOT Scotoma/#93744** (Stop-condition evaluator cannot see `/goal` in `<command-args>`). Different defect. Do not reuse legible / scotomized / command-args-blind.

Do NOT rename Demesne to any existing catalog slug. Catalog currently has 338 products; Demesne is #339 after Cartouche #338.
Do NOT reuse idle diagrammed / unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary or seeded cartouche / attaint / oriel / anarthria / trismus / foundling / crased / tessellated / mojibaked / scisselled / unseised / apographed.

Display here is **UnifrakturMaguntia**. Body is **Epilogue**. Mono is **Inconsolata**.

Different surface: home-bind overreach (entire `/home` vs `$HOME`) vs wrong diagram type vs session-flag contamination vs plan-window no-reflow vs dictation paste swallow.

Different UI: parchment / oak / heraldic green / iron ink / moss / rust iron / brass clasp / oak posts / manor plot / charter strap. UnifrakturMaguntia / Epilogue / Inconsolata. NOT limestone / lapis / gold. NOT parchment-red court roll.

Different verbs: Admit demesned, Score demesne, Walk home-bind-overreach, Compare demesned / demesne, Pin idle demesned, Pin seeded demesne, Pin home-bind-overreach, Open the holding.

Different idle: **demesned**. Different #93989 seeded path: **demesne**. HOLD: **demesned** / **hold**. ALARM: **demesne** / **home-bind-overreach** / **whole-home-bind** / **bare-home-write**. Path: **home-bind-overreach**.

## How to score

```bash
node --test projects/demesne/demesne.test.mjs
node projects/demesne/demesne.mjs projects/demesne/data/demesne.json
echo '{"seed":"demesne"}' | node projects/demesne/demesne.mjs
```

Open the living card at `projects/demesne/index.html` (or the live path `/demesne/`). Buttons: Admit demesned, Score demesne, Walk home-bind-overreach, Compare demesned / demesne, Pin idle demesned, Pin seeded demesne, Pin home-bind-overreach, Open the holding, Score booth. Toggle chips for: home-bind-overreach, whole-home-bind, bare-home-write, env-scrub — the score flips. Lay a fixture JSON on the parchment. `?embed=1` hides chrome.

The booth reconstructs the reporter’s `--bind /home /home` / `/home/.mcp.json` Permission denied walk from the published #93989 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/demesne/
- Folder: `projects/demesne/`

# Diabolica

An **inquisitorial / devil's-proof / parchment court / iron balance-scale / sealed-writ / candlelit-chamber booth** — chamber soot, parchment, gall ink, wax vermilion, candle flame, scale iron, sulfur. Fonts **Fraunces** (display) + **Nunito Sans** (body) + **Fira Code** (mono). Palette: chamber `#120C08`, parchment `#E8D5A8`, ink `#1C1108`, wax `#A31D2B`, flame `#E6A23C`, scale `#5A5348`, sulfur `#C9A227`. Fresh trio. NOT Sallyport/#94082. NOT Palilalia/#94041. NOT Sepulchre/#94055. NOT Sneck/#94052. NOT Drawbridge/#94049. NOT Chirograph/#94045. NOT Titulus/#94025. NOT Derelict/#93996. NOT Vestry/#94008. NOT Surfeit/#94012. NOT Phosphene/#94003. NOT Scotoma. NOT Mondegreen/#93193. NOT Postern. NOT Portcullis / Wicket / Embrasure. Completely different UI/UX/metaphor. This is specifically: **WORKTREE GATE REFUSES LINES THAT NEVER RUN GIT WHEN IT CANNOT FINISH THE NEGATIVE PROOF.**

The court should stay **innocent** (HOLD: quashed / discharged / unindicted / writ-idle). Instead the booth was **diabolica** after a **cannot-show-not-git**.

Primary:

- [anthropics/claude-code#94040](https://github.com/anthropics/claude-code/issues/94040) (OPEN). Title: `Worktree-isolated sessions still refuse Bash commands that never run git (2.1.270)`. Labels: bug, has repro, platform:macos, area:bash, area:sandbox. After 2.1.257/2.1.259 (loops now pass; quoted argv substring "git" often allowed), the worktree-isolation Bash verifier STILL refuses commands that contain no git operation. On one machine: 181 refusals one night / 120 the next — largest blocked-command class. Related prior issues (cite-only cousins, do NOT rebuild): #90293, #90307, #93193 (already catalogued as Mondegreen — lyric mishearing of substring "git"). THIS booth is NOT Mondegreen: Mondegreen was false-positive on the substring "git". Diabolica is the residual inverted burden of proof — "cannot be shown not to be git" / "too complex to verify" — for shapes that never invoke git. Six refused shapes with allowed controls. Expected: a command that cannot run git should run. Narrower rules: resolve $PWD with no preceding cd; treat double-quoted $PWD… as non-option; parse time/wrappers like the shell; only inspect heredoc text when receiver can execute it. Cousins cite-only: #90293, #90307, #93193. Backups cite-only (next focus only — do not auto-pick): #94032 #94031 #94029 #93987 #93924 #93770 #93777 #94059 #94053. Stay off Sallyport/Palilalia/Sepulchre/Sneck/Drawbridge/Chirograph/Titulus/Derelict/Vestry/Surfeit/Phosphene/Scotoma/Mondegreen/Postern/Portcullis/Wicket/Embrasure paradigms.

11:50 diabolica: an inquisitorial / devil's-proof / parchment-court / iron-balance-scale / sealed-writ / candlelit-chamber booth for #94040. Worktree-isolated sessions still refuse Bash commands that never run git (2.1.270) — residual inverted burden of proof (cannot be shown not to be git / too complex to verify) after loops and quoted-argv substring git often pass. Idle **innocent** / seeded **diabolica** / path **cannot-show-not-git**. Score diabolica or admit innocent.

Score diabolica or admit innocent.

Idle word: **innocent** (HOLD: quashed / discharged). HOLD aliases: innocent, quashed, discharged, unindicted, writ-idle. Seeded word: **diabolica** / #94040 (the cannot-show-not-git path). Path word: **cannot-show-not-git**. Product score: **diabolica**. Never idle sealed / silenced / living / cleared / waved / passable / spanned / matched / inscribed / berthed / pegged / tokenized or seeded sallyport / palilalia / sepulchre / sneck / drawbridge / chirograph / titulus / derelict / vestry / surfeit / phosphene / scotoma / mondegreen / postern / portcullis / wicket / embrasure / reminder-secret-bypass / goal-stop-refire / bash-nul-poison / chip-dismiss-ephemeral / substring-scan.

Phrase: **Score diabolica or admit innocent.**

- **innocent** = IDLE: HOLD; sealed writ shut; scale balances; charges wax-shut
- **diabolica** = #94040 seeded path and product score: unfinished negative proof; six refused shapes
- **cannot-show-not-git** = path word: inverted burden of proof
- **hold** = HOLD alias for idle innocent
- **quashed** = HOLD alias: the writ stays shut
- **discharged** = HOLD alias: six charges stay wax-shut
- **unindicted** = HOLD alias: no bill of cannot-show-not-git
- **writ-idle** = HOLD alias: parchment court idle
- **pwd-unresolved** = helper --raw "$PWD" refused as too complex
- **option-may-stand** = sed -n 1p "$PWD/CLAUDE.md"; -- breaks BSD sed
- **heredoc-to-helper** = git words in quoted heredoc to unrecognized helper
- **pipeline-too-complex** = strings | grep -c isolated refused
- **wrapper-find-word** = time wraps python3; find is an argument
- **computed-program-name** = single-quoted 'a.*b' treated as a program name
- **six-refusals** = the six published shapes
- **one-eighty-one** = 181 / 120 — largest blocked-command class
- **landing** = chamber / parchment / wax / flame / scale / sulfur
- **has-repro** = published shape: macOS · 2.1.270 · zsh · linked worktree
- **cousins** = cite-only #90293 #90307 #93193 — do not conflate
- **backups** = cite-only #94032 #94031 #94029 #93987 #93924 #93770 #93777 #94059 #94053 — do not auto-pick
- **fixtures** = chamber / parchment / wax / flame / scale / sulfur
- **walk** = published idle innocent → cannot-show-not-git → diabolica

Verdicts: innocent, diabolica, cannot-show-not-git, hold, quashed, discharged, unindicted, writ-idle, pwd-unresolved, option-may-stand, heredoc-to-helper, pipeline-too-complex, wrapper-find-word, computed-program-name, six-refusals, one-eighty-one, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **diabolica** or already **innocent**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the worktree Bash gate demands each line prove it is NOT git / NOT escaping the worktree; when the checker cannot finish that negative proof it refuses — even for $PWD reads, quoted heredoc data, and wrapper arguments that never become git. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94040](https://github.com/anthropics/claude-code/issues/94040)
- Cousins: #90293 cite-only (too-complex refusals including loops, 2.1.243). #90307 cite-only (verifier refuses safe read-only commands at scale). #93193 cite-only (Mondegreen substring "git"). Adjacent only. Different defects. Do not conflate.
- Backups (data only; next focus only — do not auto-pick): #94032, #94031, #94029, #93987, #93924, #93770, #93777, #94059, #94053

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:bash, area:sandbox
- Claude Code 2.1.270; macOS Darwin 24.6.0 (BSD userland); zsh; linked worktree
- Loops now pass after 2.1.259; quoted argv substring "git" often allowed
- Six residual refused shapes, each with an allowed control
- 181 refusals one night / 120 the next — largest blocked-command class
- Suggested `sed ... --` breaks BSD sed on macOS

Problem found: CANNOT-SHOW-NOT-GIT — residual inverted burden of proof for shapes that never invoke git.

Why Diabolica: *probatio diabolica* (devil's proof) is the demand to prove a negative. The worktree gate demands each Bash line prove it is NOT git / NOT escaping the worktree. When the checker cannot finish the proof, it refuses — even for `$PWD` reads, quoted heredoc data, and wrapper arguments that never become git. Mondegreen misheard a word; Diabolica refuses the innocent for lack of a completed negative proof. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: innocent catalog page + node diagnostic encoding idle **innocent** / seeded **diabolica** / path **cannot-show-not-git** so operators can score whether the booth is **diabolica** or already **innocent**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. A command that cannot run git should run
2. Resolve `$PWD` in a plain command with no preceding `cd`
3. Treat a double-quoted word that starts with `$PWD` as a non-option
4. Parse wrappers such as `time` the way the shell does
5. Only inspect heredoc text when the receiving program can execute it
6. Do not offer `put -- before it` for `sed` on macOS

## Why not a clone

This is specifically: **WORKTREE GATE REFUSES LINES THAT NEVER RUN GIT WHEN IT CANNOT FINISH THE NEGATIVE PROOF.**

Novel paradigm: inquisitorial parchment court / iron balance-scale / sealed writ / candlelit chamber of negative proof — chamber, parchment, wax, flame, scale, sulfur. New issue, new paradigm (cannot-show-not-git), new UI/UX/fonts/colors, new scoring vocabulary. Horizontal courtroom with a tipping scale, not a fortress sallyport, clinic groove, burial vault, cottage latch, raised drawbridge, or lyric-ballad mondegreen.

**NOT Sallyport/#94082** (reminder-secret-bypass). Different defect. NOT fortress / gatehouse. Do not reuse sealed / sallyport / reminder-secret-bypass.

**NOT Palilalia/#94041** (goal-stop-refire). Different defect. NOT speech-pathology / phonograph-groove. Do not reuse silenced / palilalia / goal-stop-refire.

**NOT Sepulchre/#94055** (bash-nul-poison). Different defect. NOT stone burial vault / ossuary. Do not reuse living / sepulchre / bash-nul-poison.

**NOT Sneck/#94052** (chip dismiss ephemeral). Different defect. NOT Northern cottage / brass sneck-latch. Do not reuse cleared / sneck / chip-dismiss-ephemeral.

**NOT Drawbridge/#94049** (RC bridge auto-update drop). Different defect. NOT raised span / bailey. Do not reuse spanned / drawbridge / rc-bridge-update-drop.

**NOT Chirograph/#94045** (recorded branch never refreshed after `git branch -m`). Different defect. NOT medieval lectern / indenture. Do not reuse matched / chirograph / worktree-rename-stale.

**NOT Titulus/#94025** (iOS rename vs desktop sidebar / resume-stale-title). Different defect. NOT Roman marble plaque. Do not reuse inscribed / titulus.

**NOT Derelict/#93996** (orphaned Bash after session stop). Different defect. NOT maritime abandoned-hulk. Do not reuse berthed / derelict.

**NOT Vestry/#94008** (Linux bwrap placeholder mount cleanup is per-process). Different defect. NOT liturgical sacristy. Do not reuse pegged / vestry.

**NOT Surfeit/#94012** (workflow keeps spawning after terminal session-limit). Different defect.

**NOT Phosphene/#94003** (WindowServer CA layer-tree thrash). Different defect.

**NOT Scotoma.** Different defect.

**NOT Mondegreen/#93193** (substring "git" false-positive). Cite-only cousin. NOT lyric-ballad / mishearing. Do not reuse tokenized / mondegreen / substring-scan.

**NOT Postern** (slug already used). Different night-bailey paradigm.

**NOT Portcullis / Wicket / Embrasure.** Different fortress-gate paradigms.

Live: https://hermes-playground-green.vercel.app/diabolica/

```
node --test projects/diabolica/diabolica.test.mjs
node projects/diabolica/diabolica.mjs projects/diabolica/data/diabolica.json
```

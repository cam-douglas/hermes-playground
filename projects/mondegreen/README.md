# Mondegreen

A **lyric-mishearing / ballad-sheet studio booth** — night ink, bone lyric, rose-madder mishear, sage true line, brass staff, dark broadside; fonts **Cormorant Garamond** (display) + **Outfit** (UI) + **Space Mono** (mono) — for a real Claude Code defect: **BASH SANDBOX FOR `isolation:worktree` DISPATCHED AGENTS FALSE-BLOCKS ON THE SUBSTRING `git` ANYWHERE IN THE COMMAND, INCLUDING INSIDE UNRELATED PROSE.**

Primary:

- [anthropics/claude-code#93193](https://github.com/anthropics/claude-code/issues/93193) (OPEN, bug, has repro, area:agents, area:sandbox). Title: `Bash sandbox for isolation:worktree dispatched agents false-blocks on the substring "git" anywhere in the command, including inside unrelated prose`. A background agent dispatched with `isolation: "worktree"` had a Bash command refused as "too complex to verify [it] stays inside the worktree," even though the command contained no `git` invocation — no `$(git ...)`, no git subcommand. The command was `python3 scripts/work.py update TX-KAN-NNNNN "status_update=$(cat "$SCRATCH")"`. `$SCRATCH` was plain prose whose content included the English word **legitimate** — substring `git`. Removing that one word made the identical command succeed. The same command in an interactive (non-dispatched) session's Bash tool executed cleanly. The restriction is specific to the sandbox applied to `isolation:worktree` / background-agent Bash. Expected: word-boundary / command-position tokenization for `git`, not a raw substring scan over the entire command string (also matches digit, legitimize, gitignore-as-prose). Filed 2026-09-09T20:28:08Z by sohailbm-kandaq.

09:50 mondegreen: a lyric-mishearing / ballad-sheet booth that should keep a worktree-isolation Bash line **tokenized** (word-boundary / command-position git); instead the sandbox **mondegreens** — hears git inside legitimate, refuses a command with no git invocation (#93193). Score mondegreen or admit tokenized.

Score mondegreen or admit tokenized.

Idle word: **tokenized** (HOLD: word-boundary / command-position tokenization; `git` only as a command word). Seeded word: **mondegreen** / #93193 (substring scan false-blocks on `git` inside "legitimate"). Path word: **parsed**. Never idle locked / scratched / derby / unmasked / vizard / precedence / carrier / deadair / squelch / moored / scuttled / scuttle / open / seated / stopcock / preserved / discarded / fresh / stamped / cleared / mounded / distinct / conflated / held / steered / raised / fallen / sterling / primed / flashed / lodged / bypassed / greenroomed / scaffold / diplopic / freewheeling / doubled.

Phrase: **when the sandbox hears git inside legitimate, mondegreen never stays tokenized — score mondegreen or admit tokenized.**

- **tokenized** = IDLE: HOLD; word-boundary / command-position; `git` only as a command word
- **mondegreen** = #93193 seeded path: substring scan hears `git` inside legitimate; Bash refused
- **parsed** = path word: tokenize command words; do not raw-scan the entire string
- **command-word** = HOLD alias: `git` only in command position (start, after `&&` / `;` / `|`, or after `env` / `sudo` / `$()`)
- **word-boundary** = HOLD alias: word-boundary match, not a substring of legitimate / digit / legitimize
- **hold** = HOLD alias for idle tokenized
- **isolation-worktree** = Agent dispatched with `isolation: "worktree"`
- **substring-scan** = raw substring scan over the expanded command string
- **legitimate-prose** = English word legitimate contains substring `git`
- **bash-refused** = too complex to verify stays inside the worktree
- **too-complex** = no git invocation; still refused
- **interactive-ok** = interactive (non-dispatched) Bash executes cleanly
- **has-repro** = isolation:worktree + legitimate + refusal walk
- **cousins** = cite-only #92586 #92112 #93197 — do not rebuild
- **backups** = cite-only #93173 #93182 #93218 — do not auto-pick as primary
- **fixtures** = row list for the mondegreen booth
- **walk** = published idle tokenized → isolation-worktree → legitimate-prose → substring-scan → bash-refused → too-complex → interactive-ok → mondegreen → parsed

Verdicts: tokenized, mondegreen, parsed, hold, command-word, isolation-worktree, substring-scan, legitimate-prose, bash-refused, too-complex, interactive-ok, word-boundary, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring lyric studio. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the line is **mondegreen** or already **tokenized**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the isolation:worktree / background-agent sandbox applies a raw substring scan for `git` over the expanded command string, so any English word containing those three letters is treated as an unverifiable git invocation. Invite verify against #93193 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93193](https://github.com/anthropics/claude-code/issues/93193)
- Cite-only cousin: [anthropics/claude-code#92586](https://github.com/anthropics/claude-code/issues/92586) (Seizing — EDR hard-link; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#92112](https://github.com/anthropics/claude-code/issues/92112) (Holdfast — `--worktree` cwd Bash block; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#93197](https://github.com/anthropics/claude-code/issues/93197) (Derby — npm-global race; do not rebuild)
- Backup (data only): [anthropics/claude-code#93173](https://github.com/anthropics/claude-code/issues/93173) (sandbox denies writes under repo `.claude/` and silently corrupts git checkout)
- Backup (data only): [anthropics/claude-code#93182](https://github.com/anthropics/claude-code/issues/93182) (server-side tools unblockable — deny casing mismatch + PreToolUse never fires)
- Backup (data only): [anthropics/claude-code#93218](https://github.com/anthropics/claude-code/issues/93218) (Desktop `--disallowedTools SendMessage` but ListAgents still lists peers)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, area:agents, area:sandbox
- Background agent dispatched with `isolation: "worktree"`
- Bash refused: too complex to verify [it] stays inside the worktree
- Command: `python3 scripts/work.py update TX-KAN-NNNNN "status_update=$(cat "$SCRATCH")"`
- `$SCRATCH` prose included **legitimate** — substring `git`
- Removing that one word made the identical command succeed
- No git invocation at all
- Interactive (non-dispatched) Bash executed cleanly
- Expected: word-boundary / command-position tokenization, not a raw substring scan
- Also matches digit, legitimize, gitignore-as-prose

Problem found: WHEN THE SANDBOX HEARS GIT INSIDE LEGITIMATE, MONDEGREEN NEVER STAYS TOKENIZED.

Why this solution: a diagnostic lyric-mishearing booth for the tokenized → mondegreen drift, so a reader can pin idle tokenized, load the #93193 mondegreen path, and score parsed / substring-scan / legitimate-prose / bash-refused against the published facts. Two conceptual ears compare a crude substring scan with command-position tokenization. No real sandbox is required.

## Why not a clone

This is specifically: **ISOLATION:WORKTREE BASH SANDBOX FALSE-BLOCKS ON SUBSTRING `git` INSIDE UNRELATED PROSE.**

**NOT Derby/#93197** (concurrent npm-global retire race). Different paradigm.

**NOT Vizard/#93190** (Desktop `/plan` intercept so CLI project-command precedence never runs). Different paradigm.

**NOT Dead Air/#93155** (silent 900s API stall with keepalive ACK / zero log). Different paradigm.

**NOT Scuttle/#93154** (remote SSH warm-up-failure `server.shutdown` SIGKILL). Different paradigm.

**NOT Stopcock/#93143** (Streamable HTTP MCP ~6min hard seat). Different paradigm.

**NOT Parergon/#93122** (stealth idle over an open `/btw` side chat). Different paradigm.

**NOT Stereotype/#93108** (plugin update version-string-only freshness). Different paradigm.

**NOT Midden/#93081** (WorktreePool partial-remove GC remound loop). Different paradigm.

**NOT Guillotine/#92974** (background-mode Deny-only permission dialog). Different paradigm.

**NOT Seizing/#92586** (EDR hard-link). Different paradigm — do not rebuild.

**NOT Holdfast/#92112** (`--worktree` cwd Bash block). Different paradigm — do not rebuild.

**NOT Springe/#92675** (plugin-native PreToolUse hooks). Different paradigm.

**NOT Understudy / Mirage / Trompe / Homonym / Shibboleth**. Different paradigms.

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **isolation:worktree substring-vs-token `git` mishearing** — unused in catalog.

Do NOT rename this product Derby, Vizard, Dead Air, Scuttle, Stopcock, Parergon, Stereotype, Midden, Guillotine, Seizing, Holdfast, Springe, or any existing catalog slug.
Do NOT reuse idle tokenized / mondegreen / parsed on a later booth.
Do NOT reuse Bodoni Moda + Manrope + IBM Plex Mono (Derby). Do NOT reuse Cinzel + Karla + Azeret Mono (Vizard). Do NOT reuse Oswald + Source Sans 3 + Share Tech Mono (Dead Air). Do NOT reuse DM Serif Display + Lexend + JetBrains Mono (Scuttle). Display here is **Cormorant Garamond**. UI is **Outfit**. Mono is **Space Mono**.

Different surface: isolation:worktree substring `git` in prose vs npm-global race / Desktop `/plan` intercept / silent 900s API stall / EDR hard-link / `--worktree` cwd guard / Deny-only permission dialog.

Product name stays **Mondegreen**. Name/slug `mondegreen` unused in catalog.json (256 products before this ship; Derby is #256).

Different UI: lyric-mishearing booth / ballad-sheet studio / night ink / bone lyric / rose-madder mishear / sage true line / brass staff / dark broadside. Cormorant Garamond / Outfit / Space Mono. NOT racecourse (Derby). NOT masquerade atelier (Vizard). NOT charcoal radio studio (Dead Air). NOT naval shipyard (Scuttle). NOT brass plumbing (Stopcock). NOT parchment/manuscript aside (Parergon). NOT letterpress (Stereotype). NOT scaffold/guillotine. NOT theater green room. NOT bosun seizing loft.

Different verbs: Hum the line, Tokenize the bar, Mishear the lyric, Pin idle tokenized, Pin seeded mondegreen, Pin parsed, Lift the ear, Mark the staff, Reset the sheet.

Different idle: **tokenized**. Different #93193 seeded path: **mondegreen**. HOLD: **tokenized** / **command-word** / **word-boundary**. ALARM: **mondegreen** / **parsed** / **isolation-worktree** / **substring-scan** / **legitimate-prose** / **bash-refused** / **too-complex** / **interactive-ok**. Path: **parsed**.

## How to score

```bash
node --test projects/mondegreen/mondegreen.test.mjs
node projects/mondegreen/mondegreen.mjs projects/mondegreen/data/93193.json
node projects/mondegreen/mondegreen.mjs projects/mondegreen/data/tokenized.json
echo '{"seed":"mondegreen"}' | node projects/mondegreen/mondegreen.mjs
```

Open the living card at `projects/mondegreen/index.html` (or the live path `/mondegreen/`). Buttons: Hum the line, Tokenize the bar, Mishear the lyric, Pin idle tokenized, Pin seeded mondegreen, Pin parsed, Lift the ear, Mark the staff, Reset the sheet. Toggle isolation / substring / legitimate / refused — the score flips. Rest a fixture JSON on the folio tray. `?embed=1` hides chrome.

The booth reconstructs the reporter’s isolation:worktree substring-mishearing walk from the published #93193 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/mondegreen/
- Folder: `projects/mondegreen/`

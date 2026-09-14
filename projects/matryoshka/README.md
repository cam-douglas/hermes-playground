# Matryoshka

A **lacquer nesting-doll / birch-workshop booth** — a *matryoshka* is a Russian nesting doll: the outer `$(...)` doll wraps inner `;` / `|` joints. The Bash permission walker opens the outer doll but cannot recurse into those nested joints, even though the same joints work at top level and every leaf command is allow-listed. Fonts **Yeseva One** (display) + **Nunito** (body) + **IBM Plex Mono** (mono). Palette: lacquer red `#C41E3A`, birch `#F4E8D8`, deep indigo `#1B2838`, gold leaf `#D4A017`, soot ink `#2A2A2A`. Fresh trio. Distinct from Dragnet asphalt/amber and Matricula ivory/oak/brass. Completely different UI/UX/metaphor — lacquer-red nesting-doll workshop / birch wood / gold leaf / indigo cloth. NOT a night blotter. NOT an enrollment desk. NOT a type-foundry. NOT a neurology desk. NOT a gauntlet/lictor/lychgate/ouster/proscription booth.

The walker should stay **unpacked** (HOLD: walker recurses into `$(...)` and treats nested list/pipeline nodes like top-level — no prompt, no raw error leak). Instead the booth was **matryoshka** after a **subst-nest**.

Primary:

- [anthropics/claude-code#94350](https://github.com/anthropics/claude-code/issues/94350) (OPEN). Title: `[BUG] Bash permission walker: "Unhandled node type" forces prompts on pipes/semicolons nested inside $(...) command substitution`. Labels: bug, has repro, platform:linux, area:bash, platform:wsl, area:permissions. Version noted: 2.1.126 (WSL/Ubuntu). Bash permission walker's tree-sitter AST dispatcher fails to handle control-operator nodes (`;` / "list", `|` / "pipeline") when they occur nested inside a `$(...)` command substitution, even though the same operators are handled fine at the top level. Forces unnecessary manual approval on a command whose every component is individually allow-listed. In the semicolon case, leaks the walker's internal fallback error string `Unhandled node type: ;` into the permission prompt shown to the user. Published repro: `echo "x: $(pwd)"` → clean (single simple command inside `$(...)`); `echo "x: $(cat file.txt 2>/dev/null)"` → clean (single command + redirect inside `$(...)`); `echo "x: $(cat file.txt | wc -l)"` → PROMPTS (pipe nested inside `$(...)`); `echo "x: $(echo a; echo b)"` → PROMPTS + shows literal `Unhandled node type: ;`. Every inner command (cat, wc, echo, pwd) independently auto-allowed; top-level `;` and `|` outside substitution handled correctly — failure is specific to control-operator node inside `$(...)` subtree. Cousins cite-only (CLOSED — do NOT rebuild / do NOT conflate): #55170 (parenthesized subshell `(cmd1; cmd2)` → Unhandled node type: ;), #47752 / #56019 (heredoc+pipe → Unhandled node type: pipeline), #47701 / #47706 (redirects → Unhandled node type: file_redirect), #46868 (feature request auto-allow compound when every component allowed). Stay off Dragnet/Matricula/Allograph/Agraphia/Gauntlet/Lictor/Lychgate/Ouster/Proscription/Frisket/Scant paradigms.

05:50 matryoshka: a lacquer nesting-doll / birch-workshop booth for #94350. Bash permission walker prompts on pipes/semicolons nested inside $(...) even when every component is allow-listed; semicolon case leaks "Unhandled node type: ;" into the permission prompt. Idle **unpacked** / seeded **matryoshka** / path **subst-nest**. Score matryoshka or admit unpacked.

Score matryoshka or admit unpacked.

Idle word: **unpacked** (HOLD: walker recurses into `$(...)` and treats nested list/pipeline nodes like top-level — no prompt, no raw error leak). HOLD aliases: descended, recursed, opened, nested-ok, walked-in. Seeded word: **matryoshka** / #94350 (the subst-nest path). Path word: **subst-nest**. Product score: **matryoshka**. Never idle scoped / enrolled / equated / penned / ungloved / attested / reaped / tenanted / barred or Dragnet HOLD aliases fenced / bounded / warranted / project-rooted / cwd-scoped or seeded Dragnet / Matricula / Allograph / Agraphia / gauntlet / lictor / lychgate / ouster / proscription or path root-find / reload-blind / win-posix-mismatch / pre-tool-omit / attach-mouse / picker-bypass.

Phrase: **Score matryoshka or admit unpacked.**

- **unpacked** = IDLE HOLD: walker recurses into `$(...)` and treats nested list/pipeline like top-level — no prompt, no raw error leak
- **matryoshka** = seeded path / product score: outer doll will not unpack nested `;` / `|` joints
- **subst-nest** = path word
- **hold** = HOLD alias for idle unpacked
- **descended** = HOLD alias: walker descended into the `$(...)` body
- **recursed** = HOLD alias: nested list/pipeline walked like top-level
- **opened** = HOLD alias: outer doll opened
- **nested-ok** = HOLD alias: joints walked; no prompt
- **walked-in** = HOLD alias: walker walked into the nest
- **unhandled-node** = AST dispatcher fallback
- **error-leak** = `Unhandled node type: ;` shown in the permission prompt
- **nested-pipe** = `echo "x: $(cat file.txt | wc -l)"` → PROMPTS
- **nested-semicolon** = `echo "x: $(echo a; echo b)"` → PROMPTS
- **top-level-ok** = `;` and `|` outside substitution handled correctly
- **allowlisted-parts** = cat, wc, echo, pwd independently auto-allowed
- **subst-body** = `$(...)` subtree is where list/pipeline miss
- **landing** = lacquer nesting-doll / birch workshop
- **has-repro** = published shape: 2.1.126 WSL/Ubuntu
- **cousins** = cite-only CLOSED #55170 #47752 #56019 #47701 #47706 #46868 — do not rebuild; do not conflate
- **backups** = cite-only #93924 #93770 #93777 #94151 #94277 — do not auto-pick
- **fixtures** = lacquer nesting-doll / birch workshop
- **walk** = published idle unpacked → subst-nest → matryoshka
- **closed** = cousins remain CLOSED — cite only; not this booth

Verdicts: unpacked, matryoshka, subst-nest, hold, descended, recursed, opened, nested-ok, walked-in, unhandled-node, error-leak, nested-pipe, nested-semicolon, top-level-ok, allowlisted-parts, subst-body, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **matryoshka** or already **unpacked**. Fixtures use the issue's published incident only. Walker rows are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the AST permission walker does not recurse into command-substitution bodies for list/pipeline nodes, so nested `;`/`|` hit the unhandled-node fallback (prompt + error leak) even when every leaf command is allow-listed and top-level compounds are fine. Invite verify against #94350 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94350](https://github.com/anthropics/claude-code/issues/94350)
- Cousins (cite-only — CLOSED — do NOT rebuild / do NOT conflate): #55170 — parenthesized subshell `(cmd1; cmd2)` → Unhandled node type: ;. #47752 / #56019 — heredoc+pipe → Unhandled node type: pipeline. #47701 / #47706 — redirects → Unhandled node type: file_redirect. #46868 — feature request auto-allow compound when every component allowed. #94350 is specifically nested `;` / `|` inside `$(...)`.
- Backups (data only; next focus only — do not auto-pick): #93924, #93770, #93777, #94151, #94277

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:linux, area:bash, platform:wsl, area:permissions
- Version noted: 2.1.126 (WSL/Ubuntu)
- Bash permission walker's tree-sitter AST dispatcher fails to handle control-operator nodes (`;` / "list", `|` / "pipeline") nested inside `$(...)`
- Same operators handled fine at the top level
- Forces unnecessary manual approval on a command whose every component is individually allow-listed
- Semicolon case leaks `Unhandled node type: ;` into the permission prompt
- `echo "x: $(pwd)"` → clean
- `echo "x: $(cat file.txt 2>/dev/null)"` → clean
- `echo "x: $(cat file.txt | wc -l)"` → PROMPTS
- `echo "x: $(echo a; echo b)"` → PROMPTS + literal `Unhandled node type: ;`
- Every inner command (cat, wc, echo, pwd) independently auto-allowed
- Top-level `;` and `|` outside substitution handled correctly
- Failure is specific to control-operator node inside `$(...)` subtree

Problem found: SUBST-NEST — nested `;` / `|` inside `$(...)` hit the unhandled-node fallback even when every leaf is allow-listed.

Why Matryoshka: A *matryoshka* is a Russian nesting doll. The outer `$(...)` doll wraps inner `;` / `|` joints. The walker opens the outer doll but cannot recurse into the nested joints. Dragnet/#94064 was a night blotter / root-find — DIFFERENT. Matricula/#93987 was an enrollment desk / reload-blind — DIFFERENT. Allograph/#94256 was a type-foundry / win-posix-mismatch — DIFFERENT. This booth is specifically subst-nest on nested control-operators inside `$(...)` — different problem, UI, UX, metaphor. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: unpacked catalog page + node diagnostic encoding idle **unpacked** / seeded **matryoshka** / path **subst-nest** so operators can score whether the booth is **matryoshka** or already **unpacked**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Extend the AST walker to recurse into `$(...)` / backtick bodies like top-level list/pipeline
2. Catch unhandled-node fallback and show a generic approval prompt instead of leaking the raw internal error
3. Nested `|` inside `$(...)` should not force a prompt when every leaf is allow-listed
4. Nested `;` inside `$(...)` should not force a prompt when every leaf is allow-listed
5. `Unhandled node type: ;` must not appear in the permission prompt
6. Top-level `;` and `|` outside substitution remain handled (already published as working)

## Why not a clone

This is specifically: **BASH PERMISSION WALKER PROMPTS ON PIPES/SEMICOLONS NESTED INSIDE `$(...)` EVEN WHEN EVERY COMPONENT IS ALLOW-LISTED; SEMICOLON CASE LEAKS `Unhandled node type: ;`.**

Novel paradigm: lacquer nesting-doll / birch workshop / gold leaf / indigo cloth — lacquer red, birch, indigo, gold. New issue, new paradigm (subst-nest), new UI/UX/fonts/colors, new scoring vocabulary. A nesting-doll workshop, not a night blotter, enrollment desk, type-foundry ledger, neurology clinic, tilting-yard glove, purple fasces aisle, parish porch, bailiff desk, or Roman tablet.

**NOT Dragnet/#94064** (root-find). Different defect. NOT night blotter. Do not reuse scoped / Dragnet / root-find.

**NOT Matricula/#93987** (reload-blind). Different defect. NOT enrollment desk. Do not reuse enrolled / Matricula / reload-blind.

**NOT Allograph/#94256** (win-posix-mismatch). Different defect. NOT type-foundry / punchcutter. Do not reuse equated / Allograph / win-posix-mismatch.

**NOT Agraphia/#94251** (pre-tool-omit). Different defect. NOT clinical writing-desk. Do not reuse penned / Agraphia / pre-tool-omit.

**NOT Gauntlet/#94029** (attach-mouse). Different defect. NOT tilting-yard / iron glove. Do not reuse ungloved / gauntlet / attach-mouse.

**NOT Lictor/#94053** (picker-bypass). Different defect. NOT purple fasces aisle. Do not reuse attested / lictor / picker-bypass.

**NOT Lychgate/#94059** (bg-task-stale). Different defect. NOT parish porch. Do not reuse reaped / lychgate / bg-task-stale.

**NOT Ouster/#94221** (inherited-worktree-yank). Different defect. NOT Georgian bailiff desk. Do not reuse tenanted / ouster / inherited-worktree-yank.

**NOT Proscription/#94202** (deny-list-hollow). Different defect. NOT Roman wax-tablet forum. Do not reuse barred / proscription / deny-list-hollow.

**NOT Frisket.** Different catalog paradigm. Do not reuse Frisket.

**NOT Scant.** Different catalog paradigm. Do not reuse Scant.

Live: https://hermes-playground-green.vercel.app/matryoshka/

```
node --test projects/matryoshka/matryoshka.test.mjs
node projects/matryoshka/matryoshka.mjs projects/matryoshka/data/matryoshka.json
```

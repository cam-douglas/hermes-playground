# Mondegreen fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #93193 issue facts: Bash sandbox for `isolation:worktree` dispatched agents false-blocks on the substring `git` anywhere in the command, including inside unrelated prose. Score mondegreen or admit tokenized.

Idle word: **tokenized**. Seeded word: **mondegreen**. Path word: **parsed**. HOLD: **tokenized** / **command-word** / **hold** / **word-boundary**. ALARM: **mondegreen** / **parsed** / **isolation-worktree** / **substring-scan** / **legitimate-prose** / **bash-refused** / **too-complex** / **interactive-ok** / **has-repro** / **cousins** / **backups** / **fixtures** / **chips** / **fingerprints** / **walk**. Primary: [anthropics/claude-code#93193](https://github.com/anthropics/claude-code/issues/93193).

Fixtures record the published incident only. No live session. No secrets. No exploit payloads. No network to Anthropic. No live Claude. No patch to anthropics/claude-code. Not Derby/#93197 (npm-global race). Not Vizard/#93190 (Desktop `/plan` intercept). Not Dead Air/#93155 (silent 900s API stall). Not Seizing/#92586 (EDR hard-link). Not Holdfast/#92112 (`--worktree` cwd Bash block). Not Springe/#92675 (hooks). Not Guillotine/#92974 (Deny-only). Not leftover woodworking / mm-slider. Different paradigm: isolation:worktree substring-vs-token `git` mishearing.

Backups (cite in data only — do not auto-pick as primary): #93173, #93182, #93218.

| File | Verdict | What it scores |
|---|---|---|
| `tokenized.json` | tokenized | Idle booth. HOLD: word-boundary / command-position. |
| `mondegreen.json` | mondegreen | Seeded #93193 path. ALARM: hears git inside legitimate. |
| `93193.json` | mondegreen | Primary fixture alias for #93193. |
| `parsed.json` | parsed | Path word: tokenize command words, do not raw-scan. |
| `hold.json` | hold | HOLD alias: admit tokenized. |
| `command-word.json` | command-word | HOLD: git only as a command word. |
| `word-boundary.json` | word-boundary | HOLD: word-boundary match, not substring. |
| `walk.json` | walk | Published idle → isolation → lyric → substring → refuse → too-complex → interactive → mondegreen → parsed. |
| `isolation-worktree.json` | isolation-worktree | Agent dispatched with `isolation: "worktree"`. |
| `substring-scan.json` | substring-scan | Raw substring scan over the entire command string. |
| `legitimate-prose.json` | legitimate-prose | English word legitimate contains substring git. |
| `bash-refused.json` | bash-refused | Too complex to verify stays inside the worktree. |
| `too-complex.json` | too-complex | No git invocation; still refused. |
| `interactive-ok.json` | interactive-ok | Interactive (non-dispatched) Bash executes cleanly. |
| `has-repro.json` | has-repro | isolation:worktree + legitimate + refusal walk. |
| `cousins.json` | cousins | Cite-only #92586 #92112 #93197. |
| `backups.json` | backups | Cite-only #93173 #93182 #93218. |
| `fixtures.json` | fixtures | Row list for the mondegreen booth. |
| `chips.json` | chips | Chip list matching verdicts. |
| `fingerprints.json` | fingerprints | Fingerprint samples for tokenized vs mondegreen. |

Clip any file onto `projects/mondegreen/index.html`. Buttons load the seeded path. The living page admits **tokenized** / idle booth / #93193.

The booth reconstructs the reporter’s isolation:worktree substring-mishearing walk from the published #93193 body. This lyric studio does not run Claude.

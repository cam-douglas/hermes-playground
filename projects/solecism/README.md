# Solecism

A **grammar / usage desk / manuscript-margin** atelier — flag-string vs resolved-path ledger, main-checkout pollution strip, literal-directory alarm lamp, parse score; ink / cream paper / margin red / graphite — Source Serif 4 + Work Sans + Inconsolata — for a real Claude Code defect: **WORKTREE PROVISIONING WRITES THE GIT EXCLUDE ENTRY TO A LITERAL --git-common-dir/ DIRECTORY IN THE MAIN CHECKOUT INSTEAD OF .git/info/exclude; AREA:CORE; PLATFORM:MACOS.**

Primary:

- [anthropics/claude-code#91558](https://github.com/anthropics/claude-code/issues/91558) (OPEN, bug, platform:macos, area:core, filed 2026-09-02T17:19:13Z, updated 2026-09-02T17:20:23Z). Title: Worktree provisioning writes the git exclude entry to a literal --git-common-dir/ directory in the MAIN checkout instead of .git/info/exclude. Reporter karlgroves. Measured on Claude Code 2.0.42; macOS 26.5.2 Apple Silicon; zsh; git 2.50.1; normal checkout (`.git` is a real directory; `rev-parse` returns `.git`); no LFS.

a solecism that treats the flag string as the path is not a resolved exclude — it is a literal directory in the main checkout. Score the parse or admit the flag already landed.

Idle word: **resolved**. Seeded state: **literal** / #91558 — intended write to `$(git rev-parse --git-common-dir)/info/exclude` never executed the rev-parse; the flag string itself became the path → `./--git-common-dir/info/exclude` with contents `.claude/worktrees/`; `.git/info/exclude` still has no active entries; MAIN checkout polluted (not the worktree). Recreated more than once (earlier ~16:50, observed 18:01:13 Sep 1 2026). Not created by any logged tool call — below Bash-tool layer; attribution to worktree provisioning is inference from content+timing+sibling #90456. Never idle as sealed / blanked / attested / usurped / swaged / torn / homed / crossed / armed / unheard.

A **solecism** should execute `git rev-parse --git-common-dir` and write the exclude using that OUTPUT so the entry lands in `.git/info/exclude`. The worktree-provisioning path instead treated the flag string as a directory name and wrote `./--git-common-dir/info/exclude` into the MAIN checkout.

- **literal** = #91558: flag string used as the path; `./--git-common-dir/info/exclude` created in the MAIN checkout
- **flag-as-path** = intended `$(git rev-parse --git-common-dir)/info/exclude` never executed the rev-parse; the flag string itself became the path
- **main-checkout-pollution** = pollutes the MAIN repository checkout (not the worktree)
- **exclude-never-reached** = `.git/info/exclude` still has no active entries
- **recurring-recreation** = recreated more than once (earlier ~16:50, observed 18:01:13 Sep 1 2026)
- **near-miss-git-add** = near-miss `git add` of `A --git-common-dir/info/exclude`
- **sibling-dev-null-class** = same class as #90456 (path literal used without resolution); that cousin pollutes the worktree, this one pollutes main
- **below-bash-layer** = not created by any logged tool call; attribution is inference from content+timing+sibling #90456
- **gitignore-masks-miss** = impact low here because `.gitignore` already has `.claude/`; without that rule exclusion silently fails
- **has-clear-evidence** = karlgroves filed #91558; observed path + contents; Claude Code 2.0.42; macOS 26.5.2 Apple Silicon; platform:macos; area:core
- **hold** = rev-parse OUTPUT used; exclude lands in `.git/info/exclude`; the usage holds
- **resolved** = HOLD: `git rev-parse --git-common-dir` executed; write used that OUTPUT
- **parsed** = HOLD: the flag was parsed, not copied as a path

Verdicts: resolved, parsed, literal, flag-as-path, main-checkout-pollution, exclude-never-reached, recurring-recreation, near-miss-git-add, sibling-dev-null-class, below-bash-layer, gitignore-masks-miss, has-clear-evidence, hold.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the exclude path is resolved or literal.

Hypothesis only (NON-BINDING): execute `git rev-parse --git-common-dir` and use its OUTPUT; fail loudly rather than falling back to the flag string; discard if issue evidence disagrees. Encoded from the issue's filed timeline (earlier ~16:50; observed 18:01:13 Sep 1 2026). Do not claim Claude Code source you have not seen.

## Why not a clone

This is specifically: **WORKTREE PROVISIONING WRITES THE GIT EXCLUDE ENTRY TO A LITERAL --git-common-dir/ DIRECTORY IN THE MAIN CHECKOUT INSTEAD OF .git/info/exclude; AREA:CORE; PLATFORM:MACOS.**

NOT Coffer ([#91571](https://github.com/anthropics/claude-code/issues/91571)) — Windows OAuth file-store refresh rotation never persisted; failed refresh blanks tokens.
NOT Codicil ([#91513](https://github.com/anthropics/claude-code/issues/91513)) — shared multi-agent worktree; `git commit --amend` does not re-check HEAD; silently rewrites a concurrent teammate's commit message.
NOT Crimp ([#91520](https://github.com/anthropics/claude-code/issues/91520)) — settings.json unlocked RMW; concurrent sessions tear the file and drop keys.
NOT Jackfield ([#91511](https://github.com/anthropics/claude-code/issues/91511)) — desktop cross-machine session mix-up; Windows input executes on unrelated macOS session.
NOT Tocsin ([#91503](https://github.com/anthropics/claude-code/issues/91503)) — idle-wake / background Bash; subagent completion queued with no idle-wake consumer.
NOT Coffer / Codicil / Crimp / Jackfield / Tocsin / Bolter / Deadeye / Reglet / Reliquary / Annunciator / Caisson / Spindle / Knell / Tumbler / Escapement / Geneva / Scotch / Pintle paradigms.
NOT leftover vault-coffer / probate will-chamber / crimp pliers/foil / jackfield channel-strip / tocsin watchhouse / bolter flour-mill / deadeye standing-rigging / reglet letterpress / vault-latch / annunciator lamps.

Cousins are cite-only on a cousin strip; primary stays #91558.

- [#90456](https://github.com/anthropics/claude-code/issues/90456) — OPEN, bug, has-repro, platform:windows — Worktree provisioning writes Git LFS hooks to a literal `dev/null/` directory instead of `.git/hooks/` (same class: path literal used without resolution; pollutes the worktree, not main) — cite-only.

Backups (do not ship unless primary blocked): **Caret** / #91526. **Buoy** / #91569. **Prefix** / #91581.

Product name stays **Solecism**. Do not rename to Coffer, Codicil, Crimp, Jackfield, Tocsin, Bolter, Deadeye, Reglet, Reliquary, Annunciator, Caisson, Spindle, Knell, Tumbler, Escapement, Geneva, Scotch, Pintle.

Different UI: grammar / usage desk / manuscript-margin atelier + flag-string vs resolved-path ledger + main-checkout pollution strip + literal-directory alarm lamp + parse score / ink / cream paper / margin red / graphite. Source Serif 4 + Work Sans + Inconsolata. NOT Spectral/Karla/IBM Plex Mono (Coffer). NOT Cormorant/Figtree/Azeret (Codicil). NOT Newsreader/Manrope/JetBrains (Crimp). NOT Brygada/Atkinson/DM Mono (Jackfield). NOT Fraunces/Source Sans 3 (Tocsin). Stay OFF vault-coffer / probate parchment / crimp pliers/foil / jackfield channel-strip / tocsin watchhouse / bolter flour-mill / deadeye standing-rigging / reglet letterpress / vault-latch / annunciator lamps.

Different verbs: Score the parse, pin idle resolved, pin seeded literal, admit the flag already landed, load fixtures, reset to resolved. Score the parse is this desk's phrase.

Different idle: **resolved**.

## Live catalog path

`/solecism/` is this static grammar / usage desk / manuscript-margin atelier desk. Path `https://hermes-playground-green.vercel.app/solecism/` and subdomain `https://solecism.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `05:50 / hermes catalog #128 / #91558`. `?embed=1` hides chrome for the hub living featured well.

1. Idle demo loads **resolved** — `git rev-parse --git-common-dir` executed; OUTPUT used as path; exclude lands in `.git/info/exclude`.
2. Seed **literal** → #91558: flag string became `./--git-common-dir/info/exclude`; MAIN checkout polluted; `.git/info/exclude` still has no active entries; recreated more than once; near-miss `git add`.
3. Atelier UI: flag-string vs resolved-path ledger / main-checkout pollution strip / literal-directory alarm lamp / parse score. Resolved = parsed hold. Literal = flag already landed.
4. Cousin cite strip labeled cousin-not-primary: [#90456](https://github.com/anthropics/claude-code/issues/90456). Cite only. Primary stays #91558.
5. **Score the parse** walks the probe ticket and lights chips on the desk. Chip-switch every verdict. Paste or drop JSON.

## How to score

Open `projects/solecism/index.html` in a browser, or serve the repo root and visit `/solecism/` (Vercel rewrite → `/projects/solecism`). No build step. Optional hook:

```bash
node projects/solecism/hook/solecism.mjs projects/solecism/data/91558.json
node --test projects/solecism/hook/solecism.test.mjs
```

Empty stdin scores the idle **resolved** ticket. Paste a probe on the page or drop a fixture from `data/`.

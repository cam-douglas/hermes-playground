# Scabbard

An **armorer's empty-scabbard / sheath bench** — dark oak armory rack, worn leather, brass throat and chape, missing blade silhouette, parchment muster; Cormorant Unicase + Sora + IBM Plex Mono — for a real Claude Code defect: **A CUSTOM SUBAGENT THAT DECLARES `Bash` IN `.claude/agents/*.md` FRONTMATTER IS INVOKED WITH BASH SILENTLY OMITTED WHILE GREP/GLOB REMAIN.** No error, warning, or denial. No config restores the blade. General-purpose still receives `*`.

Primary:

- [anthropics/claude-code#92820](https://github.com/anthropics/claude-code/issues/92820) (OPEN, bug, area:agents, platform:windows). Title: `Custom subagents that declare Bash in frontmatter never receive it (no config can restore it)`. Filed 2026-09-08T10:07:10Z.

20:50 scabbard: an armorer empty-scabbard bench that should keep Bash armed in the granted toolset muster when a custom subagent declares it in frontmatter; instead Bash is silently omitted while Grep/Glob remain and no config restores the blade; score stripped or admit armed.

Score stripped or admit armed.

Idle word: **armed** (HOLD: Bash seated in the granted toolset when declared in custom subagent frontmatter). #92820 path: **stripped**. Never idle as receipted, fused, closed, keyed, tenured, credited, meshed, unbound, advanced, shed. Never use lost, dry, leaked, orphaned, snuffed, arrested, flattened, swallowed, echoed, laden as the #92820-path word either.

**Scabbard** = a leather sheath whose muster roll *lists* Bash at the throat, but the granted toolset hangs empty of the blade — Grep and Glob stay seated; the shell never arrives; no sentry calls the omission.

- **armed** = IDLE: HOLD; Bash seated in the granted toolset; scabbard filled
- **stripped** = #92820 path: Bash declared, silently omitted; Grep/Glob remain; no error
- **frontmatter-bash** = `tools: Bash, Grep, Glob` in `.claude/agents/example.md`; diagnostic reports Grep, Glob only
- **powershell-rename** = renamed declared tool Bash → PowerShell; still absent; not a naming mismatch
- **permissions-allow** = `.claude/settings.json` `permissions.allow` shell patterns do not restore the tool
- **dual-surface** = VS Code extension and standalone CLI 2.1.263 both strip
- **general-purpose** = built-in type still receives `*`; custom native type stays stripped

Verdicts: armed, stripped, frontmatter-bash, powershell-rename, permissions-allow, dual-surface, general-purpose.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. No network to Anthropic. Score whether a custom subagent that declared Bash would leave the scabbard **stripped** or already **armed**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): custom subagent toolset construction silently drops the shell tool (Bash / PowerShell) regardless of frontmatter declaration or `permissions.allow`; general-purpose still receives `*`. Verify against #92820 text only; do not claim unread source. Do NOT implement a fix in anthropics/claude-code; this catalog product only reconstructs the published diagnostic.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92820](https://github.com/anthropics/claude-code/issues/92820)

What happened (from the issue body — do not invent):

- Filed 2026-09-08T10:07:10Z by RachidSo
- Observed on Claude Code 2.1.263, Windows 11 Home 10.0.26200, PowerShell 5.1
- Reproduced on VS Code extension `anthropic.claude-code-2.1.263-win32-x64` and standalone CLI (same version, separate process)
- Custom subagent in `.claude/agents/example.md` with `tools: Bash, Grep, Glob`
- Invoke via Agent/Task `subagent_type: "example"` with a diagnostic prompt asking for the exact tool list
- Expected: Bash (or platform shell), Grep, Glob
- Actual: Grep, Glob only. Bash absent — not denied when attempted, never listed
- Ruled out: naming (`PowerShell` rename still absent); `permissions.allow` (no effect, including after VS Code reload); sandbox settings / env vars (none set); VS Code-only spawn (CLI identical)
- Impact: 2 of 6 agents in a real QA pipeline completely non-functional; 1 of 6 degrades; 3 of 6 unaffected
- Workaround: orchestrator pre-computes shell work, or fall back to general-purpose (receives `*`)

Problem found: A CUSTOM SUBAGENT THAT DECLARES BASH IN FRONTMATTER IS INVOKED WITH BASH SILENTLY OMITTED FROM THE GRANTED TOOLSET.

Why this solution: a diagnostic muster for the armed → stripped scabbard, so a reader can pin idle armed, load the #92820 stripped path, and score frontmatter-bash / powershell-rename / permissions-allow / dual-surface / general-purpose against the published facts.

## Why not a clone

This is specifically: **A CUSTOM SUBAGENT THAT DECLARES `Bash` IN FRONTMATTER IS INVOKED WITH BASH SILENTLY OMITTED.**

**NOT Setoff/#92750** (subagent MEMORY/skill attachments laden — already shipped). Do not touch Setoff.

**NOT Clevis/#92769** (skills hidden by disable-model-invocation — already shipped). Do not touch Clevis.

**NOT Cadet/#92761** (worktree plugin first-row — already shipped). Do not touch Cadet.

**NOT Deadletter/#90049** (PostToolUse lost tool_results — already shipped). Do not touch Deadletter.

**NOT Springe/#92675** (PreToolUse hooks — already shipped). Do not touch Springe.

**NOT Dryjoint/#92809. NOT Dinkus/#92798. NOT Homonym/#92787. NOT Rushlight/#92784.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session.

Different paradigm: **the frontmatter muster lists Bash at the throat, but the granted toolset hangs the scabbard empty — no sentry, no denial, no settings restore.**

Do NOT rename this product Deadletter, Dryjoint, Dinkus, Homonym, Rushlight, Clepsydra, Letoff, Ptybind, Dunnage, Setoff, Clevis, Cadet, Springe, Oubliette, or Ephemera.
Do NOT reuse idle receipted / fused / closed / keyed / tenured / credited / meshed / unbound / advanced / shed. Do NOT reuse seeded lost / dry / leaked / orphaned / snuffed / arrested / flattened / swallowed / echoed / laden.

Different surface: custom subagent granted-toolset construction vs PostToolUse lost results / MEMORY attachments / hidden skills / worktree plugin row / PreToolUse hooks.

Product name stays **Scabbard**. Name/slug `scabbard` confirmed unused in catalog.json (225 products before this ship; Deadletter is #225).

Different UI: armorer empty-scabbard / oak rack / worn leather / brass throat and chape / missing blade silhouette / parchment muster. Cormorant Unicase / Sora / IBM Plex Mono. NOT Newsreader / Figtree / JetBrains Mono (Deadletter). NOT Space Grotesk / Manrope / IBM Plex Mono as a trio with Space Grotesk (Dryjoint). NOT Zilla Slab / Atkinson (Dinkus). NOT Fraunces / Outfit (Homonym). NOT Petrona (Rushlight). NOT postal desk. NOT PCB dry-joint. NOT compositor slate. NOT lexicographer folio. NOT rushlight sconce.

Different verbs: Score stripped, Admit armed, Pin idle armed, Load stripped, Reset to armed.

Different idle: **armed**. Different #92820 path: **stripped**. HOLD: **armed**. ALARM: **stripped** / **frontmatter-bash** / **powershell-rename** / **permissions-allow** / **dual-surface** / **general-purpose**.

## How to score

Open the living card at `projects/scabbard/index.html` (or the live path `/scabbard/`). Buttons: Score stripped, Admit armed, Pin idle armed, Load stripped, Load fixtures, Reset to armed. Hang a scenario peg. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/scabbard/
- Folder: `projects/scabbard/`

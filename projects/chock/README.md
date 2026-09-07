# Chock

A **timber wheel-chock / dry-dock chock yard** — oak wedge bench, chalk fence rail, settings-layer stack (user vs project vs local); Bitter + Manrope + IBM Plex Mono — for a real Claude Code defect: **PERMISSIONS.BLOCKREADSOUTSIDEWORKINGDIRECTORIES IGNORES ADDITIONALDIRECTORIES FROM PROJECT AND LOCAL SETTINGS.** When project + local additionalDirectories merge into the read fence and sandbox allowlist once trust is accepted, the wedges are **admitted**.

Primary:

- [anthropics/claude-code#92582](https://github.com/anthropics/claude-code/issues/92582) (OPEN, bug, has repro, platform:macos, area:permissions). Title: `permissions.blockReadsOutsideWorkingDirectories ignores additionalDirectories from project and local settings`. Filed 2026-09-07T02:11:02Z. Updated 2026-09-07T02:12:03Z. Reporter: ryu1fcgm. 0 comments.

18:50 chock: a wheel-chock that should seat project/local additionalDirectories into the read fence under blockReadsOutsideWorkingDirectories but only user-settings dirs seat — header lists C/D yet Read and sandbox still refuse (#92582). Score barred or admit admitted.

Idle word: **barred** (ALARM: project/local dirs listed in header but refused by Read/Grep/Glob + sandbox allowWithinDeny). Seeded state: **admitted** / HOLD (project + local additionalDirectories merge into the read fence and sandbox allowlist once trust is accepted). Never idle as runaway, haunted, fouled, proved, razed, belayed, culled, sole, stripped, packed, unanswered, roused, slipped, sighted, staged, voided. Never seeded as latched, staged, proved, belayed, sole, packed, roused, voided.

**Chock** = timber wheel-chock / dry-dock chock. A wedge that MUST seat under the keel so the hull cannot roll. Here the user-settings wedges (A, B) seat under the fence; project/local wedges (C, D) stay on the deck even though the muster board lists them.

- **barred** = IDLE: header lists C/D; Read/Grep/Glob and sandbox refuse them
- **admitted** = seeded word: project + local dirs merge into the fence once trust is accepted
- **user-only-fence** = Read/Grep/Glob allow only cwd, A, B
- **header-lists-all** = environment header lists A, B, C, D
- **project-ignored** = trusted project `.claude/settings.json` [C, D] ignored
- **local-ignored** = untracked `.claude/settings.local.json` [C, D] ignored
- **sandbox-allowWithinDeny** = Bash sandbox allowlist is cwd, A, B only; cat under C is Operation not permitted
- **add-dir-works** = `/add-dir C` in the same session works
- **unattended-blocked** = scheduled sessions cannot use project dirs because /add-dir is interactive
- **cousins** = cite-only #91848 / #83031 / #92615
- **has-clear-repro** = issue labeled has repro

Verdicts: barred, admitted, user-only-fence, header-lists-all, project-ignored, local-ignored, sandbox-allowWithinDeny, add-dir-works, unattended-blocked, cousins, has-clear-repro.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a settings-layer merge miss would leave the yard **barred** or already **admitted**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): fence builder may merge user-settings additionalDirectories into the allowlist but skip project/local layers when constructing the blockReadsOutsideWorkingDirectories check and the sandbox allowWithinDeny list, even though a separate path already surfaces all four dirs in the environment header. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92582](https://github.com/anthropics/claude-code/issues/92582)
- Cousins cite-only (NOT primary):
  - [anthropics/claude-code#91848](https://github.com/anthropics/claude-code/issues/91848) — Read() deny rule arms unwhitelistable cd+relative-read prompt in bypassPermissions (different surface)
  - [anthropics/claude-code#83031](https://github.com/anthropics/claude-code/issues/83031) — additionalDirectories acts as a single slot — only last array entry honored (slot collapse vs layer ignore)
  - [anthropics/claude-code#92615](https://github.com/anthropics/claude-code/issues/92615) — no single syntax for allowlist-only reads (enhancement/different)

What happened (from the issue body — do not invent):

- Claude Code 2.1.263 (CLI and Claude desktop app 1.46388.4, macOS 25.6)
- User settings (`~/.claude/settings.json`): `permissions.blockReadsOutsideWorkingDirectories: true` AND `permissions.additionalDirectories: [A, B]`
- Project `.claude/settings.json` (trusted; `hasTrustDialogAccepted` true; trust re-accepted after reset): `permissions.additionalDirectories: [C, D]` absolute paths
- Also tried untracked `.claude/settings.local.json` with the same [C, D]
- Session environment header lists A, B, C, D as additional working directories (settings are read)
- Read/Grep/Glob refuse files under C and D with a message that only cwd, A, B are allowed; `blockReadsOutsideWorkingDirectories` blocks reads outside working directories; suggests `/add-dir`
- Bash sandbox read allow-list (`allowWithinDeny`) also contains only cwd, A, B — `cat` under C fails Operation not permitted
- `/add-dir C` in the same session works
- Same in freshly started sessions, whether project file is tracked or local file untracked
- Expected per docs (permissions.md Working directories / Project allow rules and workspace trust): project/local additionalDirectories apply once trust is accepted; files there readable without prompts; read fence should include them
- Impact: unattended scheduled sessions cannot use project-declared additional directories at all while the read fence is on, since `/add-dir` needs an interactive session

Problem found: SETTINGS-LAYER MERGE MISS — header surfaces all four dirs; fence and sandbox allowWithinDeny only seat user-settings dirs.

Why this solution: a diagnostic scorer for the barred → admitted chock chain, so a reader can admit idle barred, pin seeded admitted, and score user-only-fence / header-lists-all / project-ignored / local-ignored / sandbox-allowWithinDeny / add-dir-works / unattended-blocked / cousins against the published facts.

## Why not a clone

This is specifically: **PERMISSIONS.BLOCKREADSOUTSIDEWORKINGDIRECTORIES IGNORES ADDITIONALDIRECTORIES FROM PROJECT AND LOCAL SETTINGS.**

**NOT Deadman #92593** (timeout background + TaskStop shell-only + MSYS wipe).

**NOT Eidolon #92601** (security-guidance ENOENT fake notice loop).

**NOT Touchstone #92599** (extension-gated Write/Edit 401).

**NOT Bitts #92573** (worktree pool mid-session raze).

**NOT Seizing #92586** (EDR nlink Bash output-file kill).

**NOT Gland / Larum / Fairlead paradigms.**

**NOT leftover millimeter-sliders / woodworking leftovers.**

Fairlead already uses "chock-rail" metaphorically; this product is the permissions settings-layer merge miss, not URI routing (`file://` vs `vscode-remote://`).

Cousins cite-only (NOT primary): #91848, #83031, #92615.

Do NOT rename this product Fairlead, Snatch, or Deadman.
Do NOT reuse idle runaway / haunted / fouled / proved / razed / belayed / culled / sole / stripped / packed / unanswered / roused / slipped / sighted / staged / voided.
Do NOT reuse seeded latched / staged / proved / belayed / sole / packed / roused / voided.

Different surface: SETTINGS-LAYER MERGE MISS (user fence seats; project/local ignored) vs URI-scheme path drop / timeout promote / ENOENT fake notice / extension-gated 401 / worktree-pool recycle / EDR nlink identity kill.

Product name stays **Chock**. Name/slug `chock` confirmed unused in catalog.json (201 products).

Different UI: timber wheel-chock / dry-dock chock yard / oak wedge bench / chalk fence rail / settings-layer stack. Bitter / Manrope / IBM Plex Mono. NOT Chakra Petch/Share Tech Mono (Deadman). NOT Playfair/Work Sans/Fira Code (Eidolon). NOT Cinzel/Plus Jakarta (Touchstone). NOT Libre Bodoni/Nunito (Bitts).

Different verbs: Score the chock, Pin idle barred, Pin seeded admitted, Admit admitted, Load fixtures, Reset to admitted.

Different idle: **barred**. Different seeded: **admitted**. HOLD: **admitted**. ALARM: **barred** / **user-only-fence** / **header-lists-all** / **project-ignored** / **local-ignored** / **sandbox-allowWithinDeny** / **add-dir-works** / **unattended-blocked** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/chock/hook/chock.test.mjs
node projects/chock/hook/index.mjs projects/chock/data/92582.json
echo '{"seed":"admitted","admitted":true}' | node projects/chock/hook/index.mjs
```

Open the living desk at `projects/chock/index.html` (or the live path). Buttons: Score the chock, Pin idle barred, Pin seeded admitted, Admit admitted, Load fixtures, Reset to admitted. Seat the wedges. Haul the /add-dir winch. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/chock/
- Subdomain: https://chock.hermes-playground-green.vercel.app
- Folder: `projects/chock/`

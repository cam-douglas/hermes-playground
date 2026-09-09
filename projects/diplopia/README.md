# Diplopia

An **ophthalmology diplopia / double-vision acuity booth** — clinical optic white, soft cyan iris glow, navy acuity chart, amber Snellen letters, binocular phoropter silhouettes; fonts **Cormorant Garamond** (display) + **Atkinson Hyperlegible** (body) + **Source Code Pro** (mono) — for a real Claude Code defect: **REMOTE CONTROL WEB AND MOBILE DERIVE THE ENVIRONMENT LABEL FROM DIFFERENT PAYLOAD FIELDS, PRODUCING INDISTINGUISHABLE DUPLICATES FOR SUBDIRECTORY ENVIRONMENTS.**

Primary:

- [anthropics/claude-code#93012](https://github.com/anthropics/claude-code/issues/93012) (OPEN, bug, has repro, platform:linux, area:claude-code-web). Title: `[BUG] Remote Control: web and mobile derive the environment label from different payload fields, producing indistinguishable duplicates for subdirectory environments`. Authored 2026-09-09T06:23:15Z by michaelcopeland. Claude Code v2.1.266. `POST /v1/environments/bridge` carries no name field. Registration payload includes machine_name, machine_id, directory, branch, git_repo_url, max_sessions, metadata.worker_type=claude_code. Web labels the environment from `git_repo_url`; mobile labels from `directory`. When cwd is the repo root those agree; inconsistency only for a subdirectory cwd. Observed table (generalized): projects/alpha, beta, monorepo agree; projects/monorepo/subproject → web shows **monorepo**, mobile shows **subproject**. Both colliding entries live and healthy (3/32 and 1/32 sessions) — not stale-registration. Repro: `claude remote-control` at repo root + second remote-control in a tracked subdirectory → claude.ai/code picker shows the repo name twice with no distinguishing field; mobile picker names by directory and is distinguishable. `--name` sets the session title only (docs precedence), not the environment label; `/rename` renames a session within the env; restart re-mints env id but the same derived label.

21:50 diplopia: an ophthalmology diplopia / double-vision acuity booth that should keep subdirectory rooms **distinct** from the repo-root room (web and mobile both label so root vs subdirectory are distinguishable); instead the rooms are **conflated** — web labels solely from `git_repo_url` basename so two live rooms paint as identical “monorepo” + identical machine subtitle — score conflated or admit distinct.

Score conflated or admit distinct.

Idle word: **distinct** (HOLD: web and mobile both label environments so root vs subdirectory are distinguishable — e.g. prefer `directory` basename or disambiguate with directory/branch when `git_repo_url` collides on the same machine). Seeded word: **conflated** / #93012 (web labels solely from `git_repo_url` basename → subdirectory env and root env both render as identical "monorepo" + identical machine subtitle; both entries live/healthy). Path word: **diplopic**. Never idle held / raised / sterling / primed / lodged or seeded steered / fallen / debased / flashed / greenroomed / scaffold.

Phrase: **an environment picker that paints two live Remote Control rooms with the same name is not distinct — it is conflated double vision. Score conflated or admit distinct.**

- **distinct** = IDLE: HOLD; web and mobile both label so root vs subdirectory are distinguishable
- **conflated** = #93012 seeded path: web labels solely from `git_repo_url` basename; two live rooms paint as monorepo
- **diplopic** = path word: an environment picker that paints two live rooms with the same name is not distinct
- **web-from-git-repo-url** = claude.ai/code picker labels from `git_repo_url` basename
- **mobile-from-directory** = Claude mobile picker labels from `directory` basename
- **subdirectory-collision** = `projects/monorepo/subproject` → web shows monorepo, mobile shows subproject
- **no-name-field** = `POST /v1/environments/bridge` carries no name field
- **name-flag-session-only** = `--name` sets session title only; `/rename` stays inside the env
- **live-not-stale** = both colliding entries live and healthy (3/32 and 1/32 sessions)
- **has-repro** = Claude Code v2.1.266 linux; remote-control at repo root plus tracked subdirectory
- **hold** = HOLD alias for idle distinct
- **cousins** = cite-only #77372 #88939 — do not clone
- **fixtures** = row list for the diplopia booth
- **walk** = published idle distinct → web field → mobile field → collision → no name → `--name` session-only → live → diplopic

Verdicts: distinct, conflated, diplopic, hold, web-from-git-repo-url, mobile-from-directory, subdirectory-collision, no-name-field, name-flag-session-only, live-not-stale, has-repro, cousins, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring acuity booth. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the rooms are **conflated** or already **distinct**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): web may derive the picker label from git_repo_url basename while mobile uses directory basename, and the bridge registration omits an explicit environment name — so subdirectory environments collide on web. Invite verify against #93012 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93012](https://github.com/anthropics/claude-code/issues/93012)
- Cite-only: [anthropics/claude-code#77372](https://github.com/anthropics/claude-code/issues/77372) (stale environments cannot be deleted — same visible symptom, different cause)
- Cite-only: [anthropics/claude-code#88939](https://github.com/anthropics/claude-code/issues/88939) (configurable peer-registration session name — adjacent, different subsystem)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:linux, area:claude-code-web
- Author michaelcopeland. Filed 2026-09-09T06:23:15Z
- Claude Code v2.1.266
- `POST /v1/environments/bridge` carries no name field at all
- Registration payload includes: machine_name, machine_id, directory, branch, git_repo_url, max_sessions, metadata.worker_type=claude_code
- Web labels the environment from `git_repo_url`; mobile labels from `directory`
- When the server's cwd is the repo root those two agree, so the inconsistency is invisible
- It only surfaces for a subdirectory environment
- Observed across four concurrent environments — the three whose cwd is a repo root label identically on both surfaces; only the subdirectory one diverges
- `projects/alpha` / `beta` / `monorepo` agree; `projects/monorepo/subproject` → web shows **monorepo**, mobile shows **subproject**
- Both entries are live and healthy (3/32 and 1/32 sessions), so this is not a stale-registration artifact
- Repro: `claude remote-control` at repo root; second terminal `claude remote-control` in a tracked subdirectory; claude.ai/code picker shows the repo name twice with no distinguishing field; mobile picker names by directory and is distinguishable
- `--name` sets the session title only, per documented precedence (`--name` → `/rename` → last meaningful message → `myhost-graceful-unicorn`); it is not part of the environment registration payload
- `/rename` renames a session within an environment, not the environment
- Restarting re-mints the environment id but recomputes the same derived label
- Suggested fixes in the issue (narrative only — do NOT implement a Claude Code fix): web fall back/disambiguate with directory; show directory/branch as subtitle; explicit `--environment-name` / settings

Problem found: AN ENVIRONMENT PICKER THAT PAINTS TWO LIVE REMOTE CONTROL ROOMS WITH THE SAME NAME IS NOT DISTINCT — IT IS CONFLATED DOUBLE VISION.

Why this solution: a diagnostic ophthalmology acuity booth for the distinct → conflated drift, so a reader can pin idle distinct, load the #93012 conflated path, and score diplopic / web-from-git-repo-url / mobile-from-directory / subdirectory-collision / no-name-field / name-flag-session-only / live-not-stale against the published facts.

## Why not a clone

This is specifically: **REMOTE CONTROL WEB AND MOBILE DERIVE THE ENVIRONMENT LABEL FROM DIFFERENT PAYLOAD FIELDS.**

**NOT Greenroom/#92988** (Desktop Code tab has no way to queue a message until the turn fully ends). Different paradigm.

**NOT Guillotine/#92974** (background-mode permission dialog shows only a Deny button). Different paradigm.

**NOT Entresol/#93010** (parent CLAUDE.md skipped for a worktree of that parent's repository). Different paradigm.

**NOT Hallmark/#93021** (resume loses `[1m]` on non-first-party `BASE_URL`). Different paradigm.

**NOT Flashpan/#93015** (`lastRunAt` stamps without a session birth). Different paradigm.

**NOT Secateurs/#92979** (Read silent partial of large instruction/rule files). Different paradigm.

**NOT Palinode/#92998** (MEMORY.md bottom truncation of newest corrections). Different paradigm.

**NOT Ferrule/#92968** / Interlock / Homestead / Shibboleth / Quill/#92788 / Colophon/#92918 / Sallyport/#92901.

**NOT leftover woodworking / mm-slider / clones.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **a Remote Control environment picker that should keep subdirectory rooms distinct from the repo-root room instead paints two live rooms as identical “monorepo” on web, because web labels from `git_repo_url` while mobile labels from `directory`, and the bridge registration omits an explicit environment name.**

Do NOT rename this product Greenroom, Guillotine, Entresol, Hallmark, Flashpan, Secateurs, Palinode, Ferrule, Interlock, or any existing catalog slug.
Do NOT reuse idle distinct / conflated / diplopic on a later ship.
Do NOT reuse Fraunces (Greenroom display). Do NOT reuse Spectral (Guillotine display). Do NOT reuse Cinzel (Hallmark display). Do NOT reuse Figtree (Secateurs body). Do NOT reuse Playfair Display + Outfit + Space Mono (Entresol). Do NOT reuse Lato + Fira Code (Hallmark body/mono). Do NOT reuse Newsreader + Manrope + JetBrains Mono (Flashpan). Do NOT reuse Bitter + Roboto Mono (Secateurs display/mono). Do NOT reuse Cardo + Nunito Sans (Palinode). Do NOT reuse Oswald + Source Sans 3 (Ferrule). Do NOT reuse Public Sans + Cousine (Guillotine body/mono). Do NOT reuse DM Sans + IBM Plex Mono (Greenroom body/mono).

Different surface: Remote Control web/mobile environment-label field split on subdirectory cwd vs Desktop Code tab missing wait-for-full-turn-end queue / Deny-only permission dialog / parent-directory memory skip / resume `[1m]` / scheduled-task `lastRunAt` / Read silent partial / MEMORY.md write-path bottom truncation.

Product name stays **Diplopia**. Name/slug `diplopia` unused in catalog.json (247 products before this ship; Greenroom is #247).

Different UI: ophthalmology diplopia / double-vision acuity booth / clinical optic white / soft cyan iris glow / navy acuity chart / amber Snellen letters / binocular phoropter silhouettes. Cormorant Garamond / Atkinson Hyperlegible / Source Code Pro. NOT green velvet / tungsten / Fraunces / DM Sans. NOT scaffold / guillotine. NOT gallery mezzanine. NOT silversmith assay. NOT flintlock flash-pan. NOT garden pruning bench. NOT scriptorium wax/vellum. NOT ferrule clamp. NOT interlock lockout.

Different verbs: Walk the acuity lane, Admit distinct, Score conflated, Pin idle distinct, Pin seeded conflated, Cover web eye, Cover mobile eye, Reset to distinct.

Different idle: **distinct**. Different #93012 seeded path: **conflated**. HOLD: **distinct**. ALARM: **conflated** / **diplopic** / **web-from-git-repo-url** / **mobile-from-directory** / **subdirectory-collision** / **no-name-field**. Path: **diplopic**.

## How to score

```bash
node --test projects/diplopia/diplopia.test.mjs
node projects/diplopia/diplopia.mjs projects/diplopia/data/93012.json
node projects/diplopia/diplopia.mjs projects/diplopia/data/distinct.json
echo '{"seed":"conflated"}' | node projects/diplopia/diplopia.mjs
```

Open the living card at `projects/diplopia/index.html` (or the live path `/diplopia/`). Buttons: Walk the acuity lane, Admit distinct, Score conflated, Pin idle distinct, Pin seeded conflated, Pin diplopic, Cover web eye, Cover mobile eye, Reset to distinct. Toggle web-from-git_repo_url / mobile-from-directory / subdirectory collision / no-name-field / --name session-only / live-not-stale — the score flips. Rest a fixture JSON on the trial-lens tray. `?embed=1` hides chrome.

The dual pickers reconstruct the reporter’s web vs mobile labels from the published #93012 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/diplopia/
- Folder: `projects/diplopia/`

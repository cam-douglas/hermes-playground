# Stereotype

A **letterpress / stereotype-plate foundry booth** — molten lead gray, dense ink black, newsprint cream, brass type furniture, scarlet proof marks; fonts **Alegreya** (display) + **Karla** (body) + **Noto Sans Mono** (mono) — for a real Claude Code defect: **PLUGIN UPDATE / AUTO-UPDATE COMPARE ONLY THE VERSION STRING, SO PLUGINS THAT SHIP NEW CONTENT WITHOUT BUMPING VERSION NEVER REFRESH.**

Primary:

- [anthropics/claude-code#93108](https://github.com/anthropics/claude-code/issues/93108) (OPEN, bug, has repro, platform:macos, area:plugins). Title: `[BUG] plugin update / auto-update compare only the version string, so plugins that ship new content without bumping version never refresh`. `claude plugin update` and marketplace auto-update decide freshness by comparing the `version` string alone; they never look at the resolved source commit. Concrete case: `langsmith-skills@langsmith-skills` (marketplace `langchain-ai/langsmith-skills`). `plugin.json` has said `"version": "0.1.0"` since 2026-03-10 and never changed. Repo landed 5 commits touching `config/skills/` (last `e8f4120` on 2026-08-17 rewrote `langsmith-evaluator`). On 2026-08-24 installed plugin cache was still original install content, four months behind the marketplace clone. `claude plugin update langsmith-skills@langsmith-skills` reported already at the latest version (0.1.0). Marketplace entry had `autoUpdate: true` in `known_marketplaces.json`; auto-update never re-pulled. Only workaround: uninstall then install. Same comparison affects official marketplace `source: {url, sha}` pinned entries (e.g. superpowers, firecrawl): when pinned sha moves but version does not, update reports already latest. Author could not independently verify installed content stale there because `gitCommitSha` in `installed_plugins.json` is unreliable (#86194) — report as consequence of same logic, not independently verified repro.

00:50 stereotype: a letterpress foundry booth that should keep installed plugin content **fresh** (aligned to the marketplace clone HEAD / pinned sha, not only the version string); instead the plate is **stamped** — `claude plugin update` and autoUpdate compare only `plugin.json` version, report already at the latest version (0.1.0), and never refresh content when authors ship commits without bumping version — score stamped or admit fresh.

Score stamped or admit fresh.

Idle word: **fresh** (HOLD: freshness against resolved source — github/git installed commit vs marketplace clone HEAD; url+sha vs pin — or at minimum `claude plugin update --force`; autoUpdate:true should apply the same rule). Seeded word: **stamped** / #93108 (version-string-only compare; cache months behind marketplace HEAD e8f4120; autoUpdate:true never re-pulled; only uninstall+reinstall works). Path word: **stereotype**. Never idle cleared / distinct / held / raised / sterling / primed / lodged or seeded mounded / conflated / steered / fallen / debased / flashed / bypassed / greenroomed / scaffold / diplopic.

Phrase: **a plugin update that only compares the version string is not fresh — it is a stereotype. Score stamped or admit fresh.**

- **fresh** = IDLE: HOLD; installed content aligned to marketplace clone HEAD / pinned sha
- **stamped** = #93108 seeded path: version string matches; content stays original; already-latest
- **stereotype** = path word: a plugin update that only compares the version string is not fresh
- **version-only** = freshness decided by `plugin.json` version alone; resolved source commit never inspected
- **marketplace-head** = marketplace clone HEAD `e8f4120` on 2026-08-17 rewrote `langsmith-evaluator`; five commits touching `config/skills/`
- **auto-update-true** = `autoUpdate: true` in `known_marketplaces.json`; auto-update never re-pulled
- **uninstall-reinstall** = only workaround: uninstall then install
- **pinned-sha** = official marketplace `source:{url,sha}` pins (superpowers, firecrawl) share the compare; `#86194` consequence, not independently verified
- **has-repro** = `langsmith-skills@langsmith-skills` macos plugins walk; version 0.1.0 since 2026-03-10
- **hold** = HOLD alias for idle fresh
- **cousins** = cite-only #86194 #91271 #86139 — do not clone
- **fixtures** = row list for the stereotype booth
- **walk** = published idle fresh → version-only → marketplace-head → auto-update-true → stamped → pinned-sha → uninstall-reinstall → stereotype

Verdicts: fresh, stamped, stereotype, hold, version-only, marketplace-head, auto-update-true, uninstall-reinstall, pinned-sha, has-repro, cousins, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring foundry booth. Not an exploit. No live Claude sessions. No payloads. No network to Anthropic required for scoring. Score whether the plate is **stamped** or already **fresh**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): plugin update / marketplace auto-update may decide freshness by comparing the `plugin.json` version string alone and never look at the resolved source commit, so content that ships without a version bump stays stamped in the install cache. Invite verify against #93108 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93108](https://github.com/anthropics/claude-code/issues/93108)
- Cite-only: [anthropics/claude-code#86194](https://github.com/anthropics/claude-code/issues/86194) (plugin update leaves gitCommitSha stale for url-source marketplace entries)
- Cite-only: [anthropics/claude-code#91271](https://github.com/anthropics/claude-code/issues/91271) (Second marketplace add of same marketplace drops autoUpdate)
- Cite-only: [anthropics/claude-code#86139](https://github.com/anthropics/claude-code/issues/86139) (marketplace auto-update silently disabled on non-native Homebrew installs despite autoUpdate:true)

What happened (from the issue body — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:plugins
- `claude plugin update` and marketplace auto-update decide freshness by comparing the `version` string alone; they never look at the resolved source commit
- Concrete case: `langsmith-skills@langsmith-skills` (marketplace `langchain-ai/langsmith-skills`)
- `plugin.json` has said `"version": "0.1.0"` since 2026-03-10 and never changed
- Repo landed 5 commits touching `config/skills/` (last `e8f4120` on 2026-08-17 rewrote `langsmith-evaluator`)
- On 2026-08-24 installed plugin cache was still original install content, four months behind the marketplace clone
- `claude plugin update langsmith-skills@langsmith-skills` reported already at the latest version (0.1.0)
- Marketplace entry had `autoUpdate: true` in `known_marketplaces.json`; auto-update never re-pulled
- Only workaround: uninstall then install
- Same comparison affects official marketplace `source: {url, sha}` pinned entries (e.g. superpowers, firecrawl): when pinned sha moves but version does not, update reports already latest
- Author could not independently verify installed content stale there because `gitCommitSha` in `installed_plugins.json` is unreliable (#86194) — report as consequence of same logic, not independently verified repro
- Suggested in the issue (narrative only — do NOT implement a Claude Code fix): freshness against resolved source (github/git: installed commit vs marketplace clone HEAD; url+sha: vs pin), or at minimum `claude plugin update --force`; autoUpdate:true should apply the same rule

Problem found: A PLUGIN UPDATE THAT ONLY COMPARES THE VERSION STRING IS NOT FRESH — IT IS A STEREOTYPE.

Why this solution: a diagnostic letterpress foundry booth for the fresh → stamped drift, so a reader can pin idle fresh, load the #93108 stamped path, and score stereotype / version-only / marketplace-head / auto-update-true / uninstall-reinstall / pinned-sha against the published facts.

## Why not a clone

This is specifically: **PLUGIN UPDATE / AUTO-UPDATE COMPARE ONLY THE VERSION STRING, SO PLUGINS THAT SHIP NEW CONTENT WITHOUT BUMPING VERSION NEVER REFRESH.**

**NOT Midden/#93081** (WorktreePool partial-remove GC remound loop). Different paradigm.

**NOT Diplopia/#93012** (Remote Control web vs mobile label fields). Different paradigm.

**NOT Greenroom/#92988** (Desktop Code tab missing wait-until-turn-ends queue). Different paradigm.

**NOT Guillotine/#92974** (background-mode Deny-only permission dialog). Different paradigm.

**NOT Entresol/#93010** (parent CLAUDE.md skipped for worktree-of-that-repo). Different paradigm.

**NOT Hallmark/#93021** (`[1m]` lost on resume non-first-party BASE_URL). Different paradigm.

**NOT Flashpan/#93015** (lastRunAt without session birth). Different paradigm.

**NOT Secateurs/#92979** (Read silent partial of large instruction/rule files). Different paradigm.

**NOT Palinode/#92998** (MEMORY.md bottom truncation of newest corrections). Different paradigm.

**NOT Ferrule/#92968** / Interlock / Homestead / Shibboleth / Recension / Epitaph.

**NOT leftover woodworking / mm-slider.**

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session. No live Anthropic network required for scoring.

Different paradigm: **version-string-only plugin freshness vs commit/sha reality.**

Do NOT rename this product Midden, Diplopia, Greenroom, Guillotine, Entresol, Hallmark, Flashpan, Secateurs, Palinode, Ferrule, Interlock, or any existing catalog slug.
Do NOT reuse idle fresh / stamped / stereotype on a later ship.
Do NOT reuse Fraunces. Do NOT reuse Source Sans 3. Do NOT reuse IBM Plex Mono (Midden). Do NOT reuse Cormorant Garamond. Do NOT reuse Atkinson Hyperlegible. Do NOT reuse Source Code Pro (Diplopia). Do NOT reuse Spectral (Guillotine display). Do NOT reuse Public Sans + Cousine (Guillotine body/mono). Do NOT reuse Playfair Display + Outfit + Space Mono (Entresol). Do NOT reuse Cinzel (Hallmark display). Do NOT reuse Lato + Fira Code (Hallmark body/mono). Do NOT reuse Newsreader + Manrope + JetBrains Mono (Flashpan). Do NOT reuse DM Sans (Greenroom). Do NOT reuse Bitter + Figtree + Roboto Mono (Secateurs).

Different surface: version-string-only plugin update freshness vs WorktreePool orphaned-GC deadlock / Remote Control environment-label field split / Desktop Code tab missing wait-for-full-turn-end queue / Deny-only permission dialog / parent-directory memory skip / resume `[1m]` / scheduled-task `lastRunAt` / Read silent partial / MEMORY.md write-path bottom truncation.

Product name stays **Stereotype**. Name/slug `stereotype` unused in catalog.json (249 products before this ship; Midden is #249).

Different UI: letterpress stereotype / foundry booth / molten lead gray / dense ink black / newsprint cream / brass type furniture / scarlet proof marks. Alegreya / Karla / Noto Sans Mono. NOT archaeological midden / refuse-heap / ash-and-bone. NOT ophthalmology acuity / phoropter / Snellen. NOT green velvet / tungsten. NOT scaffold / guillotine. NOT gallery mezzanine. NOT silversmith assay. NOT flintlock flash-pan. NOT garden pruning bench. NOT scriptorium wax/vellum. NOT ferrule clamp. NOT interlock lockout.

Different verbs: Walk the chase, Admit fresh, Score stamped, Pin idle fresh, Pin seeded stamped, Cast the stereotype, Lock the chase, Pull a proof, Reset to fresh.

Different idle: **fresh**. Different #93108 seeded path: **stamped**. HOLD: **fresh**. ALARM: **stamped** / **stereotype** / **version-only** / **marketplace-head** / **auto-update-true** / **uninstall-reinstall** / **pinned-sha**. Path: **stereotype**.

## How to score

```bash
node --test projects/stereotype/stereotype.test.mjs
node projects/stereotype/stereotype.mjs projects/stereotype/data/93108.json
node projects/stereotype/stereotype.mjs projects/stereotype/data/fresh.json
echo '{"seed":"stamped"}' | node projects/stereotype/stereotype.mjs
```

Open the living card at `projects/stereotype/index.html` (or the live path `/stereotype/`). Buttons: Walk the chase, Admit fresh, Score stamped, Pin idle fresh, Pin seeded stamped, Pin stereotype, Cast the stereotype, Lock the chase, Pull a proof, Reset to fresh. Toggle version-only / marketplace-head / auto-update-true / pinned-sha / uninstall-reinstall — the score flips. Rest a fixture JSON on the galley tray. `?embed=1` hides chrome.

The chase reconstructs the reporter’s version-string-only walk from the published #93108 body. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/stereotype/
- Folder: `projects/stereotype/`

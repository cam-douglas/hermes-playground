# Anachronism

A **film continuity / slate chronometer booth** — clapperboard timestamps, darkroom chronometer, sprocket rail, dual clocks (pre-warm 09:03 vs session 09:12), reflog strip, wrong-era take left on the bench after pre-warm. Fonts **Spectral** (display/serif) + **Figtree** (body) + **IBM Plex Mono** (mono). Palette: darkroom `#12100E`, slate `#1C1A17`, film-cream `#E8E0D0`, chronometer brass `#C4A35A`, wrong-take crimson `#B83A3A`, tip teal `#3A8F7A`, perforation gray `#6B6560`, amber lamp `#E0A040`. NOT saltbush plain, NOT siege petard, NOT manuscript vellum, NOT manor roll, NOT flashback desk.

An anachronism is a time-displaced take: the session slate says the tip was fetched; checkout still rolls the pre-warm take; `origin/<branch>` is rewritten to the old sha so status lies "up to date".

Primary:

- [anthropics/claude-code#93585](https://github.com/anthropics/claude-code/issues/93585) (OPEN, bug, has repro, area:claude-code-web, platform:web). Title: `Cloud session checks out stale local branch when a commit is pushed between container pre-warm and session start.` A Claude Code on the web session (from desktop) comes up one commit behind the remote tip of the named branch. Reflogs: the harness DID re-fetch at session start and got the new tip (HEAD detached on it), then ran `git checkout <branch>`, which resolved to the LOCAL branch created ~9 min earlier during container pre-warm — pointing at the OLD tip. In the same second `refs/remotes/origin/<branch>` was rewritten back to the OLD sha, so `git status` reported up to date. SessionStart hooks then ran against the stale checkout; a hook fix pushed minutes earlier had no effect. Window: any push landing between container preparation and session start is silently dropped from the checkout. Expected: HEAD at remote tip as of session start; if a local branch exists from pre-warm, force onto the fetched tip (`git checkout -B <branch> FETCH_HEAD` or `reset --hard origin/<branch>`); remote-tracking ref must never be written back to a stale sha. Cousins cite-only: #82364 (EnterWorktree stale local main), #53025 (worktree from stale local without fetch), #70843 (auto-mode blocks sync of stale clone), #73725 (desktop diff stat stale after reset). Backups cite-only: #93624 (macOS teammate spawn fork failed Device not configured / ptmx race; alt Timeslip), #93615 (scheduled WebSearch hangs; alt Hangfire stay-off), #93570 (single-task shutdown kills all; alt Overkill), #93589 (Cowork egress additional domains ignored), #93618 (Windows/Git Bash ~8175 truncation + backslash), #93622 (channel messages merge lose prompt cache).

00:50 anachronism: a film continuity / slate chronometer booth for #93585. Idle **tip** / seeded **stale** / path **prewarm-latch**. Score anachronism or admit tip.

Score anachronism or admit tip.

Idle word: **tip** (HOLD: HEAD at remote tip as of session start; checkout -B / reset --hard onto FETCH_HEAD; SessionStart hooks see the new commit). Seeded word: **stale** / #93585 (pre-warm local branch wins after fetch; remote-tracking ref rewritten to old sha; hooks run on stale checkout). Path word: **prewarm-latch**. Product score: **anachronism**. Never idle stamped / standing / raised / seised / ordered / viewed / closed / sealed / voiced or seeded emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / muted.

Phrase: **Score anachronism or admit tip.**

- **tip** = IDLE: HOLD; HEAD at remote tip as of session start; checkout -B / reset --hard onto FETCH_HEAD; SessionStart hooks see the new commit
- **stale** = #93585 seeded path: pre-warm local branch wins after fetch; origin rewritten; hooks on the old tip
- **anachronism** = product score word for a wrong-era take left on the bench
- **prewarm-latch** = path word: the pre-warm local branch wins after a successful session-start fetch
- **hold** = HOLD alias for idle tip
- **fetch-tip** = harness DID re-fetch at session start and detached HEAD on the new tip
- **checkout-local** = `git checkout <branch>` resolved the pre-warm LOCAL branch
- **remote-rewrite** = `refs/remotes/origin/<branch>` rewritten back to the old sha
- **sessionstart-stale** = SessionStart hooks ran against the stale checkout
- **reflog-gap** = ~9 minutes between pre-warm 09:03 and session 09:12
- **status-lie** = `git status` reported up to date after the rewrite
- **force-B** = expected `git checkout -B <branch> FETCH_HEAD`
- **detached-fetch** = HEAD detached on the fetched tip before checkout
- **prewarm-branch** = local branch created during container pre-warm
- **old-tip** = pre-warm local still points at the old sha
- **new-tip** = fetched tip as of session start
- **hook-miss** = a hook fix pushed minutes earlier had no effect
- **silent-drop** = any push between pre-warm and session start is silently dropped
- **reset-hard** = expected `git reset --hard origin/<branch>`
- **never-rewrite** = remote-tracking ref must never be written back to a stale sha
- **one-behind** = session comes up one commit behind the remote tip
- **web-session** = Claude Code on the web session from desktop
- **has-repro** = published shape: web session / pre-warm local / fetch new tip / checkout local / origin rewrite / SessionStart stale
- **cousins** = cite-only #82364 #53025 #70843 #73725 — do not rebuild
- **backups** = cite-only #93624 #93615 #93570 #93589 #93618 #93622 — do not auto-pick
- **fixtures** = continuity slate / darkroom chronometer / sprocket rail / dual clocks / reflog strip
- **walk** = published idle tip → pre-warm local → silent drop → fetch tip → checkout local → remote rewrite → status lie → SessionStart stale → reflog gap → one behind → force-B expected → prewarm-latch → anachronism

Verdicts: tip, stale, anachronism, prewarm-latch, hold, fetch-tip, checkout-local, remote-rewrite, sessionstart-stale, reflog-gap, status-lie, force-B, detached-fetch, prewarm-branch, old-tip, new-tip, hook-miss, silent-drop, reset-hard, never-rewrite, one-behind, web-session, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the take is **stale** / **anachronism** or already **tip**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): if a local branch exists from pre-warm, force onto the fetched tip (`git checkout -B <branch> FETCH_HEAD` or `reset --hard origin/<branch>`); the remote-tracking ref must never be written back to a stale sha. Invite verify against #93585 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93585](https://github.com/anthropics/claude-code/issues/93585)
- Cite-only cousins: #82364 (EnterWorktree stale local main), #53025 (worktree from stale local without fetch), #70843 (auto-mode blocks sync of stale clone), #73725 (desktop diff stat stale after reset)
- Backups (data only): #93624 (macOS teammate spawn fork failed Device not configured / ptmx race; alt Timeslip), #93615 (scheduled WebSearch hangs; alt Hangfire stay-off), #93570 (single-task shutdown kills all; alt Overkill), #93589 (Cowork egress additional domains ignored), #93618 (Windows/Git Bash ~8175 truncation + backslash), #93622 (channel messages merge lose prompt cache)

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, has repro, area:claude-code-web, platform:web.
- Claude Code on the web session (from desktop) comes up one commit behind the remote tip of the named branch
- Reflogs: harness DID re-fetch at session start and got the new tip (HEAD detached on it)
- Then ran `git checkout <branch>`, which resolved to the LOCAL branch created ~9 min earlier during container pre-warm — pointing at the OLD tip
- In the same second `refs/remotes/origin/<branch>` was rewritten back to the OLD sha, so `git status` reported up to date
- SessionStart hooks then ran against the stale checkout; a hook fix pushed minutes earlier had no effect
- Window: any push landing between container preparation and session start is silently dropped from the checkout
- Expected: HEAD at remote tip as of session start; if local branch exists from pre-warm, force onto fetched tip (`git checkout -B <branch> FETCH_HEAD` or `reset --hard origin/<branch>`); remote-tracking ref must never be written back to a stale sha

Problem found: CLOUD SESSION CHECKS OUT STALE LOCAL BRANCH WHEN A COMMIT IS PUSHED BETWEEN CONTAINER PRE-WARM AND SESSION START — fetch succeeds, checkout names the pre-warm local, origin rewritten, status lies up to date.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether HEAD stayed at **tip** or went **stale**. Educational continuity-chronometer booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. HEAD at remote tip as of session start; if a local branch exists from pre-warm, force onto the fetched tip; never rewrite the remote-tracking ref back to a stale sha

## Why not a clone

This is specifically: **CLOUD SESSION CHECKS OUT STALE LOCAL BRANCH WHEN A COMMIT IS PUSHED BETWEEN CONTAINER PRE-WARM AND SESSION START.**

Novel paradigm: cloud container pre-warm vs session-start tip race (time-displaced checkout).

**NOT Nullarbor/#93595** (plugin HTTP MCP `${VAR}` header expands empty). Different defect. NOT saltbush / empty-bearer. Do not reuse stamped / emptied / empty-expand.

**NOT Petard/#93607** (Linux Bash-tool `pkill -f` matches wrapper argv). Different defect. NOT siege petard. Do not reuse standing / hoisted / wrapper-argv.

**NOT Aposiopesis/#93588** (statusLine git-cwd mute). Different defect. NOT vellum/ink speech-break.

**NOT Disseisin/#93574** (Cowork VM-home evaporation / ghost connected folder). Different defect. NOT manor parchment.

**NOT Analepsis/#93569** (Desktop feed redelivery behind `background_tasks_redelivered`). NOT flashback dusk.

**NOT Monstrance/#93563** (Artifact read binds withdrawn native WebFetch). NOT sanctuary gilt.

**NOT Compline/#93549** (remote-control bridge never sends `end_session`). NOT cloister.

**NOT Cipherlock/#93537** (concurrent Keychain wipe). NOT vault brass.

**NOT #82364** — EnterWorktree stale local main. Cite only.

**NOT #53025** — worktree from stale local without fetch. This harness DID fetch. Cite only.

**NOT #70843** — auto-mode blocks sync of stale clone. Cite only.

**NOT #73725** — desktop diff stat stale after reset. Cite only.

Do NOT rename Anachronism to any existing catalog slug. Catalog currently has 294 products; Anachronism is #295.
Do NOT reuse idle stamped / standing / raised / seised / ordered / viewed / closed / sealed / voiced, or seeded emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / muted.
Display here is **Spectral**. Body is **Figtree**. Mono is **IBM Plex Mono**.

Different surface: cloud pre-warm vs session-start tip race vs empty-bearer MCP headers vs Linux Bash-tool pkill wrapper-argv vs statusLine git-cwd never-spawn vs Cowork VM-home evaporation vs Desktop feed redelivery.

Different UI: continuity slate / darkroom chronometer / sprocket rail / dual clocks / reflog strip. Spectral / Figtree / IBM Plex Mono. Darkroom with film-cream, chronometer brass, wrong-take crimson, tip teal, amber lamp. NOT saltbush dusk. NOT siege trench. NOT speech-break vellum. NOT manor roll. NOT flashback dusk.

Different verbs: Mark the slate, Score anachronism, Roll the pre-warm take, Compare tip / stale, Pin idle tip, Pin seeded stale, Pin prewarm-latch, Hold the tip.

Different idle: **tip**. Different #93585 seeded path: **stale**. HOLD: **tip** / **hold**. ALARM: **stale** / **anachronism** / **prewarm-latch** / **checkout-local**. Path: **prewarm-latch**.

## How to score

```bash
node --test projects/anachronism/anachronism.test.mjs
node projects/anachronism/anachronism.mjs projects/anachronism/data/stale.json
echo '{"seed":"stale"}' | node projects/anachronism/anachronism.mjs
```

Open the living card at `projects/anachronism/index.html` (or the live path `/anachronism/`). Buttons: Mark the slate, Score anachronism, Roll the pre-warm take, Compare tip / stale, Pin idle tip, Pin seeded stale, Pin prewarm-latch, Hold the tip. Toggle chips for: fetch tip, checkout local, remote rewrite, SessionStart stale, reflog gap, status lie, force -B, one behind — the score flips. Lay a fixture JSON on the darkroom blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s stale walk from the published #93585 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/anachronism/
- Folder: `projects/anachronism/`

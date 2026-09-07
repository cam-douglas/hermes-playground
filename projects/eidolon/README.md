# Eidolon

A **glass-plate / wet-plate rpm bay** — camera-lucida double, silver-halide cache plate, vanishing staged copy, iodine-rose ENOENT bloom; Playfair Display + Work Sans + Fira Code — for a real Claude Code defect: **SECURITY-GUIDANCE PLUGIN HOOK FAILS WITH ENOENT IN LOCAL-AGENT-MODE-SESSIONS STAGING, CAUSING INFINITE RETRY/NOTIFICATION LOOP; REAL CACHE INTACT; MANIFEST LISTS THE PLUGIN; RESTART DOES NOT CLEAR; ONLY DISABLING/UNINSTALLING THE PLUGIN STOPS IT; INFRASTRUCTURE ENOENT FRAMED AS "BACKGROUND SECURITY REVIEW FOUND ISSUES".** When per-session rpm staging stays complete and the hook runs once from a real path, the double is **staged**.

Primary:

- [anthropics/claude-code#92601](https://github.com/anthropics/claude-code/issues/92601) (OPEN, bug, has repro, platform:windows, area:hooks, area:plugins). Title: `security-guidance plugin hook fails with ENOENT in local-agent-mode-sessions staging, causing infinite retry/notification loop`. Filed 2026-09-07T06:15:18Z. Updated 2026-09-07T06:16:20Z. Reporter: Dennisgobuild360. 0 comments.

16:50 eidolon: a phantom staging double that should keep security-guidance's hook seated in the session rpm bay but instead vanishes (ENOENT) so every turn summons a fake 'Background security review found issues' loop (#92601). Score haunted or admit staged.

Idle word: **haunted** (ALARM: staged hook path ENOENT → infinite background task-notification loop; Idle. / (no change); restart does not clear). Seeded state: **staged** / HOLD (per-session rpm staging complete and stable; hook runs once from real path; no synthetic security-finding flood). Never idle as fouled, proved, razed, culled, sole, stripped, packed, unanswered, roused, slipped, sighted, riven, argbound, belayed, veined, streaked, or tarnished.

**Eidolon** = a phantom image / double. The real `security-guidance` install exists in `~/.claude/plugins/cache/.../security_reminder_hook.py`, but the per-session staged copy under `local-agent-mode-sessions/.../rpm/plugin_…/hooks/` intermittently vanishes (ENOENT). The runtime keeps summoning the phantom on every turn as a fake security finding.

- **haunted** = IDLE: staged hook path ENOENT; infinite fake security-notice loop
- **staged** = seeded word: rpm staging complete; hook runs once from real path
- **enoent-staging** = python can't open staged `security_reminder_hook.py`
- **infinite-retry** = failure retries indefinitely; Idle. / (no change); 45+ repeats
- **synthetic-security-notification** = `<task-notification>` "Background security review found issues"
- **restart-uncleared** = three app restarts; rpm/ regenerated; loop resumes
- **real-cache-intact** = 2.0.7 cache hook exists and is well-formed
- **manifest-lists-plugin** = staged manifest lists the plugin id; copy sometimes existed (race)
- **disable-plugin-stops-loop** = Settings → Plugins (or settings.json false) + restart stops it
- **multi-session-flood** = concurrent windows independently stuck
- **cousins** = cite-only #92563 / #90329 / #74715
- **has-clear-repro** = labeled has repro; exact ENOENT; disable plugin stops it

Verdicts: haunted, staged, enoent-staging, infinite-retry, synthetic-security-notification, restart-uncleared, real-cache-intact, manifest-lists-plugin, disable-plugin-stops-loop, multi-session-flood, cousins, has-clear-repro.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a staged-hook ENOENT would leave the bay **haunted** or already **staged**. Fixtures use the issue's error path, cache-vs-staging contrast, restart fact, and disable-plugin workaround only.

Hypothesis only (NON-BINDING): hook invocation may race per-session rpm staging, then frame infrastructure ENOENT as a security finding via `<task-notification>`. Encoded from the issue body only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92601](https://github.com/anthropics/claude-code/issues/92601)
- Cousins cite-only (NOT primary):
  - [anthropics/claude-code#92563](https://github.com/anthropics/claude-code/issues/92563) — Larum: completed background `<task-notification>` never schedules a turn (notice lands but no turn; Eidolon floods turns)
  - [anthropics/claude-code#90329](https://github.com/anthropics/claude-code/issues/90329) — Desktop plugin store syncs but never downloads
  - [anthropics/claude-code#74715](https://github.com/anthropics/claude-code/issues/74715) — Chrome Always-allow persisted as once

What happened (from the issue body — do not invent):

- Windows 11 Home Single Language 10.0.26200; Claude Code desktop app, `autoUpdatesChannel: "latest"`
- Plugin `security-guidance@claude-plugins-official`, marketplace `claude-plugins-official`, cached version `2.0.7`
- Plugin id in the failing path: `plugin_01YBNfaNwQztYsnUydt8m47G`
- Exact error (repeated, verbatim): python can't open staged path `...\local-agent-mode-sessions\<session-id>\<subsession-id>\rpm\plugin_01YBNfaNwQztYsnUydt8m47G\hooks\security_reminder_hook.py` ENOENT `[Errno 2] No such file or directory`
- Delivered repeatedly as background `<task-notification>` events (summary: "Background security review found issues"), each turn, across multiple concurrent sessions
- Also Idle. / (no change) notification turns; session effectively unusable
- Real install intact: `~/.claude/plugins/cache/claude-plugins-official/security-guidance/2.0.7/hooks/security_reminder_hook.py` exists and is well-formed
- Staged manifest (`.../rpm/manifest.json`) correctly lists `plugin_01YBNfaNwQztYsnUydt8m47G` as `security-guidance`
- At the moment checked, the staged copy **did exist**, fully staged, matching the source — yet the same session kept throwing the identical ENOENT on the next several turns (race/intermittent)
- Restarting the Claude Code app three times did not stop the loop; `rpm/` staging folder regenerated fresh each time; same failure reproduced immediately
- Multiple concurrent session windows on the same project independently stuck (some reaching 45+ repeats); each showing a stop control but no way to prevent the loop from resuming
- Workaround: disabling / removing the plugin (`Settings → Plugins`, or `"security-guidance@claude-plugins-official": false` in `~/.claude/settings.json`) followed by an app restart stopped the loop. No other plugin was involved
- Framing: infrastructure ENOENT presented as a synthetic security finding

Problem found: the per-session staged hook path vanishes (ENOENT) while the real cache stays intact, and the failure retries forever as a fake "Background security review found issues" notice.

Why this solution: a diagnostic scorer for the haunted → staged eidolon chain, so a reader can admit idle haunted, pin seeded staged, and score enoent-staging / infinite-retry / synthetic-security-notification / restart-uncleared / real-cache-intact / manifest-lists-plugin / disable-plugin-stops-loop / multi-session-flood / cousins against the published facts.

## Why not a clone

This is specifically: **SECURITY-GUIDANCE PLUGIN HOOK FAILS WITH ENOENT IN LOCAL-AGENT-MODE-SESSIONS STAGING, CAUSING INFINITE RETRY/NOTIFICATION LOOP.**

**NOT Larum #92563** (cite-only cousin: task-notification written into history but no assistant turn — notice lands but no turn; Eidolon floods turns).

**NOT Touchstone #92599** (extension-gated permission-validation 401).

**NOT Bitts #92573** (worktree pool slot recycle mid-session data-loss).

**NOT Seizing #92586** (EDR nlink hard-link false-trigger Bash kill).

**NOT Gland / Cringle / Kerf / Demurrage / Scarph / Plimsoll / Diopter / Decant paradigms.**

**NOT #90329** (cite-only cousin: Desktop plugin store syncs but never downloads).

**NOT #74715** (cite-only cousin: Chrome Always-allow persisted as once).

Stay OFF leftover Lydian slabs / dockside bitts / bosun seizing yarn / stuffing-box glands / watchtower larums / sail cringles / kerf-gauge joiners.

Cousins cite-only (NOT primary): #92563, #90329, #74715.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle fouled / proved / razed / culled / sole / stripped / packed / unanswered / roused / slipped / sighted / riven / argbound / belayed / veined / streaked / tarnished.

Different surface: staged-hook ENOENT framed as a security finding vs written-notice-with-no-turn / extension-gated 401 / worktree-pool-physical-directory-recycle / EDR nlink identity kill.

Product name stays **Eidolon**. Name/slug `eidolon` confirmed unused in catalog.json (199 products).

Different UI: glass-plate / wet-plate rpm bay / camera-lucida double / silver-halide cache plate / vanishing staged copy / iodine-rose ENOENT bloom / darkroom safelight. Playfair Display / Work Sans / Fira Code. NOT Cinzel/Plus Jakarta/IBM Plex (Touchstone). NOT Libre Bodoni/Nunito/Source Code Pro (Bitts). NOT Libre Caslon/Sora/Inconsolata (Seizing). NOT Lora/Martian Mono (Gland). NOT Fraunces/Figtree/JetBrains (Larum).

Different verbs: Score the eidolon, Pin idle haunted, Pin seeded staged, Admit staged, Load fixtures, Reset to staged.

Different idle: **haunted**. Different seeded: **staged**. HOLD: **staged**. ALARM: **haunted** / **enoent-staging** / **infinite-retry** / **synthetic-security-notification** / **restart-uncleared** / **real-cache-intact** / **manifest-lists-plugin** / **disable-plugin-stops-loop** / **multi-session-flood** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/eidolon/hook/eidolon.test.mjs
node projects/eidolon/hook/index.mjs projects/eidolon/data/92601.json
echo '{"seed":"staged","staged":true}' | node projects/eidolon/hook/index.mjs
```

Open the living desk at `projects/eidolon/index.html` (or the live path). Buttons: Score the eidolon, Pin idle haunted, Pin seeded staged, Admit staged, Load fixtures, Reset to staged. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/eidolon/
- Subdomain: https://eidolon.hermes-playground-green.vercel.app
- Folder: `projects/eidolon/`

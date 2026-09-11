# Cipherlock

A **vault / bank-safe / cipher-lock booth** — brass combination dial, steel door, keycard slot. Fonts **Cinzel** (display) + **Source Sans 3** (body) + **IBM Plex Mono** (mono). Palette: night steel `#0E1218`, door steel `#2A313C`, brass `#C8A15A`, keycard teal `#3D7A78`, alarm `#C0453A`, linen `#E8E2D4` — dark bank vault, not parchment court, not concert-hall velvet, not municipal storm-drain, not marsh foxfire, not conservation atelier.

Cipherlock is the vault whose combination is blanked when concurrent `claude` processes rewrite the shared Keychain item `Claude Code-credentials` with empty `accessToken`/`refreshToken` (and no `clientId`) while the refresh tokens are still valid.

Primary:

- [anthropics/claude-code#93537](https://github.com/anthropics/claude-code/issues/93537) (OPEN, bug, has repro, platform:macos, area:auth, area:mcp). Title: `macOS: concurrent claude processes zero MCP OAuth entries in shared Keychain blob despite valid refresh tokens`. Filed by DABH 2026-09-11. Claude Code runtime **2.1.268** native install, macOS 26 (Darwin 25.6.0). Shared Keychain item `Claude Code-credentials`. Remote HTTP MCP servers: `atlassian` (user), `notion` (user), `plugin:slack:slack`. 7 concurrent `claude` processes (2.1.206 x3, 2.1.263, 2.1.267, 2.1.268 x2). Timeline UTC 2026-09-11: 04:29:47 healthy refresh holds valid access + refresh for all three (expiries 7h, 12h, 24h out); 04:32:14 and 04:39:19 `~/.claude/mcp-needs-auth-cache.json` flags all three and a tokenless `mcpOAuth` stub is written to fallback `~/.claude/.credentials.json`, coinciding with `claude mcp list` from a non-interactive shell (one killed after ~75s); 04:42:16 another `claude mcp list` rewrites the Keychain — `notion` and `atlassian` empty `accessToken`/`refreshToken` and no `clientId`; Slack intact; `claude mcp list` reports Needs authentication for the two. No `/logout`, no Clear authentication, `CLAUDE_CONFIG_DIR` unset, login keychain unlocked. 33 `/mcp` re-auths over two months. Distinct from #91009 (Windows file store / `claudeAiOauth`). Expected in the issue: entries with a valid refresh token are never zeroed by another process; a failed refresh should not overwrite tokens another process just rotated; re-read before write or per-entry write. Cousins cite-only: #91009 #91199 #92839 #89969 #90647 #91158 #92149 #87405 #84274 #84275.

15:50 cipherlock: a vault / bank-safe / cipher-lock booth for #93537. Idle **sealed** / seeded **blanked** / path **concurrent-write**. Score cipherlock or admit sealed.

Score cipherlock or admit sealed.

Idle word: **sealed** (HOLD: honest path — tokens held). Seeded word: **blanked** / #93537 (concurrent wipe). Path word: **concurrent-write**. Product score: **cipherlock**. Never idle untainted / attainted / attainder / voiced / muted / sourdine / kindled / painted / foxfire / lodged / dropped / forksink / flushed / lagged / pentimento / solitary / twinlinked / vinculum / hit / flattened / cachet / honest / scapegoated.

Phrase: **when concurrent claude processes rewrite Claude Code-credentials MCP OAuth entries with empty accessToken/refreshToken and no clientId while refresh tokens are still valid, score cipherlock or admit sealed.**

- **sealed** = IDLE: HOLD; tokens held in `Claude Code-credentials`
- **blanked** = #93537 seeded path: concurrent writers zero notion/atlassian while refresh tokens are still valid
- **cipherlock** = product score word for the vault whose combination is wiped
- **concurrent-write** = path word: several processes touch the store; one overwrite zeros valid tokens
- **hold** = HOLD alias for idle sealed
- **healthy-refresh** = 04:29:47 Keychain item modified by a healthy refresh
- **concurrent-sessions** = 7 concurrent `claude` processes across mixed versions
- **mcp-list** = `claude mcp list` from a non-interactive shell
- **killed-mid-run** = one `claude mcp list` killed after ~75s
- **auth-cache** = `~/.claude/mcp-needs-auth-cache.json` flags all three servers
- **stub-blob** = tokenless `mcpOAuth` stub written to `~/.claude/.credentials.json`
- **keychain-rewrite** = 04:42:16 Keychain item rewritten
- **empty-tokens** = notion and atlassian empty `accessToken`/`refreshToken`
- **slack-intact** = `plugin:slack:slack` entry stays intact
- **no-client-id** = blanked entries have no `clientId`
- **needs-auth** = `claude mcp list` reports Needs authentication for the two
- **re-read-before-write** = expected store discipline from the issue
- **per-entry-merge** = expected write shape from the issue
- **tokens-held** = positive control: valid refresh tokens stay held
- **has-repro** = Claude Code 2.1.268 · DABH · native macOS 26
- **cousins** = cite-only #91009 #91199 #92839 #89969 #90647 #91158 #92149 #87405 #84274 #84275 — do not rebuild
- **backups** = cite-only #93475 #93439 #93438 #93466 #93495 #93508 #93530 #93536 #93534 #93532 — do not auto-pick
- **fixtures** = door / dial / slot / box table for the cipherlock booth
- **walk** = published idle sealed → healthy-refresh → concurrent-sessions → mcp-list → killed-mid-run → auth-cache → stub-blob → keychain-rewrite → empty-tokens → slack-intact → concurrent-write → cipherlock

Verdicts: sealed, blanked, cipherlock, concurrent-write, hold, healthy-refresh, concurrent-sessions, mcp-list, killed-mid-run, auth-cache, stub-blob, keychain-rewrite, empty-tokens, slack-intact, no-client-id, needs-auth, re-read-before-write, per-entry-merge, tokens-held, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the vault is **blanked** / **cipherlock** or already **sealed**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): concurrent Keychain read-modify-write without re-read-before-write / per-entry merge lets one process overwrite another's rotated tokens with empty stubs. Invite verify against #93537 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93537](https://github.com/anthropics/claude-code/issues/93537)
- Cite-only cousin: [anthropics/claude-code#91009](https://github.com/anthropics/claude-code/issues/91009) (OPEN Windows file-store / `claudeAiOauth` refresh-rotation race; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#91199](https://github.com/anthropics/claude-code/issues/91199) (OPEN MCP OAuth `--client-secret` silently discarded; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#92839](https://github.com/anthropics/claude-code/issues/92839) (OPEN macOS Keychain argv fallback `pbt`; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#89969](https://github.com/anthropics/claude-code/issues/89969) (OPEN `${user_config.*}` not substituted in oauth; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#90647](https://github.com/anthropics/claude-code/issues/90647) (OPEN logout/switch discards MCP grants; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#91158](https://github.com/anthropics/claude-code/issues/91158) (OPEN plaintext refresh + unbounded Keychain; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#92149](https://github.com/anthropics/claude-code/issues/92149) (OPEN scope error as login rejected; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#87405](https://github.com/anthropics/claude-code/issues/87405) (OPEN tokenless stub blocks Keychain refresh; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#84274](https://github.com/anthropics/claude-code/issues/84274) (OPEN access token never persisted; do not rebuild)
- Cite-only cousin: [anthropics/claude-code#84275](https://github.com/anthropics/claude-code/issues/84275) (OPEN daily `Claude Code-credentials-*` accretion; do not rebuild)
- Backup (data only): #93475 Effort selector needs a very tall terminal
- Backup (data only): #93439 Binary Read skips PreToolUse
- Backup (data only): #93438 Worktree cwd bleed
- Backup (data only): #93466 Directory Plugins duplicate cards
- Backup (data only): #93495 Desktop UNUserNotificationCenter deadlock
- Backup (data only): #93508 Documents preview_start TCC getcwd deny
- Backup (data only): #93530 Esc kills an unrelated background subagent irrecoverably
- Backup (data only): #93536 ExitPlanMode consistently returns rejected
- Backup (data only): #93534 Desktop Code tab long unsent prompt disappears
- Backup (data only): #93532 Documents-folder permission lost on every embedded CLI auto-update

What happened (from the issue text — do not invent):

- OPEN. Labels: bug, has repro, platform:macos, area:auth, area:mcp
- Claude Code **2.1.268**; reporter DABH; native install; macOS 26 (Darwin 25.6.0)
- Shared Keychain item `Claude Code-credentials`
- Servers: atlassian (user), notion (user), plugin:slack:slack
- 7 concurrent `claude` processes across mixed versions
- Healthy refresh at 04:29:47 held valid tokens
- `claude mcp list` from another shell; one killed after ~75s
- Keychain rewritten 04:42:16; notion/atlassian empty tokens and no clientId; Slack intact
- Distinct from #91009 (Windows file store / claudeAiOauth)

Problem found: CONCURRENT CLAUDE PROCESSES ZERO MCP OAUTH ENTRIES IN THE SHARED KEYCHAIN BLOB DESPITE VALID REFRESH TOKENS.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the vault stayed **sealed** or was **blanked**. Educational bank-vault booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Entries with a valid refresh token are never zeroed by another process
2. A failed refresh in one process should not overwrite tokens another process just rotated
3. The store should be re-read before write, or the write should be per-entry
4. No `/logout` and no Clear authentication should still leave valid MCP OAuth tokens held

## Why not a clone

This is specifically: **CONCURRENT KEYCHAIN WRITERS ZERO VALID MCP OAUTH TOKENS** — vault / bank-safe / cipher-lock booth, not parchment court, not concert-hall velvet mute, not municipal storm-drain grate, not marsh foxfire lantern, not conservation atelier pentimento.

**NOT Attainder/#93529** (parked-permission retirement stamps user-rejected). Different defect. NOT parchment / wax seal / iron stamp.

**NOT Sourdine/#93531** (MessageDisplay narration mute). Different defect. NOT concert-hall velvet / brass mute.

**NOT Forksink/#93458** (SessionStart additionalContext drop on source=fork). Different defect. NOT municipal grate / sodium lamp.

**NOT Foxfire/#93502** (Remote Control idle composer paint-without-turn). Different defect. NOT marsh lantern / peat / bioluminescence.

**NOT Pentimento/#93482** (device_commit_files overwrite one-behind). Different defect. NOT art-conservation / underpainting atelier.

**NOT Vinculum/#93485.** **NOT Scapegoat/#93348.** **NOT Cachet/#93490.** **NOT Strobe.** **NOT Sump.** **NOT Spillway.** Different defects.

**NOT #91009** (Windows file store / claudeAiOauth login). Cite-only cousin. This booth is macOS Keychain, MCP-only, with a concrete `claude mcp list` trigger.

Do NOT rename this product Attainder, Sourdine, Forksink, Foxfire, Pentimento, Vinculum, Scapegoat, Cachet, Strobe, Counterfoil, Lucida, Fomite, Snubber, Fosse, Hibernacle, Sump, Spillway, or any existing catalog slug.
Do NOT reuse idle sealed / blanked / concurrent-write on a later booth.
Display here is **Cinzel**. Body is **Source Sans 3**. Mono is **IBM Plex Mono**.

Different surface: concurrent Keychain MCP OAuth wipe vs parked-permission false user-rejected vs MessageDisplay narration mute vs SessionStart fork drop.

Different UI: brass combination dial / steel door / keycard-slot gauges. Cinzel / Source Sans 3 / IBM Plex Mono. Dark bank vault. NOT parchment court. NOT concert-hall velvet. NOT municipal grate. NOT marsh lantern. NOT conservation atelier.

Different verbs: Open the vault, Score cipherlock, Spin the dial, Compare keycard / lock, Pin idle sealed, Pin seeded blanked, Pin concurrent-write, Clear the vault.

Different idle: **sealed**. Different #93537 seeded path: **blanked**. HOLD: **sealed** / **hold**. ALARM: **blanked** / **cipherlock** / **concurrent-write** / **empty-tokens**. Path: **concurrent-write**.

## How to score

```bash
node --test projects/cipherlock/cipherlock.test.mjs
node projects/cipherlock/cipherlock.mjs projects/cipherlock/data/blanked.json
echo '{"seed":"blanked"}' | node projects/cipherlock/cipherlock.mjs
```

Open the living card at `projects/cipherlock/index.html` (or the live path `/cipherlock/`). Buttons: Open the vault, Score cipherlock, Spin the dial, Compare keycard / lock, Pin idle sealed, Pin seeded blanked, Pin concurrent-write, Clear the vault. Toggle concurrent sessions / mcp list / killed mid-run / keychain rewrite / empty tokens / no clientId — the score flips. Lay a fixture JSON on the vault tray. `?embed=1` hides chrome.

The booth reconstructs the reporter’s concurrent-write walk from the published #93537 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/cipherlock/
- Folder: `projects/cipherlock/`

# Callboard

A **theater call-board / stage-door desk** — black painted board, chalk/white card slots, red understudy tabs, brass clip rails, house lights dim, playbill serif — for a real Claude Code Desktop defect: **claude.ai-managed skills (`anthropic-skills:*`) are missing from new-chat slash-command autocomplete until the first message is sent (regression ~Aug 2026)**. The skill is still fully available to the model in that fresh session. Only pre-first-message autocomplete is affected.

Primary:

- [anthropics/claude-code#90858](https://github.com/anthropics/claude-code/issues/90858) (OPEN, filed 2026-08-30T23:41:14Z). Title: [BUG] claude.ai skills (anthropic-skills:*) missing from new-chat slash-command autocomplete until first message (regression ~Aug 2026). Labels: has repro, platform:macos, regression, area:skills, area:plugins. Env: Claude desktop app macOS **1.40609.0** code mode; Claude Code CLI **2.1.169**; Darwin **24.6.0**. Skills enabled on claude.ai (Settings > Capabilities > Skills) inject into desktop code-mode as plugin-namespaced `anthropic-skills:<name>`. Until ~early-to-mid Aug 2026 they appeared in composer slash autocomplete of a brand-new chat. Since then, new not-yet-started chat autocomplete lists nothing for them until after the first message starts the session. ListSkills shows enabled; Skill(anthropic-skills:<name>) loads fine. Cache exists on disk at `~/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/<uuid>/<uuid>/skills/` with sibling manifest.json whose lastUpdated refreshes at session start — data present while menu shows nothing. Local skills in `~/.claude/skills` still appear in new-chat autocomplete immediately. Workaround: duplicate skill into `~/.claude/skills` → then TWO autocomplete entries (bare + anthropic-skills: prefixed) because namespaced skills do not dedupe against local ones. Timing note from reporter: 2.1.169 changelog mentions slash-command/skill scan regression introduced in 2.1.161 (fixed for `claude -p` on Windows); timing roughly matches; unconfirmed connection.

A cast skill that never makes the new-chat callboard is not a hold. Score the board or admit **rostered**.

Idle word: **rostered**. Seeded state: **blank** / #90858 — new-chat autocomplete empty for `anthropic-skills:*` while cache and Skill() are live. Never idle as "callboard" / "board" / "cast" / "skill".

- **rostered** = hold: cloud/plugin skills appear in new-chat autocomplete before any message
- **blank** = #90858 primary failure — new-chat slash autocomplete lists nothing for them
- **deferred** = menu does not read the plugin pipeline until after the first message
- **cache-present** = skills-plugin cache and fresh manifest on disk while the menu shows nothing
- **local-ok** = `~/.claude/skills` still appear in new-chat autocomplete immediately
- **post-start** = after the first message starts the session the namespaced skills appear
- **duplicate-workaround** = local copy yields TWO autocomplete entries (bare + `anthropic-skills:`)
- **namespaced** = claude.ai skills inject as plugin-namespaced `anthropic-skills:<name>`
- **scan-regress** = 2.1.169 changelog notes a slash-command/skill scan regression from 2.1.161; unconfirmed
- **menu-blind** = cache is present; the new-chat menu does not read it pre-session

Verdicts: rostered, blank, deferred, cache-present, local-ok, post-start, duplicate-workaround, namespaced, scan-regress, menu-blind.

## Why not a clone

This is specifically: **PRE-SESSION DISCOVERABILITY**. Cloud/plugin skill cache is present and Skill() works, but new-chat slash autocomplete does not read the plugin pipeline until after the first message.

NOT **Ordo** ([#90515](https://github.com/anthropics/claude-code/issues/90515)) — headless `-p` Unknown command for plugin slash with silent success envelope.
NOT **Kindling** ([#90798](https://github.com/anthropics/claude-code/issues/90798)) — WarmLifecycle throwaway session mint on focus switch.
NOT **Leaven** ([#90782](https://github.com/anthropics/claude-code/issues/90782)) — bootstrap context contamination / foreign instruction echo on parallel Explore.
NOT **Livery** — new coat of same house / identity wardrobe.
NOT **Fetch** — looking-glass muted keyed reply.
NOT **Sprag** ([#90494](https://github.com/anthropics/claude-code/issues/90494)) — boot-cached MCP attach lock for process lifetime.
NOT **Reed** — MCP four-contact connected≠registered≠callable.
NOT **Larder** — plugin-store freeze vs sync stamp.
NOT **Scion** ([#90815](https://github.com/anthropics/claude-code/issues/90815)) — empty bridged fork — already catalogued; do NOT re-ship.
NOT **Hydra** / **Limpet** / **Deadband** / **Almanac** / **Voucher**.

Stay off leftover millimetre sliders and woodworking leftovers.

Different UI: theater stage-door callboard — black painted board, chalk/white card slots, red understudy tabs, brass clip rails, house lights dim, playbill serif. Fonts: Playfair Display + DM Sans + IBM Plex Mono (NOT Newsreader/Karla from Leaven, NOT Cormorant from Ordo, NOT Fraunces, NOT Teko). Palette: stage black, chalk white, understudy crimson, brass, dim house-gold, card-cream. NOT bakery maple. NOT marble hydra. NOT tide-pool. NOT orchard. NOT feast parchment. NOT hearth charcoal. NOT phosphor deadband.

Different idle: **rostered**.

## Live catalog path

`/callboard/` is this static stage-door desk. Demo works with no secrets and no npm. Mark: `10:50 Sydney · callboard`.

1. Seeded demo loads **blank** (#90858 — new-chat autocomplete empty for `anthropic-skills:*`).
2. Admit rostered → cloud/plugin skills appear before any message.
3. Chip-switch seeds: blank / rostered / deferred / cache-present / local-ok / post-start / duplicate-workaround / namespaced / scan-regress / menu-blind.
4. Paste or edit an autocomplete probe ticket JSON and score the board.
5. Export a probe ticket.

## How to score

Open `projects/callboard/index.html` in a browser, or serve the repo root and visit `/callboard/` (Vercel rewrite → `/projects/callboard`). No build step. Optional hook:

```bash
node projects/callboard/hook/callboard.mjs < projects/callboard/data/90858.json
node projects/callboard/hook/callboard.mjs projects/callboard/data/rostered.json
node --test projects/callboard/hook/callboard.test.mjs
```

Blank seed → blank/alarm. Rostered seed → rostered/hold.

`projects/callboard/hook/callboard.mjs` scores an autocomplete probe ticket `{ preSessionMatch, postFirstMessageMatch, cachePresent, manifestFresh, localSkillsVisible, skillCallable, listSkillsShows, duplicateEntries, namespacedPrefix, outputText }` and returns `{ verdict, chips[], reasons[], rostered, blank, hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/90858.json`, `data/rostered.json`, plus `cache-present`, `local-ok`, `post-start`, `duplicate-workaround`, `namespaced`, `data/fingerprints.json`, `data/chips.json`. Evidence only from issue facts.

## Native integrations

1. Live fetch `https://api.github.com/repos/anthropics/claude-code/issues/90858`. Unauthenticated. See `.env.example`.
2. Local seed JSON under `data/`.
3. Hook CLI: `node projects/callboard/hook/callboard.mjs`.
4. Slack / Linear adapters are honest demo rows when no secrets are present.

## Sources

- [anthropics/claude-code#90858](https://github.com/anthropics/claude-code/issues/90858) OPEN
- Nearby boundary only (cite, not primary): [#82732](https://github.com/anthropics/claude-code/issues/82732) cloud-shared skills inherit plugin load semantics (no mid-session reload) — different problem

# 2026-08-31 Callboard

Eighty-fourth catalog product. Theater call-board / stage-door desk — black painted board, chalk/white card slots, red understudy tabs, brass clip rails, house lights dim, playbill serif; Playfair Display + DM Sans + IBM Plex Mono — for a Claude Code Desktop pre-session discoverability miss. claude.ai-managed skills (`anthropic-skills:*`) are missing from new-chat slash-command autocomplete until the first message is sent (regression ~Aug 2026). Cache is on disk. ListSkills shows enabled. Skill() loads. Only the new-chat menu is blind. Leaven remains in the catalog, unfeatured. Hydra remains listed. Limpet remains listed. Scion remains listed. Almanac remains listed.

Research brief ran in the 10:50 Australia/Sydney window. Shipped 10:50 Australia/Sydney (this loop).

Live path: `/callboard/`.

Next hour needs a different problem. Stay off Callboard's problem. Stay off Leaven #90782, Hydra #90856, Limpet #89275, Scion #90815, Almanac, Kindling #90798, Ordo #90515, Sprag, Reed. Do NOT ship #90844 MCP CONNECTION_CLOSED sticky cache this hour — reserve as next-hour candidate CHOKE. Do not ship leftover bakery / marble / tide-pool / orchard / feast-page / hearth / phosphor desks.

## Sources

Primary:

- [anthropics/claude-code#90858](https://github.com/anthropics/claude-code/issues/90858) — filed 2026-08-30T23:41:14Z, OPEN. Title: [BUG] claude.ai skills (anthropic-skills:*) missing from new-chat slash-command autocomplete until first message (regression ~Aug 2026). Labels: has repro / platform:macos / regression / area:skills / area:plugins. Env: Claude desktop app macOS 1.40609.0 code mode; Claude Code CLI 2.1.169; Darwin 24.6.0.

Facts from the issue only:

- Skills enabled on claude.ai (Settings > Capabilities > Skills) inject into desktop code-mode as plugin-namespaced `anthropic-skills:<name>`.
- Until ~early-to-mid Aug 2026 they appeared in composer slash autocomplete of a brand-new chat. Since then, new not-yet-started chat autocomplete lists nothing for them until after the first message starts the session.
- Skill is still fully available to the model in that fresh session (ListSkills shows enabled; Skill(anthropic-skills:<name>) loads fine). Only pre-first-message autocomplete is affected.
- Cache exists on disk at `~/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/<uuid>/<uuid>/skills/` with sibling manifest.json whose lastUpdated refreshes at session start — data present while menu shows nothing; menu does not read it pre-session.
- Local skills in `~/.claude/skills` still appear in new-chat autocomplete immediately — menu works; only claude.ai/plugin pipeline is deferred.
- Workaround: duplicate skill into ~/.claude/skills → then TWO autocomplete entries (bare + anthropic-skills: prefixed) because namespaced skills do not dedupe against local ones.
- Timing note from reporter: 2.1.169 changelog mentions slash-command/skill scan regression introduced in 2.1.161 (fixed for `claude -p` on Windows); timing roughly matches; unconfirmed connection.

Nearby boundary only (cite, not primary):

- [anthropics/claude-code#82732](https://github.com/anthropics/claude-code/issues/82732) — cloud-shared skills inherit plugin load semantics (no mid-session reload). Different problem.

## Problem

PRE-SESSION DISCOVERABILITY. Cloud/plugin skill cache is present and Skill() works, but new-chat slash autocomplete does not read the plugin pipeline until after the first message.

## Why Callboard

A callboard is the stage-door roster. A cast skill that never makes the new-chat callboard is not a hold. Score the board. Name the class or admit **rostered**. Idle word is **rostered**. When new-chat autocomplete lists nothing for `anthropic-skills:*`: **blank**. When the menu waits for the first message: **deferred**. When the cache and fresh manifest sit on disk while the menu shows nothing: **cache-present**. When local `~/.claude/skills` still appear immediately: **local-ok**. When the namespaced skills appear only after session start: **post-start**. When a local duplicate yields two entries: **duplicate-workaround**. When the inject is plugin-namespaced: **namespaced**. When the ticket cites the 2.1.161 scan note: **scan-regress**. When the menu does not read the cache pre-session: **menu-blind**.

Verdicts: rostered, blank, deferred, cache-present, local-ok, post-start, duplicate-workaround, namespaced, scan-regress, menu-blind.

## Why not a clone

Different problem: PRE-SESSION DISCOVERABILITY — cache present and Skill() works; new-chat slash autocomplete does not read the plugin pipeline until after first message.
Different UI: theater stage-door callboard. Black painted board, chalk/white card slots, red understudy tabs, brass clip rails, house lights dim, playbill serif. Playfair Display + DM Sans + IBM Plex Mono. Stage black, chalk white, understudy crimson, brass, dim house-gold, card-cream. Not millimetre sliders, not woodworking leftover, not bakery maple / marble hydra / tide-pool / orchard / feast parchment / hearth charcoal / phosphor deadband.
Different idle word: **rostered**. Never idle as "callboard" / "board" / "cast" / "skill".

NOT Ordo (#90515 headless `-p` Unknown command for plugin slash with silent success envelope).
NOT Kindling (#90798 WarmLifecycle throwaway session mint on focus switch).
NOT Leaven (#90782 bootstrap context contamination / foreign instruction echo on parallel Explore).
NOT Livery (new coat of same house / identity wardrobe).
NOT Fetch (looking-glass muted keyed reply).
NOT Sprag (#90494 boot-cached MCP attach lock for process lifetime).
NOT Reed (MCP four-contact connected≠registered≠callable).
NOT Larder (plugin-store freeze vs sync stamp).
NOT Scion (#90815 empty bridged fork — already catalogued; do NOT re-ship).
NOT Hydra / Limpet / Deadband / Almanac / Voucher.

## Ship notes

- `projects/callboard/` static stage-door desk + tiny hook + tests + seeded ticket JSON. Demo works offline, no secrets, no npm.
- Seeded #90858 **blank** (new-chat autocomplete empty for `anthropic-skills:*`; cache present; Skill() works). Admit rostered or score a ticket. Export a probe ticket.
- Hook scores an autocomplete probe ticket (`preSessionMatch` / `postFirstMessageMatch` / `cachePresent` / `manifestFresh` / `localSkillsVisible` / `skillCallable` / `listSkillsShows` / `duplicateEntries` / `namespacedPrefix` / `outputText`): blank vs rostered. `node --test projects/callboard/hook/callboard.test.mjs`.
- `catalog.json`: Callboard featured first; 84 products; Leaven and all others `featured: false`.
- `vercel.json`: `/callboard` and `/callboard/` → `/projects/callboard` at the top, before Leaven.
- Hub / index lede names Callboard featured; Leaven, Hydra, Limpet, Scion, Almanac stay listed.
- Native integrations: GitHub #90858 live source card; Slack / Linear honest demo rows when no secrets.

## Next-hour avoid list

Stay off Callboard's problem. Stay off Leaven #90782, Hydra #90856, Limpet #89275, Scion #90815, Almanac, Kindling #90798, Ordo #90515, Sprag, Reed. Do NOT ship #90844 MCP CONNECTION_CLOSED sticky cache this hour — reserve as next-hour candidate CHOKE. Do not ship leftover bakery / marble / tide-pool / orchard / feast-page / hearth / phosphor desks.

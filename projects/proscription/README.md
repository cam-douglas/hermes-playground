# Proscription

A **Roman outlaw-list / wax-tablet forum / iron-stylus / marble-lintel / torch-lit senate chamber booth** — marble columns, wax tablet, iron stylus, chalked names that should stay struck. Fonts **Cinzel** (display) + **Source Sans 3** (body) + **JetBrains Mono** (mono). Palette: marble `#E8E4DC`, tablet wax `#2A2418`, iron `#5C6670`, outlaw crimson `#9B1D1D`, torch gold `#D4A017`, night indigo `#12151C`, chalk `#F7F3EA`. Fresh trio. NOT Thimblerig/#94174. NOT Fetchling/#94065. NOT Souffleur/#94031. NOT Epitome/#94032. NOT Diabolica/#94040. NOT Sallyport/#94082. NOT Palilalia/#94041. NOT Sepulchre/#94055. NOT Sneck/#94052. NOT Drawbridge/#94049. NOT Chirograph/#94045. NOT Titulus. NOT Derelict. NOT Vestry. NOT Mondegreen. NOT Afterimage/#92596. NOT Phosphene. NOT Scotoma. NOT Scrim. NOT Aphonia/#92409. NOT Sourdine/#93531. NOT Anarthria/#93782. Completely different UI/UX/metaphor. This is specifically: **A CUSTOM SUBAGENT'S OWN FRONTMATTER `disallowedTools` DOES NOT STRIP TOOLS — CHALKED OUTLAW NAMES STILL WALK THE FORUM.**

The tablet should stay **barred** (HOLD: denied / struck / excised / absent / stripped). Instead the booth was **proscription** after a **deny-list-hollow**.

Primary:

- [anthropics/claude-code#94202](https://github.com/anthropics/claude-code/issues/94202) (OPEN). Title: `[BUG] Subagent frontmatter disallowedTools is not enforced: Bash, WebSearch and MCP tools listed there still load and run`. Labels: bug, has repro, platform:macos, area:tools, area:agents, area:permissions. Version: Claude Code 2.1.268 (macOS). Changelog 2.1.269/2.1.270 do not mention this area. A custom subagent in `~/.claude/agents/*.md` with a `disallowedTools` list still receives and can call every tool on that list. Bash on the list → still in loaded function definitions (Agent, Bash, Edit, Read, Skill, ToolSearch, Write) and executes. WebSearch on the list → ToolSearch returns its definition; call runs with real search results. MCP tool listed by full name (`mcp__ai-team-os__ecosystem_deep_review_list`) → ToolSearch finds it; call runs with real API response. Only denial observed: `mcp__ai-team-os__project_delete` blocked by auto mode classifier ("Irreversible Deletion"), NOT by the deny list. Four independent spawns reproduced (two with 27-entry deny list, two with minimal template). Template body is read at spawn (not a stale registry). Prefix globs (`mcp__ai-team-os__ecosystem_*`) also had no effect; report is about documented full names. Docs: https://code.claude.com/docs/en/sub-agents#available-tools — tools in disallowedTools should be removed from the subagent. Minimal repro: save `~/.claude/agents/deny-probe.md` with frontmatter disallowedTools: Bash, WebSearch, (optional MCP full names); spawn via Agent tool with subagent_type deny-probe; ask it to list loaded functions + ToolSearch+call WebSearch/MCP; report found/executed. Cousins cite-only (do NOT rebuild / do NOT conflate): #78063 — parent agent's disallowedTools not inherited by subagents it spawns. This booth is specifically the subagent's OWN template disallowedTools not applying to that subagent. Backups cite-only (next focus only — do not auto-pick): #94029, #93987, #93924, #93770, #93777, #94059, #94053, #94151, #94064. Stay off Proscription/Thimblerig/Fetchling/Souffleur/Epitome/Diabolica/Sallyport/Palilalia/Sepulchre paradigms.

17:50 proscription: a Roman outlaw-list / wax-tablet forum / iron-stylus / marble-lintel / torch-lit senate booth for #94202. A custom subagent's own frontmatter disallowedTools does not strip tools: Bash stays in loaded functions and executes; WebSearch is ToolSearch-found and runs with real results; MCP full name mcp__ai-team-os__ecosystem_deep_review_list runs with a real API response; only mcp__ai-team-os__project_delete is denied, and that by the auto mode classifier (Irreversible Deletion), not the deny list. Four independent spawns. Idle **barred** / seeded **proscription** / path **deny-list-hollow**. Score proscription or admit barred.

Score proscription or admit barred.

Idle word: **barred** (HOLD: deny list actually strips tools). HOLD aliases: barred, denied, struck, excised, absent, stripped. Seeded word: **proscription** / #94202 (the deny-list-hollow path). Path word: **deny-list-hollow**. Product score: **proscription**. Never idle additive / literal / echoing / unabridged / innocent / sealed / silenced / living / cleared / spanned / matched / inscribed or seeded thimblerig / fetchling / souffleur / epitome / diabolica / sallyport / palilalia / sepulchre or path skill-row-carve / skill-dollar-swap / etc.

Phrase: **Score proscription or admit barred.**

- **barred** = IDLE: HOLD; deny list actually strips tools; chalked names absent from the forum
- **proscription** = #94202 seeded path and product score: chalked outlaw names still walk the forum
- **deny-list-hollow** = path word: frontmatter `disallowedTools` listed but not applied to the subagent tool set / ToolSearch
- **hold** = HOLD alias for idle barred
- **denied** = HOLD alias: names on the tablet are denied at load
- **struck** = HOLD alias: iron stylus strikes the chalked name
- **excised** = HOLD alias: listed tools excised from the subagent set
- **absent** = HOLD alias: ToolSearch does not return a listed tool
- **stripped** = HOLD alias: loaded functions no longer include listed tools
- **bash-still-loaded** = Bash on the list still in loaded functions and executes
- **websearch-executes** = WebSearch ToolSearch-found; call runs with real search results
- **mcp-full-name-executes** = `mcp__ai-team-os__ecosystem_deep_review_list` found and executed
- **classifier-only-denial** = `project_delete` denied by auto mode classifier ("Irreversible Deletion"), not the deny list
- **four-spawns** = four independent spawns (two 27-entry, two minimal)
- **template-read-at-spawn** = template body is read at spawn (not a stale registry)
- **prefix-glob-no-effect** = prefix globs also had no effect; report is about documented full names
- **deny-probe** = minimal repro shape `~/.claude/agents/deny-probe.md`
- **landing** = marble lintel / wax tablet / iron stylus / torch-lit senate
- **has-repro** = published shape: 2.1.268 macOS · four spawns · classifier-only denial
- **cousins** = cite-only #78063 — do not rebuild; do not conflate
- **backups** = cite-only #94029 #93987 #93924 #93770 #93777 #94059 #94053 #94151 #94064 — do not auto-pick
- **fixtures** = marble lintel / wax tablet / iron stylus / torch-lit senate
- **walk** = published idle barred → deny-list-hollow → proscription

Verdicts: barred, proscription, deny-list-hollow, hold, denied, struck, excised, absent, stripped, bash-still-loaded, websearch-executes, mcp-full-name-executes, classifier-only-denial, four-spawns, template-read-at-spawn, prefix-glob-no-effect, deny-probe, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **proscription** or already **barred**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): frontmatter `disallowedTools` parsed/stored but never applied when building the subagent's tool set / ToolSearch surface; auto classifier is a separate gate. Invite verify against #94202 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94202](https://github.com/anthropics/claude-code/issues/94202)
- Docs (cited in issue): https://code.claude.com/docs/en/sub-agents#available-tools
- Cousins (cite-only — do NOT rebuild / do NOT conflate): #78063 parent agent's disallowedTools not inherited by subagents it spawns (different). #94202 is specifically the subagent's OWN template disallowedTools not applying to that subagent.
- Backups (data only; next focus only — do not auto-pick): #94029, #93987, #93924, #93770, #93777, #94059, #94053, #94151, #94064

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:tools, area:agents, area:permissions
- Version: Claude Code 2.1.268 (macOS). Changelog 2.1.269/2.1.270 do not mention this area
- Custom subagent in `~/.claude/agents/*.md` with a `disallowedTools` list still receives and can call every tool on that list
- Bash on the list → still in loaded function definitions (Agent, Bash, Edit, Read, Skill, ToolSearch, Write) and executes
- WebSearch on the list → ToolSearch returns its definition; call runs with real search results
- MCP tool listed by full name (`mcp__ai-team-os__ecosystem_deep_review_list`) → ToolSearch finds it; call runs with real API response
- Only denial observed: `mcp__ai-team-os__project_delete` blocked by auto mode classifier ("Irreversible Deletion"), NOT by the deny list
- Four independent spawns reproduced (two with 27-entry deny list, two with minimal template)
- Template body is read at spawn (not a stale registry)
- Prefix globs (`mcp__ai-team-os__ecosystem_*`) also had no effect; report is about documented full names
- Docs: tools in disallowedTools should be removed from the subagent
- Minimal repro: save `~/.claude/agents/deny-probe.md`; spawn via Agent tool with subagent_type deny-probe

Problem found: DENY-LIST-HOLLOW — the subagent's own frontmatter `disallowedTools` does not strip tools; chalked names still walk.

Why Proscription: A *proscription* is a Roman outlaw list — names chalked on a tablet as banned, who should be absent from the forum. The wax lists Bash, WebSearch, and the MCP full name. They still walk. One name (`project_delete`) is turned back by a different gate (the auto mode classifier), not by the tablet. Thimblerig/#94174 was a /context tally lie (carnival cups). Fetchling/#94065 was a Skill-path dollar-token swap (coin-ledger). This booth is specifically a hollow deny list on the subagent's own template — different problem, UI, UX, metaphor. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: barred catalog page + node diagnostic encoding idle **barred** / seeded **proscription** / path **deny-list-hollow** so operators can score whether the booth is **proscription** or already **barred**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Tools in disallowedTools should be removed from the subagent
2. Bash on the deny list should not appear in loaded function definitions and should not execute
3. WebSearch on the deny list should not be returned by ToolSearch and should not run
4. An MCP tool listed by documented full name should not be found by ToolSearch and should not run
5. Denial should come from the deny list, not only from the auto mode classifier

## Why not a clone

This is specifically: **A CUSTOM SUBAGENT'S OWN FRONTMATTER `disallowedTools` DOES NOT STRIP TOOLS — CHALKED OUTLAW NAMES STILL WALK THE FORUM.**

Novel paradigm: Roman wax-tablet forum / iron stylus / marble lintel / torch-lit senate — marble, wax, iron, outlaw crimson, torch gold. New issue, new paradigm (deny-list-hollow), new UI/UX/fonts/colors, new scoring vocabulary. A senate chamber with a hollow tablet, not a carnival tent, twilight coin-ledger, theatre prompt-corner, scriptorium desk, inquisitorial court, or fortress sallyport.

**NOT Thimblerig/#94174** (skill-row-carve). Different defect. NOT carnival cups / chalk tally. Do not reuse additive / thimblerig / skill-row-carve.

**NOT Fetchling/#94065** (skill-dollar-swap). Different defect. NOT fae twilight / coin-ledger. Do not reuse literal / fetchling / skill-dollar-swap.

**NOT Souffleur/#94031** (app-switch-echo-loss). Different defect. NOT theatre wings / prompt-corner. Do not reuse echoing / souffleur / app-switch-echo-loss.

**NOT Epitome/#94032** (summarized-thinking-force). Different defect. NOT classical scriptorium. Do not reuse unabridged / epitome / summarized-thinking-force.

**NOT Diabolica/#94040** (cannot-show-not-git). Different defect. NOT inquisitorial parchment-court. Do not reuse innocent / diabolica / cannot-show-not-git.

**NOT Sallyport/#94082** (reminder-secret-bypass). Different defect. NOT fortress / gatehouse. Do not reuse sealed / sallyport / reminder-secret-bypass.

**NOT Palilalia/#94041** (goal-stop-refire). Different defect. NOT speech-pathology / phonograph-groove. Do not reuse silenced / palilalia / goal-stop-refire.

**NOT Sepulchre/#94055** (bash-nul-poison). Different defect. NOT stone burial vault / ossuary. Do not reuse living / sepulchre / bash-nul-poison.

**NOT Sneck/#94052** (chip dismiss ephemeral). Different defect. NOT Northern cottage / brass sneck-latch. Do not reuse cleared / sneck / chip-dismiss-ephemeral.

**NOT Drawbridge/#94049** (RC bridge auto-update drop). Different defect. NOT raised span / bailey. Do not reuse spanned / drawbridge / rc-bridge-update-drop.

**NOT Chirograph/#94045** (recorded branch never refreshed after `git branch -m`). Different defect. NOT medieval lectern / indenture. Do not reuse matched / chirograph / worktree-rename-stale.

**NOT Titulus** (iOS rename vs desktop sidebar / resume-stale-title). Different defect. NOT Roman marble plaque. Do not reuse inscribed / titulus.

**NOT Derelict** (orphaned Bash after session stop). Different defect. NOT maritime abandoned-hulk. Do not reuse berthed / derelict.

**NOT Vestry** (Linux bwrap placeholder mount cleanup is per-process). Different defect. NOT liturgical sacristy. Do not reuse pegged / vestry.

**NOT Mondegreen** (substring "git" false-positive). Different defect. NOT lyric-ballad / mishearing.

**NOT Afterimage/#92596** (Windows text paint latency). Different defect. NOT CRT phosphor.

**NOT Phosphene** (WindowServer CA layer-tree thrash). Different defect. NOT vision flash.

**NOT Scotoma.** Different defect. NOT vision gap.

**NOT Scrim** (runtime DLP redaction). Different product. Do not reuse flushed / scrim.

**NOT Aphonia/#92409** (missing SendMessage). Different defect. NOT ENT roster.

**NOT Sourdine/#93531** (mid-narration mute). Different defect. NOT concert mute.

**NOT Anarthria/#93782** (dictation paste drop). Different defect. NOT laryngology.

Live: https://hermes-playground-green.vercel.app/proscription/

```
node --test projects/proscription/proscription.test.mjs
node projects/proscription/proscription.mjs projects/proscription/data/proscription.json
```

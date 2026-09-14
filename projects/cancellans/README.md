# Cancellans

A **binder / print-shop / cancelled-leaf / folio-press booth** — in bibliography, a *cancellans* is the replacement leaf bound in for a cancelled leaf (*cancellandum*). The resume fork should be a faithful replacement folio of the parent's opening tools page. Instead the binder drops a line from that first folio and only later pastes a deferred delta, fracturing the prompt-cache prefix. Fonts **Fraunces** (display) + **Nunito Sans** (body) + **IBM Plex Mono** (mono). Palette: binder cloth indigo `#1B2430`, cancelled-stamp vermilion `#C23B22`, folio cream `#F4ECD8`, ink `#0D0C0A`, cache amber `#E0A100`, thread teal `#2A9D8F`. Fresh trio. Completely different UI/UX/metaphor — parent folio / fork folio / paste-slip / cache lamp. NOT a wax-seal atelier. NOT a hotel door-plate. NOT a lacquer nesting doll. NOT a night blotter. NOT an enrollment desk. NOT a type-foundry. NOT a neurology desk. NOT a gauntlet/lictor/lychgate/ouster/proscription booth. NOT Knock / Oubliette / Eidolon / Quietus / Aphonia / Sourdine / Wraith / Mirage / Afterimage / Scrim / Cachet / Veto.

The press should stay **intact** (HOLD: parent's initial tools array fully restored on resume; prefix hot). Instead the booth was **cancellans** after a **deferred-delta**.

Primary:

- [anthropics/claude-code#94400](https://github.com/anthropics/claude-code/issues/94400) (OPEN). Title: `[BUG] Resumed session drops a tool from the parent's initial tools array (EndConversation), so its first request misses the prompt cache`. Labels: bug, has-repro, platform:windows, area:core. Environment: Claude Code 2.1.270, Windows 11, `claude --bg`, `--safe-mode --tools "Bash,PowerShell,Read,Grep,Glob"` (no ToolSearch / cannot defer), `--model claude-opus-5`, ephemeral_1h cache writes. A resumed session (`--resume <uuid>`, which forks) does not reproduce the parent's tools array when the parent had a server-gated tool (here `EndConversation`) in its tools array from its first request. The fork's first request goes out without that tool and only later receives it as a `deferred_tools_delta` attachment. The prefix therefore differs early, and the fork's first request misses the prompt cache for the whole conversation even though the cache is well within TTL. Tools/system prompt that arrived *after* the parent's first request restore correctly; only a tool present in the parent's *initial* tools array is lost. Stay off Arras/Frangible/Nameplate/Matryoshka/Dragnet/Matricula/Allograph/Agraphia/Gauntlet/Lictor/Lychgate/Ouster/Proscription/Frisket/Scant/Knock paradigms.

09:50 cancellans: a binder / print-shop / cancelled-leaf / folio-press booth for #94400. Resumed (--resume) fork drops a server-gated tool (EndConversation) that was in the parent's initial tools array; first fork request omits it and only later gets deferred_tools_delta — prompt-cache prefix misses despite TTL. Post-first-request tools restore OK. Idle **intact** / seeded **cancellans** / path **deferred-delta**. Score cancellans or admit intact.

Score cancellans or admit intact.

Idle word: **intact** (HOLD: parent's initial tools array fully restored on resume; prefix hot). HOLD aliases: bound, mirrored, folio-match, prefix-hot, tools-restored. Seeded word: **cancellans** / #94400 (the deferred-delta path). Path word: **deferred-delta**. Product score: **cancellans**. Never idle cleared / armed / affixed / unpacked / draped / hung / screened / sealed / latched / guarded / scoped / enrolled or seeded Arras / Frangible / Nameplate / Matryoshka / Dragnet or path phantom-prompt / chmod-failopen / header-rename / subst-nest / root-find.

Phrase: **Score cancellans or admit intact.**

- **intact** = IDLE HOLD: parent's initial tools array fully restored; prefix hot
- **cancellans** = seeded path / product score: binder drops a line from the first folio; late paste
- **deferred-delta** = path word
- **hold** = HOLD alias for idle intact
- **bound** = HOLD alias: opening signature sewn
- **mirrored** = HOLD alias: fork folio matches parent folio
- **folio-match** = HOLD alias: first page reprinted honestly
- **prefix-hot** = HOLD alias: ephemeral_1h cache still read
- **tools-restored** = HOLD alias: initial tools array reproduced
- **cache-miss** = fork first request misses the prompt cache (read 7,462 / create 20,562)
- **initial-drop** = only a tool present in the parent's initial tools array is lost
- **endconversation** = server-gated `EndConversation` was in the parent's first-request array
- **fork-resume** = `--resume <uuid>` forks; forking itself does not break the cache when the tool was never in the array
- **ttl-alive** = all cache writes are 1h (`ephemeral_1h`); expiry is ruled out
- **landing** = binder / print-shop / cancelled-leaf / folio-press
- **has-repro** = published shape: 2.1.270 Windows 11 `--bg` `--safe-mode`
- **cousins** = cite-only #92033 #91151 #92524 #83913 — do not rebuild; do not conflate
- **backups** = cite-only #93924 #93770 #93777 #94151 — do not auto-pick
- **fixtures** = parent folio / fork folio
- **walk** = published idle intact → deferred-delta → cancellans
- **closed** = #94400 remains OPEN — cite only; not this booth

Verdicts: intact, cancellans, deferred-delta, hold, bound, mirrored, folio-match, prefix-hot, tools-restored, cache-miss, initial-drop, endconversation, fork-resume, ttl-alive, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **cancellans** or already **intact**. Fixtures use the issue's published incident only. Deferred-delta rows are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): the resume fork does not reproduce a server-gated tool that was in the parent's initial tools array; the first fork request omits it and only later gets deferred_tools_delta, so the prompt-cache prefix misses despite TTL. Invite verify against #94400 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94400](https://github.com/anthropics/claude-code/issues/94400)
- Cousins: do NOT rebuild / do NOT conflate: #92033 (mid-conversation `deferred_tools_delta` invalidates cache), #91151 (resume cache collapses to system+tools floor), #92524 (Diopter — scratchpad UUID lens defocuses cache), #83913 (hook additionalContext rewrite). None of them covers a `--resume` fork that drops a server-gated tool from the parent's *initial* tools array and only later pastes `deferred_tools_delta`.
- Backups (data only; next focus only — do not auto-pick): #93924, #93770, #93777, #94151
- Do NOT pick #94336

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has-repro, platform:windows, area:core
- Environment: Claude Code 2.1.270, Windows 11, `claude --bg`
- `--safe-mode --tools "Bash,PowerShell,Read,Grep,Glob"` — no ToolSearch / cannot defer
- `--model claude-opus-5`, `--max-turns 40`, `--dangerously-skip-permissions`
- All cache writes are 1h (`ephemeral_1h_input_tokens`); expiry is ruled out
- `--resume <uuid>` forks
- Parent had server-gated `EndConversation` in its first-request tools array
- Fork first request omits that tool
- 3 s later: `deferred_tools_delta` attachment with `addedNames: ["EndConversation"]`
- Prefix differs early; fork first request misses the prompt cache
- Evidence: parent first 8,926 / 7,776; parent last 27,957 / 1,118; fork first (2m11s) **7,462 / 20,562**; cold session without the tool 7,462 / 7,701
- Fork first read equals the static prefix of a session without the tool
- Post-first-request tools and system prompt restore correctly
- A second pair where the parent never had the tool: full hit (31,790 / 698) — forking itself does not break the cache
- `--disallowedTools EndConversation` does not keep the tool out of the request
- One test resume on 2.1.271 got a full hit — a single sample, so it may be fixed or it may be the race

Problem found: DEFERRED-DELTA — replacement folio drops a line from the parent's opening tools page; late paste fractures the prefix.

Why Cancellans: A *cancellans* is the replacement leaf bound in for a cancelled leaf. The fork should be that faithful reprint of the parent's first folio. Instead the binder drops `EndConversation` from the opening tools page and only later pastes a deferred slip. Arras/#94348 was a phantom approval card — DIFFERENT. Frangible/#94362 was a wax-seal atelier / chmod-failopen — DIFFERENT. Nameplate/#94349 was a hotel door-plate / header-rename — DIFFERENT. Matryoshka/#94350 was a lacquer nesting-doll / subst-nest — DIFFERENT. Dragnet/#94064 was a night blotter / root-find — DIFFERENT. This booth is specifically resume/fork **initial tools array** vs **prompt-cache prefix** honesty. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: interactive educational booth that scores idle **intact** / seeded **cancellans** / path **deferred-delta** so the failure mode is legible. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. On resume, the fork's first request should carry the same tools array as the parent's last request, as recorded in the parent's `prompt_snapshot`
2. A server-gated tool present in the parent's initial tools array must be reproduced on the fork's first request — not pasted later as `deferred_tools_delta`
3. The prefix should match so the prompt cache is read while `ephemeral_1h` is still within TTL

## Why not a clone

This is specifically: **RESUME/FORK INITIAL TOOLS ARRAY VS PROMPT-CACHE PREFIX HONESTY. A `--resume` FORK DROPS A SERVER-GATED TOOL (`EndConversation`) THAT WAS IN THE PARENT'S INITIAL TOOLS ARRAY; THE FIRST FORK REQUEST OMITS IT AND ONLY LATER GETS `deferred_tools_delta` — THE PREFIX MISSES DESPITE TTL. POST-FIRST-REQUEST TOOLS RESTORE OK.**

Novel paradigm: binder / print-shop / cancelled-leaf / folio-press — indigo cloth, vermilion stamp, folio cream, ink, cache amber, thread teal. New issue, new paradigm (deferred-delta), new UI/UX/fonts/colors, new scoring vocabulary. A cancelled-leaf reprint, not a wax-seal atelier, hotel door-plate, nesting-doll workshop, night blotter, enrollment desk, type-foundry ledger, neurology clinic, tilting-yard glove, purple fasces aisle, parish porch, bailiff desk, or Roman tablet.

**NOT Arras/#94348** (phantom approval card). Different defect. Do not reuse cleared / Arras / phantom-prompt.

**NOT Frangible/#94362** (chmod-failopen). Different defect. NOT wax-seal atelier. Do not reuse armed / Frangible / chmod-failopen.

**NOT Nameplate/#94349** (header-rename). Different defect. NOT hotel door-plate. Do not reuse affixed / Nameplate / header-rename.

**NOT Matryoshka/#94350** (subst-nest). Different defect. NOT lacquer nesting-doll. Do not reuse unpacked / Matryoshka / subst-nest.

**NOT Dragnet/#94064** (root-find). Different defect. NOT night blotter. Do not reuse scoped / Dragnet / root-find.

**NOT Matricula/#93987** (reload-blind). Different defect. NOT enrollment desk. Do not reuse enrolled / Matricula / reload-blind.

**NOT Allograph/#94256** (win-posix-mismatch). Different defect. NOT type-foundry / punchcutter. Do not reuse equated / Allograph / win-posix-mismatch.

**NOT Agraphia/#94251** (pre-tool-omit). Different defect. NOT clinical writing-desk. Do not reuse penned / Agraphia / pre-tool-omit.

**NOT Gauntlet/#94029** (attach-mouse). Different defect. NOT tilting-yard / iron glove. Do not reuse ungloved / Gauntlet / attach-mouse.

**NOT Lictor/#94053** (picker-bypass). Different defect. NOT purple fasces aisle. Do not reuse attested / Lictor / picker-bypass.

**NOT Lychgate/#94059** (bg-task-stale). Different defect. NOT parish porch. Do not reuse reaped / Lychgate / bg-task-stale.

**NOT Ouster/#94221** (inherited-worktree-yank). Different defect. NOT Georgian bailiff desk. Do not reuse tenanted / Ouster / inherited-worktree-yank.

**NOT Proscription/#94202** (deny-list-hollow). Different defect. NOT Roman wax-tablet forum. Do not reuse barred / Proscription / deny-list-hollow.

**NOT Knock.** Fail-loud stalled grants. Different catalog paradigm. Do not reuse Knock.

**NOT Oubliette. NOT Eidolon. NOT Quietus. NOT Aphonia. NOT Sourdine. NOT Wraith. NOT Mirage. NOT Afterimage. NOT Scrim. NOT Cachet. NOT Veto.**

**NOT Frisket.** Different catalog paradigm. Do not reuse Frisket.

**NOT Scant.** Different catalog paradigm. Do not reuse Scant.

Live: https://hermes-playground-green.vercel.app/cancellans/

```
node --test projects/cancellans/cancellans.test.mjs
node projects/cancellans/cancellans.mjs projects/cancellans/data/cancellans.json
```

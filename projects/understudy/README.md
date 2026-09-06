# Understudy

A **dressing-room / call-board / understudy casting lab** — theatrical dark stage, warm call-board amber, chalk blocking marks, costume-rack silhouette, role placards (Explore vs Lead), prompt/tool gauges — Bodoni Moda + Source Sans 3 + IBM Plex Mono — for a real Claude Code defect: **THE `AGENT` TOOL IGNORES THE SUBAGENT DEFINITION. A DISPATCHED SUBAGENT RECEIVES THE DISPATCHING SESSION'S SYSTEM PROMPT AND TOOL SURFACE WHOLESALE (BUILT-IN AND PLUGIN TYPES).**

Primary:

- [anthropics/claude-code#92426](https://github.com/anthropics/claude-code/issues/92426) (OPEN, bug, has-repro, platform:macos, area:agents). Title: `Agent tool ignores the subagent definition: dispatched subagents inherit the dispatcher's prompt and tools (built-in and plugin types)`. Filed 2026-09-06. Reporter: alexatpando.

13:50 understudy: an understudy that walks on in the lead's costume with every prop from the wings is not the cast member you booked — it is already miscast. Score the role or admit the part already inherited.

Idle word: **miscast**. Seeded state: **inherited** / #92426 — Agent() dispatched Explore; Write yes; generic interactive-agent prompt; body never applied. Never idle as unguided, dropped, strobing, stolen, dawnlocked, misaimed, washed, stranded, unstruck, leaked, nixied, settled, open, elided, grafted, frozen, adrift, or any prior catalog idle.

**Understudy** is dressing-room work. A booked Explore should walk on as Explore. Here the call-board lists the role correctly, then dispatch sends the lead's costume and every prop from the wings. Score whether a role (cast vs top-level `--agent` vs registry listing vs no-ceiling vs prompt-leak vs plugin-batch) would stay miscast, cast, or leave the part already inherited.

- **miscast** = IDLE: definition booked; dispatch walks on in the lead's costume
- **inherited** = seeded word: dispatcher prompt and tools wholesale; body never applied
- **cast** = contrast hold: definition applied
- **top-level-ok** = contrast hold: `claude --agent Explore` applies correctly
- **registry-lists** = contrast hold: Available agent types listing correct
- **no-ceiling** = `tools:` neither ceiling nor floor
- **prompt-leak** = dispatcher-unique sentence in child
- **plugin-batch** = 3/3 plugin agents same failure
- **ruled-out-or-workarounds** = MCP-inheritance framing is not the whole; zero-MCP still fails

Verdicts: miscast, inherited, cast, top-level-ok, registry-lists, no-ceiling, prompt-leak, plugin-batch, ruled-out-or-workarounds.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether an Agent() dispatch would leave the role miscast or already inherited. Fixtures use the issue's Explore repro, prompt-leak, plugin-batch 3/3, registry listing, top-level `--agent` contrast, and the MCP-framing rule-out only.

Hypothesis only (NON-BINDING): Instantiation path under Agent() may skip applying the looked-up definition's body/tools and instead clone the parent session surface; top-level `--agent` uses a different path that does apply. Verify against issue evidence only. Discard if issue evidence disagrees. Encoded from the issue body only.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92426](https://github.com/anthropics/claude-code/issues/92426)

What happened (from the issue — do not invent):

- Environment: Claude Code **2.1.263**; macOS **26.6.2** (Darwin 25.6.0).
- The `Agent` tool ignores the subagent definition. A dispatched subagent receives the **dispatching session's system prompt and tool surface wholesale** — for built-in and plugin agent types alike.
- `tools:` is neither a ceiling nor a floor under dispatch. The agent body is never applied. Dispatch does not error; it returns a plausible-looking agent that is not the one requested.
- The same definitions **are** applied correctly at top level via `claude --agent <name>`.
- Explore is defined as "All tools except Agent, Artifact, ArtifactComments, ArtifactData, ArtifactCheck, ExitPlanMode, Edit, Write, NotebookEdit".
- Stock install, no plugins, no MCP servers, one call: `Agent({ subagent_type: "Explore", prompt: "Reply with exactly two lines. Line 1: do you have the Write tool — yes or no. Line 2: the first sentence of your system prompt." })`.
- Expected: `no`, and the Explore agent's own prompt. Observed: `yes`, and `"You are an interactive agent that helps users with software engineering tasks."` — the generic prompt. Child also holds `Agent`, `Edit`, and `Artifact`, all excluded by the definition.
- Inheritance is positive, not merely a default: the child reproduced **verbatim a sentence unique to the dispatching session's own system prompt** (a project-specific instruction that appears nowhere in any agent definition). The issue does not quote that sentence.
- Contrast: `claude --agent Explore` at top level applies the definition correctly — restricted tools, agent prompt present.
- Second reproduction — plugin agents, same result. Three subagents dispatched in one batch from a session holding several MCP servers. Definitions declare nine built-in tools plus exactly one MCP namespace each, byte-identical on disk to the installed plugin version.
- Every child received: **no agent body** (no `# <agent-name>` heading, none of the definition's role instructions); generic prompt opening `"You are Claude Code, Anthropic's official CLI for Claude, running within the Claude Agent SDK."`; **no tool ceiling** — `Bash`, `Agent`, `Artifact`, `ToolSearch`, and every MCP server the dispatcher had — 460 deferred tool names in one case against a declared list of ~28. Three of three. Survives a full restart. Deterministic.
- The harness **does** load the definitions: the "Available agent types" listing delivered to the children reproduced each agent's name, description and frontmatter tool list verbatim. Registration and parsing work; instantiation is what fails.
- #30280 and #80036 report MCP tools not reliably inherited. That is one visible consequence, not the whole — the behaviour is not MCP-specific and reproduces with zero MCP servers. Framing it as MCP inheritance hides the inverse: a child from a well-stocked parent silently gains tools its definition excludes.
- Impact: any project whose least-privilege story rests on agent definitions has **no ceiling under dispatch**, and every MCP server registered in the session leaks into every subagent. Reporter's server-side authorization still refused cross-role writes — containment is theirs, not the harness's.

## Why not a clone

This is specifically: **Agent() dispatch ignores the looked-up subagent definition and clones the parent session prompt/tools.**

NOT Fairlead/#92403 — URI scheme `file://`-only remote Explorer drop. Understudy is not a hawse-pipe.
NOT Stroboscope/#92395 — terminal flicker focus steal. Understudy is not an optics strobe bench.
NOT Heliostat/#92389 — theme auto DECSET 2031. Understudy is not an observatory heliostat.
NOT Lethe/#92335 — Chrome silent re-auth. Understudy is not an underworld ferry.
NOT Frizzen/#92353 — UserPromptSubmit listed-but-never-invoked. Understudy is not a flintlock desk.
NOT Nixie/#92383 — auto-mode send_message 45s no-ack settle. Understudy is not a USPS nixie desk.
NOT Embrasure/#92365 — sandbox denyRead fail-open. Understudy is not a battlement.
NOT Elision/#92347 — summarize-up-to-here drops summaries. Understudy is not a blue-pencil folio.
NOT Graft/#92354 — plugin-cache copy-forward. Understudy is not an orchard grafting bench.
NOT Callboard — stage-door slash-command autocomplete miss. Understudy is Agent() instantiation, not pre-session discoverability.
NOT Gypsy/Wildcat/#92399 — bg completion semantics (backup — do not build).
Do NOT name this Changeling, Surrogate, Doppelganger, Masker, Gypsy, Wildcat, Fulcrum, Trunnion, Aphonia, Fairlead, or Stroboscope.

Different surface: Agent() dispatch clones parent prompt/tools vs those.

Cousins cite-only (NOT primary):

- [#30280](https://github.com/anthropics/claude-code/issues/30280) OPEN — MCP inherit unreliable (symptom framing)
- [#80036](https://github.com/anthropics/claude-code/issues/80036) OPEN — nested tool strip
- [#89277](https://github.com/anthropics/claude-code/issues/89277) OPEN — fork unconstrained inherit
- [#78234](https://github.com/anthropics/claude-code/issues/78234) OPEN — plugin-scoped defs ignored in teams
- [#80569](https://github.com/anthropics/claude-code/issues/80569) OPEN — effort frontmatter ignored
- [#92259](https://github.com/anthropics/claude-code/issues/92259) OPEN — Agent allowlist no effect nested

Product name stays **Understudy**. Do not rename to Fairlead, Stroboscope, Heliostat, Lethe, Frizzen, Nixie, Embrasure, Elision, Graft, Callboard, Changeling, Surrogate, Doppelganger, Masker, Gypsy, Wildcat, Fulcrum, Trunnion, Aphonia, or any existing catalog slug. Name/slug `understudy` confirmed unused in catalog.json.

Different UI: dressing-room / call-board / understudy casting lab — theatrical dark stage, warm call-board amber, chalk marks, costume rack, role placards, prompt/tool gauges. Bodoni Moda + Source Sans 3 + IBM Plex Mono. NOT Fraunces / Outfit / Fragment Mono (Fairlead hawse). NOT Syne / Manrope / IBM Plex Mono (Stroboscope optics). NOT Bricolage Grotesque / Sora / JetBrains Mono (Heliostat). NOT Playfair Display / DM Sans (Callboard stage-door). Stay OFF hawse-pipe / optics strobe / rooftop observatory / underworld ferry / flintlock lockplate / postal pigeonholes / battlement merlons / blue-pencil folio / orchard cambium / stage-door slash-menu board.

Different verbs: Score the role, pin idle miscast, pin seeded inherited, admit the part already inherited, flip dispatch vs top-level vs registry vs plugin-batch, load fixtures, reset to cast.

Different idle: **miscast**. Different seeded: **inherited**. Contrast: **cast** / **top-level-ok** / **registry-lists**.

## Live catalog path

`/understudy/` is this static dressing-room scoring assay. Path `https://hermes-playground-green.vercel.app/understudy/` and subdomain `https://understudy.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `13:50 / hermes catalog #173 / #92426`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **inherited** — Agent() dispatch; Write yes; generic prompt; body never applied.
2. Idle **miscast** → booked Explore walks on as Lead.
3. Contrast **cast** → definition applied; booked role walks on.
4. Contrast **top-level-ok** → `claude --agent Explore` applies correctly.
5. Contrast **registry-lists** → Available agent types listing correct.
6. Failure **no-ceiling** → `tools:` neither ceiling nor floor.
7. Failure **prompt-leak** → dispatcher-unique sentence in child.
8. Failure **plugin-batch** → 3/3 plugin agents same failure.
9. Assay UI: dressing-room, call-board, costume rack, role placards, prompt/tool gauges, chalk blocking.
10. Stay-off strip: Fairlead / Stroboscope / Heliostat / Lethe / Frizzen / Nixie / Embrasure / Elision / Graft / Callboard. Primary stays #92426.
11. **Score the role** walks the probe ticket and lights chips on the board. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite the role (dispatch / top-level / registry / plugin-batch).

## How to score

Open `projects/understudy/index.html` in a browser, or serve the repo root and visit `/understudy/` (Vercel rewrite → `/projects/understudy`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **miscast** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **inherited** / dispatcher prompt+tools wholesale / body never applied.

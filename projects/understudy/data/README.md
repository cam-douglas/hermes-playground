# Understudy fixtures

Diagnostic JSON only. No live Claude sessions. Encoded from #92426 issue facts: the `Agent` tool ignores the subagent definition. A dispatched subagent receives the dispatching session's system prompt and tool surface wholesale (built-in and plugin types). `tools:` is neither a ceiling nor a floor under dispatch. The agent body is never applied. Dispatch does not error; it returns a plausible-looking agent that is not the one requested. The same definitions are applied correctly at top level via `claude --agent <name>`. Registry listing still shows correct name/description/frontmatter — registration works; instantiation fails.

Idle word: **miscast**. Seeded word: **inherited**. Contrast: **cast** / **top-level-ok** / **registry-lists**. Failure rows: **no-ceiling** / **prompt-leak** / **plugin-batch**. Primary: [anthropics/claude-code#92426](https://github.com/anthropics/claude-code/issues/92426). Seed primary as inherited / dispatcher prompt+tools wholesale / body never applied.

| File | Verdict | What it scores |
|---|---|---|
| `miscast.json` | miscast | Idle understudy fence. Definition booked; dispatch walks on in the lead's costume. Already miscast. |
| `inherited.json` | inherited | Seeded #92426. Child inherits dispatcher prompt and tools wholesale. Admit the part already inherited. |
| `92426.json` | inherited | Primary fixture alias for #92426. |
| `repro.json` | inherited | Published Explore dispatch: Write yes; generic interactive-agent prompt. |
| `no-ceiling.json` | no-ceiling | `tools:` is neither a ceiling nor a floor under dispatch. |
| `prompt-leak.json` | prompt-leak | Child reproduced a sentence unique to the dispatcher's project-specific system prompt. |
| `plugin-batch.json` | plugin-batch | 3/3 plugin agents: no body, no ceiling, 460 deferred vs ~28 declared. |
| `cast.json` | cast | Contrast hold. Definition applied: body, tools, role. |
| `top-level-ok.json` | top-level-ok | Contrast. `claude --agent Explore` applies restricted tools and agent prompt. |
| `registry-lists.json` | registry-lists | Contrast. Available agent types listing shows correct name/description/frontmatter. |
| `ruled-out-or-workarounds.json` | miscast | MCP-inheritance framing is not the whole of it; zero-MCP still fails. No harness ceiling. |
| `cousins.json` | stay-off | Cite-only cousins #30280 #80036 #89277 #78234 #80569 #92259. |
| `fixtures.json` | index | Row list for the dressing-room / call-board / casting lab. |

Drop any file onto `projects/understudy/index.html` or paste the JSON. The living page seeds **inherited** / dispatcher prompt+tools wholesale / body never applied.

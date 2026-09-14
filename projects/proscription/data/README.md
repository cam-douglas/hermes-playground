# Proscription fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94202 issue facts: a custom subagent's own frontmatter `disallowedTools` does not strip tools. Score proscription or admit barred.

Idle word: **barred**. Path word: **deny-list-hollow**. Seeded loss: **proscription**. Product: **proscription**. HOLD: **barred**. ALARM: **proscription** / **deny-list-hollow** / **bash-still-loaded**. Primary: [anthropics/claude-code#94202](https://github.com/anthropics/claude-code/issues/94202).

Fixtures record the published incident only. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `barred.json` | barred | Idle tablet. HOLD: deny list actually strips tools. |
| `hold.json` | hold | HOLD alias for idle barred. |
| `proscription.json` | proscription | Seeded #94202 path and product. ALARM: names still walk. |
| `deny-list-hollow.json` | deny-list-hollow | Path: frontmatter list unused. |
| `denied.json` | denied | HOLD alias: names denied at load. |
| `struck.json` | struck | HOLD alias: stylus strikes the name. |
| `excised.json` | excised | HOLD alias: listed tools excised. |
| `absent.json` | absent | HOLD alias: ToolSearch does not return them. |
| `stripped.json` | stripped | HOLD alias: loaded functions stripped. |
| `bash-still-loaded.json` | bash-still-loaded | Bash on the list still loaded and executes. |
| `websearch-executes.json` | websearch-executes | WebSearch ToolSearch-found; call runs. |
| `mcp-full-name-executes.json` | mcp-full-name-executes | MCP full name found and executed. |
| `classifier-only-denial.json` | classifier-only-denial | project_delete denied by classifier, not the list. |
| `four-spawns.json` | four-spawns | Four independent spawns (2×27-entry, 2×minimal). |
| `template-read-at-spawn.json` | template-read-at-spawn | Template body read at spawn (not stale registry). |
| `prefix-glob-no-effect.json` | prefix-glob-no-effect | Prefix globs also had no effect. |
| `deny-probe.json` | deny-probe | Minimal repro shape deny-probe.md. |
| `landing.json` | landing | Marble lintel / wax tablet / iron stylus. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #78063. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Marble lintel / wax tablet / iron stylus. |
| `walk.json` | walk | Published idle barred → deny-list-hollow → proscription. |

## Cousins (cite only)

Different surface from #94202 subagent OWN template disallowedTools. Do NOT rebuild. Do NOT conflate.

#78063 — parent agent's disallowedTools not inherited by subagents it spawns. Distinct cousin.

#94202 is specifically: the subagent's OWN template disallowedTools not applying to that subagent.

## Backups (cite only — do NOT auto-pick or build)

#94029 #93987 #93924 #93770 #93777 #94059 #94053 #94151 #94064

Drop any file onto `projects/proscription/index.html`. Buttons load the seeded path. The barred page admits **barred** / idle tablet / #94202.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

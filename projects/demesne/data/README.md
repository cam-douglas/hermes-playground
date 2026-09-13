# Demesne fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #93989 issue facts: bwrap Bash sandbox binds entire `/home` instead of `$HOME`, so bare `/home/.mcp.json` writes Permission denied. Score demesne or admit demesned.

Idle word: **demesned**. Path word: **home-bind-overreach**. Seeded loss: **demesne**. Product: **demesne**. HOLD: **demesned**. ALARM: **demesne** / **home-bind-overreach** / **whole-home-bind** / **bare-home-write**. Primary: [anthropics/claude-code#93989](https://github.com/anthropics/claude-code/issues/93989).

Fixtures record the published incident only. No session. No secrets. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `demesned.json` | demesned | Idle manor holding. HOLD: bind scoped to $HOME. |
| `hold.json` | hold | HOLD alias for idle demesned. |
| `demesne.json` | demesne | Seeded #93989 path and product. ALARM: /home overbound. |
| `home-bind-overreach.json` | home-bind-overreach | Path: charter strap slams across /home. |
| `home-scoped.json` | home-scoped | HOLD alias: bind scoped to $HOME. |
| `private-holding.json` | private-holding | HOLD alias: lord's own land. |
| `bind-home.json` | bind-home | HOLD alias: `--bind $HOME $HOME`. |
| `user-home.json` | user-home | HOLD alias: `/home/<user>` only. |
| `whole-home-bind.json` | whole-home-bind | `--bind /home /home` wholesale. |
| `bare-home-write.json` | bare-home-write | Path lands on `/home/.mcp.json`. |
| `mcp-denied.json` | mcp-denied | Permission denied on the commons. |
| `root-owned-commons.json` | root-owned-commons | `/home` is root:root 755. |
| `env-scrub.json` | env-scrub | `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1`. |
| `safe-mode.json` | safe-mode | Observed with `--safe-mode`. |
| `overbound-manor.json` | overbound-manor | Whole manor bound, not the demesne. |
| `landing.json` | landing | Manor-charter landing / holding sill. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #91122 RO ~/.claude bind. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Parchment / oak / heraldic green / iron ink. |
| `walk.json` | walk | Published idle demesned → home-bind-overreach → demesne. |

## Cousins (cite only)

#91122 — read-only `~/.claude` bind. Different: RO mount of config dir, not overbroad `/home` parent. Do not conflate.

## Backups (cite only — do NOT auto-pick or build)

#93770 #93777 #93811 #93924 #93925 #93954 #93967 #93957 #93987

Drop any file onto `projects/demesne/index.html`. Buttons load the seeded path. The living page admits **demesned** / idle holding / #93989.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

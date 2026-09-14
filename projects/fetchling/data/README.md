# Fetchling fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94065 issue facts: Skill-tool load replaces literal `$1`–`$19` in skill Markdown with unrelated conversation fragments. Disk unmodified. CLAUDE.md `$10` intact. `$20+` survive. Same line can mix. Score fetchling or admit literal.

Idle word: **literal**. Path word: **skill-dollar-swap**. Seeded loss: **fetchling**. Product: **fetchling**. HOLD: **literal**. ALARM: **fetchling** / **skill-dollar-swap** / **sub-1-19** / **conversation-fragment**. Primary: [anthropics/claude-code#94065](https://github.com/anthropics/claude-code/issues/94065).

Fixtures record the published incident only. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `literal.json` | literal | Idle desk. HOLD: mint tray face-value; ledger true. |
| `hold.json` | hold | HOLD alias for idle literal. |
| `fetchling.json` | fetchling | Seeded #94065 path and product. ALARM: `$N` swapped. |
| `skill-dollar-swap.json` | skill-dollar-swap | Path: Skill-tool load replaces `$1`–`$19`. |
| `as-written.json` | as-written | HOLD alias: `$N` tokens reach the model as written. |
| `face-value.json` | face-value | HOLD alias: coin faces stay mint-true. |
| `mint-true.json` | mint-true | HOLD alias: the mint tray still holds the true coins. |
| `dollar-intact.json` | dollar-intact | HOLD alias: `$1`–`$19` and `$20+` both stay intact. |
| `skill-verbatim.json` | skill-verbatim | HOLD alias: Skill-tool load matches the disk file. |
| `ledger-true.json` | ledger-true | HOLD alias: every ledger row stays as-written. |
| `claude-md-intact.json` | claude-md-intact | CLAUDE.md `$10` stays face-value. |
| `skill-path-corrupt.json` | skill-path-corrupt | Skill-tool `$10` becomes `the`. |
| `sub-1-19.json` | sub-1-19 | `$3 $5 $10 $13 $15 $19` become conversation fragments. |
| `intact-20-plus.json` | intact-20-plus | `$20 $25 $49.99 $125 $175` stay mint. |
| `same-line-mix.json` | same-line-mix | `$19` gone, `$25` survives on one line. |
| `conversation-fragment.json` | conversation-fragment | replacement text from surrounding conversation. |
| `silent-corruption.json` | silent-corruption | disk file unmodified; load is swapped. |
| `landing.json` | landing | Twilight / mint tray / ledger / fae glass. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only #79859 #82175 #89978 #91957 #92457 — args/Bash, not Skill-load. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Twilight / mint tray / ledger / fae glass. |
| `walk.json` | walk | Published idle literal → skill-dollar-swap → fetchling. |

## Cousins (cite only)

Different surfaces/mechanisms from #94065 Skill-load path. Do NOT rebuild. Do NOT conflate.

#79859 — Skill tool args bash-style $N against SKILL.md prose. Args surface.

#82175 — Skill tool args corrupts $1/$2 in code examples. Args surface.

#89978 — Bash tool strips dollar amounts from message content. Bash tool surface.

#91957 — Skill args silently rewrites literal dollar figures in SKILL.md. Args surface.

#92457 — Skill/command argument substitution off-by-one / limited to $0/$1. Args/command substitution.

#94065 is specifically: Skill-tool content load path swaps $1–$19 for conversation fragments; CLAUDE.md intact.

## Backups (cite only — do NOT auto-pick or build)

#94029 #93987 #93924 #93770 #93777 #94059 #94053 #94174 #94151 #94064

Drop any file onto `projects/fetchling/index.html`. Buttons load the seeded path. The literal page admits **literal** / idle desk / #94065.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

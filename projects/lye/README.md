# Lye

A **fuller's / alkali wash house** — wet stone, pewter, soft ash-green, soap foam, iron vat, hanging hanks of yarn, steam haze; Libre Baskerville + Source Sans 3 + IBM Plex Mono — for a real Claude Code defect: **with `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1`, version 2.1.251 removes `CLAUDE_CONFIG_DIR` from the environment of subprocesses Claude Code spawns** (verified for hooks and the Bash tool). The parent still writes its own state into the relocated `CLAUDE_CONFIG_DIR`, so the session uses that directory while processes it starts resolve `~/.claude`. 2.1.250 passes the variable through with scrub enabled. Repro uses `/tmp/scrubprobe` with a SessionStart hook dumping env; `grep '^CLAUDE_CONFIG_DIR='` is 1 on 2.1.250 and 0 on 2.1.251; `ls` of the relocated config still shows `.claude.json`, `projects/`, `sessions/` on both. Bash tool same: `env | grep -c CLAUDE_CONFIG_DIR` prints 1 on 2.1.250 and 0 on 2.1.251. Nothing printed about the removal; `--debug` log contains no message either. A fresh empty config directory can exit "Not logged in" after the hook has run.

Primary:

- [anthropics/claude-code#91020](https://github.com/anthropics/claude-code/issues/91020) (OPEN, bug, has repro, platform:windows, area:security, area:bash, area:hooks, regression, filed 2026-08-31T15:46:51Z). Title: 2.1.251 regression: CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1 strips CLAUDE_CONFIG_DIR from hooks and Bash subprocesses.

A scrub that strips the relocated address from every child while the parent still writes there is not a hold. Score the vat or admit **rinsed**.

Idle word: **rinsed**. Seeded state: **scrubbed** / #91020 — children lost `CLAUDE_CONFIG_DIR`; parent still uses the relocated dir. Never idle as "scrubbed" / "stripped" / "lye" / "advowson" / "reserved" / "vacant" / "smutch" / "plain" / "seated" / "bound" / "hallmarked" / "pointed" / "collapsed" / "spoiled" / "banked" / "misstruck" / "hunting" / "traced".

**Lye** is the alkali wash — fuller's vat, the scrub bath that strips too much from the yarn while the master bolt still holds the dye house address.

- **rinsed** = hold: scrub on, `CLAUDE_CONFIG_DIR` still reaches children (2.1.250 pass-through)
- **scrubbed** = #91020 primary — children lost the address; parent still writes the vat
- **stripped** = `CLAUDE_CONFIG_DIR` removed from subprocess env
- **relocated-parent** = parent still writes the relocated directory
- **default-home** = children resolve `~/.claude`
- **hook-blind** = SessionStart hook grep is 0
- **bash-blind** = Bash tool grep is 0
- **silent-drop** = nothing printed about the removal
- **regression-251** = the strip is on 2.1.251
- **scrub-flag** = `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1` is the instrument
- **config-dir-lie** = session and children disagree about where config lives
- **dual-home** = parent relocated, children default-home
- **unlogged** = `--debug` contains no message
- **pass-through-250** = hold: 2.1.250 kept the variable
- **not-logged-in** = fresh empty config can exit "Not logged in" after the hook

Verdicts: scrubbed, stripped, relocated-parent, default-home, hook-blind, bash-blind, silent-drop, regression-251, scrub-flag, config-dir-lie, dual-home, unlogged, pass-through-250, not-logged-in, rinsed.

Overlapping proof from the issue: SessionStart hook grep plus Bash tool grep, both 1 on 2.1.250 and 0 on 2.1.251, while the relocated listing stays intact on both.

## Why not a clone

This is specifically: **ENV-SCRUB REGRESSION + RELOCATED `CLAUDE_CONFIG_DIR` STRIPPED FROM CHILDREN + PARENT STILL WRITES THE VAT**.

NOT **Advowson** ([#91005](https://github.com/anthropics/claude-code/issues/91005)) — Workflow name silent built-in.
NOT **Smutch** ([#90993](https://github.com/anthropics/claude-code/issues/90993)) — desktop Icon\r crawl.
NOT **Bitting** ([#90970](https://github.com/anthropics/claude-code/issues/90970)) — Slack MCP most-recent-mint exclusivity.
NOT **Puncheon** ([#90962](https://github.com/anthropics/claude-code/issues/90962)) — Write-tool BOM-less `.ps1`.
NOT **Pale** ([#90683](https://github.com/anthropics/claude-code/issues/90683)) — hooks silently absent.
NOT **Pawl** ([#90784](https://github.com/anthropics/claude-code/issues/90784)) — sticky UserPromptSubmit stop.
NOT **Ambo** ([#90685](https://github.com/anthropics/claude-code/issues/90685)) — systemMessage non-render.
NOT **Chatelaine** ([#90647](https://github.com/anthropics/claude-code/issues/90647)) — mcpOAuth nested in Keychain.

Different UI: fuller's / alkali wash house. Wet stone #1e2428, pewter #8a9298, ash-green #8aa090, soap foam #f6f3ea, iron vat #14181c. Libre Baskerville + Source Sans 3 + IBM Plex Mono. NOT Advowson Cormorant / Karla / Roboto parchment/violet. NOT Smutch Fraunces / DM Sans / IBM Plex blotter/brass. NOT Bitting Libre Bodoni / Figtree / JetBrains felt-green. NOT Puncheon Cinzel / Outfit / Spline walnut/gold/oxblood.

Different verbs: score the vat, pin idle rinsed, pin seeded scrubbed, admit rinsed, load fixtures, reset to rinsed. Not "Score the presentation" / "Pin idle vacant" / "Score the smutch" / "Score the bitting" / "Score the gold".

Different idle: **rinsed**.

## Live catalog path

`/lye/` is this static wash house. Demo works with no secrets and no npm. Mark: `01:50 / hermes catalog #99 / #91020`.

1. Idle demo loads **rinsed** — scrub on, `CLAUDE_CONFIG_DIR` still reaches children.
2. Seed **scrubbed** → #91020 ticket: 2.1.251 strips the relocated address from hooks and Bash; parent still writes `/tmp/scrubprobe`.
3. Vat / hank board: SessionStart hook, Bash tool, relocated parent listing, scrub flag, debug silence.
4. Iron vat + hanging hanks: rinsed / scrubbed / pass-through.
5. Vat plaque: parent still writes the relocated dir.
6. Hank plaque: children lost `CLAUDE_CONFIG_DIR`.
7. Scrub-flag plaque: `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1`.
8. Dual-home plaque: parent relocated vs children `~/.claude`.
9. **Score the vat** walks the ticket and lights chips on the rail.

## How to score

Open `projects/lye/index.html` in a browser, or serve the repo root and visit `/lye/` (Vercel rewrite → `/projects/lye`). No build step. Optional hook:

```bash
node projects/lye/hook/lye.mjs projects/lye/data/91020.json
node projects/lye/hook/lye.mjs projects/lye/data/rinsed.json
node --test projects/lye/hook/lye.test.mjs
```

Scrubbed seed → scrubbed/alarm. Rinsed seed → rinsed/hold. 2.1.250 seed → pass-through-250 / hold.

`projects/lye/hook/lye.mjs` classifies a rinse vs scrub trace and returns `{ verdict, chips[], reasons[], hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91020.json`, `data/scrubbed.json`, `data/rinsed.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`. Evidence only from issue facts.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91020](https://github.com/anthropics/claude-code/issues/91020). Unauthenticated. See `.env.example`.
2. Vat / hank board of the scrub path; iron-vat the folio.
3. Pin idle rinsed / pin seeded scrubbed / score the vat / admit rinsed / load fixtures / reset to rinsed.
4. Vat plaque (relocated parent still writes).
5. Hank plaque (hooks and Bash lost the address).
6. Scrub-flag plaque (`CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1`).
7. Dual-home plaque (parent relocated vs children `~/.claude`).

## Sources

- [anthropics/claude-code#91020](https://github.com/anthropics/claude-code/issues/91020) OPEN
- Same-class (cite, not primary): [#90683](https://github.com/anthropics/claude-code/issues/90683) Pale silent-absent / [#90784](https://github.com/anthropics/claude-code/issues/90784) Pawl sticky stop / [#90685](https://github.com/anthropics/claude-code/issues/90685) Ambo systemMessage non-render / [#90647](https://github.com/anthropics/claude-code/issues/90647) Chatelaine mcpOAuth Keychain / [#91005](https://github.com/anthropics/claude-code/issues/91005) Advowson Workflow name silent built-in.

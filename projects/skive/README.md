# Skive

A **leatherworker's skiving bench / paring desk** — raw hide grain, paring-knife edge, edge-paint trough, awl marks, warm tannery tones (umber, oxblood, raw-hide cream, steel knife flash) — Newsreader + Source Sans 3 + IBM Plex Mono — for a real Claude Code defect: **IN `bypassPermissions` (AND AUTO MODE), A BASH-FIRST META INSTRUCTION GATED BY `tengu_thrifty_sonic` / `CLAUDE_CODE_THRIFTY_SONIC` TELLS THE MODEL TO PREFER `cat`/`head`/`sed`/HEREDOCS OVER DEDICATED READ/EDIT/WRITE, SILENTLY DISABLING PATH-SCOPED RULES, NESTED `CLAUDE.md`, AND READ|EDIT|WRITE HOOKS — EXACTLY IN THE MODE WITH LEAST OVERSIGHT.**

Primary:

- [anthropics/claude-code#92271](https://github.com/anthropics/claude-code/issues/92271) (OPEN, bug, has repro, platform:macos, area:hooks, area:permissions, filed ~2026-09-05). Title: `bypassPermissions Bash-first instruction (thrifty_sonic) silently skips path-scoped rules, nested CLAUDE.md, and Read/Edit/Write hooks`. Claude Code **2.1.260** (nixpkgs package), macOS (Darwin 25.5.0). `~/.claude/settings.json`: `"permissions": { "defaultMode": "bypassPermissions" }`, `"model": "fable[1m]"`. No `CLAUDE_CODE_THRIFTY_SONIC` set (default rollout). Reporter shunsock.

15:50 skive: a skive that pares the enforcement hide so Bash slips under the grain is not a clean cut — it is already raw. Score the skive or admit the rules already raw.

Idle word: **pared**. Seeded state: **raw** / #92271 — Bash-first steer active → enforcement skived. Never idle as cast / fouled / flowing / snubbed / matched / warded / lit / blanked / afloat / careened / caught / slipping / locked / wiped / seated / channel / stranded / scratched / live / orphaned / set / scrapped / pure / scorched / cold / voided / banked / rewritten / keyed / strayed / scrubbed / pulled / enacted / withheld / masked / bled / careted / ringing.

**Skive** is a leather-parer’s cut that thins hide so it folds under the grain. Here the Bash-first instruction pares away the enforcement hide — path-scoped rules, nested `CLAUDE.md`, and Read|Edit|Write hooks — so Bash slips underneath.

- **pared** = HOLD: dedicated Read/Edit/Write fire → RULE-LOADED / NESTED-LOADED tokens present; straps stay buckled
- **raw** = #92271: Bash-first steer active; Bash `cat` of the same file returns NO-TOKENS; three straps unbuckle
- **read-tool-tokens** = dedicated Read loads RULE-LOADED-7731 and NESTED-LOADED-4402
- **bash-cat-no-tokens** = Bash `cat` of the same path returns NO-TOKENS
- **thrifty-sonic-on** = `tengu_thrifty_sonic` / unset `CLAUDE_CODE_THRIFTY_SONIC` injects the Bash-first steer (fable[1m] default)
- **thrifty-sonic-off** = kill switch `CLAUDE_CODE_THRIFTY_SONIC=0` in settings env restores dedicated tools
- **hooks-matcher-miss** = PreToolUse/PostToolUse `Read|Edit|Write` never fires on `sed`/heredoc
- **nested-claude-skip** = subdirectory `CLAUDE.md` is not included on Bash file access
- **path-scoped-skip** = `.claude/rules/*.md` with `paths:` does not trigger on Bash `cat`

Verdicts: pared, raw, read-tool-tokens, bash-cat-no-tokens, thrifty-sonic-on, thrifty-sonic-off, hooks-matcher-miss, nested-claude-skip, path-scoped-skip.

This is a diagnostic scoring desk. Not an exploit. No payloads. No real credentials. Score whether the hide is pared or already raw. Fixtures use diagnostic shapes only (tool path, flag, model, tokens, strap state). Tokens are the issue’s own canaries (`RULE-LOADED-7731`, `NESTED-LOADED-4402`, `NO-TOKENS`).

Hypothesis only (NON-BINDING): the interactive bench should make the three unbuckled straps and the Bash-under-grain cut visceral. Discard if evidence disagrees. Encoded from the issue’s facts. Do not claim unseen source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92271](https://github.com/anthropics/claude-code/issues/92271)
- Cousin cite-only (same Bash-first steer in auto mode, Windows): [#92178](https://github.com/anthropics/claude-code/issues/92178)
- Cousin cite-only (hooks never fire in VS Code extension — different cause): [#92074](https://github.com/anthropics/claude-code/issues/92074)
- Public write-up confirming thrifty_sonic kill switch + Rules/hooks/nested CLAUDE.md death: https://kawasin73.hatenablog.com/entry/2026/09/05/092056

Verified on the issue: Read tool loads RULE-LOADED / NESTED-LOADED tokens; Bash `cat` of the same file returns NO-TOKENS. Kill switch: `CLAUDE_CODE_THRIFTY_SONIC=0` in settings env. Model-gated (active on fable[1m] by default; sonnet/haiku need flag).

Injected instruction (verbatim from #92271):

> While bypass permissions mode is active:
>
> Do your work through the Bash tool wherever it can accomplish the job: read files with cat, head, or sed -n, search with grep and find, and make file changes with sed, heredocs, or short scripts, rather than using the dedicated Read, Edit, or Write tools. Fall back to a dedicated tool only when Bash genuinely cannot do the job.

## Why not a clone

This is specifically: **BYPASSPERMISSIONS / AUTO-MODE BASH-FIRST STEER (`tengu_thrifty_sonic`) SILENTLY SKIPS PATH-SCOPED RULES, NESTED CLAUDE.md, AND READ/EDIT/WRITE HOOKS.**

NOT Lagan ([#92266](https://github.com/anthropics/claude-code/issues/92266)) — orphan-process salvage. Skive is not a leftover `claude` pair on a living parent.
NOT Waif ([#90672](https://github.com/anthropics/claude-code/issues/90672)) — Bash timeout that leaves a child tree. Skive is not an orphan-process monitor.
NOT Snub ([#92262](https://github.com/anthropics/claude-code/issues/92262)) — Bash-tool heredoc pipe deadlock. Skive is a steer that skips enforcement, not a 512-byte pipe cliff.
NOT Ward ([#92252](https://github.com/anthropics/claude-code/issues/92252)) — Keychain default-path mis-ward. Skive is not a credential slot.
NOT Deadlight ([#92249](https://github.com/anthropics/claude-code/issues/92249)) — ListAgents/SendMessage blank in unattended Desktop.
NOT Knock — permission-stall relay.
NOT Geneva — bypass-index Shift+Tab ignore of `defaultMode: bypassPermissions`.
NOT Deadeye / Tappet — hook-lanyard / silent hook injection.

Different surface: Bash-first meta instruction that unbuckles three enforcement layers vs leftover children / heredoc hang / Keychain / tool registry / permission stall / geneva index / hook deadlock. Completely different UI (leatherworker’s skiving bench — raw hide grain, paring knife, edge-paint trough, awl marks, umber/oxblood/cream/steel — not Lagan night-harbor brine, not Snub dockside snubbing post, not Ward locksmith iron/brass), backend (probe-shaped JSON of pared / raw / tokens / flag / hook / nested / path-scoped rows), and UX (three straps that unbuckle under Bash-first + knife that skives under the grain).

Cousins are cite-only on a cousin strip; primary stays #92271.

- [#92178](https://github.com/anthropics/claude-code/issues/92178) — OPEN, Windows auto mode, same Bash-first steer. Cite-only.
- [#92074](https://github.com/anthropics/claude-code/issues/92074) — OPEN, VS Code extension hooks never fire — different cause. Cite-only.

Product name stays **Skive**. Do not rename to Lagan, Waif, Snub, Ward, Deadlight, Knock, Geneva, Deadeye, Tappet or any existing catalog slug.

Different UI: raw hide grain + paring knife + edge-paint trough + awl marks. Newsreader + Source Sans 3 + IBM Plex Mono. NOT Spectral / Inter / Fira Code (Lagan). NOT Literata / Outfit / JetBrains Mono (Snub). NOT Fraunces / DM Sans / IBM Plex Mono (Ward). Stay OFF harbor/brine, heredoc pipe, locksmith iron/brass, stone-pit, wick-lit folio.

Different verbs: Score the skive, pin idle pared, pin seeded raw, admit the rules already raw, load fixtures, reset to pared. Score the skive is this desk’s phrase.

Different idle: **pared**.

## Live catalog path

`/skive/` is this static leatherworker’s skiving bench. Path `https://hermes-playground-green.vercel.app/skive/` and subdomain `https://skive.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `15:50 / hermes catalog #151 / #92271`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **raw** — `bypassPermissions` + fable[1m] + unset `CLAUDE_CODE_THRIFTY_SONIC`; Bash `cat src/sub/hello.txt` returns NO-TOKENS; path-scoped rule, nested `CLAUDE.md`, and Edit|Write hook straps unbuckle; the hide is already raw.
2. Idle **pared** → dedicated Read of the same file loads RULE-LOADED-7731 and NESTED-LOADED-4402; straps stay buckled; idle word pared.
3. Desk UI: hide grain with three leather straps, paring knife that slips under the grain when Bash-first is on, edge-paint trough stamping tokens or NO-TOKENS. Pared = clean dedicated-tool cut. Raw = enforcement skived.
4. Cousin cite strip labeled cousin-not-primary: [#92178](https://github.com/anthropics/claude-code/issues/92178), [#92074](https://github.com/anthropics/claude-code/issues/92074). Cite only. Primary stays #92271. Public write-up: [kawasin73 2026-09-05](https://kawasin73.hatenablog.com/entry/2026/09/05/092056).
5. **Score the skive** walks the probe ticket and lights chips on the bench. Chip-switch every verdict. Paste or drop JSON. Skive simulator chips rewrite tool path (Read / Bash cat / sed-heredoc), `thrifty_sonic` on/off, and model (fable[1m] / sonnet / haiku).

## How to score

Open `projects/skive/index.html` in a browser, or serve the repo root and visit `/skive/` (Vercel rewrite → `/projects/skive`). No build step. Hook is a documentation stub only:

```bash
# No classifier binary. The living page scores probes in-browser.
# See projects/skive/hook/README.md
```

Empty paste scores the idle **pared** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **raw**.

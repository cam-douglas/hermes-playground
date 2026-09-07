# Limber

A **limber-hole / limber-board bilge drain bench** — oak floor timbers, chalked drain channels, copper pump well; Fraunces + Source Sans 3 + JetBrains Mono — for a real Claude Code defect: **SANDBOX.ENABLED LEAVES $TMPDIR READ-ONLY WHEN CLAUDE_CODE_TMPDIR IS SET.** When the write allowlist expands `$TMPDIR` or the sandbox temp root is resolved independently, the limbers are **drained**.

Primary:

- [anthropics/claude-code#92590](https://github.com/anthropics/claude-code/issues/92590) (OPEN, bug, has repro, platform:linux, area:sandbox). Title: `sandbox.enabled leaves $TMPDIR read-only when CLAUDE_CODE_TMPDIR is set`. Filed 2026-09-07T03:57:45Z. Updated 2026-09-07T03:58:45Z. Reporter: CameronBrooks11. 0 comments.

19:50 limber: a bilge limber-hole bench that should drain CLAUDE_CODE_TMPDIR into a writable sandbox $TMPDIR but instead silts the well because the write allowlist keeps the literal token $TMPDIR unexpanded — mktemp and nested sockets EPERM (#92590). Score silted or admit drained.

Idle word: **silted** (ALARM: write allowlist keeps literal `$TMPDIR`; mktemp Read-only; nested socket EPERM). Seeded state: **drained** / HOLD (allowlist expands `$TMPDIR` or the sandbox temp root is resolved independently). Never idle as barred, runaway, haunted, fouled, razed, culled, stripped, unanswered, slipped, staged, voided, proved. Never seeded as admitted, latched, staged, proved, belayed, sole, packed, roused, voided.

**Limber** = limber-hole / limber-board. Holes cut through floor timbers so bilge water MUST reach the pump well. Here `CLAUDE_CODE_TMPDIR` points `$TMPDIR` at a HOME scratch dir, but the write allowlist keeps the literal token `$TMPDIR` unexpanded — the holes are silted.

- **silted** = IDLE: literal `$TMPDIR` in the write allowlist; mktemp and nested sockets fail
- **drained** = seeded word: allowlist expands `$TMPDIR` or temp root resolves independently
- **literal-token** = write allowlist contains `"$TMPDIR"` alongside expanded absolute paths
- **mktemp-readonly** = `mktemp -d` fails Read-only file system
- **nested-socket-eperm** = nested `claude` EPERM listen `srt-mux-*.sock`
- **guidance-says-writable** = sandbox guidance says TMPDIR is sandbox-writable
- **failIfUnavailable-refuses** = `failIfUnavailable` true refuses unsandboxed (correct)
- **settings-revert-blocked** = writing `~/.claude` denied; revert from an outside shell
- **cousins** = cite-only #91643 / #91223 / #15637
- **has-clear-repro** = issue labeled has repro

Verdicts: silted, drained, literal-token, mktemp-readonly, nested-socket-eperm, guidance-says-writable, failIfUnavailable-refuses, settings-revert-blocked, cousins, has-clear-repro.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether an unexpanded `$TMPDIR` token would leave the well **silted** or already **drained**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): write-allowlist builder may insert the literal token `$TMPDIR` without expanding it, so the path `CLAUDE_CODE_TMPDIR` pointed at never matches the allowlist even though the session sets `TMPDIR` to that directory. Expanding `$TMPDIR` when building the write allowlist, or resolving the sandbox temp root independently, would make the documented contract true. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92590](https://github.com/anthropics/claude-code/issues/92590)
- Cousins cite-only (NOT primary):
  - [anthropics/claude-code#91643](https://github.com/anthropics/claude-code/issues/91643) — plugin eval sandbox denies every Bash write /private/tmp (different surface)
  - [anthropics/claude-code#91223](https://github.com/anthropics/claude-code/issues/91223) — sockets directory squat (different surface)
  - [anthropics/claude-code#15637](https://github.com/anthropics/claude-code/issues/15637) — hardcoded /tmp/claude Termux (different surface)

What happened (from the issue body — do not invent):

- Claude Code 2.1.263, Linux Debian trixie, bubblewrap 0.12.0
- Settings: `sandbox.enabled` true, `failIfUnavailable` true
- `export CLAUDE_CODE_TMPDIR="$HOME/.local/state/scratch"` (under HOME, outside workspace)
- Session sets `$TMPDIR` to that dir then denies writes; `mktemp -d` fails Read-only file system
- Sandbox guidance to the model says TMPDIR is sandbox-writable
- Reported write allowlist includes the literal token `"$TMPDIR"` alongside expanded absolute paths
- Knock-ons: shell test suites fail; nested claude cannot bind control socket (`EPERM` listen `…/srt-mux-*.sock`); with `failIfUnavailable` true refuses unsandboxed (correct); `gh` HTTP 401 in the same session (reporter did not chase)
- Suggested fix: expand `$TMPDIR` when building the write allowlist OR resolve the sandbox temp root independently
- Recovery: cannot revert settings from inside the session (writing `~/.claude` denied); must edit from an outside shell

Problem found: UNEXPANDED `$TMPDIR` TOKEN — session points TMPDIR at the HOME scratch dir; write allowlist keeps the literal token, so mktemp and nested sockets never match a writable path.

Why this solution: a diagnostic scorer for the silted → drained limber chain, so a reader can admit idle silted, pin seeded drained, and score literal-token / mktemp-readonly / nested-socket-eperm / guidance-says-writable / failIfUnavailable-refuses / settings-revert-blocked / cousins against the published facts.

## Why not a clone

This is specifically: **SANDBOX.ENABLED LEAVES $TMPDIR READ-ONLY WHEN CLAUDE_CODE_TMPDIR IS SET.**

**NOT Chock #92582** (blockReadsOutsideWorkingDirectories ignores project/local additionalDirectories).

**NOT Deadman #92593** (timeout background + TaskStop shell-only + MSYS wipe).

**NOT Eidolon #92601** (security-guidance ENOENT fake notice loop).

**NOT Touchstone #92599** (extension-gated Write/Edit 401).

**NOT Bitts #92573** (worktree pool mid-session raze).

**NOT Seizing #92586** (EDR nlink Bash output-file kill).

**NOT Gland / Larum / Fairlead / Wraith paradigms.**

**NOT leftover millimeter-sliders / woodworking leftovers.**

**NOT #92596 Afterimage. NOT #92583.** Those backup issues do not ship.

Cousins cite-only (NOT primary): #91643, #91223, #15637. Different surfaces.

Do NOT rename this product Chock, Deadman, or Fairlead.
Do NOT reuse idle barred / runaway / haunted / fouled / razed / culled / stripped / unanswered / slipped / staged / voided / proved.
Do NOT reuse seeded admitted / latched / staged / proved / belayed / sole / packed / roused / voided.

Different surface: UNEXPANDED `$TMPDIR` WRITE-ALLOWLIST TOKEN (HOME scratch set, literal token silted) vs settings-layer read-fence miss / timeout promote / ENOENT fake notice / extension-gated 401 / worktree-pool recycle / EDR nlink identity kill.

Product name stays **Limber**. Name/slug `limber` confirmed unused in catalog.json (202 products).

Different UI: limber-hole / limber-board / oak floors / chalked drain channels / copper pump well / looking-down bilge. Fraunces / Source Sans 3 / JetBrains Mono. NOT Bitter/Manrope/IBM Plex Mono (Chock). NOT Chakra Petch/Share Tech Mono (Deadman). NOT Playfair/Work Sans/Fira Code (Eidolon). NOT Cinzel/Plus Jakarta (Touchstone). NOT Libre Bodoni/Nunito (Bitts). NOT Figtree (Larum).

Different verbs: Score the limbers, Pin idle silted, Pin seeded drained, Admit drained, Load fixtures, Reset to drained, Sound the well, Expand the token.

Different idle: **silted**. Different seeded: **drained**. HOLD: **drained**. ALARM: **silted** / **literal-token** / **mktemp-readonly** / **nested-socket-eperm** / **guidance-says-writable** / **failIfUnavailable-refuses** / **settings-revert-blocked** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/limber/hook/limber.test.mjs
node projects/limber/hook/index.mjs projects/limber/data/92590.json
echo '{"seed":"drained","drained":true}' | node projects/limber/hook/index.mjs
```

Open the living desk at `projects/limber/index.html` (or the live path). Buttons: Score the limbers, Pin idle silted, Pin seeded drained, Admit drained, Load fixtures, Reset to drained. Sound the well. Expand the token. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/limber/
- Subdomain: https://limber.hermes-playground-green.vercel.app
- Folder: `projects/limber/`

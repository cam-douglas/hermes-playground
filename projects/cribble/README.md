# Cribble

A **miller's cribble / coarse-sieve bench** — mill loft, flour-dust, oak cribble frame, iron wire mesh, parchment mill ledger; Young Serif + Karla + IBM Plex Mono — for a real Claude Code defect: **`sandbox.filesystem.denyWrite` SILENTLY IGNORES RULES CONTAINING A MID-PATH WILDCARD ON LINUX.** When the deny is correctly enforced, the cribble is **cribbed**.

Primary:

- [anthropics/claude-code#92684](https://github.com/anthropics/claude-code/issues/92684) (OPEN, bug, has repro, platform:linux, area:security, area:sandbox). Title: `[BUG] sandbox.filesystem.denyWrite silently ignores rules containing a mid-path wildcard (Linux)`. Filed 2026-09-07T15:21:07Z. Updated 2026-09-07T15:22:53Z. Reporter: Danubian-Narwhal. 0 comments.

03:50 cribble: a miller's cribble / coarse-sieve bench that should catch mid-path denyWrite globs but instead stays porous — literal and trailing /** block, /path/**/file and /path/*/file stay WRITABLE while denyRead mid-path works and /status still shows the rule (#92684). Score porous or admit cribbed.

Idle word: **porous** (ALARM: mid-path denyWrite silently dropped / WRITABLE). Seeded state: **cribbed** / HOLD (deny correctly enforced). Never idle as slipped, severed, misrouted, adrift, corked, latent, silted, barred, runaway, haunted, fouled, razed, culled. Never seeded as sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted, latched, staged, proved, belayed, sole.

**Cribble** = a miller's coarse sieve / cribble (wire mesh that should catch flour grit). A `sandbox.filesystem.denyWrite` mid-path glob should catch the same way a literal path and a trailing `/**` do. Instead the mesh stays **porous**.

- **porous** = IDLE: ALARM; mid-path denyWrite silently dropped / WRITABLE
- **cribbed** = seeded word: deny correctly enforced
- **literal-eacces** = literal denyWrite `/workspace/docs/probe.txt` → `blocked:EACCES`
- **trail-erofs** = trailing `/**` denyWrite → `blocked:EROFS`
- **mid-star2-writable** = `/workspace/**/probe.txt` → `WRITABLE`
- **mid-star1-writable** = `/workspace/*/probe.txt` → `WRITABLE`
- **denyread-mid-enforced** = identical mid-path shapes on denyRead → all `blocked:EACCES`
- **status-shows-active** = dropped rule still appears in `/status` as active
- **warning-misstates-read** = generic Linux glob warning says Edit/Read will be ignored (overstates Read; omits denyWrite)
- **tool-vs-bash-asymmetry** = tool-layer `permissions.deny` can block Write while Bash subprocess remains writable
- **cousins** = cite-only #84863 / #74081 / #89762 / #81266 / #85761 / #86054
- **has-clear-repro** = issue labeled has repro

Verdicts: porous, cribbed, literal-eacces, trail-erofs, mid-star2-writable, mid-star1-writable, denyread-mid-enforced, status-shows-active, warning-misstates-read, tool-vs-bash-asymmetry, cousins, has-clear-repro.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. No sandbox bypass instructions. Score whether a mid-path denyWrite glob would leave the cribble **porous** or already **cribbed**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): denyWrite has literal + trailing-** branches and no glob matcher; mid-path falls through both. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92684](https://github.com/anthropics/claude-code/issues/92684)
- Cousins cite-only (NOT primary):
  - [anthropics/claude-code#84863](https://github.com/anthropics/claude-code/issues/84863) — open; sandbox reads unrestricted / self-edit settings
  - [anthropics/claude-code#74081](https://github.com/anthropics/claude-code/issues/74081) — open; recursive Read deny globs expand to E2BIG
  - [anthropics/claude-code#89762](https://github.com/anthropics/claude-code/issues/89762) — open; sandbox policy covers Bash only
  - [anthropics/claude-code#81266](https://github.com/anthropics/claude-code/issues/81266) — closed not_planned; denyRead does not block reads
  - [anthropics/claude-code#85761](https://github.com/anthropics/claude-code/issues/85761) — closed completed; denyWithinAllow not enforced for Edit/Write
  - [anthropics/claude-code#86054](https://github.com/anthropics/claude-code/issues/86054) — closed not_planned; Linux-in-Docker confinement miss

What happened (from the issue body — do not invent):

- Claude Code 2.1.263, commit `37ae3f38d765`; linux-arm64; Docker `node:22-bookworm-slim`
- Sandbox via managed-settings at `/etc/claude-code/managed-settings.json`; `sandbox.enabled: true`; `allowUnsandboxedCommands: false`; `enableWeakerNestedSandbox: true` (bubblewrap nested inside Docker)
- Reporter: Danubian-Narwhal; filed 2026-09-07T15:21:07Z; updated 2026-09-07T15:22:53Z; 0 comments
- Prior `/bug` receipt `613a9fb3-3860-4b55-8968-d566e485f315` on 2026-09-06
- Target always `/workspace/docs/probe.txt` in an existing directory
- `sandbox.filesystem.denyWrite` measured outcomes:
  1. `/workspace/docs/probe.txt` → `blocked:EACCES`
  2. `/workspace/**/probe.txt` → **`WRITABLE`**
  3. `/workspace/*/probe.txt` → **`WRITABLE`**
  4. `/workspace/docs/**` → `blocked:EROFS`
  5. `/workspace/**` → `blocked:EROFS`
- `sandbox.filesystem.denyRead` same mid-path shapes — **all** `blocked:EACCES`
- Rule still appears in `/status` as active
- Generic Linux glob warning exists: `/status` says glob patterns are not fully supported; `claude doctor` says Edit/Read will be ignored (overstates Read; omits denyWrite; hides subprocess fail-open)
- Tool-layer `permissions.deny` can block Write while Bash subprocess remains writable

Problem found: MID-PATH DENYWRITE GLOBS ARE SILENTLY DROPPED — LITERAL AND TRAILING /** HOLD; DENYREAD MID-PATH WORKS.

Why this solution: a diagnostic scorer for the porous → cribbed cribble chain, so a reader can admit idle porous, pin seeded cribbed, and score literal-eacces / trail-erofs / mid-star2-writable / mid-star1-writable / denyread-mid-enforced / status-shows-active / warning-misstates-read / tool-vs-bash-asymmetry / cousins against the published facts.

## Why not a clone

This is specifically: **`SANDBOX.FILESYSTEM.DENYWRITE` SILENTLY IGNORES MID-PATH WILDCARDS ON LINUX.**

**NOT Springe #92675** (plugin-native PreToolUse deny not enforced interactively).

**NOT Gangway #92662** (Chrome relaunch never re-dials native-host socket).

**NOT Waybill #92624** (named spawn foreign session id).

**NOT Snatch #92583** (session-end never reaps auto-backgrounded Bash orphans).

**NOT Speakpipe #92646 / Afterimage #92596 / Limber #92590 / Chock #92582 / Deadman #92593 / Eidolon #92601 / Oubliette #92095.**

**NOT Bitts / Sounder / Callboard / Knock / Annunciator.**

Cousins cite-only (NOT primary): #84863, #74081, #89762, #81266, #85761, #86054. Different surfaces. Do not auto-pick as thesis.

Do NOT rename this product Springe, Gangway, Waybill, Snatch, Speakpipe, Afterimage, Limber, Chock, Deadman, Eidolon, Oubliette, Sounder, Callboard, Knock, or Annunciator.
Do NOT reuse idle slipped / severed / misrouted / adrift / corked / latent / silted / barred / runaway / haunted / fouled / razed / culled.
Do NOT reuse seeded sprung / remoored / addressed / reaped / relayed / flushed / drained / admitted / latched / staged / proved / belayed / sole.

Different surface: MID-PATH DENYWRITE FAIL-OPEN vs plugin-native PreToolUse interactive slip / Chrome relaunch never-redial / named-spawn foreign session id / session-end unreaped Bash orphans / Desktop overbroad SendMessage ban / Windows text paint deferral.

Product name stays **Cribble**. Name/slug `cribble` confirmed unused in catalog.json (209 products before this ship; Springe is #209).

Different UI: mill loft / flour-dust / oak cribble frame / iron wire mesh / parchment mill ledger. Young Serif / Karla / IBM Plex Mono. NOT Bodoni Moda/Nunito Sans (Springe). NOT Big Shoulders Display/Public Sans/Roboto Mono (Gangway). NOT Oswald/Source Sans 3 (Waybill). NOT Newsreader/Figtree/Fragment Mono (Snatch).

Different verbs: Score the cribble, Pin idle porous, Pin seeded cribbed, Admit cribbed, Load fixtures, Reset to cribbed, Dust the mesh, Crib the grit.

Different idle: **porous**. Different seeded: **cribbed**. HOLD: **cribbed**. ALARM: **porous** / **literal-eacces** / **trail-erofs** / **mid-star2-writable** / **mid-star1-writable** / **denyread-mid-enforced** / **status-shows-active** / **warning-misstates-read** / **tool-vs-bash-asymmetry** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/cribble/hook/cribble.test.mjs
node projects/cribble/hook/index.mjs projects/cribble/data/92684.json
echo '{"seed":"cribbed","cribbed":true}' | node projects/cribble/hook/index.mjs
```

Open the living card at `projects/cribble/index.html` (or the live path). Buttons: Score the cribble, Pin idle porous, Pin seeded cribbed, Admit cribbed, Load fixtures, Reset to cribbed. Dust the mesh. Crib the grit. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/cribble/
- Subdomain: https://cribble.hermes-playground-green.vercel.app
- Folder: `projects/cribble/`

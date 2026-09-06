# Decant

A **gravity-pour cellar rack / carboy assay** — amber glass, cork, burgundy lees sediment, slate shelf, process-tree ledger, PATH strip vs full-env pour, probe-variable assay panels, Desktop vs Terminal vs VS Code vs Rider vs Zed comparison rails; deep slate + cork brown + amber glass + burgundy lees — Spectral + Karla + Roboto Mono — for a real Claude Desktop defect: **MACOS DESKTOP PASSES ONLY PATH FROM THE LOGIN SHELL; EVERY OTHER VARIABLE IS DROPPED.** The disclaimer already ran the login shell (full bottle). Desktop **skimmed** only PATH into the session glass and left credentials/paths as lees. When the whole login-shell environment is poured (**intact**), that is the hold path.

Primary:

- [anthropics/claude-code#92515](https://github.com/anthropics/claude-code/issues/92515) (OPEN, bug, has repro, platform:macos, area:desktop). Title: `Claude Desktop passes only PATH from the login shell to Claude Code sessions; every other variable is dropped`. Filed 2026-09-06T16:14:02Z. Reporter: Baune8D. macOS 26.6.2 arm64; Claude Desktop bundled CLI 2.1.258; compared vs Claude Code 2.1.260 terminal, VS Code ext 2.1.260, Rider ACP, Zed external agent.

04:50 decant: a gravity-pour cellar rack that should carry the whole login-shell environment into a Claude Desktop session but instead skims only PATH and leaves credentials as lees (#92515). Score skimmed or admit intact.

Idle word: **skimmed** (only PATH poured forward; rest dropped). Seeded state: **intact** / #92515 — entire login-shell env passed, as terminal / VS Code / Rider / Zed do. Never idle as mislabeled, saturating, vented, preheating, lit, hangfired, executed, thrashing, responsive, leaking, excised, remanent, rewritten, cleared, maxed, mute, inherited, freewheeling, deaf, choking, miscast, unguided, dropped, strobing, stolen, dawnlocked, cold, voided, alongside, shed, latched, quiet, bound, open, sostenutoed, frozen, resolved, or literal.

**Decant** = pour clear liquid off sediment (lees). The disclaimer already ran the login shell (full bottle). Desktop skimmed only PATH into the session glass.

- **skimmed** = IDLE: only PATH poured forward; rest dropped as lees
- **intact** = seeded word: entire login-shell env passed
- **path-only** = fully repaired PATH; none of the other login-shell env vars
- **marker-unset** = `MARKER_FROM_ZPROFILE=1` in `~/.zprofile`; Desktop echo UNSET; PATH still login-shell
- **probed-0-of-8** = eight probed credential/path vars (names withheld): Desktop 0/8; Terminal 8/8
- **disclaimer-path-merge** = jump 14→45 at disclaimer is PATH merge only
- **spawn-inherits** = hooks + stdio MCP inherit the stripped env
- **cousins** = cite-only #90074 #82890 (same class across platforms; this product is the macOS PATH-only decant)

Verdicts: skimmed, intact, path-only, marker-unset, probed-0-of-8, disclaimer-path-merge, spawn-inherits, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No real tokens. Score whether the cellar would skim PATH-only or already pour the bottle intact. Fixtures use the issue's variable counts, PATH kinds, marker, process tree, and route comparisons only.

Encoded from the issue body only. Do not invent source-code claims.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92515](https://github.com/anthropics/claude-code/issues/92515)
- Cousins cite-only (NOT primary): [anthropics/claude-code#90074](https://github.com/anthropics/claude-code/issues/90074), [anthropics/claude-code#82890](https://github.com/anthropics/claude-code/issues/82890)

What happened (from the issue — do not invent):

- Environment: macOS 26.6.2 (arm64); Claude Desktop, bundled CLI 2.1.258; compared against Claude Code 2.1.260 from a terminal, the VS Code extension 2.1.260, Rider's ACP agent, and Zed's external agent, on the same machine within the same few minutes.
- Symptom: a Claude Code session started from the Claude Desktop app has a fully repaired `PATH` but none of the other environment variables the login shell exported. Tools therefore resolve while the credentials and paths they need are unset, so failures surface far from the cause — a package restore that 401s, a script that raises `KeyError`, a query that silently returns the wrong scope.
- The app already does the expensive part: its `disclaimer` helper runs a login shell. Only `PATH` survives from it.
- Repro: `export MARKER_FROM_ZPROFILE=1` in `~/.zprofile` (not `~/.zshrc`). Desktop session: echo shows `UNSET`; `PATH` still contains directories that only `~/.zprofile` adds. Terminal-launched `claude`: marker set.
- Process tree of the affected session: `claude <- disclaimer <- Claude <- launchd`.
- Variable counts (names only) + 8 probed credential/path vars from `~/.zprofile`:
  - `Claude.app` main: 14 vars, 4-directory default PATH, 0/8 probed
  - `disclaimer` helper: 45 vars, full login PATH, 0/8 probed
  - `claude` session (Desktop): 45 vars, full PATH, **0/8** probed
  - Terminal-launched `claude`: 67 vars, full PATH, **8/8** probed
- Jump 14→45 at disclaimer is PATH merge only — nothing else from the login shell is kept.
- Anything the session spawns inherits the stripped env (hooks + stdio MCP included).
- Other IDE routes on the same machine do NOT do this: VS Code extension (`useTerminal` false) 72 vars all probed set; Rider ACP 94; Zed external 58. VS Code starts from the same bare 14 on the main process but passes the full env to `claude` (`claude <- Code Helper (Plugin) <- Code <- launchd`).
- Do NOT launch the app from a terminal to test (`open -a` contaminates). Control: main process must show ~14 vars + 4-dir PATH.
- Suggested fix (from the issue): in `disclaimer`, pass on the entire environment returned by the login shell it already runs, not PATH alone.

Problem found: macOS Desktop login-shell env decanted to PATH-only → marker UNSET, probed 0/8, spawn inherits the skim → tools resolve, credentials/paths they need are lees.

Why this solution: a diagnostic scorer for the skimmed → intact pour chain, so a reader can admit idle skimmed, pin seeded intact, and score path-only / marker-unset / probed-0-of-8 / disclaimer-path-merge / spawn-inherits / cousins against the published facts.

## Why not a clone

This is specifically: **macOS Desktop login-shell environment decanted to PATH-only.**

NOT Catachresis/#92518 — MCP 403 `insufficient_scope` stamped as token expired (lexicographer stamp desk).
NOT Bourdon/#92510 — Cowork Apple Virtualization host fd climb.
NOT Glowplug/#85050 — Windows silent startup preheat gaps.
NOT Hangfire/#92478 — queued `/compact` demoted to a plain prompt.
NOT Thrash/#88257 — first-prompt event-loop stall / RSS.
NOT Muzzle/#92459 — safe-mode skill_listing attachment leak.
NOT Latchkey/#92330 — false re-login on a renewable refresh.
NOT Coffer/#91571 — Windows OAuth file-store refresh void.
NOT Ullage (catalog slug already used) or any wine/ullage leftover as a copy.

Stay OFF all prior catalog slugs/paradigms: Catachresis / Bourdon / Glowplug / Hangfire / Thrash / Muzzle / Hysteresis / Hardstand / Rheostat / Aphonia / Solecism / Oubliette / Ephemera / Commutator / Heddle and every existing slug in catalog.json.

Do NOT name this after prior paradigm desks.
Do NOT reuse idle mislabeled / saturating / vented / preheating / hangfired / thrashing / leaking / remanent / rewritten / cleared / maxed / mute / inherited / freewheeling / deaf / choking / miscast / unguided / dropped / strobing / stolen / dawnlocked / cold / voided / alongside / shed / latched / quiet / bound / open / sostenutoed / frozen / resolved / literal.
Do NOT reuse seeded scoped / lit / executed / responsive / excised / rewritten / refused / hardwired / vented.

Different surface: macOS Desktop login-shell env decanted to PATH-only vs MCP OAuth mislabel / VM fd leak / Windows preheat / compact demotion.

Product name stays **Decant**. Name/slug `decant` confirmed unused in catalog.json (187 products).

Different UI: gravity-pour cellar rack / carboy assay / amber glass / cork / burgundy lees / slate shelf / process-tree ledger / PATH strip vs full-env pour / probe-variable assay / Desktop–Terminal–VS Code–Rider–Zed rails. Deep slate + cork brown + amber glass + burgundy lees. Spectral / Karla / Roboto Mono. NOT Fraunces/Manrope/JetBrains (Catachresis). NOT Archivo Black/Sora/IBM Plex (Bourdon). NOT Teko/Outfit/Share Tech (Glowplug). NOT Anybody/Source Sans/JetBrains (Hangfire). NOT phosphor CRT, NOT diesel bay, NOT stamp desk, NOT brass Bourdon gauge.

Different verbs: admit skimmed, pin seeded intact, score skimmed vs intact, load #92515 fixture, score probes.

Different idle: **skimmed**. Different seeded: **intact**. HOLD: **intact**. ALARM: **skimmed** / **path-only** / **marker-unset** / **probed-0-of-8** / **disclaimer-path-merge** / **spawn-inherits** / **cousins**.

Cousins cite-only (NOT primary):

- [#90074](https://github.com/anthropics/claude-code/issues/90074) — OPEN. Windows desktop: stdio MCP gets a ~16-var sanitized allowlist; missing `ProgramData` breaks ssh; missing `COMPUTERNAME` breaks Get-VM. Primary stays #92515.
- [#82890](https://github.com/anthropics/claude-code/issues/82890) — OPEN. Linux Desktop: MCP subprocesses spawned without `DISPLAY`/`XAUTHORITY`, breaking OAuth browser login. Primary stays #92515.

Same class (desktop env handed to children) across platforms; this product is specifically the macOS PATH-only decant.

## Live catalog path

`/decant/` is this static gravity-pour cellar-rack scoring assay. Path `https://hermes-playground-green.vercel.app/decant/` and subdomain `https://decant.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `04:50 Sydney · decant · catalog #188 · #92515`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Idle **skimmed** → only PATH poured; credentials/paths left as lees.
2. Seeded **intact** → entire login-shell env passed.
3. Diagnostic **path-only** → repaired PATH; other vars dropped.
4. Diagnostic **marker-unset** → `MARKER_FROM_ZPROFILE` UNSET on Desktop; set on Terminal.
5. Diagnostic **probed-0-of-8** → Desktop 0/8; Terminal 8/8.
6. Diagnostic **disclaimer-path-merge** → 14→45 is PATH merge only.
7. Diagnostic **spawn-inherits** → hooks + stdio MCP inherit the skim.
8. Diagnostic **cousins** → #90074 #82890 cite-only.
9. Controls: terminal-full (67 / 8/8) and vscode-full (72 / 8/8; same bare 14 on main) score intact.
10. Assay UI: carboy pour, lees sediment, slate process-tree ledger, PATH strip vs full pour, probe panels, five-route comparison rails.
11. Stay-off strip: Catachresis stamp desk / Bourdon-tube gauge / diesel glow-plug / delayed-primer / CRT paging-storm / olive suppressor / latchkey board / vault coffer / ullage leftover. Primary stays #92515.
12. **Score probes** walks the probe ticket and lights chips on the rack. Chip-switch every verdict. Paste or drop JSON. Rack simulator chips rewrite the pour (skimmed / intact / path-only / marker).

## How to score

Open `projects/decant/index.html` in a browser, or serve the repo root and visit `/decant/` (Vercel rewrite → `/projects/decant`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Desktop.
node --test projects/decant/hook/decant.test.mjs
```

Empty paste scores the idle **skimmed** ticket if you admit skimmed. Paste a probe on the page or drop a fixture from `data/`. The living page admits **skimmed** / PATH-only pour / #92515.

## Hook

`projects/decant/hook/` scores a probe `{ seed, skimmed, intact, route, varCount, pathKind, probedHitCount, marker, disclaimerPathMerge, spawnInherits }` and returns `{ verdict, reasons[], skimmed, intact, chips[], pour }`. See `hook/README.md`.

```bash
node projects/decant/hook/index.mjs projects/decant/data/92515.json
echo '{"seed":"intact","intact":true,"route":"terminal","probedHitCount":8}' | node projects/decant/hook/index.mjs
```

`intact` is true ONLY when the verdict is intact (the whole login-shell environment is poured). Seeded 92515 numbers must produce skimmed / `intact=false` on the PATH-only glass. A skimmed pour is never the hold path.

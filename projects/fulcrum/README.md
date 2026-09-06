# Fulcrum

A **balance-beam / pivot fulcrum / naming-lever lab** — fulcrum pivot graphic, custom-title vs auto-title beam, nameSource dial (custom vs auto), peer-registry ledger of collided duplicate names with different `[ref]`, SendMessage tip ambiguity meter, inheritance lag (~100 ms) gauge — Cormorant Garamond + DM Sans + Fira Code — for a real Claude Code defect: **`CLAUDE --NAME <NAME>` IS NOT APPLIED TO THE PEER REGISTRY ON 2.1.261; NEW SESSIONS REGISTER UNDER ANOTHER SESSION'S GENERATED TITLE WITH `nameSource: "auto"`.** The custom-title side of the lever records `--name`. The auto-title side overwrites the registry tip. Sessions collide on one handle and SendMessage tips the wrong way. Score the naming lever or admit the registry already collided.

Primary:

- [anthropics/claude-code#92377](https://github.com/anthropics/claude-code/issues/92377) (OPEN, bug, has-repro, platform:linux, area:core, regression). Title: `[BUG] --name is not applied to the peer registry on 2.1.261; new sessions register under another session's generated title`. Filed 2026-09-05. Reporter: gtapps.

17:50 fulcrum: a naming pivot that should lock the peer identity when `--name` is set, but the auto-title side of the lever overwrites the custom-title side so the registry tip lands on another session's generated name — sessions collide on one handle and SendMessage tips the wrong way. Score the naming lever or admit the registry already collided.

Idle word: **inherited**. Seeded state: **collided** / #92377 — `--name` discarded; `nameSource: "auto"`; foreign generated title ~100 ms after launch; ListAgents rows share one name; bare SendMessage ambiguous. Never idle as freewheeling, deaf, choking, miscast, unguided, dropped, strobing, stolen, dawnlocked, or misaimed. Never seeded as doubled, clobbered, or retried.

**Fulcrum** is naming-lever work. `--name` should pin the session at the pivot. Instead the auto-title pan inherits a foreign generated title and the beam tips the wrong way. Fresh scratch sessions launched with `--name dup4cc4` register as the same generated title. Score whether `--name` is applied, the registry is locked to the user-set name, user-set collisions get a two-word dedup, and a fresh session never inherits another session's title.

- **inherited** = IDLE: `--name` is a custom-title line; registry inherits a foreign auto title ~100 ms after launch
- **collided** = seeded word: multiple live sessions share one generated name; bare SendMessage is ambiguous
- **name-applied** = contrast hold: `--name` sets the session name and replaces any generated title
- **registry-locked** = contrast hold: peers address the user-set name
- **dedup-user-name** = contrast hold: if a collision must happen, dedup rename to a two-word variant applies for user-set names
- **foreign-title-blocked** = contrast hold: a fresh session never registers under a title generated for a different session
- **custom-title** = score the transcript `--name` side of the lever
- **auto** = score the nameSource:auto / foreign generated title side
- **cousins** = cite-only #91054 #88845 #86736 #86531 #81899

Verdicts: inherited, collided, name-applied, registry-locked, dedup-user-name, foreign-title-blocked, custom-title, auto, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. Score whether a `--name` launch would leave the fulcrum inherited or already collided. Fixtures use the issue's `--name Hermit` registry entry, the transcript custom-title / ai-title / agent-name lines, the ListAgents collision, the SendMessage failure after `/rename`, and the three-pane `--name dup4cc4` repro only.

Hypothesis only (NON-BINDING): custom-title is written to the transcript but peer registration reads/writes `nameSource:auto` from a shared in-process title cache belonging to another session, so `--name` never reaches the registry. Verify against issue evidence only. Discard if issue evidence disagrees. Encoded from the issue body only. Do not invent runtime source claims.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92377](https://github.com/anthropics/claude-code/issues/92377)

What happened (from the issue — do not invent):

- Environment: Claude Code **2.1.261** on **Ubuntu/Debian**; regression vs last working **2.1.251** (the same `--name Hermit` launch registered as `Hermit [5fb191]` in `ListAgents` on **2026-08-31**).
- `claude --name <name>` no longer sets the name a session registers for cross-session messaging.
- `~/.claude/sessions/<pid>.json` is written with `nameSource: "auto"` and a `name` that is an AI-generated title copied from a different, unrelated session, about **100 ms** after launch and before any prompt is sent.
- The transcript records the `--name` value as a `custom-title` line, but the peer registry, `ListAgents`, and the prompt-bar title all show the foreign generated title instead.
- Example: launched with `--name Hermit` → registry name `"Artifact skill trigger instruction passing"`, `nameSource` auto. Transcript has `customTitle` Hermit plus `ai-title` / `agent-name` of the foreign title. Registry fields (trimmed): `pid` 717713, `startedAt` 1788628868046, `version` 2.1.261, `kind` interactive, `entrypoint` cli, `nameSince` 1788628868147.
- Observed: seven live sessions across four working directories, including three fresh scratch sessions launched with `--name dup4cc4`, all registered as the same generated title with `nameSource: "auto"`. The string is not present in any file under `~/.claude` other than the `sessions/*.json` entries and the transcripts, so it appears to be carried in a running process rather than read from disk.
- `ListAgents` shows multiple rows sharing the same name, distinguishable only by `[ref]` and tmux address.
- `SendMessage` to the bare name is ambiguous; to `name [ref]` delivers to that ref; after `/rename`, the old `name [ref]` becomes unreachable. Example after `/rename`: `{"success":false,"message":"No agent named 'Artifact skill trigger instruction passing [60e4ff]' is reachable. Did you mean: Artifact skill trigger instruction passing?"}`.
- Related but distinct: #91054 covers collisions between `nameSource: derived` default display names. This report is about an explicit `--name` being discarded and replaced by a generated title that belongs to another session.
- Expected: `--name` should set the session name, replace any generated title, and be the name peers use. A fresh session should never register under a title generated for a different session. If a collision must happen, the dedup rename to a two-word variant should apply for user-set names.
- Repro: have one other session with a generated title; in three empty scratch dirs launch `claude --model haiku --permission-mode acceptEdits --name dup4cc4` in three tmux panes; before any prompt, read `sessions/<pid>.json`; observe shared foreign title + `nameSource` auto; `ListAgents` from a fourth session shows collision; `SendMessage` to the bare name is ambiguous. The trust dialog does not appear under `--permission-mode`.

Problem found: `--name` recorded as custom-title, discarded at the peer registry for a foreign `nameSource:auto` title → shared handle → ambiguous SendMessage.

Why this solution: a diagnostic scorer for the inherited fulcrum → collided-registry chain, so a reader can pin idle inherited, seed collided, and score name-applied / registry-locked / dedup-user-name / foreign-title-blocked against the published facts.

## Why not a clone

This is specifically: **CLI `--name` discarded; peer registry writes `nameSource:auto` and a foreign generated title; sessions collide on one handle.**

NOT Wildcat/#92399 — `run_in_background` shell-exit while nohup children freewheel. Fulcrum is not a windlass.
NOT Clobber/#92419 — inode rename → deaf watcher → autosave clobber. Fulcrum is not a print shop.
NOT Watchdog/#92424 — Workflow stall-watchdog vs auto-compaction. Fulcrum is not a kennel.
NOT Understudy/#92426 — Agent() definition ignored under dispatch. Fulcrum is not a dressing-room.
NOT Fairlead/#92403 — URI scheme `file://`-only. Fulcrum is not a hawse-pipe.
NOT Stroboscope/Heliostat/Lethe/Frizzen and prior catalog desks.
Do NOT name this Wildcat, Clobber, Watchdog, Understudy, Fairlead, Stroboscope, Heliostat, Lethe, Trunnion, Aphonia, or any existing catalog slug.
Do NOT reuse idle freewheeling / deaf / choking / miscast / unguided / dropped / strobing / stolen / dawnlocked / misaimed.
Do NOT reuse seeded doubled / clobbered / retried.

Different surface: CLI `--name` vs peer-registry `nameSource:auto` contamination vs bg completion / inode watcher / stall watchdog / casting / URI drop.

Cousins cite-only (NOT primary — different root cause):

- [#91054](https://github.com/anthropics/claude-code/issues/91054) — generated session names collide / dedup missing
- [#88845](https://github.com/anthropics/claude-code/issues/88845) — /rename survives into pre-/clear conversation
- [#86736](https://github.com/anthropics/claude-code/issues/86736) — desktop rename doesn't propagate to cross-session registry
- [#86531](https://github.com/anthropics/claude-code/issues/86531) — /rename renames other concurrent sessions
- [#81899](https://github.com/anthropics/claude-code/issues/81899) — resume/attach overwrites background agent titles

Product name stays **Fulcrum**. Do not rename to Wildcat, Clobber, Watchdog, Understudy, Fairlead, Stroboscope, Heliostat, Lethe, Trunnion, Aphonia, or any existing catalog slug. Name/slug `fulcrum` confirmed unused in catalog.json.

Different UI: balance-beam, pivot fulcrum, naming lever, custom-title vs auto-title pans, nameSource dial, peer-registry ledger, SendMessage tip meter, inheritance lag gauge. Cormorant Garamond + DM Sans + Fira Code. NOT Syne / Sora / IBM Plex Mono (Wildcat windlass). NOT DM Serif Display / Figtree / JetBrains Mono (Clobber print-shop). NOT Bricolage Grotesque / Karla / Fragment Mono (Watchdog kennel). NOT Bodoni Moda / Source Sans (Understudy). NOT Fraunces / Outfit (Fairlead hawse-pipe). Stay OFF windlass deck / forme/ink/plate / kennel slats / dressing-room call-board / hawse-pipe / optics strobe / rooftop observatory / underworld ferry.

Different verbs: pin idle inherited, pin seeded collided, score custom-title vs auto, flip name-applied vs foreign-inherited, load fixtures, reset to name-applied.

Different idle: **inherited**. Different seeded: **collided**. Contrast: **name-applied** / **registry-locked** / **dedup-user-name** / **foreign-title-blocked**.

## Live catalog path

`/fulcrum/` is this static naming-lever scoring assay. Path `https://hermes-playground-green.vercel.app/fulcrum/` and subdomain `https://fulcrum.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no live Claude sessions. Mark: `17:50 / hermes catalog #177 / #92377`. `?embed` or `?embed=1` hides chrome for the hub living featured well.

1. Seeded demo loads **collided** — seven live sessions share one generated name; bare SendMessage is ambiguous.
2. Idle **inherited** → `--name` is custom-title; registry inherits a foreign auto title ~100 ms after launch.
3. Contrast **name-applied** → `--name` sets the session name and replaces any generated title.
4. Contrast **registry-locked** → peers address the user-set name.
5. Contrast **dedup-user-name** → user-set collisions get a two-word dedup rename.
6. Contrast **foreign-title-blocked** → a fresh session never inherits another session's generated title.
7. Score **custom-title** vs **auto** → transcript has `--name`; registry writes nameSource auto.
8. Assay UI: fulcrum pivot, naming beam, nameSource dial, registry ledger, SendMessage tip meter, inheritance lag gauge.
9. Stay-off strip: Wildcat / Clobber / Watchdog / Understudy / Fairlead / Stroboscope / Heliostat / Lethe / Frizzen. Primary stays #92377.
10. **Score the naming lever** walks the probe ticket and lights chips on the board. Chip-switch every verdict. Paste or drop JSON. Assay simulator chips rewrite the beam (custom / auto / ledger / lock).

## How to score

Open `projects/fulcrum/index.html` in a browser, or serve the repo root and visit `/fulcrum/` (Vercel rewrite → `/projects/fulcrum`). No build step.

```bash
# No live Claude sessions. The living page scores probes in-browser.
# Do not claim this guard ships in Claude Code.
```

Empty paste scores the idle **inherited** ticket if you pin idle. Paste a probe on the page or drop a fixture from `data/`. The living page seeds **collided** / `--name` discarded / foreign auto peer title / nameSource auto.

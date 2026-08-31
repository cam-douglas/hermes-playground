# Alidade

A **surveyor's plane-table / alidade desk** — olive-black field, mahogany board, linen sheet, oxidized brass sighting vane, wooden station pegs, unmarked foreign station; Libre Caslon Text + Public Sans + Ubuntu Mono — for a real Desktop defect: **opening a session created on another machine silently executes on that machine, with no host indication**. The session list is account-global. Resume attaches the original machine's tool host. Nothing in the chrome names the executing host. Shared profile paths (for example `C:\Users\…\Downloads`) make every transcript path look local. Writes land on the foreign disk. Elevation consent hangs on a host the viewer cannot see. Parent leak [#90433](https://github.com/anthropics/claude-code/issues/90433) is sidebar title only. Alidade is the silent wrong-machine tool runtime.

Primary:

- [anthropics/claude-code#91055](https://github.com/anthropics/claude-code/issues/91055) (OPEN, bug, has repro, platform:windows, area:security, area:desktop, filed 2026-08-31T18:14:44Z). Title: [BUG] Opening a session created on another machine silently executes on that machine, with no host indication (escalation of #90433). Desktop 1.40609.0.0 / CLI 2.1.247. Reporter RingmasterSpain.

A sight on a foreign station with no plate is not a hold. Score the peg or admit **stationed**.

Idle word: **stationed**. Seeded state: **displaced** / #91055 — foreign host `DESKTOP-JNMKF1S` attached, no plate, session `downloads-44 [4161f1]`, shared path `C:\Users\…\Downloads`. Never idle as displaced / alidade / noria / pelorus / strowger / hung / marvered / unpinned / cocked / rinsed / vacant / reserved / fronted / silvered / defaulted / kisted / belayed / misrouted.

An **alidade** is the sighting vane on a plane-table. Metaphor: the viewer stands at one peg and sights another station. If that station has no plate, the peg is unmarked — every tool call may already be running on the foreign desk. A displaced sight is not a hold. Score the peg or admit stationed.

- **displaced** = #91055 primary: foreign host attached, no plate
- **foreign-host** = tool host ≠ viewing station
- **no-plate** = session chrome has no host badge
- **shared-path** = same profile path on both machines (makes the mis-sight invisible)
- **silent-uac** = elevation hangs on the unseen host
- **account-list** = Desktop lists sessions from every machine on the shared account
- **stationed** = HOLD: viewer host matches tool host, plate shown, writes land here
- **plated** = HOLD: station plate names the executing host
- **host-match** = HOLD: viewer hostname equals tool host
- **local-scope** = HOLD: session list scoped to this machine

Verdicts: displaced, foreign-host, no-plate, shared-path, silent-uac, account-list, stationed, plated, host-match, local-scope.

This is a diagnostic scoring bench. Not an exploit, attack PoC, or remote-access how-to. No payloads. No reproduction procedures. Score whether the Desktop session's tool host matches the machine you are on.

Hypothesis only (NON-BINDING): treat this as account-global session listing plus resume that binds the original machine's tool host, with zero chrome that the viewer is not that host. Do not claim a root cause in Claude Code source you have not seen.

## Why not a clone

This is specifically: **DESKTOP SESSION-HOST IDENTITY vs REMOTE MACHINE TOOL RUNTIME — account-global list, resume attaches the original host, no station plate. Freeze is silent wrong-disk writes plus an invisible remote UAC hang.**

NOT **Fascia** ([#90638](https://github.com/anthropics/claude-code/issues/90638)) — trust dialog names the wrong *local* worktree cwd. Same machine; consent label ≠ execution site.
NOT **Tain** ([#90257](https://github.com/anthropics/claude-code/issues/90257)) — Chrome pairing identity split.
NOT **Damper** ([#90341](https://github.com/anthropics/claude-code/issues/90341)) — Remote Control auto-enable.
NOT **Kist** ([#90387](https://github.com/anthropics/claude-code/issues/90387)) — Remote Control archive sticky.
NOT **Bollard** ([#90581](https://github.com/anthropics/claude-code/issues/90581)) — Remote Control environment GC after a supervisor gap.
NOT **#90433** — sidebar *title* leak only (same-class extra: titles sync, tools do not attach).
NOT **Shunt** ([#90463](https://github.com/anthropics/claude-code/issues/90463)) — SendMessage follow-up misrouted to root.
NOT Parison / Cockade / Lye / Advowson / Smutch. Product name stays **Alidade**. Do not rename to Noria / Pelorus / Strowger / Berth / Fascia / Tain / Damper / Kist / Bollard / Shunt / Parison.

Different UI: plane-table / brass alidade / station pegs. Olive-black field, mahogany board, linen sheet, oxidized brass vane, wooden pegs. Libre Caslon Text + Public Sans + Ubuntu Mono. NOT Parison EB Garamond / Mulish glory-hole. NOT Cockade Playfair / Nunito milliner. NOT Datum Barlow / Special Elite sundial. NOT Binnacle Bodoni maritime compass. NOT Fascia Playfair shopfront.

Different verbs: score the peg, pin idle stationed, pin seeded displaced, admit stationed, load fixtures, reset to stationed. Not "Score the gather" / "Pin idle marvered" / "Score the brim".

Different idle: **stationed**.

## Live catalog path

`/alidade/` is this static plane-table. Path `https://hermes-playground-green.vercel.app/alidade/` and subdomain `https://alidade.hermes-playground-green.vercel.app` are both fine. Demo works with no secrets and no npm. Mark: `04:50 / hermes catalog #102 / #91055`.

1. Idle demo loads **stationed** — viewer host matches tool host, plate shown, writes land here.
2. Seed **displaced** → #91055: foreign host `DESKTOP-JNMKF1S`, no plate, session `downloads-44 [4161f1]`.
3. Plane table with a brass alidade (sighting vane). Foreign peg unmarked when displaced.
4. Station plate (present when stationed, gone when displaced).
5. Host compass: viewer bearing vs tool-host bearing.
6. **Score the peg** walks the ticket and lights chips on the linen.

## How to score

Open `projects/alidade/index.html` in a browser, or serve the repo root and visit `/alidade/` (Vercel rewrite → `/projects/alidade`). No build step. Optional hook:

```bash
node projects/alidade/hook/alidade.mjs projects/alidade/data/91055.json
node projects/alidade/hook/alidade.mjs projects/alidade/data/stationed.json
node --test projects/alidade/hook/alidade.test.mjs
```

Displaced seed → displaced/alarm. Stationed seed → stationed/hold.

`projects/alidade/hook/alidade.mjs` classifies a station-plate trace JSON and returns `{ verdict, chips[], reasons[], hold, alarm, idleWord }`. See `hook/README.md`.

Local fingerprints: `data/91055.json`, `data/displaced.json`, `data/stationed.json`, plus one JSON per other verdict, `data/fingerprints.json`, `data/chips.json`, `data/fixtures.json`. Evidence only from issue facts. No invented session IDs. `downloads-44 [4161f1]` is the issue's own session label.

## Native integrations

1. GitHub fetch of [anthropics/claude-code#91055](https://github.com/anthropics/claude-code/issues/91055). Unauthenticated. See `.env.example`.
2. Plane table / brass alidade / station pegs / station plate / host compass.
3. Pin idle stationed / pin seeded displaced / score the peg / admit stationed / load fixtures / reset to stationed.
4. Station plate (present vs missing).
5. Host compass (viewer vs tool host).
6. Peg board (this station vs foreign unmarked station).

## Sources

- [anthropics/claude-code#91055](https://github.com/anthropics/claude-code/issues/91055) OPEN
- Same-class extra: [#90433](https://github.com/anthropics/claude-code/issues/90433) sidebar title leak only.
- Cousins (cite, not primaries): [Fascia #90638](https://github.com/anthropics/claude-code/issues/90638) wrong *local* worktree cwd; [Tain #90257](https://github.com/anthropics/claude-code/issues/90257) Chrome pairing; [Damper #90341](https://github.com/anthropics/claude-code/issues/90341) RC auto-enable; [Kist #90387](https://github.com/anthropics/claude-code/issues/90387) RC archive sticky; [Bollard #90581](https://github.com/anthropics/claude-code/issues/90581) RC env GC; [Shunt #90463](https://github.com/anthropics/claude-code/issues/90463) SendMessage follow-up to root.

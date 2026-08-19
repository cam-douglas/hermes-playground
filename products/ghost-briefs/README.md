# Ghost Briefs

A local, human-only map of which shipped subsystems still have a named person who can brief them — and which are ghosts.

## Problem

Agents can raise finished-work volume without raising the number of people who can still explain the result. After a merge flood, teams lose the plot on auth, billing, flags, and migrations even though the code "landed." Existing tools cluster around harnesses, skill packs, and handoff consoles. They do not answer the quieter question:

- who can still brief this subsystem in ninety seconds?
- which shipped surfaces have no named human?
- where did fluency debt accumulate after an AI last-touch?

## Users

- staff engineers who inherit agent-written surfaces
- incident commanders who need a real owner, not a commit author
- founders of small product teams after a high-output week
- anyone doing a human review of what the repo can still explain

## Workflow

1. Load the subsystem map
2. Apply the demo-week fixture to see two orphans immediately
3. Vote fluency: I can brief / I shipped but can't / nobody I know can
4. Open a dossier and file a three-sentence 90-second brief
5. Watch ghost count and fluency-debt fall when a named brief lands
6. Export or import JSON; reset restores the seed

## Data model

Each subsystem tracks:

- `id`
- `name`
- `blurb`
- `lastTouched` (`ai` or `human`)
- `lastTouchedAt`
- `owner` (optional)

Persisted locally:

- `votes` — one fluency vote per subsystem
- `briefs` — `{ by, what, edge, test, at }`
- `signer` — the name attached to a filed brief

Derived values:

- `ghost` — no "I can brief" vote and no filed brief
- `orphan` — vote is "nobody I know can" and no filed brief
- `fluency-debt score` — share of subsystems that are still ghosts
- `briefed by <name>` — card state after a brief is filed

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- `localStorage` persistence for votes and briefs
- JSON export / import for a portable copy
- deterministic ghost / orphan / debt scoring

## UX

- command strip with signer and live clock
- ghost count, fluency-debt score, and red orphan rail
- dossier board (not a stock table)
- inspector for the 90-second brief
- demo-week fixture and one-click seed reset

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/ghost-briefs/`

## Verification

- page loads in a browser without build tooling
- demo week produces two named orphans (Feature flags, Schema migrations)
- filing a brief drops ghost count and fluency-debt
- refresh keeps votes and briefs
- export / import round-trips the same state
- reset restores the seed

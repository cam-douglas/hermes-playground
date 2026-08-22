# Fetch

A sea looks still until you see the fetch. Move the wind. See the leftover run.

This is not Scope. Scope is leftover rode versus the bottom. This is not Heel. Heel is leftover hull list. This is not Throw. Throw is leftover vent plume. This is not Bank. Bank is leftover wing roll. This is not a clock. Fetch answers “how far the wind still has to run over water before a wave can build, leftover fetch as seen in plan from shore to open water.”

## Problem

A sea looks still until you see the fetch:

- how far does the wind still have to run over water?
- is the leftover short, or enough?
- when is the leftover fetch obvious — as a picture, not a forecast?

Existing tools in this catalogue measure leftover rode, leftover hull list, leftover vent plume, and leftover wing roll. They do not show leftover wind run.

## Users

- people who already know a sea can look still until the leftover fetch shows
- anyone who refuses to treat a rode, a hull, a vent, a wing, or a clock as this leftover
- desks that want fetch as a picture, not a forecast spec
- teams that want a no-backend, local-only pass — not Scope, not Heel, not Throw, not Bank, not a paste well

## Workflow

1. Load the seed: 48 km of leftover fetch — already enough, not short / not zero
2. Read the scene: a stretch of water in plan, shore to open water, leftover fetch and leftover wave height labelled as a sketch
3. Move fetch (or use the arrow keys on the focused slider); leftover names enough or short
4. Drop the fetch toward 0 km and the wind has no run; raise it and the leftover wave sketch shows
5. Reset restores the seeded leftover enough

## Data model

One stretch of water in plan:

- `fetch` — kilometres of leftover wind run over water (default 48)

Derived picture:

- leftover labelled as a sketch (short / enough), not a forecast
- leftover wave height labelled as a sketch
- short when fetch ≤ 12 km

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: shore, water stretch, wind run, leftover fetch as the run
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- wind run over water versus leftover fetch in plan, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window frame, not a roof, not a rail, not a hull, not a retaining wall, not a brick course, not a wing, not a clock
- seeded demo already shows a visible leftover (not short / not zero)
- live fetch, leftover labelled as a sketch (short / enough)
- keyboard moves the focused control
- SVG text alternative names whether fetch is short
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/fetch/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (wind run over water / leftover fetch) is in the DOM
- seeded leftover is visible (enough — not short)
- changing a control redraws and updates the readout
- no paste-well hero, no rode, no hull, no vent plume, no wings, no clock face

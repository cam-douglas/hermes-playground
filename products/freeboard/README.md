# Freeboard

A hull looks sunk until you see the freeboard. Move the water. See the leftover hull.

This is not Heel. Heel is leftover hull list. This is not Scope. Scope is a rode versus the bottom. This is not Fetch. Fetch is leftover wind run over water. This is not a clock. Freeboard answers “how far the hull still sits above the water, leftover freeboard as seen in elevation.”

## Problem

A hull looks sunk until you see the freeboard:

- how far does the hull still sit above the water?
- is the leftover awash, or showing?
- when is the leftover freeboard obvious — as a picture, not a load spec?

Existing tools in this catalogue measure leftover hull list, leftover rode versus the bottom, and leftover wind run over water. They do not show leftover hull above a waterline.

## Users

- people who already know a hull can look sunk until the leftover freeboard shows
- anyone who refuses to treat a list, a rode, a wind run, or a clock as this leftover
- desks that want freeboard as a picture, not a load sign-off
- teams that want a no-backend, local-only pass — not Heel, not Scope, not Fetch, not a paste well

## Workflow

1. Load the seed: 140 cm of leftover hull above the water — already showing, not awash / not flush
2. Read the scene: one hull in elevation versus a waterline, leftover freeboard labelled as a sketch
3. Move freeboard (or use the arrow keys on the focused slider); leftover names showing or awash
4. Drop the leftover toward 0 cm and the hull looks sunk; raise it and the leftover freeboard shows
5. Reset restores the seeded leftover showing

## Data model

One hull in elevation with leftover freeboard above a waterline:

- `freeboard` — centimetres of leftover hull above the water (default 140)

Derived picture:

- leftover labelled as a sketch (awash / showing), not a load sign-off
- leftover freeboard labelled as a sketch
- awash when freeboard ≤ 10 cm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a hull, a waterline, leftover freeboard as the hull still above the water
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one hull leftover freeboard in elevation, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window sash, not a roof, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not an arch, not a plinth, not a lintel, not a clock
- seeded demo already shows a visible leftover (not awash / not flush)
- live freeboard, leftover labelled as a sketch (awash / showing)
- keyboard moves the focused control
- SVG text alternative names whether freeboard is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/freeboard/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (hull / leftover freeboard above a waterline) is in the DOM
- seeded leftover is visible (showing — not awash)
- changing a control redraws and updates the readout
- no paste-well hero, no hull list, no rode, no wind-run fetch, no clock face

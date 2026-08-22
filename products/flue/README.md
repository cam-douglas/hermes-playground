# Flue

A stack looks still until you see the flue. Move the fire. See the leftover pull.

This is not Throw. Throw is leftover vent plume reach. This is not Kelvin. Kelvin is a lamp. This is not Wire Sag. Wire Sag is a hanging span. This is not a clock. Flue answers “how far the stack still draws, leftover chimney pull as seen in elevation.”

## Problem

A stack looks still until you see the flue:

- how far does the stack still draw?
- is the leftover cold, or showing?
- when is the leftover pull obvious — as a picture, not a heating spec?

Existing tools in this catalogue measure leftover vent plume reach, leftover lamp warmth, and leftover sag in a hanging span. They do not show leftover chimney pull in a stack.

## Users

- people who already know a stack can look still until the leftover flue shows
- anyone who refuses to treat a vent plume, a lamp, a hanging span, or a clock as this leftover
- desks that want flue as a picture, not a heating sign-off
- teams that want a no-backend, local-only pass — not Throw, not Kelvin, not Wire Sag, not a paste well

## Workflow

1. Load the seed: 4.5 m of leftover chimney pull — already showing, not cold / not flush
2. Read the scene: one chimney stack in elevation, leftover flue labelled as a sketch
3. Move flue (or use the arrow keys on the focused slider); leftover names showing or cold
4. Drop the leftover toward 0 m and the stack looks still; raise it and the leftover pull shows
5. Reset restores the seeded leftover showing

## Data model

One chimney stack in elevation with leftover flue as leftover pull:

- `flue` — metres of leftover pull (default 4.5)

Derived picture:

- leftover labelled as a sketch (cold / showing), not a heating sign-off
- leftover flue labelled as a sketch
- cold when flue ≤ 0.4 m

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a chimney stack, leftover flue as leftover pull inside the stack
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one stack leftover flue in elevation, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window sash, not a roof, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not an arch, not a plinth, not a lintel, not a freeboard, not a clock
- seeded demo already shows a visible leftover (not cold / not flush)
- live flue, leftover labelled as a sketch (cold / showing)
- keyboard moves the focused control
- SVG text alternative names whether flue is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/flue/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (chimney stack / leftover flue as leftover pull) is in the DOM
- seeded leftover is visible (showing — not cold)
- changing a control redraws and updates the readout
- no paste-well hero, no vent plume, no lamp, no hanging catenary, no clock face

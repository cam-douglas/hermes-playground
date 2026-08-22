# Plinth

A wall looks grounded until you see the plinth. Move the base. See the leftover step.

This is not Batter. Batter is leftover retaining-wall slope. This is not Setback. Setback is leftover yard from a lot line. This is not Keystone. Keystone is leftover arch lock. This is not a clock. Plinth answers “how far the base still steps out, leftover step as seen in elevation.”

## Problem

A wall looks grounded until you see the plinth:

- how far does the base still step out?
- is the leftover flush, or showing?
- when is the leftover step obvious — as a picture, not a masonry spec?

Existing tools in this catalogue measure leftover retaining-wall slope, leftover yard from a lot line, and leftover arch lock. They do not show leftover base step.

## Users

- people who already know a wall can look grounded until the leftover plinth shows
- anyone who refuses to treat a slope, a lot line, an arch lock, or a clock as this leftover
- desks that want plinth as a picture, not a masonry sign-off
- teams that want a no-backend, local-only pass — not Batter, not Setback, not Keystone, not a paste well

## Workflow

1. Load the seed: 80 mm of leftover projection — already showing, not flush / not flush-to-wall
2. Read the scene: one wall in elevation, sitting on a plinth, leftover step labelled as a sketch
3. Move plinth (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the leftover toward 0 mm and the wall looks grounded; raise it and the leftover step shows
5. Reset restores the seeded leftover showing

## Data model

One wall in elevation with leftover base step:

- `plinth` — millimetres of leftover projection (default 80)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a masonry sign-off
- leftover step labelled as a sketch
- flush when plinth ≤ 8 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a wall, a plinth, leftover step as the base projection
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one wall leftover base step in elevation, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window frame, not a roof, not a rail, not a hull, not a retaining wall, not a brick course, not a wing, not a sea, not a lot line, not a crane, not a tree, not a scarf, not a hill, not an arch, not a clock
- seeded demo already shows a visible leftover (not flush / not flush-to-wall)
- live plinth, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether plinth is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/plinth/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (wall / leftover base step) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no retaining-wall slope, no lot line, no arch keystone, no clock face

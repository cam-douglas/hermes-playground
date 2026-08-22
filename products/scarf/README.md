# Scarf

A joint looks flush until you see the scarf. Move the boards. See the leftover overlap.

This is not Kerf. Kerf is a blade gap. This is not Grain. Grain is cut versus grain. This is not Offcut. Offcut is leftover millimetres on a stock bar. This is not a clock. Scarf answers “how far two boards still overlap as a scarf, leftover timber overlap as seen in elevation.”

## Problem

A joint looks flush until you see the scarf:

- how far do the boards still overlap?
- is the leftover butted, or showing?
- when is the leftover overlap obvious — as a picture, not a joinery spec?

Existing tools in this catalogue measure leftover blade gap, leftover cut-versus-grain mismatch, and leftover millimetres on a stock bar. They do not show leftover timber overlap at a scarf.

## Users

- people who already know a joint can look flush until the leftover scarf shows
- anyone who refuses to treat a kerf, a grain cut, leftover stock, or a clock as this leftover
- desks that want scarf as a picture, not a joinery sign-off
- teams that want a no-backend, local-only pass — not Kerf, not Grain, not Offcut, not a paste well

## Workflow

1. Load the seed: 180 mm of leftover scarf — already showing, not butted / not flush
2. Read the scene: two boards in elevation meeting as a scarf joint, leftover scarf labelled as a sketch
3. Move scarf (or use the arrow keys on the focused slider); leftover names showing or butted
4. Drop the scarf toward 0 mm and the joint looks flush; raise it and the leftover overlap shows
5. Reset restores the seeded leftover showing

## Data model

Two boards in elevation meeting as a scarf:

- `scarf` — millimetres of leftover overlap (default 180)

Derived picture:

- leftover labelled as a sketch (butted / showing), not a joinery sign-off
- leftover overlap labelled as a sketch
- butted when scarf ≤ 24 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: two boards, a scarf face, leftover overlap as the scarf
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- two boards leftover overlap in elevation, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window frame, not a roof, not a rail, not a hull, not a retaining wall, not a brick course, not a wing, not a sea, not a lot line, not a crane, not a tree, not a clock
- seeded demo already shows a visible leftover (not butted / not flush)
- live scarf, leftover labelled as a sketch (butted / showing)
- keyboard moves the focused control
- SVG text alternative names whether scarf is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/scarf/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (two boards / leftover overlap) is in the DOM
- seeded leftover is visible (showing — not butted)
- changing a control redraws and updates the readout
- no paste-well hero, no blade gap, no grain-cut, no leftover stock bar, no clock face

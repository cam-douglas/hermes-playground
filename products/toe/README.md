# Toe

Two wheels look straight until you see the toe. Move the angle. See the leftover track.

This is not Camber. Camber is a crowned road — leftover rise. This is not Backlash. Backlash is gear play. This is not Grain. Grain is cut versus grain angle. This is not Plumb. Plumb is a hanging bob. This is not a clock. Toe answers “which way do the wheels still point, as seen from above.”

## Problem

Two wheels look straight until you see the toe:

- do they point in, out, or straight-enough?
- how many degrees of leftover heading sit off the dashed straight-ahead?
- what is that leftover at the rim, as a sketch?
- when is the leftover obvious — as a picture, not a shop sign-off?

Existing tools in this catalogue crown a road, mesh two gears, cut a plank, and hang a bob. They do not show leftover wheel angle from above.

## Users

- people who already know two wheels can look straight while they still toe in or out
- anyone who refuses to treat a crowned road, a gear mesh, a grain angle, or a clock as this leftover
- desks that want toe as a picture, not an alignment printout
- teams that want a no-backend, local-only pass — not Camber, not Backlash, not Grain, not a paste well

## Workflow

1. Load the seed: 1.6° toe-in, about 5.7 mm at a 16-inch rim
2. Read the scene: two wheels from above, dashed straight-ahead versus actual heading
3. Move toe (or use the arrow keys on the focused slider); leftover names in, out, or straight-enough
4. Push the slider through zero and the wheels open out; reset restores the seeded leftover in
5. Reset restores the seeded leftover in

## Data model

One plan view of a track:

- `toe` — degrees, in is positive (default 1.6)

Derived picture:

- millimetres at a 16-inch rim (one side)
- labelled as a sketch (in / out / straight-enough), not a shop sign-off

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: two wheels from above, dashed straight-ahead, leftover heading
- moving a control redraws the wheel angle immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- two wheels from above, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not a clock
- seeded demo already shows a visible leftover toe-in
- live toe, rim leftover, leftover labelled as a sketch (in / out / straight-enough)
- keyboard moves the focused control
- SVG text alternative names whether toe is in or out
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/toe/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (two wheels from above + dashed straight-ahead) is in the DOM
- seeded leftover is visible (1.6° in — not zero / not perfectly parallel)
- changing a control redraws and updates the readout
- no paste-well hero, no crowned road, no gears, no grain plank, no clock face

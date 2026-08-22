# Crown

A wire looks clear until you see the crown. Move the tree. See the leftover gap.

This is not Wire Sag. Wire Sag is a hanging span / catenary. This is not Headroom. Headroom is a standing figure vs a ceiling. This is not Camber. Camber is a crowned road. This is not a clock. Crown answers “how far the canopy still sits clear of a straight overhead wire, leftover tree canopy as seen in elevation.”

## Problem

A wire looks clear until you see the crown:

- how far does the canopy still sit clear of the wire?
- is the leftover brushing, or showing?
- when is the leftover gap obvious — as a picture, not a line-clearance spec?

Existing tools in this catalogue measure leftover sag in a hanging span, leftover air above a standing head, and leftover rise in a crowned road. They do not show leftover tree canopy under a wire.

## Users

- people who already know a wire can look clear until the leftover crown shows
- anyone who refuses to treat a sag, a ceiling, a road, or a clock as this leftover
- desks that want crown as a picture, not a utility sign-off
- teams that want a no-backend, local-only pass — not Wire Sag, not Headroom, not Camber, not a paste well

## Workflow

1. Load the seed: 2.8 m of leftover crown — already showing, not brushing / not flush
2. Read the scene: a tree in elevation versus a straight overhead wire, leftover crown labelled as a sketch
3. Move crown (or use the arrow keys on the focused slider); leftover names showing or brushing
4. Drop the crown toward 0 m and the canopy sits on the wire; raise it and the leftover gap shows
5. Reset restores the seeded leftover showing

## Data model

One tree in elevation versus a fixed straight wire:

- `crown` — metres of leftover canopy gap under the wire (default 2.8)

Derived picture:

- leftover labelled as a sketch (brushing / showing), not a utility sign-off
- leftover gap labelled as a sketch
- brushing when crown ≤ 0.35 m

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: tree, canopy, straight overhead wire, leftover crown as the gap
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- tree canopy versus leftover gap in elevation, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window frame, not a roof, not a rail, not a hull, not a retaining wall, not a brick course, not a wing, not a sea, not a lot line, not a crane, not a clock
- seeded demo already shows a visible leftover (not brushing / not flush)
- live crown, leftover labelled as a sketch (brushing / showing)
- keyboard moves the focused control
- SVG text alternative names whether crown is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/crown/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (tree canopy / leftover gap) is in the DOM
- seeded leftover is visible (showing — not brushing)
- changing a control redraws and updates the readout
- no paste-well hero, no hanging catenary, no standing figure vs a ceiling, no crowned road, no clock face

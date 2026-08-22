# Setback

A lot looks full until you see the setback. Move the line. See the leftover yard.

This is not Batter. Batter is leftover retaining-wall slope. This is not Eave. Eave is leftover roof overhang. This is not Dark Floor. Dark Floor is a night plan of rooms. This is not Reveal. Reveal is leftover sash frame. This is not a clock. Setback answers “how far the building still sits back from the lot line, leftover yard as seen in plan.”

## Problem

A lot looks full until you see the setback:

- how far does the building still sit back from the lot line?
- is the leftover flush, or showing?
- when is the leftover yard obvious — as a picture, not a zoning spec?

Existing tools in this catalogue measure leftover slope, leftover overhang, leftover rooms, and leftover sash frame. They do not show leftover yard.

## Users

- people who already know a lot can look full until the leftover setback shows
- anyone who refuses to treat a slope, an eave, a night floor of rooms, a sash, or a clock as this leftover
- desks that want setback as a picture, not a zoning sign-off
- teams that want a no-backend, local-only pass — not Batter, not Eave, not Dark Floor, not Reveal, not a paste well

## Workflow

1. Load the seed: 6 m of leftover setback — already showing, not flush / not zero
2. Read the scene: a lot in plan, lot line and building footprint, leftover yard labelled as a sketch
3. Move setback (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the setback toward 0 m and the building sits on the lot line; raise it and the leftover yard shows
5. Reset restores the seeded leftover showing

## Data model

One lot in plan:

- `setback` — metres of leftover yard from the lot line (default 6)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a zoning sign-off
- leftover yard depth labelled as a sketch
- flush when setback ≤ 1 m

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: lot line, building footprint, leftover setback as the yard
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- lot line versus leftover yard in plan, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window frame, not a roof, not a rail, not a hull, not a retaining wall, not a brick course, not a wing, not a sea, not a clock
- seeded demo already shows a visible leftover (not flush / not zero)
- live setback, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether setback is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/setback/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (lot line / leftover yard) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no sloping retaining wall, no eave in section, no night floor of rooms, no clock face

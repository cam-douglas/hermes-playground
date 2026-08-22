# Threshold

A door looks open until you see the threshold. Move the bar. See the leftover rise.

This is not Swing. Swing is leftover door arc. This is not Plinth. Plinth is leftover wall base. This is not Nosing. Nosing is leftover tread hang. This is not Going. Going is leftover tread depth. This is not Mullion. Mullion is leftover window bar. This is not Reveal. Reveal is leftover sash-frame. This is not Lintel. Lintel is leftover span over an opening. This is not a clock. Threshold answers “how far the leftover bar still rises above the floor, leftover doorway bar as seen in elevation.”

## Problem

A door looks open until you see the threshold:

- how far does the leftover bar still rise above the floor?
- is the leftover flush, or showing?
- when is the leftover bar obvious — as a picture, not a joinery sign-off?

Existing tools in this catalogue measure leftover door swing, leftover wall base, leftover tread hang, leftover tread depth, leftover window bar, leftover sash-frame, and leftover lintel span. They do not show leftover doorway bar — how far a threshold still rises above the floor.

## Users

- people who already know a door can look open until the leftover threshold shows
- anyone who refuses to treat a swing, a plinth, a nosing, a going, a mullion, a reveal, a lintel, or a clock as this leftover
- desks that want threshold as a picture, not a joinery sign-off
- teams that want a no-backend, local-only pass — not Swing, not Plinth, not Nosing, not Going, not Mullion, not Reveal, not a paste well

## Workflow

1. Load the seed: 22 mm of leftover rise — already showing, not flush
2. Read the scene: one elevation, a doorway with a leftover bar across the floor, leftover labelled as a sketch
3. Move rise (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the leftover toward 0 mm and the floor looks continuous / the door looks open; raise it and the leftover bar shows — you still have to step over
5. Reset restores the seeded leftover showing

## Data model

One elevation with leftover threshold as leftover rise:

- `rise` — millimetres of leftover bar above the floor (default 22)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a joinery sign-off
- leftover bar labelled as a sketch
- flush when rise ≤ 3 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: an elevation — a doorway with a leftover bar across the floor; leftover is how far the leftover bar still rises above the floor
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover doorway bar in elevation, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a keystone lock, not a plinth, not a lintel, not a freeboard, not a flue, not a parapet, not a rabbet, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a clock
- seeded demo already shows a visible leftover (not flush)
- live rise, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether the threshold is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/threshold/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (elevation / leftover doorway bar across the floor) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no door swing, no plinth wall-base, no stair nosing, no stair going, no window mullion, no sash leftover frame, no lintel span, no clock face

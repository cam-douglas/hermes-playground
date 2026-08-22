# Lintel

A door looks open until you see the lintel. Move the stone. See the leftover span.

This is not Reveal. Reveal is a sash leftover frame. This is not Keystone. Keystone is leftover arch lock. This is not Headroom. Headroom is leftover air above a standing head. This is not Plinth. Plinth is leftover base step. This is not a clock. Lintel answers “how far the stone still bears past the opening, leftover span as seen in elevation.”

## Problem

A door looks open until you see the lintel:

- how far does the stone still bear past the opening?
- is the leftover flush, or showing?
- when is the leftover span obvious — as a picture, not a masonry spec?

Existing tools in this catalogue measure leftover sash frame, leftover arch lock, leftover ceiling air, and leftover base step. They do not show leftover span over an opening.

## Users

- people who already know an opening can look open until the leftover lintel shows
- anyone who refuses to treat a sash frame, an arch lock, a ceiling, a base step, or a clock as this leftover
- desks that want lintel as a picture, not a masonry sign-off
- teams that want a no-backend, local-only pass — not Reveal, not Keystone, not Headroom, not Plinth, not a paste well

## Workflow

1. Load the seed: 90 mm of leftover bearing on each side — already showing, not flush / not flush-to-opening
2. Read the scene: one opening in elevation, a lintel spanning the top, leftover span labelled as a sketch
3. Move lintel (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the leftover toward 0 mm and the opening looks open; raise it and the leftover span shows
5. Reset restores the seeded leftover showing

## Data model

One opening in elevation with leftover span at the lintel:

- `lintel` — millimetres of leftover bearing on each side (default 90)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a masonry sign-off
- leftover span labelled as a sketch
- flush when lintel ≤ 8 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: an opening, a lintel, leftover span as the bearing past the opening
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one opening leftover span in elevation, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window sash, not a roof, not a rail, not a hull, not a retaining wall, not a brick course, not a wing, not a sea, not a lot line, not a crane, not a tree, not a scarf, not a hill, not an arch, not a plinth, not a clock
- seeded demo already shows a visible leftover (not flush / not flush-to-opening)
- live lintel, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether lintel is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/lintel/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (opening / leftover span) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no sash leftover frame, no arch keystone, no standing figure vs a ceiling, no base step, no clock face

# Shim

A joint looks closed until you see the shim. Move the pack. See the leftover fill.

This is not Arris. Arris is leftover sharp where two planes meet. This is not Kerf. Kerf is leftover blade gap. This is not Offcut. Offcut is leftover millimetres of stock. This is not Rabbet. Rabbet is leftover rebate shoulder. This is not Fascia. This is not Soffit. This is not Packed sky. This is not a paste well. This is not a clock. Shim answers “how far the leftover pack still fills the gap.”

## Problem

A joint looks closed until you see the shim:

- how far does the leftover pack still fill the gap?
- is the leftover closed, or showing?
- when is the leftover pack obvious — as a sketch, not a joinery sign-off?

Existing tools in this catalogue measure leftover sharp where two planes meet, leftover blade gap, leftover millimetres of stock, leftover rebate shoulder, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, and leftover vault infill. They do not show leftover packing that still fills a gap.

## Users

- people who already know a joint can look closed until the leftover shim shows
- anyone who refuses to treat an arris, a kerf, an offcut, a rabbet, a fascia board, a soffit, a packed sky, or a clock as this leftover
- desks that want shim as a sketch, not a joinery sign-off
- teams that want a no-backend, local-only pass — not Arris, not Kerf, not Offcut, not Rabbet, not a paste well

## Workflow

1. Load the seed: 3 mm of leftover pack — already showing, not closed / not flush
2. Read the scene: one elevation, two members whose leftover is the shim, leftover labelled as a sketch
3. Move pack (or use the arrow keys on the focused slider); leftover names showing or closed
4. Drop the leftover toward 0 mm and the joint looks closed / no leftover fill; raise it and the leftover pack still fills the gap
5. Reset restores the seeded leftover showing

## Data model

One elevation with leftover shim as leftover pack that still fills a gap:

- `pack` — millimetres of leftover packing (default 3)

Derived picture:

- leftover labelled as a sketch (closed / showing), not a joinery sign-off
- leftover pack labelled as a sketch
- closed / flush when pack ≤ 0.3 mm (the joint looks closed; no leftover fill)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: an elevation — two members whose leftover is the shim; leftover is how far the leftover pack still fills the gap
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover pack filling a gap between two members in an elevation, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a keystone lock, not a plinth, not a lintel, not a freeboard, not a flue, not a parapet wall, not a rabbet shoulder, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not an arris sharp, not a clock
- seeded demo already shows a visible leftover (not closed / not flush)
- live pack, leftover labelled as a sketch (closed / showing)
- keyboard moves the focused control
- SVG text alternative names whether the shim is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/shim/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (elevation / two members / leftover shim) is in the DOM
- seeded leftover is visible (showing — not closed)
- changing a control redraws and updates the readout
- no paste-well hero, no arris sharp as the hero, no kerf gap, no offcut stick, no rabbet shoulder, no clock face

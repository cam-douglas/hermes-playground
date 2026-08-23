# Chamfer

A joint looks sharp until you see the chamfer. Move the bevel. See the leftover ease.

This is not Arris. Arris is leftover sharp where two planes meet. This is not Fillet. Fillet is leftover radius in a concave corner. This is not Rabbet. Rabbet is leftover rebate shoulder. This is not Kerf. Kerf is leftover blade gap. This is not Ridge. Ridge is leftover peak where two roof planes meet. This is not Shim. Shim is leftover packing that still fills a gap. This is not Packed sky. Packed sky is last hour’s lattice. This is not a clock. Chamfer answers “how far the leftover bevel still takes the sharp off the corner.”

## Problem

A joint looks sharp until you see the chamfer:

- how far does the leftover bevel still take the sharp off the corner?
- is the leftover sharp, or showing?
- when is the leftover ease obvious — as a sketch, not a joinery sign-off?

Existing tools in this catalogue measure leftover sharp where two planes meet, leftover packing that still fills a gap, leftover peak where two roof planes meet, leftover rebate shoulder, leftover blade gap, leftover millimetres of stock, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, and leftover vault infill. They do not show leftover bevel — how far a chamfer still takes the sharp off the corner.

## Users

- people who already know a joint can look sharp until the leftover chamfer shows
- anyone who refuses to treat an arris, a fillet, a rabbet, a kerf, a ridge, a shim, a packed sky, or a clock as this leftover
- desks that want chamfer as a sketch, not a joinery sign-off
- teams that want a no-backend, local-only pass — not Arris, not Fillet, not Rabbet, not Ridge, not a paste well

## Workflow

1. Load the seed: 18 mm of leftover bevel — already showing, not a sharp corner
2. Read the scene: one elevation, two planes whose leftover is the chamfer, leftover labelled as a sketch
3. Move bevel (or use the arrow keys on the focused slider); leftover names showing or sharp
4. Drop the leftover toward 0 mm and the joint looks like an arris / no leftover bevel; raise it and the leftover bevel still takes the sharp off
5. Reset restores the seeded leftover showing

## Data model

One elevation with leftover chamfer as leftover bevel that still takes the sharp off the corner:

- `bevel` — millimetres of leftover bevel (default 18)

Derived picture:

- leftover labelled as a sketch (sharp / showing), not a joinery sign-off
- leftover ease labelled as a sketch
- sharp / no leftover ease when bevel ≤ 4 mm (the joint looks like an arris / no leftover bevel)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: an elevation — two planes whose leftover is the chamfer; leftover is how far the leftover bevel still takes the sharp off the corner
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover bevel that still takes the sharp off the corner in an elevation, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not an arris sharp as the hero, not a shim pack, not a ridge peak, not a fillet radius, not a clock
- seeded demo already shows a visible leftover (not a sharp corner)
- live bevel, leftover labelled as a sketch (sharp / showing)
- keyboard moves the focused control
- SVG text alternative names whether the chamfer is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/chamfer/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (elevation / two planes / leftover chamfer) is in the DOM
- seeded leftover is visible (showing — not sharp)
- changing a control redraws and updates the readout
- no paste-well hero, no arris sharp as the hero, no fillet radius, no rabbet shoulder, no ridge peak, no shim pack, no clock face

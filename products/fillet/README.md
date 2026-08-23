# Fillet

A joint looks square until you see the fillet. Move the radius. See the leftover fill.

This is not Chamfer. Chamfer is leftover bevel that takes the sharp off a convex corner. This is not Arris. Arris is leftover sharp where two planes meet. This is not Rabbet. Rabbet is leftover rebate shoulder. This is not Kerf. Kerf is leftover blade gap. This is not Ridge. Ridge is leftover peak where two roof planes meet. This is not Shim. Shim is leftover packing that still fills a gap. This is not Packed sky. Packed sky is last hour’s lattice. This is not a clock. Fillet answers “how far the leftover radius still fills the concave corner.”

## Problem

A joint looks square until you see the fillet:

- how far does the leftover radius still fill the concave corner?
- is the leftover square, or showing?
- when is the leftover fill obvious — as a sketch, not a joinery sign-off?

Existing tools in this catalogue measure leftover bevel that still takes the sharp off, leftover sharp where two planes meet, leftover packing that still fills a gap, leftover peak where two roof planes meet, leftover rebate shoulder, leftover blade gap, leftover millimetres of stock, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, and leftover vault infill. They do not show leftover radius — how far a fillet still fills the concave corner.

## Users

- people who already know a joint can look square until the leftover fillet shows
- anyone who refuses to treat a chamfer, an arris, a rabbet, a kerf, a ridge, a shim, a packed sky, or a clock as this leftover
- desks that want fillet as a sketch, not a joinery sign-off
- teams that want a no-backend, local-only pass — not Chamfer, not Arris, not Rabbet, not Ridge, not a paste well

## Workflow

1. Load the seed: 16 mm of leftover radius — already showing, not a square inside corner
2. Read the scene: one elevation, two planes whose leftover is the fillet, leftover labelled as a sketch
3. Move radius (or use the arrow keys on the focused slider); leftover names showing or square
4. Drop the leftover toward 0 mm and the joint looks square / no leftover radius; raise it and the leftover radius still fills the concave corner
5. Reset restores the seeded leftover showing

## Data model

One elevation with leftover fillet as leftover radius that still fills the concave corner:

- `radius` — millimetres of leftover radius (default 16)

Derived picture:

- leftover labelled as a sketch (square / showing), not a joinery sign-off
- leftover fill labelled as a sketch
- square / no leftover fill when radius ≤ 4 mm (the joint looks square / no leftover radius)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: an elevation — two planes whose leftover is the fillet; leftover is how far the leftover radius still fills the concave corner
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover radius that still fills the concave corner in an elevation, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer bevel as the hero, not an arris sharp, not a shim pack, not a ridge peak, not a clock
- seeded demo already shows a visible leftover (not a square inside corner)
- live radius, leftover labelled as a sketch (square / showing)
- keyboard moves the focused control
- SVG text alternative names whether the fillet is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/fillet/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (elevation / two planes / leftover fillet) is in the DOM
- seeded leftover is visible (showing — not square)
- changing a control redraws and updates the readout
- no paste-well hero, no chamfer bevel as the hero, no arris sharp, no rabbet shoulder, no ridge peak, no shim pack, no clock face

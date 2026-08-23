# Wane

A board looks square until you see the wane. Move the live edge. See the leftover bark.

This is not Offcut. Offcut is leftover millimetres after placing cuts. This is not Grain. Grain is leftover mismatch of the cut to the fibres. This is not Kerf. Kerf is leftover blade gap. This is not Arris. Arris is leftover sharp. This is not Chamfer. Chamfer is leftover bevel. This is not Fillet. Fillet is leftover radius in a concave corner. This is not Rabbet. This is not Packed sky. Packed sky is last hour’s lattice. This is not a clock. Wane answers “how far the leftover live edge still takes the square off one corner.”

## Problem

A board looks square until you see the wane:

- how far does the leftover live edge still take the square off one corner?
- is the leftover square, or showing?
- when is the leftover bark obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover millimetres of stock, leftover mismatch of the cut to the fibres, leftover blade gap, leftover sharp where two planes meet, leftover bevel that still takes the sharp off, leftover radius that still fills a concave corner, leftover rebate shoulder, leftover packing that still fills a gap, leftover peak where two roof planes meet, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, and leftover vault infill. They do not show leftover live edge — how far a wane still takes the square off a board (the log’s curve / bark still showing).

## Users

- people who already know a board can look square until the leftover wane shows
- anyone who refuses to treat an offcut, a grain, a kerf, an arris, a chamfer, a fillet, a packed sky, or a clock as this leftover
- desks that want wane as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Offcut, not Grain, not Kerf, not Fillet, not a paste well

## Workflow

1. Load the seed: 20 mm of leftover live edge — already showing, not a square board
2. Read the scene: one elevation, a board whose leftover is the wane, leftover labelled as a sketch
3. Move wane (or use the arrow keys on the focused slider); leftover names showing or square
4. Drop the leftover toward 0 mm and the board looks square / no leftover live edge; raise it and the leftover bark still takes the square off
5. Reset restores the seeded leftover showing

## Data model

One elevation with leftover wane as leftover live edge that still takes the square off one corner:

- `wane` — millimetres of leftover live edge (default 20)

Derived picture:

- leftover labelled as a sketch (square / showing), not a mill sign-off
- leftover live edge labelled as a sketch
- square / no leftover live edge when wane ≤ 4 mm (the board looks square / no leftover bark)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: an elevation — a board whose leftover is the wane; leftover is how far the leftover live edge still takes the square off one corner
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover live edge that still takes the square off a board in an elevation, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer bevel as the hero, not an arris sharp, not a shim pack, not a ridge peak, not a fillet radius, not a clock
- seeded demo already shows a visible leftover (not a square board)
- live wane, leftover labelled as a sketch (square / showing)
- keyboard moves the focused control
- SVG text alternative names whether the wane is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/wane/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (elevation / one board / leftover wane) is in the DOM
- seeded leftover is visible (showing — not square)
- changing a control redraws and updates the readout
- no paste-well hero, no offcut stick as the hero, no grain fibres as the hero, no kerf gap, no chamfer bevel, no fillet radius, no arris sharp, no clock face

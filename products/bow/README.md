# Bow

A board looks straight until you see the bow. Move the arch. See the leftover length.

This is not Cup. Cup is leftover dish across the width. This is not Camber. Camber is leftover crown of a road. This is not Wire Sag. Wire Sag is leftover dip of a cable. This is not Wane. Wane is leftover live edge / bark. This is not Grain. Grain is leftover mismatch of the cut to the fibres. This is not Offcut. Offcut is leftover millimetres after placing cuts. This is not a paste well. This is not a clock. Bow answers “how far the leftover arch still stands along the length.”

## Problem

A board looks straight until you see the bow:

- how far does the leftover arch still stand along the length?
- is the leftover straight, or showing?
- when is the leftover length warp obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover dish that still warps a board across its width, leftover live edge that still takes the square off a board, leftover crown of a road, leftover dip of a cable, leftover tree-to-wire gap, leftover mismatch of the cut to the fibres, leftover millimetres of stock, leftover blade gap, leftover radius that still fills a concave corner, leftover bevel that still takes the sharp off, leftover sharp where two planes meet, leftover packing that still fills a gap, leftover peak where two roof planes meet, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, and leftover vault infill. They do not show leftover arch — how far a bow still warps a board along its length.

## Users

- people who already know a board can look straight until the leftover bow shows
- anyone who refuses to treat a cup, a camber, a sag, a wane, a grain, an offcut, a packed sky, or a clock as this leftover
- desks that want bow as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Cup, not Camber, not Wire Sag, not Wane, not Grain, not Offcut, not a paste well

## Workflow

1. Load the seed: 22 mm of leftover arch — already showing, not a straight board
2. Read the scene: one side-elevation, a board whose leftover is the bow, leftover labelled as a sketch
3. Move bow (or use the arrow keys on the focused slider); leftover names showing or straight
4. Drop the leftover toward 0 mm and the board looks straight / no leftover arch; raise it and the leftover arch still warps the board along its length
5. Reset restores the seeded leftover showing

## Data model

One side-elevation with leftover bow as leftover arch that still warps a board along its length:

- `bow` — millimetres of leftover arch (default 22)

Derived picture:

- leftover labelled as a sketch (straight / showing), not a mill sign-off
- leftover arch labelled as a sketch
- straight / no leftover arch when bow ≤ 4 mm (the board looks straight / no leftover length warp)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a side-elevation — a board whose leftover is the bow; leftover is how far the leftover arch still stands along the length
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover arch that still warps a board along its length in a side-elevation, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer bevel as the hero, not an arris sharp, not a shim pack, not a ridge peak, not a fillet radius, not a wane live edge, not a cup dish as the hero, not a clock
- seeded demo already shows a visible leftover (not a straight board)
- live bow, leftover labelled as a sketch (straight / showing)
- keyboard moves the focused control
- SVG text alternative names whether the bow is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/bow/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (side-elevation / one board / leftover bow) is in the DOM
- seeded leftover is visible (showing — not straight)
- changing a control redraws and updates the readout
- no paste-well hero, no cup dish as the hero, no camber road, no wire sag, no wane live edge, no grain fibres, no offcut stick, no clock face

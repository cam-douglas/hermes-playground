# Tenon

A board looks flush until you see the tenon. Move the tongue. See the leftover fit.

This is not Mortise. Mortise is leftover closed pocket that still opens in the face. This is not Dado. Dado is leftover housing groove across the grain. This is not Rabbet. Rabbet is leftover rebate along the edge. This is not Kerf. Kerf is what the blade removed — a cut gap. This is not a paste well. This is not a clock. Tenon answers “how far the leftover tongue still projects from the end.”

## Problem

A board looks flush until you see the tenon:

- how far does the leftover tongue still project from the end?
- is the leftover flush, or showing?
- when is the leftover fit obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover closed pocket that still opens in the face, leftover housing groove that still cuts across the grain, leftover rebate along the edge, leftover drying split that still opens along the face, leftover wind that still spirals one end of a board off the other, leftover dish that still warps a board across its width, leftover arch that still warps a board along its length, leftover live edge that still takes the square off a board, leftover mismatch of the cut to the fibres, leftover millimetres of stock, leftover blade gap, leftover radius that still fills a concave corner, leftover bevel that still takes the sharp off, leftover sharp where two planes meet, leftover packing that still fills a gap, leftover peak where two roof planes meet, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, and leftover vault infill. They do not show leftover tongue — how far a tenon still projects from the end of a board.

## Users

- people who already know a board can look flush until the leftover tenon shows
- anyone who refuses to treat a mortise, a dado, a rabbet, a kerf, a packed sky, or a clock as this leftover
- desks that want tenon as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Mortise, not Dado, not Rabbet, not Kerf, not a paste well

## Workflow

1. Load the seed: 20 mm of leftover tongue — already showing, not a flush end
2. Read the scene: one side and face, a board whose leftover is the tenon, leftover labelled as a sketch
3. Move tenon (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the leftover toward 0 mm and the board looks flush / no leftover tongue; raise it and the leftover tongue still projects from the end
5. Reset restores the seeded leftover showing

## Data model

One side/face with leftover tenon as leftover tongue that still projects from the end of a board:

- `tenon` — millimetres of leftover tongue projection (default 20)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a mill sign-off
- leftover tongue labelled as a sketch
- flush / no leftover tongue when tenon ≤ 4 mm (the board looks flush / no leftover fit)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a side and face — a board whose leftover is the tenon; leftover is how far the leftover tongue still projects from the end (a tongue, not a pocket)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover tongue that still projects from the end of a board in a side/face, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer bevel as the hero, not an arris sharp, not a shim pack, not a ridge peak, not a fillet radius, not a wane live edge, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a clock
- seeded demo already shows a visible leftover (not a flush end)
- live tenon, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether the tenon is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/tenon/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (side/face / one board / leftover tenon) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no mortise pocket as the hero, no dado through-groove as the hero, no rabbet edge-rebate as the hero, no kerf blade-gap as the hero, no clock face

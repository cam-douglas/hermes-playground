# Mortise

A board looks solid until you see the mortise. Move the pocket. See the leftover cavity.

This is not Dado. Dado is leftover housing groove across the grain. This is not Rabbet. Rabbet is leftover rebate along the edge. This is not Kerf. Kerf is what the blade removed — a cut gap. This is not Check. Check is leftover drying split that still opens along the face. This is not a tenon. Tenon is the leftover tongue that still fits a mortise. This is not a paste well. This is not a clock. Mortise answers “how deep the leftover closed pocket still opens in the face.”

## Problem

A board looks solid until you see the mortise:

- how deep does the leftover closed pocket still open in the face?
- is the leftover flush, or showing?
- when is the leftover cavity obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover housing groove that still cuts across the grain, leftover rebate along the edge, leftover drying split that still opens along the face, leftover wind that still spirals one end of a board off the other, leftover dish that still warps a board across its width, leftover arch that still warps a board along its length, leftover live edge that still takes the square off a board, leftover mismatch of the cut to the fibres, leftover millimetres of stock, leftover blade gap, leftover radius that still fills a concave corner, leftover bevel that still takes the sharp off, leftover sharp where two planes meet, leftover packing that still fills a gap, leftover peak where two roof planes meet, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, and leftover vault infill. They do not show leftover pocket — how deep a mortise still opens as a closed cavity in the face of a board.

## Users

- people who already know a board can look solid until the leftover mortise shows
- anyone who refuses to treat a dado, a rabbet, a kerf, a check, a tenon, a packed sky, or a clock as this leftover
- desks that want mortise as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Dado, not Rabbet, not Kerf, not Check, not a paste well

## Workflow

1. Load the seed: 18 mm of leftover pocket — already showing, not a solid / flush board
2. Read the scene: one face and section, a board whose leftover is the mortise, leftover labelled as a sketch
3. Move mortise (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the leftover toward 0 mm and the board looks solid / no leftover pocket; raise it and the leftover closed cavity still opens in the face
5. Reset restores the seeded leftover showing

## Data model

One face/section with leftover mortise as leftover pocket that still opens in a board:

- `mortise` — millimetres of leftover pocket depth (default 18)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a mill sign-off
- leftover pocket labelled as a sketch
- flush / no leftover pocket when mortise ≤ 4 mm (the board looks solid / no leftover cavity)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a face and section — a board whose leftover is the mortise; leftover is how deep the leftover closed pocket still opens in the face (a cavity, not a through-groove)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover closed pocket that still opens in a board in a face/section, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer bevel as the hero, not an arris sharp, not a shim pack, not a ridge peak, not a fillet radius, not a wane live edge, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a tenon tongue as the hero, not a clock
- seeded demo already shows a visible leftover (not a solid / flush board)
- live mortise, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether the mortise is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/mortise/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (face/section / one board / leftover mortise) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no dado through-groove as the hero, no rabbet edge-rebate as the hero, no kerf blade-gap as the hero, no check drying-split as the hero, no tenon tongue as the hero, no clock face

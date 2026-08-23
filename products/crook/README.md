# Crook

A board looks straight until you see the crook. Move the edge. See the leftover sweep.

This is not Bow. Bow is leftover arch along the length of the face. This is not Twist. Twist is leftover wind that still spirals one end off the other. This is not Cup. Cup is leftover dish across the width. This is not Knot. Knot is leftover dark that still sits in the grain. This is not Wane. Wane is leftover live edge / bark. This is not a paste well. This is not a clock. Crook answers “how far the leftover sweep still curves the edge in plan.”

## Problem

A board looks straight until you see the crook:

- how far does the leftover sweep still curve the edge in plan?
- is the leftover straight, or showing?
- when is the leftover sweep obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover arch that still warps a board along its length, leftover wind that still spirals one end of a board off the other, leftover dish that still warps a board across its width, leftover dark that still sits in the face as circular branch wood, leftover live edge that still takes the square off a board, leftover key that still sits between two boards as a separate slip, leftover tongue that still projects from the end, leftover closed pocket that still opens in the face, leftover housing groove that still cuts across the grain, leftover angle that still cuts the square meet, leftover rebate along the edge, leftover drying split that still opens along the face, leftover mismatch of the cut to the fibres, leftover millimetres of stock, leftover blade gap, leftover radius that still fills a concave corner, leftover bevel that still takes the sharp off, leftover sharp where two planes meet, leftover packing that still fills a gap, leftover peak where two roof planes meet, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover crook — how far the leftover sweep still curves the edge in plan as an edge-curve looking down on the board.

## Users

- people who already know a board can look straight until the leftover crook shows
- anyone who refuses to treat a bow length-arch, a twist wind, a cup dish, a knot dark, a wane live edge, a packed sky, or a clock as this leftover
- desks that want crook as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Bow, not Twist, not Cup, not a paste well

## Workflow

1. Load the seed: 20 mm of leftover crook — already showing, not a straight edge
2. Read the scene: one board in plan, a leftover whose leftover is the crook, leftover labelled as a sketch
3. Move crook (or use the arrow keys on the focused slider); leftover names showing or straight
4. Drop the leftover toward 0 mm and the board looks straight / no leftover crook; raise it and the leftover sweep still curves the edge in plan
5. Reset restores the seeded leftover showing

## Data model

One board in plan with leftover crook as leftover sweep that still curves the edge looking down:

- `crook` — millimetres of leftover sweep showing (default 20)

Derived picture:

- leftover labelled as a sketch (straight / showing), not a mill sign-off
- leftover sweep labelled as a sketch
- straight / no leftover crook when crook ≤ 4 mm (the board looks straight / no leftover sweep)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board in plan — a leftover whose leftover is the crook; leftover is how far the leftover sweep still curves the edge in plan (an edge-curve looking down, not a face-arch, not a spiral, not a dish)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover sweep that still curves the edge of one board in plan, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a clock
- seeded demo already shows a visible leftover (not a straight edge)
- live crook, leftover labelled as a sketch (straight / showing)
- keyboard moves the focused control
- SVG text alternative names whether the crook is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/crook/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (plan / one board / leftover crook) is in the DOM
- seeded leftover is visible (showing — not straight)
- changing a control redraws and updates the readout
- no paste-well hero, no bow length-arch as the hero, no twist wind as the hero, no cup dish as the hero, no knot dark as the hero, no wane bark as the hero, no kerf blade-gap as the hero, no clock face

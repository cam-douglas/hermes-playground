# Mitre

A joint looks square until you see the mitre. Move the angle. See the leftover meet.

This is not Scarf. Scarf is leftover overlap along the length. This is not Chamfer. Chamfer is leftover bevel that takes the sharp off one edge. This is not Tenon. Tenon is leftover tongue. This is not Mortise. Mortise is leftover pocket. This is not Dado. This is not Rabbet. This is not Kerf. This is not a paste well. This is not a clock. Mitre answers “how far the leftover angle still cuts the square meet.”

## Problem

A joint looks square until you see the mitre:

- how far does the leftover angle still cut the square meet of two boards?
- is the leftover square, or showing?
- when is the leftover meet obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover tongue that still projects from the end, leftover closed pocket that still opens in the face, leftover housing groove that still cuts across the grain, leftover rebate along the edge, leftover drying split that still opens along the face, leftover wind that still spirals one end of a board off the other, leftover dish that still warps a board across its width, leftover arch that still warps a board along its length, leftover live edge that still takes the square off a board, leftover mismatch of the cut to the fibres, leftover millimetres of stock, leftover blade gap, leftover radius that still fills a concave corner, leftover bevel that still takes the sharp off, leftover sharp where two planes meet, leftover packing that still fills a gap, leftover peak where two roof planes meet, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover mitre — how far the leftover angle still cuts the square meet of two boards.

## Users

- people who already know a joint can look square until the leftover mitre shows
- anyone who refuses to treat a scarf, a chamfer, a tenon, a mortise, a dado, a packed sky, or a clock as this leftover
- desks that want mitre as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Scarf, not Chamfer, not Tenon, not Mortise, not a paste well

## Workflow

1. Load the seed: 45° of leftover mitre — already showing, classic mitre, not a square butt
2. Read the scene: two boards in plan, a corner whose leftover is the mitre, leftover labelled as a sketch
3. Move mitre (or use the arrow keys on the focused slider); leftover names showing or square
4. Drop the leftover toward 0° and the joint looks square / no leftover mitre; raise it and the leftover angle still cuts the square meet
5. Reset restores the seeded leftover showing

## Data model

Two boards in plan with leftover mitre as leftover angle that still cuts the square meet:

- `mitre` — degrees of leftover angle from square (default 45)

Derived picture:

- leftover labelled as a sketch (square / showing), not a mill sign-off
- leftover meet labelled as a sketch
- square / no leftover mitre when mitre ≤ 2° (the joint looks square / no leftover meet)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: two boards in plan — a corner whose leftover is the mitre; leftover is how far the leftover angle still cuts the square meet (an angle, not a tongue, not a pocket, not a scarf overlap)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover angle that still meets two cuts of two boards in plan, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack, not a ridge peak, not a fillet radius, not a wane live edge, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a clock
- seeded demo already shows a visible leftover (not a square butt)
- live mitre, leftover labelled as a sketch (square / showing)
- keyboard moves the focused control
- SVG text alternative names whether the mitre is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/mitre/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (plan / two boards / leftover mitre) is in the DOM
- seeded leftover is visible (showing — not square)
- changing a control redraws and updates the readout
- no paste-well hero, no scarf overlap as the hero, no chamfer single-edge bevel as the hero, no tenon tongue as the hero, no mortise pocket as the hero, no dado through-groove as the hero, no rabbet edge-rebate as the hero, no kerf blade-gap as the hero, no clock face

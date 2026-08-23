# Spline

A joint looks closed until you see the spline. Move the key. See the leftover slip.

This is not Tenon. Tenon is leftover tongue cut from the board itself. This is not Mortise. Mortise is leftover pocket. This is not Dado. Dado is leftover housing groove across the grain. This is not Mitre. Mitre is leftover angle that still meets two cuts. This is not Scarf. Scarf is leftover overlap along the length. This is not Shim. Shim is leftover packing that still fills a gap. This is not Kerf. This is not a paste well. This is not a clock. Spline answers “how far the leftover key still sits between two boards.”

## Problem

A joint looks closed until you see the spline:

- how far does the leftover key still sit between two boards?
- is the leftover closed, or showing?
- when is the leftover slip obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover tongue that still projects from the end, leftover closed pocket that still opens in the face, leftover housing groove that still cuts across the grain, leftover angle that still cuts the square meet, leftover rebate along the edge, leftover drying split that still opens along the face, leftover wind that still spirals one end of a board off the other, leftover dish that still warps a board across its width, leftover arch that still warps a board along its length, leftover live edge that still takes the square off a board, leftover mismatch of the cut to the fibres, leftover millimetres of stock, leftover blade gap, leftover radius that still fills a concave corner, leftover bevel that still takes the sharp off, leftover sharp where two planes meet, leftover packing that still fills a gap, leftover peak where two roof planes meet, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover spline — how far the leftover key still sits between two boards as a separate slip.

## Users

- people who already know a joint can look closed until the leftover spline shows
- anyone who refuses to treat a tenon, a mortise, a dado, a mitre, a scarf, a shim, a packed sky, or a clock as this leftover
- desks that want spline as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Tenon, not Mortise, not Dado, not Mitre, not a paste well

## Workflow

1. Load the seed: 20 mm of leftover spline — already showing, not a closed joint
2. Read the scene: two boards in plan, a joint whose leftover is the spline, leftover labelled as a sketch
3. Move spline (or use the arrow keys on the focused slider); leftover names showing or closed
4. Drop the leftover toward 0 mm and the joint looks closed / no leftover spline; raise it and the leftover key still sits between two boards
5. Reset restores the seeded leftover showing

## Data model

Two boards in plan with leftover spline as leftover key that still sits between them:

- `spline` — millimetres of leftover key showing (default 20)

Derived picture:

- leftover labelled as a sketch (closed / showing), not a mill sign-off
- leftover key labelled as a sketch
- closed / no leftover spline when spline ≤ 4 mm (the joint looks closed / no leftover key)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: two boards in plan — a joint whose leftover is the spline; leftover is how far the leftover key still sits between them (a separate slip, not a tongue cut from one board, not a pocket, not a through groove, not a mitre angle)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover key that still joins two grooves of two boards in plan, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius, not a wane live edge, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a clock
- seeded demo already shows a visible leftover (not a closed joint)
- live spline, leftover labelled as a sketch (closed / showing)
- keyboard moves the focused control
- SVG text alternative names whether the spline is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/spline/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (plan / two boards / leftover spline) is in the DOM
- seeded leftover is visible (showing — not closed)
- changing a control redraws and updates the readout
- no paste-well hero, no tenon tongue as the hero, no mortise pocket as the hero, no dado through-groove as the hero, no mitre angle as the hero, no scarf overlap as the hero, no shim pack as the hero, no kerf blade-gap as the hero, no clock face

# Dovetail

A corner looks closed until you see the dovetail. Move the tail. See the leftover tails.

This is not Tenon. Tenon is leftover rectangular tongue that still projects from the end. This is not Mortise. Mortise is leftover rectangular pocket that still opens in the face. This is not Spline. Spline is leftover thin rectangular key that still sits between two grooves. This is not Dowel. Dowel is leftover round pin that still joins two faces. This is not Mitre. Mitre is leftover 45° angle that still cuts the square meet. This is not Inlay. Inlay is leftover contrasting piece set into a cut recess. This is not Dado. Dado is leftover through-groove that still cuts across the grain. This is not Pith. Pith is leftover spongy first-year center that still sits in the core. This is not a finger or box joint — those leftover tabs are square, not flared. This is not a paste well. This is not a clock. Dovetail answers “how much leftover interlocking flared tail still sits in the corner.”

## Problem

A corner looks closed until you see the dovetail:

- how much leftover flared interlocking tail still sits in the corner?
- is the leftover square, or showing?
- when is the leftover dovetail obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover rectangular tongue that still projects from the end, leftover rectangular pocket that still opens in the face, leftover thin key that still sits between two grooves, leftover round pin that still joins two faces, leftover 45° angle that still cuts the square meet, leftover contrasting piece still sitting in a cut recess, leftover housing groove that still cuts across the grain, leftover spongy first-year center still sitting in the core, leftover millimetres of stock, leftover blade gap, leftover paper creases, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover dovetail — leftover flared interlocking tails still sitting in a corner joint, not a rectangular tenon tongue, not a mortise pocket, not a thin spline key, not a round dowel pin, not a 45° mitre cut, not an inlay piece, not a through-groove, not a square-tab finger joint.

## Users

- people who already know a corner can look closed until the leftover flared interlocking tails show in the joint
- anyone who refuses to treat a rectangular tenon, a mortise pocket, a thin spline, a round dowel, a 45° mitre, an inlay piece, a dado groove, pith in the core, a packed sky, or a clock as this leftover
- desks that want dovetail as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Tenon, not Mortise, not Spline, not Dowel, not Mitre, not Inlay, not Dado, not Pith, not a paste well

## Workflow

1. Load the seed: 26 mm of leftover tail — already showing, not a square-only corner
2. Read the scene: one corner of two members, a leftover whose leftover is the dovetail, leftover labelled as a sketch
3. Move dovetail (or use the arrow keys on the focused slider); leftover names showing or square
4. Drop the leftover toward 0 mm and the corner looks square / no leftover dovetail; raise it and wider leftover flared tails still sit in the corner
5. Reset restores the seeded leftover showing

## Data model

One corner joint of two members with leftover dovetail as leftover flared interlocking tails that still sit in the corner:

- `dovetail` — millimetres of leftover flared tail showing (default 26)

Derived picture:

- leftover labelled as a sketch (square / showing), not a mill sign-off
- leftover tails labelled as a sketch
- square / no leftover dovetail when tail ≤ 4 mm (the corner looks like a square butt)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one corner of two members — a leftover whose leftover is the dovetail; leftover is leftover flared interlocking tails still sitting in the corner (not a rectangular tenon tongue, not a mortise pocket, not a thin spline key, not a round dowel pin, not a 45° mitre cut, not an inlay piece)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover flared interlocking tails still sitting in one corner joint of two members, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a batten cover as the hero, not a dowel pin as the hero, not a flute hollow as the hero, not an inlay piece as the hero, not pecky cavities as the hero, not a cambium layer as the hero, not a pith center as the hero, not square-tab finger joints as the hero, not a banding strip as the hero, not a clock
- seeded demo already shows a visible leftover (not a square-only corner)
- live dovetail, leftover labelled as a sketch (square / showing)
- keyboard moves the focused control
- SVG text alternative names whether the dovetail is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/dovetail/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (corner / two members / leftover dovetail) is in the DOM
- seeded leftover is visible (showing — not square)
- changing a control redraws and updates the readout
- no paste-well hero, no rectangular tenon tongue as the hero, no mortise pocket as the hero, no thin spline key as the hero, no round dowel pin as the hero, no 45° mitre as the hero, no inlay piece as the hero, no dado through-groove as the hero, no pith center as the hero, no square-tab finger joint as the hero, no clock face

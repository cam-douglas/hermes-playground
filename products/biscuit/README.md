# Biscuit

An edge looks closed until you see the biscuit. Move the wafer. See the leftover slot.

This is not Spline. Spline is leftover thin continuous key that still sits between two grooves. This is not Dowel. Dowel is leftover round pin that still sits through the join. This is not Dovetail. Dovetail is leftover flared interlocking tails that still sit in the corner. This is not Tenon. Tenon is leftover rectangular tongue that still projects from the end. This is not Mortise. Mortise is leftover rectangular pocket that still opens in the face. This is not Inlay. Inlay is leftover contrasting set piece that still sits in the recess. This is not Dado. Dado is leftover through-groove that still cuts across the grain. This is not Snipe. Snipe is leftover end-dip that still sits at the trailing end of a pass. This is not a cut-list. This is not a paste well. This is not a clock. Biscuit answers “how much leftover oval wafer still sits in the shallow edge slot.”

## Problem

An edge looks closed until you see the biscuit:

- how much leftover compressed-wood wafer still sits in the shallow slot?
- is the leftover butt, or showing?
- when is the leftover biscuit obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover thin continuous key that still sits between two grooves, leftover round pin that still sits through the join, leftover flared interlocking tails that still sit in the corner, leftover rectangular tongue that still projects from the end, leftover rectangular pocket that still opens in the face, leftover contrasting set piece that still sits in the recess, leftover through-groove that still cuts across the grain, leftover end-dip that still sits at the trailing end of a pass, leftover millimetres of stock, leftover paper creases, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover biscuit — leftover compressed-wood oval wafer still sitting in a shallow edge slot, not a spline key, not a dowel pin, not interlocking tails, not a tenon tongue, not a mortise pocket, not an inlay piece, not a dado groove, not a snipe dip.

## Users

- people who already know an edge can look closed until the leftover oval wafer shows in the slot
- anyone who refuses to treat a spline key, a dowel pin, interlocking tails, a tenon tongue, a mortise pocket, an inlay piece, a dado groove, a snipe dip, a packed sky, or a clock as this leftover
- desks that want biscuit as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Spline, not Dowel, not Dovetail, not Tenon, not Mortise, not Inlay, not Dado, not Snipe, not a paste well

## Workflow

1. Load the seed: 28 mm of leftover oval wafer — already showing, not a butt-only edge
2. Read the scene: two members edge-to-edge, a leftover whose leftover is the biscuit, leftover labelled as a sketch
3. Move leftover biscuit (or use the arrow keys on the focused slider); leftover names showing or butt
4. Drop the leftover toward 0 mm and the edge looks like a plain butt / no leftover biscuit; raise it and a longer leftover oval wafer still sits in the slot
5. Reset restores the seeded leftover showing

## Data model

Two members meeting edge-to-edge with leftover biscuit as leftover oval wafer that still sits in the shallow slot:

- `biscuit` — millimetres of leftover oval wafer showing (default 28)

Derived picture:

- leftover labelled as a sketch (butt / showing), not a mill sign-off
- leftover wafer labelled as a sketch
- butt / no leftover biscuit when wafer ≤ 4 mm (the edge looks like a plain butt, no wafer in the slot)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: two members edge-to-edge — a leftover whose leftover is the biscuit; leftover is leftover compressed-wood oval wafer still sitting in a shallow edge slot (not a thin continuous spline key, not a round dowel pin, not flared dovetail tails, not a rectangular tenon tongue, not a mortise pocket, not an inlay piece)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover compressed-wood oval wafer still sitting in a shallow slot of one edge joint, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a batten cover as the hero, not a dowel pin as the hero, not a flute hollow as the hero, not an inlay piece as the hero, not pecky cavities as the hero, not a cambium layer as the hero, not a pith center as the hero, not interlocking tails as the hero, not a snipe dip as the hero, not a cut-list as the hero, not an offcut as the hero, not a clock
- seeded demo already shows a visible leftover (not a butt-only edge)
- live leftover biscuit, leftover labelled as a sketch (butt / showing)
- keyboard moves the focused control
- SVG text alternative names whether the biscuit is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/biscuit/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (plan / two members / leftover biscuit) is in the DOM
- seeded leftover is visible (showing — not butt)
- changing a control redraws and updates the readout
- no paste-well hero, no spline key as the hero, no dowel pin as the hero, no interlocking tails as the hero, no tenon tongue as the hero, no mortise pocket as the hero, no inlay piece as the hero, no dado groove as the hero, no snipe dip as the hero, no clock face

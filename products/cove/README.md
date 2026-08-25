# Cove

A board looks flat until you see the cove. Move the scoop. See the leftover hollow.

This is not Flute. Flute is leftover parallel hollows that still sit along a length. This is not Fillet. Fillet is leftover convex radius that still fills a concave corner. This is not Chamfer. Chamfer is leftover bevel that still takes the sharp off a corner. This is not Bead. Bead is leftover round that still sits on an edge. This is not Coping. Coping is leftover scribed nest that still sits against a molding. This is not Snipe. Snipe is leftover dip that still sits at the trailing end of a pass. This is not Cup. Cup is leftover dish that still warps across the width. This is not a cut-list. This is not a paste well. This is not a clock. Cove answers “how much leftover concave scoop still sits across the face.”

## Problem

A board looks flat until you see the cove:

- how much leftover table-saw scoop still sits across the face?
- is the leftover flat, or showing?
- when is the leftover cove obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover parallel hollows that still sit along a length, leftover convex radius that still fills a concave corner, leftover bevel that still takes the sharp off a corner, leftover round that still sits on an edge, leftover scribed nest that still sits against a molding, leftover dip that still sits at the trailing end of a pass, leftover dish that still warps across the width, leftover millimetres of stock, leftover paper creases, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover cove — leftover concave hollow still sitting as a scoop across the face, leftover table-saw cove still sitting in the board, not flute grooves along a length, not a fillet radius, not a chamfer bevel, not a bead round, not a coped nest, not a snipe dip.

## Users

- people who already know a board can look flat until the leftover concave scoop shows across the face
- anyone who refuses to treat flute grooves, a fillet radius, a chamfer bevel, a bead round, a coped nest, a snipe dip, a packed sky, or a clock as this leftover
- desks that want cove as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Flute, not Fillet, not Chamfer, not Bead, not Coping, not Snipe, not a paste well

## Workflow

1. Load the seed: 28 mm of leftover scoop — already showing, not a flat-only face
2. Read the scene: one board in face/side, a leftover whose leftover is the cove, leftover labelled as a sketch
3. Move leftover cove (or use the arrow keys on the focused slider); leftover names showing or flat
4. Drop the leftover toward 0 mm and the face looks flat / no leftover cove; raise it and a deeper leftover scoop still sits across the face
5. Reset restores the seeded leftover showing

## Data model

One board in face/side with leftover cove as leftover concave scoop that still sits across the face:

- `cove` — millimetres of leftover scoop showing (default 28)

Derived picture:

- leftover labelled as a sketch (flat / showing), not a mill sign-off
- leftover scoop labelled as a sketch
- flat / no leftover cove when scoop ≤ 4 mm (the face looks flat, no scoop)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board in face/side — a leftover whose leftover is the cove; leftover is leftover concave hollow still sitting as a scoop across the face (not parallel flute grooves along a length, not a convex fillet radius, not a chamfer bevel, not a round bead, not a coped inside-corner nest)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover table-saw cove still sitting as a concave scoop across the face of one board in face/side, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a batten cover as the hero, not a dowel pin as the hero, not a flute hollow as the hero, not an inlay piece as the hero, not pecky cavities as the hero, not a cambium layer as the hero, not a pith center as the hero, not interlocking tails as the hero, not a snipe dip as the hero, not a biscuit wafer as the hero, not a bowtie patch as the hero, not a coping nest as the hero, not a cut-list as the hero, not an offcut as the hero, not a clock
- seeded demo already shows a visible leftover (not a flat-only face)
- live leftover cove, leftover labelled as a sketch (flat / showing)
- keyboard moves the focused control
- SVG text alternative names whether the cove is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/cove/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (face / side / one board / leftover cove) is in the DOM
- seeded leftover is visible (showing — not flat)
- changing a control redraws and updates the readout
- no paste-well hero, no flute grooves as the hero, no fillet radius as the hero, no chamfer bevel as the hero, no bead round as the hero, no coped nest as the hero, no snipe dip as the hero, no clock face

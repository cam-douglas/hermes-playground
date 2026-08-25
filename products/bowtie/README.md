# Bowtie

A split looks open until you see the bowtie. Move the patch. See the leftover lock.

This is not Spline. Spline is leftover thin continuous key that still sits between two grooves in an edge slot. This is not Inlay. Inlay is leftover contrasting set piece that still sits in a cut recess. This is not Check. Check is leftover linear drying split with nothing sitting across it. This is not Biscuit. Biscuit is leftover oval wafer that still sits in a shallow edge slot. This is not Dovetail. Dovetail is leftover flared interlocking tails that still sit in the corner. This is not Snipe. Snipe is leftover end-dip that still sits at the trailing end of a pass. This is not Dutchman as a clone of inlay — a decorative set piece in a recess is Inlay; Bowtie is leftover keyed hourglass patch still sitting across a face split. This is not a cut-list. This is not a paste well. This is not a clock. Bowtie answers “how much leftover keyed patch still sits across the face split.”

## Problem

A split looks open until you see the bowtie:

- how much leftover keyed hourglass patch still sits across the face split?
- is the leftover open, or showing?
- when is the leftover bowtie obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover thin continuous key that still sits between two grooves, leftover contrasting set piece that still sits in a recess, leftover linear drying split with nothing sitting across it, leftover oval wafer that still sits in a shallow edge slot, leftover flared interlocking tails that still sit in the corner, leftover end-dip that still sits at the trailing end of a pass, leftover millimetres of stock, leftover paper creases, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover bowtie — leftover butterfly/bowtie key still sitting as an hourglass patch across a face split, not a spline key, not an inlay piece, not an open check, not a biscuit wafer, not interlocking tails, not a snipe dip, not Dutchman as a clone of inlay.

## Users

- people who already know a split can look open until the leftover keyed hourglass patch shows across it
- anyone who refuses to treat a spline key, an inlay piece, an open check, a biscuit wafer, interlocking tails, a snipe dip, a dutchman clone of inlay, a packed sky, or a clock as this leftover
- desks that want bowtie as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Spline, not Inlay, not Check, not Biscuit, not Dovetail, not Snipe, not Dutchman-as-inlay, not a paste well

## Workflow

1. Load the seed: 30 mm of leftover keyed hourglass patch — already showing, not an open-only split
2. Read the scene: one board in face, a leftover whose leftover is the bowtie, leftover labelled as a sketch
3. Move leftover bowtie (or use the arrow keys on the focused slider); leftover names showing or open
4. Drop the leftover toward 0 mm and the split looks open / no leftover bowtie; raise it and a larger leftover hourglass patch still sits across the split
5. Reset restores the seeded leftover showing

## Data model

One board in face with leftover bowtie as leftover keyed hourglass patch that still sits across the split:

- `bowtie` — millimetres of leftover keyed patch showing (default 30)

Derived picture:

- leftover labelled as a sketch (open / showing), not a mill sign-off
- leftover patch labelled as a sketch
- open / no leftover bowtie when patch ≤ 4 mm (the split looks open, no keyed patch sitting across it)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board in face — a leftover whose leftover is the bowtie; leftover is leftover butterfly/bowtie key still sitting as an hourglass patch across a face split (not a thin continuous spline in an edge slot, not a decorative inlay in a cut recess, not a linear drying check with nothing sitting across it, not an oval biscuit wafer, not flared dovetail tails)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover keyed hourglass patch still sitting across a split in one board face, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a batten cover as the hero, not a dowel pin as the hero, not a flute hollow as the hero, not an inlay piece as the hero, not pecky cavities as the hero, not a cambium layer as the hero, not a pith center as the hero, not interlocking tails as the hero, not a snipe dip as the hero, not a biscuit wafer as the hero, not a cut-list as the hero, not an offcut as the hero, not a clock
- seeded demo already shows a visible leftover (not an open-only split)
- live leftover bowtie, leftover labelled as a sketch (open / showing)
- keyboard moves the focused control
- SVG text alternative names whether the bowtie is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/bowtie/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (face / one board / leftover bowtie) is in the DOM
- seeded leftover is visible (showing — not open)
- changing a control redraws and updates the readout
- no paste-well hero, no spline key as the hero, no inlay piece as the hero, no open check as the hero, no biscuit wafer as the hero, no interlocking tails as the hero, no snipe dip as the hero, no clock face

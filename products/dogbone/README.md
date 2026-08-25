# Dogbone

A corner looks tight until you see the dogbone. Move the relief. See the leftover round.

This is not Finger. Finger is leftover interlocking tabs that still sit along an edge. This is not Fillet. Fillet is leftover convex radius that still fills a concave corner. This is not Mortise. Mortise is leftover closed pocket that still opens in a face. This is not Chamfer. Chamfer is leftover bevel that still takes the sharp off a corner. This is not Cove. Cove is leftover concave scoop that still sits across a face. This is not a cut-list. This is not a paste well. This is not a clock. Dogbone answers “how much leftover round relief still sits in the corner.”

## Problem

A corner looks tight until you see the dogbone:

- how much leftover round CNC relief still sits in the inside square?
- is the leftover tight, or showing?
- when is the leftover dogbone obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover interlocking tabs that still sit along an edge, leftover convex radius that still fills a concave corner, leftover closed pockets that still open in a face, leftover bevel that still takes the sharp off a corner, leftover concave scoops that still sit across a face, leftover millimetres of stock, leftover paper creases, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover dogbone — leftover round CNC corner still sitting as a relief in an inside square, leftover dogbone still sitting in the corner, not finger tabs along an edge, not a fillet radius, not a mortise pocket, not a chamfer bevel, not a cove scoop.

## Users

- people who already know a corner can look tight until the leftover round shows in the inside square
- anyone who refuses to treat finger tabs along an edge, a fillet radius, a mortise pocket, a chamfer bevel, a cove scoop, a packed sky, or a clock as this leftover
- desks that want dogbone as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Finger, not Fillet, not Mortise, not Chamfer, not Cove, not a paste well

## Workflow

1. Load the seed: 16 mm of leftover relief — already showing, not a tight-only corner
2. Read the scene: one inside corner, a leftover whose leftover is the dogbone, leftover labelled as a sketch
3. Move leftover dogbone (or use the arrow keys on the focused slider); leftover names showing or tight
4. Drop the leftover toward 0 mm and the inside corner looks tight / no leftover dogbone; raise it and a larger leftover round still sits in the corner
5. Reset restores the seeded leftover showing

## Data model

One inside corner with leftover dogbone as leftover round relief that still sits in the corner:

- `dogbone` — millimetres of leftover relief (default 16)

Derived picture:

- leftover labelled as a sketch (tight / showing), not a mill sign-off
- leftover relief labelled as a sketch
- tight / no leftover dogbone when relief ≤ 4 mm (the inside corner looks tight, no leftover round)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one inside corner — a leftover whose leftover is the dogbone; leftover is leftover round CNC corner still sitting as a relief in an inside square (not finger tabs along an edge, not a convex fillet radius at a joint, not a mortise pocket in a face, not a chamfer bevel, not a cove scoop in a face)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover round CNC relief still sitting in one inside square corner, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a batten cover as the hero, not a dowel pin as the hero, not a flute hollow as the hero, not an inlay piece as the hero, not pecky cavities as the hero, not a cambium layer as the hero, not a pith center as the hero, not interlocking tails as the hero, not a snipe dip as the hero, not a biscuit wafer as the hero, not a bowtie patch as the hero, not a coping nest as the hero, not a cove scoop as the hero, not a bridle fork as the hero, not finger tabs as the hero, not a cut-list as the hero, not an offcut as the hero, not a clock
- seeded demo already shows a visible leftover (not a tight-only corner)
- live leftover dogbone, leftover labelled as a sketch (tight / showing)
- keyboard moves the focused control
- SVG text alternative names whether the dogbone is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/dogbone/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (inside corner / one square / leftover dogbone) is in the DOM
- seeded leftover is visible (showing — not tight)
- changing a control redraws and updates the readout
- no paste-well hero, no finger tabs as the hero, no fillet radius as the hero, no mortise pocket as the hero, no chamfer bevel as the hero, no cove scoop as the hero, no clock face

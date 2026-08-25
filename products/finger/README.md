# Finger

A board looks plain until you see the finger. Move the tabs. See the leftover edge.

This is not Dovetail. Dovetail is leftover flared tails that still lock a corner. This is not Bridle. Bridle is leftover open fork that still sits at the end. This is not Tenon. Tenon is leftover tongue that still projects from a mate. This is not Biscuit. Biscuit is leftover oval wafer that still sits in a slot. This is not Bowtie. Bowtie is leftover keyed patch that still sits across a split. This is not Cove. Cove is leftover concave scoop that still sits across a face. This is not Coping. Coping is leftover scribed nest that still sits against a molding. This is not a cut-list. This is not a paste well. This is not a clock. Finger answers “how much leftover interlocking tab still sits along the edge.”

## Problem

A board looks plain until you see the finger:

- how much leftover interlocking tab still sits along the edge?
- is the leftover plain, or showing?
- when is the leftover finger obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover flared tails that still lock a corner, leftover open forks that still sit at the end, leftover tongues that still project from a mate, leftover oval wafers that still sit in a slot, leftover keyed patches that still sit across a split, leftover concave scoops that still sit across a face, leftover scribed nests that still sit against a molding, leftover millimetres of stock, leftover paper creases, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover finger — leftover interlocking box-joint tabs still sitting along the edge, leftover finger still sitting at the edge, not flared dovetail tails, not a bridle fork at an end, not a tenon tongue on a mate, not a biscuit wafer in a slot, not a bowtie keyed patch across a split.

## Users

- people who already know a board can look plain until the leftover interlocking tabs show at the edge
- anyone who refuses to treat flared dovetail tails, a bridle fork at an end, a tenon tongue, a biscuit wafer, a bowtie patch, a packed sky, or a clock as this leftover
- desks that want finger as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Dovetail, not Bridle, not Tenon, not Biscuit, not Bowtie, not a paste well

## Workflow

1. Load the seed: 24 mm of leftover tab — already showing, not a plain-only edge
2. Read the scene: one board in edge/side, a leftover whose leftover is the finger, leftover labelled as a sketch
3. Move leftover finger (or use the arrow keys on the focused slider); leftover names showing or plain
4. Drop the leftover toward 0 mm and the edge looks plain / no leftover finger; raise it and longer leftover tabs still sit at the edge
5. Reset restores the seeded leftover showing

## Data model

One board in edge/side with leftover finger as leftover interlocking tabs that still sit along the edge:

- `finger` — millimetres of leftover tab length (default 24)

Derived picture:

- leftover labelled as a sketch (plain / showing), not a mill sign-off
- leftover tabs labelled as a sketch
- plain / no leftover finger when tab length ≤ 4 mm (the edge looks plain, no tabs)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board in edge/side — a leftover whose leftover is the finger; leftover is leftover interlocking box-joint tabs still sitting along the edge (not flared dovetail tails, not a bridle fork at an end, not a tenon tongue projecting from a mate, not a biscuit wafer in a slot, not a bowtie keyed patch across a split)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover interlocking box-joint tabs still sitting along the edge of one board in edge/side, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a batten cover as the hero, not a dowel pin as the hero, not a flute hollow as the hero, not an inlay piece as the hero, not pecky cavities as the hero, not a cambium layer as the hero, not a pith center as the hero, not interlocking tails as the hero, not a snipe dip as the hero, not a biscuit wafer as the hero, not a bowtie patch as the hero, not a coping nest as the hero, not a cove scoop as the hero, not a bridle fork as the hero, not a cut-list as the hero, not an offcut as the hero, not a clock
- seeded demo already shows a visible leftover (not a plain-only edge)
- live leftover finger, leftover labelled as a sketch (plain / showing)
- keyboard moves the focused control
- SVG text alternative names whether the finger is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/finger/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (edge / side / one board / leftover finger) is in the DOM
- seeded leftover is visible (showing — not plain)
- changing a control redraws and updates the readout
- no paste-well hero, no flared dovetail tails as the hero, no bridle fork as the hero, no tenon tongue as the hero, no biscuit wafer as the hero, no bowtie patch as the hero, no clock face

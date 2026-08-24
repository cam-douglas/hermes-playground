# Cambium

A board looks woody until you see the cambium. Move the layer. See the leftover skin.

This is not Sap. Sap is leftover pale sapwood band along the edge of a heartwood face. This is not Wane. Wane is leftover irregular live edge / bark remaining on the board. This is not Heart. Heart is leftover darker heartwood core down the middle. This is not Pecky. Pecky is leftover irregular fungal decay cavities still sitting in the face. This is not Inlay. Inlay is leftover contrasting piece set into a cut recess. This is not Pitch. Pitch is leftover resin / gum pocket occupying a hole. This is not Check. Check is leftover linear drying split still opening along the face. This is not Flute. Flute is leftover parallel concave hollows along the length. This is not Fold Sheet. Fold Sheet is leftover paper creases. This is not pith as a clone of heart. This is not latewood as a clone of ring. This is not a paste well. This is not a clock. Cambium answers “how much leftover living layer still sits under the bark.”

## Problem

A board looks woody until you see the cambium:

- how much leftover thin living skin still sits under leftover bark at the edge?
- is the leftover bare, or showing?
- when is the leftover cambium obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover pale that still bands the face as a sapwood stripe, leftover irregular live edge that still takes the square off a board, leftover darker inner that still occupies the core, leftover irregular fungal decay cavities still sitting in the face, leftover contrasting piece still sitting in a cut recess, leftover resin that still sits in the face as a gum pocket, leftover linear drying split that still opens along the face, leftover parallel concave hollows along the length, leftover millimetres of stock, leftover blade gap, leftover paper creases, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover cambium — leftover thin living skin still sitting under leftover bark at the edge of a face (leftover living layer between bark and wood), not a pale sapwood stripe, not irregular wane/bark remaining as the edge, not a heartwood core, not pecky cavities, not an inlay piece, not a paper fold-sheet.

## Users

- people who already know a board can look woody until the leftover living layer shows under leftover bark at the edge
- anyone who refuses to treat a sap pale band, a wane live edge, a heartwood core, pecky cavities, an inlay piece, a packed sky, or a clock as this leftover
- desks that want cambium as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Sap, not Wane, not Heart, not Pecky, not Inlay, not a paste well

## Workflow

1. Load the seed: 24 mm of leftover cambium — already showing, not a woody/bare-only edge
2. Read the scene: one board in face/section at the edge, a leftover whose leftover is the cambium, leftover labelled as a sketch
3. Move cambium (or use the arrow keys on the focused slider); leftover names showing or bare
4. Drop the leftover toward 0 mm and the edge looks woody / bare / no leftover cambium; raise it and a thicker leftover living layer still sits under leftover bark at the edge
5. Reset restores the seeded leftover showing

## Data model

One board in face/section at the edge with leftover cambium as leftover living layer that still sits under leftover bark:

- `cambium` — millimetres of leftover living layer showing (default 24)

Derived picture:

- leftover labelled as a sketch (bare / showing), not a mill sign-off
- leftover layer labelled as a sketch
- bare / no leftover cambium when cambium ≤ 4 mm (the edge looks woody throughout)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board in face/section at the edge — a leftover whose leftover is the cambium; leftover is leftover thin living skin still sitting under leftover bark at the edge (not a pale sapwood stripe, not irregular wane/bark remaining as the edge, not a heartwood core, not pecky cavities, not an inlay piece)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover thin living skin still sitting under leftover bark at the edge of one board, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a batten cover as the hero, not a dowel pin as the hero, not a flute hollow as the hero, not an inlay piece as the hero, not pecky cavities as the hero, not a banding strip as the hero, not a clock
- seeded demo already shows a visible leftover (not a woody/bare-only edge)
- live cambium, leftover labelled as a sketch (bare / showing)
- keyboard moves the focused control
- SVG text alternative names whether the cambium is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/cambium/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (face/section at the edge / leftover cambium) is in the DOM
- seeded leftover is visible (showing — not bare)
- changing a control redraws and updates the readout
- no paste-well hero, no sap pale band as the hero, no wane live edge as the hero, no heartwood core as the hero, no pecky cavities as the hero, no inlay piece as the hero, no clock face

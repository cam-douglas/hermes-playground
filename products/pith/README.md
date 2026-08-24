# Pith

A board looks solid until you see the pith. Move the center. See the leftover pith.

This is not Heart. Heart is leftover darker heartwood zone occupying the core as a band. This is not Knot. Knot is leftover circular dark of branch wood. This is not Cambium. Cambium is leftover living layer still sitting under bark at the edge. This is not Ring. Ring is leftover year-band still sitting in the face. This is not Pecky. Pecky is leftover irregular fungal decay cavities still sitting in the face. This is not Inlay. Inlay is leftover contrasting piece set into a cut recess. This is not Pitch. Pitch is leftover resin / gum pocket occupying a hole. This is not Check. Check is leftover linear drying split still opening along the face. This is not Fold Sheet. Fold Sheet is leftover paper creases. This is not latewood as a clone of ring. This is not a paste well. This is not a clock. Pith answers “how much leftover spongy first-year center still sits in the core.”

## Problem

A board looks solid until you see the pith:

- how much leftover tiny spongy/soft first-year center still sits in the middle of the face?
- is the leftover solid, or showing?
- when is the leftover pith obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover darker inner that still occupies the core as a heartwood band, leftover circular dark that still sits in the face as branch wood, leftover thin living skin still sitting under leftover bark at the edge, leftover year-band still sitting in the face, leftover irregular fungal decay cavities still sitting in the face, leftover contrasting piece still sitting in a cut recess, leftover resin that still sits in the face as a gum pocket, leftover linear drying split that still opens along the face, leftover pale that still bands the face as a sapwood stripe, leftover millimetres of stock, leftover blade gap, leftover paper creases, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover pith — leftover first-year spongy center still sitting in the middle of the face, not a heartwood color zone, not a circular knot of branch wood, not cambium at the bark edge, not an annual ring, not a paper fold-sheet.

## Users

- people who already know a board can look solid until the leftover spongy first-year center shows in the middle
- anyone who refuses to treat a heartwood color zone, a circular knot, a cambium edge layer, a year-band, pecky cavities, a packed sky, or a clock as this leftover
- desks that want pith as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Heart, not Knot, not Cambium, not Ring, not Pecky, not a paste well

## Workflow

1. Load the seed: 22 mm of leftover pith — already showing, not a solid-only center
2. Read the scene: one board in face, a leftover whose leftover is the pith, leftover labelled as a sketch
3. Move pith (or use the arrow keys on the focused slider); leftover names showing or solid
4. Drop the leftover toward 0 mm and the center looks solid / no leftover pith; raise it and a larger leftover spongy center still sits in the core
5. Reset restores the seeded leftover showing

## Data model

One board in face with leftover pith as leftover spongy center that still sits in the core:

- `pith` — millimetres of leftover spongy center showing (default 22)

Derived picture:

- leftover labelled as a sketch (solid / showing), not a mill sign-off
- leftover center labelled as a sketch
- solid / no leftover pith when pith ≤ 4 mm (the center looks solid throughout)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board in face — a leftover whose leftover is the pith; leftover is leftover tiny spongy/soft first-year center still sitting in the middle (not a heartwood color zone, not a circular knot of branch wood, not cambium at the bark edge, not an annual ring)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover tiny spongy/soft first-year center still sitting in the middle of one solid timber board, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a batten cover as the hero, not a dowel pin as the hero, not a flute hollow as the hero, not an inlay piece as the hero, not pecky cavities as the hero, not a cambium layer as the hero, not a banding strip as the hero, not a clock
- seeded demo already shows a visible leftover (not a solid-only center)
- live pith, leftover labelled as a sketch (solid / showing)
- keyboard moves the focused control
- SVG text alternative names whether the pith is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/pith/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (face / leftover pith) is in the DOM
- seeded leftover is visible (showing — not solid)
- changing a control redraws and updates the readout
- no paste-well hero, no heartwood color zone as the hero, no circular knot as the hero, no cambium edge layer as the hero, no annual ring as the hero, no clock face

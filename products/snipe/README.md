# Snipe

A pass looks even until you see the snipe. Move the dip. See the leftover end.

This is not Cup. Cup is leftover dish that still stands across the width. This is not Bow. Bow is leftover arch that still stands along the length. This is not Twist. Twist is leftover wind that still spirals one end off the other. This is not Crook. Crook is leftover sweep that still curves the edge in plan. This is not Kerf. Kerf is leftover blade gap that still sits where the cut removed stock. This is not Offcut. Offcut is leftover piece that still sits after the placed cuts. This is not Wane. Wane is leftover live bark edge that still takes the square off the corner. This is not Dovetail. Dovetail is leftover interlocking tails that still sit in the corner. This is not a cut-list. This is not a paste well. This is not a clock. Snipe answers “how much leftover end-dip still sits at the trailing end of a pass.”

## Problem

A pass looks even until you see the snipe:

- how much leftover planer/jointer dip still sits at the trailing end of a pass?
- is the leftover even, or showing?
- when is the leftover snipe obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover dish that still stands across the width, leftover arch that still stands along the length, leftover wind that still spirals one end off the other, leftover sweep that still curves the edge in plan, leftover blade gap that still sits where the cut removed stock, leftover piece that still sits after placed cuts, leftover live bark edge that still takes the square off the corner, leftover interlocking tails that still sit in the corner, leftover millimetres of stock, leftover paper creases, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover snipe — leftover planer/jointer end-dip still sitting at the trailing end of a pass, not a cup dish across the width, not a bow arch along the length, not a twist wind, not a crook edge-sweep, not a kerf gap, not an offcut piece, not a wane bark edge, not interlocking tails in a corner.

## Users

- people who already know a pass can look even until the leftover end-dip shows at the trailing end
- anyone who refuses to treat a cup dish, a bow arch, a twist wind, a crook sweep, a kerf gap, an offcut piece, a wane bark edge, interlocking tails, a packed sky, or a clock as this leftover
- desks that want snipe as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Cup, not Bow, not Twist, not Crook, not Kerf, not Offcut, not Wane, not Dovetail, not a paste well

## Workflow

1. Load the seed: 24 mm of leftover dip — already showing, not an even-only pass
2. Read the scene: one board in side/face, a leftover whose leftover is the snipe, leftover labelled as a sketch
3. Move leftover snipe (or use the arrow keys on the focused slider); leftover names showing or even
4. Drop the leftover toward 0 mm and the end looks even / no leftover snipe; raise it and a deeper leftover dip still sits at the end of the pass
5. Reset restores the seeded leftover showing

## Data model

One board in side/face with leftover snipe as leftover dip that still sits at the trailing end of a pass:

- `snipe` — millimetres of leftover end-dip showing (default 24)

Derived picture:

- leftover labelled as a sketch (even / showing), not a mill sign-off
- leftover end labelled as a sketch
- even / no leftover snipe when dip ≤ 4 mm (the end looks even with the rest of the face)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board in side/face — a leftover whose leftover is the snipe; leftover is leftover planer/jointer end-dip still sitting at the trailing end of a pass (not a cup dish across the width, not a bow arch along the length, not a twist wind, not a crook edge-sweep, not a kerf gap, not an offcut piece)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover planer/jointer end-dip still sitting at the trailing end of one board in side/face, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a batten cover as the hero, not a dowel pin as the hero, not a flute hollow as the hero, not an inlay piece as the hero, not pecky cavities as the hero, not a cambium layer as the hero, not a pith center as the hero, not interlocking tails as the hero, not a cut-list as the hero, not an offcut as the hero, not a clock
- seeded demo already shows a visible leftover (not an even-only pass)
- live leftover snipe, leftover labelled as a sketch (even / showing)
- keyboard moves the focused control
- SVG text alternative names whether the snipe is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/snipe/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (side / one board / leftover snipe) is in the DOM
- seeded leftover is visible (showing — not even)
- changing a control redraws and updates the readout
- no paste-well hero, no cup dish as the hero, no bow arch as the hero, no kerf gap as the hero, no offcut piece as the hero, no interlocking tails as the hero, no clock face

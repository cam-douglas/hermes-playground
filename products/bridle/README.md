# Bridle

A board looks closed until you see the bridle. Move the fork. See the leftover opening.

This is not Mortise. Mortise is leftover closed pocket that still sits in a face. This is not Tenon. Tenon is leftover tongue that still projects from a mate. This is not Dovetail. Dovetail is leftover flared tails that still lock a corner. This is not Dado. Dado is leftover groove that still cuts across a face. This is not Rabbet. Rabbet is leftover shoulder that still sits along an edge. This is not Cove. Cove is leftover concave scoop that still sits across a face. This is not Coping. Coping is leftover scribed nest that still sits against a molding. This is not a cut-list. This is not a paste well. This is not a clock. Bridle answers “how much leftover open fork still sits at the end.”

## Problem

A board looks closed until you see the bridle:

- how much leftover open fork still sits in the end of the member?
- is the leftover closed, or showing?
- when is the leftover bridle obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover closed pockets that still sit in a face, leftover tongues that still project from a mate, leftover flared tails that still lock a corner, leftover grooves that still cut across a face, leftover shoulders that still sit along an edge, leftover concave scoops that still sit across a face, leftover scribed nests that still sit against a molding, leftover millimetres of stock, leftover paper creases, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover bridle — leftover open fork still sitting as a U-shaped opening in the end of the member, leftover bridle still sitting at the end, not a mortise pocket in a face, not a tenon tongue on a mate, not flared dovetail tails, not a dado groove across a face, not a rabbet shoulder along an edge.

## Users

- people who already know a board can look closed until the leftover open fork shows at the end
- anyone who refuses to treat a mortise pocket, a tenon tongue, flared dovetail tails, a dado groove, a rabbet shoulder, a packed sky, or a clock as this leftover
- desks that want bridle as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Mortise, not Tenon, not Dovetail, not Dado, not Rabbet, not a paste well

## Workflow

1. Load the seed: 32 mm of leftover fork — already showing, not a closed-only end
2. Read the scene: one board in end/side, a leftover whose leftover is the bridle, leftover labelled as a sketch
3. Move leftover bridle (or use the arrow keys on the focused slider); leftover names showing or closed
4. Drop the leftover toward 0 mm and the end looks closed / no leftover bridle; raise it and a deeper leftover fork still sits at the end
5. Reset restores the seeded leftover showing

## Data model

One board in end/side with leftover bridle as leftover open fork that still sits at the end:

- `bridle` — millimetres of leftover fork opening (default 32)

Derived picture:

- leftover labelled as a sketch (closed / showing), not a mill sign-off
- leftover fork labelled as a sketch
- closed / no leftover bridle when opening ≤ 4 mm (the end looks closed, no fork)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board in end/side — a leftover whose leftover is the bridle; leftover is leftover open fork still sitting as a U-shaped opening in the end (not a closed mortise pocket in a face, not a tenon tongue projecting from a mate, not flared dovetail tails, not a dado groove across a face, not a rabbet shoulder along an edge)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover open fork still sitting as a U-shaped opening in the end of one board in end/side, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a batten cover as the hero, not a dowel pin as the hero, not a flute hollow as the hero, not an inlay piece as the hero, not pecky cavities as the hero, not a cambium layer as the hero, not a pith center as the hero, not interlocking tails as the hero, not a snipe dip as the hero, not a biscuit wafer as the hero, not a bowtie patch as the hero, not a coping nest as the hero, not a cove scoop as the hero, not a cut-list as the hero, not an offcut as the hero, not a clock
- seeded demo already shows a visible leftover (not a closed-only end)
- live leftover bridle, leftover labelled as a sketch (closed / showing)
- keyboard moves the focused control
- SVG text alternative names whether the bridle is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/bridle/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (end / side / one board / leftover bridle) is in the DOM
- seeded leftover is visible (showing — not closed)
- changing a control redraws and updates the readout
- no paste-well hero, no mortise pocket as the hero, no tenon tongue as the hero, no flared dovetail tails as the hero, no dado groove as the hero, no rabbet shoulder as the hero, no clock face

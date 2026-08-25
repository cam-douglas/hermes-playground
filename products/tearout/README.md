# Tearout

A face looks clean until you see the tearout. Move the splinter. See the leftover fibres at the cut.

This is not Check. Check is leftover drying split that still opens in a face. This is not Snipe. Snipe is leftover dip that still sits at the end of a pass. This is not Pecky. Pecky is leftover cavity that still sits in a face. This is not Wane. Wane is leftover bark that still sits on an edge. This is not Housing. Housing is leftover recess that still sits across the face. This is not Lap. Lap is leftover overlap that still sits along the face. This is not Cove. Cove is leftover scoop that still sits in the face. This is not a cut-list. This is not a paste well. This is not a clock. Tearout answers “how much leftover splinter still sits at the cut.”

## Problem

A face looks clean until you see the tearout:

- how much leftover splinter still sits at the cut as torn fibres?
- is the leftover clean, or showing?
- when is the leftover tearout obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover drying split that still opens in a face, leftover dip that still sits at the end of a pass, leftover cavity that still sits in a face, leftover bark that still sits on an edge, leftover shallow recess that still sits across a post, leftover half-thickness overlap that still sits along a face, leftover scoop that still sits in a face, leftover millimetres of stock, leftover paper creases, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, leftover overlap along the length, leftover nest against a molding, leftover keyed patch across a split, leftover interlocking tails in a corner, leftover spongy center, leftover living layer, leftover set piece, leftover hollow, leftover covering strip, leftover half-round, leftover leap, leftover run, leftover blotch, leftover plume, leftover stripe, leftover wash, leftover zone-line, leftover blister, leftover dimple, leftover wave, leftover year, leftover inner, leftover pale, leftover flash, leftover resin, leftover swirl, leftover sweep, leftover dark, leftover key, leftover angle, leftover wind, leftover arch, leftover dish, leftover live edge, leftover radius, leftover bevel, leftover pack, leftover peak, leftover sharp, leftover board, leftover underside, leftover knuckle, leftover hole, leftover lip, leftover bar, leftover triangle, leftover jut, leftover hang, leftover guard, leftover rebate, leftover draw, leftover freeboard, leftover span, leftover base, leftover lock, leftover shadow, leftover scarf, leftover canopy, leftover boom, leftover setback, leftover fetch, leftover roll, leftover offset course, leftover lean, leftover list, leftover rise, leftover eave, leftover frame, leftover glide, leftover heading, leftover loft, leftover pedal, leftover going, leftover chair, leftover wheels, leftover plume, leftover rode, leftover kerf, leftover mesh, leftover floor, leftover grain, leftover sightline, leftover depth, leftover camber, leftover warmth, leftover sag, leftover hang, leftover mix, leftover crease, leftover grams, leftover millimetres, leftover clock, leftover board of leftover-access, leftover paste, leftover packed sky, leftover desk-keys, leftover desk-pins, leftover fold-sheet, leftover scanner, leftover fillet radius, leftover chamfer bevel, leftover cove scoop, leftover dogbone relief, leftover lap overlap, leftover housing recess. They do not show leftover tearout — leftover torn fibres still sitting at the cut, leftover splinter still sitting at the cut, not Check leftover split in a face, not Snipe leftover dip at the end, not Pecky leftover cavity in a face, not Wane leftover bark on an edge.

## Users

- people who already know a face can look clean until the leftover splinter shows at the cut
- anyone who refuses to treat a check split, a snipe dip, a pecky cavity, a wane bark, a housing recess, a packed sky, or a clock as this leftover
- desks that want tearout as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Check, not Snipe, not Pecky, not Wane, not Housing, not a paste well

## Workflow

1. Load the seed: 8 mm of leftover splinter — already showing, not a clean-only face
2. Read the scene: one board, a leftover whose leftover is the tearout, leftover labelled as a sketch
3. Move leftover tearout (or use the arrow keys on the focused slider); leftover names showing or clean
4. Drop the leftover toward 0 mm and the face looks clean / no leftover tearout; raise it and a taller leftover splinter still sits at the cut
5. Reset restores the seeded leftover showing

## Data model

One board/cut with leftover tearout as leftover torn fibres that still sit at the cut:

- `tearout` — millimetres of leftover splinter (default 8)

Derived picture:

- leftover labelled as a sketch (clean / showing), not a mill sign-off
- leftover splinter labelled as a sketch
- clean / no leftover tearout when splinter ≤ 2 mm (the face looks clean, no leftover splinter)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board in side/cut — a leftover whose leftover is the tearout; leftover is leftover torn fibres still sitting at the cut (not a check split in a face, not a snipe dip at the end, not a pecky cavity, not wane bark)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover torn fibres still sitting at the cut of one board, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail as the hero, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a batten cover as the hero, not a dowel pin as the hero, not a flute hollow as the hero, not an inlay piece as the hero, not pecky cavities as the hero, not a cambium layer as the hero, not a pith center as the hero, not interlocking tails as the hero, not a snipe dip as the hero, not a biscuit wafer as the hero, not a bowtie patch as the hero, not a coping nest as the hero, not a cove scoop as the hero, not a bridle fork as the hero, not finger tabs as the hero, not a dogbone relief as the hero, not a drawbore offset as the hero, not a fox wedge as the hero, not a lap overlap as the hero, not a housing recess as the hero, not a cut-list as the hero, not an offcut as the hero, not a clock
- seeded demo already shows a visible leftover (not a clean-only face)
- live leftover tearout, leftover labelled as a sketch (clean / showing)
- keyboard moves the focused control
- SVG text alternative names whether the tearout is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/tearout/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one board / side-cut / leftover tearout) is in the DOM
- seeded leftover is visible (showing — not clean)
- changing a control redraws and updates the readout
- no paste-well hero, no check split as the hero, no snipe dip as the hero, no pecky cavity as the hero, no wane bark as the hero, no housing recess as the hero, no clock face

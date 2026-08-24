# Mottle

A board looks even until you see the mottle. Move the figure. See the leftover blotch.

This is not Quilt. Quilt is leftover 3D blister-patches / quilted maple balloons. This is not Stain. Stain is leftover grey-blue mineral/blue-stain color wash. This is not Curl. Curl is leftover wave / fiddleback figure running across the face. This is not Ribbon. Ribbon is leftover vertical quartered stripe-bands. This is not Crotch. Crotch is leftover feather/plume at a trunk/limb fork. This is not Burl. Burl is leftover swirl of figure from a dormant bud occupying a patch. This is not Eye. Eye is leftover tiny circular bird's-eye dimples. This is not Ray. Ray is leftover medullary flash / spoke from pith toward bark. This is not Ring. Ring is leftover annual year-band that still sits in the face. This is not Sap. Sap is leftover pale edge band of sapwood on a heartwood face. This is not Heart. Heart is leftover inner that still occupies the core as a darker heartwood zone down the middle. This is not Knot. Knot is leftover circular dark of branch wood / pith. This is not Grain. Grain is leftover mismatch of the cut to the fibres. This is not Fold Sheet. Fold Sheet is leftover paper creases. This is not Spalt. Spalt is leftover dark wandering zone-lines. This is not Pitch. Pitch is leftover resin / gum pocket. This is not Check. Check is leftover drying split. This is not a paste well. This is not a clock. Mottle answers “how far the leftover blotch still sits in the figure.”

## Problem

A board looks even until you see the mottle:

- how far does the leftover blotch still sit in the figure?
- is the leftover even, or showing?
- when is the leftover blotch obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover 3D blister-patches of figure that still sit as leftover quilted maple balloons, leftover wash that still sits in the face as leftover grey-blue mineral/blue-stain, leftover wave that still sits in the figure as leftover undulating fiddleback bands running across the face, leftover stripe that still sits in the figure as leftover quartered ribbon from interlocked grain, leftover plume that still sits in the crotch as leftover feather of figure where a limb met the trunk, leftover swirl of figure from a dormant bud occupying a patch, leftover tiny circular dimples of figure that still sit scattered in the face as leftover bird's-eye, leftover medullary flash that still cuts across the face as a spoke from pith toward bark, leftover year that still sits in the face as leftover annual growth, leftover pale that still bands the edge of a heartwood face, leftover inner that still occupies the core as a darker heartwood zone down the middle of a pale sapwood face, leftover circular dark that still sits in the face as branch wood, leftover mismatch of the cut to the fibres, leftover paper creases on a sheet, leftover dark irregular fungal zone-lines, leftover resin that still sits in the face as a pocket of gum, leftover drying split that still opens along the face, leftover closed joinery pocket that still opens in the face, leftover key that still sits between two boards as a separate slip, leftover tongue that still projects from the end, leftover housing groove that still cuts across the grain, leftover angle that still cuts the square meet, leftover rebate along the edge, leftover wind that still spirals one end of a board off the other, leftover dish that still warps a board across its width, leftover arch that still warps a board along its length, leftover millimetres of stock, leftover blade gap, leftover radius that still fills a concave corner, leftover bevel that still takes the sharp off, leftover sharp where two planes meet, leftover packing that still fills a gap, leftover peak where two roof planes meet, leftover board covering rafter tails, leftover underside plane, leftover roof overhang, leftover hull crease, leftover drain through a bulwark, leftover hatch lip, leftover doorway bar, leftover window bar, leftover sash-frame, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover mottle — leftover blotch that still sits in the figure as leftover broken, irregular blotches of light and dark that still sit in the face as leftover patches of interlocked or wavy grain (mottled mahogany / broken-stripe figure), not Quilt (3D blister-patches / quilted maple balloons), not Stain (grey-blue mineral/blue-stain color wash), not Curl (fiddleback waves across the face), not Ribbon (vertical quartered stripe-bands), not Crotch (plume at a trunk/limb fork), not Burl (swirl occupying a patch), not Eye (tiny circular bird's-eye dimples), not annual growth rings, not a sap pale edge-band, not a heartwood core, not a knot, not grain-angle mismatch, not a paper fold-sheet.

## Users

- people who already know a board can look even until the leftover blotch shows
- anyone who refuses to treat a quilt blister, a stain wash, a curl wave, a ribbon stripe, a crotch plume, a burl swirl, an eye dimple, a packed sky, or a clock as this leftover
- desks that want mottle as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Quilt, not Stain, not Crotch, not a paste well

## Workflow

1. Load the seed: 30 mm of leftover mottle — already showing, not an even-only face
2. Read the scene: one board in face, a leftover whose leftover is the mottle, leftover labelled as a sketch
3. Move mottle (or use the arrow keys on the focused slider); leftover names showing or even
4. Drop the leftover toward 0 mm and the board looks even / no leftover mottle; raise it and more / larger leftover blotch-patches still sit in the face
5. Reset restores the seeded leftover showing

## Data model

One board in face with leftover mottle as leftover blotch that still sits in the figure:

- `mottle` — millimetres of leftover blotch showing (default 30)

Derived picture:

- leftover labelled as a sketch (even / showing), not a mill sign-off
- leftover blotch labelled as a sketch
- even / no leftover mottle when mottle ≤ 4 mm (the board looks even throughout)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one board in face — a leftover whose leftover is the mottle; leftover is leftover blotch that still sits in the figure as leftover broken, irregular islands of light and dark tiled across the face as leftover patches of interlocked or wavy grain (not 3D quilt balloons, not a color wash, not vertical ribbon stripes, not horizontal curl waves, not a crotch plume, not a burl swirl occupying a patch, not a radial medullary ray, not annual growth rings, not a sap pale edge-band, not a heartwood core, not bird's-eye dimples, not a knot, not grain-angle mismatch, not a paper fold-sheet)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover broken, irregular blotch-patches of light and dark that still sit in the face as leftover mottled mahogany / broken-stripe figure, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a clock
- seeded demo already shows a visible leftover (not an even-only face)
- live mottle, leftover labelled as a sketch (even / showing)
- keyboard moves the focused control
- SVG text alternative names whether the mottle is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/mottle/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (face / one board / leftover mottle) is in the DOM
- seeded leftover is visible (showing — not even)
- changing a control redraws and updates the readout
- no paste-well hero, no quilt blister as the hero, no stain wash as the hero, no curl wave as the hero, no ribbon stripe as the hero, no crotch plume as the hero, no burl swirl as the hero, no eye dimple as the hero, no ray flash as the hero, no year-band as the hero, no sap edge-band as the hero, no heartwood core as the hero, no knot dark as the hero, no grain-angle mismatch as the hero, no clock face

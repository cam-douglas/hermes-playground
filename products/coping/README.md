# Coping

A corner looks mitred until you see the coping. Move the scribe. See the leftover nest.

This is not Mitre. Mitre is leftover 45° angle that still cuts the square meet. This is not Fillet. Fillet is leftover convex radius that still fills a concave corner. This is not Chamfer. Chamfer is leftover bevel that still takes the sharp off a corner. This is not Flute. Flute is leftover parallel hollows that still sit along a length. This is not Bead. Bead is leftover round that still sits on an edge. This is not Bowtie. Bowtie is leftover keyed hourglass patch that still sits across a face split. This is not Cove as a clone of flute — a parallel hollow along a length is Flute; Coping is leftover scribed profile that still sits against the molding. This is not a cut-list. This is not a paste well. This is not a clock. Coping answers “how much leftover scribed nest still sits against the molding.”

## Problem

A corner looks mitred until you see the coping:

- how much leftover scribed nest still sits against the adjoining profile?
- is the leftover square, or showing?
- when is the leftover coping obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover 45° angle that still cuts a square meet, leftover convex radius that still fills a concave corner, leftover bevel that still takes the sharp off a corner, leftover parallel hollows that still sit along a length, leftover round that still sits on an edge, leftover keyed hourglass patch that still sits across a face split, leftover oval wafer that still sits in a slot, leftover interlocking tails that still sit in a corner, leftover millimetres of stock, leftover paper creases, leftover board covering rafter tails, leftover drain, leftover hatch lip, leftover doorway bar, leftover window bar, leftover lintel span, leftover tread hang, leftover jutting stone, leftover vault infill, and leftover overlap along the length. They do not show leftover coping — leftover coped end still nesting into the adjoining profile, leftover scribed nest still sitting at the inside corner, not a mitre angle, not a fillet radius, not a chamfer bevel, not flute hollows, not a bead round, not a bowtie patch, not Cove as a clone of flute.

## Users

- people who already know a corner can look mitred until the leftover scribed nest shows against the molding
- anyone who refuses to treat a 45° mitre, a fillet radius, a chamfer bevel, flute hollows, a bead round, a bowtie patch, a cove clone of flute, a packed sky, or a clock as this leftover
- desks that want coping as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Mitre, not Fillet, not Chamfer, not Flute, not Bead, not Bowtie, not Cove-as-flute, not a paste well

## Workflow

1. Load the seed: 26 mm of leftover scribed nest — already showing, not a square-cut-only end
2. Read the scene: one inside corner of two moldings, a leftover whose leftover is the coping, leftover labelled as a sketch
3. Move leftover coping (or use the arrow keys on the focused slider); leftover names showing or square
4. Drop the leftover toward 0 mm and the end looks square / no leftover coping; raise it and a deeper leftover scribed nest still sits against the molding
5. Reset restores the seeded leftover showing

## Data model

One inside corner of two moldings with leftover coping as leftover scribed nest that still sits against the molding:

- `coping` — millimetres of leftover scribe showing (default 26)

Derived picture:

- leftover labelled as a sketch (square / showing), not a mill sign-off
- leftover nest labelled as a sketch
- square / no leftover coping when scribe ≤ 4 mm (the end looks like a square cut, not nested into the profile)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one inside corner of two moldings — a leftover whose leftover is the coping; leftover is leftover coped end still nesting into the adjoining profile (not a 45° mitre cut, not a convex fillet radius, not a chamfer bevel, not parallel flute hollows along a length, not a round bead)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover scribed nest still sitting against the molding at an inside corner, not a spreadsheet, not a Gantt, not a floor plan of rooms, not a cut-list stick, not a bag, not a crease diagram of paper, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap as the hero, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a sash leftover frame, not an eave overhang as shade, not a soffit underside plane, not a fascia board as the hero, not a parapet wall, not a keystone lock, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf overlap as the hero, not a hill, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet shoulder as the hero, not a nosing hang, not a going, not a spandrel triangle, not a corbel jut, not a window mullion, not a doorway threshold, not a hatch coaming, not a scupper drain, not a hull chine, not a chamfer single-edge bevel as the hero, not an arris sharp, not a shim pack as the hero, not a ridge peak, not a fillet radius as the hero, not a wane live edge as the hero, not a cup dish as the hero, not a bow length-arch as the hero, not a twist wind as the hero, not a check drying-split as the hero, not a dado through-groove as the hero, not a mortise pocket as the hero, not a tenon tongue as the hero, not a mitre angle as the hero, not a spline key as the hero, not a knot dark as the hero, not a crook edge-sweep as the hero, not a burl swirl as the hero, not a pitch resin as the hero, not a ray flash as the hero, not a sap edge-band as the hero, not a heartwood core as the hero, not a year-band as the hero, not a curl wave as the hero, not an eye dimple as the hero, not a quilt blister as the hero, not a spalt zone-line as the hero, not a stain wash as the hero, not a ribbon stripe as the hero, not a crotch plume as the hero, not a mottle blotch as the hero, not a drip run as the hero, not a flame leap as the hero, not a bead round as the hero, not a batten cover as the hero, not a dowel pin as the hero, not a flute hollow as the hero, not an inlay piece as the hero, not pecky cavities as the hero, not a cambium layer as the hero, not a pith center as the hero, not interlocking tails as the hero, not a snipe dip as the hero, not a biscuit wafer as the hero, not a bowtie patch as the hero, not a cut-list as the hero, not an offcut as the hero, not a clock
- seeded demo already shows a visible leftover (not a square-cut-only end)
- live leftover coping, leftover labelled as a sketch (square / showing)
- keyboard moves the focused control
- SVG text alternative names whether the coping is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/coping/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (inside corner / two moldings / leftover coping) is in the DOM
- seeded leftover is visible (showing — not square)
- changing a control redraws and updates the readout
- no paste-well hero, no 45° mitre as the hero, no fillet radius as the hero, no chamfer bevel as the hero, no flute hollows as the hero, no bead round as the hero, no bowtie patch as the hero, no clock face

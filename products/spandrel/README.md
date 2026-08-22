# Spandrel

A vault looks solid until you see the spandrel. Move the fill. See the leftover triangle.

This is not Keystone. Keystone is leftover lock stone. This is not Lintel. Lintel is leftover span over an opening. This is not Plinth. Plinth is a base step. This is not Batter. Batter is a retaining-wall slope. This is not Parapet. Parapet is leftover wall above the roof. This is not Nosing. Nosing is leftover tread hang past the riser. This is not a clock. Spandrel answers “how much leftover infill still sits between the arch curve and the enclosing rectangle, leftover triangle as seen in elevation.”

## Problem

A vault looks solid until you see the spandrel:

- how much leftover infill still sits between the arch and the rectangle?
- is the leftover flush, or showing?
- when is the leftover triangle obvious — as a picture, not a masonry spec?

Existing tools in this catalogue measure leftover arch lock, leftover lintel span, leftover plinth step, leftover retaining-wall batter, leftover wall above the roof, and leftover tread hang. They do not show leftover triangle / infill between an arch curve and an enclosing rectangle.

## Users

- people who already know a vault can look solid until the leftover spandrel shows
- anyone who refuses to treat a keystone, a lintel, a plinth, a batter, a parapet, a nosing, or a clock as this leftover
- desks that want spandrel as a picture, not a masonry sign-off
- teams that want a no-backend, local-only pass — not Keystone, not Lintel, not Plinth, not Batter, not Parapet, not Nosing, not a paste well

## Workflow

1. Load the seed: 180 mm of leftover infill — already showing, not flush
2. Read the scene: one elevation, a rectangle with an arch cut through it, leftover triangle labelled as a sketch
3. Move fill (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the leftover toward 0 mm and the rectangle looks solid; raise it and the leftover triangle shows
5. Reset restores the seeded leftover showing

## Data model

One elevation with leftover spandrel as leftover infill:

- `fill` — millimetres of leftover infill height (default 180)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a masonry sign-off
- leftover infill labelled as a sketch
- flush when fill ≤ 20 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: an elevation — a rectangle with an arch cut through it, leftover triangle / infill between the arch curve and the enclosing rectangle
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one leftover triangle in elevation, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window sash, not an eave overhang, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not a keystone lock, not a plinth, not a lintel, not a freeboard, not a flue, not a parapet, not a rabbet, not a nosing hang, not a clock
- seeded demo already shows a visible leftover (not flush)
- live fill, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether the spandrel is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/spandrel/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (elevation / leftover triangle as leftover infill) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no keystone lock, no lintel span, no plinth step, no batter slope, no parapet wall, no nosing hang, no clock face

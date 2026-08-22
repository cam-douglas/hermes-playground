# Nosing

A stair looks flush until you see the nosing. Move the tread. See the leftover hang.

This is not Going. Going is how much going a foot actually gets — leftover tread depth. This is not Rake. Rake is chair-back angle. This is not Headroom. Headroom is air above a standing head. This is not Stagger. Stagger is brick bond offset. This is not Toe. Toe is wheel angle. This is not Parapet. Parapet is leftover wall above the roof. This is not Eave. Eave is roof leftover past a wall. This is not Rabbet. Rabbet is leftover rebate shoulder. This is not a clock. Nosing answers “how far the tread still hangs past the riser, leftover nosing as seen in a stair section.”

## Problem

A stair looks flush until you see the nosing:

- how far does the tread still hang past the riser?
- is the leftover flush, or showing?
- when is the leftover hang obvious — as a picture, not a stair spec?

Existing tools in this catalogue measure leftover tread depth, leftover chair-back angle, leftover loft air, leftover brick bond, leftover wheel angle, leftover wall above the roof, leftover roof past a wall, and leftover rebate shoulder. They do not show leftover tread hang past the riser in a stair section.

## Users

- people who already know a stair can look flush until the leftover nosing shows
- anyone who refuses to treat a going, a rake, headroom, a stagger, a toe, a parapet, an eave, a rabbet, or a clock as this leftover
- desks that want nosing as a picture, not a stair sign-off
- teams that want a no-backend, local-only pass — not Going, not Rake, not Headroom, not Stagger, not Toe, not Parapet, not Eave, not Rabbet, not a paste well

## Workflow

1. Load the seed: 25 mm of leftover hang — already showing, not flush
2. Read the scene: one stair in section, leftover nosing labelled as a sketch
3. Move nosing (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the leftover toward 0 mm and the tread meets the riser; raise it and the leftover hang shows
5. Reset restores the seeded leftover showing

## Data model

One stair in section with leftover nosing as leftover hang:

- `nosing` — millimetres of leftover hang (default 25)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a stair sign-off
- leftover hang labelled as a sketch
- flush when nosing ≤ 2 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a stair in section — two or three treads and risers, leftover nosing hanging past the riser face as leftover hang
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one stair leftover nosing in section, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a going, not a pedal, not a ceiling, not a heading, not a glide, not a window sash, not an eave overhang, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not an arch, not a plinth, not a lintel, not a freeboard, not a flue, not a parapet, not a rabbet, not a clock
- seeded demo already shows a visible leftover (not flush)
- live nosing, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether nosing is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/nosing/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (stair section / leftover nosing as leftover hang) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no going/tread-depth, no chair rake, no loft headroom figure, no brick stagger, no wheel toe, no parapet wall, no eave overhang, no rebate, no clock face

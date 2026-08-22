# Parapet

A roof looks flush until you see the parapet. Move the wall. See the leftover guard.

This is not Eave. Eave is roof leftover past a wall — the opposite leftover. This is not Plinth. Plinth is a base step. This is not Batter. Batter is a retaining-wall slope from plumb. This is not Setback. Setback is leftover yard. This is not Headroom. Headroom is air above a standing head. This is not Flue. Flue is chimney pull. This is not Rabbet. Rabbet is leftover rebate shoulder. This is not a clock. Parapet answers “how far the wall still guards above the roof, leftover parapet as seen in a building section.”

## Problem

A roof looks flush until you see the parapet:

- how far does the wall still guard above the roof?
- is the leftover flush, or showing?
- when is the leftover guard obvious — as a picture, not a masonry spec?

Existing tools in this catalogue measure leftover eave overhang, leftover plinth step, leftover retaining-wall batter, leftover lot-line setback, leftover loft headroom, leftover chimney pull, and leftover rebate shoulder. They do not show leftover wall above the roof in a building section.

## Users

- people who already know a roof can look flush until the leftover parapet shows
- anyone who refuses to treat an eave, a plinth, a batter, a setback, headroom, a flue, a rabbet, or a clock as this leftover
- desks that want parapet as a picture, not a masonry sign-off
- teams that want a no-backend, local-only pass — not Eave, not Plinth, not Batter, not Setback, not Headroom, not Flue, not Rabbet, not a paste well

## Workflow

1. Load the seed: 420 mm of leftover guard — already showing, not flush
2. Read the scene: one building in section, leftover parapet labelled as a sketch
3. Move parapet (or use the arrow keys on the focused slider); leftover names showing or flush
4. Drop the leftover toward 0 mm and the wall meets the roof; raise it and the leftover guard shows
5. Reset restores the seeded leftover showing

## Data model

One building in section with leftover parapet as leftover guard:

- `parapet` — millimetres of leftover guard (default 420)

Derived picture:

- leftover labelled as a sketch (flush / showing), not a masonry sign-off
- leftover guard labelled as a sketch
- flush when parapet ≤ 40 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a building in section — wall, roof deck, leftover parapet rising above the roof as leftover guard
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one building leftover parapet in section, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door swing, not talk columns, not gears, not a kerf gap, not a rode, not a vent plume, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window sash, not an eave overhang, not a rail, not a list, not a retaining wall, not a brick course, not a wing, not a fetch, not a lot line, not a crane, not a tree, not a scarf, not a hill, not an arch, not a plinth, not a lintel, not a freeboard, not a flue, not a rabbet, not a clock
- seeded demo already shows a visible leftover (not flush)
- live parapet, leftover labelled as a sketch (flush / showing)
- keyboard moves the focused control
- SVG text alternative names whether parapet is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/parapet/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (building section / leftover parapet as leftover guard) is in the DOM
- seeded leftover is visible (showing — not flush)
- changing a control redraws and updates the readout
- no paste-well hero, no eave overhang, no chimney, no plinth step, no retaining-wall batter, no lot-line setback, no loft headroom figure, no rebate, no blade gap, no clock face

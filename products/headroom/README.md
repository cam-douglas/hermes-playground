# Headroom

A loft looks fine in plan until you stand. Move the ceiling. See the leftover air.

This is not Going. Going is leftover stair tread. This is not Sightline. Sightline is a seated eye line versus a partition. This is not Swing. Swing is a door arc. This is not Dark Floor. Dark Floor is a night plan of booked rooms. This is not a clock. Headroom answers “how much leftover ceiling sits above a standing figure, as seen in section.”

## Problem

A loft looks fine in plan until you stand:

- is the leftover air short, or enough?
- how many millimetres sit between a standing crown and the finished ceiling?
- when is the leftover obvious — as a picture, not a building-code table?

Existing tools in this catalogue measure a stair going, an eye line versus a partition, a door swing, and a night plan of rooms. They do not show leftover ceiling above a standing figure.

## Users

- people who already know a loft can look fine in plan while the standing leftover is still short
- anyone who refuses to treat a stair, a seated sightline, a door, or a clock as this leftover
- desks that want headroom as a picture, not a building-code sign-off
- teams that want a no-backend, local-only pass — not Going, not Sightline, not Swing, not Dark Floor, not a paste well

## Workflow

1. Load the seed: 1960 mm ceiling, 1800 mm standing figure, 160 mm leftover — already short versus a 300 mm enough mark
2. Read the scene: loft in section, standing figure, finished ceiling, leftover air above the head
3. Move ceiling height (or figure height; or use the arrow keys on the focused slider); leftover names short or enough
4. Raise the ceiling toward 2100 mm and the leftover becomes enough; reset restores the seeded leftover shortage
5. Reset restores the seeded leftover short ceiling

## Data model

One section of a loft:

- `ceiling` — millimetres of finished ceiling height (default 1960)
- `figure` — millimetres of standing figure height (default 1800)

Derived picture:

- leftover = max(0, ceiling − figure)
- labelled as a sketch (short / enough), not a building-code sign-off
- enough when leftover ≥ 300 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: standing figure in a loft section, finished ceiling, leftover air, dashed enough mark
- moving a control redraws the ceiling immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- a standing figure versus a ceiling, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a clock
- seeded demo already shows a visible leftover shortage (not a generous loft)
- live ceiling, figure, leftover labelled as a sketch (short / enough)
- keyboard moves the focused control
- SVG text alternative names whether headroom is short
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/headroom/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (standing figure vs ceiling) is in the DOM
- seeded leftover is visible (160 mm short — not a generous loft)
- changing a control redraws and updates the readout
- no paste-well hero, no stair, no seated eye line, no door arc, no night plan, no clock face

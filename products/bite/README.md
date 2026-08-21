# Bite

A pedal looks ready until you feel the bite. Move the travel. See the leftover gap.

This is not Backlash. Backlash is gear play — leftover lost motion in a mesh. This is not Toe. Toe is wheel angle from above. This is not Going. Going is leftover stair tread. This is not a clock. Bite answers “how much leftover free travel sits before the bite, as seen from the side of a pedal.”

## Problem

A pedal looks ready until you feel the bite:

- is the travel still free, or already at bite?
- how many millimetres of leftover sit off a dashed bite point?
- when is the leftover obvious — as a picture, not a workshop printout?

Existing tools in this catalogue mesh two gears, toe two wheels, and measure a stair going. They do not show leftover pedal travel from the side.

## Users

- people who already know a pedal can look ready while free travel still sits before the bite
- anyone who refuses to treat a gear mesh, a wheel angle, a stair, or a clock as this leftover
- desks that want bite as a picture, not a workshop printout
- teams that want a no-backend, local-only pass — not Backlash, not Toe, not Going, not a paste well

## Workflow

1. Load the seed: 24 mm free travel, pedal already 8 mm in, 16 mm leftover before the bite
2. Read the scene: pedal in side view, dashed bite point versus how far the pad has already moved
3. Move free travel (or pedal position; or use the arrow keys on the focused slider); leftover names free or at bite
4. Push the pedal toward the bite and the leftover closes; reset restores the seeded leftover gap
5. Reset restores the seeded leftover free travel

## Data model

One side view of a pedal:

- `travel` — millimetres of free travel from rest to bite (default 24)
- `position` — millimetres the pedal has already moved (default 8)

Derived picture:

- leftover = max(0, travel − position)
- labelled as a sketch (free / at bite), not a workshop sign-off

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: brake pedal in side view, dashed bite point, leftover free travel, current pad
- moving a control redraws the pedal immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- a pedal in side view, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a clock
- seeded demo already shows a visible leftover gap (not already at bite)
- live travel, leftover labelled as a sketch (free / at bite)
- keyboard moves the focused control
- SVG text alternative names whether travel is still free
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/bite/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (pedal in side view + dashed bite point) is in the DOM
- seeded leftover is visible (16 mm free — not already at bite)
- changing a control redraws and updates the readout
- no paste-well hero, no gears, no wheels from above, no stair, no clock face

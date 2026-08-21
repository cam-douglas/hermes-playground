# Yaw

A course looks true until you see the yaw. Move the heading. See the leftover course.

This is not Toe. Toe is leftover wheel angle from above. This is not Plumb. Plumb is a hanging vertical bob versus a wall. This is not Camber. Camber is a crowned road. This is not a clock. Yaw answers “how far leftover heading still sits off a dashed true course, as seen in plan.”

## Problem

A course looks true until you see the yaw:

- is the leftover heading port, starboard, or on-course?
- how many degrees sit between the mark and the dashed true course?
- when is the leftover obvious — as a picture, not a skipper sign-off?

Existing tools in this catalogue measure wheel toe, a hanging bob, and a road crown. They do not show leftover heading versus a dashed true course.

## Users

- people who already know a mark can look on-course until the leftover heading shows
- anyone who refuses to treat a wheel, a plumb bob, a crowned road, or a clock as this leftover
- desks that want yaw as a picture, not a nav log
- teams that want a no-backend, local-only pass — not Toe, not Plumb, not Camber, not a paste well

## Workflow

1. Load the seed: 14° yaw starboard of a dashed true course — already off-course
2. Read the scene: plan view of a mark / hull / aircraft nose, dashed true course, leftover heading
3. Move yaw (or use the arrow keys on the focused slider); leftover names port, starboard, or on course
4. Bring the heading toward zero and the mark meets the dashed course; reset restores the seeded leftover
5. Reset restores the seeded leftover starboard yaw

## Data model

One plan of a mark on a course:

- `yaw` — degrees of leftover heading (default 14, starboard positive)

Derived picture:

- leftover labelled as a sketch (port / starboard / on course), not a skipper sign-off
- on course when |yaw| < 1°

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a mark on a dashed true course, leftover heading, yaw arc
- moving a control redraws the heading immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- a heading versus a dashed course, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a clock
- seeded demo already shows a visible leftover (not on-course / not zero)
- live yaw, leftover labelled as a sketch (port / starboard)
- keyboard moves the focused control
- SVG text alternative names whether yaw is off-course
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/yaw/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (heading vs dashed course) is in the DOM
- seeded leftover is visible (14° starboard — not on-course)
- changing a control redraws and updates the readout
- no paste-well hero, no wheels, no hanging bob, no road crown, no clock face

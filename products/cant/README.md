# Cant

A track looks level until you see the cant. Move the rail. See the leftover tilt.

This is not Camber. Camber is a crowned road from the side. This is not Toe. Toe is wheel angle from above. This is not Plumb. Plumb is a hanging bob versus a wall. This is not a clock. Cant answers “how much one rail still sits higher than the other, leftover tilt for a curve, as seen end-on.”

## Problem

A track looks level until you see the cant:

- how much does one rail still sit higher than the other?
- is the leftover level, or showing?
- when is the leftover tilt obvious — as a picture, not a track sign-off?

Existing tools in this catalogue measure leftover road crown, leftover wheel angle, and leftover wall offset. They do not show leftover rail tilt.

## Users

- people who already know a track can look level until the leftover cant shows
- anyone who refuses to treat a road, a wheel, a wall, or a clock as this leftover
- desks that want cant as a picture, not a track spec
- teams that want a no-backend, local-only pass — not Camber, not Toe, not Plumb, not a paste well

## Workflow

1. Load the seed: 110 mm of leftover height — already showing, not level / not zero
2. Read the scene: two rails in end-on on a sleeper, one still sitting higher, leftover cant labelled
3. Move cant (or use the arrow keys on the focused slider); leftover names showing or level
4. Drop the cant toward 0 mm and both rails sit at the same height; raise it and the leftover tilt shows
5. Reset restores the seeded leftover showing

## Data model

One end-on of two rails:

- `cant` — millimetres of leftover height of one rail over the other (default 110)

Derived picture:

- leftover labelled as a sketch (level / showing), not a track sign-off
- level when cant ≤ 8 mm

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: sleeper plus two rails, leftover cant as tilt
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- two rails versus leftover tilt in end-on, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window frame, not a roof, not a clock
- seeded demo already shows a visible leftover (not level / not zero)
- live cant, leftover labelled as a sketch (level / showing)
- keyboard moves the focused control
- SVG text alternative names whether cant is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/cant/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (two rails / leftover tilt) is in the DOM
- seeded leftover is visible (showing — not level)
- changing a control redraws and updates the readout
- no paste-well hero, no crowned road, no wheels from above, no hanging bob, no eave, no window, no ceiling, no clock face

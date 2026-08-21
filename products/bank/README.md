# Bank

A wing looks level until you see the bank. Move the roll. See the leftover bank.

This is not Heel. Heel is leftover hull list. This is not Yaw. Yaw is leftover heading off a dashed course. This is not Glide. Glide is leftover range of an approach. This is not Cant. Cant is leftover rail tilt. This is not a clock. Bank answers “how far the wings still roll from level, leftover bank as seen in front view.”

## Problem

A wing looks level until you see the bank:

- how far do the wings still roll from level?
- is the leftover level, or showing?
- when is the leftover bank obvious — as a picture, not a pilot sign-off?

Existing tools in this catalogue measure leftover hull list, leftover heading, leftover approach range, and leftover rail tilt. They do not show leftover wing roll.

## Users

- people who already know a wing can look level until the leftover bank shows
- anyone who refuses to treat a hull, a heading, a range, a rail, or a clock as this leftover
- desks that want bank as a picture, not a pilot spec
- teams that want a no-backend, local-only pass — not Heel, not Yaw, not Glide, not Cant, not a paste well

## Workflow

1. Load the seed: 18° of leftover bank — already showing, not level / not zero
2. Read the scene: an aircraft in front view, two wings and a fuselage, leftover bank labelled
3. Move bank (or use the arrow keys on the focused slider); leftover names showing or level
4. Drop the bank toward 0° and the wings sit on the horizon; raise it and the leftover roll shows
5. Reset restores the seeded leftover showing

## Data model

One aircraft in front view:

- `bank` — degrees of leftover roll from level (default 18)

Derived picture:

- leftover labelled as a sketch (level / showing), not a pilot sign-off
- level when bank ≤ 2°

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: two wings, a fuselage, leftover bank as roll
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- two wings versus leftover roll in front view, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window frame, not a roof, not a rail, not a hull, not a retaining wall, not a brick course, not a clock
- seeded demo already shows a visible leftover (not level / not zero)
- live bank, leftover labelled as a sketch (level / showing)
- keyboard moves the focused control
- SVG text alternative names whether bank is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/bank/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (two wings / leftover roll) is in the DOM
- seeded leftover is visible (showing — not level)
- changing a control redraws and updates the readout
- no paste-well hero, no hull, no heading course, no approach range, no clock face

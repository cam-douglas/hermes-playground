# Lee

A hill looks still until you see the lee. Move the hill. See the leftover shelter.

This is not Fetch. Fetch is leftover wind run over water. This is not Yaw. Yaw is a heading versus a dashed course. This is not Bank. Bank is leftover wing roll. This is not a clock. Lee answers “how far the sheltered shadow still runs behind the hill, leftover wind shadow as seen in elevation.”

## Problem

A hill looks still until you see the lee:

- how far does the sheltered shadow still run behind the hill?
- is the leftover bare, or showing?
- when is the leftover shelter obvious — as a picture, not a weather spec?

Existing tools in this catalogue measure leftover wind run over water, leftover heading off a course, and leftover wing roll. They do not show leftover wind shadow behind a hill.

## Users

- people who already know a hill can look still until the leftover lee shows
- anyone who refuses to treat a fetch, a heading, a wing, or a clock as this leftover
- desks that want lee as a picture, not a weather sign-off
- teams that want a no-backend, local-only pass — not Fetch, not Yaw, not Bank, not a paste well

## Workflow

1. Load the seed: 80 m of leftover lee — already showing, not bare / not flush
2. Read the scene: one hill in elevation, wind from one side, leftover lee labelled as a sketch
3. Move lee (or use the arrow keys on the focused slider); leftover names showing or bare
4. Drop the lee toward 0 m and the hill looks still; raise it and the leftover shelter shows
5. Reset restores the seeded leftover showing

## Data model

One hill in elevation with leftover shelter behind it:

- `lee` — metres of leftover shelter (default 80)

Derived picture:

- leftover labelled as a sketch (bare / showing), not a weather sign-off
- leftover shelter labelled as a sketch
- bare when lee ≤ 12 m

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a hill, approach from one side, leftover shelter as the lee
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one hill leftover wind shadow in elevation, not a spreadsheet, not a Gantt, not a floor plan, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window frame, not a roof, not a rail, not a hull, not a retaining wall, not a brick course, not a wing, not a sea, not a lot line, not a crane, not a tree, not a scarf, not a clock
- seeded demo already shows a visible leftover (not bare / not flush)
- live lee, leftover labelled as a sketch (bare / showing)
- keyboard moves the focused control
- SVG text alternative names whether lee is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/lee/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (hill / leftover wind shadow) is in the DOM
- seeded leftover is visible (showing — not bare)
- changing a control redraws and updates the readout
- no paste-well hero, no sea fetch, no heading course, no wings, no clock face

# Batter

A wall looks plumb until you see the batter. Move the slope. See the leftover set.

This is not Plumb. Plumb is a hanging bob versus a wall. This is not Heel. Heel is leftover hull list. This is not Cant. Cant is leftover rail tilt. This is not a clock. Batter answers “how far the retaining-wall face still leans from plumb, leftover slope as seen in section.”

## Problem

A wall looks plumb until you see the batter:

- how far does the face still lean from plumb?
- is the leftover plumb, or showing?
- when is the leftover slope obvious — as a picture, not a soils sign-off?

Existing tools in this catalogue measure leftover vertical offset with a bob, leftover hull list, and leftover rail tilt. They do not show leftover retaining-wall slope.

## Users

- people who already know a retaining wall can look plumb until the leftover batter shows
- anyone who refuses to treat a bob, a hull, a rail, or a clock as this leftover
- desks that want batter as a picture, not a soils spec
- teams that want a no-backend, local-only pass — not Plumb, not Heel, not Cant, not a paste well

## Workflow

1. Load the seed: 14° of leftover slope — already showing, not plumb / not zero
2. Read the scene: a retaining wall in section, fill behind, face sloping back, leftover batter labelled
3. Move batter (or use the arrow keys on the focused slider); leftover names showing or plumb
4. Drop the batter toward 0° and the face sits on the vertical; raise it and the leftover set shows
5. Reset restores the seeded leftover showing

## Data model

One section of a retaining wall:

- `batter` — degrees of leftover slope from plumb (default 14)

Derived picture:

- leftover labelled as a sketch (plumb / showing), not a soils sign-off
- plumb when batter ≤ 2°

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: fill plus face, leftover batter as slope
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- retaining wall versus leftover slope in section, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window frame, not a roof, not a rail, not a hull, not a clock
- seeded demo already shows a visible leftover (not plumb / not zero)
- live batter, leftover labelled as a sketch (plumb / showing)
- keyboard moves the focused control
- SVG text alternative names whether batter is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/batter/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (retaining wall / leftover slope) is in the DOM
- seeded leftover is visible (showing — not plumb)
- changing a control redraws and updates the readout
- no paste-well hero, no hanging bob, no hull, no two rails, no clock face

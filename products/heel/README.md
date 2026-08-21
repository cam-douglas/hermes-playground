# Heel

A hull looks upright until you see the heel. Move the list. See the leftover lean.

This is not Cant. Cant is leftover rail tilt on two rails. This is not Camber. Camber is a crowned road from the side. This is not Scope. Scope is rode versus the bottom. This is not Rake. Rake is a chair back. This is not a clock. Heel answers “how far the hull still lists from upright, leftover lean as seen end-on on a waterline.”

## Problem

A hull looks upright until you see the heel:

- how far does the hull still list from upright?
- is the leftover upright, or listing?
- when is the leftover lean obvious — as a picture, not a stability sign-off?

Existing tools in this catalogue measure leftover rail tilt, leftover road crown, leftover rode versus the bottom, and leftover chair-back angle. They do not show leftover hull list.

## Users

- people who already know a hull can look upright until the leftover heel shows
- anyone who refuses to treat a rail, a road, a rode, a chair, or a clock as this leftover
- desks that want heel as a picture, not a stability spec
- teams that want a no-backend, local-only pass — not Cant, not Camber, not Scope, not Rake, not a paste well

## Workflow

1. Load the seed: 18° of leftover list — already listing, not upright / not zero
2. Read the scene: a hull in end-on on a waterline, still leaning from upright, leftover heel labelled
3. Move heel (or use the arrow keys on the focused slider); leftover names listing or upright
4. Drop the heel toward 0° and the hull sits on the vertical; raise it and the leftover lean shows
5. Reset restores the seeded leftover listing

## Data model

One end-on of a hull:

- `heel` — degrees of leftover list from upright (default 18)

Derived picture:

- leftover labelled as a sketch (upright / listing), not a stability sign-off
- upright when heel ≤ 2°

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: waterline plus hull, leftover heel as list
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- hull versus leftover list in end-on, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a vent, not wheels, not a chair, not a stair, not a pedal, not a ceiling, not a heading, not a glide, not a window frame, not a roof, not a rail, not a clock
- seeded demo already shows a visible leftover (not upright / not zero)
- live heel, leftover labelled as a sketch (upright / listing)
- keyboard moves the focused control
- SVG text alternative names whether heel is listing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/heel/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (hull / leftover list) is in the DOM
- seeded leftover is visible (listing — not upright)
- changing a control redraws and updates the readout
- no paste-well hero, no two rails, no crowned road, no rode versus the bottom, no chair, no clock face

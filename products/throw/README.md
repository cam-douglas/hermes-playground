# Throw

A room looks even until you feel the register. Move the throw. See the leftover air.

This is not Kelvin. Kelvin is a lamp — leftover warmth. This is not Mix Bus. Mix Bus is loudness faders. This is not Tally. Tally is talk airtime. This is not Scope. Scope is rode versus the seabed. This is not Wire Sag. Wire Sag is a hanging span. This is not a clock. Throw answers “how far does the leftover air travel before it dies.”

## Problem

A room looks even until you feel the register:

- how far does the plume travel before the air dies?
- is the leftover short of the far wall, or enough?
- does a longer throw, or a shorter room, close the gap?
- when is the shortage obvious — as a sketch, not a commissioning sign-off?

Existing tools in this catalogue colour a lamp, ride faders, tally talk, pay a rode, and hang a span. They do not show leftover air from a register.

## Users

- people who already know a room can look even while the plume dies short
- anyone who refuses to treat a lamp, a mix, talk airtime, a rode, or a clock as this leftover
- desks that want throw as a picture, not an HVAC schedule
- teams that want a no-backend, local-only pass — not Kelvin, not Mix Bus, not Tally, not a paste well

## Workflow

1. Load the seed: 3.2 m throw in a 7.5 m room, 4.3 m shy of the far wall
2. Read the scene: a wall register, a plume of thrown air, leftover labelled short
3. Move throw or room length (or use the arrow keys on the focused slider); leftover names short or enough
4. Lengthen the throw and the plume reaches; lengthen the room and the shortage grows
5. Reset restores the seeded leftover short

## Data model

One room section:

- `throw` — metres of plume reach (default 3.2)
- `room` — metres of room length (default 7.5)

Derived picture:

- leftover = throw − room (negative is short)
- labelled as a sketch (short / enough), not a commissioning sign-off

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a wall register, a dying plume, the far wall
- moving a control redraws the plume reach immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one register and one plume, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a rode, not a clock
- seeded demo already shows a visible leftover shortage
- live throw, room, leftover labelled as a sketch (short / enough)
- keyboard moves the focused control
- SVG text alternative names whether throw is short
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/throw/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (vent + plume + far wall) is in the DOM
- seeded leftover is visible (throw 3.2, room 7.5, 4.3 m short — not plenty)
- changing a control redraws and updates the readout
- no paste-well hero, no lamp, no faders, no talk columns, no rode, no clock face

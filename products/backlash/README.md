# Backlash

Two gears look meshed until you turn. Move the play. See the leftover slop.

This is not Mix Bus. Mix Bus is faders of loudness. This is not Claim Scale. Claim Scale is a beam of two claims. This is not Tally. Tally is leftover airtime. This is not a clock. Backlash answers “how much leftover play sits in the mesh before the driven gear takes up.”

## Problem

Two gears look meshed until you turn:

- how much slop sits between the teeth?
- how far has the driver turned into that play?
- how much leftover play remains before take-up?
- when does the driven gear start — as a sketch, not an engineering sign-off?

Existing tools in this catalogue mix loudness on a bus, weigh two claims on a beam, and tally leftover air. They do not show leftover play in a mesh.

## Users

- people who already know two gears can look meshed and still have slop
- anyone who refuses to treat loudness faders, a claims beam, or a clock as this leftover
- desks that want the leftover as a picture, not an engineering sign-off
- teams that want a no-backend, local-only pass — not a mix, not a beam, not a paste well

## Workflow

1. Load the seed: 16° of play, driver already turned 5°, leftover 11°
2. Read the mesh: two gears, a hatched leftover-play wedge at the bite
3. Move play or turn the driver (or use the arrow keys on the focused slider); leftover names the slop still sitting there
4. Turn past the play and the driven gear takes up
5. Reset restores the seeded leftover play

## Data model

Two gears:

- `play` — degrees of slop in the mesh (default 16)
- `turn` — degrees the driver has been turned (default 5)

Derived picture:

- take-up = min(turn, play)
- leftover = max(0, play − turn)
- driven motion = max(0, turn − play)
- labelled as a sketch, not an engineering sign-off

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: two meshing gears, driver and driven
- moving a control redraws the gears and the leftover-play arc immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- two gears, not a spreadsheet, not a Gantt, not a night plan of rooms, not a stock bar, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a plank, not a door, not talk columns, not a clock
- seeded demo already shows leftover slop
- live play, take-up, leftover slop
- keyboard moves the focused control
- SVG text alternative names the leftover play
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/backlash/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (two gears) is in the DOM
- seeded leftover is visible (play 16, turn 5, leftover 11)
- changing a control redraws and updates the readout
- no paste-well hero, no mix faders, no claims beam, no clock face, no talk columns

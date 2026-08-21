# Tally

A meeting looks even until you see who spoke. Move the floor. See the leftover air.

This is not Mix Bus. Mix Bus is faders of loudness. This is not Claim Scale. Claim Scale is a beam of two claims. This is not a clock. Tally answers “who has more floor, and by how many leftover minutes of air.”

## Problem

A meeting looks even until you see who spoke:

- who has been talking?
- who is quiet?
- how many leftover minutes sit between the two voices?
- who leads the floor — as a sketch, not a meeting-minutes sign-off?

Existing tools in this catalogue mix loudness on a bus and weigh two claims on a beam. They do not show leftover airtime between two voices.

## Users

- people who already know a meeting can look even and still belong to one voice
- anyone who refuses to treat loudness faders, a claims beam, or a clock as this leftover
- desks that want the leftover as a picture, not a meeting-minutes sign-off
- teams that want a no-backend, local-only pass — not a mix, not a beam, not a paste well

## Workflow

1. Load the seed: A already talking too long at 24 minutes, B at 11, leftover 13
2. Read the floor: two stacked columns of airtime, the leftover gap between them
3. Move A or B (or use the arrow keys on the focused slider); the leftover names who leads
4. Give the floor hands one minute to the quieter voice
5. Reset restores the seeded uneven floor

## Data model

Two voices:

- `a` — minutes of airtime for voice A (default 24)
- `b` — minutes of airtime for voice B (default 11)

Derived picture:

- leftover = |A − B|
- who leads: A (A &gt; B), B (B &gt; A), even (A = B)
- labelled as a sketch, not a meeting-minutes sign-off

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: two talk columns of stacked minute-blocks
- moving a control redraws the stacks and the leftover gap immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- two airtime columns, not a spreadsheet, not a Gantt, not a night plan of rooms, not a stock bar, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a plank, not a door, not a clock
- seeded demo already shows A talking too long
- live A minutes, B minutes, leftover (who leads, by how much)
- keyboard moves the focused control
- SVG text alternative names who leads
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/tally/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (two airtime columns) is in the DOM
- seeded leftover is visible (A 24, B 11, leftover 13)
- changing a control redraws and updates the readout
- no paste-well hero, no mix faders, no claims beam, no clock face

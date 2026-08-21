# Scope

The rode looks plenty until you see the depth. Pay more chain. See the leftover hold.

This is not Depth. Depth is which plane is sharp — focus blur. This is not Wire Sag. Wire Sag is a hanging span. This is not Plumb. Plumb is a vertical bob. This is not Kerf. Kerf is the gap the blade ate. This is not Offcut. Offcut is remaining stock length. This is not a clock. Scope answers “do you have enough chain for the bottom.”

## Problem

The rode looks plenty until you see the depth:

- how much rode is paid versus the water depth?
- is the leftover short of a ~7:1 hold, or enough chain for the bottom?
- does paying more chain, or a shallower bottom, change the angle?
- when is the shortage obvious — as a sketch, not a skipper sign-off?

Existing tools in this catalogue hang a span, hang a bob, and name which plane is sharp. They do not show leftover rode versus the seabed.

## Users

- people who already know a long-looking rode can still be short for the depth
- anyone who refuses to treat focus blur, a hanging cable, a plumb bob, or a clock as this leftover
- desks that want the hold as a picture, not a tide table
- teams that want a no-backend, local-only pass — not Depth, not Wire Sag, not Plumb, not a paste well

## Workflow

1. Load the seed: 24 m rode in 8 m of water, 3.0:1, 32 m shy of a 7:1 hold
2. Read the scene: a hull on water, a rode paid to the seabed, leftover labelled short
3. Move rode paid or water depth (or use the arrow keys on the focused slider); leftover names short or enough
4. Pay more chain and the angle shallows; deepen the water and the shortage grows
5. Reset restores the seeded leftover short

## Data model

One hold:

- `rode` — metres of chain paid (default 24)
- `depth` — metres of water (default 8)

Derived picture:

- ratio = rode / depth
- needed ≈ 7 × depth
- leftover = rode − needed (negative is short)
- labelled as a sketch, not a skipper sign-off

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: a hull on water, a rode to the seabed
- moving a control redraws the rode length and the angle to the bottom immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- one hull and one rode, not a spreadsheet, not a Gantt, not a night plan of rooms, not a cut-list stick, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a lamp, not a road crown, not a focus plane, not a partition, not a grain-angle dial, not a door, not talk columns, not gears, not a kerf gap, not a clock
- seeded demo already shows a visible leftover shortage
- live depth, rode, ratio, leftover labelled as a sketch (short / enough)
- keyboard moves the focused control
- SVG text alternative names whether scope is short
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/scope/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (hull + rode + bottom) is in the DOM
- seeded leftover is visible (rode 24, depth 8, ratio 3.0, 32 m short — not a 7:1 plenty)
- changing a control redraws and updates the readout
- no paste-well hero, no hanging span, no focus-plane blur, no plumb bob, no clock face

# Horn

The shoulder is cut, but a horn still sits. Move the leftover horn. See the residual length of tenon still sitting past a fixed intended shoulder.

This is not Shoulder. Shoulder is the joint shoulder itself. This is not Cheek. Cheek is the tenon cheek face. This is not Tenon. Tenon is the tongue of the joint. This is not Nib. Nib is a corner after intersecting cuts. This is not Proud. Proud is a high leftover above the face. This is not Chip. Chip is a discrete flake from the chisel. This is not Skip. Skip is a low missed patch after the planer. This is not joinery advice. This is not a mill sign-off. Horn answers “how long leftover tenon length still sits past a fixed intended shoulder.”

## Problem

The shoulder is cut, but a horn still sits:

- how much leftover sitting horn still sits on the tenon past a fixed intended shoulder?
- is the leftover pared, or showing?
- when is the leftover horn obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover joint shoulders, leftover tenon cheeks, leftover tenon tongues, leftover corner nibs, leftover highs, leftover chips, leftover skips, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover horn — leftover length of tenon still sitting past a fixed intended shoulder, not Shoulder leftover bearing, not Cheek leftover side face, not Tenon leftover tongue, not Nib leftover corner.

## Users

- people who already know a shoulder cut can still leave one leftover horn sitting on the tenon
- anyone who refuses to treat a joint shoulder, a cheek face, a tenon tongue, a corner nib, a proud high, a sitting chip, a skip, a packed sky, or a clock as this leftover
- desks that want horn as a sketch, not a mill sign-off, and not joinery advice
- teams that want a no-backend, local-only pass — not Shoulder, not Cheek, not Tenon, not a paste well

## Workflow

1. Load the seed: 4 mm of leftover horn — already showing, not a pared-only tenon
2. Read the scene: one workpiece, one fixed intended shoulder, a leftover whose leftover is one leftover horn sitting on the tenon past that shoulder, leftover labelled as a sketch
3. Move leftover horn (or use the arrow keys on the focused slider); leftover names showing or pared
4. Drop the leftover toward 0 mm and the tenon looks pared / no leftover horn; raise it and a longer leftover horn still sits past a fixed shoulder
5. Reset restores the seeded leftover showing

## Data model

One workpiece with leftover horn as leftover length of tenon that still sits past a fixed intended shoulder:

- `horn` — millimetres of leftover sitting horn length past a fixed intended shoulder (default 4)

Derived picture:

- leftover labelled as a sketch (pared / showing), not a mill sign-off
- leftover horn labelled as a sketch
- pared / no leftover horn when horn ≤ 1 mm (integer slider means 0 or 1)

Nothing is persisted. Refresh restores the seeded scene. Empty state is named pared — not “horn”.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one workpiece with a fixed intended shoulder and one leftover horn sitting on the tenon past that shoulder (not the shoulder itself, not the cheek face, not the tenon tongue, not a corner nib)
- moving a control redraws the leftover immediately; the shoulder does not move
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover length of tenon sitting past a fixed intended shoulder, not the shoulder as the hero, not the cheek as the hero, not the tenon as the hero, not a corner nib as the hero, not a proud as the hero, not a sitting flake as the hero, not a clock
- seeded demo already shows a visible leftover (not a pared-only tenon)
- live leftover horn, leftover labelled as a sketch (pared / showing)
- keyboard moves the focused control
- SVG text alternative names whether the horn is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/horn/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one workpiece / leftover horn sitting on the tenon past a fixed intended shoulder) is in the DOM
- seeded leftover is visible (showing — not pared)
- changing a control redraws and updates the readout; the shoulder stays fixed
- empty state is named pared — not “horn”
- no paste-well hero, no shoulder as the hero, no cheek as the hero, no tenon as the hero, no nib as the hero, no clock face

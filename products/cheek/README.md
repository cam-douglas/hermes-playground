# Cheek

A tenon looks bare until you see the cheek. Move the side. See the leftover cheek still sitting on the tenon.

This is not Shoulder. Shoulder is leftover bearing that still sits at the joint. This is not Tenon. Tenon is leftover tongue that still projects from a mate. This is not Housing. Housing is leftover shallow recess that still sits across a face. This is not Lap. Lap is leftover half-thickness overlap that still sits along a face. This is not Rabbet. Rabbet is leftover rebate shoulder that still sits along an edge. This is not Fox. Fox is leftover hidden wedge that still sits in the tenon. This is not a cut-list. This is not a paste well. This is not a clock. Cheek answers “how much leftover side face still sits on the tenon.”

## Problem

A tenon looks bare until you see the cheek:

- how much leftover side still sits on the tenon?
- is the leftover bare, or showing?
- when is the leftover cheek obvious — as a sketch, not a mill sign-off?

Existing tools in this catalogue measure leftover bearing at a joint, leftover tongue on a mate, leftover recess across a face, leftover overlap along a face, leftover rebate along an edge, leftover wedge in the tenon, leftover millimetres of stock, leftover paper creases, leftover packed sky, leftover desk-keys, leftover desk-pins. They do not show leftover cheek — leftover side face still sitting on the tenon, leftover cheek still sitting on the tenon, not Shoulder leftover bearing at a joint, not Tenon leftover tongue on a mate.

## Users

- people who already know a tenon can look bare until the leftover side face shows on the tenon
- anyone who refuses to treat a shoulder bearing, a tenon tongue, a housing recess, a fox wedge, a packed sky, or a clock as this leftover
- desks that want cheek as a sketch, not a mill sign-off
- teams that want a no-backend, local-only pass — not Shoulder, not Tenon, not Housing, not Fox, not a paste well

## Workflow

1. Load the seed: 11 mm of leftover cheek — already showing, not a bare-only tenon
2. Read the scene: one tenon, a leftover whose leftover is the cheek, leftover labelled as a sketch
3. Move leftover cheek (or use the arrow keys on the focused slider); leftover names showing or bare
4. Drop the leftover toward 0 mm and the tenon looks bare / no leftover cheek; raise it and a taller leftover cheek still sits on the tenon
5. Reset restores the seeded leftover showing

## Data model

One tenon with leftover cheek as leftover side face that still sits on the tenon:

- `cheek` — millimetres of leftover side (default 11)

Derived picture:

- leftover labelled as a sketch (bare / showing), not a mill sign-off
- leftover side labelled as a sketch
- bare / no leftover cheek when side ≤ 2 mm (the tenon looks bare, no leftover cheek)

Nothing is persisted. Refresh restores the seeded scene.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG scene: one tenon — a leftover whose leftover is the cheek; leftover is leftover side face still sitting on the tenon (not a shoulder bearing, not a tenon tongue length, not a housing recess, not a fox wedge)
- moving a control redraws the leftover immediately
- `?embed=1` hides catalogue chrome so the hub living well can iframe this page
- no network, no npm, no localStorage

## UX

- leftover side face still sitting on one tenon, not a shoulder bearing as the hero, not a tenon tongue as the hero, not a housing recess as the hero, not a fox wedge as the hero, not a clock
- seeded demo already shows a visible leftover (not a bare-only tenon)
- live leftover cheek, leftover labelled as a sketch (bare / showing)
- keyboard moves the focused control
- SVG text alternative names whether the cheek is showing
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/cheek/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (one tenon / side / leftover cheek) is in the DOM
- seeded leftover is visible (showing — not bare)
- changing a control redraws and updates the readout
- no paste-well hero, no shoulder bearing as the hero, no tenon tongue as the hero, no housing recess as the hero, no fox wedge as the hero, no clock face

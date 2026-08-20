# Kelvin

A lamp is on or off until you see the temperature. Move kelvin. See the warmth.

This is not Mix Bus. Mix Bus is faders of loudness. This is not Dark Floor. Dark Floor is rooms. This is not Pager Face. Pager Face is a clock. Kelvin answers “how warm is this light.”

## Problem

A lamp is on or off until you see the temperature:

- what correlated color temperature is the lamp?
- is this candle, tungsten, halogen, dawn, or noon?
- how much leftover warmth sits below daylight?
- what happens if you cool the scene toward noon?

Existing tools in this catalogue hang a cable, hang a bob, mix channels, weigh claims, fold a sheet, and pack grams. They do not show the warmth of a lamp.

## Users

- people who already know a lamp can be on and still be the wrong temperature
- anyone who refuses to treat a paste of a lighting plot as the product
- desks that want leftover warmth as a picture, not a scorecard
- teams that want a no-backend, local-only pass — not a mix, not rooms, not a clock

## Workflow

1. Load the seed: already warm at 2700 K, tungsten
2. Read the scene: a lamp, a window, a wall washed in that temperature
3. Move kelvin (or use the arrow keys on the focused slider); the fill and the light recolor
4. Named ticks sit on the rail: candle / tungsten / halogen / dawn / noon
5. Reset restores the seeded warmth

## Data model

One scene:

- `kelvin` — correlated color temperature from 2200 K (candle) to 6500 K (noon); default 2700

Derived picture:

- fill and light color from a Tanner–Helland CCT approximation
- nearest named stop on the candle / tungsten / halogen / dawn / noon rail
- leftover warmth = 6500 − kelvin (how far the scene sits below noon)

Nothing is persisted. Refresh restores the seeded warmth.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG: a lamp, a window, and a wall
- the slider recolors the scene immediately
- no network, no npm, no localStorage

## UX

- one scene, not a spreadsheet, not a Gantt, not a floor plan, not a stock bar, not a bag, not a crease diagram, not a claims beam, not a mixer, not a plumb bob, not a catenary, not a clock
- seeded demo is already warm on load
- live kelvin readout and named stop
- keyboard moves the focused slider
- SVG text alternative names the kelvin value and the named stop
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/kelvin/`

## Verification

- page loads in a browser without build tooling
- one SVG scene (lamp / window / wall) is in the DOM
- seeded kelvin is warm (~2700)
- moving the slider changes the scene color and the live K readout
- no paste-well hero, no mix, no rooms, no clock

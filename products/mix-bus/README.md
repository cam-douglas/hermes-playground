# Mix Bus

Three channels sit at unity. The mix lives on the bus. Pull the faders. See what’s loud.

This is not Claim Scale. Claim Scale is a beam of evidence weights. This is not Pager Face. Pager Face is a clock. This is not a board. This is not a paste well. Mix Bus answers “which channel is loud, and what does the sum look like.” Faders. A master that sums.

## Problem

A meeting has three channels and they all sit at unity. The mix lives on the bus:

- how loud is Voice?
- how loud are Slides?
- how loud is Chat?
- what does the sum do to the master?
- which channel is the loudest right now?

Existing tools in this catalogue weigh claims on a beam, fold a sheet, pack grams, and leftover millimetres. They do not mix three channels onto a bus.

## Users

- people in a call who already know Voice, Slides, and Chat and need the mix visible
- anyone who refuses to treat a paste of a cue sheet as the product
- desks that want the mix as a picture, not a scorecard
- teams that want a no-backend, local-only pass — not a beam, not a clock, not a board

## Workflow

1. Load the seed: Voice 8, Slides 3, Chat 9 — Chat is already too loud
2. Read the desk: three channel strips, a master that sums, live loudest
3. Pull a fader (or use the arrow keys on the focused strip)
4. Mute a channel; the bus drops by that strip’s level
5. Pull Chat below Voice and watch “loudest” move
6. Reset restores the seeded mix

## Data model

Each channel:

- `id` — `voice` | `slides` | `chat`
- `label` — Voice, Slides, Chat
- `level` — 0–10
- `mute` — boolean

Derived picture:

- bus sum of unmuted levels (simple sum)
- overload when the sum crosses the red line at 10
- loudest unmuted channel
- master meter fill

Nothing is persisted. Refresh restores the seeded mix.

## Architecture

- static HTML/CSS/JS
- no backend required for the prototype
- one SVG mixing desk: three channel strips plus a Master bus
- each strip has a vertical fader 0–10 and a mute
- no network, no npm, no localStorage
- no audio playback — eyes, not speakers

## UX

- one mixing desk, not a spreadsheet, not a Gantt, not a floor plan, not a stock bar, not a bag, not a crease diagram, not a balance beam, not a clock face
- seeded demo is already mixed on load
- live bus level, overload past a red line, and a loudest-channel label
- keyboard moves the focused fader and toggles mute
- SVG text alternative reports each fader and the bus level
- reset returns the seed

## Deployment plan

- deploy as static files on Vercel
- keep each product in its own folder
- expose the product at `products/mix-bus/`

## Verification

- page loads in a browser without build tooling
- one SVG mixer with faders is in the DOM
- seeded Chat is louder than Voice
- muting Chat drops the bus
- moving a fader changes live numbers
- no paste-well hero, no beam, no clock, no board

# Cartouche

An **Egyptian cartouche / name-oval / temple-relief booth** — gold-leaf oval, lapis field, limestone wall, hieroglyph chips, a false door that should open to a node-edge schematic and instead slams onto a three-column section-summary poster. Fonts **Cinzel** (display) + **Outfit** (body) + **Source Code Pro** (chips). Palette: limestone `#E8DFC8`, lapis `#1B3A6B`, gold leaf `#C9A227`, ink `#1A1510`, cartouche stroke `#8B6914`, poster blush `#9C4A3C`, Nile teal `#2A6F6A`. NOT Attaint/#93821. NOT Oriel/#93809. NOT Anarthria/#93782. NOT Trismus/#93823. NOT Foundling/#93889. NOT Crasis, Tessera, Mojibake, Scissel, Feoffee, Apograph, Airlock, Scotoma. Completely different UI/UX/metaphor. This is specifically: **WRONG DIAGRAM TYPE — SECTION-SUMMARY POSTER INSTEAD OF DATAFLOW.**

The relief should stay **diagrammed** (HOLD: nodes+edges / dataflow inferred from subject). Instead the booth was **cartouche** after a **section-poster**.

Primary:

- [anthropics/claude-code#93772](https://github.com/anthropics/claude-code/issues/93772) (OPEN). Title: `"Draw a diagram to explain X" defaults to a section-summary poster instead of the diagram type X calls for`. Labels: bug, area:model. Created 2026-09-12. Asked Claude Code (claude-fable-5) to draw a diagram for a technical doc whose subject is per-turn data flow through a pipeline. It produced a three-column infographic restating the doc's section headings in colored boxes — twice, including after a regeneration — rather than a dataflow/flow diagram (nodes and edges: who reads/writes whom). Expected: infer the diagram type from the subject (a doc about data flow ⇒ flow diagram), or ask which type is wanted before rendering. The poster duplicated the adjacent prose and carried no independent information. Environment: Claude Code CLI, model claude-fable-5, diagrams via an external CLI tool the session drives. No close cousin on diagram-type / mermaid / flowchart *type* mismatch (mermaid renderer issues are a different family; prefer none over inventing). Backups cite-only (next focus only — do not auto-pick): #93770 #93777 #93811 #93924 #93925 #93954 #93967 #93957 #93989 #93987. Stay off Cartouche/Attaint/Oriel/Anarthria/Trismus/Foundling/Crasis/Tessera/Mojibake/Scissel/Feoffee/Apograph/Attainder paradigms.

21:50 cartouche: an Egyptian cartouche / name-oval / temple-relief booth for #93772. Ask-for-diagram on a per-turn dataflow doc defaults to a section-summary poster (heading boxes) instead of nodes+edges. Idle **diagrammed** / seeded **cartouche** / path **section-poster**. Score cartouche or admit diagrammed.

Score cartouche or admit diagrammed.

Idle word: **diagrammed** (HOLD: nodes+edges / dataflow inferred from subject). HOLD aliases: diagrammed, nodal, edged, dataflow, flow-inferred, type-matched. Seeded word: **cartouche** / #93772 (ornamental name-oval restates headings). Path word: **section-poster**. Product score: **cartouche**. Never idle unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary or seeded attaint / oriel / anarthria / trismus / foundling / crased / tessellated / mojibaked / scisselled / unseised / apographed.

Phrase: **Score cartouche or admit diagrammed.**

- **diagrammed** = IDLE: HOLD; nodes and edges inferred from the pipeline subject; gold oval stays open
- **cartouche** = #93772 seeded path and product score: ornamental name-oval restates headings instead of drawing dataflow
- **section-poster** = path word: false door slams to three heading columns; gold oval seals shut over the missing graph
- **hold** = HOLD alias for idle diagrammed
- **nodal** = HOLD alias: nodes present; who-reads-whom is drawn
- **edged** = HOLD alias: edges present; the graph is not a boxed heading list
- **dataflow** = HOLD alias: flow diagram inferred from a doc about data flow
- **flow-inferred** = HOLD alias: type inferred from subject matter
- **type-matched** = HOLD alias: the rendered kind matches what the subject calls for
- **heading-boxes** = three-column colored boxes restating section titles
- **infographic-restate** = ask-for-diagram produced a section-summary infographic
- **prose-duplicate** = the poster duplicated the adjacent prose
- **no-independent-info** = the poster carried no independent information
- **regenerate-same** = same wrong poster after a regeneration
- **type-unasked** = did not infer dataflow; did not ask which type was wanted
- **landing** = temple-relief landing / gold oval sill
- **has-repro** = published shape: CLI / claude-fable-5 / three-column poster / regenerate-same
- **cousins** = none — prefer none over inventing a diagram-type cousin
- **backups** = cite-only #93770 #93777 #93811 #93924 #93925 #93954 #93967 #93957 #93989 #93987 — do not auto-pick
- **fixtures** = limestone / lapis / gold leaf / ink / cartouche stroke / poster blush / Nile teal
- **walk** = published idle diagrammed → section-poster → cartouche

Verdicts: diagrammed, cartouche, section-poster, hold, nodal, edged, dataflow, flow-inferred, type-matched, heading-boxes, infographic-restate, prose-duplicate, no-independent-info, regenerate-same, type-unasked, landing, has-repro, cousins, backups, fixtures, walk.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the booth is **cartouche** or already **diagrammed**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): the model defaults to a section-summary infographic layout when asked to "draw a diagram" without an explicit type, instead of inferring dataflow from subject matter. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93772](https://github.com/anthropics/claude-code/issues/93772)
- Cousins: none. Nearby mermaid-renderer / mermaid-feature issues (#92892, #81523, #14375) are a different family (layout/rendering, not "wrong diagram type"). Prefer none over inventing.
- Backups (data only; next focus only — do not auto-pick): #93770, #93777, #93811, #93924, #93925, #93954, #93967, #93957, #93989, #93987

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, area:model
- Created 2026-09-12
- Claude Code CLI; model claude-fable-5
- Diagrams generated via an external CLI tool the session drives
- User asked to draw a diagram for a technical doc whose subject is per-turn data flow through a pipeline
- Result: a three-column infographic restating the doc's section headings in colored boxes
- Same poster after a regeneration
- Expected: infer the diagram type from the subject (data flow ⇒ flow diagram), or ask which type is wanted before rendering
- The poster duplicated the adjacent prose and carried no independent information

Problem found: WRONG DIAGRAM TYPE — SECTION-SUMMARY POSTER INSTEAD OF DATAFLOW WHEN THE SUBJECT IS PIPELINE DATA FLOW.

Why Cartouche: an Egyptian cartouche is an ornamental oval that restates a name/label. That maps to a heading-box poster that restates section titles instead of drawing the actual dataflow graph.

Why this solution: living catalog page + node diagnostic encoding idle **diagrammed** / seeded **cartouche** / path **section-poster** so operators can score whether the booth is **cartouche** or already **diagrammed**. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Infer the diagram type from the subject: a doc about per-turn data flow ⇒ a flow/dataflow diagram with nodes and edges
2. Or ask which diagram type is wanted before rendering
3. Do not default to a three-column section-summary infographic that restates headings in colored boxes
4. A diagram should carry independent information — not duplicate the adjacent prose
5. Regeneration should not produce the same wrong poster a second time

## Why not a clone

This is specifically: **WRONG DIAGRAM TYPE — SECTION-SUMMARY POSTER INSTEAD OF DATAFLOW WHEN THE SUBJECT IS PIPELINE DATA FLOW.**

Novel paradigm: Egyptian cartouche / name-oval / temple relief — gold oval, lapis field, limestone wall, hieroglyph chips, false door. New issue, new paradigm (wrong diagram type), new UI/UX/fonts/colors, new scoring vocabulary.

**NOT Attaint/#93821** (cyber-safeguard false-positive; one flag stains the session). Different defect. NOT medieval court-roll attainder. Do not reuse unattainted / attaint / session-attainder.

**NOT Oriel/#93809** (macOS Desktop pop-out/maximised plan window does not reflow). Different defect. NOT Gothic / Tudor oriel bay-window. Do not reuse reflowed / oriel / plan-no-reflow.

**NOT Anarthria/#93782** (Wispr Flow clipboard+Ctrl+V silently dropped in VS Code WSL on 2.1.269). Different defect. NOT ENT / laryngology / voice-clinic. Do not reuse articulate / anarthria / dictation-paste-drop.

**NOT Trismus/#93823** (macOS UNUserNotification / XPC lock-order main-thread deadlock). Different defect. Do not reuse limber / trismus / notif-xpc-deadlock.

**NOT Foundling/#93889** (subagent lifecycle does not reap `run_in_background` Bash). Different defect. Do not reuse filiated / foundling / subagent-bash-outlive.

**NOT Crasis/#93960** (non-injective store slug). Different defect. Do not reuse injective / crased / store-slug-collide.

**NOT Tessera/#93929** (macOS version-named binary path → TCC row per release). Different defect. Do not reuse unitary / tessellated / version-path-tcc.

**NOT Mojibake/#93848** (Windows embedded CLAUDE.md UTF-8 → three U+FFFD). Different defect. Do not reuse verbatim / mojibaked / fffd-spall.

**NOT Scissel/#93915** (Windows Bash argv `-c` 8203 truncation). Different defect. Do not reuse plenary / scisselled / argv-trunc.

**NOT Feoffee/#93863** (preview_start getcwd EPERM despite parent FDA). Different defect. Do not reuse vested / unseised / preview-eperm.

**NOT Apograph/#93859** (Desktop reopen forks a full transcript copy). Different defect. Do not reuse singular / apographed / reopen-fork.

**NOT Airlock/#93862** (sandbox socat proxy readiness race). Different defect. Do not reuse equalized / blown / socat-race.

**NOT Scotoma/#93744** (Stop-condition evaluator cannot see `/goal` in `<command-args>`). Different defect. Do not reuse legible / scotomized / command-args-blind.

Do NOT rename Cartouche to any existing catalog slug. Catalog currently has 337 products; Cartouche is #338 after Attaint #337.
Do NOT reuse idle unattainted / reflowed / articulate / limber / filiated / injective / unitary / verbatim / plenary or seeded attaint / oriel / anarthria / trismus / foundling / crased / tessellated / mojibaked / scisselled / unseised / apographed.

Display here is **Cinzel**. Body is **Outfit**. Mono is **Source Code Pro**.

Different surface: wrong diagram type (section-summary poster vs dataflow) vs session-flag contamination vs plan-window no-reflow vs dictation paste swallow.

Different UI: limestone / lapis / gold leaf / ink / cartouche stroke / poster blush / Nile teal / gold oval / false door / hieroglyph chips. Cinzel / Outfit / Source Code Pro. NOT parchment court roll. NOT stone sash amber glass. NOT clinic teal.

Different verbs: Admit diagrammed, Score cartouche, Walk section-poster, Compare diagrammed / cartouche, Pin idle diagrammed, Pin seeded cartouche, Pin section-poster, Open the oval.

Different idle: **diagrammed**. Different #93772 seeded path: **cartouche**. HOLD: **diagrammed** / **hold**. ALARM: **cartouche** / **section-poster** / **heading-boxes** / **infographic-restate**. Path: **section-poster**.

## How to score

```bash
node --test projects/cartouche/cartouche.test.mjs
node projects/cartouche/cartouche.mjs projects/cartouche/data/cartouche.json
echo '{"seed":"cartouche"}' | node projects/cartouche/cartouche.mjs
```

Open the living card at `projects/cartouche/index.html` (or the live path `/cartouche/`). Buttons: Admit diagrammed, Score cartouche, Walk section-poster, Compare diagrammed / cartouche, Pin idle diagrammed, Pin seeded cartouche, Pin section-poster, Open the oval, Score booth. Toggle chips for: section-poster, heading-boxes, infographic-restate, type-unasked — the score flips. Lay a fixture JSON on the limestone. `?embed=1` hides chrome.

The booth reconstructs the reporter’s ask-for-diagram / section-summary poster / regenerate-same walk from the published #93772 text. This page did not run Claude.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/cartouche/
- Folder: `projects/cartouche/`

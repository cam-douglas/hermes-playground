# Prosopon

A **Greek theatre / prosopon / tragic-mask / skene / orchestra booth** — *Prosopon* (πρόσωπον) is the Greek theatrical face/mask/person — the role's face on stage. The background-agent view should show the subagent's own face (requested model). Instead the parent's advisor attachment paints Fable on the mask while the actor speaks Sonnet/Opus/Haiku lines. Fonts **Cormorant Infant** (display) + **Sora** (UI) + **IBM Plex Mono** (chips). Palette: stage black `#0B0A0F`, mask clay `#C4A574`, olive leaf `#3F5E3A`, torch gold `#E2B457`, wine `#6B1E2A`, marble `#E8E0D4`. Fresh trio. Completely different UI/UX/metaphor — clay mask / olive wreath / torch / marble plinth / skene / orchestra / night amphitheatre. NOT a Renaissance masque. NOT a herald college. NOT a dry-dock. NOT a river gauge.

The mask should stay **ascribed** (HOLD: badge shows the subagent's requested / running model). Instead the booth was **miscast** after an **advisor-shadow**.

Primary:

- [anthropics/claude-code#94575](https://github.com/anthropics/claude-code/issues/94575) (OPEN). Title: `Background-agent view shows the parent's advisor model (Fable) instead of the subagent's requested model`. Labels: bug, has repro, platform:macos, area:agent-view. Environment: Claude Code 2.1.270, macOS (Darwin 25.6.0); parent model claude-fable-5-1; subagents via Agent tool with subagent_type general-purpose and model sonnet/opus/haiku. When a Fable 5.1 session spawns a subagent with Agent tool `model` override, the background-agent / task view labels the task as Fable. The subagent actually runs on the requested model; the transcript proves it. The wrong label appears to come from the `advisor_tool` attachment (`attachment.type == advisor_tool`, `model` = parent's advisor model Fable), not from the subagent's own assistant turns. Stay off Slipway/Freshet/Kintsugi/Cenotaph/Stratum/Tmesis/Vedette/Orloj/Brisure/Diptych/Vizard paradigms.

05:50 prosopon: a Greek theatre / prosopon / tragic-mask / skene / orchestra booth for #94575. Background-agent view paints parent's advisor model (Fable) from advisor_tool attachment while subagent turns run on requested sonnet/opus/haiku. Idle **ascribed** / seeded **miscast** / path **advisor-shadow**. Score prosopon or admit ascribed.

Score prosopon or admit ascribed.

Idle word: **ascribed** (HOLD: badge shows the subagent's requested / running model). HOLD aliases: credited, named, billed. Seeded word: **miscast** / #94575 (the advisor-shadow path). Path word: **advisor-shadow**. Product score: **prosopon**. Never idle moored / lashed / warped / fendered / slipped / buoyed / mended / homed / shared / contiguous / stationed / lasting / enrolled / single / pledged / brisk / cadence / released / lit / primed / raised / preserved / tokenized / blazoned / tabard or seeded Slipway / Freshet / Kintsugi / Cenotaph / Stratum / Tmesis / Vedette / Orloj / Brisure / Diptych / Vizard or path names from those booths.

Phrase: **Score prosopon or admit ascribed.**

- **ascribed** = IDLE HOLD: badge shows the subagent's requested / running model
- **miscast** = seeded path: parent's advisor paints Fable on the mask
- **advisor-shadow** = path word: badge appears to read advisor_tool.attachment.model
- **credited** = HOLD alias: the running model is still credited
- **named** = HOLD alias: the actor is still named
- **billed** = HOLD alias: the speaker is still billed
- **parent-badge** = background-agent view shows the parent's advisor model
- **fable-paint** = advisor attachment paints claude-fable-5-1 on the mask
- **sonnet-turn** = own assistant turns are claude-sonnet-5
- **opus-turn** = own assistant turns are claude-opus-5
- **haiku-turn** = own assistant turns are claude-haiku-4-5-20251001
- **advisor-attachment** = attachment.type == advisor_tool; model = parent's advisor
- **label-lie** = badge says Fable while own turns honoured the override
- **override-honoured** = Agent model override actually ran; transcript proves it
- **94575** = issue number seed
- **landing** = Greek theatre / prosopon / tragic-mask / skene / orchestra
- **has-repro** = published shape: CLI 2.1.270 · macOS · Fable parent · Agent model override
- **cousins** = cite-only #76381 — do not rebuild; do not conflate
- **backups** = cite-only #93924 #93770 #93777 #94151 #94564 #94546 #94547 — do not auto-pick
- **fixtures** = clay mask / olive wreath / torch
- **walk** = published idle ascribed → advisor-shadow → miscast
- **closed** = #94575 remains OPEN — cite only; not this booth

Verdicts: ascribed, miscast, advisor-shadow, credited, named, billed, parent-badge, fable-paint, sonnet-turn, opus-turn, haiku-turn, advisor-attachment, label-lie, override-honoured, 94575, landing, has-repro, cousins, backups, fixtures, walk, closed.

This is a diagnostic scoring booth. Not an exploit. No Claude sessions. No network to Anthropic required for scoring. Score whether the booth is **prosopon** or already **ascribed**. Fixtures use the issue's published incident only. Request reconstructions from published text are synthetic example-data. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING — issue text): the background-agent view appears to read `advisor_tool.attachment.model` (parent's advisor) for the badge instead of the subagent's own `message.model` turns. Invite verify against #94575 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#94575](https://github.com/anthropics/claude-code/issues/94575)
- Cousins: do NOT rebuild / do NOT conflate: #76381 (closed docs — Advisor tool is not inherited by background subagents, contradicting advisor docs). DIFFERENT defect (docs inheritance claim vs UI label reading advisor attachment).
- Backups (data only; next focus only — do not auto-pick): #93924, #93770, #93777, #94151, #94564, #94546, #94547

What happened (from the issue text — do not invent):

- OPEN
- Labels: bug, has repro, platform:macos, area:agent-view
- Environment: Claude Code 2.1.270, macOS (Darwin 25.6.0); parent model claude-fable-5-1
- Subagents via Agent tool with subagent_type general-purpose and model sonnet/opus/haiku
- When a Fable 5.1 session spawns a subagent with Agent tool `model` override (e.g. `model: "sonnet"`), the background-agent / task view labels the task as running on **Fable**
- The subagent actually runs on the requested model; the transcript proves it
- The wrong label appears to come from the `advisor_tool` attachment the subagent carries (`attachment.type == advisor_tool`, `model` = parent's advisor model Fable), not from the subagent's own assistant turns
- Published evidence table (four subagents, one session): sonnet / claude-sonnet-5 x83 / claude-fable-5-1 x1; opus / claude-opus-5 x86 / claude-fable-5-1 x3; haiku / claude-haiku-4-5-20251001 x33 / claude-fable-5-1 x1; sonnet / claude-sonnet-5 x27 / claude-fable-5-1 x1
- Example lines: assistant turns are claude-sonnet-5; only Fable entries are advisor attachments
- Impact: user concluded model override was ignored ("the model launched was not SONNET") until shown transcript counts

Problem found: ADVISOR-SHADOW — background-agent view paints the parent's advisor model (Fable) from the advisor_tool attachment while subagent turns run on the requested model.

Why Prosopon: A *prosopon* is the Greek theatrical face/mask/person — the role's face on stage. The background-agent view should show the subagent's own face. Instead the parent's advisor attachment paints Fable on the mask while the actor speaks Sonnet/Opus/Haiku lines. #76381 is a closed docs inheritance claim — DIFFERENT. This booth is specifically **background-agent view badge reads advisor attachment / override actually honoured**. NOT a Claude Code patch — educational diagnostic booth only.

Why this solution: an educational diagnostic booth that scores advisor-shadow honesty (ascribed vs miscast) so operators can see the four-row published counts and the painted mask without needing a Claude session. Not a Claude Code patch.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. Background-agent view shows the model the subagent runs on
2. OR shows both agent model and advisor model with distinct labels

## Why not a clone

This is specifically: **BACKGROUND-AGENT VIEW SHOWS THE PARENT'S ADVISOR MODEL (FABLE) INSTEAD OF THE SUBAGENT'S REQUESTED MODEL. TRANSCRIPT PROVES OWN TURNS RAN SONNET/OPUS/HAIKU. ONLY FABLE ENTRIES ARE ADVISOR_TOOL ATTACHMENTS. CLI 2.1.270; MACOS; PARENT CLAUDE-FABLE-5-1; AGENT TOOL MODEL OVERRIDE.**

Novel paradigm: Greek theatre / prosopon / tragic-mask / skene / orchestra / clay mask / olive wreath / torch / marble plinth / night amphitheatre — stage black, mask clay, olive leaf, torch gold, wine, marble. New issue, new paradigm (advisor-shadow), new UI/UX/fonts/colors, new scoring vocabulary. A night amphitheatre booth, not a Renaissance masque, herald college, dry-dock, river floodplain gauge, pottery bench, memorial yard, geology core, manuscript desk, cavalry lantern, or Prague clock.

**NOT #76381** (closed docs — Advisor tool is not inherited by background subagents). DIFFERENT. Do not conflate.

**NOT Slipway/#94458** (Windows Ethernet→Wi-Fi undock / iface-swap). Different defect. Do not reuse moored / slipped / iface-swap.

**NOT Freshet/#94430** (initialize flood / No messages yet). Different defect. Do not reuse buoyed / Freshet / init-flood.

**NOT Kintsugi/#94451** (marketplace rewrite never lands). Different defect. Do not reuse mended / Kintsugi / heal-abort.

**NOT Cenotaph/#94452** (dead-install / plaque polished, stone never moved). Different defect. Do not reuse homed / Cenotaph / dead-install.

**NOT Stratum/#94417** (layer-unsealed project-context). Different defect.

**NOT Tmesis/#86198** (mid-inject slash splice). Different defect.

**NOT Vedette/#94392** (headless `-p` idle-exit / false success). Different defect.

**NOT Orloj/#94393** (Monitor schema cap / half-life). Different defect.

**NOT Brisure/#94396** (herald college — do NOT use heraldry/tabard/blazon). Different metaphor.

**NOT Diptych/#94397** (wax-tablet brief-echo). Different defect.

**NOT Vizard/#94398** (Renaissance masque/visor / background-reset). DIFFERENT; Prosopon is Greek theatre face/attribution, not a vizard mask for session reset.

**NOT Treacle/Somnus/Cresset/Dictabelt.** Different defects.

Live: https://hermes-playground-green.vercel.app/prosopon/

```
node --test projects/prosopon/prosopon.test.mjs
node projects/prosopon/prosopon.mjs projects/prosopon/data/miscast.json
```

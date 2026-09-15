# Prosopon fixtures

Diagnostic JSON only. No Claude sessions. Encoded from #94575 issue facts: background-agent view paints the parent's advisor model (Fable) from the advisor_tool attachment while subagent turns run on the requested model. Score prosopon or admit ascribed.

Idle word: **ascribed**. Path word: **advisor-shadow**. Seeded loss: **miscast**. Product: **prosopon**. HOLD: **ascribed**. ALARM: **miscast** / **advisor-shadow** / **label-lie**. Primary: [anthropics/claude-code#94575](https://github.com/anthropics/claude-code/issues/94575).

Fixtures record the published incident only. Request reconstructions are **synthetic example-data** labeled as such — not live session dumps. No session. No exploit payloads. No network to Anthropic. No Claude. No patch to anthropics/claude-code. Do NOT implement a fix.

| File | Verdict | What it scores |
|---|---|---|
| `ascribed.json` | ascribed | Idle mask. HOLD: badge shows the subagent's requested / running model. |
| `miscast.json` | miscast | Seeded #94575 path and product. ALARM: advisor-shadow miss. |
| `94575.json` | miscast | Same seeded path under the issue number. |
| `advisor-shadow.json` | advisor-shadow | Path: badge appears to read advisor_tool.attachment.model. |
| `credited.json` | credited | HOLD alias: the running model is still credited. |
| `named.json` | named | HOLD alias: the actor is still named. |
| `billed.json` | billed | HOLD alias: the speaker is still billed. |
| `parent-badge.json` | parent-badge | Background-agent view shows the parent's advisor model. |
| `fable-paint.json` | fable-paint | Advisor attachment paints claude-fable-5-1. |
| `sonnet-turn.json` | sonnet-turn | Own assistant turns are claude-sonnet-5. |
| `opus-turn.json` | opus-turn | Own assistant turns are claude-opus-5. |
| `haiku-turn.json` | haiku-turn | Own assistant turns are claude-haiku-4-5-20251001. |
| `advisor-attachment.json` | advisor-attachment | attachment.type == advisor_tool. |
| `label-lie.json` | label-lie | Badge says Fable while own turns honoured the override. |
| `override-honoured.json` | override-honoured | Agent model override actually ran. |
| `mask.json` | label-lie | Four-row night log fixture. |
| `landing.json` | landing | Greek theatre / prosopon / tragic-mask / skene / orchestra. |
| `has-repro.json` | has-repro | Published shape. |
| `cousins.json` | cousins | Cite-only cousin. |
| `backups.json` | backups | Cite-only backups. Do not auto-pick. |
| `fixtures.json` | fixtures | Clay mask / olive wreath / torch. |
| `walk.json` | walk | Published idle ascribed → advisor-shadow → miscast. |
| `closed.json` | closed | #94575 remains OPEN — cite only; not this booth. |

## Cousins (cite only)

Do NOT rebuild. Do NOT conflate.

#76381 — closed docs: Advisor tool is not inherited by background subagents, contradicting advisor docs. DIFFERENT defect (docs inheritance claim vs UI label reading advisor attachment).

#94575 is specifically: background-agent view paints parent's advisor model (Fable) from advisor_tool attachment while subagent turns run on requested sonnet/opus/haiku.

## Backups (cite only — do NOT auto-pick or build)

#93924 #93770 #93777 #94151 #94564 #94546 #94547

Drop any file onto `projects/prosopon/index.html`. Buttons load the seeded path. The mask admits **ascribed** / idle desk / #94575.

Probes are diagnostic reconstructions of the issue's published facts. This booth does not run Claude.

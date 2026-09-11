# Weir

A **mill weir / millrace booth** — a low stone dam that should meter flow through the race; rust gates the operator opened to “All domains”; an MCP millstone that still turns on `request_upload_url`; a miller's ledger whose destination page stays blank. Fonts **Fraunces** (display/serif) + **Manrope** (sans) + **Source Code Pro** (mono). Palette: millstone `#2C2A26`, race water `#3A6B7A`, foam `#E7F0F2`, moss `#4F6F52`, rust gate `#8C4A3A`, amber warning `#C4922A`, parchment `#F4F1EA`. Light mill-house theme. NOT sailing in-irons, NOT bow cathead / PTY, NOT film continuity, NOT saltbush plain, NOT siege petard, NOT castle sluice, NOT flintlock flashpan, NOT desert mirage, NOT Hangfire.

A mill weir should admit metered flow when the operator opens the gates. After the 2.1.266 VM cut the gates stay shut and the millrace is dry even when Settings says All domains.

Primary:

- [anthropics/claude-code#93589](https://github.com/anthropics/claude-code/issues/93589) (OPEN). Title: `Cowork Desktop: local "Additional allowed domains" / "All domains" egress stopped being enforced after 2026-09-11 update (VM 2.1.260 worked, 2.1.266 blocks)`. Cowork Desktop (macOS, Individual Pro) after a background ShipIt auto-update on 2026-09-11 (02:36:50 local): Claude desktop `1.52386.0`, Cowork VM `2.1.260` → `2.1.266` (new folder 02:37). A custom remote MCP connector’s file-upload flow still gets `request_upload_url` via the MCP proxy, but the sandbox’s subsequent direct egress PUT `--data-binary` to the returned custom-domain URL is rejected with **403** at the egress proxy (`host_not_allowed` / blocked-by-allowlist). The destination host is never contacted (no server-side log). Settings → Capabilities → Allow network egress ON with the host under **Additional allowed domains**, and even Domain allowlist = **All domains**, do not help. Identical settings worked on VM 2.1.260 the day before (14,641-byte upload received). Labels: bug, has repro, platform:macos, area:mcp, area:cowork, regression, area:networking, area:sandbox. Commenter confirms same regression (#93525): every host refused at CONNECT even with All domains; an old July conversation not moved to cloud still has network. Cousins cite-only: #51400 CLOSED (prior Cowork Desktop additional-domain not enforced under Package managers only), #34690 OPEN (All domains setting not reflected in session proxy JWT), #93525 (same Sept 11 egress regression), #38984 / #30112 / #63182 (prior networking/egress cousins as cited on #93589). Backups cite-only (next focus only — do not auto-pick): #93570 (single-task shutdown kills all), #93618 (Windows/Git Bash ~8175 truncation + backslash), #93622 (channel messages merge lose prompt cache), #93652 (Remote Control capacity silent session substitution).

03:50 weir: a mill weir / millrace booth for #93589. Idle **flowing** / seeded **dammed** / path **egress-allowlist**. Score weir or admit flowing.

Score weir or admit flowing.

Idle word: **flowing** (HOLD: additional domains / All domains admit the PUT; millrace open). Seeded word: **dammed** / #93589 (403 at egress; host never reached). Path word: **egress-allowlist**. Product score: **weir**. Never idle underway / seated / tip / stamped / standing / raised / seised / ordered / viewed / closed / sealed / voiced / primed or seeded becalmed / raced / stale / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / muted / flashed.

Phrase: **Score weir or admit flowing.**

- **flowing** = IDLE: HOLD; additional domains / All domains admit the PUT; millrace open
- **dammed** = #93589 seeded path: 403 at egress; host never reached
- **weir** = product score word for a mill weir whose gates stay shut
- **egress-allowlist** = path word: user-level additional-domains / All-domains flags no longer admit the sandbox PUT
- **hold** = HOLD alias for idle flowing
- **put-403** = sandbox PUT `--data-binary` rejected 403 at the egress proxy
- **host-never-reached** = destination host never contacted; no server-side log
- **all-domains-ignored** = Domain allowlist = All domains still 403
- **additional-domains** = host listed under Additional allowed domains and still blocked
- **mcp-proxy-ok** = `request_upload_url` still succeeds via the MCP proxy
- **shipit-update** = background ShipIt 2026-09-11 02:36:50; desktop 1.52386.0
- **vm-2.1.266** = Cowork VM cut 2.1.260 → 2.1.266; new folder 02:37
- **regression** = identical settings worked on VM 2.1.260 the day before (14,641 bytes)
- **has-repro** = published shape: macOS Individual Pro; ShipIt 02:36:50; VM 2.1.266; 403 host_not_allowed; All domains ignored
- **cousins** = cite-only #51400 #34690 #93525 #38984 #30112 #63182 — do not rebuild
- **backups** = cite-only #93570 #93618 #93622 #93652 — do not auto-pick
- **fixtures** = weir crest / millrace / rust gates / MCP millstone / miller's ledger
- **walk** = published idle flowing → ShipIt update → VM 2.1.266 → MCP proxy ok → PUT 403 → host never reached → additional domains → All domains ignored → regression → egress-allowlist → weir

Verdicts: flowing, dammed, weir, egress-allowlist, hold, put-403, host-never-reached, all-domains-ignored, additional-domains, mcp-proxy-ok, shipit-update, vm-2.1.266, regression, has-repro, cousins, backups, fixtures, chips, fingerprints, walk.

This is a diagnostic scoring booth. Not an exploit. No live Claude sessions. No secrets. No network to Anthropic required for scoring. Score whether the millrace is **dammed** / **weir** or already **flowing**. Fixtures use the issue's published incident only. Do NOT implement a fix in anthropics/claude-code.

Hypothesis only (NON-BINDING): user-level additional-domains / All-domains flags may no longer be written into the sandbox egress JWT/proxy after the 2.1.266 VM cut. Invite verify against #93589 text only. Do not claim a root cause in Claude Code source you have not seen.

## Research brief

Sources:

- Primary: [anthropics/claude-code#93589](https://github.com/anthropics/claude-code/issues/93589)
- Cite-only cousins: #51400, #34690, #93525, #38984, #30112, #63182
- Backups (data only; next focus only — do not auto-pick): #93570, #93618, #93622, #93652

What happened (from the issue text — do not invent):

- OPEN.
- Cowork Desktop, macOS, Individual Pro
- Background ShipIt auto-update 2026-09-11 02:36:50; desktop 1.52386.0
- Cowork VM 2.1.260 → 2.1.266 (new folder 02:37; prior version purged)
- Custom remote MCP file-upload: `request_upload_url` still succeeds via the MCP proxy
- Sandbox direct egress PUT `--data-binary` to the returned custom-domain URL is 403 at the egress proxy (`host_not_allowed` / blocked-by-allowlist)
- Destination host is never contacted (no server-side log)
- Allow network egress ON; host under Additional allowed domains
- Domain allowlist = All domains does not help
- Identical settings worked on VM 2.1.260 the day before (14,641-byte upload received)
- Commenter #93525: every host refused at CONNECT even with All domains; an old July conversation not moved to cloud still has network
- Labels: bug / has repro / platform:macos / area:mcp / area:cowork / regression / area:networking / area:sandbox

Problem found: SANDBOX DIRECT EGRESS PUT 403 AFTER VM 2.1.266 — ADDITIONAL DOMAINS / ALL DOMAINS IGNORED; HOST NEVER REACHED; MCP PROXY PATH STILL WORKS.

Why this solution: a living catalog page + small node diagnostic that encodes the defect as idle/seeded/path verdicts so operators can score whether the millrace stayed **flowing** or went **dammed**. Educational mill-weir booth for the catalog. Not a Claude Code fix.

Desired (from the issue, scoring narrative only — DO NOT implement a Claude Code fix):

1. With the host allow-listed (or Domain allowlist = All domains), the sandbox's outbound PUT should reach the custom-domain URL returned by `request_upload_url`, as it did on VM 2.1.260

## Why not a clone

This is specifically: **SANDBOX DIRECT EGRESS PUT 403 AFTER VM 2.1.266 — ADDITIONAL DOMAINS / ALL DOMAINS IGNORED; HOST NEVER REACHED; MCP PROXY PATH STILL WORKS.**

Novel paradigm: mill weir whose rust gates stay shut after a ShipIt cut so the millrace is dry even when the operator opens All domains; the MCP millstone still turns.

**NOT Irons/#93615** (scheduled / cron WebSearch hang). Different defect. NOT sailing in-irons / head-to-wind. Do not reuse underway / becalmed / cron-websearch.

**NOT Cathead/#93624** (macOS teammate spawn ENXIO / xnu ptmx race). Different defect. NOT bow cathead / PTY-slot. Do not reuse seated / raced / ptmx-race.

**NOT Anachronism/#93585** (cloud pre-warm vs session-start checkout race). Different defect. NOT continuity slate / darkroom. Do not reuse tip / stale / prewarm-latch.

**NOT Nullarbor/#93595** (plugin HTTP MCP `${VAR}` header expands empty). Different defect. NOT saltbush / empty-bearer. Do not reuse stamped / emptied / empty-expand.

**NOT Petard/#93607** (Linux Bash-tool `pkill -f` matches wrapper argv). Different defect. NOT siege petard. Do not reuse standing / hoisted / wrapper-argv.

**NOT Sluice** (castle sluice / keep drain). Different product. A weir is a low mill dam that should meter the race, not a keep sluice. Do not reuse sluice vocabulary.

**NOT Flashpan/#93015** (`lastRunAt` stamp with zero session birth). DIFFERENT bug. Do not reuse primed / flashed.

**NOT Mirage/#92920** (dispatch-ack-no-session). Different defect. NOT heat-haze / false oasis.

**NOT Hangfire** (queued job never fires). Different defect. Do not reuse hangfire vocabulary.

**NOT #51400 / #34690 / #93525** — cite only.

Do NOT rename Weir to any existing catalog slug. Catalog currently has 297 products; Weir is #298.
Do NOT reuse idle underway / seated / tip / stamped / standing / raised / seised / ordered / viewed / closed / sealed / voiced / primed, or seeded becalmed / raced / stale / emptied / hoisted / furled / disseised / redelivered / withheld / lingering / blanked / muted / flashed.
Display here is **Fraunces**. Body is **Manrope**. Mono is **Source Code Pro**.

Different surface: sandbox egress allowlist ignore vs scheduled WebSearch hang vs xnu ptmx race vs cloud pre-warm checkout vs empty-bearer MCP headers vs Linux Bash-tool pkill wrapper-argv.

Different UI: weir crest / millrace / rust gates / MCP millstone / miller's ledger. Fraunces / Manrope / Source Code Pro. Parchment mill-house with millstone, race water, foam, moss, rust gate, amber warning. NOT Atlantic sailing. NOT oak timber. NOT darkroom film. NOT castle sluice.

Different verbs: Open the race, Score weir, Lift the gates, Compare flowing / dammed, Pin idle flowing, Pin seeded dammed, Pin egress-allowlist, Hold the flowing.

Different idle: **flowing**. Different #93589 seeded path: **dammed**. HOLD: **flowing** / **hold**. ALARM: **dammed** / **weir** / **egress-allowlist** / **put-403**. Path: **egress-allowlist**.

## How to score

```bash
node --test projects/weir/weir.test.mjs
node projects/weir/weir.mjs projects/weir/data/dammed.json
echo '{"seed":"dammed"}' | node projects/weir/weir.mjs
```

Open the living card at `projects/weir/index.html` (or the live path `/weir/`). Buttons: Open the race, Score weir, Lift the gates, Compare flowing / dammed, Pin idle flowing, Pin seeded dammed, Pin egress-allowlist, Hold the flowing. Toggle chips for: PUT 403, host never reached, All domains ignored, additional domains, MCP proxy ok, ShipIt update, VM 2.1.266, regression — the score flips. Lay a fixture JSON on the mill blotter. `?embed=1` hides chrome.

The booth reconstructs the reporter’s egress-allowlist walk from the published #93589 text. This page did not run Claude live.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/weir/
- Folder: `projects/weir/`

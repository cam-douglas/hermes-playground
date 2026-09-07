# Crenel

A **mason's battlement crenel / embrasure notch bench** — limestone courses, chalk snap-lines, dusk battlement air, mortar joints, a merlon-cut notch that should admit a capability; Ibarra Real Nova + Plus Jakarta Sans + Geist Mono — for a real Claude Code defect: **AN MCP SERVER ADVERTISING `capabilities.resources` AS THE EMPTY OBJECT `{}` (SPEC-LEGAL = SUPPORTED) IS TREATED AS HAVING NO RESOURCES.** When the empty-object capability is acknowledged as support and List+Read work, the crenel is **crenelled**.

Primary:

- [anthropics/claude-code#92729](https://github.com/anthropics/claude-code/issues/92729) (OPEN, bug, has repro, platform:macos, area:mcp). Title: `MCP: server advertising \`resources\` capability is treated as having none`. Filed 2026-09-07T20:19:27Z. Updated 2026-09-07T20:20:22Z. Reporter: juancastroG. 0 comments.

06:50 crenel: a mason's battlement crenel / embrasure notch that should admit an MCP server advertising capabilities.resources as {} but instead stays bricked — ListMcpResourcesTool finds none, ReadMcpResourceTool says unsupported, tools/* still work, stdio listChanged:false control works, wire curl list+read 200 (#92729). Score bricked or admit crenelled.

Idle word: **bricked** (ALARM: empty resources:{} capability is walled over / treated as absent). Seeded state: **crenelled** / HOLD (empty-object capability is acknowledged as support; List+Read work). Never idle as unrung, porous, slipped, severed, misrouted, adrift, corked, latent, silted, barred, runaway, haunted, fouled, razed, culled, unanswered, stripped, quieted, cribbed, sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted. Never seeded as quieted, cribbed, sprung, remoored, addressed, reaped, relayed, flushed, drained, admitted, latched, staged, proved, belayed, sole, packed, roused, sighted, argbound, cleared.

**Crenel** = the mason's notch between merlons on a battlement (the embrasure that should admit fire, light, or — here — a capability). A server advertising `capabilities.resources` as `{}` has already cut the notch. The client walls it **bricked**.

- **bricked** = IDLE: ALARM; empty resources:{} capability is walled over / treated as absent
- **crenelled** = seeded word: empty-object capability is acknowledged as support; List+Read work
- **empty-object-capability** = initialize advertises `{"resources":{},"tools":{}}`; spec-legal = supported, no optional sub-capabilities
- **list-no-resources** = ListMcpResourcesTool returns: No resources found. MCP servers may still provide tools even if they have no resources.
- **read-unsupported** = ReadMcpResourceTool against a valid URI returns: Server "<name>" does not support resources
- **tools-still-work** = tools/* from the same server works fine
- **stdio-listChanged-works** = another MCP server in the same session (stdio) DOES have its resources listed correctly — working shape `{"resources":{"listChanged":false},"tools":{"listChanged":false}}`
- **wire-curl-ok** = curl initialize / list / read / templates all HTTP 200; same failure via mcp-remote 0.1.38; identical across protocol versions
- **assertCapability-truthy** = bundled MCP SDK `if (!this._capabilities.resources) throw` treats {} as present (truthy); that check is NOT the rejector
- **upstream-reject** = something upstream decides the server has no resources
- **instructions-truncated-proof** = MCP log shows Server instructions truncated from 2221 to 2048 chars — handshake was parsed
- **cousins** = cite-only #85230 / #80300 / #88128
- **has-clear-repro** = issue labeled has repro

Verdicts: bricked, crenelled, empty-object-capability, list-no-resources, read-unsupported, tools-still-work, stdio-listChanged-works, wire-curl-ok, assertCapability-truthy, upstream-reject, instructions-truncated-proof, cousins, has-clear-repro.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether an empty-object `resources` capability would leave the crenel **bricked** or already **crenelled**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): something upstream of SDK assertCapability normalizes or gates on optional sub-keys (e.g. treating missing listChanged as unsupported) rather than presence of the resources key. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92729](https://github.com/anthropics/claude-code/issues/92729)
- Cousins cite-only (NOT primary):
  - [anthropics/claude-code#85230](https://github.com/anthropics/claude-code/issues/85230) — Background subagents lose ListMcpResourcesTool/ReadMcpResourceTool
  - [anthropics/claude-code#80300](https://github.com/anthropics/claude-code/issues/80300) — ReadMcpResourceTool intermittently not enabled after reconnect
  - [anthropics/claude-code#88128](https://github.com/anthropics/claude-code/issues/88128) — tools/list and resources/list rejected when optional ttlMs/cacheScope omitted

What happened (from the issue body — do not invent):

- Claude Code desktop app Code tab; macOS 15 (Darwin 25.4.0); reporter juancastroG; filed 2026-09-07T20:19:27Z; updated 2026-09-07T20:20:22Z; 0 comments
- Server: Rust + rmcp 3.1.4, Streamable HTTP, stateless (`legacy_session_mode: false`, `json_response: true`) at `http://localhost:<port>/core/mcp`; also via mcp-remote 0.1.38
- MCP server that advertises resources capability in initialize is treated as having no resource support:
  - ListMcpResourcesTool with that server name returns: No resources found. MCP servers may still provide tools even if they have no resources.
  - ReadMcpResourceTool against a valid URI returns: Server "<name>" does not support resources
  - tools/* from the same server works fine
  - Another MCP server in the same session (stdio) DOES have its resources listed correctly — resource support works in general, just not for this server
- Wire-verified with curl: initialize returns capabilities `{"resources":{},"tools":{}}`; resources/list returns resources array with uri/name/mimeType/size; resources/read returns document; resources/templates/list returns `{"resourceTemplates":[]}`; all HTTP 200
- Identical capabilities when negotiating protocol 2024-11-05, 2025-06-18, 2025-11-25, or 2026-07-28; same failure via mcp-remote 0.1.38 stdio bridge
- Client parsed the initialize carrying `resources:{}` (MCP log shows Server instructions truncated from 2221 to 2048 chars — instructions length proves that handshake was parsed)
- Observable difference vs working stdio server:
  - works: `{"resources":{"listChanged":false},"tools":{"listChanged":false}}`
  - fails: `{"resources":{},"tools":{}}`
  - Both are spec-legal; `resources:{}` means supported, no optional sub-capabilities
- Bundled MCP SDK assertCapability (`if (!this._capabilities.resources) throw`) treats `{}` as present (truthy); that check is NOT the one rejecting it — something upstream decides the server has no resources
- Expected: server advertising capabilities.resources (including empty object) has resources listed and readable

Problem found: EMPTY-OBJECT RESOURCES CAPABILITY `{}` TREATED AS ABSENT / NO SUPPORT — LIST FINDS NONE, READ SAYS UNSUPPORTED, TOOLS STILL WORK, STDIO LISTCHANGED:FALSE CONTROL WORKS, WIRE CURL LIST+READ 200.

Why this solution: a diagnostic scorer for the bricked → crenelled crenel chain, so a reader can admit idle bricked, pin seeded crenelled, and score empty-object-capability / list-no-resources / read-unsupported / tools-still-work / stdio-listChanged-works / wire-curl-ok / assertCapability-truthy / upstream-reject / instructions-truncated-proof / cousins against the published facts.

## Why not a clone

This is specifically: **EMPTY-OBJECT `resources` CAPABILITY `{}` TREATED AS ABSENT / NO SUPPORT.**

**NOT Quietus #92716** (SubagentStop kill path unrung).

**NOT Cribble #92684** (denyWrite mid-path wildcards porous).

**NOT Springe #92675** (plugin PreToolUse interactive slip).

**NOT Gangway #92662** (Chrome relaunch bridge severed).

**NOT Waybill #92624** (named-agent foreign session misroute).

**NOT Catachresis #92518** (MCP insufficient_scope mislabeled expired — different MCP bug).

This is specifically: empty-object resources capability {} treated as absent / no support.

Cousins cite-only (NOT primary): #85230, #80300, #88128. Different surfaces. Do not auto-pick as thesis.

Do NOT rename this product Quietus, Cribble, Springe, Gangway, Waybill, or Catachresis.
Do NOT reuse idle unrung / porous / slipped / severed / misrouted / adrift / corked / latent / silted / barred / runaway / haunted / fouled / razed / culled / unanswered / stripped / quieted.
Do NOT reuse seeded quieted / cribbed / sprung / remoored / addressed / reaped / relayed / flushed / drained / admitted / latched / staged / proved / belayed / sole / packed / roused / sighted / argbound / cleared.

Different surface: EMPTY-OBJECT RESOURCES CAPABILITY TREATED AS ABSENT vs SubagentStop kill-path miss / mid-path denyWrite fail-open / plugin-native PreToolUse interactive slip / Chrome relaunch never-redial / named-spawn foreign session id / MCP insufficient_scope mislabeled expired.

Product name stays **Crenel**. Name/slug `crenel` confirmed unused in catalog.json (211 products before this ship; Quietus is #211).

Different UI: mason's battlement crenel / embrasure notch / limestone courses / chalk snap-lines / dusk battlement air / mortar joints. Ibarra Real Nova / Plus Jakarta Sans / Geist Mono (IBM Plex Mono fallback in link tags only). NOT Cardo/Public Sans/Fragment Mono (Quietus). NOT Young Serif/Karla/IBM Plex Mono as the primary trio (Cribble). NOT Bodoni Moda/Nunito Sans (Springe). NOT Cinzel Decorative/Source Sans 3 (Embrasure — different defect, different hour). NOT parchment ledger. NOT mill sieve. NOT trapper springe.

Different verbs: Score the crenel, Pin idle bricked, Pin seeded crenelled, Admit crenelled, Load fixtures, Reset to crenelled, Open the embrasure, Wall the crenel.

Different idle: **bricked**. Different seeded: **crenelled**. HOLD: **crenelled**. ALARM: **bricked** / **empty-object-capability** / **list-no-resources** / **read-unsupported** / **tools-still-work** / **stdio-listChanged-works** / **wire-curl-ok** / **assertCapability-truthy** / **upstream-reject** / **instructions-truncated-proof** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/crenel/hook/crenel.test.mjs
node projects/crenel/hook/index.mjs projects/crenel/data/92729.json
echo '{"seed":"crenelled","crenelled":true}' | node projects/crenel/hook/index.mjs
```

Open the living card at `projects/crenel/index.html` (or the live path). Buttons: Score the crenel, Pin idle bricked, Pin seeded crenelled, Admit crenelled, Load fixtures, Reset to crenelled. Open the embrasure. Wall the crenel. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/crenel/
- Subdomain: https://crenel.hermes-playground-green.vercel.app
- Folder: `projects/crenel/`

# Mailslot

A **brass postal mailslot / letter-flap bench** — night post-office door, streetlamp, thick sealed packets vs a narrow brass slot, counter stamp, Keychain vault behind the flap; Libre Bodoni + Karla + JetBrains Mono — for a real Claude Code defect: **MCP OAUTH VIA `claude mcp add` + `/mcp` LOGIN COMPLETES THE FULL BROWSER EXCHANGE (AUTHORIZATION CODE + PKCE, COGNITO/OIDC) BUT FAILS TO PERSIST CREDENTIALS TO MACOS KEYCHAIN WHEN THE SERIALIZED BLOB EXCEEDS `security -i`'S ~4096-BYTE STDIN LINE-BUFFER, AND THE ARGV FALLBACK ITSELF DIES WITH CRYPTIC `pbt`.** Normal UI still shows the server unauthenticated. Payloads ~7.3KB are well under `ARG_MAX` (~1MB).

Primary:

- [anthropics/claude-code#92839](https://github.com/anthropics/claude-code/issues/92839) (OPEN, bug, has repro, platform:macos, area:auth, area:mcp). Title: `[BUG] MACOS Keychain: argv fallback for oversized OAuth credential payload (>4KB) itself fails silently ("pbt" error) during MCP OAuth login`. Filed 2026-09-08.

22:50 mailslot: a brass postal mailslot bench that should vault MCP OAuth credential packets into Keychain after a successful Cognito/OIDC exchange; instead payloads over ~4KB spill at security -i stdin and the argv fallback dies with cryptic pbt while the UI still shows unauthenticated; score spilled or admit vaulted.

Score spilled or admit vaulted.

Idle word: **vaulted** (HOLD: packet of any thickness seats in Keychain after the counter stamps the letter). #92839 path: **spilled**. Seeded unauthenticated: **voided**. Never idle as cleared, armed, receipted, fused, closed, keyed, tenured. Never use ukased, stripped, lost, dry, leaked, orphaned as the #92839-path word either.

**Mailslot** = a night letter-flap whose brass slot should take a sealed credential packet into the Keychain vault after the postal counter already stamped *Login successful*. Thick packets jam at `security -i` stdin (~4096B). The argv fallback that was supposed to widen the slot (#30337 / 2.1.69) itself spills with `pbt`.

- **vaulted** = IDLE: HOLD; Keychain accepted the packet after a successful OAuth stamp
- **spilled** = #92839 path: oversized payload + argv fallback failed; packet on the stoop
- **voided** = seeded unauthenticated: normal UI still shows the server unsigned
- **oversized-warn** = WARN `Keychain payload (N B JSON) exceeds security -i stdin limit; using argv`
- **argv-pbt** = argv fallback dies with cryptic `Error during auth completion: pbt`
- **thin-payload** = control: letter under 4096B takes stdin and vaults
- **thick-payload** = ~7333B / 7347B packet; well under ARG_MAX; argv fails
- **discovery-state** = OIDC discovery + RFC 9728 + tokens bundled in one blob
- **login-success** = browser stamped; persist is the failing step
- **before-after** = 2.1.69 stdin/argv fix vs 2.1.224 broken fallback

Verdicts: vaulted, spilled, voided, oversized-warn, argv-pbt, thin-payload, thick-payload, discovery-state, login-success, before-after.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. No network to Anthropic. Score whether an MCP OAuth login would leave the packet **spilled** or already **vaulted**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): Claude Code's Keychain writer hits `security -i`'s stdin line-buffer at ~4096B, switches to argv, and that fallback path truncates or mis-encodes the payload (`pbt`); the OAuth exchange already succeeded. Invite verify against #92839 text only. Do NOT implement a fix in anthropics/claude-code.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92839](https://github.com/anthropics/claude-code/issues/92839)

What happened (from the issue body — do not invent):

- Filed 2026-09-08. OPEN. Labels: bug, has repro, platform:macos, area:auth, area:mcp
- Claude Code 2.1.224, macOS, Warp
- `claude mcp add` + `/mcp` login against AWS Cognito/OIDC (pre-registered, non-DCR client)
- Full browser OAuth (authorization code + PKCE S256) completes; callback shows "Login successful, close the window"
- Back in the CLI the server is still unauthenticated; no error in the normal UI
- `--debug-file`: token exchange completes, then `[WARN] Keychain payload (7333B JSON) exceeds security -i stdin limit; using argv` (also 7347B), then `Error during auth completion: pbt`
- Blob is large because it bundles OIDC discovery + RFC 9728 metadata + tokens + PKCE bookkeeping
- `getconf ARG_MAX` → 1048576; 7.3KB is not an OS ceiling
- `man security`: `-i` reads stdin; no buffer-size flag
- Prior: #28901 / #30337 documented the 4096B stdin limit; 2.1.69 added the argv fallback

Problem found: A THICK CREDENTIAL PACKET THAT SHOULD VAULT INTO KEYCHAIN AFTER A SUCCESSFUL COGNITO/OIDC STAMP INSTEAD SPILLS AT `security -i` STDIN, AND THE ARGV FALLBACK DIES WITH CRYPTIC `pbt` WHILE THE UI STAYS UNAUTHENTICATED.

Why this solution: a diagnostic night counter for the vaulted → spilled flap, so a reader can pin idle vaulted, load the #92839 spilled path, and score voided / oversized-warn / argv-pbt / thin-payload / thick-payload / discovery-state / login-success / before-after against the published facts.

## Why not a clone

This is specifically: **MCP OAUTH BROWSER EXCHANGE SUCCEEDS; KEYCHAIN PERSIST FAILS WHEN THE CREDENTIAL BLOB EXCEEDS `security -i` STDIN AND THE ARGV FALLBACK DIES WITH `pbt`.**

**NOT Ukase/#92833** (scheduled Cowork permission-rule deny — already shipped). Do not touch Ukase.

**NOT Scabbard/#92820** (custom subagent Bash silently omitted — already shipped). Do not touch Scabbard.

**NOT Deadletter/#90049** (PostToolUse lost tool_results — already shipped). Different postal metaphor: dead-letter sorting desk vs night letter-flap. Do not touch Deadletter.

**NOT Coffer / Latchkey / Ward / Reliquary / Bulla / Fob / Wicket** (other vault/key paradigms already shipped).

**NOT Dryjoint/#92809. NOT Dinkus/#92798. NOT Homonym/#92787. NOT Rushlight/#92784.**

Cite-only cousins (do NOT build those products):

- [#30337](https://github.com/anthropics/claude-code/issues/30337) / [#28901](https://github.com/anthropics/claude-code/issues/28901) — original stdin 4096B limit; argv fallback shipped in 2.1.69
- Deadletter catalog product — lost tool_results after worktree (#90049)

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session.

Different paradigm: **the counter already stamped the letter; the narrow brass slot should vault the packet; thick packets spill and the argv widening dies with pbt.**

Do NOT rename this product Ukase, Scabbard, Deadletter, Dryjoint, Dinkus, Homonym, Rushlight, Coffer, Latchkey, Ward, Reliquary, Bulla, Fob, Wicket, or any existing catalog slug.
Do NOT reuse idle cleared / armed / receipted / fused / closed / keyed / tenured. Do NOT reuse seeded ukased / stripped / lost / dry / leaked / orphaned.

Different surface: Keychain persist after successful MCP OAuth vs scheduled permission-rule deny / custom-subagent tool omit / PostToolUse lost results.

Product name stays **Mailslot**. Name/slug `mailslot` confirmed unused in catalog.json (227 products before this ship; Ukase is #227).

Different UI: night post-office door / brass letter-flap / streetlamp / thick sealed packets vs narrow slot / counter stamp / Keychain vault. Libre Bodoni / Karla / JetBrains Mono. NOT Cinzel + Source Sans 3 (Ukase). NOT Cormorant Unicase + Sora (Scabbard). NOT Newsreader + Figtree (Deadletter). NOT oak-leather armory. NOT imperial wax-seal chancery.

Different verbs: Score spilled, Admit vaulted, Pin idle vaulted, Load spilled, Load voided, Reset to vaulted.

Different idle: **vaulted**. Different #92839 path: **spilled**. HOLD: **vaulted**. ALARM: **spilled** / **voided** / **oversized-warn** / **argv-pbt** / **thin-payload** / **thick-payload** / **discovery-state** / **login-success** / **before-after**.

## How to score

Open the living card at `projects/mailslot/index.html` (or the live path `/mailslot/`). Buttons: Score spilled, Admit vaulted, Pin idle vaulted, Load spilled, Load voided, Load fixtures, Reset to vaulted. Hang a flap chip. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/mailslot/
- Folder: `projects/mailslot/`

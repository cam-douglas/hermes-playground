# Homonym

A **lexicographer / registrar twin-nameplate desk** — parchment folio, iron-gall ink, brass nameplate, UUID ghost plate; Fraunces + Outfit + JetBrains Mono — for a real Claude Code defect: **DESKTOP LOCAL SESSIONS MOUNT CLAUDE.AI CONNECTORS UNDER CONNECTION UUIDS SO DOCUMENTED `MCP__CLAUDE_AI_<NAME>__*` ASK/DENY RULES SILENTLY MISS.** When a hypothetical keyed alias keeps the named ledger bound in every entrypoint, the desk is **keyed**.

Primary:

- [anthropics/claude-code#92787](https://github.com/anthropics/claude-code/issues/92787) (OPEN, bug, has repro, platform:macos, area:mcp, area:permissions, area:desktop). Title: `claude.ai connectors mount under connection UUIDs in Desktop local sessions, so mcp__claude_ai_<name>__* permission rules never match there (re-raising #77598, closed as stale)`. Filed 2026-09-08T05:58:51Z.

16:50 homonym: a lexicographer's twin-nameplate desk that should keep claude.ai connector ask/deny rules matched to `claude_ai_<name>` across entrypoints; instead Desktop mounts under connection UUIDs so named rules silently miss; score orphaned or admit keyed.

Score orphaned or admit keyed.

Idle word: **matched** (HOLD: named ledger stays matched across entrypoints). Seeded state: **orphaned** / #92787. Admit word: **keyed**. Never idle as dripping, arrested, credited, chorded, flattened, meshed, piped, swallowed, unbound, berthed, lean, attentive, waived, bricked, unrung, echoed, laden, deaf, shed, remounted, refused, imprinted. Never seeded as dripping, arrested, credited, chorded, flattened, meshed, piped, swallowed, unbound.

**Homonym** = two names for the same connector identity. The desk should keep the named ledger (`claude_ai_Gmail`) matched across entrypoints; instead Desktop orphans the rule under a UUID guidon.

- **matched** = IDLE: HOLD; named ledger (`claude_ai_<name>`) stays matched across entrypoints
- **orphaned** = seeded word / #92787 path: Desktop mounts under connection UUID so named ask/deny rules silently miss
- **keyed** = admit hold: same server name in every entrypoint, or named rules resolve against the UUID mount as an alias
- **cli-named-mount** = CLI mounts as `claude_ai_<display name>`; Gmail `mcp__claude_ai_Gmail__send_message`; uuid-named 0 / claude_ai-named 605–640
- **desktop-uuid-mount** = Desktop Code tab (`entrypoint: claude-desktop`) mounts under connection UUID; Gmail `mcp__00f86eb0-3a3c-4c27-acda-6f24a36b05d7__send_message`; uuid-named 522–1602 / claude_ai-named 0
- **ask-rule-silent-miss** = `permissions.ask` / `permissions.deny` as `mcp__claude_ai_<name>__<tool>` is silently ineffective in Desktop
- **no-startup-warning** = rule looks valid in `settings.json`; "rule matches no tool" check skipped for names containing `_` or `*`
- **uuid-undocumented** = docs (`permissions#mcp`) document only the named form; UUID form not shown in `/mcp`
- **cousins** = cite-only #77598 CLOSED stale (same class), #82532 OPEN (identity rotation); primary stays #92787
- **has-clear-repro** = issue labeled has repro

Verdicts: matched, orphaned, keyed, cli-named-mount, desktop-uuid-mount, ask-rule-silent-miss, no-startup-warning, uuid-undocumented, has-clear-repro, cousins.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. Score whether a Desktop local session would leave the named ledger **orphaned** or already **keyed**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): Desktop local sessions resolve claude.ai connectors by connection UUID while CLI uses display-name server ids, so documented `mcp__claude_ai_*` permission rules never bind in Desktop — silent miss, not a permissions-engine failure. Verify against issue text only; do not claim unread source.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92787](https://github.com/anthropics/claude-code/issues/92787)
- Cousins cite-only (NOT primary): [anthropics/claude-code#77598](https://github.com/anthropics/claude-code/issues/77598) CLOSED stale — same class. [anthropics/claude-code#82532](https://github.com/anthropics/claude-code/issues/82532) OPEN — identity rotation.

What happened (from the issue body — do not invent):

- CLI 2.1.263; Claude Desktop 1.46388.4; also observed 2.1.219 and 2.1.260 in Desktop; macOS 26.5.2; filed 2026-09-08T05:58:51Z; labels bug, has repro, platform:macos, area:mcp, area:permissions, area:desktop; OPEN
- Reporter: honzapav
- Desktop local sessions (Code tab, `entrypoint: claude-desktop`) mount claude.ai connectors under their connection UUID
- CLI sessions of the same account mount the same connectors as `claude_ai_<display name>`
- Gmail: CLI `mcp__claude_ai_Gmail__send_message` vs Desktop `mcp__00f86eb0-3a3c-4c27-acda-6f24a36b05d7__send_message`
- Google Calendar: `mcp__claude_ai_Google_Calendar__create_event` vs `mcp__4378a0e9-5968-4b33-9b01-6761445ef5f1__create_event`
- Asana: `mcp__claude_ai_Asana__add_comment` vs `mcp__67cd082d-c902-4339-b9ff-cfe96708ca78__add_comment`
- Named `permissions.ask` / `permissions.deny` rules silently miss in Desktop — no warning; rule looks valid; tool call goes through without a prompt
- Documented form is the named form; UUID form is undocumented and not shown in `/mcp`
- Org connector controls set to ask do not reach Desktop local/SSH (only blocked does)
- Transcript evidence: Desktop uuid-named tools 522–1602 with claude_ai-named 0; CLI reverse
- Gmail UUID stable across 2.1.219 → 2.1.260 in the reporter's case; #82532 notes rotation can also happen

Problem found: DESKTOP LOCAL SESSIONS MOUNT CLAUDE.AI CONNECTORS UNDER CONNECTION UUIDS SO DOCUMENTED `MCP__CLAUDE_AI_<NAME>__*` ASK/DENY RULES SILENTLY MISS.

Why this solution: a diagnostic scorer for the matched → orphaned / keyed nameplate chain, so a reader can pin idle matched, seed orphaned (#92787 path), and score cli-named-mount / desktop-uuid-mount / ask-rule-silent-miss / no-startup-warning / uuid-undocumented / cousins against the published facts.

## Why not a clone

This is specifically: **DESKTOP LOCAL SESSIONS MOUNT CLAUDE.AI CONNECTORS UNDER CONNECTION UUIDS SO DOCUMENTED `MCP__CLAUDE_AI_<NAME>__*` ASK/DENY RULES SILENTLY MISS**.

**NOT Clepsydra/#92776** (OTel token.usage mid-session arrest — already shipped). Do not touch Clepsydra.

**NOT Letoff/#92771** (libuv Shift+Enter flatten — already shipped). Do not touch Letoff.

**NOT Ptybind/#92757** (Ctrl+G ConPTY editor input dead — already shipped). Do not touch Ptybind.

**NOT Dunnage/#92746** (RemoteTrigger list cursor). **NOT Setoff/#92750** (subagent MEMORY.md + skill_listing). **NOT Espagnolette/#92694**. **NOT Imprimatur/#92740**. **NOT Byname/#92738**. **NOT Crenel/#92729**.

NOT a permissions-engine clone, not a generic MCP inspector, not Crenel's empty-object resources gate, not Byname's fuzzy skill warning.

Different paradigm: **named `claude_ai_<name>` permission rules never bind in Desktop because the server identity is the connection UUID**.

Cousins cite-only (NOT primary): #77598 CLOSED stale, #82532 OPEN. Do not auto-pick as thesis.

Do NOT rename this product Clepsydra, Letoff, Ptybind, Dunnage, Setoff, Espagnolette, Imprimatur, Byname, or Crenel.
Do NOT reuse idle dripping / arrested / credited / chorded / flattened / meshed / piped / swallowed / unbound / berthed / lean / attentive / waived / bricked / unrung / echoed / laden / deaf / shed / remounted / refused / imprinted.

Different surface: silent named-rule miss under a UUID mount vs OTel meter arrest / libuv Shift+Enter flatten / Ctrl+G ConPTY mux editor input race / RemoteTrigger list cursor ignore / subagent first-request attachments / AskUserQuestion dead keys / MCP resources `{}`.

Product name stays **Homonym**. Name/slug `homonym` confirmed unused in catalog.json (221 products before this ship; Clepsydra is #220).

Different UI: lexicographer desk / registry ledger / twin nameplates — parchment + ink + brass nameplate + UUID ghost plate. Fraunces / Outfit / JetBrains Mono. NOT EB Garamond / Barlow / Source Code Pro (Clepsydra). NOT Lora / Plus Jakarta / Cousine (Letoff). NOT Newsreader / Karla / IBM Plex Mono (Ptybind). NOT Literata / Red Hat Text / Fira Code (Dunnage). NOT DM Serif Display / Commissioner / Azeret (Setoff). NOT Instrument Serif / Figtree (Espagnolette used JetBrains with a different trio). NOT piano cream/ebony. NOT CRT phosphor green. NOT stevedore wood. NOT letterpress ink. NOT locksmith brass. NOT marble/water. NOT soot/ember.

Different verbs: Score orphaned, Admit keyed, Pin idle matched, Seed orphaned, Reset to matched, Load fixtures, Hang the guidon, Key the ledger.

Different idle: **matched**. Different seeded: **orphaned**. HOLD: **matched** / **keyed**. ALARM: **orphaned** / **cli-named-mount** / **desktop-uuid-mount** / **ask-rule-silent-miss** / **no-startup-warning** / **uuid-undocumented** / **cousins** / **has-clear-repro**.

## How to score

```bash
node --test projects/homonym/hook/homonym.test.mjs
node projects/homonym/hook/homonym.mjs projects/homonym/data/92787.json
node projects/homonym/hook/homonym.mjs projects/homonym/data/matched.json
echo '{"seed":"orphaned","orphaned":true}' | node projects/homonym/hook/index.mjs
```

Open the living card at `projects/homonym/index.html` (or the live path `/homonym/`). Buttons: Score orphaned, Admit keyed, Pin idle matched, Seed orphaned, Load fixtures, Reset to matched. Hang the guidon. Key the ledger. Drop a fixture JSON or paste it. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/homonym/
- Folder: `projects/homonym/`

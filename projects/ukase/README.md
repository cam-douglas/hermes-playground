# Ukase

An **imperial chancery / wax-seal edict bench** — scarlet sealing wax, brass seal press, parchment edict scroll, twin dockets (SCHEDULED vs INTERACTIVE), ribbon, iron gall ink, decree stamp; Cinzel + Source Sans 3 + JetBrains Mono — for a real Claude Code defect: **LOCALLY-RUN COWORK SCHEDULED TASK SESSIONS DENY `mcp__workspace__bash` AND `mcp__workspace__web_fetch` AT CALL TIME BY A PERMISSION RULE WHILE THE TOOLS STAY LISTED IN `init.tools`.** Ordinary interactive Cowork tasks on the same machine, same permission mode, still clear.

Primary:

- [anthropics/claude-code#92833](https://github.com/anthropics/claude-code/issues/92833) (OPEN, bug, has repro, platform:windows, area:cowork, regression, area:permissions). Title: `[Cowork] Scheduled task runs deny mcp__workspace__bash and mcp__workspace__web_fetch by permission rule since the Sept 2 desktop update (interactive tasks unaffected)`. Filed 2026-09-08T11:51:33Z.

21:50 ukase: an imperial chancery wax-seal edict bench that should keep mcp__workspace__bash cleared for locally-run Cowork scheduled sessions in Skip-all / auto modes; instead a silent permission-rule ukases every workspace bash and web_fetch call while interactive tasks on the same machine still clear; score ukased or admit cleared.

Score ukased or admit cleared.

Idle word: **cleared** (HOLD: scheduled workspace MCP callable in Skip-all / auto). #92833 path: **ukased**. Never idle as armed, receipted, fused, closed, keyed, tenured, credited, meshed, unbound, advanced, shed, lit. Never use stripped, lost, dry, leaked, orphaned, snuffed as the #92833-path word either.

**Ukase** = an imperial edict whose wax seal presses a silent permission-rule onto the scheduled docket. The tools remain written on the roll. The press still denies the call.

- **cleared** = IDLE: HOLD; scheduled `mcp__workspace__bash` / `mcp__workspace__web_fetch` callable
- **ukased** = #92833 path: silent permission-rule deny on scheduled workspace MCP; tools stay listed
- **scheduled-deny** = every scheduled session after the 2026-09-02 update denied 100%
- **interactive-clear** = control: ordinary non-scheduled Cowork task, same machine, same mode — `echo ok` succeeds
- **tools-listed-but-denied** = tools remain in `init.tools`; call-time deny, not omit
- **echo-ok-denied** = trivial `echo ok` denied; command content irrelevant
- **web_fetch-denied** = whole workspace MCP server blocked, not bash alone
- **before-after-227** = same scheduled task: 227 bash / 0 denied before the update; 1/1 after
- **bypass-and-auto** = denied in bypassPermissions (Skip all approvals) and auto (Automatically approve)

Verdicts: cleared, ukased, scheduled-deny, interactive-clear, tools-listed-but-denied, echo-ok-denied, web_fetch-denied, before-after-227, bypass-and-auto.

This is a diagnostic scoring assay. Not an exploit. No live Claude sessions. No payloads. No secrets. No network to Anthropic. Score whether a scheduled Cowork session would leave the edict **ukased** or already **cleared**. Fixtures use the issue's published incident only.

Hypothesis only (NON-BINDING): the scheduled-session permission resolver applies a silent deny rule to the workspace MCP server that interactive sessions do not; tools stay advertised in init. Invite verify against #92833 text only. Do NOT implement a fix in anthropics/claude-code.

## Research brief

Sources:

- Primary: [anthropics/claude-code#92833](https://github.com/anthropics/claude-code/issues/92833)

What happened (from the issue body — do not invent):

- Filed 2026-09-08T11:51:33Z. OPEN. Labels: bug, has repro, platform:windows, area:cowork, regression, area:permissions
- Desktop update 2026-09-02 / Claude Code 2.1.258 bundled under Claude Desktop package
- Scheduled local Cowork sessions: every `mcp__workspace__bash` and `mcp__workspace__web_fetch` denied by rule (not prompt/hook/classifier)
- `audit.jsonl`: subtype `permission_denied`, `decision_reason_type: rule`, `non_execution_kind: permission-rule`
- Same scheduled task before update (2026-09-02 10:36 UTC): `init.permissionMode` bypassPermissions, 227 workspace bash, 0 denied
- After: 1/1, 1/1, and many other scheduled sessions 100% denied in bypassPermissions and auto
- Denied even for `echo ok` — command content irrelevant
- Whole workspace MCP server blocked (bash + web_fetch); tools still listed in `init.tools` array (call-time deny, not omit)
- Control: new ordinary non-scheduled Cowork task same machine same mode — `echo ok` succeeds

Problem found: A SILENT PERMISSION-RULE UKASES EVERY WORKSPACE BASH AND WEB_FETCH CALL ON LOCALLY-RUN COWORK SCHEDULED SESSIONS WHILE INTERACTIVE TASKS ON THE SAME MACHINE STILL CLEAR. TOOLS STAY LISTED.

Why this solution: a diagnostic chancery for the cleared → ukased edict, so a reader can pin idle cleared, load the #92833 ukased path, and score scheduled-deny / interactive-clear / tools-listed-but-denied / echo-ok-denied / web_fetch-denied / before-after-227 / bypass-and-auto against the published facts.

## Why not a clone

This is specifically: **SCHEDULED LOCAL COWORK SESSIONS DENY `mcp__workspace__bash` AND `mcp__workspace__web_fetch` BY A PERMISSION RULE WHILE THE TOOLS STAY LISTED.**

**NOT Scabbard/#92820** (custom subagent Bash silently *omitted* from the granted toolset — already shipped). Ukase is call-time deny, not omit. Do not touch Scabbard.

**NOT Deadlight/#92249** (ListAgents / SendMessage *blanked* from the registry on scheduled-task and Remote Control — already shipped). Ukase tools stay advertised. Different surface. Do not touch Deadlight.

**NOT Deadletter/#90049** (PostToolUse lost tool_results — already shipped). Do not touch Deadletter.

**NOT Dryjoint/#92809. NOT Dinkus/#92798. NOT Homonym/#92787. NOT Rushlight/#92784. NOT Clepsydra/#92776.**

Cite-only cousins (do NOT build those products):

- [#91636](https://github.com/anthropics/claude-code/issues/91636) closed — deny in EVERY session, not scheduled-only
- [#74324](https://github.com/anthropics/claude-code/issues/74324) / [#46788](https://github.com/anthropics/claude-code/issues/46788) — dialogs never appear
- [#86391](https://github.com/anthropics/claude-code/issues/86391) — PROVENANCE_REQUIRED WebFetch
- [#47180](https://github.com/anthropics/claude-code/issues/47180) — Always allow prompts reappear
- Deadlight catalog product — ListAgents/SendMessage blanking on scheduled/Remote Control (#92249)

NOT a clone of Claude Code. NOT a live patch to anthropics/claude-code. NOT an exploit. NOT a live Claude session.

Different paradigm: **the tools remain written on the init roll; a silent permission-rule wax-seals the scheduled docket at call time; the interactive docket on the same desk stays clear.**

Do NOT rename this product Scabbard, Deadlight, Deadletter, Dryjoint, Dinkus, Homonym, Rushlight, Clepsydra, Imprimatur, or any existing catalog slug.
Do NOT reuse idle armed / receipted / fused / closed / keyed / tenured / credited / meshed / unbound / advanced / shed / lit. Do NOT reuse seeded stripped / lost / dry / leaked / orphaned / snuffed.

Different surface: scheduled-session permission-rule deny on workspace MCP vs custom-subagent tool omit / registry blank / PostToolUse lost results.

Product name stays **Ukase**. Name/slug `ukase` confirmed unused in catalog.json (226 products before this ship; Scabbard is #226).

Different UI: imperial Russian chancery / wax-seal ukase desk / scarlet sealing wax / brass seal press / parchment edict / twin SCHEDULED vs INTERACTIVE dockets / ribbon / iron gall ink / decree stamp. Cinzel / Source Sans 3 / JetBrains Mono. NOT Cormorant Unicase + Sora + IBM Plex Mono (Scabbard). NOT Libre Baskerville + Manrope (Deadlight). NOT Playfair Display + DM Sans + Fira Code (Imprimatur). NOT oak-leather armory. NOT night-cabin porthole.

Different verbs: Score ukased, Admit cleared, Pin idle cleared, Load ukased, Reset to cleared.

Different idle: **cleared**. Different #92833 path: **ukased**. HOLD: **cleared**. ALARM: **ukased** / **scheduled-deny** / **interactive-clear** / **tools-listed-but-denied** / **echo-ok-denied** / **web_fetch-denied** / **before-after-227** / **bypass-and-auto**.

## How to score

Open the living card at `projects/ukase/index.html` (or the live path `/ukase/`). Buttons: Score ukased, Admit cleared, Pin idle cleared, Load ukased, Load fixtures, Reset to cleared. Hang a docket chip. Drop a fixture JSON. `?embed=1` hides chrome.

## Live path

- Path gate: https://hermes-playground-green.vercel.app/ukase/
- Folder: `projects/ukase/`

/**
 * Reed — reed-relay cabinet for MCP / tool-registry death.
 * Four contacts per server: alive, handshake, listed, callable.
 * Connected is not registered. One served call is not a hold.
 * Verdicts: open | set | stuck | chatter | leak | drop. Idle word is open.
 * Not Fathom. Not Hasp. Not Parity. Not Reveille. Not Quench. Not Scrim. Not Knock.
 */

export const VERDICTS = Object.freeze(["open", "set", "stuck", "chatter", "leak", "drop"]);
export const IDLE_WORD = "open";
export const ALARM_VERDICTS = Object.freeze(["stuck", "chatter", "leak", "drop"]);
export const ROLLUP = Object.freeze(["leak", "chatter", "stuck", "drop", "open", "set"]);

export function emptyReed(id = "") {
  return {
    id,
    name: id,
    transport: "stdio",
    alive: false,
    handshake: false,
    listed: false,
    callable: false,
    oneShot: false,
    leaked: false,
    groupDrop: false,
    reseated: false,
    error: "",
    note: "",
  };
}

export function emptyCabinet() {
  return { reeds: [] };
}

export function emptyAction(session = "open-1") {
  return {
    action: "probe",
    session,
    cabinet: emptyCabinet(),
  };
}

function cloneReed(raw = {}) {
  const base = emptyReed(String(raw.id || raw.name || ""));
  return {
    ...base,
    ...raw,
    id: String(raw.id || raw.name || base.id),
    name: String(raw.name || raw.id || base.name),
    transport: String(raw.transport || "stdio"),
    alive: Boolean(raw.alive),
    handshake: Boolean(raw.handshake),
    listed: Boolean(raw.listed),
    callable: Boolean(raw.callable),
    oneShot: Boolean(raw.oneShot),
    leaked: Boolean(raw.leaked),
    groupDrop: Boolean(raw.groupDrop),
    reseated: Boolean(raw.reseated),
    error: raw.error != null ? String(raw.error) : "",
    note: raw.note != null ? String(raw.note) : "",
    issue: raw.issue ?? null,
    source: raw.source || "",
  };
}

function cloneCabinet(cabinet = emptyCabinet()) {
  const src = cabinet && typeof cabinet === "object" ? cabinet : emptyCabinet();
  const reeds = Array.isArray(src.reeds) ? src.reeds : [];
  return { reeds: reeds.map(cloneReed) };
}

export function verdictOf(reed = {}) {
  const r = cloneReed(reed);
  if (r.reseated && r.listed && r.callable) return "set";
  if (r.leaked && (!r.listed || !r.callable)) return "leak";
  if (r.oneShot && (!r.listed || !r.callable)) return "chatter";
  if (r.groupDrop) return "drop";
  if (r.handshake && r.listed && r.callable && r.alive) return "set";
  if (r.handshake && !r.listed) return "stuck";
  if (r.handshake && r.listed && !r.callable) return "stuck";
  return "open";
}

export function rollup(verdicts = []) {
  if (!verdicts.length) return "open";
  return ROLLUP.find((name) => verdicts.includes(name)) || "open";
}

function killReed(reed) {
  return {
    ...reed,
    alive: false,
    handshake: false,
    listed: false,
    callable: false,
  };
}

function respawnReed(reed) {
  const stdio = reed.transport === "stdio";
  return {
    ...reed,
    alive: true,
    handshake: true,
    listed: false,
    callable: false,
    oneShot: true,
    leaked: stdio ? true : reed.leaked,
  };
}

function reseatReed(reed) {
  return {
    ...reed,
    alive: true,
    handshake: true,
    listed: true,
    callable: true,
    oneShot: false,
    leaked: false,
    groupDrop: false,
    reseated: true,
  };
}

function dropReed(reed) {
  if (reed.transport === "stdio") return { ...reed };
  return {
    ...reed,
    groupDrop: true,
    handshake: false,
    listed: false,
    callable: false,
  };
}

export function readAction(payload = {}) {
  const nested = payload.action && typeof payload.action === "object" ? payload.action : null;
  const src = nested || payload;
  return {
    action: String((nested ? nested.action : payload.action) || "probe"),
    session: String(src.session ?? payload.session ?? ""),
    cabinet: cloneCabinet(src.cabinet ?? payload.cabinet ?? emptyCabinet()),
    issue: src.issue ?? payload.issue ?? null,
    source: src.source ?? payload.source ?? "",
  };
}

function pack(verdict, cabinet, action) {
  const reeds = (cabinet.reeds || []).map((reed) => {
    const next = cloneReed(reed);
    return { ...next, verdict: verdictOf(next) };
  });
  return {
    ok: true,
    product: "reed",
    verdict,
    state: verdict,
    decision: verdict,
    idleWord: IDLE_WORD,
    alarm: ALARM_VERDICTS.includes(verdict),
    action: action.action,
    session: action.session || "",
    cabinet: { reeds },
    reeds,
    issue: action.issue ?? null,
    source: action.source || "",
  };
}

function seedReed(spec) {
  return cloneReed({
    id: spec.id,
    name: spec.name || spec.id,
    transport: spec.transport || "stdio",
    alive: Boolean(spec.alive),
    handshake: Boolean(spec.handshake),
    listed: Boolean(spec.listed),
    callable: Boolean(spec.callable),
    oneShot: Boolean(spec.oneShot),
    leaked: Boolean(spec.leaked),
    groupDrop: Boolean(spec.groupDrop),
    reseated: Boolean(spec.reseated),
    error: spec.error || "",
    note: spec.note || "",
    issue: spec.issue ?? null,
    source: spec.source || "",
  });
}

function seedCabinet(issue, source, reeds, extras = {}) {
  return {
    action: extras.action || "probe",
    session: extras.session || `cabinet-${issue}`,
    issue,
    source,
    cabinet: { reeds: reeds.map(seedReed) },
  };
}

/** stdio respawn logs success; one call then tools vanish. claude-code#83838. */
export function seed83838() {
  return seedCabinet(83838, "anthropics/claude-code#83838", [
    {
      id: "playwright",
      transport: "stdio",
      alive: true,
      handshake: true,
      listed: false,
      callable: false,
      oneShot: true,
      error: "No such tool available: mcp__playwright__browser_navigate",
      issue: 83838,
      source: "anthropics/claude-code#83838",
    },
  ]);
}

/** lazy reconnect then wrong deregister; leaked process. claude-code#74329. */
export function seed74329() {
  return seedCabinet(74329, "anthropics/claude-code#74329", [
    {
      id: "python-interpreter",
      transport: "stdio",
      alive: true,
      handshake: true,
      listed: false,
      callable: false,
      oneShot: true,
      leaked: true,
      error: "No such tool available: mcp__python-interpreter__run",
      issue: 74329,
      source: "anthropics/claude-code#74329",
    },
  ]);
}

/** dead stdio never auto-reconnects. claude-code#82746. */
export function seed82746() {
  return seedCabinet(82746, "anthropics/claude-code#82746", [
    {
      id: "playwright",
      transport: "stdio",
      alive: false,
      handshake: false,
      listed: false,
      callable: false,
      issue: 82746,
      source: "anthropics/claude-code#82746",
    },
  ]);
}

/** claude.ai connectors drop as a group; local stdio stays up. claude-code#86080. */
export function seed86080() {
  return seedCabinet(86080, "anthropics/claude-code#86080", [
    {
      id: "atlassian",
      transport: "connector",
      alive: true,
      handshake: false,
      listed: false,
      callable: false,
      groupDrop: true,
      issue: 86080,
      source: "anthropics/claude-code#86080",
    },
    {
      id: "gmail",
      transport: "connector",
      alive: true,
      handshake: false,
      listed: false,
      callable: false,
      groupDrop: true,
      issue: 86080,
      source: "anthropics/claude-code#86080",
    },
    {
      id: "local-fs",
      transport: "stdio",
      alive: true,
      handshake: true,
      listed: true,
      callable: true,
      issue: 86080,
      source: "anthropics/claude-code#86080",
    },
  ]);
}

/** remote reconnect strips Notion tools. openai/codex#35298. */
export function seed35298() {
  return seedCabinet(35298, "openai/codex#35298", [
    {
      id: "notion",
      transport: "connector",
      alive: true,
      handshake: true,
      listed: false,
      callable: false,
      issue: 35298,
      source: "openai/codex#35298",
    },
  ]);
}

/** tools/list_changed logged, never applied. openai/codex#37417. */
export function seed37417() {
  return seedCabinet(37417, "openai/codex#37417", [
    {
      id: "dynamic-tools",
      transport: "http",
      alive: true,
      handshake: true,
      listed: false,
      callable: false,
      note: "tools/list_changed logged, never applied",
      issue: 37417,
      source: "openai/codex#37417",
    },
  ]);
}

/** MCP client has no heartbeat / auto-reconnect. openai/codex#11489. */
export function seed11489() {
  return seedCabinet(11489, "openai/codex#11489", [
    {
      id: "codex-mcp",
      transport: "http",
      alive: false,
      handshake: false,
      listed: false,
      callable: false,
      issue: 11489,
      source: "openai/codex#11489",
    },
  ]);
}

const SEEDS = {
  83838: seed83838,
  74329: seed74329,
  82746: seed82746,
  86080: seed86080,
  35298: seed35298,
  37417: seed37417,
  11489: seed11489,
};

export function decideSeed(seed, extra = {}) {
  if (typeof seed === "function") return decide({ ...seed(), ...extra });
  if (typeof seed === "number" || (typeof seed === "string" && SEEDS[seed])) {
    return decide({ ...SEEDS[seed](), ...extra });
  }
  return decide({ ...seed, ...extra });
}

export function decide(payload = {}) {
  if (typeof payload === "function") return decide(payload());
  const action = readAction(payload);
  let cabinet = cloneCabinet(action.cabinet);

  if (action.action === "clear") {
    return pack("open", emptyCabinet(), { ...action });
  }

  if (action.action === "kill") {
    cabinet = { reeds: cabinet.reeds.map(killReed) };
  } else if (action.action === "respawn") {
    cabinet = { reeds: cabinet.reeds.map(respawnReed) };
  } else if (action.action === "reseat") {
    cabinet = { reeds: cabinet.reeds.map(reseatReed) };
  } else if (action.action === "drop") {
    cabinet = { reeds: cabinet.reeds.map(dropReed) };
  }

  const rows = cabinet.reeds.map((reed) => ({ ...reed, verdict: verdictOf(reed) }));
  return pack(rollup(rows.map((row) => row.verdict)), { reeds: rows }, action);
}

#!/usr/bin/env node
/**
 * Cubby wall hook. A stuffed cubby is
 * not a hold. Score the wall or admit
 * stowed.
 *
 *   echo '{"safetyRuleInAuthoritativeOnly":true,"ancestorWalkUp":true}' | node index.mjs
 *   node index.mjs cubby.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   CUBBY_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   CUBBY_GITHUB_TOKEN   Cubby-ledger issue. Absent → demo ledger.
 *   CUBBY_LINEAR_KEY     Invisible / ancestor / walked-up / ghosted ticket. Absent → demo row.
 *
 * NOT Ullage / Iota / Fob / Cinch /
 * Wicket / Grille / Spile / Bollard /
 * Clew / Hasp / leftover woodworking.
 * Idle word is stowed, never the
 * product name, never empty, never
 * silent / mute / idle / dead.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedInvisible } from "./cubby.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedInvisible());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedInvisible();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.cubby ||
        parsed.probe ||
        parsed.ancestorWalkUp != null ||
        parsed.safetyRuleInAuthoritativeOnly != null ||
        parsed.injectedCachePath != null ||
        parsed.expectedCachePath != null)
    ) {
      return parsed.action || parsed.cubby || parsed.probe
        ? parsed
        : { action: "score", cubby: parsed };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", cubby: { session: "stdin", scored: true } };
    }
  } catch {
    const cubby = parseSessionTrace(text);
    if (
      cubby.ancestorWalkUp ||
      cubby.safetyRuleInAuthoritativeOnly ||
      cubby.restoredDiagnostic ||
      cubby.cwdVsGitRootSplit
    ) {
      return { action: "score", cubby };
    }
    return { error: "unparseable", raw: text };
  }
  const cubby = parseSessionTrace(text);
  return { action: "score", cubby };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "invisible") {
    return "Cubby invisible. Safety rule present only in authoritative memory never reached the session. Never git push origin main without go-ahead. A stuffed cubby is not a hold.";
  }
  if (result.verdict === "ancestor") {
    return "Cubby ancestor. Resolver walked up to an ancestor-encoded project directory. #53734 / #90604 shape.";
  }
  if (result.verdict === "walked-up") {
    return "Cubby walked-up. CWD vs git-root path split. Prompt path and /memory or index path disagree.";
  }
  if (result.verdict === "misfiled") {
    return "Cubby misfiled. Injected auto-memory came from a different project-hash folder than the session cwd/git-root encodes.";
  }
  if (result.verdict === "stale") {
    return "Cubby stale. Chosen local cache significantly behind authoritative repo memory/. Files missing. Mirror step silently failing.";
  }
  if (result.verdict === "ghosted") {
    return "Cubby ghosted. Non-ASCII / hash corruption breaks continuity, or wrong project hash.";
  }
  if (result.verdict === "mirrored-fail") {
    return "Cubby mirrored-fail. Read/tool path returns wrong scope memory, or path-scoped rules make auto-memory unreachable.";
  }
  return "Cubby refuse. A stuffed cubby is not a hold.";
}

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "UserPromptSubmit",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "UserPromptSubmit",
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? denyMessage(result)
          : "Cubby stowed. Correct cache for cwd/git-root. Authoritative memory mirrored. Safety rules would be visible. Cache path would be detectable. Idle word is stowed.",
        interrupt: deny,
      },
    },
    ...result,
    sinks: sinks.events,
  };
}

function send(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization",
  });
  res.end(json);
}

export function listen(port = 9090) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "cubby",
        hook: "UserPromptSubmit",
        verbs: "stowed|misfiled|ancestor|stale|invisible|walked-up|unsurfaced|ghosted|mirrored-fail|restored",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a cubby action { action, cubby? }." });
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8").trim();
    let payload = {};
    try {
      payload = raw ? parsePayload(raw) : {};
    } catch {
      send(res, 400, { ok: false, error: "JSON body required." });
      return;
    }
    const out = await handle(payload);
    send(res, 200, out);
  });
  server.listen(port, "127.0.0.1", () => {
    process.stderr.write(`cubby hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9090);
    listen(Number.isFinite(port) ? port : 9090);
  } else {
    const fileArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
    let payload;
    if (fileArg) {
      payload = parsePayload(readFileSync(fileArg, "utf8"));
    } else {
      payload = await readStdin();
    }
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}

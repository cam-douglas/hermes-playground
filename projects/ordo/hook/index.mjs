#!/usr/bin/env node
/**
 * Ordo sacristy hook. A written plugin command is not a hold.
 * Score the missal or admit appointed.
 *
 *   echo '{"command":"","result":""}' | node index.mjs
 *   node index.mjs office.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   ORDO_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   ORDO_GITHUB_TOKEN   Ordo-ledger issue. Absent → demo ledger.
 *   ORDO_LINEAR_KEY     Silent ticket. Absent → demo row.
 *
 * NOT Larder / Tappet / Reed / Assay / Cinch / Sprag / Visa / leftover woodworking.
 * Idle word is appointed, never the product name, never missal.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedSilent } from "./ordo.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedSilent());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedSilent();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && (parsed.action || parsed.office || parsed.missal || parsed.command || parsed.result || parsed.num_turns != null || parsed.numTurns != null)) {
      return parsed.action || parsed.office || parsed.missal ? parsed : { action: "score", office: parsed };
    }
    if (Array.isArray(parsed)) return { action: "score", office: { command: parsed[0], session: "stdin", scored: true } };
  } catch {
    const office = parseSessionTrace(text);
    if (office.command || office.result || office.storedAsResult) {
      return { action: "score", office };
    }
    return { error: "unparseable", raw: text };
  }
  const office = parseSessionTrace(text);
  return { action: "score", office };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "silent") {
    return "Ordo silent. Unknown command, is_error false, exit 0. A written plugin command is not a hold.";
  }
  if (result.verdict === "hollow") {
    return "Ordo hollow. num_turns 0. Error string stored as the analysis result.";
  }
  if (result.verdict === "unknown") {
    return "Ordo unknown. Plugin office did not resolve in the headless missal.";
  }
  return "Ordo refuse. A written plugin command is not a hold.";
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
          : "Ordo appointed. Plugin command resolved and ran. Idle word is appointed.",
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
        product: "ordo",
        hook: "UserPromptSubmit",
        verbs: "appointed|unknown|silent|hollow|builtin|missing|loud|stale|resolved|cache-ok",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a missal action { action, office? }." });
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
    process.stderr.write(`ordo hook listening on http://127.0.0.1:${port}\n`);
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

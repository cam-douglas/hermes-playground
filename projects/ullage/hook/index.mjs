#!/usr/bin/env node
/**
 * Ullage cellar hook. A missing compaction ticket is not a hold.
 * Score the cask or admit gauged.
 *
 *   echo '{"turns":[...]}' | node index.mjs
 *   node index.mjs trace.jsonl
 *   node index.mjs --listen 9090
 *
 * Env:
 *   ULLAGE_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   ULLAGE_GITHUB_TOKEN   Ullage-ledger issue. Absent → demo ledger.
 *   ULLAGE_LINEAR_KEY     Waste ticket. Absent → demo row.
 *
 * NOT Fathom / Quench / Coda / Visa / Sprag / leftover woodworking.
 * Idle word is gauged, never the product name, never empty.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedUllaged } from "./ullage.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedUllaged());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedUllaged();
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && (parsed.action || parsed.cask || parsed.probe || parsed.turns)) {
      return parsed.action || parsed.cask || parsed.probe ? parsed : { action: "score", cask: parsed };
    }
    if (Array.isArray(parsed)) return { action: "score", cask: { turns: parsed, session: "stdin", scored: true } };
  } catch {
    const cask = parseSessionTrace(text);
    if (cask.turns && cask.turns.length) return { action: "score", cask };
    return { error: "unparseable", raw: text };
  }
  const cask = parseSessionTrace(text);
  return { action: "score", cask };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "ullaged") {
    return "Ullage ullaged. Partial context drop with no compact ticket. A missing compaction ticket is not a hold.";
  }
  if (result.verdict === "thrashed") {
    return "Ullage thrashed. Cluster of prefix-frozen rewrites. The bung weeps every turn.";
  }
  if (result.verdict === "frozen") {
    return "Ullage frozen. cache_read pinned at the system-prompt prefix.";
  }
  if (result.verdict === "leaked") {
    return "Ullage leaked. Drop plus missing compaction ticket.";
  }
  if (result.verdict === "silent") {
    return "Ullage silent. Drop with empty error / compaction / context-edit records.";
  }
  return "Ullage refuse. A missing compaction ticket is not a hold.";
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
          : "Ullage gauged. Cask full and accounted for. Idle word is gauged.",
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
        product: "ullage",
        hook: "UserPromptSubmit",
        verbs: "gauged|ullaged|thrashed|frozen|leaked|rewritten|doubled|healed|silent|bunged",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a cask action { action, cask? }." });
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8").trim();
    let payload = {};
    try {
      payload = raw ? parsePayload(raw) : {};
    } catch {
      send(res, 400, { ok: false, error: "JSON or JSONL body required." });
      return;
    }
    const out = await handle(payload);
    send(res, 200, out);
  });
  server.listen(port, "127.0.0.1", () => {
    process.stderr.write(`ullage hook listening on http://127.0.0.1:${port}\n`);
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

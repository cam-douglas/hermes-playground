#!/usr/bin/env node
/**
 * Cotter bench hook. A written fireAt is not a hold.
 * Score the pin tray or admit snug.
 *
 *   echo '{"scheduledTasks":[]}' | node index.mjs
 *   node index.mjs tray.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   COTTER_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   COTTER_GITHUB_TOKEN   Cotter-ledger issue. Absent → demo ledger.
 *   COTTER_LINEAR_KEY     Poison / wipe ticket. Absent → demo row.
 *
 * NOT Fusee / Cinch / Reveille / Fob / Ordo / Ullage / Visa /
 * leftover woodworking. Idle word is snug, never the product name,
 * never empty, never fireAt / schedule / registry / poison.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedPoison } from "./cotter.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedPoison());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedPoison();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action || parsed.tray || parsed.registry || parsed.scheduledTasks || parsed.tasks)
    ) {
      return parsed.action || parsed.tray || parsed.registry
        ? parsed
        : { action: "score", tray: parsed };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", tray: { scheduledTasks: parsed, session: "stdin", scored: true } };
    }
  } catch {
    const tray = parseSessionTrace(text);
    if ((tray.scheduledTasks && tray.scheduledTasks.length) || tray.wiped || tray.hollow || tray.zodError) {
      return { action: "score", tray };
    }
    return { error: "unparseable", raw: text };
  }
  const tray = parseSessionTrace(text);
  return { action: "score", tray };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "poison") {
    return "Cotter poison. One string fireAt rejected the whole registry. A written fireAt is not a hold.";
  }
  if (result.verdict === "wipe") {
    return "Cotter wipe. scheduledTasks: [] after a silent update. Definitions still on disk.";
  }
  if (result.verdict === "hollow") {
    return "Cotter hollow. lastFired advanced; zero work was performed.";
  }
  if (result.verdict === "vanish") {
    return "Cotter vanish. Recurring pin gone; spent one-time pins remain.";
  }
  if (result.verdict === "mute-mcp") {
    return "Cotter mute-mcp. Scheduled-task MCP tools missing from session context.";
  }
  return "Cotter refuse. A written fireAt is not a hold.";
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
          : "Cotter snug. Every fireAt is epoch ms, Zod loads the tray. Idle word is snug.",
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
        product: "cotter",
        hook: "UserPromptSubmit",
        verbs: "snug|poison|wipe|hollow|vanish|mute-mcp",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a tray action { action, tray? }." });
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
    process.stderr.write(`cotter hook listening on http://127.0.0.1:${port}\n`);
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

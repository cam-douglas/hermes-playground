#!/usr/bin/env node
/**
 * Visa border hook. A login without a destination is not a hold.
 * Score the border or admit stamped.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9090
 *
 * Env:
 *   VISA_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   VISA_GITHUB_TOKEN   Visa-ledger issue. Absent → demo ledger.
 *   VISA_LINEAR_KEY     Border ticket. Absent → demo row.
 *
 * NOT Sprag / Reed / Husk / leftover woodworking.
 * Omitted resource on /authorize and/or /token is the #90497 bug.
 * Idle word is stamped, never the product name, never empty, never
 * visa / resource / oauth / audience.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90497Omitted } from "./visa.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90497Omitted());
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({ error: "unparseable", raw });
      }
    });
    stdin.on("error", reject);
  });
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "omitted") {
    return "Visa omitted. resource absent from /authorize and/or /token. Token aud equals client_id. Strict house 401s. A login without a destination is not a hold.";
  }
  if (result.verdict === "clientid") {
    return "Visa clientid. aud equals OAuth client_id (default audience) instead of the canonical MCP resource URI.";
  }
  if (result.verdict === "refused") {
    return "Visa refused. Strict MCP server returned 401 on the token.";
  }
  if (result.verdict === "audless") {
    return "Visa audless. Token has no useful audience claim for the MCP resource.";
  }
  if (result.verdict === "slashy") {
    return "Visa slashy. resource was sent but trailing-slash corrupted. Shape #52871.";
  }
  if (result.verdict === "mismatched") {
    return "Visa mismatched. aud / resource URI does not match Protected Resource Metadata.";
  }
  return "Visa refuse. A login without a destination is not a hold.";
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
          : "Visa stamped. Login not a hold. Idle word is stamped.",
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
        product: "visa",
        hook: "UserPromptSubmit",
        verbs: "stamped|omitted|audless|clientid|refused|strict|slashy|mismatched|granted|held",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a probe action { action, probe? }." });
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8").trim();
    let payload = {};
    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      send(res, 400, { ok: false, error: "JSON body required." });
      return;
    }
    const out = await handle(payload);
    send(res, 200, out);
  });
  server.listen(port, "127.0.0.1", () => {
    process.stderr.write(`visa hook listening on http://127.0.0.1:${port}\n`);
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
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}

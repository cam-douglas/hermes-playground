#!/usr/bin/env node
/**
 * Shunt road hook. A first delivery is not a hold.
 * Score the road or admit stabled.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9080
 *
 * Env:
 *   SHUNT_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   SHUNT_GITHUB_TOKEN   Shunt-ledger issue. Absent → demo ledger.
 *   SHUNT_LINEAR_KEY     Road ticket. Absent → demo row.
 *
 * NOT Cote / Tappet / Reveille / leftover woodworking. Nested
 * SendMessage follow-up misroute to root + unresolvable
 * from=type. Idle word is stabled, never the product name,
 * never empty, never shunt / shunted.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90463Misrouted } from "./shunt.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90463Misrouted());
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
  if (result.verdict === "misrouted") {
    return "Shunt misrouted. Nested SendMessage follow-up delivered to the root session instead of the requesting parent. A first delivery is not a hold.";
  }
  if (result.verdict === "orphaned") {
    return "Shunt orphaned. Child produced a follow-up after the parent completed; keepalive was already gone.";
  }
  if (result.verdict === "rootbound") {
    return "Shunt rootbound. Follow-up or notification queued to the root session.";
  }
  if (result.verdict === "typecast") {
    return "Shunt typecast. from=general-purpose is an agent type, not an address. No agent named 'general-purpose' is reachable.";
  }
  return "Shunt refuse. A first delivery is not a hold.";
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
          : "Shunt stabled. Wagons in the right road. No misroute. Idle word is stabled.",
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

export function listen(port = 9080) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "shunt",
        hook: "UserPromptSubmit",
        verbs: "stabled|misrouted|orphaned|rootbound|typecast|stalled|tandem|dropped|crosstalk|sidetracked",
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
    process.stderr.write(`shunt hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9080);
    listen(Number.isFinite(port) ? port : 9080);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}

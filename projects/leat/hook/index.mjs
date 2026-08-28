#!/usr/bin/env node
/**
 * Leat race hook. A blocked sleep is not a hold.
 * Score the race or admit stilled.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9090
 *
 * Env:
 *   LEAT_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   LEAT_GITHUB_TOKEN   Leat-ledger issue. Absent → demo ledger.
 *   LEAT_LINEAR_KEY     Race ticket. Absent → demo row.
 *
 * NOT Shunt / Sump / Quench / leftover woodworking. Sleep-block
 * → unbounded until guidance → background promotion → multi-day
 * zombie wait. Idle word is stilled, never the product name,
 * never empty, never leat / millrace / sluice.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90475Racing } from "./leat.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90475Racing());
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
  if (result.verdict === "racing") {
    return "Leat racing. Unbounded until-loop with sleep inside and no iteration cap. A blocked sleep is not a hold.";
  }
  if (result.verdict === "unbounded") {
    return "Leat unbounded. Block message recommended `until <check>; do sleep 2; done` with no cap or deadline.";
  }
  if (result.verdict === "promoted") {
    return "Leat promoted. Foreground timeout moved the loop to background and discarded the bound.";
  }
  if (result.verdict === "lingering") {
    return "Leat lingering. Background loop still live across a session boundary / days later.";
  }
  if (result.verdict === "flooded") {
    return "Leat flooded. Multiple racing until-loops still alive.";
  }
  if (result.verdict === "live") {
    return "Leat live. .output mtime still writing; restart blocked.";
  }
  return "Leat refuse. A blocked sleep is not a hold.";
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
          : "Leat stilled. Gate closed. Race not spinning. No unbounded wait live. Idle word is stilled.",
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
        product: "leat",
        hook: "UserPromptSubmit",
        verbs: "stilled|racing|unbounded|promoted|lingering|flooded|spun|capped|live|shut",
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
    process.stderr.write(`leat hook listening on http://127.0.0.1:${port}\n`);
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

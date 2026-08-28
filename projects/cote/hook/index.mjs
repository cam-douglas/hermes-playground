#!/usr/bin/env node
/**
 * Cote loft hook. A success receipt is not a roost.
 * Score the loft or admit roosted.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9332
 *
 * Env:
 *   COTE_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   COTE_GITHUB_TOKEN   Cote-ledger issue. Absent → demo ledger.
 *   COTE_LINEAR_KEY     Drained/parked/consumed ticket. Absent → demo row.
 *
 * NOT Reveille / Husk / Coda / Suture / Aside / Chute / Tain / Larder /
 * Tappet. Resume hub identity + inbox routing. Idle word is roosted,
 * never the product name.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90332Drained } from "./cote.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90332Drained());
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
  if (result.verdict === "drained") {
    return "Cote drained. Inbox emptied to []; msg_id absent from the parent.";
  }
  if (result.verdict === "parked") {
    return "Cote parked. Named agent stays alive and idle after a consumed SendMessage.";
  }
  if (result.verdict === "stray") {
    return "Cote stray. Team hub is the placeholder; parent-session-id is the resumed id.";
  }
  if (result.verdict === "crossed") {
    return "Cote crossed. Completion routed to the wrong parent.";
  }
  if (result.verdict === "consumed") {
    return "Cote consumed. Watcher took the inbox item; the parent never saw it.";
  }
  if (result.verdict === "late") {
    return "Cote late. Team was stamped before resume finished replacing the placeholder.";
  }
  return "Cote refuse. A success receipt is not a roost.";
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
          : "Cote roosted. Live session id matches leadSessionId. Inbox delivered. Idle word is roosted.",
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

export function listen(port = 9332) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "cote",
        hook: "UserPromptSubmit",
        verbs: "roosted|lofted|flown|drained|parked|stray|banded|crossed|consumed|late",
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
    process.stderr.write(`cote hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9332);
    listen(Number.isFinite(port) ? port : 9332);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}

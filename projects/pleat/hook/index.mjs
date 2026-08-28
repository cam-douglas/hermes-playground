#!/usr/bin/env node
/**
 * Pleat cloth hook. A rendered fold is not a hold.
 * Score the cloth or admit flat.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9060
 *
 * Env:
 *   PLEAT_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   PLEAT_GITHUB_TOKEN   Pleat-ledger issue. Absent → demo ledger.
 *   PLEAT_LINEAR_KEY     Buried / ghosted ticket. Absent → demo row.
 *
 * NOT Aside / Coda / Chad / Blot / leftover woodworking. Desktop
 * fold hiding mid-turn answers. Idle word is flat, never the
 * product name, never empty.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90425Pleated } from "./pleat.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90425Pleated());
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
  if (result.verdict === "pleated") {
    return "Pleat pleated. Assistant text between tool calls collapsed under Ran N commands. A rendered fold is not a hold.";
  }
  if (result.verdict === "buried") {
    return "Pleat buried. Requested explanation exists in the transcript but is hidden in the fold.";
  }
  if (result.verdict === "swallowed") {
    return "Pleat swallowed. Numbered list appears to start mid-sequence. Earlier items are in the fold.";
  }
  if (result.verdict === "ghosted") {
    return "Pleat ghosted. Model believes it answered. User never saw it.";
  }
  return "Pleat refuse. A rendered fold is not a hold.";
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
          : "Pleat flat. Pleat pressed open. Prose visible. Idle word is flat.",
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

export function listen(port = 9060) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "pleat",
        hook: "UserPromptSubmit",
        verbs: "flat|pleated|buried|folded|swallowed|midturn|chrome|fragment|ghosted|aired",
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
    process.stderr.write(`pleat hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9060);
    listen(Number.isFinite(port) ? port : 9060);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}

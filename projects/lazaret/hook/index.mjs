#!/usr/bin/env node
/**
 * Lazaret bill hook. A written reminder is not a hold.
 * Score the desk or admit pratique.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9090
 *
 * Env:
 *   LAZARET_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   LAZARET_GITHUB_TOKEN   Lazaret-ledger issue. Absent → demo ledger.
 *   LAZARET_LINEAR_KEY     Bill ticket. Absent → demo row.
 *
 * NOT Fusee / Iota / Leat / Knock / Scrim / leftover woodworking.
 * Safety-reminder false positive on a legitimate file. Idle word
 * is pratique, never the product name, never empty, never lazaret /
 * quarantine / malware / reminder.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90326Lost } from "./lazaret.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90326Lost());
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
  if (result.verdict === "lost") {
    return "Lazaret lost. Unattended seat refused a legitimate module; the budget died waiting for confirm. A written reminder is not a hold.";
  }
  if (result.verdict === "refused") {
    return "Lazaret refused. Interactive subagent refused a legitimate module per the system reminder.";
  }
  if (result.verdict === "stranded") {
    return "Lazaret stranded. Confirmation asked, nobody in the session.";
  }
  if (result.verdict === "cordoned") {
    return "Lazaret cordoned. Reminder fired, work stopped, waiting.";
  }
  if (result.verdict === "yellow") {
    return "Lazaret yellow. Reminder fired on a legitimate file. The yellow jack is not a hold.";
  }
  if (result.verdict === "false") {
    return "Lazaret false. Classified false-positive. A written reminder is not a hold.";
  }
  if (result.verdict === "timed") {
    return "Lazaret timed. Budget exhausted waiting for confirm.";
  }
  return "Lazaret refuse. A written reminder is not a hold.";
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
          : "Lazaret pratique. Reminder not a hold. Idle word is pratique.",
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
        product: "lazaret",
        hook: "UserPromptSubmit",
        verbs: "pratique|refused|lost|stranded|cordoned|yellow|false|timed|held|passed",
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
    process.stderr.write(`lazaret hook listening on http://127.0.0.1:${port}\n`);
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

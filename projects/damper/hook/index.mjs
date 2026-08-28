#!/usr/bin/env node
/**
 * Damper chimney hook. A settings toggle that reads off is not a hold.
 * Score the draft or admit banked.
 *
 *   echo '{"action":"throw","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9341
 *
 * Env:
 *   DAMPER_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   DAMPER_GITHUB_TOKEN   Damper-ledger issue. Absent → demo ledger.
 *   DAMPER_LINEAR_KEY     Defaulted/disclosed ticket. Absent → demo row.
 *
 * NOT Snib / Knock / Hasp / Cote / Nixie / Larder / Tappet.
 * Remote Control auto-enable without opt-in. Idle word is banked,
 * never the product name, never empty.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90341Defaulted } from "./damper.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90341Defaulted());
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
  if (result.verdict === "defaulted") {
    return "Damper defaulted. New session. Never ran /rc. Connectors disabled. RC already on.";
  }
  if (result.verdict === "drawn") {
    return "Damper drawn. Flue open. Draft is pulling without opt-in.";
  }
  if (result.verdict === "forced") {
    return "Damper forced. VS Code new tab auto-enabled Remote Control.";
  }
  if (result.verdict === "disclosed") {
    return "Damper disclosed. Tool results crossed the bridge without consent.";
  }
  return "Damper refuse. A settings toggle that reads off is not a hold.";
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
          : "Damper banked. Fire banked. Plate shut. Idle word is banked.",
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

export function listen(port = 9341) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "damper",
        hook: "UserPromptSubmit",
        verbs: "banked|drawn|vented|ajar|forced|defaulted|bridged|disclosed|sealed|lit",
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
    process.stderr.write(`damper hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9341);
    listen(Number.isFinite(port) ? port : 9341);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}

#!/usr/bin/env node
/**
 * Kist funeral hook. A session still on the default list is not a hold.
 * Score the lid or admit laid.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9029
 *
 * Env:
 *   KIST_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   KIST_GITHUB_TOKEN   Kist-ledger issue. Absent → demo ledger.
 *   KIST_LINEAR_KEY     Session-lost ticket. Absent → demo row.
 *
 * NOT Wraith / Damper / Snib / Cote / Reveille / Gasket /
 * leftover woodworking. Teardown-archive that never unarchives.
 * Idle word is laid, never the product name, never empty.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90387Kisted } from "./kist.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90387Kisted());
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
  if (result.verdict === "kisted") {
    return "Kist kisted. Archived on teardown with no user archive action. Cloud session vanished from the mobile default list.";
  }
  if (result.verdict === "hollow") {
    return "Kist hollow. Local session active and reattached. Cloud still archived.";
  }
  if (result.verdict === "stuck") {
    return "Kist stuck. Local unarchive ran. Zero CCR unarchive to cloud.";
  }
  if (result.verdict === "lost") {
    return "Kist lost. Gone from the mobile default list. Only under Archived.";
  }
  if (result.verdict === "sealed") {
    return "Kist sealed. No desktop-side action restores the cloud session.";
  }
  return "Kist refuse. A session still on the default list is not a hold.";
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
          : "Kist laid. Lid shut. Nothing scored. Idle word is laid.",
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

export function listen(port = 9029) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "kist",
        hook: "UserPromptSubmit",
        verbs: "laid|kisted|risen|hollow|stuck|lost|sealed|recalled|split|veiled",
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
    process.stderr.write(`kist hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9029);
    listen(Number.isFinite(port) ? port : 9029);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}

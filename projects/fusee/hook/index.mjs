#!/usr/bin/env node
/**
 * Fusee dial hook. A written cron / fireAt is not a hold.
 * Score the dial or admit wound.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9090
 *
 * Env:
 *   FUSEE_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   FUSEE_GITHUB_TOKEN   Fusee-ledger issue. Absent → demo ledger.
 *   FUSEE_LINEAR_KEY     Dial ticket. Absent → demo row.
 *
 * NOT Iota / Leat / Shunt / leftover woodworking. Scheduler
 * fires before configured fireAt/cron slot. Idle word is
 * wound, never the product name, never empty, never fusee /
 * clock / early / schedule.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90485Early } from "./fusee.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90485Early());
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
  if (result.verdict === "early") {
    return "Fusee early. Dispatched before the configured fireAt/cron. A written cron is not a hold.";
  }
  if (result.verdict === "sprung") {
    return "Fusee sprung. Spring released before the dial says so.";
  }
  if (result.verdict === "raced") {
    return "Fusee raced. Dispatch raced ahead of the configured slot by a large margin.";
  }
  if (result.verdict === "ahead") {
    return "Fusee ahead. fireAt one-off ran early.";
  }
  if (result.verdict === "jumped") {
    return "Fusee jumped. Cron slot jumped early.";
  }
  if (result.verdict === "premature") {
    return "Fusee premature. Evaluation/decision task ran before its window.";
  }
  if (result.verdict === "voided") {
    return "Fusee voided. Early dispatch caught only by a hand-written wall-clock guard.";
  }
  return "Fusee refuse. A written cron / fireAt is not a hold.";
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
          : "Fusee wound. Spring regulated. Fire time honored. Idle word is wound.",
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
        product: "fusee",
        hook: "UserPromptSubmit",
        verbs: "wound|early|sprung|raced|ahead|jumped|premature|voided|held|true",
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
    process.stderr.write(`fusee hook listening on http://127.0.0.1:${port}\n`);
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

#!/usr/bin/env node
/**
 * Scant scantling hook. A written shell snapshot is not a hold.
 * Score the board or admit fit.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9421
 *
 * Env:
 *   SCANT_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   SCANT_GITHUB_TOKEN   Scant-ledger issue. Absent → demo ledger.
 *   SCANT_LINEAR_KEY     Poisoned/clipped ticket. Absent → demo row.
 *
 * NOT Larder / Reed / Assay / Quench / Wraith / Chad / leftover
 * woodworking. Snapshot writer clipping PATH. Idle word is fit,
 * never the product name, never empty.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90421Scant } from "./scant.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90421Scant());
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
  if (result.verdict === "scant") {
    return "Scant cut. Snapshot truncated mid-PATH. Unclosed quote. A written shell snapshot is not a hold.";
  }
  if (result.verdict === "clipped") {
    return "Scant clipped. Hit the ~8191 / ~7.2KB wall. Truncation size + wrapper ≈ cmdline limit.";
  }
  if (result.verdict === "poisoned") {
    return "Scant poisoned. Every Bash call fails unexpected EOF while looking for matching quote.";
  }
  if (result.verdict === "bloated") {
    return "Scant bloated. Plugin PATH contribution pushed length over the wall.";
  }
  return "Scant refuse. A written shell snapshot is not a hold.";
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
          : "Scant fit. Board true to length. Snapshot closes clean. Idle word is fit.",
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

export function listen(port = 9421) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "scant",
        hook: "UserPromptSubmit",
        verbs: "fit|scant|clipped|open|poisoned|bloated|stubbed|mute|sealed|true",
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
    process.stderr.write(`scant hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9421);
    listen(Number.isFinite(port) ? port : 9421);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}

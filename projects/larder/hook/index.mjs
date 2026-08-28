#!/usr/bin/env node
/**
 * Larder stillroom hook. A sync stamp is not a delivery.
 * Score the shelf or admit stocked.
 *
 *   echo '{"action":"score","probe":{...}}' | node index.mjs
 *   node index.mjs --listen 9329
 *
 * Env:
 *   LARDER_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   LARDER_GITHUB_TOKEN   Larder-ledger issue. Absent → demo ledger.
 *   LARDER_LINEAR_KEY     Frozen/greened/served ticket. Absent → demo row.
 *
 * NOT Husk / Reed / Parity / Tappet / Aside / Chute / Tain / Snib / Veto /
 * Assay / Wicket / Sigil / Stencil / Suture / Blot / Coda / Fathom.
 * Plugin-store content clock vs sync stamp. Idle word is stocked,
 * never the product name.
 */
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, seed90329Stamped } from "./larder.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seed90329Stamped());
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
  if (result.verdict === "stamped") {
    return "Larder stamped. Sync stamp advanced; plugin folders stood still.";
  }
  if (result.verdict === "frozen") {
    return "Larder frozen. Toggle unstuck once; the store stayed frozen.";
  }
  if (result.verdict === "greened") {
    return "Larder greened. Every indicator green; no diagnostic trail.";
  }
  if (result.verdict === "drifted") {
    return "Larder drifted. CLI pins behind with autoUpdate on.";
  }
  if (result.verdict === "aged") {
    return "Larder aged. Hold weeks-stale; folders never moved.";
  }
  if (result.verdict === "served") {
    return "Larder served. Session diagnosing the freeze loaded from this store.";
  }
  return "Larder refuse. A sync stamp is not a delivery.";
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
          : "Larder stocked. Content arrived on the shelf. Idle word is stocked.",
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

export function listen(port = 9329) {
  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      send(res, 204, { ok: true });
      return;
    }
    if (req.method === "GET" && (req.url === "/" || req.url === "/health")) {
      send(res, 200, {
        ok: true,
        product: "larder",
        hook: "UserPromptSubmit",
        verbs: "stocked|stamped|frozen|greened|toggled|drifted|lagged|aisled|aged|served",
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
    process.stderr.write(`larder hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9329);
    listen(Number.isFinite(port) ? port : 9329);
  } else {
    const payload = await readStdin();
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}

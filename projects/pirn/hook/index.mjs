#!/usr/bin/env node
/**
 * Pirn bench hook. A first delivery is not a hold.
 * Score the pirn or admit beamed.
 *
 *   echo '{"instructionShaped":true,"truncated":true}' | node index.mjs
 *   node index.mjs pirn.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   PIRN_SLACK_WEBHOOK  Incoming webhook. Absent → demo "Would post to Slack".
 *   PIRN_GITHUB_TOKEN   Pirn-ledger issue. Absent → demo ledger.
 *   PIRN_LINEAR_KEY     Cropped / thrice ticket. Absent → demo row.
 *
 * NOT Shunt / Cote / Husk / Coda / Aside / Suture / Cotter /
 * leftover woodworking. Idle word is beamed, never the product
 * name, never empty, never truncat* / crop / snip / cut.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedCropped } from "./pirn.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedCropped());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedCropped();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.pirn ||
        parsed.probe ||
        parsed.instructionShaped != null ||
        parsed.truncated != null ||
        parsed.harnessTag != null ||
        parsed.runs != null)
    ) {
      return parsed.action || parsed.pirn || parsed.probe
        ? parsed
        : { action: "score", pirn: parsed };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", pirn: { session: "stdin", scored: true } };
    }
  } catch {
    const pirn = parseSessionTrace(text);
    if (pirn.instructionShaped || pirn.truncated || pirn.harnessTag || pirn.runs) {
      return { action: "score", pirn };
    }
    return { error: "unparseable", raw: text };
  }
  const pirn = parseSessionTrace(text);
  return { action: "score", pirn };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "cropped") {
    return "Pirn cropped. Harness tagged instruction-shaped and cut the report at ~2500. A first delivery is not a hold.";
  }
  if (result.verdict === "thrice") {
    return "Pirn thrice. Same truncated report recovered only after three full agent runs. Each SendMessage re-ask re-ran and re-truncated.";
  }
  if (result.verdict === "tagged") {
    return "Pirn tagged. Harness instruction-shaped prefix present (settings-json or similar).";
  }
  if (result.verdict === "looped") {
    return "Pirn looped. SendMessage re-ask caused a full transcript resume / re-run after a truncated delivery.";
  }
  if (result.verdict === "midcut") {
    return "Pirn midcut. Truncation cuts mid-sentence / mid-section.";
  }
  return "Pirn refuse. A first delivery is not a hold.";
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
          : "Pirn beamed. Full report wound onto the pirn without cut. Idle word is beamed.",
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
        product: "pirn",
        hook: "UserPromptSubmit",
        verbs: "beamed|cropped|thrice|tagged|looped|midcut",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a pirn action { action, pirn? }." });
      return;
    }
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8").trim();
    let payload = {};
    try {
      payload = raw ? parsePayload(raw) : {};
    } catch {
      send(res, 400, { ok: false, error: "JSON body required." });
      return;
    }
    const out = await handle(payload);
    send(res, 200, out);
  });
  server.listen(port, "127.0.0.1", () => {
    process.stderr.write(`pirn hook listening on http://127.0.0.1:${port}\n`);
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
    const fileArg = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
    let payload;
    if (fileArg) {
      payload = parsePayload(readFileSync(fileArg, "utf8"));
    } else {
      payload = await readStdin();
    }
    const out = await handle(payload);
    process.stdout.write(`${JSON.stringify(out)}\n`);
  }
}

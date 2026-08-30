#!/usr/bin/env node
/**
 * Lacuna desk hook. A watermark is
 * not a gathering. Score the desk
 * or admit collated.
 *
 *   echo '{"files":[],"highwatermark":22,"taskList":"No tasks found"}' | node index.mjs
 *   node index.mjs lacuna.json
 *   node index.mjs --dir /tmp/fake-tasks
 *   node index.mjs --listen 9090
 *
 * Env:
 *   LACUNA_SLACK_WEBHOOK Incoming webhook. Absent → demo "Would post to Slack".
 *   LACUNA_GITHUB_TOKEN  Lacuna-ledger. Absent → demo ledger.
 *   LACUNA_LINEAR_KEY    Desk ticket. Absent → demo row.
 *
 * NOT Ambo / Slype / Tally / Pale /
 * Chatelaine / Byline / Cubby /
 * Ullage / Veto / Husk / Quoin /
 * leftover woodworking. Idle word
 * is collated, never the product
 * name, never empty, never unheard
 * / passed / squared / bound / girt.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseLacunaJson, probeFromDir, seedScraped } from "./lacuna.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedScraped());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedScraped();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.lacuna ||
        parsed.probe ||
        parsed.store ||
        parsed.desk ||
        parsed.files != null ||
        parsed.highwatermark != null ||
        parsed.taskList ||
        parsed.nextCreateId != null)
    ) {
      return parsed.action || parsed.lacuna || parsed.probe || parsed.store || parsed.desk
        ? parsed
        : { action: "score", lacuna: parseLacunaJson(parsed) };
    }
  } catch {
    const lacuna = parseLacunaJson(text);
    if (lacuna.files.length || lacuna.highwatermark != null || lacuna.taskList) {
      return { action: "score", lacuna };
    }
    return { error: "unparseable", raw: text };
  }
  const lacuna = parseLacunaJson(text);
  return { action: "score", lacuna };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "scraped") {
    return "Lacuna scraped. Every <id>.json unlinked. .highwatermark written. TaskList reports No tasks found.";
  }
  if (result.verdict === "gapped") {
    return "Lacuna gapped. Surviving ids start at highwatermark+1. The catchword points past the lacuna.";
  }
  if (result.verdict === "watermarked") {
    return "Lacuna watermarked. .highwatermark present. Intact sessions lack the counter file.";
  }
  if (result.verdict === "resumed-past") {
    return "Lacuna resumed-past. TaskCreate allocates from .highwatermark + 1.";
  }
  if (result.verdict === "vanished") {
    return "Lacuna vanished. Prior phases gone with no delete event.";
  }
  if (result.verdict === "counterfeit-empty") {
    return "Lacuna counterfeit-empty. TaskList No tasks found after a wipe. Looks like never-created.";
  }
  if (result.verdict === "skipped") {
    return "Lacuna skipped. Ids jump the lacuna.";
  }
  if (result.verdict === "delayed-wipe") {
    return "Lacuna delayed-wipe. ~5.1s after a teammate completes the highest id. #88346 corroboration.";
  }
  return "Lacuna refuse. A watermark is not a gathering.";
}

export async function handle(payload = {}, env = process.env) {
  const result = decide(payload);
  const sinks = await fire(result, env);
  const deny = shouldDeny(result);
  return {
    hook_event_name: "PermissionRequest",
    permissionDecision: deny ? "deny" : "allow",
    hookSpecificOutput: {
      hookEventName: "PermissionRequest",
      permissionDecision: deny ? "deny" : "allow",
      decision: {
        behavior: deny ? "deny" : "allow",
        message: deny
          ? denyMessage(result)
          : "Lacuna collated. Store complete. TaskList truthful. Idle word is collated.",
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
        product: "lacuna",
        hook: "store-fingerprint",
        verbs:
          "collated|scraped|gapped|watermarked|resumed-past|vanished|intact|counterfeit-empty|skipped|delayed-wipe",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a lacuna action { action, lacuna? }." });
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
    process.stderr.write(`lacuna hook listening on http://127.0.0.1:${port}\n`);
  });
  return server;
}

const asCli = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (asCli) {
  const listenFlag = process.argv.includes("--listen");
  const dirFlag = process.argv.includes("--dir");
  if (listenFlag) {
    const port = Number(process.argv[process.argv.indexOf("--listen") + 1] || 9090);
    listen(Number.isFinite(port) ? port : 9090);
  } else if (dirFlag) {
    const dir = process.argv[process.argv.indexOf("--dir") + 1];
    const probe = probeFromDir(dir, { taskList: "No tasks found", deleteEvent: false, scored: true });
    const out = await handle({ action: "score", lacuna: probe });
    process.stdout.write(`${JSON.stringify(out)}\n`);
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

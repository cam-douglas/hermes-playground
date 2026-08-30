#!/usr/bin/env node
/**
 * Waif foundling-home hook. An
 * abandoned child is not a hold.
 * Score the ward or admit sheltered.
 *
 *   echo '{"timedOut":true}' | node index.mjs
 *   node index.mjs waif.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   WAIF_SLACK_WEBHOOK Incoming webhook. Absent → demo "Would post to Slack".
 *   WAIF_GITHUB_TOKEN  Waif-ledger issue. Absent → demo ledger.
 *   WAIF_LINEAR_KEY    Abandoned-tree ward ticket. Absent → demo row.
 *
 * NOT Gaff / Berth / Carrel /
 * leftover woodworking.
 * Idle word is sheltered, never the
 * product name, never empty, never
 * silent / mute / idle / yanked /
 * alongside / home / orphaned.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseWaifJson, seedAbandoned } from "./waif.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedAbandoned());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedAbandoned();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.waif ||
        parsed.probe ||
        parsed.ward ||
        parsed.intake ||
        parsed.timedOut != null ||
        parsed.childCount != null ||
        parsed.bash != null ||
        parsed.modelSaw != null)
    ) {
      return parsed.action || parsed.waif || parsed.probe || parsed.ward || parsed.intake
        ? parsed
        : { action: "score", waif: parseWaifJson(parsed) };
    }
  } catch {
    const waif = parseWaifJson(text);
    if (waif.timedOut || waif.childCount) {
      return { action: "score", waif };
    }
    return { error: "unparseable", raw: text };
  }
  const waif = parseWaifJson(text);
  return { action: "score", waif };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "abandoned") {
    return "Waif abandoned. Bash timed out; model saw the timeout; child tree still crawling with a dead parent.";
  }
  if (result.verdict === "orphaned") {
    return "Waif orphaned. Children still running after the parent PID died.";
  }
  if (result.verdict === "tree-alive") {
    return "Waif tree-alive. Descendant find/grep/pipeline processes still running after the Bash parent left.";
  }
  if (result.verdict === "parent-dead") {
    return "Waif parent-dead. Tracked shell is gone; the child tree was never reaped.";
  }
  if (result.verdict === "timeout-seen") {
    return "Waif timeout-seen. Model already received the timeout error while children still run.";
  }
  if (result.verdict === "group-unkilled") {
    return "Waif group-unkilled. POSIX process group was not killed on Bash-tool timeout.";
  }
  if (result.verdict === "job-missing") {
    return "Waif job-missing. Windows Job Object was never attached to the Bash spawn.";
  }
  if (result.verdict === "taskkill-skipped") {
    return "Waif taskkill-skipped. Windows taskkill /T never used; descendants survive.";
  }
  if (result.verdict === "defender-load") {
    return "Waif defender-load. Orphan find.exe/grep.exe holding machine-wide CPU/AV load.";
  }
  return "Waif refuse. An abandoned child is not a hold.";
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
          : "Waif sheltered. Timeout killed the whole tree via Job Object / process group. Hold is quiet. Idle word is sheltered.",
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
        product: "waif",
        hook: "UserPromptSubmit",
        verbs: "sheltered|abandoned|orphaned|tree-alive|parent-dead|timeout-seen|group-unkilled|job-missing|taskkill-skipped|defender-load|off-ward",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a waif action { action, waif? }." });
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
    process.stderr.write(`waif hook listening on http://127.0.0.1:${port}\n`);
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

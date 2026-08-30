#!/usr/bin/env node
/**
 * Byline rack hook. A ghost byline
 * is not a hold. Score the rack or
 * admit credited.
 *
 *   echo '{"events":[...]}' | node index.mjs
 *   node index.mjs byline.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   BYLINE_SLACK_WEBHOOK Incoming webhook. Absent → demo "Would post to Slack".
 *   BYLINE_GITHUB_TOKEN  Byline-ledger issue. Absent → demo ledger.
 *   BYLINE_LINEAR_KEY    Ghosted / split / borrowed ticket. Absent → demo row.
 *
 * NOT Shunt / Cote / Nixie /
 * Tappet / Sounder / Fascia /
 * Wicket / Datum / Calque / Quoin /
 * Gaff / leftover woodworking.
 * Idle word is credited, never the
 * product name, never empty, never
 * silent / mute / idle / dead /
 * sealed / fronted.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseHookJson, parseSessionTrace, seedSplit } from "./byline.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedSplit());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedSplit();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.byline ||
        parsed.probe ||
        parsed.events != null ||
        parsed.transcripts != null ||
        parsed.hook_event_name != null ||
        parsed.agent_id != null)
    ) {
      return parsed.action || parsed.byline || parsed.probe
        ? parsed
        : { action: "score", byline: parseHookJson(parsed) };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", byline: parseHookJson(parsed) };
    }
  } catch {
    const byline = parseSessionTrace(text);
    if (byline.events.length || Object.keys(byline.transcripts).length) {
      return { action: "score", byline };
    }
    return { error: "unparseable", raw: text };
  }
  const byline = parseSessionTrace(text);
  return { action: "score", byline };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "split") {
    return "Byline split. Consecutive tool calls of one real subagent landed under two ids. The ghost was never hired and never killed.";
  }
  if (result.verdict === "borrowed") {
    return "Byline borrowed. A ghost born during one subagent later collected another reporter's copy.";
  }
  if (result.verdict === "ghosted") {
    return "Byline ghosted. PreToolUse/PostToolUse under an agent_id that never had SubagentStart.";
  }
  if (result.verdict === "unstopped") {
    return "Byline unstopped. Hired entry never received SubagentStop.";
  }
  if (result.verdict === "stray") {
    return "Byline stray. Short burst on a ghost then silence.";
  }
  if (result.verdict === "hanging") {
    return "Byline hanging. Ghost id keeps collecting copy. Never hired, never killed.";
  }
  if (result.verdict === "nest-split") {
    return "Byline nest-split. Stray id appeared right after an Agent-tool child spawn.";
  }
  if (result.verdict === "resume-split") {
    return "Byline resume-split. Stray id appeared right after SendMessage resume of a completed child.";
  }
  if (result.verdict === "untyped") {
    return "Byline untyped. Payload has agent_id but no agent_type.";
  }
  return "Byline refuse. A ghost byline is not a hold.";
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
          : "Byline credited. PreToolUse/PostToolUse under the same agent_id as SubagentStart, agent_type present, later SubagentStop. Hold is quiet. Idle word is credited.",
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
        product: "byline",
        hook: "UserPromptSubmit",
        verbs: "credited|ghosted|untyped|unstopped|hanging|split|stray|borrowed|nest-split|resume-split",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a byline action { action, byline? }." });
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
    process.stderr.write(`byline hook listening on http://127.0.0.1:${port}\n`);
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

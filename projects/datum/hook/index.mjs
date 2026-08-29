#!/usr/bin/env node
/**
 * Datum plate hook. A wrong base
 * is not a hold. Score the plate
 * or admit level.
 *
 *   echo '{"prBase":"develop","measuredBase":"master"}' | node index.mjs
 *   node index.mjs datum.json
 *   node index.mjs --listen 9090
 *
 * Env:
 *   DATUM_SLACK_WEBHOOK Incoming webhook. Absent → demo "Would post to Slack".
 *   DATUM_GITHUB_TOKEN  Datum-ledger issue. Absent → demo ledger.
 *   DATUM_LINEAR_KEY    Wrong-base / master-lie / findings-bleed ticket. Absent → demo row.
 *
 * NOT Calque / Fascia / Quoin /
 * Gaff / Sear / Cubby / Grille /
 * Spile / Bollard / Clew / Sounder /
 * Binnacle / Pirn / Cotter / Fob /
 * Visa / Snib / Knock / Veto /
 * Iota / Wicket / Parity /
 * leftover woodworking.
 * Idle word is level, never the
 * product name, never empty, never
 * silent / mute / idle / dead /
 * sealed / fronted / verbatim /
 * calqued.
 */
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { stdin } from "node:process";
import { pathToFileURL } from "node:url";
import { fire } from "./adapters.mjs";
import { decide, parseSessionTrace, seedWrongBase } from "./datum.mjs";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stdin.on("data", (chunk) => chunks.push(chunk));
    stdin.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve(seedWrongBase());
        return;
      }
      resolve(parsePayload(raw));
    });
    stdin.on("error", reject);
  });
}

function parsePayload(raw) {
  const text = String(raw || "").trim();
  if (!text) return seedWrongBase();
  try {
    const parsed = JSON.parse(text);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      (parsed.action ||
        parsed.datum ||
        parsed.probe ||
        parsed.prUrl != null ||
        parsed.prBase != null ||
        parsed.measuredBase != null ||
        parsed.findingsTotal != null ||
        parsed.skill != null)
    ) {
      return parsed.action || parsed.datum || parsed.probe
        ? parsed
        : { action: "score", datum: parsed };
    }
    if (Array.isArray(parsed)) {
      return { action: "score", datum: { session: "stdin", scored: true } };
    }
  } catch {
    const datum = parseSessionTrace(text);
    if (datum.prUrl || datum.prBase || datum.measuredBase || datum.skill || datum.findingsTotal) {
      return { action: "score", datum };
    }
    return { error: "unparseable", raw: text };
  }
  const datum = parseSessionTrace(text);
  return { action: "score", datum };
}

function shouldDeny(result) {
  return Boolean(result.alarm);
}

function denyMessage(result) {
  if (result.verdict === "wrong-base") {
    return "Datum wrong-base. Skill/diff used local master (or other non-PR base) instead of the PR's declared base. A wrong base is not a hold.";
  }
  if (result.verdict === "master-lie") {
    return "Datum master-lie. Review measured against master while the PR base is develop (or another named non-master base).";
  }
  if (result.verdict === "scope-bleed") {
    return "Datum scope-bleed. Findings cite files/lines absent from gh pr diff / the PR's actual changed files.";
  }
  if (result.verdict === "findings-bleed") {
    return "Datum findings-bleed. Majority of returned findings are off-diff (e.g. 5 of 7).";
  }
  if (result.verdict === "unrelated") {
    return "Datum unrelated. Findings come from already-merged history on the branch, not this PR.";
  }
  if (result.verdict === "merge-missed") {
    return "Datum merge-missed. PR merge base / gh pr view --json baseRefName was available but unused.";
  }
  return "Datum refuse. A wrong base is not a hold.";
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
          : "Datum level. Findings scoped only to files in the PR's true merge-base diff. Hold is quiet. Idle word is level.",
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
        product: "datum",
        hook: "UserPromptSubmit",
        verbs: "level|wrong-base|scope-bleed|unrelated|master-lie|develop-base|findings-bleed|merge-missed|skill-review",
      });
      return;
    }
    if (req.method !== "POST") {
      send(res, 405, { ok: false, error: "POST a datum action { action, datum? }." });
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
    process.stderr.write(`datum hook listening on http://127.0.0.1:${port}\n`);
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

import { NextResponse } from "next/server";
import { hookDecisionPayload } from "@/lib/core.mjs";
import { createKnock, waitForDecision } from "@/lib/engine";
import type { KnockRecord } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function authorized(request: Request) {
  const secret = process.env.KNOCK_HOOK_SECRET;
  if (!secret) return true;
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : request.headers.get("x-knock-secret") || "";
  return token === secret;
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const created = await createKnock(body);
  if (!created.ok) return NextResponse.json({ error: created.error }, { status: created.status });

  const wait = String(body.wait ?? "1") !== "0";
  if (!wait) {
    return NextResponse.json({ ok: true, waiting: true, knock: created.knock }, { status: 202 });
  }

  const decided = (await waitForDecision(created.knock.id, 20_000)) as KnockRecord | null;
  if (!decided) return NextResponse.json({ error: "knock not found" }, { status: 404 });
  return NextResponse.json({
    ok: true,
    knock: decided,
    decided: decided.status !== "pending",
    ...hookDecisionPayload(decided),
  });
}

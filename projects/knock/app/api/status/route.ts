import { NextResponse } from "next/server";
import { listPublicKnocks, statusPayload } from "@/lib/engine";

export const dynamic = "force-dynamic";

export async function GET() {
  const knocks = await listPublicKnocks();
  return NextResponse.json({
    ...statusPayload(),
    counts: {
      total: knocks.length,
      pending: knocks.filter((item) => item.status === "pending").length,
      allowed: knocks.filter((item) => item.status === "allowed").length,
      denied: knocks.filter((item) => item.status === "denied").length,
      timed_out: knocks.filter((item) => item.status === "timed_out").length,
    },
  });
}

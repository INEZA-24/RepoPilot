import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "planned",
    phase: 3,
    message: "Scoring endpoints are intentionally deferred until the Phase 3 roadmap.",
  });
}

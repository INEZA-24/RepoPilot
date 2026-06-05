import { NextResponse } from "next/server";
import { getRepo } from "@/lib/github/getRepo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get("owner");
  const repo = searchParams.get("repo");

  if (!owner || !repo) {
    return NextResponse.json({ error: "owner and repo query parameters are required." }, { status: 400 });
  }

  try {
    return NextResponse.json(await getRepo(owner, repo));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to fetch repository metadata." },
      { status: 400 },
    );
  }
}

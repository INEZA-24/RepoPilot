import { NextResponse } from "next/server";
import { analyzeRepository } from "@/lib/github/analyzeRepository";
import { parseRepoUrl } from "@/lib/utils/parseRepoUrl";

export async function POST(request: Request) {
  const body = (await request.json()) as { repoUrl?: string };

  if (!body.repoUrl) {
    return NextResponse.json({ error: "repoUrl is required." }, { status: 400 });
  }

  try {
    const { owner, repo } = parseRepoUrl(body.repoUrl);
    const analysis = await analyzeRepository(owner, repo);

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to analyze repository." },
      { status: 400 },
    );
  }
}

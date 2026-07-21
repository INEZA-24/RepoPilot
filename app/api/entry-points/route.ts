import { NextResponse } from "next/server";
import { buildHeuristicFallback } from "@/lib/ai/fallback";
import { generateEntryPointsWithNvidia, NvidiaProviderError } from "@/lib/ai/nvidia";
import { buildEntryPointPrompt } from "@/lib/ai/prompt";
import { verifyAIEntryPointAnalysis } from "@/lib/ai/verify";
import { getContributorDocuments, getProjectManifest } from "@/lib/github/getContentFile";
import { getIssues } from "@/lib/github/getIssues";
import { getRepo } from "@/lib/github/getRepo";
import { getRepositoryTree } from "@/lib/github/getTree";
import { filterRepositoryPaths } from "@/lib/recommendations/filterRepositoryPaths";
import { rankIssueCandidates } from "@/lib/recommendations/rankIssueCandidates";
import { parseRepoUrl } from "@/lib/utils/parseRepoUrl";
import { contributorProfileSchema } from "@/types/entryPoints";

type EntryPointRequest = { repoUrl?: string; profile?: unknown };
function statusFor(error: unknown) { const msg = error instanceof Error ? error.message : ""; if (/404|not found/i.test(msg)) return 404; if (/429|rate limit/i.test(msg)) return 429; return 500; }
export async function POST(request: Request) {
  let body: EntryPointRequest;
  try { body = await request.json() as EntryPointRequest; if (!body.repoUrl || typeof body.repoUrl !== "string") throw new Error("invalid"); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  try {
    const { owner, repo } = parseRepoUrl(body.repoUrl);
    const profile = contributorProfileSchema.parse(body.profile ?? {});
    const repository = await getRepo(owner, repo);
    const [issues, treeResult, documents, manifest] = await Promise.all([getIssues(owner, repo), getRepositoryTree(owner, repo, repository.default_branch).catch(() => ({ paths: [], truncated: false })), getContributorDocuments(owner, repo), getProjectManifest(owner, repo)]);
    const paths = filterRepositoryPaths(treeResult.paths);
    const candidates = rankIssueCandidates(issues);
    const prompt = buildEntryPointPrompt({ repository, profile, issues: candidates, paths, treeTruncated: treeResult.truncated, documents, manifest });
    try {
      const ai = await generateEntryPointsWithNvidia(prompt);
      const verified = verifyAIEntryPointAnalysis(ai, candidates, paths);
      return NextResponse.json({ ...verified, limitations: [...verified.limitations, ...(treeResult.truncated ? ["GitHub marked the repository tree as truncated, so file-path evidence may be incomplete."] : [])] });
    } catch (error) {
      const fallback = buildHeuristicFallback(repository, candidates, process.env.NVIDIA_MODEL || "heuristic");
      const verified = verifyAIEntryPointAnalysis(fallback, candidates, paths);
      return NextResponse.json({ ...verified, limitations: [...verified.limitations, error instanceof Error ? error.message : "AI generation failed."] }, { status: error instanceof NvidiaProviderError && error.status === 429 ? 429 : 200 });
    }
  } catch (error) { return NextResponse.json({ error: "Unable to generate entry points." }, { status: statusFor(error) }); }
}

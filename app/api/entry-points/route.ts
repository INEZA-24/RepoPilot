import { NextResponse } from "next/server";
import { buildHeuristicFallback } from "@/lib/ai/fallback";
import { repositoryTreeLimitations } from "@/lib/ai/limitations";
import { normalizeNemotronMetadata } from "@/lib/ai/metadata";
import { generateEntryPointsWithNvidia, NVIDIA_MODEL_FALLBACK, NvidiaProviderError } from "@/lib/ai/nvidia";
import { buildEntryPointPrompt } from "@/lib/ai/prompt";
import { verifyAIEntryPointAnalysis } from "@/lib/ai/verify";
import { getContributorDocuments, getProjectManifest } from "@/lib/github/getContentFile";
import { getIssues } from "@/lib/github/getIssues";
import { getRepo } from "@/lib/github/getRepo";
import { getRepositoryTree } from "@/lib/github/getTree";
import { filterRepositoryPaths } from "@/lib/recommendations/filterRepositoryPaths";
import { rankIssueCandidates } from "@/lib/recommendations/rankIssueCandidates";
import { parseRepoUrl, type ParsedRepoUrl } from "@/lib/utils/parseRepoUrl";
import { contributorProfileSchema } from "@/types/entryPoints";

type EntryPointRequest = {
  repoUrl: string;
  profile?: unknown;
};

function statusFor(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (/404|not found/i.test(message)) return 404;
  if (/429|rate limit/i.test(message)) return 429;

  return 500;
}

function parseEntryPointRequest(body: unknown): EntryPointRequest | null {
  const candidate = body as EntryPointRequest;

  if (!candidate || typeof candidate.repoUrl !== "string" || candidate.repoUrl.trim().length === 0) {
    return null;
  }

  return candidate;
}

function parseRepositoryUrl(repoUrl: string): ParsedRepoUrl | NextResponse {
  try {
    return parseRepoUrl(repoUrl);
  } catch {
    return NextResponse.json(
      { error: "Use a valid public GitHub repository URL like https://github.com/owner/repo." },
      { status: 400 },
    );
  }
}

export async function POST(request: Request) {
  let body: EntryPointRequest | null;

  try {
    body = parseEntryPointRequest(await request.json());
  } catch {
    body = null;
  }

  if (!body) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const repoUrl = body.repoUrl;
  const parsedRepo = parseRepositoryUrl(repoUrl);

  if (parsedRepo instanceof NextResponse) {
    return parsedRepo;
  }

  try {
    const { owner, repo } = parsedRepo;
    const profile = contributorProfileSchema.parse(body.profile ?? {});
    const repository = await getRepo(owner, repo);
    const [issues, treeResult, documents, manifest] = await Promise.all([
      getIssues(owner, repo),
      getRepositoryTree(owner, repo, repository.default_branch)
        .then((tree) => ({ ...tree, failed: false }))
        .catch(() => ({ paths: [], truncated: false, failed: true })),
      getContributorDocuments(owner, repo),
      getProjectManifest(owner, repo),
    ]);
    const paths = filterRepositoryPaths(treeResult.paths);
    const candidates = rankIssueCandidates(issues);
    const prompt = buildEntryPointPrompt({
      repository,
      profile,
      issues: candidates,
      paths,
      treeTruncated: treeResult.truncated,
      documents,
      manifest,
    });

    try {
      const ai = await generateEntryPointsWithNvidia(prompt);
      const normalized = normalizeNemotronMetadata(
        ai,
        repository,
        process.env.NVIDIA_MODEL || NVIDIA_MODEL_FALLBACK,
      );
      const verified = verifyAIEntryPointAnalysis(normalized, candidates, paths);

      return NextResponse.json({
        ...verified,
        limitations: [
          ...verified.limitations,
          ...repositoryTreeLimitations(treeResult),
        ],
      });
    } catch (error) {
      const fallback = buildHeuristicFallback(repository, candidates, process.env.NVIDIA_MODEL || "heuristic");
      const verified = verifyAIEntryPointAnalysis(fallback, candidates, paths);

      return NextResponse.json(
        {
          ...verified,
          limitations: [
            ...verified.limitations,
            error instanceof Error ? error.message : "AI generation failed.",
          ],
        },
        { status: error instanceof NvidiaProviderError && error.status === 429 ? 429 : 200 },
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Unable to generate entry points." }, { status: statusFor(error) });
  }
}

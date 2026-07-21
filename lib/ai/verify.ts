import type { AIEntryPointAnalysis, EntryPointRecommendation } from "@/types/entryPoints";
import type { RepositoryIssue } from "@/types/github";

export function verifyRecommendation(
  recommendation: EntryPointRecommendation,
  issues: RepositoryIssue[],
  paths: string[],
): EntryPointRecommendation | null {
  const issueMap = new Map(issues.map((issue) => [issue.number, issue]));
  const pathSet = new Set(paths);
  const filesToRead = recommendation.filesToRead.filter((file) => pathSet.has(file.path));
  let verifiedIssue: RepositoryIssue | undefined;

  if (recommendation.issueNumber !== undefined) {
    verifiedIssue = issueMap.get(recommendation.issueNumber);

    if (!verifiedIssue) {
      return null;
    }
  }

  if (recommendation.type === "issue" && !verifiedIssue) {
    return null;
  }

  if (recommendation.filesToRead.length > 0 && filesToRead.length === 0 && recommendation.type !== "issue") {
    return null;
  }

  return {
    id: recommendation.id,
    type: recommendation.type,
    title: recommendation.title,
    summary: recommendation.summary,
    difficulty: recommendation.difficulty,
    confidence: recommendation.confidence,
    ...(verifiedIssue ? { issueNumber: verifiedIssue.number, issueUrl: verifiedIssue.html_url } : {}),
    whyItFits: recommendation.whyItFits,
    skillsRequired: recommendation.skillsRequired,
    filesToRead,
    firstSteps: recommendation.firstSteps,
    evidence: recommendation.evidence,
    warnings: recommendation.warnings,
  };
}

export function verifyAIEntryPointAnalysis(
  analysis: AIEntryPointAnalysis,
  issues: RepositoryIssue[],
  paths: string[],
): AIEntryPointAnalysis {
  return {
    ...analysis,
    recommendations: analysis.recommendations
      .map((recommendation) => verifyRecommendation(recommendation, issues, paths))
      .filter((recommendation): recommendation is EntryPointRecommendation => Boolean(recommendation))
      .slice(0, 3),
  };
}

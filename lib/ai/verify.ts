import type { AIEntryPointAnalysis, EntryPointRecommendation } from "@/types/entryPoints";
import type { RepositoryIssue } from "@/types/github";

export function verifyRecommendation(rec: EntryPointRecommendation, issues: RepositoryIssue[], paths: string[]): EntryPointRecommendation | null {
  const issueMap = new Map(issues.map((issue) => [issue.number, issue]));
  const pathSet = new Set(paths);
  let next = { ...rec, filesToRead: rec.filesToRead.filter((file) => pathSet.has(file.path)) };
  if (next.issueNumber !== undefined) {
    const issue = issueMap.get(next.issueNumber);
    if (!issue || (next.issueUrl && next.issueUrl !== issue.html_url)) return null;
    next = { ...next, issueUrl: issue.html_url };
  }
  if (next.type === "issue" && next.issueNumber === undefined) return null;
  if (rec.filesToRead.length > 0 && next.filesToRead.length === 0 && next.type !== "issue") return null;
  return next;
}
export function verifyAIEntryPointAnalysis(analysis: AIEntryPointAnalysis, issues: RepositoryIssue[], paths: string[]): AIEntryPointAnalysis {
  return { ...analysis, recommendations: analysis.recommendations.map((rec) => verifyRecommendation(rec, issues, paths)).filter((rec): rec is EntryPointRecommendation => Boolean(rec)).slice(0, 3) };
}

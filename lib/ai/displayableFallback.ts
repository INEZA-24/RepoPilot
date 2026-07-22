import { aiEntryPointAnalysisSchema, type AIEntryPointAnalysis } from "@/types/entryPoints";

export function parseDisplayableFallbackAnalysis(data: unknown): AIEntryPointAnalysis | null {
  try {
    const analysis = aiEntryPointAnalysisSchema.parse(data);
    return analysis.source === "heuristic-fallback" ? analysis : null;
  } catch {
    return null;
  }
}


export function hasDisplayableIssueLink(recommendation: { issueNumber?: number; issueUrl?: string }) {
  return typeof recommendation.issueNumber === "number" && Boolean(recommendation.issueUrl);
}

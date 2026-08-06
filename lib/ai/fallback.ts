import type { AIEntryPointAnalysis, ContributorProfile } from "@/types/entryPoints";
import type { RepositoryMetadata } from "@/types/github";
import type { RankedIssueCandidate } from "@/lib/recommendations/rankIssueCandidates";

function estimateEffort(issue: RankedIssueCandidate): "under-1-hour" | "1-3-hours" | "3-5-hours" | "multi-session" {
  const labels = issue.labels.join(" ");

  if (/good first issue|beginner|documentation|docs|typo/i.test(labels)) return "1-3-hours";
  if (/advanced|architecture|refactor|breaking/i.test(labels)) return "multi-session";
  if (/test|bug|fix/i.test(labels)) return "3-5-hours";

  return "3-5-hours";
}

export function buildHeuristicFallback(
  repository: RepositoryMetadata,
  issues: RankedIssueCandidate[],
  model = "heuristic",
  profile?: ContributorProfile,
): AIEntryPointAnalysis {
  return {
    repository: repository.full_name,
    generatedAt: new Date().toISOString(),
    model,
    source: "heuristic-fallback",
    recommendations: issues.slice(0, 3).map((issue) => ({
      id: `issue-${issue.number}`,
      type: "issue",
      title: issue.title,
      summary: (issue.body || "Open issue selected by RepoPilot's deterministic ranking.").slice(0, 220),
      difficulty: issue.labels.some((label) => /advanced|architecture/i.test(label)) ? "advanced" : "beginner",
      confidence: issue.score > 25 ? "high" : "medium",
      estimatedEffort: estimateEffort(issue),
      issueNumber: issue.number,
      issueUrl: issue.html_url,
      whyItFits: profile?.skills.length
        ? `This mission was ranked from repository evidence and compared with your listed skills: ${profile.skills.slice(0, 4).join(", ")}. Verify the technical fit before starting.`
        : `Ranked well because: ${issue.reasons.slice(0, 4).join(", ")}.`,
      skillsRequired: [],
      filesToRead: [],
      firstSteps: [
        "Read the full issue and maintainer discussion on GitHub.",
        "Confirm the issue is still available and ask a concise clarifying question if needed.",
      ],
      evidence: [`Issue #${issue.number}`, ...issue.labels.map((label) => `Label: ${label}`)],
      warnings: [
        "Generated without NVIDIA because the AI provider was unavailable or returned invalid output.",
        "The effort estimate is approximate and should not be treated as a deadline.",
      ],
    })),
    limitations: issues.length
      ? ["Fallback uses issue metadata only and may be less tailored than Nemotron output."]
      : ["No suitable open issue candidates were found."],
  };
}

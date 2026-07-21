import type { RepositoryIssue } from "@/types/github";

export type RankedIssueCandidate = RepositoryIssue & {
  score: number;
  reasons: string[];
};

const POSITIVE_SIGNALS = [
  /good first issue/i,
  /help wanted/i,
  /beginner/i,
  /documentation|\bdocs\b/i,
  /\btests?\b/i,
  /\bbug\b/i,
];
const NEGATIVE_SIGNALS = [
  /security|vulnerability|cve/i,
  /critical|production incident|outage/i,
  /major architecture|architecture rewrite|rewrite/i,
  /blocked|waiting/i,
  /disputed|controversial/i,
];

export function rankIssueCandidates(issues: RepositoryIssue[]): RankedIssueCandidate[] {
  return issues
    .map((issue) => {
      let score = 0;
      const reasons: string[] = [];
      const haystack = `${issue.title} ${issue.labels.join(" ")} ${issue.body ?? ""}`;

      POSITIVE_SIGNALS.forEach((pattern) => {
        if (pattern.test(haystack)) {
          score += 12;
          reasons.push(`positive:${pattern.source}`);
        }
      });

      NEGATIVE_SIGNALS.forEach((pattern) => {
        if (pattern.test(haystack)) {
          score -= 25;
          reasons.push(`negative:${pattern.source}`);
        }
      });

      if ((issue.body ?? "").trim().length > 80) {
        score += 10;
        reasons.push("clear body");
      } else {
        score -= 12;
        reasons.push("unclear body");
      }

      if ((issue.assignees ?? []).length === 0) {
        score += 8;
        reasons.push("unassigned");
      } else {
        score -= 10;
        reasons.push("assigned");
      }

      if (issue.comments <= 2) {
        score += 6;
      } else if (issue.comments > 10) {
        score -= 12;
      }

      const ageDays = (Date.now() - new Date(issue.updated_at).getTime()) / 86_400_000;

      if (ageDays < 30) {
        score += 5;
      } else if (ageDays > 365) {
        score -= 8;
      }

      return { ...issue, body: (issue.body ?? "").slice(0, 3_000), score, reasons };
    })
    .filter((issue) => issue.score > -10)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

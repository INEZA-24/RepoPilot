import { describe, expect, it } from "vitest";
import { mergeLimitations, repositoryTreeLimitations } from "./limitations";
import { normalizeNemotronMetadata } from "./metadata";
import { parseAIEntryPointJson } from "./json";
import { verifyAIEntryPointAnalysis } from "./verify";
import type { RepositoryIssue, RepositoryMetadata } from "@/types/github";

const repository = {
  id: 1,
  name: "repo",
  full_name: "owner/repo",
  description: null,
  html_url: "https://github.com/owner/repo",
  stargazers_count: 0,
  forks_count: 0,
  open_issues_count: 1,
  default_branch: "main",
  license: null,
  pushed_at: "2026-07-21T00:00:00.000Z",
  created_at: "2026-07-21T00:00:00.000Z",
  updated_at: "2026-07-21T00:00:00.000Z",
  owner: { login: "owner", avatar_url: "", html_url: "" },
} satisfies RepositoryMetadata;

const issue = {
  id: 1,
  number: 12,
  title: "Improve docs",
  body: "body",
  html_url: "https://github.com/owner/repo/issues/12",
  labels: [],
  assignees: [],
  comments: 0,
  created_at: "2026-07-21T00:00:00.000Z",
  updated_at: "2026-07-21T00:00:00.000Z",
} satisfies RepositoryIssue;

function analysisWithRecommendation(recommendation: Record<string, unknown>) {
  return parseAIEntryPointJson(JSON.stringify({
    repository: "ai/repo",
    generatedAt: "1999-01-01T00:00:00.000Z",
    model: "ai-model",
    source: "nemotron",
    recommendations: [
      {
        id: "rec-1",
        type: "issue",
        title: "Try issue",
        summary: "Short summary",
        difficulty: "beginner",
        confidence: "medium",
        whyItFits: "It references supplied evidence.",
        skillsRequired: [],
        filesToRead: [],
        firstSteps: [],
        evidence: [],
        warnings: [],
        ...recommendation,
      },
    ],
    limitations: [],
  }));
}

describe("AI response verification hardening", () => {
  it("rejects an arbitrary issueUrl without issueNumber for issue recommendations", () => {
    const analysis = analysisWithRecommendation({ issueUrl: "https://evil.example/issues/12" });

    expect(verifyAIEntryPointAnalysis(analysis, [issue], []).recommendations).toHaveLength(0);
  });

  it("replaces a wrong issueUrl when the numeric issueNumber is valid", () => {
    const analysis = analysisWithRecommendation({ issueNumber: 12, issueUrl: "https://evil.example/issues/12" });
    const verified = verifyAIEntryPointAnalysis(analysis, [issue], []);

    expect(verified.recommendations[0].issueUrl).toBe("https://github.com/owner/repo/issues/12");
  });

  it("does not accept a string issueNumber", () => {
    const analysis = analysisWithRecommendation({ issueNumber: "12", issueUrl: "https://github.com/owner/repo/issues/12" });

    expect(verifyAIEntryPointAnalysis(analysis, [issue], []).recommendations).toHaveLength(0);
  });

  it("accepts a valid numeric issueNumber and returns the verified GitHub issue link", () => {
    const analysis = analysisWithRecommendation({ issueNumber: 12 });
    const verified = verifyAIEntryPointAnalysis(analysis, [issue], []);

    expect(verified.recommendations[0]).toMatchObject({
      issueNumber: 12,
      issueUrl: "https://github.com/owner/repo/issues/12",
    });
  });


  it("removes unverified issue URLs from non-issue recommendations", () => {
    const analysis = analysisWithRecommendation({
      type: "documentation",
      issueUrl: "https://evil.example/issues/12",
      filesToRead: [{ path: "README.md", reason: "Understand docs" }],
    });
    const verified = verifyAIEntryPointAnalysis(analysis, [issue], ["README.md"]);

    expect(verified.recommendations[0].issueNumber).toBeUndefined();
    expect(verified.recommendations[0].issueUrl).toBeUndefined();
  });

  it("normalizes AI-provided response metadata with server-owned values", () => {
    const analysis = analysisWithRecommendation({ issueNumber: 12 });
    const normalized = normalizeNemotronMetadata(
      analysis,
      repository,
      "nvidia/nemotron-3-nano-30b-a3b",
      "2026-07-21T15:00:00.000Z",
    );

    expect(normalized).toMatchObject({
      repository: "owner/repo",
      generatedAt: "2026-07-21T15:00:00.000Z",
      model: "nvidia/nemotron-3-nano-30b-a3b",
      source: "nemotron",
    });
  });

  it("reports repository tree retrieval failures honestly", () => {
    expect(repositoryTreeLimitations({ truncated: false, failed: true })).toContain(
      "Repository file paths could not be retrieved, so file-based recommendations may be limited.",
    );
  });

  it("merges limitations without duplicate messages", () => {
    expect(mergeLimitations(["A", "B"], ["B", "C"])).toEqual(["A", "B", "C"]);
  });
});

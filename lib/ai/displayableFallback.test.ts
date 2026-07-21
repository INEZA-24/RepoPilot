import { describe, expect, it } from "vitest";
import { parseDisplayableFallbackAnalysis } from "./displayableFallback";

const fallbackAnalysis = {
  repository: "owner/repo",
  generatedAt: "2026-07-21T00:00:00.000Z",
  model: "nvidia/nemotron-3-nano-30b-a3b",
  source: "heuristic-fallback",
  recommendations: [
    {
      id: "issue-1",
      type: "issue",
      title: "Improve docs",
      summary: "A deterministic fallback recommendation.",
      difficulty: "beginner",
      confidence: "medium",
      issueNumber: 1,
      issueUrl: "https://github.com/owner/repo/issues/1",
      whyItFits: "It is labeled documentation.",
      skillsRequired: [],
      filesToRead: [],
      firstSteps: ["Read the issue."],
      evidence: ["Issue #1"],
      warnings: ["AI provider was rate limited."],
    },
  ],
  limitations: ["NVIDIA rate limit exceeded."],
};

describe("parseDisplayableFallbackAnalysis", () => {
  it("accepts a valid heuristic fallback analysis from a non-2xx response body", () => {
    expect(parseDisplayableFallbackAnalysis(fallbackAnalysis)).toMatchObject({
      repository: "owner/repo",
      source: "heuristic-fallback",
    });
  });

  it("rejects malformed non-2xx bodies so the client can show a blocking error", () => {
    expect(parseDisplayableFallbackAnalysis({ error: "NVIDIA rate limit exceeded." })).toBeNull();
  });

  it("rejects valid Nemotron output on non-2xx responses because only fallback is displayable there", () => {
    expect(parseDisplayableFallbackAnalysis({ ...fallbackAnalysis, source: "nemotron" })).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { parseRepoUrl } from "./parseRepoUrl";

describe("parseRepoUrl", () => {
  it("parses a full GitHub repository URL", () => {
    expect(parseRepoUrl("https://github.com/vercel/next.js")).toEqual({
      owner: "vercel",
      repo: "next.js",
    });
  });

  it("parses a full GitHub repository URL with a .git suffix", () => {
    expect(parseRepoUrl("https://github.com/vercel/next.js.git")).toEqual({
      owner: "vercel",
      repo: "next.js",
    });
  });

  it("parses owner/repo shorthand", () => {
    expect(parseRepoUrl("vercel/next.js")).toEqual({
      owner: "vercel",
      repo: "next.js",
    });
  });

  it("trims surrounding whitespace", () => {
    expect(parseRepoUrl("  https://github.com/vercel/next.js  ")).toEqual({
      owner: "vercel",
      repo: "next.js",
    });
  });

  it("rejects non-GitHub URLs", () => {
    expect(() => parseRepoUrl("https://example.com/vercel/next.js")).toThrow(
      "RepoPilot Phase 1 supports public github.com repositories only.",
    );
  });

  it("rejects GitHub URLs without a repository name", () => {
    expect(() => parseRepoUrl("https://github.com/vercel")).toThrow(
      "Use a GitHub repository URL like https://github.com/owner/repo.",
    );
  });
});
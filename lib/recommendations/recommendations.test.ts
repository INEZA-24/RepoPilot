import { describe, expect, it } from "vitest";
import { filterRepositoryPaths } from "./filterRepositoryPaths";
import { rankIssueCandidates } from "./rankIssueCandidates";
import type { RepositoryIssue } from "@/types/github";
const issue = (overrides: Partial<RepositoryIssue>): RepositoryIssue => ({ id: 1, number: 1, title: "docs bug", body: "Clear issue body explaining useful contributor work in detail.", html_url: "https://github.com/o/r/issues/1", labels: ["good first issue"], assignees: [], comments: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...overrides });
describe("recommendation utilities", () => { it("filters noisy paths", () => { expect(filterRepositoryPaths(["src/app.ts", "node_modules/x.js", "dist/app.js", "README.md", "image.png"])).toEqual(["src/app.ts", "README.md"]); }); it("ranks beginner issues above risky assigned work", () => { const ranked = rankIssueCandidates([issue({ number: 2, title: "security critical rewrite", labels: ["security"], assignees: ["a"], comments: 20 }), issue({ number: 1 })]); expect(ranked[0].number).toBe(1); }); });

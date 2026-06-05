import { getIssues } from "./getIssues";
import { getLanguages } from "./getLanguages";
import { getReadme } from "./getReadme";
import { getRepo } from "./getRepo";
import type { PhaseOneAnalysis } from "@/types/github";

export async function analyzeRepository(owner: string, repo: string): Promise<PhaseOneAnalysis> {
  const [repository, languages, readme, issues] = await Promise.all([
    getRepo(owner, repo),
    getLanguages(owner, repo),
    getReadme(owner, repo),
    getIssues(owner, repo),
  ]);

  return { repository, languages, readme, issues };
}

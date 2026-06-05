import { githubRequest } from "./client";
import type { LanguageStat } from "@/types/github";

export async function getLanguages(owner: string, repo: string): Promise<LanguageStat[]> {
  const rawLanguages = await githubRequest<Record<string, number>>(`/repos/${owner}/${repo}/languages`);
  const totalBytes = Object.values(rawLanguages).reduce((sum, bytes) => sum + bytes, 0);

  return Object.entries(rawLanguages)
    .map(([name, bytes]) => ({
      name,
      bytes,
      percentage: totalBytes === 0 ? 0 : Math.round((bytes / totalBytes) * 1000) / 10,
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

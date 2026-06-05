import { githubRequest } from "./client";
import type { RepositoryMetadata } from "@/types/github";

export function getRepo(owner: string, repo: string) {
  return githubRequest<RepositoryMetadata>(`/repos/${owner}/${repo}`);
}

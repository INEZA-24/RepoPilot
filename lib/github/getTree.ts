import { githubRequest } from "./client";

export type RepositoryTreeItem = { path: string; type: "blob" | "tree" | string };
export type RepositoryTree = { paths: string[]; truncated: boolean };

type GitHubTreeResponse = { tree: RepositoryTreeItem[]; truncated: boolean };

export async function getRepositoryTree(owner: string, repo: string, branch: string): Promise<RepositoryTree> {
  const data = await githubRequest<GitHubTreeResponse>(`/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
  return { paths: data.tree.filter((item) => item.type === "blob").map((item) => item.path), truncated: data.truncated };
}

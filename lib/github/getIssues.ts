import { githubRequest } from "./client";
import type { RepositoryIssue } from "@/types/github";

type GitHubIssueResponse = {
  id: number;
  number: number;
  title: string;
  html_url: string;
  labels: Array<{ name: string }>;
  comments: number;
  created_at: string;
  updated_at: string;
  pull_request?: unknown;
};

export async function getIssues(owner: string, repo: string): Promise<RepositoryIssue[]> {
  const issues = await githubRequest<GitHubIssueResponse[]>(
    `/repos/${owner}/${repo}/issues?state=open&per_page=8&sort=updated&direction=desc`,
  );

  return issues
    .filter((issue) => !issue.pull_request)
    .map((issue) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      html_url: issue.html_url,
      labels: issue.labels.map((label) => label.name),
      comments: issue.comments,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    }));
}

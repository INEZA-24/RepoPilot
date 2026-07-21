import { githubRequest } from "./client";
import type { RepositoryIssue } from "@/types/github";

type GitHubIssueResponse = {
  id: number;
  number: number;
  title: string;
  body?: string | null;
  html_url: string;
  labels: Array<{ name: string }>;
  assignees?: Array<{ login: string }>;
  comments: number;
  created_at: string;
  updated_at: string;
  pull_request?: unknown;
};

export async function getIssues(owner: string, repo: string): Promise<RepositoryIssue[]> {
  const issues = await githubRequest<GitHubIssueResponse[]>(
    `/repos/${owner}/${repo}/issues?state=open&per_page=12&sort=updated&direction=desc`,
  );

  return issues
    .filter((issue) => !issue.pull_request)
    .map((issue) => ({
      id: issue.id,
      number: issue.number,
      title: issue.title,
      body: (issue.body ?? "").slice(0, 3000),
      html_url: issue.html_url,
      labels: issue.labels.map((label) => label.name),
      assignees: (issue.assignees ?? []).map((assignee) => assignee.login),
      comments: issue.comments,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    }));
}

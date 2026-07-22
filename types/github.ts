export type GitHubOwner = {
  login: string;
  avatar_url: string;
  html_url: string;
};

export type RepositoryMetadata = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  license: { name: string; spdx_id: string } | null;
  pushed_at: string;
  created_at: string;
  updated_at: string;
  owner: GitHubOwner;
};

export type LanguageStat = {
  name: string;
  bytes: number;
  percentage: number;
};

export type ReadmePreview = {
  name: string;
  path: string;
  html_url: string;
  content: string;
  excerpt: string;
};

export type RepositoryIssue = {
  id: number;
  number: number;
  title: string;
  body?: string;
  html_url: string;
  labels: string[];
  assignees?: string[];
  comments: number;
  created_at: string;
  updated_at: string;
};

export type PhaseOneAnalysis = {
  repository: RepositoryMetadata;
  languages: LanguageStat[];
  readme: ReadmePreview | null;
  issues: RepositoryIssue[];
};

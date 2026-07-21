import { githubRequest } from "./client";

type GitHubContentFile = { name: string; path: string; html_url: string; content?: string; encoding?: string; type: string };
export type ContributorDocument = { name: string; path: string; html_url: string; content: string };

function decode(content: string, encoding?: string) {
  return encoding === "base64" ? Buffer.from(content.replace(/\n/g, ""), "base64").toString("utf-8") : content;
}

export async function getContentFile(owner: string, repo: string, path: string): Promise<ContributorDocument | null> {
  try {
    const file = await githubRequest<GitHubContentFile>(`/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`);
    if (file.type !== "file") return null;
    return { name: file.name, path: file.path, html_url: file.html_url, content: decode(file.content ?? "", file.encoding) };
  } catch { return null; }
}

export async function getContributorDocuments(owner: string, repo: string) {
  const paths = ["README.md", "CONTRIBUTING.md", ".github/CONTRIBUTING.md", "CODE_OF_CONDUCT.md"];
  const docs = await Promise.all(paths.map((path) => getContentFile(owner, repo, path)));
  return docs.filter((doc): doc is ContributorDocument => Boolean(doc));
}

export async function getProjectManifest(owner: string, repo: string) {
  const paths = ["package.json", "pyproject.toml", "requirements.txt", "Cargo.toml", "go.mod", "pom.xml", "build.gradle", "composer.json"];
  for (const path of paths) {
    const manifest = await getContentFile(owner, repo, path);
    if (manifest) return manifest;
  }
  return null;
}

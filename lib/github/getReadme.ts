import { githubRequest } from "./client";
import type { ReadmePreview } from "@/types/github";

type GitHubReadmeResponse = {
  name: string;
  path: string;
  html_url: string;
  content: string;
  encoding: string;
};

function decodeBase64(content: string) {
  return Buffer.from(content.replace(/\n/g, ""), "base64").toString("utf-8");
}

export async function getReadme(owner: string, repo: string): Promise<ReadmePreview | null> {
  try {
    const readme = await githubRequest<GitHubReadmeResponse>(`/repos/${owner}/${repo}/readme`);
    const content = readme.encoding === "base64" ? decodeBase64(readme.content) : readme.content;
    const excerpt = content.replace(/[#*_>`]/g, "").replace(/\s+/g, " ").trim().slice(0, 700);

    return {
      name: readme.name,
      path: readme.path,
      html_url: readme.html_url,
      content,
      excerpt,
    };
  } catch {
    return null;
  }
}

export type ParsedRepoUrl = {
  owner: string;
  repo: string;
};

export function parseRepoUrl(input: string): ParsedRepoUrl {
  const trimmed = input.trim();
  const shorthandMatch = trimmed.match(/^([\w.-]+)\/([\w.-]+)$/);

  if (shorthandMatch) {
    return { owner: shorthandMatch[1], repo: shorthandMatch[2].replace(/\.git$/, "") };
  }

  const url = new URL(trimmed);

  if (url.hostname !== "github.com" && url.hostname !== "www.github.com") {
    throw new Error("RepoPilot Phase 1 supports public github.com repositories only.");
  }

  const [owner, repo] = url.pathname.split("/").filter(Boolean);

  if (!owner || !repo) {
    throw new Error("Use a GitHub repository URL like https://github.com/owner/repo.");
  }

  return { owner, repo: repo.replace(/\.git$/, "") };
}

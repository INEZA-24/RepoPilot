const GITHUB_API_BASE = "https://api.github.com";

export async function githubRequest<T>(path: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "RepoPilot-MVP",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers,
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed with status ${response.status}.`);
  }

  return response.json() as Promise<T>;
}

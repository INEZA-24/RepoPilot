import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/entry-points", () => {
  it("rejects invalid API input", async () => {
    const response = await POST(new Request("http://x", { method: "POST", body: JSON.stringify({}) }));

    expect(response.status).toBe(400);
  });

  it("rejects malformed non-empty repository URLs before GitHub work starts", async () => {
    const response = await POST(
      new Request("http://x", {
        method: "POST",
        body: JSON.stringify({ repoUrl: "not-a-github-url" }),
      }),
    );
    const body = await response.json() as { error: string };

    expect(response.status).toBe(400);
    expect(body.error).toBe("Use a valid public GitHub repository URL like https://github.com/owner/repo.");
  });
});

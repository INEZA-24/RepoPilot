import { describe, expect, it } from "vitest";
import { POST } from "./route";
describe("POST /api/entry-points", () => { it("rejects invalid API input", async () => { const res = await POST(new Request("http://x", { method:"POST", body: JSON.stringify({}) })); expect(res.status).toBe(400); }); });

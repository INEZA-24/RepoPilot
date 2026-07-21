import { parseAIEntryPointJson } from "./json";
import type { AIEntryPointAnalysis } from "@/types/entryPoints";

export const NVIDIA_MODEL_FALLBACK = "nvidia/nemotron-3-nano-30b-a3b";

const ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";

type Prompt = {
  system: string;
  user: string;
};

export class NvidiaProviderError extends Error {
  constructor(message: string, public status = 503) {
    super(message);
  }
}

async function callNvidia(prompt: Prompt, repairInstruction?: string) {
  const key = process.env.NVIDIA_API_KEY;

  if (!key) {
    throw new NvidiaProviderError("NVIDIA_API_KEY is not configured.", 503);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.NVIDIA_MODEL || NVIDIA_MODEL_FALLBACK,
        stream: false,
        max_tokens: 2_400,
        chat_template_kwargs: {
          enable_thinking: false,
        },
        messages: [
          { role: "system", content: prompt.system },
          {
            role: "user",
            content: repairInstruction
              ? `${prompt.user}\n\nJSON_REPAIR_INSTRUCTION: ${repairInstruction}`
              : prompt.user,
          },
        ],
      }),
    });

    if (response.status === 429) {
      throw new NvidiaProviderError("NVIDIA rate limit exceeded.", 429);
    }

    if (!response.ok) {
      throw new NvidiaProviderError("NVIDIA provider unavailable.", 503);
    }

    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content ?? "";
  } catch (caught) {
    if (caught instanceof NvidiaProviderError) {
      throw caught;
    }

    throw new NvidiaProviderError("NVIDIA request failed.", 503);
  } finally {
    clearTimeout(timeout);
  }
}

export async function generateEntryPointsWithNvidia(prompt: Prompt): Promise<AIEntryPointAnalysis> {
  const model = process.env.NVIDIA_MODEL || NVIDIA_MODEL_FALLBACK;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const content = await callNvidia(
      prompt,
      attempt === 1 ? "Return valid JSON only with the exact schema. Do not use Markdown fences." : undefined,
    );

    try {
      return { ...parseAIEntryPointJson(content), model, source: "nemotron" };
    } catch {
      if (attempt === 1) {
        throw new NvidiaProviderError("NVIDIA returned invalid JSON.", 502);
      }
    }
  }

  throw new NvidiaProviderError("NVIDIA returned invalid JSON.", 502);
}

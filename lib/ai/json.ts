import { aiEntryPointAnalysisSchema, type AIEntryPointAnalysis } from "@/types/entryPoints";

export function stripJsonFences(content: string) {
  return content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function removeThinkBlocks(content: string) {
  return content.replace(/<think>[\s\S]*?<\/think>/gi, "");
}

export function extractJsonObject(content: string) {
  const input = stripJsonFences(removeThinkBlocks(content));

  for (let start = 0; start < input.length; start += 1) {
    if (input[start] !== "{") continue;

    let depth = 0;
    let inString = false;
    let escaped = false;

    for (let index = start; index < input.length; index += 1) {
      const character = input[index];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (character === "\\" && inString) {
        escaped = true;
        continue;
      }

      if (character === '"') {
        inString = !inString;
        continue;
      }

      if (inString) continue;

      if (character === "{") {
        depth += 1;
      } else if (character === "}") {
        depth -= 1;

        if (depth === 0) {
          return input.slice(start, index + 1);
        }
      }
    }
  }

  throw new Error("No complete JSON object found.");
}

export function parseAIEntryPointJson(content: string): AIEntryPointAnalysis {
  return aiEntryPointAnalysisSchema.parse(JSON.parse(extractJsonObject(content)));
}

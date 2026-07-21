import { aiEntryPointAnalysisSchema, type AIEntryPointAnalysis } from "@/types/entryPoints";
export function stripJsonFences(content: string) { return content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim(); }
export function parseAIEntryPointJson(content: string): AIEntryPointAnalysis { return aiEntryPointAnalysisSchema.parse(JSON.parse(stripJsonFences(content))); }

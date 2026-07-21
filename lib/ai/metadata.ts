import type { AIEntryPointAnalysis } from "@/types/entryPoints";
import type { RepositoryMetadata } from "@/types/github";

export function normalizeNemotronMetadata(
  analysis: AIEntryPointAnalysis,
  repository: RepositoryMetadata,
  model: string,
  generatedAt = new Date().toISOString(),
): AIEntryPointAnalysis {
  return {
    ...analysis,
    repository: repository.full_name,
    generatedAt,
    model,
    source: "nemotron",
  };
}

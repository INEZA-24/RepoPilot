export type ContributorProfile = {
  experienceLevel: "beginner" | "intermediate" | "advanced";
  skills: string[];
  preferredContributionType: "any" | "code" | "documentation" | "tests" | "bug-fixes";
};

export type EntryPointRecommendation = {
  id: string;
  type: "issue" | "documentation" | "tests" | "code-exploration";
  title: string;
  summary: string;
  difficulty: ContributorProfile["experienceLevel"];
  confidence: "low" | "medium" | "high";
  issueNumber?: number;
  issueUrl?: string;
  whyItFits: string;
  skillsRequired: string[];
  filesToRead: Array<{ path: string; reason: string }>;
  firstSteps: string[];
  evidence: string[];
  warnings: string[];
};

export type AIEntryPointAnalysis = {
  repository: string;
  generatedAt: string;
  model: string;
  source: "nemotron" | "heuristic-fallback";
  recommendations: EntryPointRecommendation[];
  limitations: string[];
};

const EXPERIENCE_LEVELS = ["beginner", "intermediate", "advanced"] as const;
const PREFERRED_TYPES = ["any", "code", "documentation", "tests", "bug-fixes"] as const;

export const contributorProfileSchema = {
  parse(input: unknown): ContributorProfile {
    const value = (input ?? {}) as Partial<ContributorProfile>;

    return {
      experienceLevel: EXPERIENCE_LEVELS.includes(value.experienceLevel as never)
        ? value.experienceLevel as ContributorProfile["experienceLevel"]
        : "beginner",
      skills: Array.isArray(value.skills)
        ? value.skills
            .filter((skill): skill is string => typeof skill === "string" && skill.trim().length > 0)
            .map((skill) => skill.trim())
            .slice(0, 20)
        : [],
      preferredContributionType: PREFERRED_TYPES.includes(value.preferredContributionType as never)
        ? value.preferredContributionType as ContributorProfile["preferredContributionType"]
        : "any",
    };
  },
};

function isString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export const aiEntryPointAnalysisSchema = {
  parse(input: unknown): AIEntryPointAnalysis {
    const value = input as AIEntryPointAnalysis;

    if (
      !value ||
      !isString(value.repository) ||
      !isString(value.generatedAt) ||
      !isString(value.model) ||
      !["nemotron", "heuristic-fallback"].includes(value.source) ||
      !Array.isArray(value.recommendations)
    ) {
      throw new Error("Invalid AI analysis");
    }

    return {
      repository: value.repository,
      generatedAt: value.generatedAt,
      model: value.model,
      source: value.source,
      limitations: Array.isArray(value.limitations) ? value.limitations.filter(isString) : [],
      recommendations: value.recommendations.slice(0, 3).map((recommendation) => {
        if (
          !recommendation ||
          !isString(recommendation.id) ||
          !["issue", "documentation", "tests", "code-exploration"].includes(recommendation.type) ||
          !isString(recommendation.title) ||
          !isString(recommendation.summary) ||
          !EXPERIENCE_LEVELS.includes(recommendation.difficulty) ||
          !["low", "medium", "high"].includes(recommendation.confidence) ||
          !isString(recommendation.whyItFits)
        ) {
          throw new Error("Invalid recommendation");
        }

        return {
          ...recommendation,
          skillsRequired: Array.isArray(recommendation.skillsRequired)
            ? recommendation.skillsRequired.filter(isString)
            : [],
          filesToRead: Array.isArray(recommendation.filesToRead)
            ? recommendation.filesToRead.filter((file) => file && isString(file.path) && isString(file.reason))
            : [],
          firstSteps: Array.isArray(recommendation.firstSteps) ? recommendation.firstSteps.filter(isString) : [],
          evidence: Array.isArray(recommendation.evidence) ? recommendation.evidence.filter(isString) : [],
          warnings: Array.isArray(recommendation.warnings) ? recommendation.warnings.filter(isString) : [],
        };
      }),
    };
  },
};

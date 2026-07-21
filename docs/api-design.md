# API Design

## `POST /api/analyze`

Aggregates Phase 1 repository data.

```json
{ "repoUrl": "https://github.com/vercel/next.js" }
```

Returns repository metadata, languages, README preview, and open issues. Invalid URLs return `400`; unavailable repositories and GitHub failures return controlled JSON errors.

## `POST /api/entry-points`

Generates optional Phase 2A contribution entry points.

```json
{
  "repoUrl": "https://github.com/owner/repository",
  "profile": {
    "experienceLevel": "beginner",
    "skills": ["javascript", "react"],
    "preferredContributionType": "any"
  }
}
```

The profile is optional. The endpoint gathers evidence, ranks issue candidates, prompts NVIDIA Nemotron, validates and verifies the response, and returns up to three recommendations. AI failures degrade to deterministic `heuristic-fallback` output when suitable candidates exist.

## Environment Variables

- `GITHUB_TOKEN` for GitHub rate-limit headroom
- `NVIDIA_API_KEY` for NVIDIA hosted chat completions
- `NVIDIA_MODEL`, defaulting to `nvidia/nemotron-3-nano-30b-a3b`

All variables are server-side only.

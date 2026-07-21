# RepoPilot Architecture

RepoPilot is a phase-based contributor onboarding platform:

```text
Paste GitHub URL → Fetch public repository signals → Render dashboard → Optionally generate entry points
```

## Folder Structure

```text
app/analyze                 Server-rendered dashboard page
app/api/analyze             Phase 1 repository analysis endpoint
app/api/entry-points        Phase 2A recommendation endpoint
components/dashboard        Dashboard cards, including AIEntryPointsCard
lib/github                  GitHub REST helpers
lib/recommendations         Deterministic path filtering and issue ranking
lib/ai                      Prompt construction, NVIDIA client, JSON parsing, verification, fallback
types                       Shared TypeScript contracts and schema validators
docs                        Product and engineering documentation
```

## Phase 1 Data Flow

`analyzeRepository` fetches metadata, languages, README, and up to 12 open non-PR issues through `githubRequest`. Missing README data degrades to `null`.

## Phase 2A AI Data Flow

`POST /api/entry-points` is called only by the client-side generate button. It:

1. Validates `repoUrl` and the optional contributor profile.
2. Parses the public GitHub repository URL.
3. Fetches metadata, open issues, recursive default-branch tree, contributor documents, and the first relevant manifest.
4. Filters repository paths to approximately 250 useful source, test, docs, config, and manifest paths.
5. Ranks issue candidates with transparent deterministic signals.
6. Builds a prompt that separates trusted instructions from untrusted repository evidence.
7. Calls NVIDIA Nemotron using server-side `NVIDIA_API_KEY` and `NVIDIA_MODEL`.
8. Strips optional Markdown JSON fences, parses JSON, validates with shared schemas, and retries once on malformed output.
9. Verifies issue numbers, issue URLs, and file paths before returning data to the browser.
10. Falls back to deterministic issue recommendations when AI generation fails.

## Security Boundaries

Repository text, issue bodies, file names, manifests, and documentation are untrusted evidence. The prompt instructs the model to ignore repository-provided instructions, avoid secrets, use only supplied evidence, and return fewer than three recommendations when evidence is insufficient. Secrets are read only on the server and are never exposed to client components.

## Current Limitations

RepoPilot supports public GitHub repositories only. It does not clone repositories, execute code, support private repositories, create pull requests, authenticate users, or score maintainers/contributors/repository health.

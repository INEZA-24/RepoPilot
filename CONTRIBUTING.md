# Contributing to RepoPilot

Thank you for helping make open source onboarding faster and friendlier.

## Project Principles

Every contribution should answer: **How does this help someone contribute to open source faster?**

Please avoid generic AI chat features, fake analytics, and broad functionality that is not part of the current phase.
RepoPilot should remain a focused contributor-onboarding tool, not a repository chatbot, scoring product, or automated coding agent.

## Current Scope

RepoPilot currently implements:

- **Phase 1 repository analysis**: repository metadata, languages, README preview, open issues, and the contributor dashboard.
- **Phase 2A contribution entry points**: user-triggered NVIDIA Nemotron recommendations after a repository has been analyzed.
- **Deterministic heuristic fallback**: clearly labeled fallback recommendations when NVIDIA is unavailable, rate-limited, or returns unusable output.
- **Server-side verification**: issue numbers, issue URLs, and file paths are checked against gathered GitHub evidence before returning recommendations.

Still out of scope:

- Generic repository chat
- Authentication
- Databases
- Private repositories
- Repository cloning or code execution
- Automatic code changes or pull requests
- Maintainer, contributor, or repository scoring
- Broader Phase 2 learning paths
- Phase 3 features

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Use server-side environment variables only. Do not commit real secrets.

```bash
GITHUB_TOKEN=
NVIDIA_API_KEY=
NVIDIA_MODEL=nvidia/nemotron-3-nano-30b-a3b
```

`GITHUB_TOKEN` is optional for higher GitHub API rate limits. `NVIDIA_API_KEY` is required only when testing Phase 2A Nemotron generation against the hosted provider.

## Pull Request Checklist

- Keep changes aligned to the active phase.
- Add or update documentation when behavior changes.
- Run `npm run check` before opening a PR.
- Follow the smoke-test checklist in `docs/testing.md`.
- Keep UI responsive and dark-mode-first.
- Use clear names for contributor onboarding concepts.

## Code Style

- Prefer small, composable components.
- Keep GitHub API logic inside `lib/github`.
- Keep shared contracts in `types`.
- Keep AI provider calls, prompt construction, and recommendation verification on the server side.
- Do not add out-of-scope scoring, authentication, databases, repository cloning, code execution, or automatic pull request generation.

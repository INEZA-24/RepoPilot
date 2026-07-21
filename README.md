# RepoPilot

**Navigate Any Open Source Repository in Minutes**

RepoPilot is an open-source contributor onboarding platform. A contributor pastes a public GitHub repository URL and receives a focused dashboard with repository metadata, languages, README context, open issues, and optional Phase 2A NVIDIA Nemotron contribution entry-point recommendations.

## Live Demo

[View RepoPilot on Vercel](https://repo-pilotv1.vercel.app/)

## Implemented Features

### Phase 1

- Repository metadata: stars, forks, default branch, license, activity, and owner
- Language breakdown for quick tech-stack orientation
- README preview to reveal project purpose and setup clues
- Open issue discovery to surface possible entry points
- Dark-mode-first dashboard inspired by GitHub, Vercel, and Linear

### Phase 2A

- User-triggered NVIDIA Nemotron recommendation generation after analysis
- Optional contributor profile: experience level, known skills, and preferred contribution type
- Evidence collection from open issues, filtered repository paths, contributor docs, and project manifest
- Prompt-injection protections that treat repository text as untrusted evidence
- Server-side verification of issue numbers, issue URLs, and file paths
- Deterministic heuristic fallback when NVIDIA is unavailable or returns malformed output

Phase 2A does **not** add authentication, private repository support, repository cloning, code execution, automatic pull requests, maintainer scoring, contributor scoring, or repository health scoring.

## Installation Guide

```bash
git clone https://github.com/INEZA-24/RepoPilot.git
cd RepoPilot
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and paste a public GitHub repository URL.

## Environment Variables

`.env.local` is ignored by Git and should contain server-side secrets only:

```bash
GITHUB_TOKEN=
NVIDIA_API_KEY=
NVIDIA_MODEL=nvidia/nemotron-3-nano-30b-a3b
```

- `GITHUB_TOKEN` increases GitHub API rate limits for public repository analysis.
- `NVIDIA_API_KEY` enables `/api/entry-points` to call NVIDIA's hosted chat completions endpoint.
- `NVIDIA_MODEL` is optional and falls back to `nvidia/nemotron-3-nano-30b-a3b`.

Never use `NEXT_PUBLIC_NVIDIA_API_KEY` or `NEXT_PUBLIC_GITHUB_TOKEN`; credentials must remain server-side.

### Vercel Setup

In Vercel, add `GITHUB_TOKEN`, `NVIDIA_API_KEY`, and optionally `NVIDIA_MODEL` under Project Settings → Environment Variables for the environments you deploy. Redeploy after changing them.

## AI Pipeline

`POST /api/entry-points` validates the request, parses the GitHub URL, gathers repository evidence, ranks issue candidates deterministically, builds a protected prompt, calls NVIDIA with `stream: false`, parses JSON, validates it with the shared schema validator, retries once for JSON repair, verifies every issue and file reference, and returns up to three recommendations.

If NVIDIA fails, RepoPilot keeps the dashboard usable and returns `source: "heuristic-fallback"` recommendations when suitable ranked issues exist. Empty or issue-free repositories return honest limitations instead of fabricated work.

## Testing Before a PR

Run:

```bash
npm run test
npm run typecheck
npm run lint
npm run build
npm run check
```

Automated tests mock GitHub and NVIDIA behavior and must not consume real API credits.

## Architecture Overview

RepoPilot uses the Next.js App Router with a small phase-based architecture. See [`docs/architecture.md`](docs/architecture.md) and [`docs/api-design.md`](docs/api-design.md) for details.

## Roadmap

See [`docs/roadmap.md`](docs/roadmap.md). Phase 2A entry points are implemented; broader Phase 2 learning paths and Phase 3 scoring remain planned only.

## License

RepoPilot is released under the MIT License. See [`LICENSE`](LICENSE).

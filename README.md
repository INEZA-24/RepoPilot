# RepoPilot

**Navigate Any Open Source Repository in Minutes**

RepoPilot is an AI-powered Open Source Contributor Onboarding Platform. It helps developers understand, navigate, and contribute to GitHub repositories faster by turning a repository URL into a focused contributor dashboard.

## Problem Statement

Joining an open source project often takes days of reading before a developer knows where to begin. Important contributor signals are scattered across READMEs, issues, language files, repository metadata, and maintainer documentation.

## Solution

RepoPilot acts like GPS for open source. In Phase 1, a contributor pastes a public GitHub repository URL and receives a polished dashboard with the core context needed to start exploring productively.

## Phase 1 Features

- Repository metadata: stars, forks, default branch, license, activity, and owner
- Language breakdown for quick tech-stack orientation
- README preview to reveal project purpose and setup clues
- Open issue discovery to surface possible entry points
- Dark-mode-first dashboard inspired by GitHub, Vercel, and Linear

## Screenshots

Screenshots will be added as the MVP UI stabilizes.

## Installation Guide

```bash
git clone https://github.com/TECH-WIZARD/RepoPilot.git
cd RepoPilot
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and paste a public GitHub repository URL.

## Testing Before a PR

Run the full pre-PR check locally:

```bash
npm run check
```

Then start the app with `npm run dev`, analyze a real public repository, and verify the dashboard renders metadata, languages, README context, and open issues. See [`docs/testing.md`](docs/testing.md) for the full smoke-test checklist and API curl examples.

Optional environment variable:

```bash
GITHUB_TOKEN=ghp_your_token
```

A GitHub token increases API rate limits for local development and demos.

## Architecture Overview

RepoPilot uses the Next.js App Router with a small, phase-based architecture:

- `app/(marketing)` contains the landing and about pages.
- `app/analyze` renders the Phase 1 contributor dashboard.
- `app/api/analyze` exposes the repository analysis endpoint.
- `lib/github` contains GitHub API integration helpers.
- `lib/utils` contains URL parsing and shared utilities.
- `types` contains TypeScript contracts shared by API and UI code.
- `components/landing` and `components/dashboard` keep UI surfaces modular.

See [`docs/architecture.md`](docs/architecture.md) and [`docs/api-design.md`](docs/api-design.md) for more detail.

## Future Roadmap

RepoPilot is intentionally built in phases:

1. **Phase 1 MVP:** repository metadata, languages, README preview, open issues, and basic dashboard.
2. **Phase 2:** AI repository summary, recommended reading order, beginner friendliness analysis, and learning path.
3. **Phase 3:** contribution roadmap, contributor readiness score, repository health score, and maintainer recommendations.

See [`docs/roadmap.md`](docs/roadmap.md) for the implementation roadmap.

## Contributing Guide

We welcome contributors who care about making open source easier to join. Start with [`CONTRIBUTING.md`](CONTRIBUTING.md), then review the Phase 1 scope in [`docs/roadmap.md`](docs/roadmap.md).

## License

RepoPilot is released under the MIT License. See [`LICENSE`](LICENSE).

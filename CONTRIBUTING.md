# Contributing to RepoPilot

Thank you for helping make open source onboarding faster and friendlier.

## Project Principles

Every contribution should answer: **How does this help someone contribute to open source faster?**

Please avoid generic AI chat features, fake analytics, and broad functionality that is not part of the current phase.

## Current Scope

RepoPilot is currently focused on **Phase 1 MVP**:

- Repository metadata
- Languages
- README preview
- Open issues
- Basic contributor dashboard

Phase 2 and Phase 3 features should be documented as future work, not implemented yet.

## Local Development

```bash
npm install
npm run dev
```

Optional:

```bash
GITHUB_TOKEN=ghp_your_token
```

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
- Do not add scoring or AI implementation until the corresponding phase begins.

# RepoPilot Roadmap

## MVP Implementation Roadmap

### Milestone 1: Project Foundation

- Create a TypeScript Next.js project structure.
- Add dark-mode global styling.
- Add open source documentation.
- Define shared GitHub response types.

### Milestone 2: GitHub Data Layer

- Implement repository metadata fetching.
- Implement language breakdown fetching.
- Implement README preview fetching.
- Implement open issue fetching.
- Add URL parsing for GitHub repository URLs and `owner/repo` shorthand.

### Milestone 3: Phase 1 Dashboard

- Build a polished landing page.
- Build the analysis route.
- Render repository header, overview, tech stack, README preview, and issues cards.
- Keep the dashboard responsive and focused on contributor onboarding.

### Milestone 4: Stabilization

- Add loading states.
- Improve empty states for missing README and issue data.
- Run type checks and build checks.
- Capture screenshots for the README once UI polish is final.

## Phase 1 Scope

RepoPilot currently implements only:

- Repository metadata
- Languages
- README preview
- Open issues
- Basic dashboard

## Phase 2 Scope (Planned, Not Implemented)

- AI repository summary
- Recommended reading order
- Beginner friendliness analysis
- Learning path

## Phase 3 Scope (Planned, Not Implemented)

- Contribution roadmap
- Contributor readiness score
- Repository health score
- Maintainer recommendations

## Product Guardrails

RepoPilot should not become GitHub search, a generic repository chat app, or a vanity analytics dashboard. Every roadmap item must reduce contributor onboarding time.

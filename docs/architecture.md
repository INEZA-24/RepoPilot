# RepoPilot Architecture

## Product Architecture

RepoPilot is a phase-based contributor onboarding platform. The MVP focuses on a single workflow:

```text
Paste GitHub URL → Fetch public repository signals → Render contributor dashboard
```

## Project Initialization Plan

1. Initialize a TypeScript Next.js App Router project.
2. Keep the UI dark-mode-first and card-based for technical users.
3. Build the GitHub integration as small reusable functions under `lib/github`.
4. Define shared response contracts in `types/github.ts` before adding UI code.
5. Implement a minimal `/api/analyze` endpoint for Phase 1 data aggregation.
6. Add documentation that explains project purpose, architecture, API design, and roadmap.

## Folder Structure

```text
app/
  (marketing)/
    page.tsx
    about/page.tsx
  analyze/
    page.tsx
    loading.tsx
  api/
    analyze/route.ts
    github/route.ts
    score/route.ts
components/
  landing/
  dashboard/
  ui/
lib/
  github/
  utils/
types/
docs/
```

## Component Tree

```text
RootLayout
└── MarketingPage
    ├── Hero
    ├── Features
    ├── HowItWorks
    └── DemoPreview

AnalyzePage
├── RepoHeader
├── OverviewCard
├── TechStackCard
├── ReadmeCard
└── IssuesCard
```

## TypeScript Types

The Phase 1 contracts live in `types/github.ts`:

- `RepositoryMetadata`
- `LanguageStat`
- `ReadmePreview`
- `RepositoryIssue`
- `PhaseOneAnalysis`

These types intentionally mirror the dashboard sections so API, data fetching, and UI stay aligned.

## Architectural Boundaries

- `app` owns routing and page composition.
- `components` owns presentation.
- `lib/github` owns GitHub API calls and response shaping.
- `lib/utils` owns reusable parsing and formatting helpers.
- `types` owns shared contracts.

## Deferred Architecture

AI summaries, scoring, learning paths, and contribution roadmaps are intentionally deferred to later phases to keep the MVP honest and shippable.

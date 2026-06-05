# API Design

## Goals

The Phase 1 API should be simple, reliable, and directly tied to contributor onboarding. It fetches only the repository signals needed for the MVP dashboard.

## Endpoints

### `POST /api/analyze`

Aggregates Phase 1 repository data.

Request body:

```json
{
  "repoUrl": "https://github.com/vercel/next.js"
}
```

Response body:

```json
{
  "repository": {},
  "languages": [],
  "readme": {},
  "issues": []
}
```

Data sources:

- `GET /repos/{owner}/{repo}`
- `GET /repos/{owner}/{repo}/languages`
- `GET /repos/{owner}/{repo}/readme`
- `GET /repos/{owner}/{repo}/issues`

### `GET /api/github?owner={owner}&repo={repo}`

Fetches raw repository metadata for debugging and incremental development.

### `GET /api/score`

Returns a planned-status placeholder because scoring is a Phase 3 feature.

## GitHub Integration Plan

1. Parse and validate GitHub URLs through `parseRepoUrl`.
2. Route all GitHub REST requests through `githubRequest`.
3. Use `GITHUB_TOKEN` when available to increase API rate limits.
4. Normalize language and issue responses before sending them to the UI.
5. Keep Phase 1 GitHub calls limited to public repository signals.

## Error Handling

- Invalid URLs return a `400` response.
- GitHub request failures return a clear JSON error.
- Missing README files degrade gracefully to `readme: null`.

## Future API Work

Future endpoints for summaries, scoring, and roadmaps should be added only when Phase 2 or Phase 3 begins.

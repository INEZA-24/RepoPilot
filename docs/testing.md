# Testing RepoPilot Before Opening a PR

Use this checklist to verify the Phase 1 MVP works before you open a pull request.

## 1. Install dependencies

```bash
npm install
```

If you are behind a corporate proxy, configure npm for your network first. A failed install means the rest of the checks will not be reliable because Next.js, React, TypeScript, and ESLint types will be missing.

## 2. Add optional GitHub credentials

RepoPilot works with public repositories without a token, but GitHub's unauthenticated rate limits are low. For reliable local testing, create `.env.local`:

```bash
GITHUB_TOKEN=ghp_your_token_here
```

The token only needs public repository read access for the Phase 1 MVP.

## 3. Run static checks

```bash
npm run typecheck
npm run lint
npm run build
```

For a single pre-PR command, run:

```bash
npm run check
```

## 4. Run the app locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), paste a public GitHub repository URL, and submit the form.

Good smoke-test repositories:

- `https://github.com/vercel/next.js`
- `https://github.com/facebook/react`
- `https://github.com/nodejs/node`

## 5. Verify the dashboard

After submitting a repository URL, confirm the `/analyze` page shows:

- Repository name and description
- Stars, forks, open issues, and default branch
- Owner, license, and last pushed date
- Language breakdown bars
- README preview or a clear missing-README empty state
- Open issue links with labels and comment counts

## 6. Verify the API directly

With the dev server running, test the analysis endpoint:

```bash
curl -s http://localhost:3000/api/analyze \
  -H 'content-type: application/json' \
  -d '{"repoUrl":"https://github.com/vercel/next.js"}' | python3 -m json.tool
```

The response should include `repository`, `languages`, `readme`, and `issues` keys.

## 7. Check error states

Try a non-GitHub URL:

```bash
curl -i http://localhost:3000/api/analyze \
  -H 'content-type: application/json' \
  -d '{"repoUrl":"https://example.com/not/a/repo"}'
```

The API should return a `400` response with a useful error message.

## 8. PR readiness checklist

Before opening a PR, make sure:

- `npm run check` passes locally.
- You tested at least one real public GitHub repository.
- Your change stays within the active Phase 1 scope.
- Documentation is updated if behavior, setup, or API shape changed.

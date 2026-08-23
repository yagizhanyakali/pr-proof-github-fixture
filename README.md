# PR Proof GitHub fixture

This private repository contains the deliberately small UAT application used to validate the PR Proof GitHub App integration.

## Deploy

Deploy this repository to Vercel or another Node-compatible host. The deployed application must expose `GET /version` and return the commit SHA currently running in UAT.

Vercel automatically provides `VERCEL_GIT_COMMIT_SHA`; the route uses that value. For another host, set `GIT_COMMIT_SHA` (or `TESTBED_COMMIT_SHA` for a local manual test) to the deployed commit SHA.

## Local development

```bash
npm install
npm run dev
```

## PR Proof mapping

Once deployed, configure the PR Proof API with this repository and its UAT URL:

```env
REPOSITORY_ENVIRONMENTS={"yagizhanyakali/pr-proof-github-fixture":{"target":"uat","targetUrl":"https://your-fixture-uat.example.com"}}
```

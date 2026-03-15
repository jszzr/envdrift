# Outreach Targets (Week 1)

Goal: submit small, high-signal PRs to repositories that recently faced `.env.example` drift issues.

## Candidate repositories

1. https://github.com/alwynpan/gap-app/issues/7
2. https://github.com/amattas/gym-app/issues/258
3. https://github.com/steilerDev/cornerstone/issues/421
4. https://github.com/aatrey56/FPL-Draft-Agent/issues/34
5. https://github.com/KeithKeepGoing/evoclaw/issues/72
6. https://github.com/Triple-Whale/mcp-server-triplewhale/issues/4

## PR strategy

Each PR should:
- add one workflow/job or one script invoking `envdrift`
- include before/after explanation in <= 6 lines
- avoid unrelated refactors

## Suggested workflow snippet

```yaml
name: envdrift
on:
  pull_request:
  push:
    branches: [main]

jobs:
  envdrift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npx envdrift . --strict
```

## PR body template

```text
This PR adds an automated env drift check to CI.

Why:
- this repo had env-template drift issues before
- drift tends to reappear during refactors

What this adds:
- a lightweight check for env keys used in source but missing in .env.example
- strict mode to also flag stale keys in .env.example

Tool: https://github.com/jszzr/envdrift
```

## Quality bar

- If the repo has no `.env.example`, open an issue instead of a PR.
- If maintainers have contribution rules, follow their template exactly.
- Never mass-submit; keep each message contextual to avoid spam.

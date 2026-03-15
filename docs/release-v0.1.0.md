# envdrift v0.1.0

`envdrift` is a single-purpose CLI that catches drift between source env usage and `.env.example`.

## What it does

- Detects keys used in source but missing in `.env.example`
- Detects stale keys left in `.env.example`
- Supports CI fail-fast with exit codes (`--strict` for unused keys)
- Supports machine-readable output via `--json`

## Why it matters

Most environment-variable bugs are discovered too late (during onboarding or runtime).  
`envdrift` moves detection to PR time.

## Quick usage

```bash
npx envdrift . --strict
```

## Included in this release

- core scanner for common JS/TS/Python env access patterns
- CLI flags (`--include`, `--exclude`, `--ext`, `--example`, `--strict`, `--json`)
- tests and CI workflow
- launch docs and promotion assets

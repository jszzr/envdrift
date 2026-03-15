# envdrift

`envdrift` is a tiny CLI that detects drift between environment variables used in source code and keys documented in `.env.example`.

[![CI](https://github.com/jszzr/envdrift/actions/workflows/ci.yml/badge.svg)](https://github.com/jszzr/envdrift/actions/workflows/ci.yml)
![GitHub stars](https://img.shields.io/github/stars/jszzr/envdrift?style=social)

It does one thing:
- Find keys used in code but missing in `.env.example`
- Find keys in `.env.example` that are no longer used in code

## Why

Config drift breaks onboarding and CI in silent ways:
- app boots locally for one person but fails for others
- stale keys remain in `.env.example` and confuse contributors
- new keys are introduced in code but never documented

`envdrift` gives you a single, fast check for this.

## Quick Start

### Run from source

```bash
git clone https://github.com/jszzr/envdrift.git
cd envdrift
node bin/envdrift.js /path/to/your/project
```

### Typical output

```text
Scanned 42 files
Example file: /repo/.env.example

Missing in .env.example (used in source):
  - API_KEY
  - DATABASE_URL

Unused in .env.example (not found in source):
  - LEGACY_TOKEN
```

Exit code behavior:
- `0`: no missing keys (unused keys allowed by default)
- `1`: missing keys found
- `1` with `--strict`: missing keys or unused keys found
- `2`: invalid arguments or runtime errors

## Usage

```bash
envdrift [root] [options]
```

Options:
- `--example <file>`: env template path relative to root (default: `.env.example`)
- `--include <dirs>`: only scan these directories (comma-separated)
- `--exclude <dirs>`: ignore these directories (comma-separated)
- `--ext <exts>`: file extensions to scan (comma-separated)
- `--strict`: fail also on unused keys
- `--json`: output JSON for CI integrations
- `-h, --help`: help

## CI Example (GitHub Actions)

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

## Supported Source Patterns

- `process.env.KEY`
- `process.env["KEY"]`
- `import.meta.env.KEY`
- `os.environ.get("KEY")` / `os.environ("KEY")`
- `getenv("KEY")`

Only uppercase keys are matched by design (`FOO_BAR`).

## Limitations

- Dynamic key access like `process.env[prefix + "_KEY"]` is not statically detectable.
- If your project uses a custom config layer, keep `.env.example` as the source of truth.

## Development

```bash
npm test
```

## License

MIT

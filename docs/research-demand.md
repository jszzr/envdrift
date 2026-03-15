# Demand Research (March 15, 2026)

Goal: find a single-purpose open-source tool idea with recurring demand and low implementation complexity.

Reproducible snapshot script:
- `scripts/research-snapshot.sh`

## 1) Problem frequency on GitHub issues

Snapshot queries (via GitHub GraphQL search, run on 2026-03-15):

| Query | Issue count |
| --- | ---: |
| `".env.example" missing in:title created:>=2025-01-01` | 372 |
| `"update .env.example" in:title created:>=2025-01-01` | 2713 |
| `"missing environment variable" in:title created:>=2025-01-01` | 1230 |

Search URLs:
- https://github.com/search?q=%22.env.example%22+missing+in%3Atitle+created%3A%3E%3D2025-01-01&type=issues
- https://github.com/search?q=%22update+.env.example%22+in%3Atitle+created%3A%3E%3D2025-01-01&type=issues
- https://github.com/search?q=%22missing+environment+variable%22+in%3Atitle+created%3A%3E%3D2025-01-01&type=issues

Recent issue examples:
- https://github.com/alwynpan/gap-app/issues/7
- https://github.com/amattas/gym-app/issues/258
- https://github.com/steilerDev/cornerstone/issues/421
- https://github.com/aatrey56/FPL-Draft-Agent/issues/34
- https://github.com/KeithKeepGoing/evoclaw/issues/72
- https://github.com/Triple-Whale/mcp-server-triplewhale/issues/4

## 2) Audience size for `.env` workflows

Package ecosystem download snapshots:

- `dotenv` (npm): 423,648,703 downloads in the last month (2026-02-12 to 2026-03-13)  
  https://api.npmjs.org/downloads/point/last-month/dotenv
- `python-dotenv` (PyPI): 404,762,965 downloads in the last month  
  https://pypistats.org/api/packages/python-dotenv/recent

Interpretation: environment-variable based configuration is a massive cross-language workflow; tooling around it has broad TAM.

## 3) Competition and gap

Known adjacent project:
- `dotenv-linter` (~2k stars): https://github.com/dotenv-linter/dotenv-linter

Gap we target:
- `dotenv-linter` focuses on linting `.env` syntax/quality
- many teams still need a dedicated drift check:
  - key used in source but absent in `.env.example`
  - stale keys left in `.env.example` after refactors

## 4) Chosen project hypothesis

Project: **envdrift**  
Single function: detect drift between source env usage and `.env.example`, fail CI early.

Why this should get stars:
- clear pain + recurring
- one-command demo value
- tiny install friction
- easy CI adoption (teams star tools they actually keep in pipelines)

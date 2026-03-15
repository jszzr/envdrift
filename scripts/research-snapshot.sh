#!/usr/bin/env bash
set -euo pipefail

echo "Demand snapshot date: $(date -u +%F)"
echo

echo "[GitHub issue counts]"
gh api graphql -f query='query($q:String!){search(query:$q,type:ISSUE,first:1){issueCount}}' -F q='".env.example" missing in:title created:>=2025-01-01'
gh api graphql -f query='query($q:String!){search(query:$q,type:ISSUE,first:1){issueCount}}' -F q='"update .env.example" in:title created:>=2025-01-01'
gh api graphql -f query='query($q:String!){search(query:$q,type:ISSUE,first:1){issueCount}}' -F q='"missing environment variable" in:title created:>=2025-01-01'
echo

echo "[npm dotenv monthly downloads]"
curl -s https://api.npmjs.org/downloads/point/last-month/dotenv
echo

echo "[PyPI python-dotenv recent downloads]"
curl -s https://pypistats.org/api/packages/python-dotenv/recent
echo

# Contributing

Thanks for contributing to `envdrift`.

## Local setup

```bash
npm test
```

## Contribution scope

Please keep contributions aligned with the project's single purpose:
- detect drift between source env usage and `.env.example`

Good contributions:
- support additional static env usage patterns
- better false-positive reduction
- CI and output UX improvements

Out of scope:
- secrets management platform integrations
- runtime env injection frameworks

## Pull requests

1. Open an issue first for non-trivial changes.
2. Add or update tests with your change.
3. Keep PR description focused on problem and behavior change.

# Contributing to astro-oembed

Thank you for your interest in contributing! Here is how to get involved.

## Reporting bugs

Open a [new issue](https://github.com/hfournier/astro-oembed/issues/new) on GitHub. Before filing, please search existing issues to avoid duplicates. Include a minimal reproduction — a URL that fails to embed, an error message, or a code snippet — so the problem can be confirmed quickly.

## Suggesting features

Open an issue describing what you would like to see and why. If you are not sure whether an idea fits the project, open a discussion first before writing any code.

## Development setup

This project uses [pnpm](https://pnpm.io/) workspaces. Node.js 18 or later is required.

```sh
# Install dependencies
pnpm install

# Run tests
pnpm test

# Start the docs dev server
pnpm --filter docs dev

# Start the demo dev server
pnpm --filter demo dev
```

## Making changes

1. Fork the repository and create a branch from `main`.
2. Make your changes inside `packages/astro-oembed/src/`.
3. Add or update tests in `packages/astro-oembed/src/*.test.ts` as appropriate.
4. Run `pnpm test` and `pnpm lint` and ensure both pass.
5. Run `pnpm format` to apply consistent formatting.

## Updating the Provider Snapshot

The bundled `providers.json` is a snapshot of the [oEmbed provider list](https://oembed.com/providers.json). To refresh it before a release:

```sh
pnpm --filter astro-oembed update-providers
```

This regenerates `packages/astro-oembed/src/data/providers.json`. Commit the result as part of your PR if providers changed.

## Submitting a pull request

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs. Before opening a PR, create a changeset describing what changed and the semver impact:

```sh
pnpm changeset
```

Commit the generated file in `.changeset/` along with your code changes, then open a pull request against `main`. The PR description should explain the motivation, any trade-offs considered, and how to verify the change manually (using the demo site or a reproduction URL).

## Project conventions

- **Language**: follow the terminology in [CONTEXT.md](CONTEXT.md) — e.g. use *Provider*, *Endpoint*, *Scheme*, *oEmbed Response*, *Placeholder*, *Poster*, and *LiteOembed* consistently.
- **No comments explaining what the code does** — well-named identifiers carry that weight. Add a comment only when the *why* would surprise a future reader.
- **No mocks in tests** — tests exercise real logic. Integration tests that need network access are skipped in CI; unit tests must be self-contained.
- **Formatting** is enforced by Prettier with `prettier-plugin-astro`. Run `pnpm format` before committing.

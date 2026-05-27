# astro-oembed

Embed any URL in your [Astro](https://astro.build/) site using the [oEmbed](https://oembed.com/) protocol. A single `<Oembed>` component resolves a URL to a provider, fetches the oEmbed response at build time, and renders the appropriate output — lazily for video and rich embeds, natively for photos and links.

## Documentation

Check out the [astro-oembed documentation](https://astro-oembed.netlify.app//) to get started.

## Project Structure

This is a pnpm monorepo. The publishable package lives under `packages/`, with a demo site and a documentation site as separate workspaces.

```
/
├── packages/
│   └── astro-oembed/               ← the npm package
│   └── astro-oembed-intergations/  ← the npm package
├── demo/                           ← Astro demo site for manual testing
└── docs/                           ← Starlight documentation site
```

## Commands

All commands are run from the root of the project:

| Command                  | Action                         |
| :----------------------- | :----------------------------- |
| `pnpm install`           | Install dependencies           |
| `pnpm test`              | Run the test suite             |
| `pnpm format`            | Format all files with Prettier |
| `pnpm lint`              | Lint source files with ESLint  |
| `pnpm --filter docs dev` | Start the docs dev server      |
| `pnpm --filter demo dev` | Start the demo dev server      |

## Contributing

Found a bug or want to improve something? See [CONTRIBUTING.md](CONTRIBUTING.md).

- Open a [new issue](https://github.com/hfournier/astro-oembed/issues/new) to report a bug or suggest a feature.
- Submit a pull request with your changes.

## Credits

This package was inpired by and borrows heavily from [Astro Embed](https://github.com/delucis/astro-embed/tree/main)

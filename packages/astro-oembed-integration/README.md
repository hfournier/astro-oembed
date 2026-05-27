# astro-oembed-integration

Astro integration that automatically converts bare oEmbed URLs in MDX files into `<Oembed>` components — no manual imports required.

When a paragraph contains only a bare URL (link text equals the URL itself) and that URL matches a known oEmbed provider, the integration replaces it with an `<Oembed url="..." />` component.

## Installation

```sh
pnpm add astro-oembed-integration
```

## Setup

Add `oembed()` to your `astro.config.mjs` **before** `mdx()`:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import oembed from 'astro-oembed-integration';

export default defineConfig({
  integrations: [
    oembed(), // must come before mdx()
    mdx(),
  ],
});
```

## Usage

In any `.mdx` file, paste a bare URL on its own line:

```mdx
## My post

https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

The integration transforms it into:

```mdx
import { Oembed as AuToImPoRtEdAstroOembed } from 'astro-oembed';

<AuToImPoRtEdAstroOembed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
```

The import is injected automatically — you don't need to add it yourself.

## Requirements

- Only works in `.mdx` files, not plain `.md` files.
- The URL must be the sole content of its paragraph (no surrounding text).
- The URL must match a provider in the [oEmbed registry](https://oembed.com/providers.json).
- `oembed()` must appear before `mdx()` in the integrations array.

## Documentation

Full documentation at [astro-oembed.netlify.app/integration](https://astro-oembed.netlify.app/integration).

## License

MIT

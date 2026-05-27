# astro-oembed

Embed any URL in your [Astro](https://astro.build/) site using the [oEmbed](https://oembed.com/) protocol. A single `<Oembed>` component resolves a URL to a provider, fetches the oEmbed response at build time, and renders the appropriate output — lazily for video and rich embeds, natively for photos and links.

## Installation

```sh
npx astro add astro-oembed
# or
pnpm add astro-oembed
```

## Usage

```astro
---
import { Oembed } from 'astro-oembed';
---

<Oembed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
```

## Props

| Prop               | Type     | Description                                                          |
| :----------------- | :------- | :------------------------------------------------------------------- |
| `url`              | `string` | **Required.** The URL to embed.                                      |
| `poster`           | `string` | Override the thumbnail image URL shown before the embed loads.       |
| `placeholderColor` | `string` | CSS color value for the placeholder background.                      |
| `maxWidth`         | `number` | Maximum width hint passed to the oEmbed provider.                    |
| `maxHeight`        | `number` | Maximum height hint passed to the oEmbed provider.                   |
| `accessToken`      | `string` | Bearer token for providers that require authentication (e.g. Flickr).|

All standard HTML `div` attributes are also accepted and forwarded to the wrapper element.

## Render behaviour

| oEmbed type | Output                                                              |
| :---------- | :------------------------------------------------------------------ |
| `video`     | `<lite-oembed>` custom element — loads the iframe on click          |
| `rich`      | `<lite-oembed>` custom element — activates script-based embeds on click |
| `photo`     | Astro `<Image>` with the provider's image URL                       |
| `link`      | Plain `<a>` with the provider's title                               |

If the URL has no matching provider or the oEmbed request fails, the component renders nothing (a warning is logged in dev mode).

## Exports

```ts
import { Oembed } from 'astro-oembed';               // component
import { fetchOembed } from 'astro-oembed';           // fetch helper
import { findEndpointUrl } from 'astro-oembed/providers'; // provider lookup
```

### `fetchOembed(url, options?)`

Fetches the oEmbed response for a URL at runtime or build time.

```ts
import { fetchOembed } from 'astro-oembed';

const data = await fetchOembed('https://www.flickr.com/photos/user/123456789', {
  maxWidth: 800,
  accessToken: import.meta.env.FLICKR_TOKEN,
});
```

### `findEndpointUrl(url)`

Returns the oEmbed endpoint URL for a given URL, or `undefined` if no provider matches.

## Documentation

Full documentation at [astro-oembed.netlify.app](https://astro-oembed.netlify.app).

## License

MIT

# Render all HTML embeds via <lite-oembed>, regardless of html field content

All oEmbed Responses with an `html` field (`video` and `rich` types) are rendered as LiteOembed — regardless of whether the `html` is an `<iframe>` or a blockquote+script embed (e.g. TikTok).

We use `(response.type === 'video' || response.type === 'rich') && 'html' in response` as the detection condition rather than `html.startsWith('<iframe')`, because script-based embeds like TikTok's blockquote+embed.js pattern also benefit from click-to-load lazy rendering. The LiteOembed `load()` method handles both: the iframe branch clones and injects the iframe with autoplay; the non-iframe branch replaces the `<lite-oembed>` element itself with the blockquote and re-injects the embed scripts.

We also chose this over checking `type === 'video'` because `rich` responses from real providers (e.g. Spotify, SoundCloud) also return iframes.

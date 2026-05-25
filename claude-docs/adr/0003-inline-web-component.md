# Define <lite-oembed> as an inline web component, not an external dependency

The `<lite-oembed>` custom element is defined in an inline `<script>` tag inside `Oembed.astro`, following the pattern established by `astro-embed`'s `<lite-vimeo>`.

We considered using `@justinribeiro/lite-oembed` but rejected it because that package re-fetches the oEmbed endpoint at runtime in the browser — we already have the iframe HTML at render time, so a second fetch is wasteful. Owning the implementation also means no runtime dependency on an external package, and the implementation is straightforward given we have all required data (`html`, `thumbnail_url`) at render time.

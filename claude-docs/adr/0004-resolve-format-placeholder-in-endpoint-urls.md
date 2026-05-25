# Substitute {format} placeholder in endpoint URLs before fetching

Some providers (e.g. Vimeo) store their endpoint URL with a literal `{format}` placeholder — `https://vimeo.com/api/oembed.{format}` — rather than a fixed path. We replace `{format}` with `json` in `buildOembedUrl` before constructing the fetch URL. We still also append `format=json` as a query parameter for providers that use a fixed URL and expect it that way.

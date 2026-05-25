import providersJson from './data/providers.json' with { type: 'json' };

interface Endpoint {
  url: string;
  schemes?: string[];
  discovery?: boolean;
}

interface Provider {
  provider_name: string;
  provider_url: string;
  endpoints: Endpoint[];
}

const providers = providersJson as Provider[];

/** Convert an oEmbed scheme wildcard pattern to a RegExp. */
export function schemeToRegExp(scheme: string): RegExp {
  const escaped = scheme
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*');
  return new RegExp(`^${escaped}$`, 'i');
}

/**
 * Find the oEmbed endpoint URL for a given content URL.
 * Returns null when no scheme matches or only discovery endpoints exist.
 */
export function findEndpointUrl(url: string): string | null {
  for (const provider of providers) {
    for (const endpoint of provider.endpoints) {
      if (!endpoint.schemes || endpoint.schemes.length === 0) continue;
      for (const scheme of endpoint.schemes) {
        if (schemeToRegExp(scheme).test(url)) {
          return endpoint.url;
        }
      }
    }
  }
  return null;
}

/**
 * Build the full oEmbed fetch URL with format and optional dimension params.
 */
export function buildOembedUrl(
  endpointUrl: string,
  contentUrl: string,
  options: { maxwidth?: number; maxheight?: number; accessToken?: string } = {}
): string {
  // Some providers use a {format} placeholder (e.g. Vimeo: oembed.{format})
  const resolvedEndpoint = endpointUrl.replace('{format}', 'json');
  const u = new URL(resolvedEndpoint);
  u.searchParams.set('url', contentUrl);
  u.searchParams.set('format', 'json');
  if (options.maxwidth != null)
    u.searchParams.set('maxwidth', String(options.maxwidth));
  if (options.maxheight != null)
    u.searchParams.set('maxheight', String(options.maxheight));
  if (options.accessToken != null)
    u.searchParams.set('access_token', options.accessToken);
  return u.toString();
}

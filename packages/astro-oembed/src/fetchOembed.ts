import { findEndpointUrl, buildOembedUrl } from './providers';
import type { OembedResponse } from './types';

export interface FetchOembedOptions {
  maxWidth?: number;
  maxHeight?: number;
  accessToken?: string;
  signal?: AbortSignal;
}

export async function fetchOembed(
  url: string,
  options: FetchOembedOptions = {}
): Promise<OembedResponse> {
  const endpointUrl = findEndpointUrl(url);
  if (!endpointUrl) {
    throw new Error(`No oEmbed provider found for ${url}`);
  }

  const { maxWidth, maxHeight, accessToken, signal } = options;
  const fetchUrl = buildOembedUrl(endpointUrl, url, {
    maxwidth: maxWidth,
    maxheight: maxHeight,
    accessToken,
  });

  const res = await fetch(fetchUrl, {
    signal: signal ?? AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    throw new Error(`oEmbed endpoint returned ${res.status} for ${url}`);
  }

  return res.json() as Promise<OembedResponse>;
}

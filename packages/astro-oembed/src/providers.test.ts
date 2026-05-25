import { describe, it, expect } from 'vitest';
import { schemeToRegExp, findEndpointUrl, buildOembedUrl } from './providers';

describe('schemeToRegExp', () => {
  it('matches a simple wildcard scheme', () => {
    const re = schemeToRegExp('https://www.youtube.com/watch*');
    expect(re.test('https://www.youtube.com/watch?v=abc123')).toBe(true);
    expect(re.test('https://www.vimeo.com/watch?v=abc123')).toBe(false);
  });

  it('is case-insensitive', () => {
    const re = schemeToRegExp('https://www.youtube.com/watch*');
    expect(re.test('HTTPS://WWW.YOUTUBE.COM/WATCH?V=abc')).toBe(true);
  });

  it('does not match a partial prefix', () => {
    const re = schemeToRegExp('https://www.youtube.com/watch*');
    expect(re.test('https://www.youtube.com/shorts/abc')).toBe(false);
  });

  it('escapes dots in the pattern', () => {
    const re = schemeToRegExp('https://www.youtube.com/watch*');
    expect(re.test('https://wwwXyoutube.com/watch?v=abc')).toBe(false);
  });
});

describe('findEndpointUrl', () => {
  it('returns a URL for a known YouTube watch URL', () => {
    const endpoint = findEndpointUrl('https://www.youtube.com/watch?v=abc123');
    expect(endpoint).not.toBeNull();
    expect(endpoint).toContain('youtube');
  });

  it('returns null for an unrecognized URL', () => {
    expect(findEndpointUrl('https://example.com/not-a-provider')).toBeNull();
  });
});

describe('buildOembedUrl', () => {
  it('includes url and format=json', () => {
    const result = buildOembedUrl(
      'https://www.youtube.com/oembed',
      'https://www.youtube.com/watch?v=abc'
    );
    const u = new URL(result);
    expect(u.searchParams.get('url')).toBe(
      'https://www.youtube.com/watch?v=abc'
    );
    expect(u.searchParams.get('format')).toBe('json');
  });

  it('appends maxwidth and maxheight when provided', () => {
    const result = buildOembedUrl(
      'https://www.youtube.com/oembed',
      'https://www.youtube.com/watch?v=abc',
      { maxwidth: 800, maxheight: 450 }
    );
    const u = new URL(result);
    expect(u.searchParams.get('maxwidth')).toBe('800');
    expect(u.searchParams.get('maxheight')).toBe('450');
  });

  it('substitutes {format} placeholder in the endpoint URL', () => {
    const result = buildOembedUrl(
      'https://vimeo.com/api/oembed.{format}',
      'https://vimeo.com/1094756949'
    );
    expect(result).toContain('oembed.json');
    expect(result).not.toContain('{format}');
  });

  it('omits maxwidth/maxheight when not provided', () => {
    const result = buildOembedUrl(
      'https://www.youtube.com/oembed',
      'https://www.youtube.com/watch?v=abc'
    );
    const u = new URL(result);
    expect(u.searchParams.has('maxwidth')).toBe(false);
    expect(u.searchParams.has('maxheight')).toBe(false);
  });

  it('appends access_token when accessToken is provided', () => {
    const result = buildOembedUrl(
      'https://graph.facebook.com/v23.0/oembed_video',
      'https://www.facebook.com/video/1234',
      { accessToken: 'myappid|myclienttoken' }
    );
    const u = new URL(result);
    expect(u.searchParams.get('access_token')).toBe('myappid|myclienttoken');
  });

  it('omits access_token when accessToken is not provided', () => {
    const result = buildOembedUrl(
      'https://www.youtube.com/oembed',
      'https://www.youtube.com/watch?v=abc'
    );
    const u = new URL(result);
    expect(u.searchParams.has('access_token')).toBe(false);
  });
});

export interface OembedBase {
  version: '1.0';
  title?: string;
  author_name?: string;
  author_url?: string;
  provider_name?: string;
  provider_url?: string;
  cache_age?: number | string;
  thumbnail_url?: string;
  thumbnail_width?: number;
  thumbnail_height?: number;
  [key: string]: unknown;
}

export interface OembedPhoto extends OembedBase {
  type: 'photo';
  url: string;
  width: number;
  height: number;
}

export interface OembedVideo extends OembedBase {
  type: 'video';
  html: string;
  width: number | string;
  height: number | string;
}

export interface OembedRich extends OembedBase {
  type: 'rich';
  html: string;
  width: number | string;
  height: number | string;
}

export interface OembedLink extends OembedBase {
  type: 'link';
}

export type OembedResponse =
  | OembedPhoto
  | OembedVideo
  | OembedRich
  | OembedLink;

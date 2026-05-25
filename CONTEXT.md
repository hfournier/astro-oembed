# astro-oembed

An Astro component library that embeds arbitrary URLs using the oEmbed protocol. The primary interface is a single `<Oembed>` component that resolves a URL to a Provider, fetches the oEmbed Response, and renders the appropriate output.

## Language

**Provider**:
A service (e.g. YouTube, Vimeo) described in the Provider Snapshot. Has one or more Endpoints.
_Avoid_: service, site, platform

**Endpoint**:
A URL template belonging to a Provider, used to fetch an oEmbed Response. Has optional Schemes; without them it is a discovery endpoint (unsupported in v1).
_Avoid_: API, endpoint URL

**Scheme**:
A wildcard URL pattern (e.g. `https://www.youtube.com/watch*`) belonging to an Endpoint. Matched against the `url` prop using glob-style `*` expansion.
_Avoid_: pattern, glob, matcher

**Provider Snapshot**:
The bundled copy of `providers.json` stored at `src/data/providers.json`. Updated manually via `npm run update-providers` before each release.
_Avoid_: providers list, registry

**oEmbed Response**:
The JSON payload returned by a Provider's Endpoint. Has a `type` of `video`, `rich`, `photo`, or `link`.
_Avoid_: API response, embed data

**Iframe Response**:
An oEmbed Response whose `html` field begins with `<iframe`. Detected by inspecting the `html` content, not the `type` field — because both `video` and `rich` responses can return iframes.
_Avoid_: video response (ambiguous)

**LiteOembed**:
The `<lite-oembed>` custom HTML element defined inline in `Oembed.astro`. Renders a Placeholder and replaces it with the iframe HTML on click.
_Avoid_: lazy embed, deferred iframe

**Placeholder**:
The pre-click visual state of LiteOembed. Displays a Poster and a play button.
_Avoid_: thumbnail, preview, cover

**Poster**:
The background image for the Placeholder. Resolved in priority order: `poster` prop → `thumbnail_url` from the oEmbed Response → a solid rectangle using `placeholderColor`.
_Avoid_: thumbnail (overloaded with oEmbed's `thumbnail_url` field)

## Relationships

- A **Provider** has one or more **Endpoints**
- An **Endpoint** has zero or more **Schemes**; an Endpoint with no Schemes is a discovery endpoint (skipped in v1)
- A **Scheme** is matched against the `url` prop to identify the correct **Endpoint**
- An **Endpoint** URL is called with `url`, `format=json`, and optional `maxwidth`/`maxheight` to fetch an **oEmbed Response**
- An **oEmbed Response** whose `html` field begins with `<iframe` is an **Iframe Response**
- An **Iframe Response** is rendered as a **LiteOembed** element

## TypeScript types

oEmbed Responses are modelled as a discriminated union on `type`. A shared base captures the optional fields common to all types, plus an index signature for provider-specific extensions:

```ts
interface OembedBase {
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
  [key: string]: unknown; // provider-specific extensions (oEmbed spec §2.3.4)
}

interface OembedPhoto extends OembedBase {
  type: 'photo';
  url: string;
  width: number;
  height: number;
}
interface OembedVideo extends OembedBase {
  type: 'video';
  html: string;
  width: number;
  height: number;
}
interface OembedRich extends OembedBase {
  type: 'rich';
  html: string;
  width: number;
  height: number;
}
interface OembedLink extends OembedBase {
  type: 'link';
}

type OembedResponse = OembedPhoto | OembedVideo | OembedRich | OembedLink;
```

All four member types plus `OembedResponse` and `OembedBase` are exported from `src/index.ts`, along with the `fetchOembed` utility function and its `FetchOembedOptions` type.

## Styling

LiteOembed styles live in `src/Oembed.css`, imported at the top of `Oembed.astro` (same pattern as `astro-embed`'s `Vimeo.css`). The `<lite-oembed>` element receives an inline `aspect-ratio` style derived from the oEmbed Response's `width` and `height` fields, falling back to `16 / 9` when absent.

## Tooling

| Tool       | Config file         | Notes                                                                                      |
| ---------- | ------------------- | ------------------------------------------------------------------------------------------ |
| Prettier   | `.prettierrc.cjs`   | `prettier-plugin-astro` for `.astro` files                                                 |
| ESLint     | `eslint.config.mjs` | Flat config; `@typescript-eslint` + `eslint-plugin-prettier`                               |
| Vitest     | `vitest.config.ts`  | Used if/when tests are added; replaces `uvu` from `astro-embed`                            |
| Changesets | `.changeset/`       | Semver bumps + changelog; `pnpm changeset` per PR, `pnpm changeset version` before release |
| TypeScript | `tsconfig.json`     | Extends `astro/tsconfigs/strict`                                                           |

ESLint rules: `no-console` allows `warn`/`error` only; `@typescript-eslint/no-explicit-any` is a warning; `no-undef` is disabled (TypeScript catches undefined references; the rule produces false positives for built-in web globals). Only `.ts` files are linted — `.astro` files are excluded because the TypeScript parser cannot handle Astro frontmatter syntax.

## Repo structure

Managed with **pnpm workspaces**. `demo` and `docs` reference the local package via `"astro-oembed": "workspace:*"`.

```
/
├── .changeset/            ← per-PR changeset descriptions
├── claude-docs/adr/       ← architecture decision records
├── demo/                  ← Astro empty-starter demo site (workspace)
├── docs/                  ← Starlight documentation site (workspace)
├── packages/
│   └── astro-oembed/
│       ├── scripts/
│       │   └── update-providers.mjs
│       ├── src/
│       │   ├── data/
│       │   │   └── providers.json ← Provider Snapshot
│       │   ├── Oembed.astro
│       │   ├── Oembed.css
│       │   ├── fetchOembed.ts    ← fetchOembed() utility + FetchOembedOptions
│       │   ├── index.ts
│       │   ├── providers.ts
│       │   ├── sizing.ts
│       │   └── types.ts
│       ├── package.json
│       └── tsconfig.json
├── .prettierrc.cjs
├── .prettierignore
├── CONTEXT.md
├── eslint.config.mjs
├── package.json           ← root workspace package
└── pnpm-workspace.yaml
```

## Rendering by response type

| oEmbed type              | html field | Rendered as                                                  |
| ------------------------ | ---------- | ------------------------------------------------------------ |
| `video` or `rich`        | any HTML   | **LiteOembed** (`<lite-oembed>`)                             |
| `photo`                  | —          | Astro `<Image />` (requires remote domain in `astro.config`) |
| `link`                   | —          | `<a href={originalUrl}>{title ?? originalUrl}</a>`           |
| no match / fetch failure | —          | nothing (+ `console.warn` in dev)                            |

## Component props

`<Oembed>` accepts:

| Prop               | Type             | Required | Description                                                                                |
| ------------------ | ---------------- | -------- | ------------------------------------------------------------------------------------------ |
| `url`              | `string`         | yes      | The URL to embed                                                                           |
| `poster`           | `string`         | no       | Override image for the LiteOembed Placeholder                                              |
| `placeholderColor` | `string`         | no       | Fallback background color when no Poster is available                                      |
| `maxWidth`         | `number`         | no       | Forwarded to the oEmbed Endpoint as a query param                                          |
| `maxHeight`        | `number`         | no       | Forwarded to the oEmbed Endpoint as a query param                                          |
| `accessToken`      | `string`         | no       | Forwarded as `access_token` to providers that require authentication (e.g. Meta Graph API) |
| `...attrs`         | `HTMLAttributes` | no       | Spread onto the outermost rendered element                                                 |

## Example dialogue

> **Dev:** "What happens when a `rich` response comes back with an `<iframe>`?"
> **Domain expert:** "That's an Iframe Response — same as a `video`. Both go through LiteOembed."
>
> **Dev:** "And if there's no thumbnail from the provider?"
> **Domain expert:** "LiteOembed renders the Placeholder using `placeholderColor` as a solid background — no image, but never blank."

## Flagged ambiguities

- "thumbnail" was used to mean both the oEmbed spec's `thumbnail_url` field and the Placeholder background image — resolved: use **Poster** for the latter.
- `type === 'video'` was considered as the iframe detection condition — resolved: use **Iframe Response** (html content check) instead, because `rich` responses can also return iframes.

// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import oembed from 'astro-oembed-integration';

// https://astro.build/config
export default defineConfig({
  vite: {
    server: {
      fs: {
        // Allow importing files from the monorepo root (e.g. packages/astro-oembed/src/data/providers.json)
        allow: ['..'],
      },
    },
  },
  integrations: [
    ...oembed(),
    starlight({
      title: 'astro-oembed',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/hfournier/astro-oembed',
        },
      ],
      sidebar: [
        'getting-started',
        {
          label: 'Components',
          items: [{ autogenerate: { directory: 'components' } }],
        },
        {
          label: 'Integrations',
          items: [{ autogenerate: { directory: 'integrations' } }],
        },
        {
          label: 'Reference',
          items: [{ autogenerate: { directory: 'reference' } }],
        },
      ],
    }),
  ],
});
